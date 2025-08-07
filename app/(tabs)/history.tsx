import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, Calendar, LogOut, Trash2, Search } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HistoryScreen() {
  const [userRole, setUserRole] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [userPhone, setUserPhone] = useState('');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const role = await AsyncStorage.getItem('userRole');
      const phone = await AsyncStorage.getItem('userPhone');
      const userId = await AsyncStorage.getItem('userId');
      setUserRole(role || '');
      setUserPhone(phone || '');
      if (role === 'patient' && userId) {
        // Fetch dari backend untuk pasien
        const res = await fetch(`https://api-shiyam.giescare.com/api/pemeriksaan?pasien_id=${userId}`);
        const data = await res.json();
        const userName = await AsyncStorage.getItem('userName');
        const userPhone = await AsyncStorage.getItem('userPhone');
        const mapped = Array.isArray(data)
          ? data.map(item => ({
              ...item,
              score: item.skor,
              timestamp: item.tanggal,
              riskCategory: getRiskCategory(item.skor),
              userName: userName || '',
              userPhone: userPhone || '',
            }))
          : [];
        setHistory(mapped);
      } else if (role === 'staff' && userId) {
        // Fetch dari backend untuk staff
        const res = await fetch(`https://api-shiyam.giescare.com/api/staff/${userId}/pemeriksaan`);
        const data = await res.json();
        const mapped = Array.isArray(data)
          ? data.map(item => ({
              ...item,
              score: item.skor,
              timestamp: item.tanggal,
              riskCategory: getRiskCategory(item.skor),
              userName: item.pasien?.name || '',
              userPhone: '',
            }))
          : [];
        setHistory(mapped);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Gagal memuat riwayat:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index: number) => {
    const assessment = history[index];
    if (!assessment.id) {
      Alert.alert('Error', 'ID pemeriksaan tidak ditemukan');
      return;
    }

    Alert.alert(
      'Hapus Riwayat',
      'Apakah Anda yakin ingin menghapus riwayat ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus', style: 'destructive', onPress: async () => {
            try {
              // DELETE ke API
              const response = await fetch(`https://api-shiyam.giescare.com/api/pemeriksaan/${assessment.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
              });

              if (response.ok) {
                // Hapus dari state lokal
                const newHistory = [...history];
                newHistory.splice(index, 1);
                setHistory(newHistory);
                Alert.alert('Sukses', 'Riwayat berhasil dihapus');
              } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.error || 'Gagal menghapus riwayat');
              }
            } catch (error) {
              console.error('Error deleting assessment:', error);
              Alert.alert('Error', 'Gagal menghapus riwayat');
            }
          }
        }
      ]
    );
  };

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getRiskIcon = (riskCategory: string) => {
    switch (riskCategory) {
      case 'low':
        return <CheckCircle size={24} color="#10B981" />;
      case 'medium':
        return <AlertCircle size={24} color="#F59E0B" />;
      case 'high':
        return <XCircle size={24} color="#EF4444" />;
      default:
        return <AlertCircle size={24} color="#6B7280" />;
    }
  };

  const getRiskColor = (riskCategory: string) => {
    switch (riskCategory) {
      case 'low':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'high':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getRiskTitle = (riskCategory: string) => {
    switch (riskCategory) {
      case 'low':
        return 'Risiko Rendah';
      case 'medium':
        return 'Risiko Sedang';
      case 'high':
        return 'Risiko Tinggi';
      default:
        return 'Tidak Diketahui';
    }
  };

  const getRiskCategory = (score: number) => {
    if (score <= 3) return 'low'; // Risiko Rendah
    if (score > 3 && score <= 6) return 'medium'; // Risiko Sedang
    return 'high'; // Risiko Tinggi
  };

  // Helper untuk render card riwayat (agar tidak duplikasi kode)
  const renderHistoryCard = (assessment: any, index: number, showPatientInfo = false) => {
    // Format tanggal dan waktu dari ISO string
    let tanggalStr = '-';
    let waktuStr = '-';
    if (assessment.timestamp) {
      const date = new Date(assessment.timestamp);
      tanggalStr = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
      waktuStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    return (
      <View key={index} style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <View style={styles.riskIndicator}>
            {getRiskIcon(assessment.riskCategory)}
            <Text style={[styles.riskTitle, { color: getRiskColor(assessment.riskCategory) }]}> {getRiskTitle(assessment.riskCategory)} </Text>
          </View>
          <Text style={styles.scoreText}>{assessment.score}/51.5</Text>
        </View>
        {showPatientInfo && (
          <View style={styles.patientInfoRow}>
            <Text style={styles.dateText}>Nama: {assessment.userName || '-'}</Text>
          </View>
        )}
        <View style={styles.historyDetails}>
          <Text style={styles.timeText}>{tanggalStr}, {waktuStr}</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.viewButton} onPress={() => router.push({ pathname: '/history-detail', params: { assessment: JSON.stringify(assessment) } })}>
            <Text style={styles.viewButtonText}>Lihat Detail</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteIconButton}
            onPress={() => handleDelete(index)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
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
            <Text style={styles.title}>Riwayat Penilaian</Text>
            <Text style={styles.subtitle}>
              {userRole === 'patient' ? 'Hasil penilaian Anda' : 'Hasil penilaian pasien'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search dan total data sekarang tampil untuk semua role */}
        <View style={styles.searchCard}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama pasien ..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <Text style={styles.totalDataText}>
          Total data: {history.filter((item) => {
            const keyword = search.toLowerCase();
            return (
              (item.userName && item.userName.toLowerCase().includes(keyword)) ||
              (item.userPhone && item.userPhone.toLowerCase().includes(keyword))
            );
          }).length}
        </Text>
        {userRole === 'patient' ? (
          history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Calendar size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
              <Text style={styles.emptyText}>
                Selesaikan penilaian pertama Anda untuk melihat hasilnya di sini
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history
                .filter((item) => {
                  const keyword = search.toLowerCase();
                  return (
                    (item.userName && item.userName.toLowerCase().includes(keyword)) ||
                    (item.userPhone && item.userPhone.toLowerCase().includes(keyword))
                  );
                })
                .map((assessment, index) => (
                  renderHistoryCard(assessment, index, false)
                ))}
            </View>
          )
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
            <Text style={styles.emptyText}>
              Belum ada hasil penilaian pasien yang bisa ditampilkan di sini
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {history.filter((item) => {
              const keyword = search.toLowerCase();
              return (
                (item.userName && item.userName.toLowerCase().includes(keyword)) ||
                (item.userPhone && item.userPhone.toLowerCase().includes(keyword))
              );
            }).length === 0 ? (
              <View style={styles.emptySearchContainer}>
                <Search size={40} color="#E5E7EB" />
                <Text style={styles.emptySearchText}>Tidak ada hasil ditemukan</Text>
              </View>
            ) : (
              history.filter((item) => {
                const keyword = search.toLowerCase();
                return (
                  (item.userName && item.userName.toLowerCase().includes(keyword)) ||
                  (item.userPhone && item.userPhone.toLowerCase().includes(keyword))
                );
              }).map((assessment, index) => (
                renderHistoryCard(assessment, index, true)
              ))
            )}
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
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
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
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  divider: {
    width: 2,
    height: 30,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
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
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  historyList: {
    gap: 16,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
    position: 'relative',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  deleteIconButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 6,
    marginLeft: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riskTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  historyDetails: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  viewButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  patientInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  patientInfoText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
    height: 48,
    paddingVertical: 0,
    width: '100%',
    alignSelf: 'center',
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
    height: '100%',
  },
  emptySearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  emptySearchText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 12,
  },
  totalDataText: {
    marginLeft: 20,
    marginBottom: 8,
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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