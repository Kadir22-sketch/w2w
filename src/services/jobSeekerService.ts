
Action: file_editor create /app/src/services/jobSeekerService.ts --file-text "import { ref, push, set, get, query, orderByChild, equalTo, remove, update } from 'firebase/database';
import { db } from '../lib/firebase';
import type { JobSeekerProfile } from '../types';

/**
 * İş Arayan Profil Servisi
 * Firebase Realtime Database ile CRUD işlemleri
 */

// Yeni profil oluştur
export async function createJobSeekerProfile(data: Omit<JobSeekerProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = Date.now();
  
  const profileData: Omit<JobSeekerProfile, 'id'> = {
    ...data,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  const profilesRef = ref(db, 'jobSeekers');
  const newProfileRef = await push(profilesRef, profileData);
  
  if (!newProfileRef.key) {
    throw new Error('Profil ID oluşturulamadı');
  }

  console.log('✅ İş arayan profili oluşturuldu:', newProfileRef.key);
  return newProfileRef.key;
}

// Profil güncelle
export async function updateJobSeekerProfile(profileId: string, data: Partial<JobSeekerProfile>): Promise<void> {
  const profileRef = ref(db, `jobSeekers/${profileId}`);
  
  const updateData = {
    ...data,
    updatedAt: Date.now(),
  };

  await update(profileRef, updateData);
  console.log('✅ İş arayan profili güncellendi:', profileId);
}

// Kullanıcının profilini getir
export async function getJobSeekerProfileByUserId(userId: string): Promise<JobSeekerProfile | null> {
  const profilesRef = ref(db, 'jobSeekers');
  const profileQuery = query(profilesRef, orderByChild('userId'), equalTo(userId));
  
  const snapshot = await get(profileQuery);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    const profileId = Object.keys(data)[0];
    const profile = data[profileId];
    
    return {
      id: profileId,
      ...profile,
    } as JobSeekerProfile;
  }
  
  return null;
}

// ID ile profil getir
export async function getJobSeekerProfileById(profileId: string): Promise<JobSeekerProfile | null> {
  const profileRef = ref(db, `jobSeekers/${profileId}`);
  const snapshot = await get(profileRef);
  
  if (snapshot.exists()) {
    return {
      id: profileId,
      ...snapshot.val(),
    } as JobSeekerProfile;
  }
  
  return null;
}

// Tüm aktif profilleri getir
export async function getAllJobSeekerProfiles(): Promise<JobSeekerProfile[]> {
  const profilesRef = ref(db, 'jobSeekers');
  const snapshot = await get(profilesRef);
  
  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();
  const profiles: JobSeekerProfile[] = [];

  Object.entries(data).forEach(([key, value]) => {
    const profile = value as Omit<JobSeekerProfile, 'id'>;
    if (profile.status === 'active') {
      profiles.push({
        id: key,
        ...profile,
      } as JobSeekerProfile);
    }
  });

  // En yeniden eskiye sırala
  return profiles.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// Profil sil
export async function deleteJobSeekerProfile(profileId: string): Promise<void> {
  const profileRef = ref(db, `jobSeekers/${profileId}`);
  await remove(profileRef);
  console.log('✅ İş arayan profili silindi:', profileId);
}

// Profil durumunu değiştir
export async function toggleJobSeekerProfileStatus(profileId: string, status: 'active' | 'inactive'): Promise<void> {
  const profileRef = ref(db, `jobSeekers/${profileId}`);
  await update(profileRef, {
    status,
    updatedAt: Date.now(),
  });
  console.log(`✅ İş arayan profil durumu değiştirildi: ${profileId} -> ${status}`);
}

// Şehre göre filtrele
export async function getJobSeekersByCity(city: string): Promise<JobSeekerProfile[]> {
  const profilesRef = ref(db, 'jobSeekers');
  const cityQuery = query(profilesRef, orderByChild('city'), equalTo(city));
  
  const snapshot = await get(cityQuery);
  
  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();
  const profiles: JobSeekerProfile[] = [];

  Object.entries(data).forEach(([key, value]) => {
    const profile = value as Omit<JobSeekerProfile, 'id'>;
    if (profile.status === 'active') {
      profiles.push({
        id: key,
        ...profile,
      } as JobSeekerProfile);
    }
  });

  return profiles.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// Kategoriye göre filtrele
export async function getJobSeekersByCategory(category: string): Promise<JobSeekerProfile[]> {
  const profilesRef = ref(db, 'jobSeekers');
  const snapshot = await get(profilesRef);
  
  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();
  const profiles: JobSeekerProfile[] = [];

  Object.entries(data).forEach(([key, value]) => {
    const profile = value as Omit<JobSeekerProfile, 'id'>;
    if (profile.status === 'active' && profile.desiredCategory === category) {
      profiles.push({
        id: key,
        ...profile,
      } as JobSeekerProfile);
    }
  });

  return profiles.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}
"
Observation: Create successful: /app/src/services/jobSeekerService.ts
