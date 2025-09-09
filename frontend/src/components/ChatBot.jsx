import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Download,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you with your educational needs today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const messagesEndRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Real API call to backend chatbot endpoint
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const endpoint = isAuthenticated ? '/chat' : '/chat/public';
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (isAuthenticated) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      }
      
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: inputMessage,
          language: language,
          session_id: `session-${Date.now()}`
        })
      });

      const data = await response.json();
      
      const botResponse = {
        id: Date.now() + 1,
        text: data.response || getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat API error:', error);
      // Fallback to local response
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    const responses = {
      en: {
        quiz: "I can help you create engaging quizzes! You can use our Quiz Creator to generate questions on any topic. Would you like me to guide you through the process?",
        assessment: "Our Assessment Center provides automated feedback and detailed analytics. You can track student progress and identify areas for improvement. Want to learn more about specific features?",
        community: "The Community Forum is a great place to connect with other educators! You can share resources, ask questions, and collaborate on teaching strategies. Shall I show you how to get started?",
        help: "I'm here to help! I can assist you with:\n• Creating quizzes and assessments\n• Understanding analytics\n• Navigating the platform\n• Tips for better student engagement\n\nWhat would you like to know more about?",
        default: "That's an interesting question! I'm here to help you make the most of LehrKI's educational tools. Could you tell me more about what you're trying to accomplish?"
      },
      de: {
        quiz: "Ich kann Ihnen beim Erstellen ansprechender Quiz helfen! Sie können unseren Quiz-Creator verwenden, um Fragen zu jedem Thema zu generieren. Soll ich Sie durch den Prozess führen?",
        assessment: "Unser Assessment Center bietet automatisiertes Feedback und detaillierte Analysen. Sie können den Fortschritt der Schüler verfolgen und Verbesserungsbereiche identifizieren. Möchten Sie mehr über spezifische Funktionen erfahren?",
        community: "Das Community Forum ist ein großartiger Ort, um sich mit anderen Pädagogen zu vernetzen! Sie können Ressourcen teilen, Fragen stellen und an Lehrstrategien zusammenarbeiten. Soll ich Ihnen zeigen, wie Sie anfangen?",
        help: "Ich bin hier, um zu helfen! Ich kann Sie unterstützen bei:\n• Erstellen von Quiz und Bewertungen\n• Verstehen von Analysen\n• Navigation auf der Plattform\n• Tipps für bessere Schülerengagement\n\nWorüber möchten Sie mehr erfahren?",
        default: "Das ist eine interessante Frage! Ich bin hier, um Ihnen zu helfen, das Beste aus LehrKIs Bildungstools herauszuholen. Können Sie mir mehr darüber erzählen, was Sie erreichen möchten?"
      },
      fr: {
        quiz: "Je peux vous aider à créer des quiz engageants ! Vous pouvez utiliser notre Créateur de Quiz pour générer des questions sur n'importe quel sujet. Voulez-vous que je vous guide dans le processus ?",
        assessment: "Notre Centre d'Évaluation fournit des commentaires automatisés et des analyses détaillées. Vous pouvez suivre les progrès des étudiants et identifier les domaines d'amélioration. Voulez-vous en savoir plus sur des fonctionnalités spécifiques ?",
        community: "Le Forum Communautaire est un excellent endroit pour se connecter avec d'autres éducateurs ! Vous pouvez partager des ressources, poser des questions et collaborer sur des stratégies d'enseignement. Dois-je vous montrer comment commencer ?",
        help: "Je suis là pour aider ! Je peux vous assister avec :\n• Créer des quiz et des évaluations\n• Comprendre les analyses\n• Naviguer sur la plateforme\n• Conseils pour un meilleur engagement étudiant\n\nSur quoi aimeriez-vous en savoir plus ?",
        default: "C'est une question intéressante ! Je suis là pour vous aider à tirer le meilleur parti des outils éducatifs de LehrKI. Pouvez-vous me dire plus sur ce que vous essayez d'accomplir ?"
      },
      it: {
        quiz: "Posso aiutarti a creare quiz coinvolgenti! Puoi usare il nostro Creatore di Quiz per generare domande su qualsiasi argomento. Vuoi che ti guidi attraverso il processo?",
        assessment: "Il nostro Centro di Valutazione fornisce feedback automatizzato e analisi dettagliate. Puoi tracciare i progressi degli studenti e identificare aree di miglioramento. Vuoi saperne di più su funzionalità specifiche?",
        community: "Il Forum della Comunità è un ottimo posto per connettersi con altri educatori! Puoi condividere risorse, fare domande e collaborare su strategie di insegnamento. Devo mostrarti come iniziare?",
        help: "Sono qui per aiutare! Posso assisterti con:\n• Creare quiz e valutazioni\n• Comprendere le analisi\n• Navigare sulla piattaforma\n• Suggerimenti per un migliore coinvolgimento degli studenti\n\nSu cosa vorresti saperne di più?",
        default: "È una domanda interessante! Sono qui per aiutarti a sfruttare al meglio gli strumenti educativi di LehrKI. Puoi dirmi di più su quello che stai cercando di realizzare?"
      }
    };
    
    const langResponses = responses[language] || responses.en;
    
    if (lowerMessage.includes('quiz') || lowerMessage.includes('create')) {
      return langResponses.quiz;
    } else if (lowerMessage.includes('assessment') || lowerMessage.includes('grade')) {
      return langResponses.assessment;
    } else if (lowerMessage.includes('community') || lowerMessage.includes('forum')) {
      return langResponses.community;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return langResponses.help;
    } else {
      return langResponses.default;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exportToPDF = async () => {
    try {
      // Create PDF content
      const content = messages.map(msg => 
        `${msg.sender === 'user' ? 'You' : 'AI Assistant'} (${new Date(msg.timestamp).toLocaleString()}):\n${msg.text}\n\n`
      ).join('');
      
      // Create a blob with the content
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `lehrki-chat-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI assistant. How can I help you with your educational needs today?",
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </motion.div>
          
          {/* Pulse animation when closed */}
          {!isOpen && showWelcomeAnimation && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          {/* Sparkle effect */}
          <motion.div
            className="absolute top-1 right-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-3 h-3 text-yellow-300" />
          </motion.div>
        </motion.button>
        
        {/* Welcome tooltip */}
        {!isOpen && showWelcomeAnimation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 px-4 py-2 rounded-xl shadow-lg text-sm whitespace-nowrap border border-emerald-200"
          >
            Hi! Need help? Click me! 👋
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : 500
            }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ 
              duration: 0.4, 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="fixed bottom-24 right-6 w-96 bg-gradient-to-b from-white to-emerald-50/20 rounded-2xl shadow-2xl border border-emerald-100 z-40 flex flex-col overflow-hidden backdrop-blur-sm"
            style={{ height: isMinimized ? '60px' : '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white p-4 rounded-t-2xl relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-4 w-8 h-8 border border-white/30 rounded-full"></div>
                <div className="absolute top-6 right-8 w-4 h-4 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-3 left-12 w-6 h-6 border border-white/25 rounded-full"></div>
                <div className="absolute bottom-2 right-16 w-3 h-3 bg-white/20 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <motion.div 
                    className="w-8 h-8 bg-white/25 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm border border-white/20"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Bot className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <motion.h3 
                      className="font-semibold"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      LehrKI AI Assistant
                    </motion.h3>
                    <motion.p 
                      className="text-xs opacity-90"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.9 }}
                      transition={{ delay: 0.4 }}
                    >
                      {isTyping ? 'Typing...' : 'Always ready to help'}
                    </motion.p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={exportToPDF}
                    className="p-2 hover:bg-white/25 rounded-xl transition-all duration-200 backdrop-blur-sm"
                    title="Export chat to PDF"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    className="p-2 hover:bg-white/25 rounded-xl transition-all duration-200 backdrop-blur-sm"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/25 rounded-xl transition-all duration-200 backdrop-blur-sm"
                    title={isMinimized ? 'Maximize' : 'Minimize'}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-emerald-50/10">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="group relative">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
                              : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 rounded-bl-md border border-gray-200'
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.sender === 'bot' && (
                              <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                              >
                                <Bot className="w-4 h-4 mt-0.5 text-emerald-500" />
                              </motion.div>
                            )}
                            {message.sender === 'user' && (
                              <User className="w-4 h-4 mt-0.5 text-white" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                              <p className="text-xs mt-1 opacity-70">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Copy button on hover */}
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          onClick={() => copyMessage(message.text)}
                          className="absolute -top-2 -right-2 bg-white shadow-lg rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          title="Copy message"
                        >
                          <Copy className="w-3 h-3 text-gray-600" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex items-center space-x-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Bot className="w-4 h-4 text-emerald-500" />
                        </motion.div>
                        <div className="flex space-x-1">
                          <motion.div 
                            className="w-2 h-2 bg-emerald-400 rounded-full"
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-teal-400 rounded-full"
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                          />
                          <motion.div 
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            {!isMinimized && (
              <motion.div 
                className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-emerald-50/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {!isAuthenticated && (
                  <motion.div 
                    className="text-xs text-emerald-600 mb-3 text-center bg-emerald-50 border border-emerald-200 rounded-xl p-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    💡 Sign in for personalized assistance and advanced features
                  </motion.div>
                )}
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about LehrKI..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white shadow-sm transition-all duration-200 hover:border-emerald-300"
                    />
                    {inputMessage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      </motion.div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl hover:shadow-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[48px]"
                  >
                    <motion.div
                      animate={{ rotate: isTyping ? 360 : 0 }}
                      transition={{ duration: 1, repeat: isTyping ? Infinity : 0, ease: "linear" }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;