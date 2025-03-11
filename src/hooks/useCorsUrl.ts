
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// This hook takes a Firebase Storage path and returns a CORS-friendly URL
export const useCorsUrl = (path: string | null | undefined) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      if (!path) {
        setUrl(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const storageRef = ref(storage, path);
        // Get download URL with token that includes CORS headers
        const downloadUrl = await getDownloadURL(storageRef);
        
        // Make sure the URL has the right origin headers
        const finalUrl = new URL(downloadUrl);
        
        // Add Firebase CORS domain if not already there
        if (!finalUrl.searchParams.has('alt')) {
          finalUrl.searchParams.append('alt', 'media');
        }
        
        setUrl(finalUrl.toString());
      } catch (err) {
        console.error('Error getting CORS URL:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();
  }, [path]);

  return { url, loading, error };
};
