import { useState, useEffect } from 'react';
import { CompatibilityForm } from './components/CompatibilityForm';
import { CompatibilityResult } from './components/CompatibilityResult';
import { analyzeLocally, UserInfo } from './services/localEngine';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Smartphone } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const encodedData = hash.replace('#share=', '');
        const decodedData = JSON.parse(decodeURIComponent(atob(encodedData)));
        setResult(decodedData.analysis);
      } catch (err) {
        console.error('Share link decode error', err);
      }
    }
  }, []);

  const handleAnalyze = async (user1: UserInfo, user2: UserInfo) => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      try {
        const analysis = analyzeLocally(user1, user2);
        const data = btoa(encodeURIComponent(JSON.stringify({ analysis, user1, user2 })));
        window.location.hash = `share=${data}`;
        setResult(analysis);
      } catch (err) {
        setError('분석 오류! 다시 시도해봐.');
      } finally {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 1500);
  };

  const handleReset = () => {
    setResult(null);
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen bg-white text-brutal-black font-sans selection:bg-neon overflow-x-hidden">
      {/* Background Ornaments */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] -left-10 w-40 h-40 border-4 border-brutal-black rotate-12 bg-neon/10" />
        <div className="absolute bottom-[10%] -right-10 w-60 h-60 border-8 border-neon rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-2 bg-brutal-black/5 -rotate-45" />
      </div>

      <header className="relative z-10 pt-16 pb-12 px-6 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-block bg-brutal-black text-neon px-4 py-1 mb-8 font-display text-sm tracking-[0.2em] uppercase brutal-border"
        >
          2026 DESTINY VER.
        </motion.div>

        <h1 className="text-7xl md:text-9xl font-display leading-[0.7] mb-6 tracking-tighter">
          궁합 <br />
          <span className="bg-neon px-3 inline-block -rotate-2 brutal-border mt-2">컨설턴트</span>
        </h1>

        <p className="font-mono text-[10px] font-black uppercase tracking-widest opacity-40">
          MBTI Psychology x Saju Mythology // Fully Static & Private
        </p>
      </header>

      <main className="relative z-10 container mx-auto px-4 pb-32 max-w-lg">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500 text-white p-4 brutal-border mb-8 font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <div className="flex justify-center mb-8">
                <div className="bg-brutal-black text-white px-4 py-2 brutal-border flex items-center gap-3 font-black text-sm">
                  <Smartphone className="w-5 h-5 text-neon" />
                  MOBILE-FIRST UI
                </div>
              </div>
              <CompatibilityForm onSubmit={handleAnalyze} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
            >
              <CompatibilityResult result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action/Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full p-6 bg-white border-t-8 border-brutal-black z-50 flex justify-between items-center">
        <div className="font-display text-2xl tracking-tighter">DESTINY.AI</div>
        <div className="flex gap-6">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} >
            <Zap className="w-8 h-8 fill-neon" />
          </motion.div>
          <Sparkles className="w-8 h-8 fill-brutal-black" />
        </div>
      </footer>
    </div>
  );
}
