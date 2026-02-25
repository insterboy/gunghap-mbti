export interface UserInfo {
  nickname: string;
  gender: string;
  birthdate: string;
  mbti: string;
}

const MBTI_MATRIX: Record<string, Record<string, number>> = {
  'INTJ': { 'ENFP': 100, 'ENTP': 95, 'INTJ': 80, 'ESFP': 30, 'INFJ': 85, 'ENFJ': 70, 'INFP': 60, 'ENTJ': 90, 'INTP': 85, 'ISTJ': 50, 'ISFJ': 40, 'ISTP': 40, 'ISFP': 30, 'ESTP': 20, 'ESFJ': 20, 'ESTJ': 40 },
  'ENFP': { 'INTJ': 100, 'INFJ': 95, 'ENFP': 90, 'ESFP': 70, 'ENTP': 85, 'ENTJ': 80, 'INFP': 90, 'ENFJ': 85, 'INTP': 70, 'ISTJ': 40, 'ISFJ': 50, 'ISTP': 50, 'ISFP': 60, 'ESTP': 60, 'ESFJ': 70, 'ESTJ': 50 },
  // Default score generator if not fully mapped
};

const getMbtiScore = (m1: string, m2: string): number => {
  if (MBTI_MATRIX[m1]?.[m2]) return MBTI_MATRIX[m1][m2];
  if (MBTI_MATRIX[m2]?.[m1]) return MBTI_MATRIX[m2][m1];

  // Dynamic calculation based on letters
  let score = 50;
  for (let i = 0; i < 4; i++) {
    if (m1[i] === m2[i]) score += 10;
    else score -= 5;
  }
  return Math.min(Math.max(score, 20), 95);
};

const ELEMENTS = ['목(木)', '화(火)', '토(土)', '금(金)', '수(水)'];
const ELEMENT_NAMES = ['나무', '불꽃', '대지', '무쇠', '바다'];

const getElementInfo = (birthdate: string) => {
  const date = new Date(birthdate);
  const val = (date.getFullYear() + date.getMonth() + date.getDate()) % 5;
  return {
    symbol: ELEMENTS[val],
    name: ELEMENT_NAMES[val]
  };
};

export const analyzeLocally = (user1: UserInfo, user2: UserInfo) => {
  const mbtiScore = getMbtiScore(user1.mbti, user2.mbti);
  const e1 = getElementInfo(user1.birthdate);
  const e2 = getElementInfo(user2.birthdate);

  // Calculate total score with some variance
  const baseScore = Math.floor((mbtiScore + 100) / 2);
  const randomVariance = Math.floor(Math.random() * 15) - 7;
  const totalScore = Math.min(Math.max(baseScore + randomVariance, 10), 100);

  const personas = [
    `💖 우리의 관계 페르소나: ${e1.name}와 ${e2.name}의 치명적인 끌림`,
    `💖 우리의 관계 페르소나: ${user1.mbti}와 ${user2.mbti}의 우주급 티키타카`,
    `💖 우리의 관계 페르소나: 절대로 떨어질 수 없는 ${e1.symbol}와 ${e2.symbol}의 결합`,
    `💖 우리의 관계 페르소나: 서로의 영혼을 채우는 완벽한 퍼즐 조각`
  ];
  const persona = personas[totalScore % personas.length];

  const result = `
${persona}

📊 궁합 융합 지수: ${totalScore}점

💬 MBTI로 본 우리의 티키타카:
${user1.nickname}(${user1.mbti})님과 ${user2.nickname}(${user2.mbti})님은 성격적으로 ${totalScore > 80 ? '찰떡궁합' : '묘한 매력'}을 가졌네요. 
${user1.mbti}의 ${user1.mbti[0] === 'E' ? '외향적' : '내면적'} 에너지와 ${user2.mbti}의 ${user2.mbti[0] === 'E' ? '다이나믹한' : '진중한'} 바이브가 만나 ${totalScore > 70 ? '폭발적인 시너지를 냅니다.' : '서로를 보완하는 매력을 발산합니다.'}

⏳ 사주로 본 올해의 연애 타이밍:
2026년 병오년은 '붉은 말'의 해로 열정이 넘치는 시기입니다. ${e1.name}와 ${e2.name}의 기운이 합쳐져 올해 상반기에 강력한 연애 운이 들어와 있습니다. 특히 5월과 8월, 두 사람의 기운이 가장 조화롭게 섞이는 황금 타이밍을 놓치지 마세요.

💡 맞춤형 연애 꿀팁:
${totalScore > 80 ? '너무 완벽해서 탈! 가끔은 각자의 시간을 갖는 것이 더 오래 타오르는 비결입니다.' : '서로의 다름을 "틀림"이 아닌 "다름"으로 인정하고 대화를 10분만 더 나눠보세요. 운명이 바뀝니다.'}
`;

  return result.trim();
};
