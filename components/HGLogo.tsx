import React from 'react';

export const HGLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl', showText?: boolean, customLogo?: string }> = ({ size = 'md', showText = true, customLogo }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xl',
    md: 'w-12 h-12 text-3xl',
    lg: 'w-24 h-24 text-6xl',
    xl: 'w-32 h-32 text-8xl',
  };

  const containerSize = sizeClasses[size];

  // If custom logo exists, render image
  if (customLogo) {
      return (
          <div className="flex flex-col items-center justify-center">
             <div className={`relative ${containerSize} flex items-center justify-center overflow-hidden`}>
                 <img src={customLogo} alt="Logo" className="w-full h-full object-contain" />
             </div>
             {showText && (
                <div className="text-center mt-1">
                    <div className={`font-black uppercase tracking-[0.2em] text-cyan-500 ${size === 'sm' ? 'text-[8px]' : 'text-sm'}`}
                        style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                        Happy Greeting
                    </div>
                </div>
            )}
          </div>
      );
  }

  // Fallback CSS Logo
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${containerSize} flex items-center justify-center font-black logo-font`}>
          <span className="absolute left-0 z-10 text-cyan-400" 
                style={{ 
                    textShadow: '3px 3px 0px #0ea5e9',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                }}>H</span>
          <span className="absolute right-0 z-20 text-cyan-400" 
                style={{ 
                    marginLeft: '0.4em',
                    textShadow: '3px 3px 0px #0ea5e9',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                }}>G</span>
      </div>
      
      {showText && (
          <div className="text-center mt-1">
            <div className={`font-black uppercase tracking-[0.2em] text-cyan-500 ${size === 'sm' ? 'text-[8px]' : 'text-sm'}`}
                 style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                Happy Greeting
            </div>
          </div>
      )}
    </div>
  );
};