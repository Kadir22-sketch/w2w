Mükemmel! Yapıyı anladım. Şimdi adım adım başlayacağım:

## 🚀 FAZ 1: İş Arayan Profilleri - Type Definitions & Firebase Service
Action: file_editor str_replace /app/src/types/index.ts --old-str "// Kullanıcı tipi
export interface User {
  id: string;
  email: string;
  phone?: string;
  createdAt: number;
  role?: 'admin' | 'user';
}" --new-str "// Kullanıcı tipi
export interface User {
  id: string;
  email: string;
  phone?: string;
  createdAt: number;
  role?: 'admin' | 'user';
  userType?: 'employer' | 'jobseeker'; // Yeni: Kullanıcı türü
}

// İş Arayan Profil Tipi
export interface JobSeekerProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  age?: number;
  city: string;
  // Beceriler (çoklu seçim)
  skills: string[];
  // Deneyim yılı
  experienceYears: number;
  // Eğitim durumu
  education: 'ilkokul' | 'ortaokul' | 'lise' | 'onlisans' | 'lisans' | 'yukseklisans' | 'doktora';
  // İstenen pozisyon/kategori
  desiredPosition: string;
  desiredCategory: string;
  // Çalışma tercihi
  workPreference: string[]; // ['Tam Zamanlı', 'Yarı Zamanlı', 'Esnek']
  // Hakkımda
  about: string;
  // Durum
  status: 'active' | 'inactive';
  createdAt: number;
  updatedAt: number;
}"
Observation: Edit was successful.
