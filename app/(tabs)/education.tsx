import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, BookOpen, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function EducationScreen() {
  const riskCategories = [
    {
      type: 'low',
      icon: CheckCircle,
      color: '#10B981',
      backgroundColor: '#ECFDF5',
      title: 'Risiko Rendah (Skor 0-3)',
      content: 'Anda aman untuk berpuasa. Tetap ikuti pola makan sehat dan rutin cek gula darah. Pastikan untuk tetap mengonsumsi obat diabetes sesuai anjuran dokter dan jangan lupa untuk sahur serta berbuka dengan menu yang seimbang.',
    },
    {
      type: 'medium',
      icon: AlertCircle,
      color: '#F59E0B',
      backgroundColor: '#FFFBEB',
      title: 'Risiko Sedang (Skor 3.5-6)',
      content: 'Anda masih bisa berpuasa, namun perlu pengawasan tenaga medis. Konsultasikan ke dokter sebelum Ramadan untuk menyesuaikan dosis obat dan jadwal minum obat. Pantau gula darah lebih sering dan segera buka puasa jika merasa tidak sehat.',
    },
    {
      type: 'high',
      icon: XCircle,
      color: '#EF4444',
      backgroundColor: '#FEF2F2',
      title: 'Risiko Tinggi (Skor >6)',
      content: 'Anda tidak disarankan untuk berpuasa karena berisiko tinggi mengalami komplikasi. Utamakan kesehatan Anda. Konsultasikan dengan dokter spesialis dan pertimbangkan untuk tidak berpuasa pada tahun ini. Ada cara lain untuk beribadah di bulan Ramadan.',
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
        <View style={styles.headerContent}>
          <Image source={require('../../assets/images/icon.png')} style={styles.headerIcon} />
          <View style={styles.divider} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Konten Edukasi</Text>
            <Text style={styles.subtitle}>
              Panduan Puasa untuk Penderita Diabetes
            </Text>
          </View>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }}>
      <View style={styles.content}>
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Tentang Penilaian Risiko</Text>
          <Text style={styles.introText}>
            Penilaian risiko ini membantu menentukan apakah penderita diabetes aman untuk berpuasa 
            berdasarkan kondisi kesehatan, riwayat komplikasi, dan persiapan puasa. Setiap kategori 
            risiko memiliki rekomendasi khusus untuk menjaga kesehatan selama bulan Ramadan.
          </Text>
        </View>

        {riskCategories.map((category) => (
          <View key={category.type} style={styles.categoryCard}>
            <View style={[styles.categoryHeader, { backgroundColor: category.backgroundColor }]}>
              <category.icon size={24} color={category.color} />
              <Text style={[styles.categoryTitle, { color: category.color }]}>
                {category.title}
              </Text>
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryText}>{category.content}</Text>
            </View>
          </View>
        ))}

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips Umum untuk Penderita Diabetes</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Konsultasi dengan dokter sebelum memutuskan berpuasa</Text>
            <Text style={styles.tipItem}>• Monitor gula darah secara teratur</Text>
            <Text style={styles.tipItem}>• Perhatikan tanda-tanda hipoglikemia atau hiperglikemia</Text>
            <Text style={styles.tipItem}>• Makan sahur yang sehat dan bergizi seimbang</Text>
            <Text style={styles.tipItem}>• Hindari makanan yang terlalu manis saat berbuka</Text>
            <Text style={styles.tipItem}>• Tetap terhidrasi dengan baik</Text>
            <Text style={styles.tipItem}>• Segera buka puasa jika merasa tidak sehat</Text>
          </View>
        </View>

        <View style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <AlertCircle size={24} color="#EF4444" />
            <Text style={styles.warningTitle}>Peringatan Penting</Text>
          </View>
          <Text style={styles.warningText}>
            Aplikasi ini hanya sebagai alat bantu penilaian awal. Keputusan akhir untuk berpuasa 
            harus selalu dikonsultasikan dengan dokter atau tenaga medis yang berkompeten.
          </Text>
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
    height: 60,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'left',
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
  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  introTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  introText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 12,
  },
  categoryContent: {
    padding: 20,
    paddingTop: 0,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 12,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#B91C1C',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
});