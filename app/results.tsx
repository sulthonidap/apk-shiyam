import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle } from 'lucide-react-native';

export default function ResultsScreen() {
  const [result, setResult] = useState<any>(null);
  const [biodata, setBiodata] = useState<any>(null);

  useEffect(() => {
    loadResult();
  }, []);

  const loadResult = async () => {
    try {
      const latestResult = await AsyncStorage.getItem('latestResult');
      if (latestResult) {
        setResult(JSON.parse(latestResult));
      }
      
      // Load biodata
      const userRole = await AsyncStorage.getItem('userRole');
      let biodataData = null;
      
      if (userRole === 'staff') {
        // Untuk staff, ambil dari currentPatient
        const currentPatientStr = await AsyncStorage.getItem('currentPatient');
        if (currentPatientStr) {
          biodataData = JSON.parse(currentPatientStr);
        }
      } else {
        // Untuk patient, ambil dari biodataForm
        const biodataStr = await AsyncStorage.getItem('biodataForm');
        if (biodataStr) {
          biodataData = JSON.parse(biodataStr);
        }
      }
      
      setBiodata(biodataData);
    } catch (error) {
      console.error('Gagal memuat hasil:', error);
    }
  };

  const getRiskInfo = (riskCategory: string) => {
    switch (riskCategory) {
      case 'low':
        return {
          icon: CheckCircle,
          color: '#10B981',
          backgroundColor: '#ECFDF5',
          title: 'Risiko Rendah',
          message: 'Anda aman untuk berpuasa. Tetap ikuti pola makan sehat dan rutin cek gula darah.',
        };
      case 'medium':
        return {
          icon: AlertCircle,
          color: '#F59E0B',
          backgroundColor: '#FFFBEB',
          title: 'Risiko Sedang',
          message: 'Anda masih bisa berpuasa, namun perlu pengawasan tenaga medis. Konsultasikan ke dokter sebelum Ramadan.',
        };
      case 'high':
        return {
          icon: XCircle,
          color: '#EF4444',
          backgroundColor: '#FEF2F2',
          title: 'Risiko Tinggi',
          message: 'Anda tidak disarankan untuk berpuasa karena berisiko tinggi mengalami komplikasi. Utamakan kesehatan Anda.',
        };
      default:
        return {
          icon: AlertCircle,
          color: '#6B7280',
          backgroundColor: '#F9FAFB',
          title: 'Risiko Tidak Diketahui',
          message: 'Tidak dapat menentukan tingkat risiko.',
        };
    }
  };

  const handleBackToDashboard = () => {
    router.replace('/(tabs)');
  };

  if (!result) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Memuat hasil...</Text>
      </View>
    );
  }

  const riskInfo = getRiskInfo(result.riskCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hasil Penilaian</Text>
        <Text style={styles.subtitle}>Penilaian Risiko Diabetes Selesai</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
      <View style={styles.resultCard}>
        <View style={[styles.riskIndicator, { backgroundColor: riskInfo.backgroundColor }]}>
          <riskInfo.icon size={48} color={riskInfo.color} />
          <Text style={[styles.riskTitle, { color: riskInfo.color }]}>
            {riskInfo.title}
          </Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Total Skor</Text>
            <Text style={[styles.scoreValue, { color: riskInfo.color }]}>
              {result.score}/51.5
            </Text>
          </View>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>Rekomendasi</Text>
          <Text style={styles.messageText}>{riskInfo.message}</Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Detail Penilaian</Text>
        <Text style={styles.detailsText}>
          Date: {new Date(result.timestamp).toLocaleDateString('id-ID')}
        </Text>
        <Text style={styles.detailsText}>
          Time: {new Date(result.timestamp).toLocaleTimeString('id-ID')}
        </Text>
      </View>

      {biodata && (
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Biodata Pasien</Text>
          {biodata.name && (
            <Text style={styles.detailsText}>Nama: {biodata.name}</Text>
          )}
          {biodata.phone && (
            <Text style={styles.detailsText}>No. Telp: {biodata.phone}</Text>
          )}
          {biodata.age && (
            <Text style={styles.detailsText}>Usia: {biodata.age}</Text>
          )}
          {biodata.gender && (
            <Text style={styles.detailsText}>
              Jenis Kelamin: {biodata.gender === 'male' ? 'Laki-laki' : biodata.gender === 'female' ? 'Perempuan' : '-'}
            </Text>
          )}
          {biodata.illnessDuration && (
            <Text style={styles.detailsText}>Lama Sakit: {biodata.illnessDuration}</Text>
          )}
          {biodata.address && (
            <Text style={styles.detailsText}>Alamat: {biodata.address}</Text>
          )}
        </View>
      )}

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleBackToDashboard}
        >
          <Text style={styles.primaryButtonText}>Kembali ke Beranda</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.push('/(tabs)/history')}
        >
          <Text style={styles.secondaryButtonText}>Lihat Riwayat</Text>
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  resultCard: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  riskIndicator: {
    padding: 32,
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  riskTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  messageContainer: {
    padding: 24,
  },
  messageTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  detailsCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  actionContainer: {
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
});