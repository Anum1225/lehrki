// LehrKI Main Application JavaScript

// Global app object
window.LehrKI = {
    // Configuration
    config: {
        apiBaseUrl: '/api',
        toastDuration: 3000,
        autoSaveInterval: 30000
    },
    
    // Utility functions
    utils: {
        // Show toast notification
        showToast: function(message, type = 'info') {
            const toastContainer = document.getElementById('toast-container') || this.createToastContainer();
            const toast = this.createToast(message, type);
            toastContainer.appendChild(toast);
            
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();
            
            // Remove toast after it's hidden
            toast.addEventListener('hidden.bs.toast', function() {
                toast.remove();
            });
        },
        
        createToastContainer: function() {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
            return container;
        },
        
        createToast: function(message, type) {
            const typeClasses = {
                success: 'text-bg-success',
                error: 'text-bg-danger',
                warning: 'text-bg-warning',
                info: 'text-bg-info'
            };
            
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };
            
            const toast = document.createElement('div');
            toast.className = `toast align-items-center ${typeClasses[type] || typeClasses.info} border-0`;
            toast.setAttribute('role', 'alert');
            toast.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="${icons[type] || icons.info} me-2"></i>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            `;
            return toast;
        },
        
        // Format date
        formatDate: function(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString();
        },
        
        // Format currency
        formatCurrency: function(cents) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(cents / 100);
        },
        
        // Debounce function
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Copy text to clipboard
        copyToClipboard: async function(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.showToast('Copied to clipboard!', 'success');
                return true;
            } catch (err) {
                console.error('Failed to copy text: ', err);
                this.showToast('Failed to copy to clipboard', 'error');
                return false;
            }
        },
        
        // Show loading state
        showLoading: function(element) {
            const originalContent = element.innerHTML;
            element.setAttribute('data-original-content', originalContent);
            element.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
            element.disabled = true;
        },
        
        // Hide loading state
        hideLoading: function(element) {
            const originalContent = element.getAttribute('data-original-content');
            if (originalContent) {
                element.innerHTML = originalContent;
                element.removeAttribute('data-original-content');
            }
            element.disabled = false;
        }
    },
    
    // API helpers
    api: {
        // Make API request
        request: async function(endpoint, options = {}) {
            const url = `${LehrKI.config.apiBaseUrl}${endpoint}`;
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };
            
            try {
                const response = await fetch(url, { ...defaultOptions, ...options });
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Request failed');
                }
                
                return data;
            } catch (error) {
                console.error('API request failed:', error);
                throw error;
            }
        },
        
        // Chatbot API
        sendChatMessage: async function(message) {
            return this.request('/chatbot', {
                method: 'POST',
                body: JSON.stringify({ message })
            });
        }
    },
    
    // Form handling
    forms: {
        // Initialize form validation
        initValidation: function() {
            const forms = document.querySelectorAll('.needs-validation');
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', function(event) {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                });
            });
        },
        
        // Auto-save form data
        initAutoSave: function(formId, storageKey) {
            const form = document.getElementById(formId);
            if (!form) return;
            
            // Load saved data
            this.loadFormData(form, storageKey);
            
            // Save on input change
            const saveData = LehrKI.utils.debounce(() => {
                this.saveFormData(form, storageKey);
            }, 1000);
            
            form.addEventListener('input', saveData);
            
            // Clear saved data on successful submit
            form.addEventListener('submit', () => {
                localStorage.removeItem(storageKey);
            });
        },
        
        saveFormData: function(form, storageKey) {
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            localStorage.setItem(storageKey, JSON.stringify(data));
        },
        
        loadFormData: function(form, storageKey) {
            const savedData = localStorage.getItem(storageKey);
            if (!savedData) return;
            
            try {
                const data = JSON.parse(savedData);
                for (let [key, value] of Object.entries(data)) {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        if (input.type === 'radio' || input.type === 'checkbox') {
                            const specificInput = form.querySelector(`[name="${key}"][value="${value}"]`);
                            if (specificInput) specificInput.checked = true;
                        } else {
                            input.value = value;
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to load saved form data:', error);
            }
        }
    },
    
    // Token management
    tokens: {
        currentBalance: 0,
        
        // Update token balance display
        updateBalance: function(newBalance) {
            this.currentBalance = newBalance;
            const balanceElements = document.querySelectorAll('#token-balance, .token-balance');
            balanceElements.forEach(element => {
                element.textContent = newBalance;
                
                // Update color based on balance
                element.className = element.className.replace(/text-(success|warning|danger)/, '');
                if (newBalance < 10) {
                    element.classList.add('text-danger');
                } else if (newBalance < 50) {
                    element.classList.add('text-warning');
                } else {
                    element.classList.add('text-success');
                }
            });
            
            // Show warning if low
            if (newBalance < 10 && newBalance > 0) {
                LehrKI.utils.showToast('Token balance is running low!', 'warning');
            }
        },
        
        // Check if user has enough tokens
        hasEnoughTokens: function(required = 1) {
            return this.currentBalance >= required;
        }
    },
    
    // UI enhancements
    ui: {
        // Initialize tooltips
        initTooltips: function() {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function(tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        },
        
        // Initialize popovers
        initPopovers: function() {
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.map(function(popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl);
            });
        },
        
        // Smooth scroll to element
        scrollTo: function(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        },
        
        // Animate counter
        animateCounter: function(element, target, duration = 2000) {
            const start = parseInt(element.textContent) || 0;
            const increment = (target - start) / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                element.textContent = Math.round(current);
                
                if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                    element.textContent = target;
                    clearInterval(timer);
                }
            }, 16);
        }
    },
    
    // Initialize the application
    init: function() {
        // Initialize Bootstrap components
        this.ui.initTooltips();
        this.ui.initPopovers();
        
        // Initialize form validation
        this.forms.initValidation();
        
        // Initialize token balance if element exists
        const tokenBalanceElement = document.getElementById('token-balance');
        if (tokenBalanceElement) {
            this.tokens.currentBalance = parseInt(tokenBalanceElement.textContent) || 0;
        }
        
        // Initialize auto-save for forms
        const letterForm = document.getElementById('letterForm');
        if (letterForm) {
            this.forms.initAutoSave('letterForm', 'parent_letter_draft');
        }
        
        // Add click handlers for copy buttons
        document.addEventListener('click', function(e) {
            if (e.target.matches('[data-copy]')) {
                const targetId = e.target.getAttribute('data-copy');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    LehrKI.utils.copyToClipboard(targetElement.textContent || targetElement.value);
                }
            }
        });
        
        // Handle AJAX form submissions
        document.addEventListener('submit', function(e) {
            if (e.target.matches('.ajax-form')) {
                e.preventDefault();
                LehrKI.handleAjaxForm(e.target);
            }
        });
        
        // Initialize page-specific functionality
        this.initPageSpecific();
        
        console.log('LehrKI application initialized');
    },
    
    // Page-specific initialization
    initPageSpecific: function() {
        const path = window.location.pathname;
        
        if (path.includes('/parent-letter')) {
            this.initParentLetterPage();
        } else if (path.includes('/quiz/')) {
            this.initQuizPage();
        } else if (path.includes('/subscription')) {
            this.initSubscriptionPage();
        }
    },
    
    // Parent letter page initialization
    initParentLetterPage: function() {
        const form = document.getElementById('letterForm');
        if (!form) return;
        
        // Character counter for textarea
        const textarea = form.querySelector('textarea[name="student_context"]');
        if (textarea) {
            this.addCharacterCounter(textarea);
        }
        
        // Preview functionality
        const previewBtn = document.querySelector('.preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', this.previewLetter);
        }
    },
    
    // Quiz page initialization
    initQuizPage: function() {
        // Auto-save quiz progress
        const quizForm = document.getElementById('quizForm');
        if (quizForm) {
            const quizId = window.location.pathname.split('/').pop();
            this.forms.initAutoSave('quizForm', `quiz_${quizId}_progress`);
        }
    },
    
    // Subscription page initialization
    initSubscriptionPage: function() {
        // Animate usage percentages
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    },
    
    // Add character counter to textarea
    addCharacterCounter: function(textarea) {
        const maxLength = textarea.maxLength || 1000;
        const counter = document.createElement('div');
        counter.className = 'character-counter text-muted small text-end mt-1';
        textarea.parentNode.appendChild(counter);
        
        const updateCounter = () => {
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength}/${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.className = 'character-counter text-warning small text-end mt-1';
            } else {
                counter.className = 'character-counter text-muted small text-end mt-1';
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    },
    
    // Handle AJAX form submission
    handleAjaxForm: function(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        
        if (submitBtn) {
            this.utils.showLoading(submitBtn);
        }
        
        fetch(form.action || window.location.pathname, {
            method: form.method || 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.utils.showToast(data.message || 'Success!', 'success');
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            } else {
                this.utils.showToast(data.error || 'An error occurred', 'error');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            this.utils.showToast('An error occurred. Please try again.', 'error');
        })
        .finally(() => {
            if (submitBtn) {
                this.utils.hideLoading(submitBtn);
            }
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    LehrKI.init();
});

// Global utility functions for backwards compatibility
window.showToast = function(message, type) {
    LehrKI.utils.showToast(message, type);
};

window.copyToClipboard = function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const text = element.textContent || element.value;
        LehrKI.utils.copyToClipboard(text);
    }
};
