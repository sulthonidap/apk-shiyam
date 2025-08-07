import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ArrowLeft } from 'lucide-react-native';

const questions = [
  {
    id: 'q1',
    question: 'Apakah jenis diabetes Anda?',
    options: [
      { label: 'Tipe 1', value: 'a', score: 1 },
      { label: 'Tipe 2', value: 'b', score: 0 }
    ]
  },
  {
    id: 'q2',
    question: 'Berapa lama Anda menderita diabetes?',
    options: [
      { label: '≥ 10 tahun', value: 'a', score: 1 },
      { label: '< 10 tahun', value: 'b', score: 0 }
    ]
  },
  {
    id: 'q3',
    question: 'Hipoglikemi (kadar gula darah rendah) apa yang pernah anda alami?',
    options: [
      { label: 'Hipoglikemia yang tidak disadari', value: 'a', score: 6.5 },
      { label: 'Hipoglikemia berat saat ini/akhir-akhir ini', value: 'b', score: 5.5 },
      { label: 'Hipoglikemia beberapa kali tiap minggu', value: 'c', score: 3.5 },
      { label: 'Hipoglikemia kurang dari 1 kali setiap minggu', value: 'd', score: 1 },
      { label: 'Tidak ada riwayat hipoglikemia', value: 'e', score: 0 }
    ]
  },
  {
    id: 'q4',
    question: 'Berapa kadar HbA1c terakhir?',
    options: [
      { label: '> 9% (11.7 mmol/L)', value: 'a', score: 2 },
      { label: '7.5 – 9% (9.4 – 11.7 mmol/L)', value: 'b', score: 1 },
      { label: '< 7% (9.4 mmol/L)', value: 'c', score: 0 }
    ]
  },
  {
    id: 'q5',
    question: 'Apa pengobatan yang Anda peroleh saat ini?',
    options: [
      { label: 'Injeksi mixed insulin beberapa kali sehari', value: 'a', score: 3 },
      { label: 'Basal bolus/insulin pump', value: 'b', score: 2.5 },
      { label: 'Injeksi mixed insulin sekali sehari', value: 'c', score: 2 },
      { label: 'Basal insulin', value: 'd', score: 1.5 },
      { label: 'Glibenclamide', value: 'e', score: 1 },
      { label: 'Gliclazide/MR atau Glimepiride atau Repeglanide', value: 'f', score: 0.5 },
      { label: 'Terapi lainnya (selain sulfonilurea atau insulin)', value: 'g', score: 0 }
    ]
  },
  {
    id: 'q6',
    question: 'Apakah Anda melakukan pemantauan gula darah secara mandiri sesuai anjuran?',
    options: [
      { label: 'Tidak melakukan', value: 'a', score: 2 },
      { label: 'Melakukan, tetapi kadang-kadang', value: 'b', score: 1 },
      { label: 'Melakukan sesuai anjuran', value: 'c', score: 0 }
    ]
  },
  {
    id: 'q7',
    question: 'Apakah ada riwayat komplikasi akut berupa DKA/Hiperglikemi Hiperosmolar Nonketotik Koma dalam waktu:',
    options: [
      { label: '3 bulan yang lalu', value: 'a', score: 3 },
      { label: '6 bulan yang lalu', value: 'b', score: 2 },
      { label: '12 bulan yang lalu', value: 'c', score: 1 },
      { label: 'Tidak ada riwayat', value: 'd', score: 0 }
    ]
  },
  {
    id: 'q8',
    question: 'Apakah ada komplikasi/penyakit penyerta makrovaskuler (pembuluh darah besar seperti penyakit jantung koroner, stroke, penyakir arteri perifer)?',
    options: [
      { label: 'Komplikasi makrovaskuler yang tidak stabil', value: 'a', score: 6.5 },
      { label: 'Komplikasi makrovaskuler yang stabil', value: 'b', score: 2 },
      { label: 'Tidak ada komplikasi makrovaskuler', value: 'c', score: 0 }
    ]
  },
  {
    id: 'q9',
    question: 'Jika ada komplikasi atau penyakit penyerta berupa penyakit ginjal, berdasarkan hasil pemerikasaan laboratorium, berapa taksiran rerata filtrasi/fungsi ginjal (GFR) anda',
    options: [
      { label: '< 30 mL/menit', value: 'a', score: 6.5 },
      { label: '30 – 45 mL/menit', value: 'b', score: 4 },
      { label: '45 – 60 mL/menit', value: 'c', score: 2 },
      { label: '> 60 mL/menit', value: 'd', score: 0 }
    ]
  },
  {
    id: 'q10',
    question: 'Kehamilan:',
    options: [
      { label: 'Kehamilan tidak dalam target', value: 'a', score: 6.5 },
      { label: 'Kehamilan dalam target', value: 'b', score: 3.5 },
      { label: 'Tidak hamil', value: 'c', score: 0 }
    ]
  },
  {
    id: 'q11',
    question: 'Status kelemahan dan fungsi kognitif:',
    options: [
      { label: 'Kerusakan fungsi kognitif dan lemah', value: 'a', score: 6.5 },
      { label: 'Usia > 70 tahun tanpa ada pendamping di rumah', value: 'b', score: 3.5 },
      { label: 'Tidak ada kelemahan atau kehilangan fungsi kognitif', value: 'c', score: 0 }
    ]
  },
  {
    id: 'q12',
    question: 'Pekerjaan fisik:',
    options: [
      { label: 'Pekerjaan fisik dengan intensitas tinggi', value: 'a', score: 4 },
      { label: 'Pekerjaan fisik dengan intensitas sedang', value: 'b', score: 2 },
      { label: 'Tidak ada pekerjaan fisik', value: 'c', score: 0 }
    ]
  },
  {
    id: 'q13',
    question: 'Bagaimana pengalaman Ramadan sebelumnya?',
    options: [
      { label: 'Semuanya pengalaman negatif ( kejadian yang tidak diharapkan/komplikasi seperti hipoglikemi, hiperglikemi, dehidrasi, atau ketoasidosis)', value: 'a', score: 1 },
      { label: 'Tidak ada pengalaman negatif atau positif', value: 'b', score: 0 }
    ]
  },
  {
    id: 'q14',
    question: 'Berapa lama puasa di daerah/kota Anda?',
    options: [
      { label: '≥ 16 jam', value: 'a', score: 1 },
      { label: '< 16 jam', value: 'b', score: 0 }
    ]
  }
];

