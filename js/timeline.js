// Timeline functionality
class Timeline {
    constructor() {
        this.currentIndex = 0;
        this.isPlaying = false;
        this.playInterval = null;
        this.technologies = window.techUtils.getTechnologiesByYear();
        this.init();
    }

    init() {
        this.renderTimeline();
        this.attachEventListeners();
        this.updateActiveTechnology(0);
    }

    renderTimeline() {
        const track = document.querySelector('.timeline-track');
        if (!track) return;

        track.innerHTML = '';

        this.technologies.forEach((tech, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.dataset.index = index;
            item.dataset.technology = tech.id;
            
            item.innerHTML = `
                <div class="timeline-point"></div>
                <div class="timeline-label">${tech.icon} ${tech.name}</div>
                <div class="timeline-year">${tech.year}</div>
            `;

            item.addEventListener('click', () => this.selectTechnology(index));
            track.appendChild(item);
        });
    }

    attachEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('timeline-prev');
        const nextBtn = document.getElementById('timeline-next');
        const playBtn = document.getElementById('timeline-play');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previous());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previous();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.next();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToStart();
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToEnd();
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.togglePlay();
                    break;
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        const track = document.querySelector('.timeline-track');
        if (track) {
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        }
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.previous();
            }
        }
    }

    selectTechnology(index) {
        this.currentIndex = index;
        this.updateActiveTechnology(index);
        this.showTechnologyDetails(this.technologies[index]);
        
        // Stop playing if user manually selects
        if (this.isPlaying) {
            this.stop();
        }
    }

    updateActiveTechnology(index) {
        const items = document.querySelectorAll('.timeline-item');
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    showTechnologyDetails(technology) {
        const techCard = document.getElementById('tech-card');
        if (!techCard) return;

        const techHeader = techCard.querySelector('.tech-header');
        const techSpecs = techCard.querySelector('.tech-specs');

        techHeader.innerHTML = `
            <h3 class="tech-title">${technology.icon} ${technology.name}</h3>
            <p class="tech-subtitle">${technology.fullName} - ${technology.year}</p>
        `;

        techSpecs.innerHTML = `
            <div class="spec-item">
                <span class="spec-label">Velocidade</span>
                <span class="spec-value">${window.techUtils.formatSpeed(technology.speed, technology.speedUnit)}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Latência</span>
                <span class="spec-value">${window.techUtils.formatLatency(technology.latency)}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Profundidade da Fila</span>
                <span class="spec-value">${window.techUtils.formatQueueDepth(technology.queueDepth)}</span>
            </div>
            <div class="spec-item">
                <span class="spec-label">Uso Principal</span>
                <span class="spec-value">${technology.useCase}</span>
            </div>
        `;

        // Update performance chart
        this.updatePerformanceChart(technology);

        // Add animation
        techCard.classList.remove('animate-scale-in');
        void techCard.offsetWidth; // Trigger reflow
        techCard.classList.add('animate-scale-in');
    }

    updatePerformanceChart(technology) {
        const canvas = document.getElementById('performance-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set canvas size
        canvas.width = 400;
        canvas.height = 300;

        // Chart data
        const data = [
            { label: 'Velocidade', value: technology.speed, max: 70, color: technology.color },
            { label: 'Latência (invertida)', value: 100 - (technology.latency / 100), max: 100, color: technology.color },
            { label: 'Fila (log)', value: Math.log10(technology.queueDepth) * 20, max: 100, color: technology.color }
        ];

        // Chart dimensions
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const barWidth = chartWidth / data.length * 0.6;
        const barSpacing = chartWidth / data.length * 0.4;

        // Draw bars
        data.forEach((item, index) => {
            const barHeight = (item.value / item.max) * chartHeight;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = canvas.height - padding - barHeight;

            // Draw bar
            ctx.fillStyle = item.color;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw value on top
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(
                item.label,
                x + barWidth / 2,
                y - 5
            );
        });

        // Draw axes
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
    }

    next() {
        if (this.currentIndex < this.technologies.length - 1) {
            this.selectTechnology(this.currentIndex + 1);
        }
    }

    previous() {
        if (this.currentIndex > 0) {
            this.selectTechnology(this.currentIndex - 1);
        }
    }

    goToStart() {
        this.selectTechnology(0);
    }

    goToEnd() {
        this.selectTechnology(this.technologies.length - 1);
    }

    togglePlay() {
        const playBtn = document.getElementById('timeline-play');
        if (!playBtn) return;

        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        const playBtn = document.getElementById('timeline-play');
        if (playBtn) {
            playBtn.innerHTML = '<span class="icon">⏸️</span>';
            playBtn.classList.add('playing');
        }

        this.playInterval = setInterval(() => {
            if (this.currentIndex < this.technologies.length - 1) {
                this.next();
            } else {
                this.goToStart();
            }
        }, 3000);
    }

    stop() {
        this.isPlaying = false;
        const playBtn = document.getElementById('timeline-play');
        if (playBtn) {
            playBtn.innerHTML = '<span class="icon">▶️</span>';
            playBtn.classList.remove('playing');
        }

        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }

    // Public methods
    getCurrentTechnology() {
        return this.technologies[this.currentIndex];
    }

    goToTechnology(techId) {
        const index = this.technologies.findIndex(tech => tech.id === techId);
        if (index !== -1) {
            this.selectTechnology(index);
        }
    }
}

// Initialize timeline when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.timeline = new Timeline();
});
