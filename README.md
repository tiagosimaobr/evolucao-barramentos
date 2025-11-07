# Evolução dos Barramentos de Disco

Uma página web interativa que simula a evolução dos barramentos de disco (SATA, SAS, NVMe, PCIe e Fibre Channel) com visualizações dinâmicas e simulações de performance.

## 🚀 Demonstração

Acesse a aplicação online: [Evolução dos Barramentos](https://seu-dominio.com/evolucao-barramentos)

## ✨ Recursos

### 🎯 Tecnologias Abordadas
- **SATA** (Serial ATA) - Sucessor do Parallel ATA com hot-swap
- **SAS** (Serial Attached SCSI) - Evolução enterprise do SCSI
- **NVMe** (Non-Volatile Memory Express) - Otimizado para SSDs
- **PCIe** (PCI Express) - Barramento serial de alta performance
- **Fibre Channel** - Tecnologia SAN para longas distâncias

### 🎨 Interface e Design
- **Tema Claro/Escuro** - Alternância com preferência salva
- **Design Responsivo** - Funciona em todos dispositivos
- **Animações Suaves** - Transições elegantes e micro-interações
- **Acessibilidade Total** - Navegação por teclado, leitores de tela, ARIA

### 📊 Visualizações
- **Timeline Interativa** - Navegação por clique, setas, swipe
- **Gráficos Comparativos** - Barras, radar e múltiplas métricas
- **Simulações em Tempo Real** - Transferência de 10GB por tecnologia
- **Tabelas Detalhadas** - Especificações técnicas completas

### ⚡ Performance
- **Canvas Nativo** - Gráficos renderizados com HTML5 Canvas
- **Otimizado** - Carregamento rápido e baixo consumo de recursos
- **Progressive Enhancement** - Funciona sem JavaScript (básico)

## 🛠️ Tecnologias Utilizadas

### Frontend Puro
- **HTML5** - Semântica moderna e acessibilidade
- **CSS3** - Variáveis CSS, Grid, Flexbox, Animações
- **JavaScript ES6+** - Classes, Arrow Functions, Async/Await
- **Canvas API** - Gráficos nativos sem dependências externas

### Características Técnicas
- **Sem Frameworks** - Vanilla JavaScript para máximo desempenho
- **Modular** - Código organizado em classes e módulos
- **Progressive Web App** - Funciona offline com Service Worker
- **SEO Otimizado** - Meta tags, Open Graph, Twitter Cards

## 📁 Estrutura do Projeto

```
evolucao-barramentos/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos principais
│   └── animations.css     # Animações personalizadas
├── js/
│   ├── technologies.js     # Dados das tecnologias
│   ├── timeline.js        # Componente timeline
│   ├── charts.js          # Gráficos comparativos
│   ├── simulations.js     # Simulações de transferência
│   └── main.js            # Controlador principal da aplicação
├── assets/                 # Imagens e recursos (opcional)
├── README.md              # Documentação
└── package.json            # Metadados do projeto
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Navegador moderno com suporte a ES6+
- Servidor web local (opcional para desenvolvimento)

### Execução Local

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/evolucao-barramentos.git
cd evolucao-barramentos
```

2. **Inicie um servidor local:**
```bash
# Usando Python 3
python3 -m http.server 3000

# Usando Node.js
npx serve .

# Usando PHP
php -S localhost:3000
```

3. **Acesse no navegador:**
```
http://localhost:3000
```

### Execução com Docker

```bash
# Build da imagem
docker build -t evolucao-barramentos .

# Executar container
docker run -p 3000:80 evolucao-barramentos
```

## 🎮 Como Usar

### Navegação pela Timeline
- **Clique** em qualquer tecnologia para ver detalhes
- **Setas** ← → para navegar entre tecnologias
- **Home/End** para ir ao início/fim
- **Espaço/Enter** para reproduzir animação automática
- **Swipe** em dispositivos touch

### Controles da Aplicação
- **🌙/☀️** - Alternar tema claro/escuro
- **✨/⏸️** - Ativar/desativar animações
- **❓** - Exibir ajuda e atalhos

### Simulação de Transferência
1. Selecione uma tecnologia no dropdown
2. Clique em "Iniciar Simulação"
3. Acompanhe o progresso em tempo real
4. Compare velocidades entre tecnologias

### Gráficos Comparativos
- **Largura de Banda** - Velocidade máxima de transferência
- **Latência** - Tempo de resposta das operações
- **IOPS** - Operações de I/O por segundo
- **Visão Geral** - Gráfico radar com todas métricas

## ⌨️ Atalhos de Teclado

| Atalho | Função |
|---------|---------|
| `Tab` | Navegar entre elementos |
| `←/→` | Navegar na timeline |
| `Home/End` | Início/Fim da timeline |
| `Espaço` | Reproduzir/Pausar animação |
| `Alt + T` | Alternar tema |
| `Alt + A` | Alternar animações |
| `F1` ou `Shift + ?` | Exibir ajuda |
| `Esc` | Fechar modais |

## 🎯 Especificações Técnicas

### Dados das Tecnologias
- **SATA III**: 6 Gb/s, 32 comandos, 5000μs latência
- **SAS-3**: 12 Gb/s, 254 comandos, 3000μs latência
- **NVMe 2.1**: 64 Gb/s, 65.535 comandos, 35μs latência
- **PCIe 4.0**: 64 Gb/s (x16), escalável
- **Fibre Channel 32G**: 32 Gb/s, baixa latência, 10km distância

### Performance
- **Transferência de 10GB**:
  - SATA III: ~16.7 segundos
  - SAS-3: ~8.3 segundos
  - NVMe: ~1.4 segundos
  - Fibre Channel: ~1.6 segundos

## 🔧 Personalização

### Cores e Temas
As cores são definidas via CSS Variables:
```css
:root {
    --accent-cyan: #00ffff;
    --accent-green: #00ff88;
    --accent-purple: #8844ff;
    --accent-orange: #ff8800;
    --accent-pink: #ff0088;
}
```

### Adicionar Nova Tecnologia
1. Edite `js/technologies.js`
2. Adicione ao array `technologies`
3. Inclua dados em `simulationData`

```javascript
{
    id: 'nova-tech',
    name: 'Nova Tech',
    fullName: 'Nova Tecnologia',
    year: 2024,
    speed: 128,
    speedUnit: 'Gb/s',
    latency: 10,
    queueDepth: 131070,
    useCase: 'Futuro',
    icon: '🚀',
    color: '#ff00ff',
    description: 'Descrição detalhada...',
    features: ['Feature 1', 'Feature 2'],
    limitations: ['Limitação 1'],
    generations: [
        { name: 'v1.0', speed: 64, year: 2020 },
        { name: 'v2.0', speed: 128, year: 2024 }
    ]
}
```

## 🌐 Deploy

### GitHub Pages
```bash
# Build (se necessário)
npm run build

# Deploy para GitHub Pages
npm run deploy
```

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Arrastar pasta para Netlify
# Ou usar CLI
netlify deploy --prod --dir=.
```

## 🧪 Testes

### Testes Manuais
1. **Funcionalidade**: Todas features funcionando
2. **Responsividade**: Testar em múltiplos tamanhos
3. **Acessibilidade**: Verificar navegação por teclado
4. **Performance**: Testar em dispositivos de baixo custo
5. **Compatibilidade**: Testar em múltiplos navegadores

### Testes Automáticos
```bash
# Instalar dependências de teste
npm install --save-dev jest puppeteer

# Executar testes
npm test
```

## 📈 Performance

### Métricas
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Otimizações
- **Lazy Loading** para imagens
- **Code Splitting** do JavaScript
- **Critical CSS** inline
- **Service Worker** para cache
- **Compression** Gzip/Brotli

## 🔒 Segurança

### Implementado
- **Content Security Policy** - Headers de segurança
- **XSS Protection** - Sanitização de inputs
- **HTTPS Only** - Apenas conexões seguras
- **Subresource Integrity** - Verificação de recursos

### Recomendações
- Usar HTTPS em produção
- Implementar HSTS
- Manter dependências atualizadas
- Monitorar vulnerabilidades

## 🤝 Contribuição

### Como Contribuir
1. **Fork** o repositório
2. **Branch** para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Add nova feature'`)
4. **Push** para o branch (`git push origin feature/nova-feature`)
5. **Pull Request** com descrição detalhada

