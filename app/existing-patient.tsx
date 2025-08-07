import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Users, Search, ArrowLeft, User } from 'lucide-react-native';

export default function ExistingPatientScreen() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const staffId = await AsyncStorage.getItem('userId');
      if (!staffId) throw new Error('Staff ID tidak ditemukan');
      const res = await fetch(`https://api-shiyam.giescare.com/api/staff/${staffId}/pasien`);
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat daftar pasien');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPatients();
    setRefreshing(false);
  };

  const handleSelectPatient = async (patient: any) => {
    try {
      await AsyncStorage.setItem('currentPatient', JSON.stringify(patient));
      router.push('/biodata');
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih pasien');
    }
  };

  // Filter pasien berdasarkan search
  const filteredPatients = patients.filter((patient) => {
    const keyword = search.toLowerCase();
    return (
      patient.name.toLowerCase().includes(keyword) ||
      patient.phone.toLowerCase().includes(keyword)
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={32} color="white" />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <View style={styles.divider} />
            <Image source={require('../assets/images/icon.png')} style={styles.icon} />
          </View>
        </View>
        <View style={styles.header}>
          <Users size={48} color="#007AFF" />
          <Text style={styles.title}>Pasien Terdaftar</Text>
          <Text style={styles.subtitle}>Pilih pasien untuk melanjutkan penilaian</Text>
        </View>
        <View style={styles.searchCard}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama atau nomor telepon..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        {loading ? (
          <Text style={styles.loadingText}>Memuat...</Text>
        ) : filteredPatients.length === 0 ? (
          <Text style={styles.emptyText}>Tidak ada pasien ditemukan.</Text>
        ) : (
          <View style={styles.listContainer}>
            {filteredPatients.map((patient, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.patientCard}
                onPress={() => handleSelectPatient(patient)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <User size={20} color="#007AFF" style={{ marginRight: 8 }} />
                  <Text style={styles.patientName}>{patient.name}</Text>
                </View>
                <Text style={styles.patientInfo}>No. Telp: {patient.telephone}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      {(loading || refreshing) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 40,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    marginBottom: 2,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    flex: 1,
    borderWidth: 0,
    paddingLeft: 0,
    paddingVertical: 0,
    paddingRight: 0,
  },
  backButton: {
    padding: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#007AFF',
    height: 100,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
}); 