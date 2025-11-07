// Chart functionality
class ComparisonCharts {
    constructor() {
        this.currentChart = 'bandwidth';
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        this.canvas = document.getElementById('comparison-chart');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.attachEventListeners();
        this.updateComparisonTable();
        this.drawChart('bandwidth');
    }

    attachEventListeners() {
        const buttons = document.querySelectorAll('.comparison-controls .btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                buttons.forEach(b => b.classList.remove('active', 'btn-primary'));
                buttons.forEach(b => b.classList.add('btn-secondary'));

                // Add active class to clicked button
                e.target.classList.remove('btn-secondary');
                e.target.classList.add('active', 'btn-primary');

                // Draw new chart
                const chartType = e.target.dataset.chart;
                this.drawChart(chartType);
            });
        });
    }

    drawChart(type) {
        if (!this.ctx) return;

        this.currentChart = type;
        this.clearCanvas();

        switch(type) {
            case 'bandwidth':
                this.drawBarChart(window.techUtils.getSpeedComparison(), 'speed');
                break;
            case 'latency':
                this.drawBarChart(window.techUtils.getLatencyComparison(), 'latency');
                break;
            case 'iops':
                this.drawBarChart(window.techUtils.getQueueDepthComparison(), 'queueDepth');
                break;
            case 'radar':
                this.drawRadarChart();
                break;
        }
    }

    clearCanvas() {
        if (!this.ctx || !this.canvas) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBarChart(data, property) {
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Set canvas size
        canvas.width = 800;
        canvas.height = 400;

        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const barWidth = chartWidth / data.length * 0.7;
        const barSpacing = chartWidth / data.length * 0.3;

        // Find max value for scaling
        const maxValue = Math.max(...data.map(item => item[property]));
        const scale = chartHeight / (maxValue * 1.1);

        // Draw grid lines
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color');
        ctx.lineWidth = 0.5;
        ctx.setLineDash([5, 5]);

        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();

            // Draw value labels
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary');
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'right';
            const value = maxValue * 1.1 * (1 - i / 5);
            const label = this.formatValue(property, value);
            ctx.fillText(label, padding - 10, y + 4);
        }

        ctx.setLineDash([]);

        // Draw bars
        data.forEach((item, index) => {
            const barHeight = item[property] * scale;
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = canvas.height - padding - barHeight;

            // Draw bar with gradient
            const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - padding);
            gradient.addColorStop(0, item.color);
            gradient.addColorStop(1, item.color + '40');
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Draw icon and name
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            
            // Icon
            ctx.font = '20px sans-serif';
            ctx.fillText(item.icon, x + barWidth / 2, canvas.height - padding + 25);
            
            // Name
            ctx.font = '12px sans-serif';
            ctx.fillText(item.name, x + barWidth / 2, canvas.height - padding + 45);

            // Value on top of bar
            ctx.fillStyle = item.color;
            ctx.font = 'bold 12px sans-serif';
            const valueLabel = this.formatValue(property, item[property]);
            ctx.fillText(valueLabel, x + barWidth / 2, y - 10);
        });

        // Draw axes
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // Draw title
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        const title = this.getChartTitle(property);
        ctx.fillText(title, canvas.width / 2, 30);
    }

    drawRadarChart() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        canvas.width = 800;
        canvas.height = 400;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 80;
        const technologies = window.technologies;

        // Properties to compare
        const properties = ['speed', 'latency', 'queueDepth'];
        const labels = ['Velocidade', 'Latência (invertida)', 'Fila (log)'];

        // Normalize values
        const maxValues = {
            speed: Math.max(...technologies.map(t => t.speed)),
            latency: Math.max(...technologies.map(t => t.latency)),
            queueDepth: Math.max(...technologies.map(t => t.queueDepth))
        };

        // Draw grid
        ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color');
        ctx.lineWidth = 0.5;

        // Draw concentric polygons
        for (let level = 1; level <= 5; level++) {
            const levelRadius = (radius / 5) * level;
            ctx.beginPath();
            for (let i = 0; i < properties.length; i++) {
                const angle = (Math.PI * 2 / properties.length) * i - Math.PI / 2;
                const x = centerX + Math.cos(angle) * levelRadius;
                const y = centerY + Math.sin(angle) * levelRadius;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw axes
        for (let i = 0; i < properties.length; i++) {
            const angle = (Math.PI * 2 / properties.length) * i - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();

            // Draw labels
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary');
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            const labelX = centerX + Math.cos(angle) * (radius + 20);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            ctx.fillText(labels[i], labelX, labelY);
        }

        // Draw data for each technology
        technologies.forEach(tech => {
            const normalizedValues = properties.map(prop => {
                let value = tech[prop];
                if (prop === 'latency') {
                    // Invert latency (lower is better)
                    value = maxValues[prop] - value;
                } else if (prop === 'queueDepth') {
                    // Use log scale for queue depth
                    value = Math.log10(value) * 20;
                }
                return (value / maxValues[prop]) * radius;
            });

            ctx.beginPath();
            ctx.strokeStyle = tech.color;
            ctx.lineWidth = 2;
            ctx.fillStyle = tech.color + '30';

            normalizedValues.forEach((value, i) => {
                const angle = (Math.PI * 2 / properties.length) * i - Math.PI / 2;
                const x = centerX + Math.cos(angle) * value;
                const y = centerY + Math.sin(angle) * value;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Draw points
            normalizedValues.forEach((value, i) => {
                const angle = (Math.PI * 2 / properties.length) * i - Math.PI / 2;
                const x = centerX + Math.cos(angle) * value;
                const y = centerY + Math.sin(angle) * value;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = tech.color;
                ctx.fill();
            });
        });

        // Draw legend
        const legendX = canvas.width - 150;
        const legendY = 30;
        
        technologies.forEach((tech, index) => {
            ctx.fillStyle = tech.color;
            ctx.fillRect(legendX, legendY + index * 25, 15, 15);
            
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(tech.name, legendX + 20, legendY + index * 25 + 12);
        });

        // Draw title
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Comparação Geral', canvas.width / 2, 30);
    }

    formatValue(property, value) {
        switch(property) {
            case 'speed':
                return `${value} Gb/s`;
            case 'latency':
                return value < 1000 ? `${value} μs` : `${(value/1000).toFixed(1)} ms`;
            case 'queueDepth':
                return value >= 1000 ? `${(value/1000).toFixed(1)}K` : value.toString();
            default:
                return value.toString();
        }
    }

    getChartTitle(property) {
        switch(property) {
            case 'speed':
                return 'Comparação de Velocidade (Gb/s)';
            case 'latency':
                return 'Comparação de Latência (μs)';
            case 'queueDepth':
                return 'Comparação de Profundidade da Fila';
            default:
                return 'Comparação de Performance';
        }
    }

    updateComparisonTable() {
        const tbody = document.getElementById('comparison-tbody');
        if (!tbody) return;

        const technologies = window.technologies;
        
        tbody.innerHTML = technologies.map(tech => `
            <tr>
                <td><strong>${tech.icon} ${tech.name}</strong></td>
                <td>${tech.year}</td>
                <td>${window.techUtils.formatSpeed(tech.speed, tech.speedUnit)}</td>
                <td>${window.techUtils.formatLatency(tech.latency)}</td>
                <td>${window.techUtils.formatQueueDepth(tech.queueDepth)}</td>
                <td>${tech.useCase}</td>
            </tr>
        `).join('');
    }
}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.comparisonCharts = new ComparisonCharts();
});
