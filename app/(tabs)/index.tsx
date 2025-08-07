import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stethoscope, History, BookOpen, Info, LogOut,HeartOffIcon, HeartPulse } from 'lucide-react-native';

export default function DashboardScreen() {
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadUserData();
    setGreetingMessage();
  }, []);

  const loadUserData = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      const name = await AsyncStorage.getItem('userName');
      setUserRole(role || '');
      setUserName(name || '');
    } catch (error) {
      console.error('Gagal memuat data pengguna:', error);
    }
  };

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Selamat Pagi');
    } else if (hour < 18) {
      setGreeting('Selamat Siang');
    } else {
      setGreeting('Selamat Malam');
    }
  };

  const handleStartCheck = () => {
    if (userRole === 'patient') {
      router.push('/biodata');
    } else {
      router.push('/patient-selection');
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all user data
      await AsyncStorage.multiRemove([
        'userRole',
        'userName',
        'userPhone',
        'userFrom',
        'currentPatient',
        'biodataForm'
      ]);

      // Navigate back to role selection
      router.replace('/role-selection');
    } catch (error) {
      console.error('Gagal keluar:', error);
    }
  };

  const quickActions = [
    {
      id: 'start',
      title: 'Mulai Periksa',
      icon: HeartPulse,
      onPress: handleStartCheck,
      backgroundColor: '#3B82F6',
    },
    {
      id: 'history',
      title: 'Riwayat',
      icon: History,
      onPress: () => router.push('/(tabs)/history'),
      backgroundColor: '#10B981',
    },
    {
      id: 'education',
      title: 'Edukasi',
      icon: BookOpen,
      onPress: () => router.push('/(tabs)/education'),
      backgroundColor: '#8B5CF6',
    },
    {
      id: 'about',
      title: 'Tentang',
      icon: Info,
      onPress: () => router.push('/(tabs)/about'),
      backgroundColor: '#F59E0B',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding: 0}}>
      <ImageBackground
        source={require('../../assets/images/bg-dash.jpg')}
        style={styles.headerImage}
        resizeMode="cover"
      >
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={14} color="#007AFF" />
          <Text style={styles.logoutButtonText}>Keluar</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Image source={require('../../assets/images/icon.png')} style={styles.headerIcon} />
          <View style={styles.divider} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              {greeting}, {userRole === 'patient' ? 'Pasien' : 'Staf'}
            </Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.actionGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionButton, { backgroundColor: action.backgroundColor }]}
              onPress={action.onPress}
            >
              <action.icon size={32} color="#FFFFFF" />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    // padding: 0, // pastikan tidak ada padding horizontal
  },
  header: {
    height: 250,
    overflow: 'hidden',
    padding: 0,
  },
  headerImage: {
    width: '100%',
    height: 250,
    justifyContent: 'flex-end',
    padding: 5,
    marginLeft: 5,
    alignSelf: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginLeft: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divider: {
    width: 2,
    height: 30,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    borderColor: '#007AFF',
  },
  logoutButtonText: {
    color: '#007AFF',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButton: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    fontSize: 16,
    fontFamily: '',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
});