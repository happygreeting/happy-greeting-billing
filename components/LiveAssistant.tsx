import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, X } from 'lucide-react';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../services/audioUtils';

interface LiveAssistantProps {
  apiKey: string;
}

export const LiveAssistant: React.FC<LiveAssistantProps> = ({ apiKey }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanup = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setIsConnected(false);
    setIsTalking(false);
  };

  const connectToGemini = async () => {
    try {
      setError(null);
      const ai = new GoogleGenAI({ apiKey });
      
      // Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 24000 }); // Output rate
      audioContextRef.current = audioCtx;
      
      const inputCtx = new AudioContextClass({ sampleRate: 16000 }); // Input rate

      // Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Connect to Gemini Live
      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
          },
          systemInstruction: "You are a helpful billing assistant for a small business called 'Happy Greeting'. You help the user manage invoices, calculate totals, and answer questions about business trends. Keep answers concise.",
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setIsConnected(true);
            
            // Setup Input Streaming
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const blob = createPcmBlob(inputData);
              sessionPromiseRef.current?.then(session => {
                session.sendRealtimeInput({ media: blob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
            
            inputSourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const serverContent = msg.serverContent;
            
            if (serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              setIsTalking(true);
              const base64Audio = serverContent.modelTurn.parts[0].inlineData.data;
              const audioData = base64ToUint8Array(base64Audio);
              
              if (audioContextRef.current) {
                 // Ensure smooth playback time
                nextStartTimeRef.current = Math.max(
                    nextStartTimeRef.current,
                    audioContextRef.current.currentTime
                );

                const audioBuffer = await decodeAudioData(
                  audioData,
                  audioContextRef.current,
                  24000,
                  1
                );

                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                
                source.onended = () => {
                   sourcesRef.current.delete(source);
                   if (sourcesRef.current.size === 0) setIsTalking(false);
                };

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }
            }

            if (serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsTalking(false);
            }
          },
          onclose: () => {
            console.log("Gemini Live Closed");
            cleanup();
          },
          onerror: (e) => {
            console.error("Gemini Live Error", e);
            setError("Connection error. Please try again.");
            cleanup();
          }
        }
      });

    } catch (err) {
      console.error(err);
      setError("Failed to access microphone or connect.");
      cleanup();
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  if (!apiKey) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 print:hidden">
      {error && (
        <div className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm mb-2 shadow-sm border border-red-200">
            {error}
        </div>
      )}
      
      <button
        onClick={isConnected ? cleanup : connectToGemini}
        className={`
          flex items-center gap-2 px-5 py-3 rounded-full shadow-lg font-medium transition-all
          ${isConnected 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-brand-blue hover:bg-blue-600 text-white'
          }
        `}
      >
        {isConnected ? (
          <>
            <MicOff size={20} />
            {isTalking ? 'Assistant Speaking...' : 'Listening...'}
          </>
        ) : (
          <>
            <Mic size={20} />
            Ask Assistant
          </>
        )}
      </button>
    </div>
  );
};