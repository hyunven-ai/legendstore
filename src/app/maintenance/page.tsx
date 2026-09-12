'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock, AlertTriangle } from 'lucide-react';

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Current time in WIB
      const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      
      // Target time: 05:00:00 WIB today
      const targetTime = new Date(wibTime);
      targetTime.setUTCHours(5, 0, 0, 0);
      
      // If we're past 05:00 WIB, the target is 05:00 WIB tomorrow
      if (wibTime.getUTCHours() >= 5) {
        targetTime.setUTCDate(targetTime.getUTCDate() + 1);
      }

      const diff = targetTime.getTime() - wibTime.getTime();

      if (diff <= 0 && wibTime.getUTCHours() !== 4) {
         // Auto-redirect if outside maintenance hour
         window.location.href = '/';
         return;
      }

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-white overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center max-w-2xl"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="mb-8 p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20"
        >
          <Settings className="w-12 h-12 text-indigo-400" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
          Pembaruan Sistem Harian
        </h1>
        
        <p className="text-neutral-400 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
          Website sedang dalam tahap pemeliharaan rutin untuk menjaga stabilitas dan kecepatan (04:00 - 05:00 WIB).
        </p>

        <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-6 text-neutral-300">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span className="font-medium text-sm tracking-widest uppercase">Estimasi Selesai pada 05:00 WIB</span>
          </div>

          <div className="flex justify-center gap-4 text-center">
            {timeLeft ? (
              <>
                <div className="flex flex-col gap-1">
                  <div className="w-20 h-24 bg-neutral-800/50 rounded-xl border border-neutral-700/50 flex items-center justify-center text-4xl font-light tabular-nums">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-neutral-500 font-medium tracking-wider uppercase">Menit</span>
                </div>
                <div className="text-4xl font-light text-neutral-600 mt-6">:</div>
                <div className="flex flex-col gap-1">
                  <div className="w-20 h-24 bg-neutral-800/50 rounded-xl border border-neutral-700/50 flex items-center justify-center text-4xl font-light tabular-nums">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <span className="text-xs text-neutral-500 font-medium tracking-wider uppercase">Detik</span>
                </div>
              </>
            ) : (
              <div className="h-24 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex items-center gap-3 text-neutral-500 bg-neutral-900/50 py-3 px-5 rounded-full border border-neutral-800/50">
          <AlertTriangle className="w-5 h-5 text-amber-500/80" />
          <span className="text-sm">Halaman akan memuat ulang secara otomatis ketika selesai.</span>
        </div>
      </motion.div>
    </div>
  );
}
