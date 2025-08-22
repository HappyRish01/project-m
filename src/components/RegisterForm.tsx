'use client';

import { useState , useEffect} from 'react';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(email,password, username);
      
      setEmail("");
  setUsername("");
  setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      {isMounted && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 
                     bg-white border border-gray-300 shadow-[0_10px_40px_rgba(0,0,0,0.3)]
                     rounded-2xl px-6 sm:px-8 md:px-10 
                     py-14 sm:py-16 min-h-[600px] 
                     flex flex-col justify-center transition-all duration-300"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-black mb-6">
            Register Employee
          </h2>

          {error && (
            <motion.p
              animate={{ x: [0, -5, 5, -5, 0] }}
              className="text-center text-red-500 text-sm mb-4"
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <motion.input
                id="username"
                type="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                whileFocus={{ scale: 1.01 }}
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm placeholder-gray-400 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <motion.input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                whileFocus={{ scale: 1.01 }}
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm placeholder-gray-400 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <motion.input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                whileFocus={{ scale: 1.01 }}
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm placeholder-gray-400 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
              type="submit"
              className="w-full py-3 text-sm rounded-md bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-60"
            >
              {isLoading ? 'Loading...' : 'Create Employee'}
            </motion.button>
          </form>

      
        </motion.div>
      )}
    </div>
  )
}