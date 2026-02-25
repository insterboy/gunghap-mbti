import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Share2, RefreshCw, Heart, Camera, Download, Star, Crown } from 'lucide-react';
import { motion } from 'motion/react';
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
      console.error('Copy failed', err);
    }
  };

  const handleCapture = async () => {
    if (!resultRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 3, // High quality for sharing
        logging: false,
        useCORS: true,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `DESTINY-RESULT-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Capture failed', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <div
        ref={resultRef}
        className="bg-white border-8 border-brutal-black p-6 md:p-10 relative overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Decorative corner tags */}
        <div className="absolute top-0 right-0 bg-brutal-black text-neon px-4 py-1 font-black text-[10px] uppercase tracking-widest">
          Authentic Analysis
        </div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-10 border-b-4 border-brutal-black pb-6">
            <div className="bg-neon p-3 border-4 border-brutal-black">
              <Star className="w-8 h-8 fill-brutal-black" />
            </div>
            <div>
              <h2 className="text-4xl font-display uppercase leading-none">Result Report</h2>
              <p className="font-mono text-[10px] font-black opacity-50 uppercase mt-1">Serial No. #XYZ-2026</p>
            </div>
          </div>

          <div className="markdown-body prose prose-stone max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t-8 border-double border-brutal-black flex justify-between items-center">
            <div className="font-display text-3xl italic tracking-tighter">PERFECT SYNC</div>
            <div className="flex gap-2">
              <Heart className="w-8 h-8 text-brutal-black fill-neon" />
              <Crown className="w-8 h-8 text-brutal-black fill-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-2">
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className="group relative flex items-center justify-center gap-4 py-6 bg-brutal-black text-white brutal-border-hover disabled:opacity-50"
        >
          {isCapturing ? (
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Camera className="w-8 h-8 text-neon" />
              <span className="font-display text-3xl uppercase">결과 이미지 저장</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-3 py-5 bg-neon border-4 border-brutal-black font-black uppercase text-sm brutal-border-hover"
          >
            {copied ? <Download className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            {copied ? 'COPIED!' : 'LINK COPY'}
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center gap-3 py-5 bg-white border-4 border-brutal-black font-black uppercase text-sm brutal-border-hover"
          >
            <RefreshCw className="w-5 h-5" />
            RETRY
          </button>
        </div>
      </div>

      <div className="text-center font-mono text-[10px] font-black opacity-30 mt-8">
        CAPTURED BY DESTINY.AI // NO SERVER LOGS SAVED
      </div>
    </div>
  );
};
