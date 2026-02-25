import { useState, useEffect } from 'react';
import { CompatibilityForm } from './components/CompatibilityForm';
import { CompatibilityResult } from './components/CompatibilityResult';
import { analyzeLocally, UserInfo } from './services/localEngine';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle shared links
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const id = path.split('/').pop();

    if (hash.startsWith('#share=')) {
      try {
        const encodedData = hash.replace('#share=', '');
        const decodedData = JSON.parse(decodeURIComponent(atob(encodedData)));
        setResult(decodedData.analysis);
      } catch (err) {
        console.error('Failed to decode share link', err);
      }
    } else if (id && id.length > 20) { // Simple check for UUID
      fetchResult(id);
    }
  }, []);

  const fetchResult = async (id: string) => {
    // API results are disabled for static hosting.
    // Hash-based results will be handled by the useEffect above.
    console.warn('Backend API results are disabled on static hosting.', id);
  };

  const handleAnalyze = async (user1: UserInfo, user2: UserInfo) => {
    setIsLoading(true);
    setError(null);

    // Simulate a short delay for "analysis feel"
    setTimeout(async () => {
      try {
        const analysis = analyzeLocally(user1, user2);

        // Encode data in URL hash for static hosting (GitHub Pages)
        // This is the most reliable way for GitHub Pages as it doesn't require a server
        const data = btoa(encodeURIComponent(JSON.stringify({ analysis, user1, user2 })));
        window.location.hash = `share=${data}`;

        setResult(analysis);
      } catch (err) {
        console.error(err);
        setError('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-16 px-6 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-neon text-brutal-black brutal-border font-display text-lg"
        >
          <Sparkles className="w-5 h-5 fill-brutal-black" />
          PREMIUM COMPATIBILITY
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-9xl font-display leading-none text-brutal-black"
        >
          궁합 <span className="bg-neon px-4">컨설턴트</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-brutal-black max-w-lg mx-auto text-xl font-bold uppercase tracking-tight"
        >
          MBTI 심리학 X 사주명리학<br />
          <span className="text-sm font-mono bg-brutal-black text-white px-2 py-1">EST. 2026 // DESTINY ANALYZER</span>
        </motion.p>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 pb-24 max-w-md">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-md mx-auto mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CompatibilityForm onSubmit={handleAnalyze} isLoading={isLoading} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CompatibilityResult result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t-4 border-brutal-black bg-neon text-brutal-black text-center">
        <p className="font-display text-xl">
          &copy; 2026 DESTINY ANALYZER // ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
}
