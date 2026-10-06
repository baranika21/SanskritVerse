# SanskritVerse — AI Sanskrit Learning & Computational Linguistics Lab

> **A production-quality, highly interactive educational web ecosystem combining ancient Pāṇinian grammar with cutting-edge natural language processing, conversational AI tutoring, and 3D knowledge exploration.**

[![CI/CD: Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins%20Pipeline-blue?logo=jenkins)](./Jenkinsfile)
[![Docker: Compose](https://img.shields.io/badge/Docker-Compose%20Ready-2496ED?logo=docker)](./docker-compose.yml)
[![Node.js](https://img.shields.io/badge/Node.js-v22.14.0-339933?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?logo=three.js)](https://threejs.org)
[![MySQL 8.0](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com)

---

## 1. Executive Overview

**SanskritVerse** is designed to feel like:
$$\text{Duolingo} + \text{AI Tutor} + \text{Sanskrit Grammar Laboratory} + \text{3D Interactive Universe}$$
with its own distinct identity inspired by classical Vedic aesthetics and computational acoustics.

Unlike static text-based chatbots, **SanskritVerse** features a complete educational architecture:
- **Acharya AI Tutor (आचार्यः)**: Conversational tutor across 7 distinct pedagogical modes with Devanagari glossing.
- **Computational Linguistics Lab (भाषाविज्ञान-प्रयोगशाला)**: Pāṇinian tokenization, IAST/Harvard-Kyoto/SLP1 transliteration, morphological parsing, and dynamic Kāraka dependency syntax tree visualization.
- **Grammar Academy & Sandhi Lab**: Interactive 8 Vibhaktis visualizer, Dhātu root derivational trees (गम्, भू, पठ्), and step-by-step Sandhi transformation simulator.
- **3D Sanskrit Universe**: Procedural glowing **Knowledge Tree** and futuristic **3D Sanskrit Temple** with 6 learning chambers (*Kakṣas*), paired with a responsive 2D Mandala fallback.
- **Acoustic Pronunciation Lab**: Real-time microphone audio capture, waveform visualization, and 86%+ phonetic accuracy scoring with pitch and tempo metrics.
- **Sentence Builder**: Drag-and-drop word tile arrangement with immediate syntactic validation and XP incentives.
- **Spaced-Repetition Vocabulary**: 3D flip flashcards powered by the **SuperMemo SM-2 algorithm**.
- **Devanagari Varṇamālā**: Phonetic grid organized by vocal points of articulation (*Sthānas*).
- **Gamification & Analytics**: 6 learning tiers, daily streaks, badges, global leaderboard, and **"My Mistakes"** diagnostic recommendations.

---

## 2. System Architecture

```
                                +-------------------------------------------+
                                |               Web Browser                 |
                                |     React 18 + TS + Tailwind + Three.js   |
                                +---------------------+---------------------+
                                                      |
                                                      | HTTPS / REST (JSON)
                                                      v
                                +-------------------------------------------+
                                |               Backend API                 |
                                |          Node.js + Express + TS           |
                                |   - Acharya AI Pedagogical Engine         |
                                |   - Computational Sanskrit Linguistics    |
                                |   - Sandhi & Morphological Parsers        |
                                |   - SM-2 Spaced Repetition Engine         |
                                +----------+---------------------+----------+
                                           |                     |
                        Dual-Mode DB Pool  |                     | External LLM (Optional)
                                           v                     v
                   +-------------------------------+     +---------------+
                   |          MySQL 8.0 /          |     | OpenAI/Gemini |
                   |       Resilient SQLite        |     |   API (Env)   |
                   +-------------------------------+     +---------------+
```

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS, Glassmorphism, and custom Vedic design tokens
- **3D Graphics**: Three.js, `@react-three/fiber`, and `@react-three/drei`
- **Animations**: Framer Motion & Canvas Confetti
- **Icons**: Lucide React
- **Acoustics**: Web Speech API & Web Audio API synthesis

### Backend
- **Runtime**: Node.js v22 with TypeScript
- **Framework**: Express.js
- **Security**: JSON Web Tokens (JWT), bcryptjs password hashing, CORS
- **Database Connector**: `mysql2/promise` with connection pooling
- **Testing**: Vitest, Supertest, and Jest assertion library

### Database (MySQL 8.0)
16 Relational Tables with Foreign Keys, Cascades, and Indexes:
1. `users`: Credentials, levels, XP, streak counters, and avatar metadata
2. `user_progress`: Granular lesson tracking and scores
3. `lessons`: Progressive curriculum modules from Devanagari to Literature
4. `vocabulary`: Lexicon categorized across 12 domains with roots & audio
5. `grammar_topics`: Vibhaktis, Lakāras, Sandhi rules, and Samāsa
6. `quiz_questions`: Multi-format questions (MCQ, Fill in blank, Match, Arrange, Timed)
7. `quiz_attempts`: User quiz history and accuracy tracking
8. `achievements`: Master badge catalog with XP rewards
9. `user_achievements`: User unlocked achievement milestones
10. `learning_streaks`: Daily activity log and consecutive day streaks
11. `chatbot_history`: Acharya AI dialogue transcripts with Devanagari glosses
12. `pronunciation_attempts`: Audio recording evaluations and acoustic scores
13. `daily_challenges`: Curated daily Sanskrit practice challenges
14. `leaderboard`: Cached global student XP rankings
15. `saved_words`: SM-2 spaced repetition state (ease factor, intervals)
16. `user_settings`: Dark/Light theme, 3D quality level, and audio preferences

---

## 4. Repository Structure

```
sanskritverse/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Auth, Chat, Linguistics, Vocab, Quizzes, etc.
│   │   ├── middleware/       # JWT auth & error handlers
│   │   ├── routes/           # REST API endpoints
│   │   ├── services/         # Acharya AI, Sandhi, Linguistics, SM-2, DB
│   │   ├── tests/            # Automated Vitest/Supertest suites
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # HTTP entry point
│   ├── Dockerfile            # Backend multi-stage container
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/           # Knowledge Tree, Temple & 2D fallback
│   │   │   ├── layout/       # Navbar, Sidebar, Footer
│   │   │   └── vocabulary/   # 3D Flip Flashcards
│   │   ├── pages/            # 14 Full-featured interactive pages
│   │   ├── services/         # API client & Speech engine
│   │   ├── store/            # App state store (XP, Levels, Themes)
│   │   ├── types/            # TypeScript data models
│   │   ├── App.tsx           # View switcher & layout
│   │   └── main.tsx
│   ├── Dockerfile            # Frontend multi-stage Nginx container
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── database/
│   ├── schema.sql            # Full MySQL 8.0 DDL (16 tables)
│   ├── seed_vocabulary.sql   # Authentic Sanskrit words with roots & examples
│   ├── seed_grammar.sql      # Vibhaktis, Dhātu paradigms, Sandhi formulas
│   ├── seed_quizzes.sql      # Multi-format quiz question bank
│   └── seed_data.sql         # Lessons, default users, badges, challenges
│
├── docker-compose.yml        # Multi-container orchestration (DB, API, UI)
├── Dockerfile                # Root build definition
├── Jenkinsfile               # Production 9-stage CI pipeline
├── .env.example              # Environment variables template
├── .dockerignore
└── README.md
```

---

## 5. Quickstart & Local Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **npm**: v9.0.0 or higher
- **MySQL 8.0** *(Optional for local dev; built-in zero-config relational engine automatically provides full functionality if MySQL is offline)*

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sanskritverse.git
cd sanskritverse
```

### 2. Configure Environment Variables
Copy `.env.example` to create `.env`:
```bash
cp .env.example backend/.env
```

### 3. Install Backend & Run Tests
```bash
cd backend
npm install
npm test
npm run build
npm start
```
*The backend API will start at: `http://localhost:5000`*

### 4. Install Frontend & Launch Development Server
In a separate terminal:
```bash
cd frontend
npm install
npm run build
npm run dev
```
*The frontend web application will start at: `http://localhost:3000`*

---

## 6. Docker & Containerized Deployment

To launch the complete production ecosystem (MySQL 8.0 container + Node.js API + Nginx Frontend) with a single command:

```bash
docker-compose up --build
```

### Container Endpoints:
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **MySQL Database**: `localhost:3306`

---

## 7. Jenkins Continuous Integration (CI) Pipeline

The provided `Jenkinsfile` runs a production-grade 9-stage pipeline:

```
Developer Push → GitHub Webhook → Jenkins CI Pipeline
   │
   ├── 1. Checkout (Pull latest Git commit)
   ├── 2. Install Dependencies (Parallel npm ci for backend & frontend)
   ├── 3. Build (TypeScript compilation & Vite asset production)
   ├── 4. Test (Automated Vitest unit & integration test suites)
   ├── 5. Validate (Database SQL syntax & schema verification)
   ├── 6. Docker Build (Container image builds via Docker Compose)
   ├── 7. Docker Image Verification (Container configuration audit)
   ├── 8. Post-Execution Clean-up & Artifact Archival
   └── 9. Status Reporting (Success/Failure notification)
```

To configure in Jenkins:
1. Create a **New Pipeline Item** named `sanskritverse-ci`.
2. Set Definition to **Pipeline script from SCM**.
3. Choose **Git**, enter your GitHub repository URL, and point Script Path to `Jenkinsfile`.
4. Trigger on SCM commit push.

---

## 8. Default Demo Credentials

You can log in directly or explore the pre-seeded learner account:
- **Username**: `vidyarthi` (or `student@sanskritverse.io`)
- **Password**: `Sanskrit@2026!`
- **Current Level**: Level 3 (Sentence Builder)
- **Active Streak**: 12 Days 🔥
- **XP**: 2,450 XP

---

## 9. Computational Linguistics Reference

### Sandhi Engine
Implements authentic Pāṇinian sūtras:
- **Savarṇa Dīrgha**: अकः सवर्णे दीर्घः (6.1.101) $\rightarrow$ `विद्या + आलयः = विद्यालयः`
- **Guṇa**: आद्गुणः (6.1.87) $\rightarrow$ `राम + इति = रामेति`, `महा + उत्सवः = महोत्सवः`
- **Vṛddhi**: वृद्धिरेचि (6.1.88) $\rightarrow$ `एक + एकम् = एकैकम्`
- **Yaṇ**: इको यणचि (6.1.77) $\rightarrow$ `इति + आदि = इत्यादि`, `सु + आगतम् = स्वागतम्`
- **Utva Visarga**: अतो रोरप्लुतादप्लुते (6.1.113) $\rightarrow$ `कः + अयम् = कोऽयम्`

### Kāraka Dependency Syntactic Roles
- **प्रथमा (Nominative)** $\rightarrow$ कर्ता (Agent / Subject)
- **द्वितीया (Accusative)** $\rightarrow$ कर्म (Patient / Goal of motion)
- **तृतीया (Instrumental)** $\rightarrow$ करण (Means / Instrument)
- **चतुर्थी (Dative)** $\rightarrow$ सम्प्रदान (Recipient / Beneficiary)
- **पञ्चमी (Ablative)** $\rightarrow$ अपादान (Source / Separation point)
- **षष्ठी (Genitive)** $\rightarrow$ सम्बन्ध (Possessive relation)
- **सप्तमी (Locative)** $\rightarrow$ अधिकरण (Locus / Location)
- **सम्बोधनम् (Vocative)** $\rightarrow$ सम्बोधन (Direct address)

---

## 10. License

Released under the **MIT License**. Created for academic and software engineering demonstration.
ॐ शान्तिः शान्तिः शान्तिः।
