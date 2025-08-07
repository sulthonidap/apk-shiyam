import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { ArrowLeft } from 'lucide-react-native';

export default function NewPatientScreen() {
  const [patientData, setPatientData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    illnessDuration: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAndContinue = async () => {
    // Validate required fields
    if (!patientData.name.trim() || !patientData.phone.trim() || 
        !patientData.age.trim() || !patientData.gender ||
        !patientData.illnessDuration.trim() || !patientData.address.trim()) {
      Alert.alert('Error', 'Harap isi semua kolom');
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: POST ke /api/users
      const response = await fetch('https://api-shiyam.giescare.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patientData.name,
          telephone: patientData.phone,
          age: patientData.age,
          gender: patientData.gender,
          illnessDuration: patientData.illnessDuration,
          address: patientData.address,
          role: 'pasien',
        }),
      });
      const user = await response.json();
      const pasien_id = user.id;
      if (!pasien_id) {
        setIsLoading(false);
        Alert.alert('Error', 'Gagal mendapatkan ID pasien dari backend');
        return;
      }
      // Step 2: Simpan currentPatient ke AsyncStorage (dengan id)
      await AsyncStorage.setItem('currentPatient', JSON.stringify({ ...patientData, id: pasien_id }));
      // Step 3: POST relasi staf-pasien
      const staffId = await AsyncStorage.getItem('userId');
      if (staffId) {
        await fetch(`https://api-shiyam.giescare.com/api/staff/${staffId}/pasien`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pasien_id }),
        });
      }
      setIsLoading(false);
      // Step 4: Redirect ke questionnaire
      router.push('/questionnaire');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Gagal menyimpan data pasien');
    }
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>Pasien Baru</Text>
        <Text style={styles.subtitle}>Masukkan informasi pasien</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama</Text>
            <TextInput
              style={styles.input}
              value={patientData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Masukkan nama lengkap pasien"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <TextInput
              style={styles.input}
              value={patientData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Masukkan nomor telepon"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usia</Text>
            <TextInput
              style={styles.input}
              value={patientData.age}
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
                selectedValue={patientData.gender}
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
              value={patientData.illnessDuration}
              onChangeText={(value) => handleInputChange('illnessDuration', value)}
              placeholder="cth: 2 tahun, 6 bulan"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={patientData.address}
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
      </ScrollView>
      {isLoading && (
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#007AFF',
  },
  backButton: {
    padding: 8,
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
    width: 30,
    height: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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