import { Tetromino } from '../../types/tetris';

// 테트로미노 색상
export const COLORS = {
  I: '#00f0f0', // 시안
  O: '#f0f000', // 노랑
  T: '#a000f0', // 보라
  S: '#00f000', // 초록
  Z: '#f00000', // 빨강
  J: '#0000f0', // 파랑
  L: '#f0a000', // 주황
};

// 테트로미노 모양 정의
export const TETROMINOS: { [key: string]: Tetromino } = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: COLORS.I,
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: COLORS.O,
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.T,
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: COLORS.S,
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.Z,
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.J,
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: COLORS.L,
  },
};

// 랜덤 테트로미노 생성
export const getRandomTetromino = (): Tetromino => {
  const tetrominoKeys = Object.keys(TETROMINOS);
  const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)];
  return TETROMINOS[randomKey];
};

// 테트로미노 회전
export const rotateTetromino = (tetromino: Tetromino): Tetromino => {
  const shape = tetromino.shape;
  const n = shape.length;
  const rotated: number[][] = [];

  for (let i = 0; i < n; i++) {
    rotated[i] = [];
    for (let j = 0; j < n; j++) {
      rotated[i][j] = shape[n - 1 - j][i];
    }
  }

  return {
    ...tetromino,
    shape: rotated,
  };
};
