import {
  Board,
  CellValue,
  Tetromino,
  Position,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  POINTS,
  LINES_PER_LEVEL,
  INITIAL_SPEED,
  SPEED_DECREASE,
  MIN_SPEED,
} from '../../types/tetris';

// 빈 보드 생성
export const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(0));
};

// 충돌 감지
export const checkCollision = (
  board: Board,
  piece: Tetromino,
  position: Position
): boolean => {
  const { shape } = piece;
  const { x, y } = position;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newY = y + row;
        const newX = x + col;

        // 보드 경계 확인
        if (
          newY < 0 ||
          newY >= BOARD_HEIGHT ||
          newX < 0 ||
          newX >= BOARD_WIDTH
        ) {
          return true;
        }

        // 다른 블록과의 충돌 확인
        if (board[newY][newX] !== 0) {
          return true;
        }
      }
    }
  }

  return false;
};

// 보드에 블록 병합
export const mergePieceToBoard = (
  board: Board,
  piece: Tetromino,
  position: Position
): Board => {
  const newBoard = board.map(row => [...row]);
  const { shape, color } = piece;
  const { x, y } = position;

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col]) {
        const newY = y + row;
        const newX = x + col;
        if (newY >= 0 && newY < BOARD_HEIGHT && newX >= 0 && newX < BOARD_WIDTH) {
          newBoard[newY][newX] = color;
        }
      }
    }
  }

  return newBoard;
};

// 완성된 줄 찾기
export const findCompletedLines = (board: Board): number[] => {
  const completedLines: number[] = [];

  for (let row = 0; row < BOARD_HEIGHT; row++) {
    if (board[row].every(cell => cell !== 0)) {
      completedLines.push(row);
    }
  }

  return completedLines;
};

// 완성된 줄 제거
export const clearLines = (board: Board, lines: number[]): Board => {
  if (lines.length === 0) return board;

  const newBoard = board.filter((_, index) => !lines.includes(index));

  // 제거된 줄만큼 위에 빈 줄 추가
  const emptyLines = Array(lines.length)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(0));

  return [...emptyLines, ...newBoard];
};

// 점수 계산
export const calculateScore = (
  linesCleared: number,
  level: number,
  isSoftDrop: boolean = false,
  isHardDrop: boolean = false,
  dropDistance: number = 0
): number => {
  let score = 0;

  // 줄 제거 점수
  if (linesCleared === 1) score += POINTS.SINGLE;
  else if (linesCleared === 2) score += POINTS.DOUBLE;
  else if (linesCleared === 3) score += POINTS.TRIPLE;
  else if (linesCleared === 4) score += POINTS.TETRIS;

  // 드롭 보너스
  if (isSoftDrop) score += POINTS.SOFT_DROP * dropDistance;
  if (isHardDrop) score += POINTS.HARD_DROP * dropDistance;

  // 레벨 보너스
  return score * level;
};

// 레벨 계산
export const calculateLevel = (totalLines: number): number => {
  return Math.floor(totalLines / LINES_PER_LEVEL) + 1;
};

// 게임 속도 계산
export const calculateGameSpeed = (level: number): number => {
  const speed = INITIAL_SPEED - (level - 1) * SPEED_DECREASE;
  return Math.max(speed, MIN_SPEED);
};

// 하드 드롭 거리 계산
export const calculateDropDistance = (
  board: Board,
  piece: Tetromino,
  position: Position
): number => {
  let distance = 0;
  let testPosition = { ...position };

  while (!checkCollision(board, piece, { ...testPosition, y: testPosition.y + 1 })) {
    testPosition.y += 1;
    distance += 1;
  }

  return distance;
};

// 하드 드롭 위치 찾기
export const findHardDropPosition = (
  board: Board,
  piece: Tetromino,
  position: Position
): Position => {
  let testPosition = { ...position };

  while (!checkCollision(board, piece, { ...testPosition, y: testPosition.y + 1 })) {
    testPosition.y += 1;
  }

  return testPosition;
};

// 게임 오버 확인
export const isGameOver = (board: Board): boolean => {
  // 맨 위 두 줄에 블록이 있으면 게임 오버
  return board[0].some(cell => cell !== 0) || board[1].some(cell => cell !== 0);
};

// 초기 위치 계산
export const getInitialPosition = (piece: Tetromino): Position => {
  return {
    x: Math.floor((BOARD_WIDTH - piece.shape[0].length) / 2),
    y: 0,
  };
};
