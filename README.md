# 📋 TaskMaster - Sistema de Gestão de Tarefas

## 🎓 Projeto de Pós-Graduação em Desenvolvimento Mobile

### 📖 Descrição do Projeto

O **TaskMaster** é uma aplicação web moderna e robusta para gestão de tarefas pessoais e profissionais, desenvolvida como trabalho de conclusão da pós-graduação em Engenharia de Software. A aplicação demonstra a implementação de conceitos avançados de desenvolvimento web, sincronização de dados e experiência do usuário offline-first.

---

## 🚀 Funcionalidades Principais

### 💾 **Armazenamento Local com IndexedDB**
- **Persistência offline** completa das tarefas
- **Sincronização bidirecional** inteligente
- **Performance otimizada** com queries locais
- **Resiliência** em cenários de conexão instável

### 🔥 **Sincronização em Tempo Real com Firebase**
- **Firestore** para armazenamento em nuvem
- **Autenticação** segura de usuários
- **Sincronização automática** quando online
- **Backup** automático dos dados

### 📱 **Experiência Offline-First**
- **Service Workers** para controle de cache
- **Funcionalidade completa** sem conexão
- **Sincronização em background**
- **Notificações** de estado de conexão

### 📅 **Integração com Google Calendar**
- **Sincronização bidirecional** de eventos
- **Criação automática** de eventos a partir de tarefas
- **Atualização em tempo real** entre sistemas
- **Gestão unificada** de compromissos

### 🎤 **Reconhecimento de Voz**
- **Adição de tarefas** por comando de voz
- **Suporte ao português brasileiro**
- **Interface hands-free** para acessibilidade
- **Processamento** local e em nuvem

### 📍 **Geolocalização Inteligente**
- **Registro automático** da localização ao criar tarefas
- **Endereços formatados** a partir de coordenadas
- **Contexto geográfico** para tarefas
- **Mapas de visualização** de tarefas por localização

### 🔄 **Sistema de Sincronização Avançado**
- **Detecção automática** de conexão
- **Resolução de conflitos** inteligente
- **Merge automático** de dados
- **Histórico de alterações**

---

## 🛠️ Arquitetura e Tecnologias

### **Frontend**
- **React 18** com hooks modernos
- **Vite** para build e desenvolvimento
- **CSS Modules** para estilização
- **Context API** para gerenciamento de estado

### **Backend & Serviços**
- **Firebase Firestore** - Banco de dados em tempo real
- **Firebase Auth** - Autenticação de usuários
- **IndexedDB** - Armazenamento local
- **Service Workers** - Cache e funcionalidade offline

### **APIs e Integrações**
- **Google Calendar API** - Sincronização de agenda
- **Web Speech API** - Reconhecimento de voz
- **Geolocation API** - Serviços de localização
- **Notification API** - Alertas do sistema

### **Recursos Avançados**
- **PWA (Progressive Web App)** - Instalação nativa
- **Responsive Design** - Multi-dispositivos
- **Acessibilidade** - Navegação por teclado e voz
- **Performance** - Otimização de carregamento

---

## 📊 Características Técnicas

### **Padrões de Desenvolvimento**
- Clean Architecture e SOLID principles
- Componentes reutilizáveis e modulares
- Gerenciamento de estado previsível
- Tratamento robusto de erros

### **Segurança**
- Autenticação JWT com Firebase
- Validação de dados em múltiplas camadas
- Sanitização de inputs do usuário
- Políticas de CORS configuradas

### **Performance**
- Lazy loading de componentes
- Otimização de imagens e assets
- Cache inteligente de recursos
- Compressão e minificação

---

## 🎯 Objetivos Acadêmicos Atendidos

### **Conceitos Implementados**
- ✅ **Arquitetura de Software** - Padrões MVC e Flux
- ✅ **Banco de Dados** - SQL-like (IndexedDB) e NoSQL (Firestore)
- ✅ **Sincronização de Dados** - Estratégias offline-first
- ✅ **APIs RESTful** - Integração com serviços externos
- ✅ **UX/UI Design** - Interface intuitiva e responsiva
- ✅ **Testes e Qualidade** - Validação e tratamento de erros
- ✅ **DevOps** - Deploy automatizado e CI/CD

### **Contribuições Científicas**
- Estudo comparativo de estratégias de sincronização
- Análise de performance em ambientes com conectividade limitada
- Métricas de usabilidade em aplicações offline-first
- Padrões de design para PWAs complexas

---

## 📱 Como Utilizar

### **Instalação e Execução**
```bash
# Clone o repositório
git clone https://github.com/crisrud/pwa-tasks.git

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### **Configuração de Ambiente**
1. Configure as credenciais do Firebase
2. Ative as APIs do Google Calendar
3. Configure as permissões de microfone e localização
4. Defina as variáveis de ambiente necessárias

---

## 👥 Público-Alvo

### **Usuários Finais**
- Profissionais que necessitam de organização de tarefas
- Equipes que trabalham em ambientes com conectividade variável
- Pessoas que valorizam acessibilidade e comandos de voz

### **Acadêmicos e Desenvolvedores**
- Estudantes de engenharia de software
- Desenvolvedores interessados em PWAs avançadas
- Pesquisadores em computação móvel e sincronização

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do programa de Pós-Graduação em Engenharia de Software. O código está disponível para estudo e pesquisa.

---

## 👨‍🎓 Autor

**Cristiano Silva**  
Pós-Graduando em Desenvolvimento Mobile  
Ano: 2025

---

*"Transformando desafios técnicos em soluções inovadoras para a gestão do tempo e produtividade."*
