
Action: file_editor create /app/src/hooks/useJobSeekers.ts --file-text "import { useState, useEffect, useMemo } from 'react';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { db } from '../lib/firebase';
import type { JobSeekerProfile } from '../types';

interface UseJobSeekersOptions {
  enableRealTime?: boolean;
  cityFilter?: string;
  categoryFilter?: string;
}

export function useJobSeekers(options: UseJobSeekersOptions = {}) {
  const { enableRealTime = true, cityFilter, categoryFilter } = options;

  const [profiles, setProfiles] = useState<JobSeekerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const loadProfiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const profilesRef = ref(db, 'jobSeekers');
        const profilesQuery = query(profilesRef, orderByChild('createdAt'));

        if (enableRealTime) {
          // Real-time listener
          unsubscribe = onValue(
            profilesQuery,
            (snapshot) => {
              processSnapshot(snapshot);
            },
            (error) => {
              console.error('Real-time listener hatası:', error);
              setError('Veri dinleme hatası');
              setLoading(false);
            }
          );
        } else {
          // Tek seferlik veri çekme
          const snapshot = await get(profilesQuery);
          processSnapshot(snapshot);
        }
      } catch (error) {
        console.error('Profiller yüklenirken hata:', error);
        setError('Profiller yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    const processSnapshot = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const profilesList: JobSeekerProfile[] = [];

        Object.entries(data).forEach(([key, value]) => {
          const profile = value as Omit<JobSeekerProfile, 'id'>;
          
          if (profile.status === 'active') {
            profilesList.push({
              id: key,
              ...profile,
            } as JobSeekerProfile);
          }
        });

        // En yeniden eskiye sırala
        const sortedProfiles = profilesList.sort(
          (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
        );

        setProfiles(sortedProfiles);
        console.log(`✅ ${sortedProfiles.length} iş arayan profili yüklendi`);
      } else {
        setProfiles([]);
      }

      setLoading(false);
    };

    loadProfiles();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [enableRealTime]);

  // Filtrelenmiş profiller
  const filteredProfiles = useMemo(() => {
    let result = profiles;

    // Şehir filtresi
    if (cityFilter && cityFilter !== 'all') {
      result = result.filter((profile) =>
        profile.city.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    // Kategori filtresi
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(
        (profile) => profile.desiredCategory === categoryFilter
      );
    }

    return result;
  }, [profiles, cityFilter, categoryFilter]);

  return {
    profiles: filteredProfiles,
    allProfiles: profiles,
    loading,
    error,
  };
}
"
Observation: Create successful: /app/src/hooks/useJobSeekers.ts
