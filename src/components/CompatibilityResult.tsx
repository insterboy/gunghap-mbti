import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Share2, Copy, Check, RefreshCw, Heart, Download, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';

interface CompatibilityResultProps {
  result: string;
  onReset: () => void;
}

export const CompatibilityResult: React.FC<CompatibilityResultProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleCapture = async () => {
    if (!resultRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `compatibility-result-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Capture failed!', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <div 
        ref={resultRef}
        className="bg-white brutal-border p-8 md:p-12 relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon border-l-2 border-b-2 border-brutal-black -mr-16 -mt-16 rotate-45" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon border-t-2 border-r-2 border-brutal-black -ml-12 -mb-12 rotate-45" />

        <div className="relative">
          <div className="flex justify-between items-start mb-12">
            <div className="bg-brutal-black text-neon px-4 py-2 font-display text-xl">
              TOP SECRET ANALYSIS
            </div>
            <div className="font-mono text-xs font-bold uppercase">
              ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </div>
          </div>

          <div className="markdown-body prose prose-stone max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t-2 border-dashed border-brutal-black flex justify-between items-center">
            <div className="font-display text-2xl">COMPATIBILITY COMPLETE</div>
            <Heart className="w-8 h-8 text-brutal-black fill-neon" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white brutal-border brutal-border-hover font-bold uppercase text-sm"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Share2 className="w-5 h-5" />
              <span>COPY LINK</span>
            </>
          )}
        </button>

        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-neon brutal-border brutal-border-hover font-bold uppercase text-sm disabled:opacity-50"
        >
          {isCapturing ? (
            <div className="w-5 h-5 border-2 border-brutal-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
          <span>{isCapturing ? 'CAPTURING...' : 'SAVE IMAGE'}</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-brutal-black text-white brutal-border brutal-border-hover font-bold uppercase text-sm"
        >
          <RefreshCw className="w-5 h-5" />
          <span>RETRY</span>
        </button>
      </div>
    </motion.div>
  );
};
