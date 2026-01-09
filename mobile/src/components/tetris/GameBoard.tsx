import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Board, Tetromino, Position } from '../../types/tetris';
import { mergePieceToBoard } from '../../utils/tetris/gameLogic';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - 40) / 10); // 좌우 패딩 20px씩

interface GameBoardProps {
  board: Board;
  currentPiece: Tetromino | null;
  currentPosition: Position;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPiece,
  currentPosition,
}) => {
  // 현재 블록을 보드에 임시로 그리기
  const displayBoard = currentPiece
    ? mergePieceToBoard(board, currentPiece, currentPosition)
    : board;

  return (
    <View style={styles.container}>
      {displayBoard.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <View
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.cell,
                {
                  backgroundColor: cell || '#1a1a1a',
                  borderColor: cell ? cell : '#333',
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 2,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#8b5cf6',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    margin: 0.5,
  },
});

export default GameBoard;
