import React, { useState } from 'react';
import { HGLogo } from './HGLogo';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface Props {
  users: User[];
  onLogin: (user: User) => void;
}

export const Login: React.FC<Props> = ({ users, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find matching user
    const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
        onLogin(foundUser);
    } else {
        setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <HGLogo size="lg" showText={true} />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-8">Sign in to manage your billing & inventory</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors outline-none"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-colors outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand-cyan hover:bg-cyan-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02]"
            >
              Sign In <ArrowRight size={20} />
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
           Happy Greeting Billing Software v1.0
        </div>
      </div>
    </div>
  );
};