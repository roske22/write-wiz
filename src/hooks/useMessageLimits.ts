import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MessageLimitState {
  messagesUsed: number;
  messagesRemaining: number;
  isLimitReached: boolean;
  isLoading: boolean;
  canSendMessage: boolean;
}

export const useMessageLimits = () => {
  const { user, userRole } = useAuth();
  const [limitState, setLimitState] = useState<MessageLimitState>({
    messagesUsed: 0,
    messagesRemaining: 0,
    isLimitReached: false,
    isLoading: true,
    canSendMessage: false,
  });

  const FREE_USER_DAILY_LIMIT = 3;

  const fetchDailyUsage = async () => {
    if (!user) {
      setLimitState(prev => ({ ...prev, isLoading: false, canSendMessage: false }));
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: usage, error } = await supabase
        .from('user_usage')
        .select('messages_used')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching usage:', error);
        return;
      }

      const messagesUsed = usage?.messages_used || 0;
      const isPremium = userRole === 'premium' || userRole === 'admin';
      
      if (isPremium) {
        setLimitState({
          messagesUsed,
          messagesRemaining: -1, // Unlimited
          isLimitReached: false,
          isLoading: false,
          canSendMessage: true,
        });
      } else {
        const messagesRemaining = Math.max(0, FREE_USER_DAILY_LIMIT - messagesUsed);
        const isLimitReached = messagesUsed >= FREE_USER_DAILY_LIMIT;
        
        setLimitState({
          messagesUsed,
          messagesRemaining,
          isLimitReached,
          isLoading: false,
          canSendMessage: !isLimitReached,
        });
      }
    } catch (error) {
      console.error('Error in fetchDailyUsage:', error);
      setLimitState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const incrementUsage = async () => {
    if (!user || userRole === 'premium' || userRole === 'admin') {
      return true; // Premium users don't need usage tracking
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Try to update existing record
      const { error: updateError } = await supabase
        .from('user_usage')
        .update({ 
          messages_used: limitState.messagesUsed + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('date', today);

      if (updateError) {
        // If update fails, try to insert new record
        const { error: insertError } = await supabase
          .from('user_usage')
          .insert({
            user_id: user.id,
            date: today,
            messages_used: 1
          });

        if (insertError) {
          console.error('Error creating usage record:', insertError);
          return false;
        }
      }

      // Refresh the usage data
      await fetchDailyUsage();
      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchDailyUsage();
  }, [user, userRole]);

  return {
    ...limitState,
    incrementUsage,
    refreshUsage: fetchDailyUsage,
    isPremium: userRole === 'premium' || userRole === 'admin',
  };
};