import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMembership } from '../contexts/MembershipContext';

const ProtectedRoute = ({ children, requiredFeature, adminOnly = false }) => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { membership, hasAccess, loading: membershipLoading } = useMembership();
  const location = useLocation();

  // Show loading while checking authentication and membership
  if (authLoading || membershipLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin-only access
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/student-dashboard" replace />;
  }

  // Check feature access for non-admin users (admins bypass all restrictions)
  if (requiredFeature && user?.role !== 'admin' && !hasAccess(requiredFeature)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Feature Required</h2>
            <p className="text-gray-600 mb-6">
              This feature requires a premium subscription or sufficient tokens.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Your current plan:</div>
              <div className="font-semibold text-gray-900 capitalize">{membership.plan}</div>
            </div>

            {membership.plan === 'free' && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 mb-2">Available tokens:</div>
                <div className="font-semibold text-blue-900">{membership.tokensRemaining} tokens</div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <a
                href="/pricing"
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Upgrade Plan
              </a>
              {membership.plan === 'free' && membership.tokensRemaining === 0 && (
                <a
                  href="/pricing"
                  className="flex-1 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Buy Tokens
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;