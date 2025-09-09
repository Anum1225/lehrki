import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Trash2, Edit3, Save, Play } from 'lucide-react';
import SidebarLayout from '../components/SidebarLayout';
import { apiService } from '../services/api';

const QuizCreator = () => {
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    topic: '',
    level: 'beginner',
    language: 'en',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: ''
  });

  const [isAIGenerating, setIsAIGenerating] = useState(false);

  const addQuestion = () => {
    if (currentQuestion.question_text.trim()) {
      setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion, id: Date.now() }]
      }));
      setCurrentQuestion({
        question_text: '',
        question_type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: ''
      });
    }
  };

  const deleteQuestion = (questionId) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const editQuestion = (questionId) => {
    const questionToEdit = quiz.questions.find(q => q.id === questionId);
    if (questionToEdit) {
      setCurrentQuestion(questionToEdit);
      deleteQuestion(questionId);
    }
  };

  const saveQuizDraft = async () => {
    if (!quiz.title || quiz.questions.length === 0) {
      alert('Please add a title and at least one question');
      return;
    }

    try {
      await apiService.quizzes.create({
        ...quiz,
        is_public: false,
        questions: quiz.questions.map((q, index) => ({
          ...q,
          order_index: index
        }))
      });

      alert('Quiz saved successfully!');
      // Reset form
      setQuiz({
        title: '',
        description: '',
        topic: '',
        level: 'beginner',
        language: 'en',
        questions: []
      });
    } catch (error) {
      console.error('Save error:', error);
      if (error.code === 'ERR_NETWORK') {
        alert('Backend server unavailable. Quiz saved locally for demo.');
        // Reset form for demo
        setQuiz({
          title: '',
          description: '',
          topic: '',
          level: 'beginner',
          language: 'en',
          questions: []
        });
      } else {
        alert('Failed to save quiz. Please try again.');
      }
    }
  };

  const publishQuiz = async () => {
    if (!quiz.title || quiz.questions.length === 0) {
      alert('Please add a title and at least one question');
      return;
    }

    try {
      await apiService.quizzes.create({
        ...quiz,
        is_public: true,
        questions: quiz.questions.map((q, index) => ({
          ...q,
          order_index: index
        }))
      });

      alert('Quiz published successfully!');
      // Reset form
      setQuiz({
        title: '',
        description: '',
        topic: '',
        level: 'beginner',
        language: 'en',
        questions: []
      });
    } catch (error) {
      console.error('Publish error:', error);
      if (error.code === 'ERR_NETWORK') {
        alert('Backend server unavailable. Quiz published locally for demo.');
        // Reset form for demo
        setQuiz({
          title: '',
          description: '',
          topic: '',
          level: 'beginner',
          language: 'en',
          questions: []
        });
      } else {
        alert('Failed to publish quiz. Please try again.');
      }
    }
  };

  const generateWithAI = async () => {
    if (!quiz.topic || !quiz.level) {
      alert('Please fill in topic and difficulty level first');
      return;
    }

    setIsAIGenerating(true);
    try {
      const response = await apiService.quizzes.generate({
        topic: quiz.topic,
        level: quiz.level,
        language: quiz.language,
        num_questions: 5
      });

      const data = response.data;
      
      // Check if this is a demo response or actual API response
      if (data.demo || !data.questions) {
        throw new Error('Backend unavailable');
      }
      
      const aiQuestions = data.questions.map((q, index) => ({
        id: Date.now() + index,
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.options || [],
        correct_answer: q.correct_answer
      }));
      
      setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, ...aiQuestions]
      }));
    } catch (error) {
      console.error('AI generation error:', error);
      // Fallback to template questions
      const fallbackQuestions = generateFallbackQuestions(quiz.topic, quiz.level);
      setQuiz(prev => ({
        ...prev,
        questions: [...prev.questions, ...fallbackQuestions]
      }));
      alert('Backend unavailable. Generated template questions for demo.');
    } finally {
      setIsAIGenerating(false);
    }
  };

  const generateFallbackQuestions = (topic, level) => {
    const templates = {
      'mathematics': [
        {
          question_text: `What is the basic principle of ${topic}?`,
          question_type: 'multiple_choice',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct_answer: 'Option A'
        },
        {
          question_text: `True or False: ${topic} is important in ${level} level studies.`,
          question_type: 'true_false',
          options: ['True', 'False'],
          correct_answer: 'True'
        }
      ],
      'science': [
        {
          question_text: `Explain the main concept of ${topic}.`,
          question_type: 'short_answer',
          options: [],
          correct_answer: `The main concept involves understanding the fundamental principles of ${topic}.`
        }
      ]
    };
    
    const topicKey = topic.toLowerCase().includes('math') ? 'mathematics' : 'science';
    const questions = templates[topicKey] || templates['science'];
    
    return questions.map((q, index) => ({
      id: Date.now() + index,
      ...q
    }));
  };

  return (
    <SidebarLayout>
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center mb-8">
            <BookOpen className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Quiz Creator</h1>
          </div>

          {/* Quiz Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter quiz title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  value={quiz.topic}
                  onChange={(e) => setQuiz(prev => ({ ...prev, topic: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Mathematics, Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={quiz.level}
                  onChange={(e) => setQuiz(prev => ({ ...prev, level: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={quiz.language}
                  onChange={(e) => setQuiz(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="en">English</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                  <option value="it">Italian</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={quiz.description}
                  onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief description of the quiz"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-4">
              <button
                onClick={generateWithAI}
                disabled={isAIGenerating || !quiz.topic}
                className="btn-primary flex items-center"
              >
                {isAIGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Question Builder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Question</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  value={currentQuestion.question_text}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question_text: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  value={currentQuestion.question_type}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>

              {currentQuestion.question_type === 'multiple_choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <input
                  type="text"
                  value={currentQuestion.correct_answer}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correct_answer: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter the correct answer"
                />
              </div>

              <button
                onClick={addQuestion}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </button>
            </div>
          </div>

          {/* Questions List */}
          {quiz.questions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Questions ({quiz.questions.length})
                </h2>
                <div className="flex gap-2">
                  <button onClick={saveQuizDraft} className="btn-secondary flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </button>
                  <button onClick={publishQuiz} className="btn-primary flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Publish Quiz
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {quiz.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Question {index + 1}
                        </h3>
                        <p className="text-gray-700 mb-3">{question.question_text}</p>
                        
                        {question.question_type === 'multiple_choice' && (
                          <div className="space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`text-sm px-2 py-1 rounded ${
                                  option === question.correct_answer
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.question_type !== 'multiple_choice' && (
                          <div className="text-sm">
                            <span className="font-medium text-green-600">Correct Answer: </span>
                            {question.correct_answer}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => editQuestion(question.id)} className="p-2 text-gray-400 hover:text-gray-600">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteQuestion(question.id)} className="p-2 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default QuizCreator;