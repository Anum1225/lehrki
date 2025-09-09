import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiService } from '../services/api';

const MembershipContext = createContext();

export const useMembership = () => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
};

export const MembershipProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [membership, setMembership] = useState({
    plan: 'free',
    status: 'inactive',
    tokensRemaining: 0,
    isPremium: false,
    isAdmin: false,
    loading: true
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMembershipData();
    } else {
      setMembership({
        plan: 'free',
        status: 'inactive',
        tokensRemaining: 0,
        isPremium: false,
        isAdmin: false,
        loading: false
      });
    }
  }, [isAuthenticated, user]);

  const fetchMembershipData = async () => {
    try {
      // Check if user is admin
      if (user?.role === 'ADMIN') {
        setMembership({
          plan: 'admin',
          status: 'active',
          tokensRemaining: 999999,
          isPremium: true,
          isAdmin: true,
          loading: false
        });
        return;
      }

      // Fetch token balance and subscription data
      const [tokenData, subscriptionData] = await Promise.all([
        apiService.tokens.getBalance(),
        apiService.subscriptions.getCurrent()
      ]);

      const isPremium = subscriptionData?.status === 'active';
      const tokensRemaining = tokenData?.balance || 0;

      setMembership({
        plan: isPremium ? 'premium' : 'free',
        status: subscriptionData?.status || 'inactive',
        tokensRemaining,
        isPremium,
        isAdmin: false,
        loading: false
      });
    } catch (error) {
      console.error('Failed to fetch membership data:', error);
      // Set default free membership on error
      setMembership({
        plan: 'free',
        status: 'inactive',
        tokensRemaining: 0,
        isPremium: false,
        isAdmin: user?.role === 'ADMIN',
        loading: false
      });
    }
  };

  const hasAccess = (feature) => {
    if (membership.isAdmin) return true;

    const accessRules = {
      // Free tier features
      'basic_quiz_creation': membership.tokensRemaining > 0,
      'basic_analytics': true,
      'community_access': true,

      // Premium features
      'advanced_analytics': membership.isPremium,
      'ai_chat_support': membership.isPremium,
      'parent_letter_generation': membership.isPremium,
      'unlimited_quizzes': membership.isPremium,
      'priority_support': membership.isPremium,

      // Token-based features
      'ai_quiz_generation': membership.tokensRemaining >= 1,
      'ai_content_summarization': membership.tokensRemaining >= 1,
      'ai_learning_path': membership.tokensRemaining >= 1,
      'ai_grading_assistant': membership.tokensRemaining >= 1,
      'ai_study_schedule': membership.tokensRemaining >= 1,
      'ai_performance_prediction': membership.tokensRemaining >= 1,
      'ai_adaptive_questions': membership.tokensRemaining >= 1
    };

    return accessRules[feature] || false;
  };

  const deductTokens = async (amount) => {
    if (membership.isAdmin) return true; // Admin doesn't need tokens

    if (membership.tokensRemaining < amount) {
      return false; // Insufficient tokens
    }

    try {
      // This would typically call an API to deduct tokens
      // For now, we'll just update local state
      setMembership(prev => ({
        ...prev,
        tokensRemaining: prev.tokensRemaining - amount
      }));
      return true;
    } catch (error) {
      console.error('Failed to deduct tokens:', error);
      return false;
    }
  };

  const value = {
    membership,
    hasAccess,
    deductTokens,
    refreshMembership: fetchMembershipData
  };

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
};