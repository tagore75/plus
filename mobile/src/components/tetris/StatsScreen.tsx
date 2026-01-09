import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GameStats, CognitiveMetrics } from '../../types/tetris';
import { recommendDifficulty, getLearningTips } from '../../utils/tetris/cognitiveMetrics';
import Icon from 'react-native-vector-icons/Ionicons';

interface StatsScreenProps {
  stats: GameStats;
  cognitiveMetrics: CognitiveMetrics;
  onReset?: () => void;
  onClose: () => void;
}

const StatsScreen: React.FC<StatsScreenProps> = ({
  stats,
  cognitiveMetrics,
  onReset,
  onClose,
}) => {
  const tips = getLearningTips(cognitiveMetrics);
  const difficulty = recommendDifficulty(stats.cognitiveScore);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}시간 ${minutes}분`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>게임 통계</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* 전체 통계 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>전체 기록</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>총 게임 수</Text>
            <Text style={styles.statValue}>{stats.totalGames}회</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>최고 점수</Text>
            <Text style={styles.statValue}>{stats.highScore.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>평균 점수</Text>
            <Text style={styles.statValue}>
              {Math.round(stats.averageScore).toLocaleString()}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>최고 레벨</Text>
            <Text style={styles.statValue}>{stats.maxLevel}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>총 제거 줄</Text>
            <Text style={styles.statValue}>{stats.totalLines}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>총 플레이 시간</Text>
            <Text style={styles.statValue}>{formatTime(stats.playTime)}</Text>
          </View>
        </View>

        {/* 인지 능력 점수 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인지 능력 점수</Text>
          <View style={styles.cognitiveScore}>
            <Text style={styles.cognitiveScoreValue}>{stats.cognitiveScore}</Text>
            <Text style={styles.cognitiveScoreLabel}>/ 100</Text>
          </View>
          <Text style={styles.difficultyText}>추천 난이도: {difficulty}</Text>

          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>정확도</Text>
              <Text style={styles.metricValue}>
                {Math.round(cognitiveMetrics.accuracyRate * 100)}%
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>패턴 인식</Text>
              <Text style={styles.metricValue}>
                {cognitiveMetrics.patternRecognition}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>의사결정</Text>
              <Text style={styles.metricValue}>
                {Math.round(cognitiveMetrics.decisionSpeed)}
              </Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>공간 인식</Text>
              <Text style={styles.metricValue}>
                {cognitiveMetrics.spatialAwareness}
              </Text>
            </View>
          </View>
        </View>

        {/* 학습 팁 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>학습 팁</Text>
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* 초기화 버튼 */}
        {onReset && (
          <TouchableOpacity style={styles.resetButton} onPress={onReset}>
            <Icon name="refresh" size={20} color="#fff" />
            <Text style={styles.resetButtonText}>통계 초기화</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    color: '#8b5cf6',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cognitiveScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 20,
  },
  cognitiveScoreValue: {
    color: '#8b5cf6',
    fontSize: 48,
    fontWeight: 'bold',
  },
  cognitiveScoreLabel: {
    color: '#aaa',
    fontSize: 24,
    marginLeft: 5,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  metricLabel: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  metricValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tipItem: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tipText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default StatsScreen;
