// Main application controller
class App {
    constructor() {
        this.theme = 'dark';
        this.animationsEnabled = true;
        this.notifications = [];
        this.init();
    }

    init() {
        this.loadSettings();
        this.attachEventListeners();
        this.setupAccessibility();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
        this.showWelcomeMessage();
    }

    loadSettings() {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.theme = savedTheme;
            this.applyTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            this.theme = 'light';
            this.applyTheme('light');
        }

        // Load animations preference
        const savedAnimations = localStorage.getItem('animations');
        if (savedAnimations !== null) {
            this.animationsEnabled = savedAnimations === 'true';
            this.toggleAnimations(this.animationsEnabled);
        }
    }

    attachEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Animations toggle
        const animationsToggle = document.getElementById('animations-toggle');
        if (animationsToggle) {
            animationsToggle.addEventListener('click', () => this.toggleAnimations());
        }

        // Help toggle
        const helpToggle = document.getElementById('help-toggle');
        if (helpToggle) {
            helpToggle.addEventListener('click', () => this.showHelp());
        }

        // Help close
        const helpClose = document.getElementById('help-close');
        if (helpClose) {
            helpClose.addEventListener('click', () => this.hideHelp());
        }

        // Modal backdrop click
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    this.hideHelp();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Navigation smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });

        // Performance monitoring
        if (window.performanceMonitor) {
            setInterval(() => {
                this.checkPerformance();
            }, 5000);
        }
    }

    handleKeyboardShortcuts(e) {
        // Skip to main content
        if (e.key === 'Tab' && e.shiftKey && !e.target.closest('.skip-link')) {
            return; // Let default behavior handle Shift+Tab
        }

        // Help modal
        if (e.key === 'F1' || (e.key === '?' && e.shiftKey)) {
            e.preventDefault();
            this.showHelp();
        }

        // Theme toggle
        if (e.key === 't' && e.altKey) {
            e.preventDefault();
            this.toggleTheme();
        }

        // Animations toggle
        if (e.key === 'a' && e.altKey) {
            e.preventDefault();
            this.toggleAnimations();
        }

        // Escape to close modal
        if (e.key === 'Escape') {
            this.hideHelp();
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.icon');
            if (icon) {
                icon.textContent = this.theme === 'dark' ? '🌙' : '☀️';
            }
        }

        this.showNotification(
            `Tema ${this.theme === 'dark' ? 'escuro' : 'claro'} ativado`,
            'info'
        );
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = theme === 'dark' ? '#0a0a0a' : '#ffffff';
        }
    }

    toggleAnimations(force = null) {
        if (force !== null) {
            this.animationsEnabled = force;
        } else {
            this.animationsEnabled = !this.animationsEnabled;
        }

        document.body.classList.toggle('no-animations', !this.animationsEnabled);
        localStorage.setItem('animations', this.animationsEnabled.toString());

        const animationsToggle = document.getElementById('animations-toggle');
        if (animationsToggle) {
            const icon = animationsToggle.querySelector('.icon');
            if (icon) {
                icon.textContent = this.animationsEnabled ? '✨' : '⏸️';
            }
        }

        this.showNotification(
            `Animações ${this.animationsEnabled ? 'ativadas' : 'desativadas'}`,
            'info'
        );
    }

    showHelp() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.add('active');
            helpModal.setAttribute('aria-hidden', 'false');
            
            // Focus first focusable element
            const firstFocusable = helpModal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    }

    hideHelp() {
        const helpModal = document.getElementById('help-modal');
        if (helpModal) {
            helpModal.classList.remove('active');
            helpModal.setAttribute('aria-hidden', 'true');
        }
    }

    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.getElementById('notification');
        if (!notification) return;

        // Create notification element
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        // Auto hide
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.className = 'notification';
                notification.removeAttribute('role');
                notification.removeAttribute('aria-live');
            }, 300);
        }, duration);

        // Add to history
        this.notifications.push({ message, type, timestamp: Date.now() });
        if (this.notifications.length > 10) {
            this.notifications.shift();
        }
    }

    setupAccessibility() {
        // Add ARIA labels dynamically
        this.setupAriaLabels();
        
        // Setup focus management
        this.setupFocusManagement();
        
        // Setup screen reader announcements
        this.setupScreenReader();
    }

    setupAriaLabels() {
        // Add labels to interactive elements
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            const tech = window.technologies[index];
            if (tech) {
                item.setAttribute('aria-label', `${tech.name} - ${tech.year} - Clique para detalhes`);
                item.setAttribute('role', 'button');
                item.setAttribute('tabindex', '0');
            }
        });

        // Add labels to chart controls
        document.querySelectorAll('.comparison-controls .btn').forEach(btn => {
            const chartType = btn.dataset.chart;
            const labels = {
                bandwidth: 'Gráfico de largura de banda',
                latency: 'Gráfico de latência',
                iops: 'Gráfico de IOPS',
                radar: 'Gráfico radar geral'
            };
            btn.setAttribute('aria-label', labels[chartType] || chartType);
        });
    }

    setupFocusManagement() {
        // Track focus for better keyboard navigation
        let lastFocusedElement = null;

        document.addEventListener('focus', (e) => {
            lastFocusedElement = e.target;
            
            // Add focus indicator
            document.body.classList.add('keyboard-navigation');
        }, true);

        document.addEventListener('blur', () => {
            setTimeout(() => {
                if (document.activeElement === document.body) {
                    document.body.classList.remove('keyboard-navigation');
                }
            }, 10);
        }, true);

        // Return focus after modal closes
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (lastFocusedElement && lastFocusedElement.focus) {
                    setTimeout(() => lastFocusedElement.focus(), 100);
                }
            }
        });
    }

    setupScreenReader() {
        // Announce important changes
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcer);

        window.announceToScreenReader = (message) => {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        };
    }

    setupSmoothScrolling() {
        // Polyfill for smooth scroll behavior
        if (!('scrollBehavior' in document.documentElement.style)) {
            this.polyfillSmoothScroll();
        }
    }

    polyfillSmoothScroll() {
        const originalScrollTo = window.scrollTo;
        window.scrollTo = function(options) {
            if (typeof options === 'object' && options.behavior === 'smooth') {
                const startY = window.pageYOffset;
                const targetY = options.top || 0;
                const distance = targetY - startY;
                const duration = 500;
                let start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    const ease = 1 - Math.pow(1 - percentage, 3);
                    
                    window.scrollTo(0, startY + (distance * ease));
                    
                    if (progress < duration) {
                        requestAnimationFrame(step);
                    }
                }

                requestAnimationFrame(step);
            } else {
                originalScrollTo.apply(this, arguments);
            }
        };
    }

    setupIntersectionObserver() {
        // Animate elements on scroll
        if (!window.IntersectionObserver) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    smoothScrollTo(element) {
        const headerOffset = 80; // Account for sticky header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    checkPerformance() {
        if (!window.performanceMonitor) return;

        const metrics = window.performanceMonitor.metrics;
        
        // Show warning if performance is poor
        if (metrics.fps < 30) {
            console.warn('Low FPS detected:', metrics.fps);
        }

        if (metrics.memory > 100) {
            console.warn('High memory usage:', metrics.memory);
        }

        // Update performance display if exists
        const perfDisplay = document.getElementById('performance-display');
        if (perfDisplay) {
            perfDisplay.innerHTML = `
                FPS: ${metrics.fps} | 
                Memory: ${metrics.memory}MB | 
                Render: ${metrics.renderTime}ms
            `;
        }
    }

    showWelcomeMessage() {
        // Show welcome message on first visit
        const hasVisited = localStorage.getItem('has-visited');
        if (!hasVisited) {
            setTimeout(() => {
                this.showNotification(
                    'Bem-vindo! Use as setas para navegar na timeline ou clique no botão de ajuda (?)',
                    'info',
                    5000
                );
                localStorage.setItem('has-visited', 'true');
            }, 1000);
        }
    }

    // Public API
    getVersion() {
        return '1.0.0';
    }

    getSettings() {
        return {
            theme: this.theme,
            animationsEnabled: this.animationsEnabled,
            notifications: this.notifications
        };
    }

    exportSettings() {
        const settings = this.getSettings();
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'evolucao-barramentos-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Global notification function
window.showNotification = function(message, type = 'info', duration = 3000) {
    if (window.app) {
        window.app.showNotification(message, type, duration);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    // Add loading complete indicator
    document.body.classList.add('loaded');
    
    console.log('🚀 Evolução dos Barramentos initialized');
    console.log('📊 Technologies loaded:', window.technologies.length);
    console.log('🎨 Theme:', window.app.theme);
    console.log('✨ Animations:', window.app.animationsEnabled ? 'enabled' : 'disabled');
});

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    
    if (window.showNotification) {
        window.showNotification('Ocorreu um erro. Por favor, recarregue a página.', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    
    if (window.showNotification) {
        window.showNotification('Ocorreu um erro inesperado.', 'error');
    }
});
