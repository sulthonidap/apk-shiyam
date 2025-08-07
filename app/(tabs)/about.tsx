import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Shield, Users, Award, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AboutScreen() {
  const features = [
    {
      icon: Shield,
      title: 'Penilaian Medis',
      description: 'Evaluasi risiko diabetes komprehensif berdasarkan pedoman medis',
    },
    {
      icon: Shield,
      title: 'Keamanan Utama',
      description: 'Memprioritaskan keselamatan pasien dengan kategorisasi risiko berbasis bukti',
    },
    {
      icon: Users,
      title: 'Antarmuka Ganda',
      description: 'Alur kerja terpisah untuk pasien dan staf kesehatan',
    },
    {
      icon: Award,
      title: 'Kualitas Profesional',
      description: 'Dibuat untuk lingkungan layanan kesehatan dengan akurasi klinis',
    },
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        'userRole',
        'userName',
        'userPhone',
        'userFrom',
        'currentPatient',
        'biodataForm'
      ]);
      router.replace('/role-selection');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={14} color="#FFFFFF" />
          <Text style={styles.logoutButtonText}>Keluar</Text>
        </TouchableOpacity>
        <Image source={require('../../assets/images/icon.png')} style={styles.icon} />
        <Text style={styles.title}>Shiyam</Text>
        <Text style={styles.subtitle}>Penilaian Risiko Diabetes</Text>
        <Text style={styles.version}>Versi 1.0.0</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
      <View style={styles.content}>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Tentang Aplikasi</Text>
          <Text style={styles.descriptionText}>
            Aplikasi ini dirancang untuk membantu mengukur tingkat risiko pasien diabetes 
            dalam menjalankan ibadah puasa. Melalui serangkaian pertanyaan dan analisis 
            sederhana, aplikasi memberikan rekomendasi apakah pasien aman untuk berpuasa, 
            perlu konsultasi medis, atau sebaiknya tidak berpuasa demi keselamatan.
          </Text>
        </View>

        

        <View style={styles.howItWorksCard}>
          <Text style={styles.howItWorksTitle}>Cara Kerja</Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Lengkapi formulir biodata dengan informasi dasar</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Jawab kuesioner kesehatan yang komprehensif</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Dapatkan penilaian risiko dan rekomendasi</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Lacak riwayat dan kemajuan penilaian</Text>
            </View>
          </View>
        </View>

      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.7,
  },
  logoutButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    zIndex: 1,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  content: {
    padding: 20,
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  descriptionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  howItWorksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  howItWorksTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 20,
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
    flex: 1,
    marginTop: 4,
  },
  disclaimerCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  disclaimerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginBottom: 12,
  },
  disclaimerText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#B91C1C',
    lineHeight: 24,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});