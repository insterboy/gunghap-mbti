export interface UserInfo {
  nickname: string;
  gender: string;
  birthdate: string;
  mbti: string;
}

const MBTI_COMPATIBILITY: Record<string, Record<string, number>> = {
  // Simplified logic: 100 (Best), 80 (Good), 60 (Normal), 40 (Bad), 20 (Worst)
  // This is a representative sample, in a real app this would be a full 16x16 matrix
  'ENFP': { 'INTJ': 100, 'INFJ': 95, 'ENFP': 80, 'ISTJ': 30 },
  'INTJ': { 'ENFP': 100, 'ENTP': 95, 'INTJ': 80, 'ESFP': 20 },
  // ... default to 70 if not specified
};

const ELEMENTS = ['목(木)', '화(火)', '토(土)', '금(金)', '수(水)'];
const ELEMENT_DESC = {
  '목(木)': '성장과 생명력의 기운. 뻗어나가는 에너지.',
  '화(火)': '열정과 확산의 기운. 타오르는 에너지.',
  '토(土)': '중심과 포용의 기운. 단단한 대지의 에너지.',
  '금(金)': '결단과 변혁의 기운. 날카롭고 정교한 에너지.',
  '수(水)': '지혜와 유연함의 기운. 흐르는 물의 에너지.'
};

const getElement = (birthdate: string) => {
  const date = new Date(birthdate);
  const day = date.getDate();
  return ELEMENTS[day % 5];
};

export const analyzeLocally = (user1: UserInfo, user2: UserInfo) => {
  const mbtiScore = MBTI_COMPATIBILITY[user1.mbti]?.[user2.mbti] || 70;
  const element1 = getElement(user1.birthdate);
  const element2 = getElement(user2.birthdate);
  
  const totalScore = Math.floor((mbtiScore + 80) / 2) + (Math.floor(Math.random() * 10));
  
  const personas = [
    `${element1}와 ${element2}의 운명적 만남`,
    `불꽃 튀는 ${user1.mbti}와 차분한 ${user2.mbti}`,
    `우주가 점지해준 힙한 듀오`,
    `서로의 빈틈을 채워주는 퍼즐 조각`
  ];
  
  const persona = personas[Math.floor(Math.random() * personas.length)];
  
  const result = `
💖 우리의 관계 페르소나: ${persona}

📊 궁합 융합 지수: ${totalScore}점

💬 MBTI로 본 우리의 티키타카:
${user1.nickname}(${user1.mbti})님과 ${user2.nickname}(${user2.mbti})님은 성격적으로 매우 흥미로운 조합입니다. 
${user1.mbti}의 창의적인 에너지와 ${user2.mbti}의 독특한 관점이 만나면 세상에 없던 새로운 대화가 시작됩니다. 
가끔은 서로의 소통 방식이 달라 오해가 생길 수 있지만, 그것조차 두 사람에게는 성장의 촉매제가 될 것입니다.

⏳ 사주로 본 올해의 연애 타이밍:
2026년 병오년의 붉은 말 기운이 두 사람의 관계에 뜨거운 활력을 불어넣습니다. 
특히 이번 2월은 '경인월'로, 새로운 시작과 결단에 아주 좋은 시기입니다. 
두 사람이 함께 새로운 취미를 시작하거나 여행을 계획한다면 관계가 급속도로 진전될 것입니다. 
가장 좋은 시기는 2월 중순부터 3월 초까지입니다.

💡 맞춤형 연애 꿀팁:
${user1.nickname}님은 조금 더 경청하는 자세를, ${user2.nickname}님은 자신의 감정을 조금 더 솔직하게 표현해보세요. 
오늘 당장 서로에게 "요즘 가장 고민되는 게 뭐야?"라고 물어보는 것만으로도 운의 흐름이 바뀔 거예요.
`;

  return result;
};
