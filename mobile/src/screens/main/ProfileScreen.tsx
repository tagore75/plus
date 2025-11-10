import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store/store';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const menuItems = [
    {
      id: '1',
      icon: 'person-outline',
      title: '기본 정보',
      subtitle: user?.name || '이름 없음',
      onPress: () => Alert.alert('개발 중', '이 기능은 개발 중입니다.'),
    },
    {
      id: '2',
      icon: 'fitness-outline',
      title: '건강 정보',
      subtitle: '혈액형, 알레르기, 기저질환',
      onPress: () => Alert.alert('개발 중', '이 기능은 개발 중입니다.'),
    },
    {
      id: '3',
      icon: 'call-outline',
      title: '긴급 연락처',
      subtitle: '보호자 정보 관리',
      onPress: () => Alert.alert('개발 중', '이 기능은 개발 중입니다.'),
    },
    {
      id: '4',
      icon: 'notifications-outline',
      title: '알림 설정',
      subtitle: '푸시 알림 관리',
      onPress: () => Alert.alert('개발 중', '이 기능은 개발 중입니다.'),
    },
    {
      id: '5',
      icon: 'shield-checkmark-outline',
      title: '개인정보 보호',
      subtitle: '데이터 및 보안',
      onPress: () => Alert.alert('개발 중', '이 기능은 개발 중입니다.'),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="person" size={48} color="#8b5cf6" />
        </View>
        <Text style={styles.name}>{user?.name || '사용자'}</Text>
        <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={24} color="#666" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('버전 정보', '버전 1.0.0')}
          >
            <View style={styles.menuIcon}>
              <Icon name="information-circle-outline" size={24} color="#666" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>앱 정보</Text>
              <Text style={styles.menuSubtitle}>버전 1.0.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('개발 중', '이 기능은 개발 중입니다.')}
          >
            <View style={styles.menuIcon}>
              <Icon name="help-circle-outline" size={24} color="#666" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>도움말</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color="#dc2626" />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            이 챗봇은 의료 정보 제공 목적이며,{'\n'}
            전문 의료인의 진단과 치료를 대체할 수 없습니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: 'white',
    padding: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'white',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ProfileScreen;
