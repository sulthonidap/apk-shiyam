import { View, Text, StyleSheet, Image } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Cek data user di AsyncStorage
      const userRole = await AsyncStorage.getItem('userRole');
      const userName = await AsyncStorage.getItem('userName');
      const userPhone = await AsyncStorage.getItem('userPhone');
      if (userRole && userName && userPhone) {
        router.replace('/(tabs)');
      } else {
        router.replace('/role-selection');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../assets/images/icon.png')} style={styles.icon} />
        <Text style={styles.title}>SHIYAM</Text>
        <Text style={styles.subtitle}>Diabetes Risk Assessment</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 14,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
});