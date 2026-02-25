import React, { useState } from 'react';
import { UserInfo } from '../services/localEngine';
import { Sparkles, ChevronRight, Zap, Target, User2, UserCheck } from 'lucide-react';
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

interface UserFormState extends UserInfo {
  year: string;
  month: string;
  day: string;
}

export const CompatibilityForm: React.FC<CompatibilityFormProps> = ({ onSubmit, isLoading }) => {
  const [user1, setUser1] = useState<UserFormState>({ nickname: '', gender: '남성', birthdate: '', mbti: 'ENFP', year: '2000', month: '01', day: '01' });
  const [user2, setUser2] = useState<UserFormState>({ nickname: '', gender: '여성', birthdate: '', mbti: 'INFJ', year: '2000', month: '01', day: '01' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u1: UserInfo = { ...user1, birthdate: `${user1.year}-${user1.month.padStart(2, '0')}-${user1.day.padStart(2, '0')}` };
    const u2: UserInfo = { ...user2, birthdate: `${user2.year}-${user2.month.padStart(2, '0')}-${user2.day.padStart(2, '0')}` };
    onSubmit(u1, u2);
  };

  const renderUserInput = (user: UserFormState, setUser: React.Dispatch<React.SetStateAction<UserFormState>>, title: string, isMe: boolean) => (
    <div className={`p-6 border-4 border-brutal-black ${isMe ? 'bg-white' : 'bg-brutal-black text-white'} relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 p-2 ${isMe ? 'bg-neon text-brutal-black' : 'bg-white text-brutal-black'} font-black text-[10px]`}>
        {isMe ? 'PERSON_01' : 'PERSON_02'}
      </div>

      <h3 className="text-3xl font-display mb-8 flex items-center gap-3">
        {isMe ? <User2 className="w-8 h-8" /> : <UserCheck className="w-8 h-8" />}
        {title}
      </h3>

      <div className="space-y-6">
        <div>
          <label className={`block text-[10px] font-black uppercase mb-2 ${isMe ? 'text-gray-500' : 'text-gray-400'}`}>Nickname</label>
          <input
            type="text"
            value={user.nickname}
            onChange={(e) => setUser({ ...user, nickname: e.target.value })}
            className={`w-full px-4 py-4 border-2 border-brutal-black focus:outline-none focus:ring-4 focus:ring-neon font-bold text-lg bg-white text-brutal-black`}
            placeholder="이름이 뭐야?"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-[10px] font-black uppercase mb-2 ${isMe ? 'text-gray-500' : 'text-gray-400'}`}>MBTI</label>
            <select
              value={user.mbti}
              onChange={(e) => setUser({ ...user, mbti: e.target.value })}
              className={`w-full px-4 py-4 border-2 border-brutal-black focus:outline-none focus:ring-4 focus:ring-neon font-bold text-lg bg-white text-brutal-black appearance-none rounded-none`}
            >
              {MBTI_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={`block text-[10px] font-black uppercase mb-2 ${isMe ? 'text-gray-500' : 'text-gray-400'}`}>Gender</label>
            <select
              value={user.gender}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
              className={`w-full px-4 py-4 border-2 border-brutal-black focus:outline-none focus:ring-4 focus:ring-neon font-bold text-lg bg-white text-brutal-black appearance-none rounded-none`}
            >
              <option>남성</option>
              <option>여성</option>
              <option>기타</option>
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-[10px] font-black uppercase mb-2 ${isMe ? 'text-gray-500' : 'text-gray-400'}`}>Birthdate (YYYY / MM / DD)</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              value={user.year}
              onChange={(e) => setUser({ ...user, year: e.target.value })}
              className={`w-full px-2 py-4 border-2 border-brutal-black focus:outline-none focus:ring-2 focus:ring-neon font-bold text-base bg-white text-brutal-black rounded-none`}
              placeholder="2000"
              required
            />
            <input
              type="number"
              value={user.month}
              onChange={(e) => setUser({ ...user, month: e.target.value })}
              className={`w-full px-2 py-4 border-2 border-brutal-black focus:outline-none focus:ring-2 focus:ring-neon font-bold text-base bg-white text-brutal-black rounded-none`}
              placeholder="01"
              min="1" max="12"
              required
            />
            <input
              type="number"
              value={user.day}
              onChange={(e) => setUser({ ...user, day: e.target.value })}
              className={`w-full px-2 py-4 border-2 border-brutal-black focus:outline-none focus:ring-2 focus:ring-neon font-bold text-base bg-white text-brutal-black rounded-none`}
              placeholder="01"
              min="1" max="31"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="space-y-6">
        {renderUserInput(user1, setUser1, "ME", true)}
        <div className="flex justify-center -my-8 relative z-20">
          <div className="bg-neon p-4 rounded-full border-4 border-brutal-black rotate-12">
            <Zap className="w-8 h-8 fill-brutal-black" />
          </div>
        </div>
        {renderUserInput(user2, setUser2, "YOU", false)}
      </div>

      <motion.button
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        className="group relative w-full py-8 bg-neon border-4 border-brutal-black hover:bg-white transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-brutal-black translate-x-2 translate-y-2 -z-10 group-active:translate-x-0 group-active:translate-y-0 transition-transform" />
        <div className="flex items-center justify-center gap-4">
          {isLoading ? (
            <div className="w-10 h-10 border-4 border-brutal-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Target className="w-10 h-10" />
              <span className="font-display text-4xl uppercase italic">운명 분석하기</span>
              <ChevronRight className="w-10 h-10" />
            </>
          )}
        </div>
      </motion.button>
    </form>
  );
};
