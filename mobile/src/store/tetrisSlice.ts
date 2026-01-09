import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, GameStats, CognitiveMetrics } from '../types/tetris';
import { createEmptyBoard, calculateLevel, calculateGameSpeed } from '../utils/tetris/gameLogic';
import { getRandomTetromino, rotateTetromino } from '../utils/tetris/tetrominos';
import { calculateCognitiveScore } from '../utils/tetris/cognitiveMetrics';

interface TetrisState extends GameState {
  stats: GameStats;
  cognitiveMetrics: CognitiveMetrics;
  moveCount: number;
  successfulMoves: number;
  pieceTimestamps: number[];
  lineClears: {
    single: number;
    double: number;
    triple: number;
    tetris: number;
  };
  holesCreated: number;
  gameStartTime: number | null;
}

const initialState: TetrisState = {
  board: createEmptyBoard(),
  currentPiece: null,
  currentPosition: { x: 0, y: 0 },
  nextPiece: null,
  score: 0,
  level: 1,
  lines: 0,
  gameOver: false,
  isPaused: false,
  gameSpeed: 1000,
  stats: {
    totalGames: 0,
    highScore: 0,
    totalLines: 0,
    averageScore: 0,
    maxLevel: 1,
    playTime: 0,
    cognitiveScore: 0,
  },
  cognitiveMetrics: {
    reactionTime: [],
    accuracyRate: 0,
    patternRecognition: 0,
    decisionSpeed: 0,
    spatialAwareness: 0,
  },
  moveCount: 0,
  successfulMoves: 0,
  pieceTimestamps: [],
  lineClears: {
    single: 0,
    double: 0,
    triple: 0,
    tetris: 0,
  },
  holesCreated: 0,
  gameStartTime: null,
};

