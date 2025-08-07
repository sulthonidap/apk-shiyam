import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { UserPlus, Users, ArrowLeft } from 'lucide-react-native';

export default function PatientSelectionScreen() {
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
        <Text style={styles.title}>Pilih Opsi Pasien</Text>
        <Text style={styles.subtitle}>Pilih bagaimana Anda ingin melanjutkan</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => router.push('/new-patient')}
        >
          <UserPlus size={48} color="#007AFF" />
          <Text style={styles.optionTitle}>Pasien Baru</Text>
          <Text style={styles.optionDescription}>
            Tambahkan pasien baru dan mulai penilaian
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => {
            // Tambahkan query param acak agar existing-patient refetch
            const ts = Date.now();
            router.push(`/existing-patient?refresh=${ts}`);
          }}
        >
          <Users size={48} color="#007AFF" />
          <Text style={styles.optionTitle}>Pasien Terdaftar</Text>
          <Text style={styles.optionDescription}>
            Pilih dari daftar pasien yang sudah terdaftar
          </Text>
        </TouchableOpacity>
      </View>
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
    width: 2,
    height: 30,
    backgroundColor: 'white',
    opacity: 0.8,
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
  header: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
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
  optionsContainer: {
    gap: 20,
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});