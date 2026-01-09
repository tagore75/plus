import { CognitiveMetrics } from '../../types/tetris';

// 인지 능력 점수 계산
export const calculateCognitiveScore = (
  metrics: CognitiveMetrics,
  level: number,
  score: number,
  lines: number
): number => {
  // 각 메트릭별 가중치
  const weights = {
    reactionTime: 0.25,
    accuracyRate: 0.20,
    patternRecognition: 0.20,
    decisionSpeed: 0.20,
    spatialAwareness: 0.15,
  };

  // 반응 시간 점수 (낮을수록 좋음, 정규화)
  const avgReactionTime = metrics.reactionTime.length > 0
    ? metrics.reactionTime.reduce((a, b) => a + b, 0) / metrics.reactionTime.length
    : 1000;
  const reactionScore = Math.max(0, 100 - (avgReactionTime / 10));

  // 정확도 점수
  const accuracyScore = metrics.accuracyRate * 100;

  // 패턴 인식 점수 (레벨과 연관)
  const patternScore = Math.min(100, (level / 20) * 100 + metrics.patternRecognition);

  // 의사결정 속도 점수
  const decisionScore = Math.min(100, metrics.decisionSpeed);

  // 공간 인식 점수 (줄 제거 효율과 연관)
  const spatialScore = Math.min(100, metrics.spatialAwareness + (lines * 2));

  // 가중 평균 계산
  const cognitiveScore =
    reactionScore * weights.reactionTime +
    accuracyScore * weights.accuracyRate +
    patternScore * weights.patternRecognition +
    decisionScore * weights.decisionSpeed +
    spatialScore * weights.spatialAwareness;

  return Math.round(cognitiveScore);
};

// 반응 시간 기록
export const recordReactionTime = (
  reactionTimes: number[],
  newTime: number,
  maxRecords: number = 50
): number[] => {
  const updated = [...reactionTimes, newTime];
  // 최근 N개만 유지
  return updated.slice(-maxRecords);
};

// 정확도 계산
export const calculateAccuracy = (
  successfulMoves: number,
  totalMoves: number
): number => {
  if (totalMoves === 0) return 0;
  return successfulMoves / totalMoves;
};

// 패턴 인식 능력 계산 (테트리스 줄 제거 효율)
export const calculatePatternRecognition = (
  singleLines: number,
  doubleLines: number,
  tripleLines: number,
  tetrisLines: number
): number => {
  const totalClears = singleLines + doubleLines + tripleLines + tetrisLines;
  if (totalClears === 0) return 0;

  // 더 많은 줄을 한번에 제거할수록 높은 점수
  const efficiency =
    (singleLines * 1 +
      doubleLines * 2.5 +
      tripleLines * 4 +
      tetrisLines * 8) /
    (totalClears * 8);

  return Math.round(efficiency * 100);
};

// 의사결정 속도 계산 (빠른 블록 배치)
export const calculateDecisionSpeed = (
  avgTimePerPiece: number
): number => {
  // 5초 이내가 이상적, 정규화
  const idealTime = 5000; // 5초
  if (avgTimePerPiece <= idealTime) {
    return 100;
  }
  return Math.max(0, 100 - ((avgTimePerPiece - idealTime) / 100));
};

// 공간 인식 능력 계산 (보드 활용 효율)
export const calculateSpatialAwareness = (
  holesCreated: number,
  totalPieces: number
): number => {
  if (totalPieces === 0) return 100;

  // 구멍을 적게 만들수록 높은 점수
  const efficiency = Math.max(0, 1 - (holesCreated / (totalPieces * 2)));
  return Math.round(efficiency * 100);
};

// 학습 진행도 계산
export const calculateLearningProgress = (
  currentStats: {
    cognitiveScore: number;
    level: number;
    averageScore: number;
  },
  previousStats: {
    cognitiveScore: number;
    level: number;
    averageScore: number;
  }
): number => {
  const cognitiveImprovement = currentStats.cognitiveScore - previousStats.cognitiveScore;
  const levelImprovement = currentStats.level - previousStats.level;
  const scoreImprovement = currentStats.averageScore - previousStats.averageScore;

  // 개선도 점수 계산
  const improvement =
    cognitiveImprovement * 0.5 +
    levelImprovement * 10 +
    (scoreImprovement / 1000) * 0.3;

  return Math.max(0, Math.min(100, improvement));
};

// 난이도 추천
export const recommendDifficulty = (cognitiveScore: number): string => {
  if (cognitiveScore < 30) return '초급';
  if (cognitiveScore < 50) return '중급';
  if (cognitiveScore < 70) return '고급';
  return '전문가';
};

// 학습 팁 제공
export const getLearningTips = (metrics: CognitiveMetrics): string[] => {
  const tips: string[] = [];

  const avgReactionTime = metrics.reactionTime.length > 0
    ? metrics.reactionTime.reduce((a, b) => a + b, 0) / metrics.reactionTime.length
    : 0;

  if (avgReactionTime > 500) {
    tips.push('💡 반응 속도를 높이려면 다음 블록을 미리 확인하세요.');
  }

  if (metrics.accuracyRate < 0.7) {
    tips.push('💡 정확도 향상을 위해 천천히 신중하게 블록을 배치해보세요.');
  }

  if (metrics.patternRecognition < 50) {
    tips.push('💡 한번에 여러 줄을 제거하는 전략을 연습해보세요.');
  }

  if (metrics.decisionSpeed < 50) {
    tips.push('💡 의사결정 속도를 높이려면 간단한 레벨부터 시작하세요.');
  }

  if (metrics.spatialAwareness < 50) {
    tips.push('💡 구멍을 만들지 않도록 블록을 평평하게 쌓아보세요.');
  }

  if (tips.length === 0) {
    tips.push('🎉 훌륭합니다! 모든 영역에서 좋은 성과를 보이고 있습니다.');
  }

  return tips;
};
