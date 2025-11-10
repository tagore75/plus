import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../../services/api';

const WelfareScreen = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/welfare/programs');
      setPrograms(response.data.programs);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (number: string) => {
    const cleanNumber = number.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${cleanNumber}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient colors={['#8b5cf6', '#ec4899']} style={styles.header}>
        <Icon name="heart" size={48} color="white" />
        <Text style={styles.headerTitle}>복지 혜택 안내</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        ) : (
          programs.map((program) => (
            <View key={program.id} style={styles.programCard}>
              <Text style={styles.programTitle}>{program.name}</Text>
              <Text style={styles.programDescription}>{program.description}</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>대상:</Text>
                <Text style={styles.infoValue}>{program.eligibility}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>혜택:</Text>
                <Text style={styles.infoValue}>{program.benefits}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>신청:</Text>
                <Text style={styles.infoValue}>{program.application}</Text>
              </View>

              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleCall(program.contact)}
              >
                <Icon name="call" size={16} color="white" />
                <Text style={styles.contactButtonText}>
                  {program.contact} 문의하기
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  programCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  programDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 60,
    color: '#1a1a1a',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default WelfareScreen;
