import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import {
  startGame,
  moveLeft,
  moveRight,
  moveDown,
  rotate,
  undoMove,
  recordSuccessfulMove,
  hardDrop,
  lockPiece,
  clearLines as clearLinesAction,
  addScore,
  addHoles,
  updateCognitiveMetrics,
  setGameOver,
  togglePause,
  loadStatsFromStorage,
  resetStats,
} from '../../store/tetrisSlice';
import {
  checkCollision,
  mergePieceToBoard,
  findCompletedLines,
  clearLines,
  calculateScore,
  isGameOver,
  findHardDropPosition,
  calculateDropDistance,
} from '../../utils/tetris/gameLogic';
import GameBoard from '../../components/tetris/GameBoard';
import NextPiece from '../../components/tetris/NextPiece';
import GameInfo from '../../components/tetris/GameInfo';
import GameControls from '../../components/tetris/GameControls';
import StatsScreen from '../../components/tetris/StatsScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const TetrisScreen = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.tetris);
  const [showStats, setShowStats] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // 게임 시작 시 통계 로드
  useEffect(() => {
    dispatch(loadStatsFromStorage() as any);
  }, [dispatch]);

  // 게임 루프
  useEffect(() => {
    if (!gameState.gameOver && !gameState.isPaused && gameState.currentPiece) {
      gameLoopRef.current = setInterval(() => {
        handleMoveDown();
      }, gameState.gameSpeed);

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [
    gameState.gameOver,
    gameState.isPaused,
    gameState.gameSpeed,
    gameState.currentPiece,
    gameState.currentPosition,
    gameState.board,
  ]);

  const handleStartGame = () => {
    dispatch(startGame());
  };

  const handleMoveLeft = () => {
    if (!gameState.currentPiece) return;

    dispatch(moveLeft());
    if (
      checkCollision(
        gameState.board,
        gameState.currentPiece,
        {
          x: gameState.currentPosition.x - 1,
          y: gameState.currentPosition.y,
        }
      )
    ) {
      dispatch(undoMove());
    } else {
      dispatch(recordSuccessfulMove());
    }
  };

  const handleMoveRight = () => {
    if (!gameState.currentPiece) return;

    dispatch(moveRight());
    if (
      checkCollision(
        gameState.board,
        gameState.currentPiece,
        {
          x: gameState.currentPosition.x + 1,
          y: gameState.currentPosition.y,
        }
      )
    ) {
      dispatch(undoMove());
    } else {
      dispatch(recordSuccessfulMove());
    }
  };

  const handleMoveDown = () => {
    if (!gameState.currentPiece) return;

    const newPosition = {
      x: gameState.currentPosition.x,
      y: gameState.currentPosition.y + 1,
    };

    if (checkCollision(gameState.board, gameState.currentPiece, newPosition)) {
      // 블록 고정
      const newBoard = mergePieceToBoard(
        gameState.board,
        gameState.currentPiece,
        gameState.currentPosition
      );

      // 완성된 줄 찾기
      const completedLines = findCompletedLines(newBoard);
      const clearedBoard = clearLines(newBoard, completedLines);

      // 점수 계산
      const points = calculateScore(completedLines.length, gameState.level);
      dispatch(addScore(points));
      dispatch(clearLinesAction(completedLines.length));

      // 구멍 계산 (간단한 구현)
      let holes = 0;
      for (let col = 0; col < clearedBoard[0].length; col++) {
        let foundBlock = false;
        for (let row = 0; row < clearedBoard.length; row++) {
          if (clearedBoard[row][col] !== 0) {
            foundBlock = true;
          } else if (foundBlock) {
            holes++;
          }
        }
      }
      dispatch(addHoles(holes));

      // 인지 메트릭 업데이트
      dispatch(updateCognitiveMetrics());

      // 게임 오버 확인
      if (isGameOver(clearedBoard)) {
        dispatch(setGameOver());
        Alert.alert(
          '게임 오버',
          `점수: ${gameState.score}\n레벨: ${gameState.level}\n인지 점수: ${gameState.stats.cognitiveScore}`,
          [
            { text: '통계 보기', onPress: () => setShowStats(true) },
            { text: '다시 시작', onPress: handleStartGame },
          ]
        );
      } else {
        dispatch(lockPiece());
      }
    } else {
      dispatch(moveDown());
      dispatch(recordSuccessfulMove());
    }
  };

  const handleRotate = () => {
    if (!gameState.currentPiece) return;

    dispatch(rotate());
    if (
      checkCollision(
        gameState.board,
        gameState.currentPiece,
        gameState.currentPosition
      )
    ) {
      // 회전 실패 시 원래대로 (3번 더 회전)
      dispatch(rotate());
      dispatch(rotate());
      dispatch(rotate());
      dispatch(undoMove());
    } else {
      dispatch(recordSuccessfulMove());
    }
  };

  const handleHardDrop = () => {
    if (!gameState.currentPiece) return;

    const dropPosition = findHardDropPosition(
      gameState.board,
      gameState.currentPiece,
      gameState.currentPosition
    );
    const distance = calculateDropDistance(
      gameState.board,
      gameState.currentPiece,
      gameState.currentPosition
    );

    dispatch(hardDrop(distance));
    dispatch(addScore(distance * 2));
    dispatch(recordSuccessfulMove());

    // 즉시 블록 고정
    setTimeout(handleMoveDown, 50);
  };

  const handleTogglePause = () => {
    dispatch(togglePause());
  };

  const handleResetStats = () => {
    Alert.alert(
      '통계 초기화',
      '정말로 모든 통계를 초기화하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: () => {
            dispatch(resetStats());
            setShowStats(false);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>테트리스 인지학습</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowStats(true)}
          >
            <Icon name="stats-chart" size={24} color="#fff" />
          </TouchableOpacity>
          {gameState.currentPiece && (
            <TouchableOpacity style={styles.iconButton} onPress={handleTogglePause}>
              <Icon
                name={gameState.isPaused ? 'play' : 'pause'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!gameState.currentPiece || gameState.gameOver ? (
        <View style={styles.startContainer}>
          <Text style={styles.welcomeText}>인지학습 개선 테트리스</Text>
          <Text style={styles.descriptionText}>
            블록을 쌓으며 인지 능력을 향상시켜보세요!
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
            <Text style={styles.startButtonText}>게임 시작</Text>
          </TouchableOpacity>
          {gameState.stats.totalGames > 0 && (
            <TouchableOpacity
              style={styles.statsButton}
              onPress={() => setShowStats(true)}
            >
              <Icon name="stats-chart" size={20} color="#8b5cf6" />
              <Text style={styles.statsButtonText}>통계 보기</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.gameContainer}>
          {gameState.isPaused && (
            <View style={styles.pauseOverlay}>
              <Text style={styles.pauseText}>일시 정지</Text>
              <TouchableOpacity
                style={styles.resumeButton}
                onPress={handleTogglePause}
              >
                <Text style={styles.resumeButtonText}>계속하기</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.topSection}>
            <View style={styles.leftPanel}>
              <NextPiece piece={gameState.nextPiece} />
            </View>
            <View style={styles.rightPanel}>
              <GameInfo
                score={gameState.score}
                level={gameState.level}
                lines={gameState.lines}
                cognitiveScore={gameState.stats.cognitiveScore}
              />
            </View>
          </View>

          <View style={styles.boardContainer}>
            <GameBoard
              board={gameState.board}
              currentPiece={gameState.currentPiece}
              currentPosition={gameState.currentPosition}
            />
          </View>

          <View style={styles.controlsContainer}>
            <GameControls
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
              onMoveDown={handleMoveDown}
              onRotate={handleRotate}
              onHardDrop={handleHardDrop}
              isPaused={gameState.isPaused}
            />
          </View>
        </View>
      )}

      {/* 통계 모달 */}
      <Modal
        visible={showStats}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowStats(false)}
      >
        <StatsScreen
          stats={gameState.stats}
          cognitiveMetrics={gameState.cognitiveMetrics}
          onReset={handleResetStats}
          onClose={() => setShowStats(false)}
        />
      </Modal>
    </SafeAreaView>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    padding: 5,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  descriptionText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  statsButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    marginLeft: 5,
  },
  gameContainer: {
    flex: 1,
    padding: 10,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pauseText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftPanel: {
    flex: 1,
    marginRight: 5,
  },
  rightPanel: {
    flex: 1,
    marginLeft: 5,
  },
  boardContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  controlsContainer: {
    marginTop: 10,
  },
});

export default TetrisScreen;
