// Simulation functionality
class FileTransferSimulation {
    constructor() {
        this.isRunning = false;
        this.currentTechnology = null;
        this.progress = 0;
        this.startTime = null;
        this.animationFrame = null;
        this.fileSize = 10 * 1024 * 1024 * 1024; // 10 GB in bytes
        this.init();
    }

    init() {
        this.populateTechnologySelect();
        this.attachEventListeners();
    }

    populateTechnologySelect() {
        const select = document.getElementById('sim-tech-select');
        if (!select) return;

        const technologies = window.technologies;
        
        select.innerHTML = '<option value="">Selecione uma tecnologia</option>' +
            technologies.map(tech => 
                `<option value="${tech.id}">${tech.icon} ${tech.name}</option>`
            ).join('');
    }

    attachEventListeners() {
        const select = document.getElementById('sim-tech-select');
        const startBtn = document.getElementById('sim-start');

        if (select) {
            select.addEventListener('change', (e) => {
                const techId = e.target.value;
                if (techId) {
                    this.currentTechnology = window.techUtils.getTechnologyById(techId);
                    if (startBtn) {
                        startBtn.disabled = false;
                    }
                } else {
                    this.currentTechnology = null;
                    if (startBtn) {
                        startBtn.disabled = true;
                    }
                }
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (this.isRunning) {
                    this.stop();
                } else {
                    this.start();
                }
            });
        }
    }

    start() {
        if (!this.currentTechnology || this.isRunning) return;

        this.isRunning = true;
        this.progress = 0;
        this.startTime = Date.now();

        const startBtn = document.getElementById('sim-start');
        if (startBtn) {
            startBtn.textContent = 'Parar';
            startBtn.classList.add('btn-danger');
        }

        const simData = window.simulationData[this.currentTechnology.id];
        if (!simData) return;

        this.animate(simData);
    }

    stop() {
        this.isRunning = false;

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        const startBtn = document.getElementById('sim-start');
        if (startBtn) {
            startBtn.textContent = 'Iniciar Simulação';
            startBtn.classList.remove('btn-danger');
        }
    }

    animate(simData) {
        if (!this.isRunning) return;

        const currentTime = Date.now();
        const elapsed = (currentTime - this.startTime) / 1000; // Convert to seconds
        const expectedProgress = Math.min((elapsed / simData.duration) * 100, 100);

        // Smooth progress animation
        if (this.progress < expectedProgress) {
            this.progress = Math.min(this.progress + 0.5, expectedProgress);
        }

        this.updateUI(simData);

        if (this.progress >= 100) {
            this.complete();
        } else {
            this.animationFrame = requestAnimationFrame(() => this.animate(simData));
        }
    }

    updateUI(simData) {
        // Update progress bar
        const progressFill = document.getElementById('sim-progress');
        if (progressFill) {
            progressFill.style.width = `${this.progress}%`;
        }

        // Update percentage
        const percentage = document.getElementById('sim-percentage');
        if (percentage) {
            percentage.textContent = `${Math.round(this.progress)}%`;
        }

        // Update speed
        const speed = document.getElementById('sim-speed');
        if (speed) {
            speed.textContent = `${simData.speed} MB/s`;
        }

        // Update time
        const time = document.getElementById('sim-time');
        if (time) {
            const remaining = (100 - this.progress) / 100 * simData.duration;
            time.textContent = window.techUtils.formatTime(remaining);
        }
    }

    complete() {
        this.stop();
        
        // Show completion notification
        if (window.showNotification) {
            window.showNotification(
                `Transferência concluída! ${this.currentTechnology.icon} ${this.currentTechnology.name}`,
                'success'
            );
        }

        // Add completion animation
        const progressFill = document.getElementById('sim-progress');
        if (progressFill) {
            progressFill.classList.add('success');
            setTimeout(() => {
                progressFill.classList.remove('success');
            }, 2000);
        }

        // Reset after delay
        setTimeout(() => {
            this.reset();
        }, 3000);
    }

    reset() {
        this.progress = 0;
        this.currentTechnology = null;

        const progressFill = document.getElementById('sim-progress');
        if (progressFill) {
            progressFill.style.width = '0%';
        }

        const percentage = document.getElementById('sim-percentage');
        if (percentage) {
            percentage.textContent = '0%';
        }

        const speed = document.getElementById('sim-speed');
        if (speed) {
            speed.textContent = '0 MB/s';
        }

        const time = document.getElementById('sim-time');
        if (time) {
            time.textContent = '0s';
        }

        const select = document.getElementById('sim-tech-select');
        if (select) {
            select.value = '';
        }

        const startBtn = document.getElementById('sim-start');
        if (startBtn) {
            startBtn.disabled = true;
        }
    }

    // Public methods
    getCurrentTechnology() {
        return this.currentTechnology;
    }

    isSimulationRunning() {
        return this.isRunning;
    }
}

// Performance monitoring class
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            renderTime: 0
        };
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.init();
    }

    init() {
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            this.updateMetrics();
        }, 1000);
    }

    updateMetrics() {
        // Calculate FPS
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.frameCount++;

        if (deltaTime >= 1000) {
            this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastFrameTime = currentTime;
        }

        // Get memory usage if available
        if (performance.memory) {
            this.metrics.memory = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
        }

        // Update display if element exists
        this.updateDisplay();
    }

    updateDisplay() {
        const perfDisplay = document.getElementById('performance-display');
        if (perfDisplay) {
            perfDisplay.innerHTML = `
                FPS: ${this.metrics.fps} | 
                Memory: ${this.metrics.memory}MB | 
                Render: ${this.metrics.renderTime}ms
            `;
        }
    }

    startRenderTimer() {
        this.renderStartTime = performance.now();
    }

    endRenderTimer() {
        if (this.renderStartTime) {
            this.metrics.renderTime = Math.round(performance.now() - this.renderStartTime);
        }
    }
}

// Initialize simulations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.simulation = new FileTransferSimulation();
    window.performanceMonitor = new PerformanceMonitor();
});
