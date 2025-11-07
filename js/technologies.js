// Dados das tecnologias de barramentos
const technologies = [
    {
        id: 'sata',
        name: 'SATA',
        fullName: 'Serial ATA',
        year: 2000,
        description: 'Serial ATA foi lançado em 2000 como sucessor do Parallel ATA, com cabos mais finos e suporte a hot-swap.',
        speed: 6,
        speedUnit: 'Gb/s',
        latency: 5000,
        queueDepth: 32,
        useCase: 'Consumidor e desktop',
        icon: '💿',
        color: '#00ffff',
        features: [
            'Cabos mais finos que PATA',
            'Suporte a hot-swap',
            'Compatibilidade com dispositivos legados',
            'Protocolo AHCI'
        ],
        limitations: [
            'Limitado a 32 comandos na fila',
            'Gargalo para SSDs modernos',
            'Latência relativamente alta'
        ],
        generations: [
            { name: 'SATA I', speed: 1.5, year: 2003 },
            { name: 'SATA II', speed: 3.0, year: 2005 },
            { name: 'SATA III', speed: 6.0, year: 2009 }
        ]
    },
    {
        id: 'sas',
        name: 'SAS',
        fullName: 'Serial Attached SCSI',
        year: 2003,
        description: 'Serial Attached SCSI (ANSI INCITS 376-2003) é a evolução do SCSI paralelo, projetado para ambientes enterprise.',
        speed: 12,
        speedUnit: 'Gb/s',
        latency: 3000,
        queueDepth: 254,
        useCase: 'Servidores e enterprise',
        icon: '🔌',
        color: '#00ff88',
        features: [
            'Confiabilidade 24×7',
            'Compatibilidade com discos SATA',
            'Múltiplas portas por controladora',
            'Dupla taxa de transferência do SATA'
        ],
        limitations: [
            'Custo mais elevado',
            'Complexidade de configuração',
            'Consumo de energia maior'
        ],
        generations: [
            { name: 'SAS-1', speed: 3.0, year: 2004 },
            { name: 'SAS-2', speed: 6.0, year: 2009 },
            { name: 'SAS-3', speed: 12.0, year: 2013 }
        ]
    },
    {
        id: 'nvme',
        name: 'NVMe',
        fullName: 'Non-Volatile Memory Express',
        year: 2011,
        description: 'NVMe foi criado para SSDs em 2011, utilizando PCI Express e múltiplas filas para máxima performance.',
        speed: 64,
        speedUnit: 'Gb/s',
        latency: 35,
        queueDepth: 65535,
        useCase: 'SSDs de alta performance',
        icon: '⚡',
        color: '#8844ff',
        features: [
            'Até 65.535 filas de comandos',
            'Latência ultra baixa',
            'Otimizado para SSDs',
            'Suporte a PCIe 4.0/5.0'
        ],
        limitations: [
            'Compatibilidade limitada',
            'Custo premium',
            'Requer slot PCIe'
        ],
        generations: [
            { name: 'NVMe 1.0', speed: 32, year: 2011 },
            { name: 'NVMe 1.3', speed: 32, year: 2017 },
            { name: 'NVMe 2.0', speed: 64, year: 2021 }
        ]
    },
    {
        id: 'pcie',
        name: 'PCIe',
        fullName: 'PCI Express',
        year: 2003,
        description: 'PCI Express é o barramento serial usado por placas de expansão e SSDs NVMe, com escalabilidade de pistas.',
        speed: 64,
        speedUnit: 'Gb/s',
        latency: 30,
        queueDepth: 32,
        useCase: 'Placas de expansão e SSDs',
        icon: '🔧',
        color: '#ff8800',
        features: [
            'Escalabilidade de pistas (x1, x4, x8, x16)',
            'Hot-plug support',
            'Compatibilidade reversa',
            'Alta largura de banda'
        ],
        limitations: [
            'Limitado por número de pistas',
            'Compatibilidade de gerações',
            'Complexidade de configuração'
        ],
        generations: [
            { name: 'PCIe 1.0', speed: 2.5, year: 2003 },
            { name: 'PCIe 2.0', speed: 5.0, year: 2007 },
            { name: 'PCIe 3.0', speed: 8.0, year: 2010 },
            { name: 'PCIe 4.0', speed: 16.0, year: 2017 },
            { name: 'PCIe 5.0', speed: 32.0, year: 2019 },
            { name: 'PCIe 6.0', speed: 64.0, year: 2022 }
        ]
    },
    {
        id: 'fibre-channel',
        name: 'Fibre Channel',
        fullName: 'Fibre Channel',
        year: 1994,
        description: 'Fibre Channel é tecnologia de SAN com transmissão de blocos de dados de baixa latência para ambientes enterprise.',
        speed: 32,
        speedUnit: 'Gb/s',
        latency: 100,
        queueDepth: 256,
        useCase: 'Storage Area Networks (SANs)',
        icon: '🌐',
        color: '#ff0088',
        features: [
            'Distâncias de até 10km',
            'Baixa latência',
            'Alta confiabilidade',
            'Multi-path support'
        ],
        limitations: [
            'Custo muito elevado',
            'Complexidade de implementação',
            'Requer hardware especializado'
        ],
        generations: [
            { name: '1GFC', speed: 1, year: 1997 },
            { name: '2GFC', speed: 2, year: 2001 },
            { name: '4GFC', speed: 4, year: 2004 },
            { name: '8GFC', speed: 8, year: 2008 },
            { name: '16GFC', speed: 16, year: 2011 },
            { name: '32GFC', speed: 32, year: 2016 }
        ]
    }
];

