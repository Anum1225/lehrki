import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard, 
  Key,
  Save,
  Edit3,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    bio: '',
    school: '',
    subject: '',
    experience: '',
    location: ''
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
    emailNotifications: true,
    marketingEmails: false,
    weeklyReport: true,
    autoSave: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'de', label: 'German', flag: '🇩🇪' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'it', label: 'Italian', flag: '🇮🇹' }
  ];

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePreferencesChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setPreferences({
      ...preferences,
      [e.target.name]: value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const saveProfile = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const savePreferences = () => {
    toast.success('Preferences saved successfully!');
  };

  const changePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const exportData = () => {
    toast.success('Data export initiated. You will receive an email with your data.');
  };

  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion initiated. Please check your email for confirmation.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account, preferences, and security settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mr-3" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? 'Cancel' : 'Edit'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg transition-all ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg transition-all ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg transition-all ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School/Institution
                        </label>
                        <input
                          type="text"
                          name="school"
                          value={profileData.school}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg transition-all ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject/Specialty
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={profileData.subject}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg transition-all ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          rows="4"
                          className={`w-full px-4 py-3 border rounded-lg transition-all ${
                            isEditing 
                              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          placeholder="Tell us about yourself and your teaching experience..."
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={saveProfile}
                          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">Preferences</h2>

                    <div className="space-y-8">
                      {/* Language Settings */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Globe className="w-5 h-5 mr-2" />
                          Language & Region
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Interface Language
                            </label>
                            <select
                              name="language"
                              value={preferences.language}
                              onChange={handlePreferencesChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {languages.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                  {lang.flag} {lang.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Theme
                            </label>
                            <select
                              name="theme"
                              value={preferences.theme}
                              onChange={handlePreferencesChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="light">Light</option>
                              <option value="dark">Dark</option>
                              <option value="system">System</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Bell className="w-5 h-5 mr-2" />
                          Notifications
                        </h3>
                        <div className="space-y-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="emailNotifications"
                              checked={preferences.emailNotifications}
                              onChange={handlePreferencesChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">Email notifications for quiz results and updates</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="marketingEmails"
                              checked={preferences.marketingEmails}
                              onChange={handlePreferencesChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">Marketing emails and feature updates</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="weeklyReport"
                              checked={preferences.weeklyReport}
                              onChange={handlePreferencesChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">Weekly activity and progress reports</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="autoSave"
                              checked={preferences.autoSave}
                              onChange={handlePreferencesChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">Auto-save drafts and work in progress</span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={savePreferences}
                          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">Security Settings</h2>

                    <div className="space-y-8">
                      {/* Password Change */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                          <Key className="w-5 h-5 mr-2" />
                          Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <Eye className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <button
                          onClick={changePassword}
                          className="mt-4 flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Update Password
                        </button>
                      </div>

                      {/* Data Management */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900">Export Data</h4>
                              <p className="text-sm text-gray-600">Download all your data in a portable format</p>
                            </div>
                            <button
                              onClick={exportData}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                            <div>
                              <h4 className="font-medium text-red-900">Delete Account</h4>
                              <p className="text-sm text-red-600">Permanently remove your account and all data</p>
                            </div>
                            <button
                              onClick={deleteAccount}
                              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">Billing & Subscription</h2>

                    <div className="space-y-8">
                      {/* Current Plan */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-blue-900">Current Plan: Premium</h3>
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Active
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-blue-700 font-medium">Monthly Cost</p>
                            <p className="text-blue-900 text-lg font-semibold">$25.00</p>
                          </div>
                          <div>
                            <p className="text-blue-700 font-medium">AI Tokens</p>
                            <p className="text-blue-900 text-lg font-semibold">2,450 / 3,000</p>
                          </div>
                          <div>
                            <p className="text-blue-700 font-medium">Next Billing</p>
                            <p className="text-blue-900 text-lg font-semibold">Sept 30, 2024</p>
                          </div>
                        </div>
                      </div>

                      {/* Token Usage */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Token Usage This Month</h3>
                        <div className="bg-gray-200 rounded-full h-3 mb-4">
                          <div className="bg-blue-600 h-3 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>2,450 tokens used</span>
                          <span>550 tokens remaining</span>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                              <CreditCard className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">•••• •••• •••• 4242</p>
                              <p className="text-sm text-gray-500">Expires 12/25</p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Update
                          </button>
                        </div>
                      </div>

                      {/* Billing History */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
                        <div className="space-y-3">
                          {[
                            { date: 'Aug 30, 2024', amount: '$25.00', status: 'Paid' },
                            { date: 'Jul 30, 2024', amount: '$25.00', status: 'Paid' },
                            { date: 'Jun 30, 2024', amount: '$25.00', status: 'Paid' }
                          ].map((invoice, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div>
                                <p className="font-medium">{invoice.date}</p>
                                <p className="text-sm text-gray-500">Premium Plan</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{invoice.amount}</p>
                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                  {invoice.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;