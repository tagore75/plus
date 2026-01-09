import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tetromino } from '../../types/tetris';

interface NextPieceProps {
  piece: Tetromino | null;
}

const CELL_SIZE = 20;

const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
  if (!piece) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>다음 블록</Text>
      <View style={styles.pieceContainer}>
        {piece.shape.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  {
                    backgroundColor: cell ? piece.color : 'transparent',
                    borderColor: cell ? piece.color : 'transparent',
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
  },
});

export default NextPiece;