export default function QuestionnaireScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [userGender, setUserGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserGender();
  }, []);

  const loadUserGender = async () => {
    try {
      const userRole = await AsyncStorage.getItem('userRole');
      
      if (userRole === 'staff') {
        // Untuk staff, ambil gender dari currentPatient
        const currentPatientStr = await AsyncStorage.getItem('currentPatient');
        if (currentPatientStr) {
          const currentPatient = JSON.parse(currentPatientStr);
          setUserGender(currentPatient.gender || '');
        }
      } else {
        // Untuk patient, ambil gender dari biodataForm
        const biodataStr = await AsyncStorage.getItem('biodataForm');
        if (biodataStr) {
          const biodata = JSON.parse(biodataStr);
          setUserGender(biodata.gender || '');
        }
      }
    } catch (error) {
      console.error('Gagal memuat data gender:', error);
    }
  };

  // Filter questions based on gender
  const filteredQuestions = questions.filter(question => {
    if (question.id === 'q10' && userGender === 'male') {
      return false; // Skip pregnancy question for males
    }
    return true;
  });

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleAnswerSelect = (option: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    Object.values(answers).forEach((answer: any) => {
      totalScore += answer.score;
    });
    return totalScore;
  };

  const getRiskCategory = (score: number) => {
    if (score < 3) return 'low';
    if (score <= 7) return 'medium';
    return 'high';
  };

  const handleNext = async () => {
    // Auto-answer for skipped questions
    if (!answers[currentQuestion.id]) {
      // For pregnancy question (q10), auto-answer "Tidak hamil" for males
      if (currentQuestion.id === 'q10' && userGender === 'male') {
        setAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: { label: 'Tidak hamil', value: 'c', score: 0 }
        }));
        // Continue to next question after auto-answer
        if (isLastQuestion) {
          // Handle last question logic - will continue to the existing logic below
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
          return;
        }
      } else {
        Alert.alert('Belum Lengkap', 'Silakan pilih jawaban sebelum melanjutkan');
        return;
      }
    }

    if (isLastQuestion) {
      setIsLoading(true);
      // Calculate final score and navigate to results
      const score = calculateScore();
      const riskCategory = getRiskCategory(score);

      try {
        // Ambil user info
        const userRole = await AsyncStorage.getItem('userRole');
        let pasien_id = null;
        if (userRole === 'staff') {
          const currentPatientStr = await AsyncStorage.getItem('currentPatient');
          const currentPatient = currentPatientStr ? JSON.parse(currentPatientStr) : null;
          pasien_id = currentPatient?.id;
        } else {
          const userId = await AsyncStorage.getItem('userId');
          pasien_id = userId ? parseInt(userId) : null;
        }
        // Ambil biodata
        let biodata: any = {};
        if (userRole === 'staff') {
          // Untuk staff, ambil biodata dari currentPatient (data lengkap)
          const currentPatientStr = await AsyncStorage.getItem('currentPatient');
          if (currentPatientStr) {
            const currentPatient = JSON.parse(currentPatientStr);
            biodata = {
              age: currentPatient.age || '',
              gender: currentPatient.gender || '',
              illnessDuration: currentPatient.illnessDuration || '',
              address: currentPatient.address || ''
            };
          }
        } else {
          // Untuk patient, ambil biodata dari biodataForm
          const biodataStr = await AsyncStorage.getItem('biodataForm');
          biodata = biodataStr ? JSON.parse(biodataStr) : {};
        }
        
        // Siapkan data untuk pemeriksaan
        const tanggal = new Date().toISOString(); // simpan full ISO string
        const body = {
          tanggal,
          pasien_id,
          usia: biodata.age && !isNaN(parseInt(biodata.age, 10)) ? parseInt(biodata.age, 10) : null,
          jenis_kelamin: biodata.gender || '',
          lama_sakit: biodata.illnessDuration || '',
          alamat: biodata.address || '',
          skor: score
        };
        // POST ke backend
        const pemeriksaanRes = await fetch('https://api-shiyam.giescare.com/api/pemeriksaan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        // Hapus Alert debug response backend

        const result = {
          score,
          riskCategory,
          answers,
          timestamp: new Date().toISOString(),
        };
        await AsyncStorage.setItem('latestResult', JSON.stringify(result));

        // Save to history
        const existingHistory = await AsyncStorage.getItem('assessmentHistory');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        history.unshift(result);
        await AsyncStorage.setItem('assessmentHistory', JSON.stringify(history));

        setIsLoading(false);
        router.push('/results');
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Gagal menyimpan hasil penilaian');
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleBack = () => {
    const hasAnswered = Object.keys(answers).length > 0;
    if (hasAnswered) {
      Alert.alert(
        'Konfirmasi',
        'Kamu yakin ingin kembali? Jawaban yang sudah diisi akan hilang.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Ya, Kembali', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={32} color="white" />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <View style={styles.divider} />
          <Image source={require('../assets/images/icon.png')} style={styles.icon} />
        </View>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Kuesioner</Text>
        <Text style={styles.subtitle}>Penilaian Risiko Diabetes</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Pertanyaan {currentQuestionIndex + 1} dari {filteredQuestions.length}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>
            <Text style={styles.questionNumber}>{currentQuestionIndex + 1}. </Text>
            {currentQuestion.question}
          </Text>


          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  answers[currentQuestion.id]?.value === option.value && styles.selectedOption
                ]}
                onPress={() => handleAnswerSelect(option)}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.radioButton,
                    answers[currentQuestion.id]?.value === option.value && styles.radioButtonSelected
                  ]} />
                  <Text style={[
                    styles.optionText,
                    answers[currentQuestion.id]?.value === option.value && styles.selectedOptionText
                  ]}>
                    {option.value}. {option.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.previousButton, isFirstQuestion && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={isFirstQuestion}
        >
          <ChevronLeft size={20} color={isFirstQuestion ? "#9CA3AF" : "#007AFF"} />
          <Text style={[styles.navButtonText, isFirstQuestion && styles.disabledButtonText]}>
            Sebelum
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? 'Selesai' : 'Lanjut'}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    paddingTop: 60,
    backgroundColor: '#007AFF',
  },
  backButton: {
    padding: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 2,
    height: 30,
    backgroundColor: 'white',
    opacity: 0.8,
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
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
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
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionNumber: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    lineHeight: 24,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#007AFF',
    fontFamily: 'Inter-SemiBold',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
  },
  previousButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  navButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
    marginLeft: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  disabledButtonText: {
    color: '#9CA3AF',
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