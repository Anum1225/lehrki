import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, FileText, Download, Eye, Sparkles, BookOpen, Users, MessageCircle, Copy, Clock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import SidebarLayout from '../components/SidebarLayout';
import { useAuth } from '../contexts/AuthContext';
import { useParentLetterRealTime, useRealTimeData } from '../hooks/useRealTimeData';
import { useWebSocket } from '../hooks/useWebSocket';
import { apiService } from '../services/api';

const ParentLetterGenerator = () => {
  const { user } = useAuth();
  const { isConnected, sendMessage } = useWebSocket();
  const { letters, setLetters, isGenerating: realtimeGenerating, setIsGenerating: setRealtimeGenerating } = useParentLetterRealTime();
  const { data: dashboardData, lastUpdated, refreshData, isConnected: dataConnected } = useRealTimeData({
    totalLetters: 0,
    recentLetters: [],
    tokenBalance: 0
  });
  
  const [formData, setFormData] = useState({
    student_name: '',
    parent_name: '',
    subject: '',
    grade: '',
    content_type: 'progress_report',
    tone: 'professional',
    language: 'en',
    key_points: '',
    additional_context: ''
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const contentTypes = [
    { value: 'progress_report', label: 'Progress Report', icon: '📊' },
    { value: 'behavior_update', label: 'Behavior Update', icon: '🎯' },
    { value: 'academic_concern', label: 'Academic Concern', icon: '📚' },
    { value: 'achievement_celebration', label: 'Achievement Celebration', icon: '🏆' },
    { value: 'meeting_request', label: 'Meeting Request', icon: '🤝' },
    { value: 'homework_reminder', label: 'Homework Reminder', icon: '✍️' }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and respectful' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'encouraging', label: 'Encouraging', description: 'Positive and supportive' },
    { value: 'concerned', label: 'Concerned', description: 'Serious but caring' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'de', label: 'German', flag: '🇩🇪' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'it', label: 'Italian', flag: '🇮🇹' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateLetter = async () => {
    if (!formData.student_name || !formData.parent_name || !formData.subject) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    if (isConnected) {
      sendMessage({ type: 'parent_letter_generating', user_id: user.id });
    }

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const requestData = {
        student_context: {
          name: formData.student_name,
          parent_name: formData.parent_name,
          subject: formData.subject,
          grade: formData.grade || '',
          key_points: formData.key_points || '',
          additional_context: formData.additional_context || ''
        },
        content_type: formData.content_type,
        tone: formData.tone,
        language: formData.language
      };
      
      console.log('Sending request:', requestData);
      const response = await apiService.parentLetters.create(requestData);

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGeneratedLetter(response.data.content);
      
      const newLetter = {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content,
        created_at: new Date().toISOString()
      };
      setLetters(prev => [newLetter, ...prev]);
      
      alert('Letter generated successfully!');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Error generating letter:', error);
      console.error('Error details:', error.response?.data);
      
      // Always generate demo letter on any error
      const demoLetter = generateDemoLetter(formData);
      setGeneratedLetter(demoLetter);
      
      const newLetter = {
        id: Date.now(),
        title: `${formData.content_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${formData.student_name}`,
        content: demoLetter,
        created_at: new Date().toISOString()
      };
      setLetters(prev => [newLetter, ...prev]);
      
      alert('Generated demo letter successfully!');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert('Letter copied to clipboard!');
  };

  const generateDemoLetter = (data) => {
    const date = new Date().toLocaleDateString();
    const letterTemplates = {
      progress_report: `Dear ${data.parent_name},

I hope this letter finds you well. I am writing to provide you with an update regarding ${data.student_name}'s progress in ${data.subject}.

${data.key_points ? `Key Points:\n${data.key_points}\n\n` : ''}${data.student_name} has been demonstrating consistent effort and engagement in class. Their understanding of the core concepts is developing well, and they actively participate in classroom discussions.

Recent achievements:
• Shows improvement in problem-solving skills
• Demonstrates good collaboration with peers
• Completes assignments on time

${data.additional_context ? `Additional Information:\n${data.additional_context}\n\n` : ''}I encourage continued support at home through regular review of class materials and completion of homework assignments. Please feel free to contact me if you have any questions or would like to schedule a conference to discuss ${data.student_name}'s progress in more detail.

Best regards,\n[Teacher Name]\n[Subject] Teacher\n[School Name]\n\nDate: ${date}`,
      
      behavior_update: `Dear ${data.parent_name},

I wanted to reach out to discuss ${data.student_name}'s recent behavior and social development in ${data.subject} class.

${data.key_points ? `Key Points:\n${data.key_points}\n\n` : ''}${data.student_name} has been showing positive growth in their classroom behavior. They are learning to follow classroom expectations and work well with their classmates.

Positive observations:
• Shows respect for classroom rules
• Demonstrates good listening skills
• Works cooperatively in group activities

${data.additional_context ? `Additional Information:\n${data.additional_context}\n\n` : ''}I appreciate your support in reinforcing these positive behaviors at home. Together, we can help ${data.student_name} continue to develop strong social and academic skills.

Warm regards,\n[Teacher Name]\n[Subject] Teacher\n\nDate: ${date}`,
      
      achievement_celebration: `Dear ${data.parent_name},

I am delighted to share some wonderful news about ${data.student_name}'s recent achievements in ${data.subject}!

${data.key_points ? `Key Points:\n${data.key_points}\n\n` : ''}${data.student_name} has demonstrated exceptional performance and dedication in their studies. Their hard work and positive attitude have truly paid off.

Notable achievements:
• Excellent performance on recent assessments
• Outstanding participation in class discussions
• Demonstrates mastery of key concepts
• Shows leadership qualities in group work

${data.additional_context ? `Additional Information:\n${data.additional_context}\n\n` : ''}Please join me in celebrating ${data.student_name}'s success! Their commitment to learning is truly commendable, and I look forward to seeing their continued growth.

Congratulations to both you and ${data.student_name}!

Proud regards,\n[Teacher Name]\n[Subject] Teacher\n\nDate: ${date}`
    };
    
    return letterTemplates[data.content_type] || letterTemplates.progress_report;
  };

  const downloadLetter = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `parent_letter_${formData.student_name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    alert('Letter downloaded!');
  };

  return (
    <SidebarLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Parent Letter Generator</h1>
                  <p className="text-gray-600 mt-2">Create personalized parent communications with AI assistance</p>
                </div>
              </div>
            </div>

            {/* Premium Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">Premium Feature</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                Letter Details
              </h2>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      name="student_name"
                      value={formData.student_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter student's name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Name *
                    </label>
                    <input
                      type="text"
                      name="parent_name"
                      value={formData.parent_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter parent's name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Mathematics, Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <input
                      type="text"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 5th Grade, Year 10"
                    />
                  </div>
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Letter Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {contentTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex items-center p-3 cursor-pointer rounded-lg border-2 transition-all ${
                          formData.content_type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="content_type"
                          value={type.value}
                          checked={formData.content_type === type.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="text-lg mr-2">{type.icon}</span>
                        <span className={`text-sm font-medium ${
                          formData.content_type === type.value ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {type.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tone and Language */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone
                    </label>
                    <select
                      name="tone"
                      value={formData.tone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {toneOptions.map((tone) => (
                        <option key={tone.value} value={tone.value}>
                          {tone.label} - {tone.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {languageOptions.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.flag} {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Key Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Points to Include
                  </label>
                  <textarea
                    name="key_points"
                    value={formData.key_points}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="List the main points you want to communicate (bullet points or short sentences)"
                  />
                </div>

                {/* Additional Context */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Context
                  </label>
                  <textarea
                    name="additional_context"
                    value={formData.additional_context}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Any additional background information or specific details to include"
                  />
                </div>

                {/* Generate Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateLetter}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden"
                >
                  {isGenerating && (
                    <div 
                      className="absolute left-0 top-0 h-full bg-white bg-opacity-20 transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  )}
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating... {generationProgress}%
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Letter with AI
                    </>
                  )}
                </motion.button>
                
                {/* Connection Status */}
                <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                  <div className="flex items-center">
                    {isConnected ? (
                      <><CheckCircle className="w-4 h-4 text-green-500 mr-1" />Real-time connected</>
                    ) : (
                      <><AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />Offline mode</>
                    )}
                  </div>
                  <button onClick={refreshData} className="flex items-center hover:text-blue-600">
                    <RefreshCw className="w-4 h-4 mr-1" />Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Letter Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-purple-600" />
                  Generated Letter
                </h2>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  History ({letters.length})
                </button>
              </div>
              
              {/* Letter History */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 bg-gray-50 rounded-lg p-4 border"
                  >
                    <h3 className="font-medium text-gray-900 mb-3">Recent Letters</h3>
                    {letters.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {letters.slice(0, 5).map((letter, index) => (
                          <div key={letter.id || index} className="text-sm text-gray-600 p-2 bg-white rounded border">
                            <div className="font-medium">{letter.title}</div>
                            <div className="text-xs text-gray-400">{new Date(letter.created_at).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No letters generated yet</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {generatedLetter ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 min-h-96">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {generatedLetter}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={copyToClipboard}
                      className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={downloadLetter}
                      className="flex-1 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
                  <p className="text-gray-500">
                    Fill out the form and click "Generate Letter with AI" to create your personalized parent communication.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Usage Tips */}
          <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Tips for Better Letters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <ul className="space-y-2">
                <li>• Be specific about achievements or concerns</li>
                <li>• Include concrete examples when possible</li>
                <li>• Choose the appropriate tone for your message</li>
              </ul>
              <ul className="space-y-2">
                <li>• Review and personalize the generated content</li>
                <li>• Add your contact information before sending</li>
                <li>• Consider the parent's preferred communication style</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ParentLetterGenerator;