import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Stethoscope, User, UserCheck, Trash } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RoleSelectionScreen() {
  const handleRoleSelect = (role: 'patient' | 'staff') => {
    if (role === 'patient') {
      router.push('/patient-login');
    } else {
      router.push('/staff-login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/icon.png')} style={styles.icon} />
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>Silakan pilih peran Anda</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.roleButton} 
          onPress={() => handleRoleSelect('patient')}
        >
          <User size={48} color="#007AFF" />
          <Text style={styles.buttonText}>Pasien</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.roleButton} 
          onPress={() => handleRoleSelect('staff')}
        >
          <Stethoscope size={48} color="#007AFF" />
          <Text style={styles.buttonText}>Staf</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={async () => {
            await AsyncStorage.clear();
            alert('AsyncStorage cleared!');
          }}
        >
          <Trash size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.clearButtonText}>Clear Storage</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>Versi 1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 8,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  versionText: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});