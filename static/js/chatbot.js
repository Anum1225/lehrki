// LehrKI Chatbot Widget

window.LehrKI = window.LehrKI || {};

LehrKI.Chatbot = {
    // Configuration
    config: {
        maxMessages: 50,
        typingDelay: 1000,
        autoHideDelay: 30000,
        suggestions: {
            teacher: [
                "How do I create a parent letter?",
                "What's the token cost for AI features?",
                "How can I manage my classroom quizzes?",
                "Tell me about the assessment tools"
            ],
            student: [
                "How do I take a quiz?",
                "Can you help me understand this topic?",
                "What's my current progress?",
                "How do I change my language?"
            ],
            admin: [
                "How do I manage user accounts?",
                "What are the platform statistics?",
                "How do I moderate content?",
                "Show me system status"
            ]
        }
    },
    
    // State
    state: {
        isOpen: false,
        isTyping: false,
        messages: [],
        sessionId: null
    },
    
    // DOM elements
    elements: {
        widget: null,
        toggle: null,
        panel: null,
        messages: null,
        input: null,
        sendBtn: null,
        closeBtn: null
    },
    
    // Initialize chatbot
    init: function() {
        this.cacheElements();
        this.bindEvents();
        this.generateSessionId();
        this.loadMessageHistory();
        this.showWelcomeMessage();
        
        console.log('Chatbot initialized');
    },
    
    // Cache DOM elements
    cacheElements: function() {
        this.elements.widget = document.getElementById('chatbot-widget');
        this.elements.toggle = document.getElementById('chatbot-toggle');
        this.elements.panel = document.getElementById('chatbot-panel');
        this.elements.messages = document.getElementById('chatbot-messages');
        this.elements.input = document.getElementById('chatbot-input');
        this.elements.sendBtn = document.getElementById('chatbot-send');
        this.elements.closeBtn = document.getElementById('chatbot-close');
    },
    
    // Bind event listeners
    bindEvents: function() {
        if (this.elements.toggle) {
            this.elements.toggle.addEventListener('click', () => this.togglePanel());
        }
        
        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => this.closePanel());
        }
        
        if (this.elements.sendBtn) {
            this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.elements.input) {
            this.elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            this.elements.input.addEventListener('input', () => {
                this.handleTyping();
            });
        }
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (this.state.isOpen && 
                !this.elements.panel?.contains(e.target) && 
                !this.elements.toggle?.contains(e.target)) {
                this.closePanel();
            }
        });
        
        // Auto-hide after inactivity
        this.setupAutoHide();
    },
    
    // Generate unique session ID
    generateSessionId: function() {
        this.state.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Toggle chat panel
    togglePanel: function() {
        if (this.state.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    },
    
    // Open chat panel
    openPanel: function() {
        this.state.isOpen = true;
        this.elements.panel.style.display = 'block';
        this.elements.toggle.innerHTML = '<i class="fas fa-times"></i>';
        
        // Focus input
        setTimeout(() => {
            if (this.elements.input) {
                this.elements.input.focus();
            }
        }, 100);
        
        // Mark as read
        this.markAsRead();
    },
    
    // Close chat panel
    closePanel: function() {
        this.state.isOpen = false;
        this.elements.panel.style.display = 'none';
        this.elements.toggle.innerHTML = '<i class="fas fa-comments"></i>';
    },
    
    // Send message
    sendMessage: function() {
        const message = this.elements.input.value.trim();
        if (!message || this.state.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.elements.input.value = '';
        
        // Show typing indicator
        this.showTyping();
        
        // Send to server
        this.sendToServer(message);
    },
    
    // Add message to chat
    addMessage: function(content, sender = 'bot', timestamp = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        bubble.textContent = content;
        
        messageDiv.appendChild(bubble);
        
        // Add timestamp
        if (timestamp || sender === 'user') {
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time text-muted small mt-1';
            timeDiv.textContent = this.formatTime(timestamp || new Date());
            messageDiv.appendChild(timeDiv);
        }
        
        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Store message
        this.state.messages.push({
            content,
            sender,
            timestamp: timestamp || new Date().toISOString()
        });
        
        // Limit message history
        if (this.state.messages.length > this.config.maxMessages) {
            this.state.messages = this.state.messages.slice(-this.config.maxMessages);
            this.cleanupOldMessages();
        }
        
        // Save to localStorage
        this.saveMessageHistory();
    },
    
    // Show typing indicator
    showTyping: function() {
        this.state.isTyping = true;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing-indicator';
        typingDiv.innerHTML = `
            <div class="chat-bubble bot">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.elements.messages.appendChild(typingDiv);
        this.scrollToBottom();
    },
    
    // Hide typing indicator
    hideTyping: function() {
        this.state.isTyping = false;
        const typingIndicator = this.elements.messages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },
    
    // Send message to server
    async sendToServer(message) {
        try {
            const response = await LehrKI.api.sendChatMessage(message);
            
            setTimeout(() => {
                this.hideTyping();
                this.addMessage(response.response, 'bot');
            }, this.config.typingDelay);
            
        } catch (error) {
            console.error('Chatbot error:', error);
            
            setTimeout(() => {
                this.hideTyping();
                this.addMessage(
                    "I'm sorry, I'm currently unavailable. Please try again later.",
                    'bot'
                );
            }, this.config.typingDelay);
        }
    },
    
    // Show welcome message
    showWelcomeMessage: function() {
        const hasHistory = this.state.messages.length > 0;
        
        if (!hasHistory) {
            setTimeout(() => {
                this.addMessage("Hello! I'm your LehrKI assistant. How can I help you today?", 'bot');
                this.showSuggestions();
            }, 500);
        }
    },
    
    // Show contextual suggestions
    showSuggestions: function() {
        const userRole = this.getUserRole();
        const suggestions = this.config.suggestions[userRole] || this.config.suggestions.student;
        
        if (suggestions.length > 0) {
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.className = 'chat-suggestions mt-2';
            
            suggestions.forEach(suggestion => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline-primary btn-sm me-1 mb-1 suggestion-btn';
                btn.textContent = suggestion;
                btn.addEventListener('click', () => {
                    this.elements.input.value = suggestion;
                    this.sendMessage();
                    suggestionsDiv.remove();
                });
                suggestionsDiv.appendChild(btn);
            });
            
            this.elements.messages.appendChild(suggestionsDiv);
            this.scrollToBottom();
        }
    },
    
    // Get user role from page context
    getUserRole: function() {
        const body = document.body;
        if (body.classList.contains('admin')) return 'admin';
        if (body.classList.contains('teacher')) return 'teacher';
        return 'student';
    },
    
    // Handle typing in input
    handleTyping: function() {
        const input = this.elements.input.value;
        
        // Enable/disable send button
        if (this.elements.sendBtn) {
            this.elements.sendBtn.disabled = !input.trim() || this.state.isTyping;
        }
        
        // Auto-expand textarea
        this.elements.input.style.height = 'auto';
        this.elements.input.style.height = Math.min(this.elements.input.scrollHeight, 100) + 'px';
    },
    
    // Scroll to bottom of messages
    scrollToBottom: function() {
        setTimeout(() => {
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }, 100);
    },
    
    // Format timestamp
    formatTime: function(date) {
        const now = new Date();
        const messageDate = new Date(date);
        
        if (now.toDateString() === messageDate.toDateString()) {
            return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return messageDate.toLocaleDateString();
        }
    },
    
    // Save message history to localStorage
    saveMessageHistory: function() {
        try {
            localStorage.setItem('chatbot_messages', JSON.stringify(this.state.messages));
            localStorage.setItem('chatbot_session', this.state.sessionId);
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    },
    
    // Load message history from localStorage
    loadMessageHistory: function() {
        try {
            const savedMessages = localStorage.getItem('chatbot_messages');
            const savedSession = localStorage.getItem('chatbot_session');
            
            if (savedMessages && savedSession) {
                this.state.messages = JSON.parse(savedMessages);
                this.state.sessionId = savedSession;
                
                // Restore messages to UI
                this.state.messages.forEach(msg => {
                    this.addMessageToUI(msg.content, msg.sender, new Date(msg.timestamp));
                });
                
                // Clean old messages if needed
                if (this.state.messages.length > this.config.maxMessages) {
                    this.cleanupOldMessages();
                }
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
            this.state.messages = [];
        }
    },
    
    // Add message to UI only (without storing)
    addMessageToUI: function(content, sender, timestamp) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        bubble.textContent = content;
        
        messageDiv.appendChild(bubble);
        
        // Add timestamp
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time text-muted small mt-1';
        timeDiv.textContent = this.formatTime(timestamp);
        messageDiv.appendChild(timeDiv);
        
        this.elements.messages.appendChild(messageDiv);
    },
    
    // Cleanup old message elements
    cleanupOldMessages: function() {
        const messageElements = this.elements.messages.querySelectorAll('.chat-message');
        const excess = messageElements.length - this.config.maxMessages;
        
        for (let i = 0; i < excess; i++) {
            messageElements[i].remove();
        }
    },
    
    // Mark messages as read
    markAsRead: function() {
        // Could implement unread message indicator here
    },
    
    // Setup auto-hide functionality
    setupAutoHide: function() {
        let inactivityTimer;
        
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (this.state.isOpen) {
                    this.closePanel();
                }
            }, this.config.autoHideDelay);
        };
        
        // Reset timer on activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            this.elements.panel?.addEventListener(event, resetTimer, true);
        });
        
        resetTimer();
    },
    
    // Clear chat history
    clearHistory: function() {
        this.state.messages = [];
        this.elements.messages.innerHTML = '';
        localStorage.removeItem('chatbot_messages');
        localStorage.removeItem('chatbot_session');
        this.generateSessionId();
        this.showWelcomeMessage();
    },
    
    // Get chat statistics
    getStats: function() {
        return {
            totalMessages: this.state.messages.length,
            userMessages: this.state.messages.filter(m => m.sender === 'user').length,
            botMessages: this.state.messages.filter(m => m.sender === 'bot').length,
            sessionId: this.state.sessionId,
            isOpen: this.state.isOpen
        };
    }
};

// CSS for typing indicator
const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .typing-dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        opacity: 0.4;
        animation: typing-dot 1.4s infinite;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: 0s; }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing-dot {
        0%, 60%, 100% { opacity: 0.4; }
        30% { opacity: 1; }
    }
    
    .suggestion-btn {
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
    }
    
    .chat-message {
        margin-bottom: 0.75rem;
        animation: fadeInUp 0.3s ease;
    }
    
    .message-time {
        margin-top: 0.25rem;
        font-size: 0.7rem;
    }
    
    #chatbot-input {
        resize: none;
        border-radius: 0;
        border: none;
        border-top: 1px solid #e9ecef;
    }
    
    #chatbot-input:focus {
        box-shadow: none;
    }
`;
document.head.appendChild(style);

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('chatbot-widget')) {
        LehrKI.Chatbot.init();
    }
});

// Expose chatbot for debugging
window.chatbot = LehrKI.Chatbot;