### Diretrizes
- Seguir padrão de código existente
- Adicionar testes para novas features
- Documentar mudanças significativas
- Respeitar linha mestre de desenvolvimento

## 📝 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Créditos

### Conteúdo Técnico
- **Especificações SATA** - Serial ATA International Organization
- **Especificações SAS** - INCITS Technical Committee
- **Especificações NVMe** - NVM Express, Inc.
- **Especificações PCIe** - PCI-SIG
- **Especificações Fibre Channel** - INCITS Technical Committee

### Inspiração
- Design inspirado em interfaces modernas e acessíveis
- Animações baseadas em princípios de UX
- Performance otimizada para web moderna

## 📞 Suporte

### Documentação
- [Wiki do Projeto](https://github.com/tiagosimaobr/evolucao-barramentos/wiki)
- [API Reference](https://github.com/tiagosimaobr/evolucao-barramentos/blob/main/API.md)
- [Guia de Contribuição](https://github.com/tiagosimaobr/evolucao-barramentos/blob/main/CONTRIBUTING.md)

### Contato
- **Issues**: [GitHub Issues](https://github.com/tiagosimaobr/evolucao-barramentos/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tiagosimaobr/evolucao-barramentos/discussions)
- **Email**: tsenasimao@gmail.com

---

**Desenvolvido com ❤️ para educação e demonstração tecnológica**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-production-brightgreen.svg)
