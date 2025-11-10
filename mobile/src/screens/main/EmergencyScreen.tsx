import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const EmergencyScreen = () => {
  const emergencyContacts = [
    { name: '응급의료', number: '119', icon: 'medical' },
    { name: '경찰', number: '112', icon: 'shield-checkmark' },
    { name: '독극물 중독', number: '1339', icon: 'warning' },
    { name: '정신건강', number: '1577-0199', icon: 'heart' },
  ];

  const handleCall = (number: string) => {
    Alert.alert(
      '전화 연결',
      `${number}로 전화하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '전화하기',
          onPress: () => Linking.openURL(`tel:${number}`),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#dc2626', '#ef4444']} style={styles.header}>
        <Icon name="alert-circle" size={48} color="white" />
        <Text style={styles.headerTitle}>긴급 상황 대응</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>생명이 위급한 상황이신가요?</Text>
          <Text style={styles.sectionSubtitle}>즉시 119에 연락하세요</Text>
          <TouchableOpacity
            style={styles.bigEmergencyButton}
            onPress={() => handleCall('119')}
          >
            <Icon name="call" size={32} color="#dc2626" />
            <Text style={styles.bigButtonText}>119 전화하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>긴급 연락처</Text>
          <View style={styles.contactGrid}>
            {emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.number}
                style={styles.contactCard}
                onPress={() => handleCall(contact.number)}
              >
                <Icon name={contact.icon} size={32} color="#8b5cf6" />
                <Text style={styles.contactName}>{contact.name}</Text>
                <View style={styles.contactButton}>
                  <Icon name="call" size={16} color="white" />
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>응급 처치 가이드</Text>
          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>🩹 출혈 시 응급 처치</Text>
            <Text style={styles.guideText}>
              1. 깨끗한 천으로 상처 부위를 압박합니다{'\n'}
              2. 상처 부위를 심장보다 높게 올립니다{'\n'}
              3. 출혈이 멈추지 않으면 즉시 119에 연락합니다
            </Text>
          </View>

          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>❤️ 심폐소생술 (CPR)</Text>
            <Text style={styles.guideText}>
              1. 환자를 평평한 바닥에 눕힙니다{'\n'}
              2. 가슴 중앙을 깍지 낀 손으로 압박합니다{'\n'}
              3. 분당 100-120회 속도로 5cm 깊이 압박{'\n'}
              4. 119가 도착할 때까지 계속합니다
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  content: {
    flex: 1,
  },
  emergencySection: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fef2f2',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  bigEmergencyButton: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 48,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bigButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  section: {
    padding: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#8b5cf6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  contactNumber: {
    color: 'white',
    fontWeight: '600',
  },
  guideCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  guideText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
});

export default EmergencyScreen;
