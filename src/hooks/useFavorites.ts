import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch favorites on mount
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('template_id')
          .eq('user_id', user.id);

        if (error) throw error;

        setFavorites(data?.map((f) => f.template_id) || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = useCallback(
    async (templateId: string) => {
      if (!user) {
        toast.error('Please sign in to save favorites');
        return;
      }

      const isFavorited = favorites.includes(templateId);

      // Optimistic update
      if (isFavorited) {
        setFavorites((prev) => prev.filter((id) => id !== templateId));
      } else {
        setFavorites((prev) => [...prev, templateId]);
      }

      try {
        if (isFavorited) {
          // Remove from favorites
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('template_id', templateId);

          if (error) throw error;
        } else {
          // Add to favorites
          const { error } = await supabase.from('favorites').insert({
            user_id: user.id,
            template_id: templateId,
          });

          if (error) throw error;
          toast.success('Template saved to favorites!');
        }
      } catch (error: any) {
        // Revert optimistic update on error
        if (isFavorited) {
          setFavorites((prev) => [...prev, templateId]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== templateId));
        }
        console.error('Error toggling favorite:', error);
        toast.error('Failed to update favorites');
      }
    },
    [user, favorites]
  );

  const isFavorite = useCallback(
    (templateId: string) => favorites.includes(templateId),
    [favorites]
  );

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
  };
}
