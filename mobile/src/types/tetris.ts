// 테트리스 게임 타입 정의

export type CellValue = 0 | string;
export type Board = CellValue[][];
export type Position = { x: number; y: number };

export interface Tetromino {
  shape: number[][];
  color: string;
}

export interface GameState {
  board: Board;
  currentPiece: Tetromino | null;
  currentPosition: Position;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  isPaused: boolean;
  gameSpeed: number;
}

export interface GameStats {
  totalGames: number;
  highScore: number;
  totalLines: number;
  averageScore: number;
  maxLevel: number;
  playTime: number;
  cognitiveScore: number; // 인지능력 점수
}

export interface CognitiveMetrics {
  reactionTime: number[]; // 반응 시간 기록
  accuracyRate: number; // 정확도
  patternRecognition: number; // 패턴 인식 능력
  decisionSpeed: number; // 의사결정 속도
  spatialAwareness: number; // 공간 인식 능력
}

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const INITIAL_SPEED = 1000; // 1초
export const SPEED_DECREASE = 50; // 레벨당 속도 증가
export const MIN_SPEED = 100; // 최소 속도 (최대 난이도)

// 점수 시스템
export const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};

// 레벨업 조건
export const LINES_PER_LEVEL = 10;
