import React, { useState } from 'react';
import { UserInfo } from '../services/localEngine';
import { Heart, Sparkles, Calendar, User, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface CompatibilityFormProps {
  onSubmit: (user1: UserInfo, user2: UserInfo) => void;
  isLoading: boolean;
}

const MBTI_OPTIONS = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

export const CompatibilityForm: React.FC<CompatibilityFormProps> = ({ onSubmit, isLoading }) => {
  const [user1, setUser1] = useState<UserInfo>({ nickname: '', gender: '남성', birthdate: '', mbti: 'ENFP' });
  const [user2, setUser2] = useState<UserInfo>({ nickname: '', gender: '여성', birthdate: '', mbti: 'INTJ' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(user1, user2);
  };

  const renderUserInput = (user: UserInfo, setUser: React.Dispatch<React.SetStateAction<UserInfo>>, title: string) => (
    <div className="space-y-6 p-8 bg-white brutal-border">
      <h3 className="text-2xl font-display flex items-center gap-2">
        <Zap className="w-6 h-6 text-neon fill-brutal-black" />
        {title}
      </h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold uppercase mb-2">Nickname</label>
          <input
            type="text"
            value={user.nickname}
            onChange={(e) => setUser({ ...user, nickname: e.target.value })}
            className="w-full px-4 py-3 bg-white border-2 border-brutal-black focus:bg-neon focus:outline-none transition-colors font-mono font-bold"
            placeholder="WHO ARE YOU?"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Gender</label>
            <select
              value={user.gender}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-brutal-black focus:bg-neon focus:outline-none transition-colors font-mono font-bold appearance-none"
            >
              <option>남성</option>
              <option>여성</option>
              <option>기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">MBTI</label>
            <select
              value={user.mbti}
              onChange={(e) => setUser({ ...user, mbti: e.target.value })}
              className="w-full px-4 py-3 bg-white border-2 border-brutal-black focus:bg-neon focus:outline-none transition-colors font-mono font-bold appearance-none"
            >
              {MBTI_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase mb-2">Birthdate</label>
          <input
            type="date"
            value={user.birthdate}
            onChange={(e) => setUser({ ...user, birthdate: e.target.value })}
            className="w-full px-4 py-3 bg-white border-2 border-brutal-black focus:bg-neon focus:outline-none transition-colors font-mono font-bold"
            required
          />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-8">
      <div className="space-y-8">
        {renderUserInput(user1, setUser1, "ME")}
        {renderUserInput(user2, setUser2, "SOMEBODY")}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        className="w-full py-6 bg-brutal-black text-white font-display text-3xl brutal-border-hover flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-8 h-8 border-4 border-neon border-t-transparent rounded-full animate-spin" />
            ANALYZING...
          </>
        ) : (
          <>
            <Sparkles className="w-8 h-8 text-neon" />
            GET RESULTS
            <ChevronRight className="w-8 h-8" />
          </>
        )}
      </motion.button>
    </form>
  );
};
