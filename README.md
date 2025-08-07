# SHIYAM - Diabetes Risk Assessment

## Deskripsi Aplikasi

SHIYAM adalah aplikasi mobile yang dikembangkan menggunakan React Native dan Expo untuk melakukan penilaian risiko diabetes pada pasien. Aplikasi ini dirancang untuk digunakan oleh tenaga kesehatan (staf) dan pasien dalam mengelola dan memantau risiko diabetes.

## Fitur Utama

### 🏥 **Untuk Staf Kesehatan**
- Login sebagai staf medis
- Manajemen data pasien (pasien baru dan pasien existing)
- Melihat riwayat penilaian pasien
- Dashboard dengan statistik dan informasi pasien

### 👤 **Untuk Pasien**
- Login sebagai pasien
- Pengisian kuesioner penilaian risiko diabetes
- Melihat hasil penilaian dan rekomendasi
- Riwayat penilaian sebelumnya

### 📋 **Kuesioner Penilaian Risiko**
Aplikasi menggunakan kuesioner komprehensif yang mencakup:
- Jenis diabetes (Tipe 1/Tipe 2)
- Durasi menderita diabetes
- Riwayat hipoglikemia
- Kadar HbA1c
- Jenis pengobatan
- Pemantauan gula darah mandiri
- Riwayat komplikasi akut (DKA/Hiperglikemi Hiperosmolar)
- Komplikasi makrovaskuler
- Fungsi ginjal (GFR)
- Status kehamilan

## Teknologi yang Digunakan

- **Frontend**: React Native dengan Expo
- **Navigation**: Expo Router
- **State Management**: AsyncStorage untuk penyimpanan lokal
- **UI Components**: Lucide React Native untuk ikon
- **Styling**: StyleSheet dengan font Inter
- **Platform**: iOS, Android, dan Web

## Struktur Aplikasi

```
app/
├── (tabs)/           # Tab navigation untuk dashboard
├── splash.tsx        # Splash screen
├── role-selection.tsx # Pemilihan peran (Pasien/Staf)
├── patient-login.tsx # Login pasien
├── staff-login.tsx   # Login staf
├── questionnaire.tsx # Kuesioner penilaian risiko
├── results.tsx       # Hasil penilaian
├── history.tsx       # Riwayat penilaian
└── ...
```

## Cara Menjalankan

1. Install dependencies:
```bash
npm install
```

2. Jalankan aplikasi:
```bash
npm run dev
# atau
npx expo start
```

3. Build untuk berbagai platform:

### Build untuk Web
```bash
npm run build:web
# atau
expo export --platform web
```

### Build untuk Android
```bash
# Menggunakan EAS Build
eas build --platform android

# Atau menggunakan Expo Classic Build
expo build:android
```

### Build untuk iOS
```bash
# Menggunakan EAS Build
eas build --platform ios

# Atau menggunakan Expo Classic Build
expo build:ios
```

### Build untuk semua platform
```bash
eas build --platform all
```

## Prasyarat Build

- **EAS CLI**: Install dengan `npm install -g @expo/eas-cli`
- **Expo Account**: Login dengan `eas login`
- **Konfigurasi**: Pastikan file `eas.json` sudah dikonfigurasi dengan benar

## Versi

**Versi 1.0.0** - Aplikasi penilaian risiko diabetes dengan fitur lengkap untuk staf dan pasien.

---

*Dikembangkan untuk membantu tenaga kesehatan dalam melakukan penilaian risiko diabetes secara sistematis dan terstruktur.*