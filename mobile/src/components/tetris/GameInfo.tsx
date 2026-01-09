import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GameInfoProps {
  score: number;
  level: number;
  lines: number;
  cognitiveScore: number;
}

const GameInfo: React.FC<GameInfoProps> = ({
  score,
  level,
  lines,
  cognitiveScore,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoItem}>
        <Text style={styles.label}>점수</Text>
        <Text style={styles.value}>{score.toLocaleString()}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>레벨</Text>
        <Text style={styles.value}>{level}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>줄</Text>
        <Text style={styles.value}>{lines}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>인지점수</Text>
        <Text style={[styles.value, styles.cognitiveValue]}>
          {cognitiveScore}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cognitiveValue: {
    color: '#8b5cf6',
  },
});

export default GameInfo;