const tetrisSlice = createSlice({
  name: 'tetris',
  initialState,
  reducers: {
    startGame: (state) => {
      state.board = createEmptyBoard();
      state.currentPiece = getRandomTetromino();
      state.nextPiece = getRandomTetromino();
      state.currentPosition = { x: 3, y: 0 };
      state.score = 0;
      state.level = 1;
      state.lines = 0;
      state.gameOver = false;
      state.isPaused = false;
      state.gameSpeed = 1000;
      state.moveCount = 0;
      state.successfulMoves = 0;
      state.pieceTimestamps = [Date.now()];
      state.lineClears = { single: 0, double: 0, triple: 0, tetris: 0 };
      state.holesCreated = 0;
      state.gameStartTime = Date.now();
    },

    moveLeft: (state) => {
      state.currentPosition.x -= 1;
      state.moveCount += 1;
    },

    moveRight: (state) => {
      state.currentPosition.x += 1;
      state.moveCount += 1;
    },

    moveDown: (state) => {
      state.currentPosition.y += 1;
      state.moveCount += 1;
    },

    rotate: (state) => {
      if (state.currentPiece) {
        state.currentPiece = rotateTetromino(state.currentPiece);
        state.moveCount += 1;
      }
    },

    undoMove: (state) => {
      // 충돌시 이동 취소용
      state.moveCount -= 1;
    },

    recordSuccessfulMove: (state) => {
      state.successfulMoves += 1;
    },

    hardDrop: (state, action: PayloadAction<number>) => {
      state.currentPosition.y += action.payload;
    },

    lockPiece: (state) => {
      state.currentPiece = state.nextPiece;
      state.nextPiece = getRandomTetromino();
      state.currentPosition = { x: 3, y: 0 };
      state.pieceTimestamps.push(Date.now());
    },

    clearLines: (state, action: PayloadAction<number>) => {
      const linesCleared = action.payload;
      state.lines += linesCleared;

      // 줄 제거 통계
      if (linesCleared === 1) state.lineClears.single += 1;
      else if (linesCleared === 2) state.lineClears.double += 1;
      else if (linesCleared === 3) state.lineClears.triple += 1;
      else if (linesCleared === 4) state.lineClears.tetris += 1;

      // 레벨 계산
      const newLevel = calculateLevel(state.lines);
      if (newLevel > state.level) {
        state.level = newLevel;
        state.gameSpeed = calculateGameSpeed(newLevel);
      }
    },

    addScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },

    addHoles: (state, action: PayloadAction<number>) => {
      state.holesCreated += action.payload;
    },

    updateCognitiveMetrics: (state) => {
      // 정확도 계산
      state.cognitiveMetrics.accuracyRate =
        state.moveCount > 0 ? state.successfulMoves / state.moveCount : 0;

      // 패턴 인식 계산
      const totalClears =
        state.lineClears.single +
        state.lineClears.double +
        state.lineClears.triple +
        state.lineClears.tetris;
      if (totalClears > 0) {
        const efficiency =
          (state.lineClears.single * 1 +
            state.lineClears.double * 2.5 +
            state.lineClears.triple * 4 +
            state.lineClears.tetris * 8) /
          (totalClears * 8);
        state.cognitiveMetrics.patternRecognition = Math.round(efficiency * 100);
      }

      // 의사결정 속도 계산
      if (state.pieceTimestamps.length > 1) {
        const times: number[] = [];
        for (let i = 1; i < state.pieceTimestamps.length; i++) {
          times.push(state.pieceTimestamps[i] - state.pieceTimestamps[i - 1]);
        }
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const idealTime = 5000;
        if (avgTime <= idealTime) {
          state.cognitiveMetrics.decisionSpeed = 100;
        } else {
          state.cognitiveMetrics.decisionSpeed = Math.max(
            0,
            100 - (avgTime - idealTime) / 100
          );
        }

        // 반응 시간 기록
        state.cognitiveMetrics.reactionTime = times.slice(-50);
      }

      // 공간 인식 계산
      const totalPieces = state.pieceTimestamps.length;
      if (totalPieces > 0) {
        const efficiency = Math.max(0, 1 - state.holesCreated / (totalPieces * 2));
        state.cognitiveMetrics.spatialAwareness = Math.round(efficiency * 100);
      }
    },

    setGameOver: (state) => {
      state.gameOver = true;

      // 통계 업데이트
      state.stats.totalGames += 1;
      state.stats.totalLines += state.lines;
      state.stats.highScore = Math.max(state.stats.highScore, state.score);
      state.stats.maxLevel = Math.max(state.stats.maxLevel, state.level);
      state.stats.averageScore =
        (state.stats.averageScore * (state.stats.totalGames - 1) + state.score) /
        state.stats.totalGames;

      // 플레이 타임 업데이트
      if (state.gameStartTime) {
        const playTime = Math.floor((Date.now() - state.gameStartTime) / 1000);
        state.stats.playTime += playTime;
      }

      // 인지 능력 점수 계산
      state.stats.cognitiveScore = calculateCognitiveScore(
        state.cognitiveMetrics,
        state.level,
        state.score,
        state.lines
      );

      // 통계 저장
      saveStats(state.stats);
    },

    togglePause: (state) => {
      state.isPaused = !state.isPaused;
    },

    loadStats: (state, action: PayloadAction<GameStats>) => {
      state.stats = action.payload;
    },

    resetStats: (state) => {
      state.stats = {
        totalGames: 0,
        highScore: 0,
        totalLines: 0,
        averageScore: 0,
        maxLevel: 1,
        playTime: 0,
        cognitiveScore: 0,
      };
      AsyncStorage.removeItem('tetrisStats');
    },
  },
});

// 통계 저장 함수
const saveStats = async (stats: GameStats) => {
  try {
    await AsyncStorage.setItem('tetrisStats', JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
};

// 통계 로드 함수
export const loadStatsFromStorage = () => async (dispatch: any) => {
  try {
    const statsJson = await AsyncStorage.getItem('tetrisStats');
    if (statsJson) {
      const stats = JSON.parse(statsJson);
      dispatch(loadStats(stats));
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
};

export const {
  startGame,
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  undoMove,
  recordSuccessfulMove,
  hardDrop,
  lockPiece,
  clearLines,
  addScore,
  addHoles,
  updateCognitiveMetrics,
  setGameOver,
  togglePause,
  loadStats,
  resetStats,
} = tetrisSlice.actions;

export default tetrisSlice.reducer;
