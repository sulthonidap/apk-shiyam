import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { ArrowLeft } from 'lucide-react-native';

export default function BiodataScreen() {
  const [userRole, setUserRole] = useState('');
  const [biodataForm, setBiodataForm] = useState({
    age: '',
    gender: '',
    illnessDuration: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role || '');
      
      // If staff role, check if we have patient data from new-patient screen
      if (role === 'staff') {
        const patientData = await AsyncStorage.getItem('currentPatient');
        if (patientData) {
          const patient = JSON.parse(patientData);
          setBiodataForm({
            age: patient.age,
            gender: patient.gender,
            illnessDuration: patient.illnessDuration,
            address: patient.address,
          });
        }
      }
    } catch (error) {
      console.error('Gagal memuat data pengguna:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBiodataForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAndContinue = async () => {
    // Validate required fields
    if (!biodataForm.age.trim() || !biodataForm.gender ||
        !biodataForm.illnessDuration.trim() || !biodataForm.address.trim()) {
      Alert.alert('Error', 'Harap isi semua kolom');
      return;
    }
    // Validasi usia harus angka dan > 0
    const usiaInt = parseInt(biodataForm.age, 10);
    if (isNaN(usiaInt) || usiaInt <= 0) {
      Alert.alert('Error', 'Usia harus berupa angka lebih dari 0');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('biodataForm', JSON.stringify(biodataForm));
      setIsLoading(false);
      router.push('/questionnaire');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Gagal menyimpan biodata');
    }
  };

  return (
    <ScrollView style={styles.container}>
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
        <Text style={styles.title}>Formulir Biodata</Text>
        <Text style={styles.subtitle}>Silakan isi informasi berikut</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usia</Text>
          <TextInput
            style={styles.input}
            value={biodataForm.age}
            onChangeText={(value) => handleInputChange('age', value)}
            placeholder="Masukkan usia"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Jenis Kelamin</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={biodataForm.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              style={styles.picker}
            >
              <Picker.Item label="Pilih Jenis Kelamin" value="" />
              <Picker.Item label="Laki-laki" value="male" />
              <Picker.Item label="Perempuan" value="female" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Lama Sakit</Text>
          <TextInput
            style={styles.input}
            value={biodataForm.illnessDuration}
            onChangeText={(value) => handleInputChange('illnessDuration', value)}
            placeholder="Contoh: 2 tahun, 6 bulan"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={biodataForm.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Masukkan alamat lengkap"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleSaveAndContinue}>
          <Text style={styles.continueButtonText}>Simpan & Lanjutkan</Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#007AFF',
  },
  backButton: {
    padding: 8,
  },
  icon: {
    width: 40,
    height: 40,
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    color: '#1F2937',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
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