// Dados para simulação de transferência
const simulationData = {
    sata: { speed: 600, duration: 16.7 }, // 600 MB/s para 10GB
    sas: { speed: 1200, duration: 8.3 },  // 1200 MB/s para 10GB
    nvme: { speed: 7000, duration: 1.4 },  // 7000 MB/s para 10GB
    pcie: { speed: 7000, duration: 1.4 },  // 7000 MB/s para 10GB (PCIe 4.0 x4)
    'fibre-channel': { speed: 6400, duration: 1.6 } // 6400 MB/s para 10GB (32GFC x4)
};

// Funções utilitárias
function getTechnologyById(id) {
    return technologies.find(tech => tech.id === id);
}

function getTechnologiesByYear() {
    return [...technologies].sort((a, b) => a.year - b.year);
}

function getSpeedComparison() {
    return technologies.map(tech => ({
        name: tech.name,
        speed: tech.speed,
        color: tech.color,
        icon: tech.icon
    }));
}

function getLatencyComparison() {
    return technologies.map(tech => ({
        name: tech.name,
        latency: tech.latency,
        color: tech.color,
        icon: tech.icon
    }));
}

function getQueueDepthComparison() {
    return technologies.map(tech => ({
        name: tech.name,
        queueDepth: tech.queueDepth,
        color: tech.color,
        icon: tech.icon
    }));
}

function formatSpeed(speed, unit = 'Gb/s') {
    return `${speed} ${unit}`;
}

function formatLatency(latency) {
    if (latency < 1000) {
        return `${latency} μs`;
    } else {
        return `${(latency / 1000).toFixed(1)} ms`;
    }
}

function formatQueueDepth(depth) {
    if (depth >= 1000) {
        return `${(depth / 1000).toFixed(1)}K`;
    }
    return depth.toString();
}

function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function formatTime(seconds) {
    if (seconds < 60) {
        return `${seconds.toFixed(1)}s`;
    } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(1);
        return `${minutes}m ${remainingSeconds}s`;
    }
}

// Exportar para uso global
window.technologies = technologies;
window.simulationData = simulationData;
window.techUtils = {
    getTechnologyById,
    getTechnologiesByYear,
    getSpeedComparison,
    getLatencyComparison,
    getQueueDepthComparison,
    formatSpeed,
    formatLatency,
    formatQueueDepth,
    formatFileSize,
    formatTime
};
