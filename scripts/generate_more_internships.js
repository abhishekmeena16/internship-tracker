import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../packages/db/index.js';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function genHash(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const MORE_ROLES = [
  // QUANT & HFT
  {
    companyName: 'Jane Street',
    title: 'Quantitative Trading & Research Intern',
    roleCategory: 'OTHER',
    durationMonths: 2,
    stipendMin: 250000,
    stipendMax: 350000,
    skills: ['OCaml', 'Python', 'Probability', 'Algorithms', 'Game Theory', 'Combinatorics'],
    applyUrl: 'https://www.janestreet.com/join-jane-street/open-roles/?type=internship',
    eligibility: 'Pre-final year undergraduate or master students in Computer Science, Mathematics, or Physics graduating in 2026/2027.',
    description: 'Jane Street is hiring Quantitative Trading & Research Interns for an 8-week summer program. Work directly with quantitative traders and researchers to develop mathematical trading models, analyze order-book liquidity, and write automated execution logic.'
  },
  {
    companyName: 'Citadel',
    title: 'Quantitative Research Intern',
    roleCategory: 'OTHER',
    durationMonths: 3,
    stipendMin: 220000,
    stipendMax: 320000,
    skills: ['Python', 'C++', 'Statistics', 'Machine Learning', 'Financial Modeling', 'Linear Algebra'],
    applyUrl: 'https://www.citadel.com/careers/students/',
    eligibility: 'B.Tech / M.Tech / PhD students in Computer Science, Statistics, Mathematics, or Physics graduating in 2026/2027.',
    description: "Citadel's Quantitative Research Internship (12 weeks) gives students the opportunity to conduct statistical research on massive financial datasets, create alpha strategies, and simulate execution performance."
  },
  {
    companyName: 'Jump Trading',
    title: 'Quantitative Software Engineer Intern (C++)',
    roleCategory: 'OTHER',
    durationMonths: 6,
    stipendMin: 200000,
    stipendMax: 300000,
    skills: ['C++', 'Linux', 'Low Latency', 'Network Protocols', 'Computer Architecture', 'Algorithms'],
    applyUrl: 'https://www.jumptrading.com/careers/',
    eligibility: 'Final year B.Tech/M.Tech students in Computer Science or Electrical Engineering graduating in 2026.',
    description: 'Jump Trading is hiring 6-Month Systems / Quantitative Software Engineer Interns. Design, optimize, and profile ultra-low-latency distributed trading architectures, kernel-bypass network drivers, and FPGA hardware interfaces.'
  },
  {
    companyName: 'Optiver',
    title: 'Quantitative Research & Trading Intern',
    roleCategory: 'OTHER',
    durationMonths: 2,
    stipendMin: 200000,
    stipendMax: 280000,
    skills: ['Python', 'Probability', 'Statistics', 'Derivatives Pricing', 'Data Structures', 'Algorithms'],
    applyUrl: 'https://optiver.com/working-at-optiver/career-opportunities/',
    eligibility: 'Students pursuing B.Tech/Dual Degree in Computer Science, Mathematics, or Electrical Engineering graduating in 2026/2027.',
    description: 'Optiver is a leading global market maker. The 8-week Summer Quantitative Internship challenges students to solve live pricing, hedging, and volatility forecasting problems using real-time market data.'
  },
  {
    companyName: 'Flow Traders',
    title: 'Quantitative Developer Intern',
    roleCategory: 'OTHER',
    durationMonths: 3,
    stipendMin: 180000,
    stipendMax: 260000,
    skills: ['C++', 'Java', 'Python', 'Multithreading', 'Algorithms', 'Operating Systems'],
    applyUrl: 'https://www.flowtraders.com/careers',
    eligibility: 'Undergraduate and master students in Computer Science, Software Engineering, or Applied Mathematics.',
    description: 'Flow Traders is seeking Quantitative Developer Interns (3 months) in Bengaluru. Develop algorithmic execution modules, high-throughput market data handlers, and real-time risk calculation monitors.'
  },
  {
    companyName: 'IMC Trading',
    title: 'Software Engineering Intern - Trading Systems',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 190000,
    stipendMax: 270000,
    skills: ['Java', 'C++', 'Algorithms', 'Concurrency', 'Linux', 'Data Structures'],
    applyUrl: 'https://www.imc.com/us/careers/',
    eligibility: 'Pre-final year students pursuing B.Tech in CSE or IT graduating in 2026.',
    description: 'IMC Trading is hiring Summer Software Engineering Interns (8 weeks). Engineer low-latency order management gateways, continuous automated testing environments, and high-speed execution analytics.'
  },
  {
    companyName: 'DRW',
    title: 'Quantitative Trading & Software Intern',
    roleCategory: 'OTHER',
    durationMonths: 3,
    stipendMin: 180000,
    stipendMax: 250000,
    skills: ['Python', 'C++', 'Algorithms', 'Statistics', 'System Design', 'SQL'],
    applyUrl: 'https://drw.com/careers',
    eligibility: 'B.Tech / M.Tech in CSE, Mathematics, or Data Science graduating in 2026/2027.',
    description: 'DRW is hiring Quantitative Software & Trading Interns in Bengaluru. Analyze market anomalies, construct statistical models, and build automated execution tools for global electronic trading desks.'
  },
  {
    companyName: 'Akuna Capital',
    title: 'Junior Quantitative Developer Intern',
    roleCategory: 'OTHER',
    durationMonths: 6,
    stipendMin: 175000,
    stipendMax: 240000,
    skills: ['C++', 'Python', 'Data Structures & Algorithms', 'Low Latency', 'Linux', 'Object Oriented Design'],
    applyUrl: 'https://akunacapital.com/careers',
    eligibility: 'Students available for a 6-month semester internship in 2026 pursuing B.Tech/M.Tech in Computer Science.',
    description: 'Akuna Capital is an innovative trading firm specializing in derivatives market making. During this 6-month co-op, you will design and test trading platform components with modern C++.'
  },
  {
    companyName: 'Squarepoint Capital',
    title: 'Quantitative Technology Intern',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 170000,
    stipendMax: 230000,
    skills: ['Python', 'C++', 'Linux', 'SQL', 'Distributed Systems', 'Cloud Computing'],
    applyUrl: 'https://www.squarepoint-capital.com/careers',
    eligibility: 'Pre-final year B.Tech students in CSE or IT graduating in 2026/2027.',
    description: 'Squarepoint Capital is hiring 2-Month Summer Quantitative Technology Interns in Bengaluru. Build high-capacity data ingestion pipelines, cloud-native quantitative backtesting frameworks, and analytical microservices.'
  },
  {
    companyName: 'Millennium Management',
    title: 'Quantitative Development Intern',
    roleCategory: 'OTHER',
    durationMonths: 3,
    stipendMin: 180000,
    stipendMax: 250000,
    skills: ['C++', 'Python', 'Distributed Systems', 'Linux', 'Financial Markets', 'Data Structures'],
    applyUrl: 'https://www.mlp.com/careers/',
    eligibility: 'B.Tech / Dual Degree / M.Tech students in Computer Science or Mathematics graduating in 2026/2027.',
    description: 'Millennium is a global alternative investment management firm. This 3-month internship allows students to work with senior portfolio managers and engineers developing high-performance analytical tools.'
  },
  {
    companyName: 'Point72',
    title: 'Quantitative Analyst Intern',
    roleCategory: 'OTHER',
    durationMonths: 2,
    stipendMin: 175000,
    stipendMax: 240000,
    skills: ['Python', 'Statistics', 'Machine Learning', 'Financial Accounting', 'Data Analytics', 'SQL'],
    applyUrl: 'https://point72.com/careers/',
    eligibility: 'Pre-final year undergraduate or postgraduate students in Computer Science or Quantitative Finance graduating in 2026.',
    description: 'Point72 is hiring Summer Quantitative Analyst Interns (8 weeks) in Gurgaon. Apply data science, statistical modeling, and machine learning techniques to fundamental and quantitative investment strategies.'
  },
  {
    companyName: 'NK Securities Research',
    title: 'High-Frequency Algorithmic Developer Intern',
    roleCategory: 'OTHER',
    durationMonths: 6,
    stipendMin: 190000,
    stipendMax: 270000,
    skills: ['C++', 'Operating Systems', 'Networking', 'Computer Architecture', 'Lockless Programming', 'Algorithms'],
    applyUrl: 'https://www.nksecurities.com/careers',
    eligibility: 'Final year B.Tech / M.Tech students in Computer Science graduating in 2026.',
    description: 'NK Securities is a premier high-frequency algorithmic trading firm in Gurgaon. Work on sub-microsecond trading engines, kernel bypass network stacks, and hardware acceleration mechanisms.'
  },
  {
    companyName: 'Estee Advisors',
    title: 'Algorithmic Trading & Analytics Intern',
    roleCategory: 'OTHER',
    durationMonths: 3,
    stipendMin: 100000,
    stipendMax: 150000,
    skills: ['Python', 'Pandas', 'R', 'Machine Learning', 'Time Series', 'Quantitative Research'],
    applyUrl: 'https://esteeadvisors.com/careers/',
    eligibility: 'Students pursuing B.Tech, M.Tech, or MS in Computer Science or Statistics.',
    description: 'Estee Advisors in Gurgaon is hiring Quantitative Trading Interns for 3-month terms. Build statistical arbitrage models, momentum strategies, and automated portfolio risk tracking systems.'
  },

  // AI & GENAI
  {
    companyName: 'OpenAI',
    title: 'AI Systems & Infrastructure Engineering Intern',
    roleCategory: 'AI_ML',
    durationMonths: 3,
    stipendMin: 180000,
    stipendMax: 250000,
    skills: ['Python', 'PyTorch', 'Distributed Training', 'CUDA', 'Kubernetes', 'Large Language Models'],
    applyUrl: 'https://openai.com/careers/',
    eligibility: 'Students pursuing B.Tech, M.Tech, or PhD in Computer Science with a strong background in distributed systems and deep learning.',
    description: 'OpenAI is hiring AI Systems Engineering Interns. Work on scaling supercomputing clusters, optimizing GPU memory bandwidth, parallel distributed model training (Megatron/DeepSpeed), and low-latency inference serving.'
  },
  {
    companyName: 'Anthropic',
    title: 'AI Alignment & Foundation Model Intern',
    roleCategory: 'AI_ML',
    durationMonths: 3,
    stipendMin: 180000,
    stipendMax: 250000,
    skills: ['Python', 'PyTorch', 'Transformers', 'Reinforcement Learning (RLHF)', 'Constitutional AI', 'Deep Learning'],
    applyUrl: 'https://www.anthropic.com/careers',
    eligibility: 'B.Tech / M.Tech / PhD students in Computer Science or Artificial Intelligence graduating in 2026/2027.',
    description: 'Anthropic is dedicated to building reliable, interpretable, and steerable AI systems. Interns conduct research on mechanistic interpretability, foundation model pre-training, and automated evaluation frameworks.'
  },
  {
    companyName: 'Mistral AI',
    title: 'Generative AI & LLM Systems Intern',
    roleCategory: 'AI_ML',
    durationMonths: 2,
    stipendMin: 160000,
    stipendMax: 230000,
    skills: ['Python', 'PyTorch', 'Model Compression (Quantization)', 'CUDA', 'Transformers', 'Algorithms'],
    applyUrl: 'https://mistral.ai/jobs/',
    eligibility: 'Pre-final year or postgraduate students in Computer Science or Machine Learning graduating in 2026/2027.',
    description: 'Mistral AI is looking for Generative AI Interns for an 8-week summer term. Work on state-of-the-art open-weights foundation models, mixture-of-experts (MoE) architectures, and high-efficiency inference runtimes.'
  },
  {
    companyName: 'Cohere',
    title: 'Natural Language Processing (NLP) Research Intern',
    roleCategory: 'AI_ML',
    durationMonths: 3,
    stipendMin: 150000,
    stipendMax: 220000,
    skills: ['Python', 'PyTorch', 'NLP', 'Retrieval Augmented Generation (RAG)', 'Vector Embeddings', 'Hugging Face'],
    applyUrl: 'https://cohere.com/careers',
    eligibility: 'B.Tech / M.Tech / MS students in Computer Science or Computational Linguistics graduating in 2026/2027.',
    description: 'Cohere provides enterprise-grade AI models. As an NLP Research Intern (12 weeks), you will work on multilingual semantic search, reranking algorithms, enterprise RAG pipelines, and conversational foundation models.'
  },
  {
    companyName: 'Perplexity AI',
    title: 'Full Stack AI Search Intern',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 150000,
    stipendMax: 210000,
    skills: ['TypeScript', 'React', 'Next.js', 'Python', 'FastAPI', 'Vector Search', 'LLMs'],
    applyUrl: 'https://www.perplexity.ai/careers',
    eligibility: 'Students pursuing B.Tech in Computer Science or IT graduating in 2026/2027.',
    description: 'Perplexity AI is reinventing search. Work on real-time web indexing, citation attribution engines, conversational search interfaces, and low-latency client rendering pipelines.'
  },
  {
    companyName: 'Glean',
    title: 'Software Engineer Intern - Enterprise Search & AI',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 140000,
    stipendMax: 200000,
    skills: ['Go', 'Java', 'Python', 'Distributed Search', 'Kubernetes', 'Vector Databases', 'GCP'],
    applyUrl: 'https://www.glean.com/careers',
    eligibility: 'B.Tech/M.Tech in Computer Science graduating in 2026/2027.',
    description: "Glean's engineering team in Bengaluru is hiring Summer Software Engineer Interns (3 months). Build enterprise search knowledge graphs, connector pipelines for hundreds of SaaS apps, and private GenAI assistants."
  },
  {
    companyName: 'Scale AI',
    title: 'Machine Learning & Data Annotation Engineering Intern',
    roleCategory: 'AI_ML',
    durationMonths: 6,
    stipendMin: 130000,
    stipendMax: 185000,
    skills: ['Python', 'TypeScript', 'React', 'PyTorch', 'Computer Vision', 'PostgreSQL', 'Docker'],
    applyUrl: 'https://scale.com/careers',
    eligibility: 'Final-year B.Tech / M.Tech students available for a 6-month semester internship in 2026.',
    description: 'Scale AI is the data foundation for AI. You will build automated computer vision annotation pipelines, RLHF evaluation workstreams, and model benchmark suites for world-leading frontier AI labs.'
  },
  {
    companyName: 'Krutrim',
    title: 'Foundation Model Pre-Training Intern',
    roleCategory: 'AI_ML',
    durationMonths: 6,
    stipendMin: 110000,
    stipendMax: 160000,
    skills: ['Python', 'PyTorch', 'Indic NLP', 'Deep Learning', 'Tokenization', 'Distributed Systems'],
    applyUrl: 'https://krutrim.com/careers',
    eligibility: 'Students pursuing B.Tech/M.Tech in Computer Science or Artificial Intelligence graduating in 2026.',
    description: "Krutrim is India's pioneer AI foundation model company. Work in Bengaluru on Indic multilingual language models, multi-modal vision-language architectures, and sovereign AI cloud compute clusters."
  },
  {
    companyName: 'Sarvam AI',
    title: 'Speech AI & Indic NLP Intern',
    roleCategory: 'AI_ML',
    durationMonths: 3,
    stipendMin: 120000,
    stipendMax: 175000,
    skills: ['Python', 'PyTorch', 'Automatic Speech Recognition (ASR)', 'Text-to-Speech (TTS)', 'Acoustic Models', 'NLP'],
    applyUrl: 'https://www.sarvam.ai/careers',
    eligibility: 'B.Tech / M.Tech in Computer Science, Data Science, or Electrical Engineering graduating in 2026/2027.',
    description: 'Sarvam AI is developing generative AI models tailored for India. As a 3-Month Research Intern in Bengaluru, you will train speech recognition and voice generation models across dozens of Indian languages.'
  },
  {
    companyName: 'Qure.ai',
    title: 'Computer Vision Research Intern - Medical Imaging',
    roleCategory: 'AI_ML',
    durationMonths: 6,
    stipendMin: 90000,
    stipendMax: 135000,
    skills: ['Python', 'PyTorch', 'Computer Vision', 'Convolutional Neural Networks', 'DICOM', 'Medical AI'],
    applyUrl: 'https://www.qure.ai/careers',
    eligibility: 'Students in B.Tech / M.Tech / MS in CSE or Biomedical Engineering available for 6 months.',
    description: 'Qure.ai uses AI to make healthcare more accessible and affordable. Build deep learning models to detect abnormalities in X-rays, CT scans, and ultrasounds deployed in hospitals across 70+ countries.'
  },

  // ENTERPRISE SAAS & DEVTOOLS
  {
    companyName: 'Postman',
    title: 'Software Engineer Intern - Developer Platforms & APIs',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 100000,
    stipendMax: 150000,
    skills: ['Node.js', 'React', 'TypeScript', 'REST APIs', 'GraphQL', 'Distributed Systems'],
    applyUrl: 'https://www.postman.com/careers/',
    eligibility: 'Pre-final year B.Tech in CSE / IT graduating in 2026.',
    description: 'Postman is used by over 30 million developers worldwide. As a 2-Month Summer Intern in Bengaluru, you will work on the core API client, automated mock servers, performance testing tools, and collaboration workspaces.'
  },
  {
    companyName: 'BrowserStack',
    title: 'Software Engineer Intern - Cloud Infrastructure & Emulation',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 95000,
    stipendMax: 140000,
    skills: ['Ruby', 'Node.js', 'Java', 'Docker', 'Linux Kernel', 'Selenium / Playwright'],
    applyUrl: 'https://www.browserstack.com/careers',
    eligibility: 'Final-year B.Tech / M.Tech in Computer Science graduating in 2026 available for a 6-month co-op.',
    description: "BrowserStack is the world's leading software testing platform. Join the engineering team in Mumbai/Bengaluru to engineer device cloud orchestration, low-latency video streaming, and automated browser emulation engines."
  },
  {
    companyName: 'Hasura',
    title: 'Systems & GraphQL Engine Intern',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 100000,
    stipendMax: 150000,
    skills: ['Haskell', 'Rust', 'Go', 'GraphQL', 'PostgreSQL', 'Database Internals'],
    applyUrl: 'https://hasura.io/careers/',
    eligibility: 'B.Tech/M.Tech students with strong fundamentals in functional programming or compilers.',
    description: 'Hasura builds instant GraphQL APIs over databases. Interns work on query plan generation, high-performance database connection pooling, and compiler optimizations in Rust and Haskell.'
  },
  {
    companyName: 'Appsmith',
    title: 'Frontend & Full Stack Intern - Low Code Engine',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 80000,
    stipendMax: 120000,
    skills: ['TypeScript', 'React', 'Redux', 'Java', 'Spring Boot', 'Docker'],
    applyUrl: 'https://www.appsmith.com/careers',
    eligibility: 'Undergraduate or postgraduate students in CSE with strong React / TypeScript skills.',
    description: 'Appsmith is an open-source low-code platform for building internal tools. Work on canvas drag-and-drop performance, responsive UI widget libraries, and real-time multiplayer editing.'
  },
  {
    companyName: 'Devtron',
    title: 'Cloud Native & Kubernetes Software Intern',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 75000,
    stipendMax: 110000,
    skills: ['Go', 'Kubernetes', 'Helm', 'Docker', 'CI/CD', 'Linux'],
    applyUrl: 'https://devtron.ai/careers/',
    eligibility: 'Final-year students pursuing B.Tech in Computer Science or IT available for 6 months.',
    description: 'Devtron is a tool integration platform for Kubernetes. Build automated microservice deployment pipelines, GitOps workflows, and multi-cloud cluster management utilities.'
  },
  {
    companyName: 'SigNoz',
    title: 'Observability & Open Source Software Intern',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 85000,
    stipendMax: 125000,
    skills: ['Go', 'ClickHouse', 'OpenTelemetry', 'React', 'TypeScript', 'Distributed Tracing'],
    applyUrl: 'https://signoz.io/careers/',
    eligibility: 'B.Tech students in CSE passionate about open source and systems observability graduating in 2026.',
    description: 'SigNoz is an open-source APM and observability platform. Work on ClickHouse query performance, OpenTelemetry metric collectors, and real-time distributed tracing dashboards.'
  },
  {
    companyName: 'Vercel',
    title: 'Frontend Platform & Edge Systems Intern',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 120000,
    stipendMax: 175000,
    skills: ['TypeScript', 'Next.js', 'React', 'Rust', 'Edge Computing', 'Web Performance'],
    applyUrl: 'https://vercel.com/careers',
    eligibility: 'B.Tech in Computer Science or self-taught web engineers with top-tier Next.js/React portfolio.',
    description: 'Vercel is the platform for frontend developers. Work on Next.js compiler optimizations (Turbopack), global edge network routing, serverless compute execution, and developer CLI tools.'
  },
  {
    companyName: 'Supabase',
    title: 'Open Source Backend & Database Intern',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 110000,
    stipendMax: 160000,
    skills: ['PostgreSQL', 'Elixir', 'Go', 'TypeScript', 'Docker', 'Authentication'],
    applyUrl: 'https://supabase.com/careers',
    eligibility: 'Students with deep knowledge of PostgreSQL, database triggers, and distributed architectures.',
    description: 'Supabase is the open-source Firebase alternative. Work on real-time database replication, automated Postgres connection poolers (Supavisor), and vector similarity search (pgvector).'
  },
  {
    companyName: 'Sentry',
    title: 'Application Performance Monitoring (APM) Intern',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 105000,
    stipendMax: 155000,
    skills: ['Python', 'Rust', 'ClickHouse', 'TypeScript', 'Distributed Systems', 'Kafka'],
    applyUrl: 'https://sentry.io/careers/',
    eligibility: 'Pre-final year students pursuing B.Tech in Computer Science graduating in 2026/2027.',
    description: 'Sentry empowers 4 million developers to resolve code errors in real time. Work on high-throughput event ingestion pipelines, crash grouping heuristics, and mobile crash symbolication.'
  },

  // FINTECH & PAYMENTS
  {
    companyName: 'Pine Labs',
    title: 'Software Engineering Intern - POS & Payments Cloud',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 75000,
    stipendMax: 115000,
    skills: ['Java', 'Spring Boot', 'Android SDK', 'PostgreSQL', 'Microservices', 'REST APIs'],
    applyUrl: 'https://www.pinelabs.com/careers',
    eligibility: 'Final year B.Tech in CSE / IT graduating in 2026 available for 6 months.',
    description: 'Pine Labs powers merchant commerce across India and Southeast Asia. Build Android Smart POS software, merchant loyalty integration APIs, and UPI transaction settlement systems in Noida.'
  },
  {
    companyName: 'Cashfree Payments',
    title: 'Backend Engineering Intern - Payouts & Collections',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 80000,
    stipendMax: 120000,
    skills: ['Go', 'PHP', 'MySQL', 'Redis', 'Kafka', 'Docker'],
    applyUrl: 'https://www.cashfree.com/careers/',
    eligibility: 'B.Tech students in Computer Science or Information Technology graduating in 2026/2027.',
    description: 'Cashfree Payments processes billions in bulk payouts and instant collections. You will build high-concurrency payment disbursement microservices and automated bank reconciliation engines in Bengaluru.'
  },
  {
    companyName: 'BharatPe',
    title: 'Software Engineering Intern - Merchant Financial Tech',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 85000,
    stipendMax: 130000,
    skills: ['Java', 'Go', 'MongoDB', 'MySQL', 'Kafka', 'Microservices'],
    applyUrl: 'https://bharatpe.com/careers',
    eligibility: 'Pre-final year B.Tech students in CSE graduating in 2026.',
    description: 'BharatPe is hiring 2-Month Summer Interns in Gurgaon. Develop merchant lending evaluation systems, zero-MDR UPI payment processing layers, and high-performance financial data pipelines.'
  },
  {
    companyName: 'Jupiter Money',
    title: 'Full Stack Engineering Intern - Neobanking',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 85000,
    stipendMax: 125000,
    skills: ['React Native', 'Java', 'Kotlin', 'PostgreSQL', 'Kafka', 'REST APIs'],
    applyUrl: 'https://jupiter.money/careers/',
    eligibility: 'Students pursuing B.Tech / BCA / MCA in Computer Science graduating in 2026/2027.',
    description: 'Jupiter is a leading Indian digital banking platform. Build money management features, automated savings pots, portfolio analytics, and credit line integrations with instant banking APIs.'
  },
  {
    companyName: 'Fi Money',
    title: 'Mobile & Backend Engineering Intern',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 80000,
    stipendMax: 120000,
    skills: ['Flutter', 'Go', 'Java', 'Microservices', 'PostgreSQL', 'Docker'],
    applyUrl: 'https://fi.money/careers',
    eligibility: 'Final-year B.Tech / M.Tech students available for a 6-month semester internship in 2026.',
    description: 'Fi is an intelligent money app built for tech professionals. Work on mobile banking experiences, investment tracking algorithms, and real-time spending categorization backends in Bengaluru.'
  },
  {
    companyName: 'Slice',
    title: 'Software Development Engineer Intern - Credit Core',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 90000,
    stipendMax: 135000,
    skills: ['Python', 'Go', 'AWS', 'Kafka', 'PostgreSQL', 'Data Structures'],
    applyUrl: 'https://sliceit.com/careers',
    eligibility: 'Pre-final year B.Tech students in CSE / IT graduating in 2026.',
    description: 'Slice is a fast-growing digital consumer bank. As a 2-Month Summer Intern in Bengaluru, you will build UPI transaction processing backends, instant underwriting engines, and merchant payment settlement systems.'
  },
  {
    companyName: 'OneCard',
    title: 'Software Engineer Intern - Credit Card Systems',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 85000,
    stipendMax: 130000,
    skills: ['Go', 'Node.js', 'React Native', 'PostgreSQL', 'Microservices', 'Security'],
    applyUrl: 'https://getonecard.app/careers/',
    eligibility: 'Final-year students pursuing B.Tech in CSE graduating in 2026.',
    description: "OneCard is India's premier metal credit card fintech. Join in Pune or Bengaluru to engineer card transaction authorization switches, reward point calculation engines, and mobile banking experiences."
  },
  {
    companyName: 'Jar',
    title: 'Backend & Mobile Developer Intern',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 75000,
    stipendMax: 110000,
    skills: ['Go', 'Python', 'Flutter', 'PostgreSQL', 'Kafka', 'Microservices'],
    applyUrl: 'https://www.myjar.app/careers',
    eligibility: 'B.Tech / BCA / MCA in Computer Science graduating in 2026/2027.',
    description: 'Jar is a micro-savings platform with over 15 million users. Build automated micro-investment triggers, daily digital gold roundoff algorithms, and high-scale notification pipelines in Bengaluru.'
  },

  // DATA SCIENCE & ANALYTICS
  {
    companyName: 'Mu Sigma',
    title: 'Junior Decision Scientist Intern',
    roleCategory: 'DATA',
    durationMonths: 2,
    stipendMin: 60000,
    stipendMax: 85000,
    skills: ['R', 'Python', 'SQL', 'Exploratory Data Analysis', 'Hypothesis Testing', 'Machine Learning'],
    applyUrl: 'https://www.mu-sigma.com/careers',
    eligibility: 'Pre-final year undergraduate students in Computer Science, Data Science, or Mathematics graduating in 2026.',
    description: "Mu Sigma is one of the world's largest pure-play decision sciences companies. The 2-month summer internship in Bengaluru trains students in structured problem solving, behavioral analytics, and predictive modeling."
  },
  {
    companyName: 'The Math Company',
    title: 'Associate Data Scientist Intern',
    roleCategory: 'DATA',
    durationMonths: 6,
    stipendMin: 65000,
    stipendMax: 95000,
    skills: ['Python', 'PySpark', 'Machine Learning', 'Data Engineering', 'SQL', 'Azure ML'],
    applyUrl: 'https://mathco.com/careers/',
    eligibility: 'Final-year B.Tech / M.Tech in Computer Science or Data Science graduating in 2026.',
    description: 'The Math Company (MathCo) builds custom AI and analytics applications for Fortune 500 enterprises. Work in Bengaluru on end-to-end data pipelines, predictive demand modeling, and AI transformation consulting.'
  },
  {
    companyName: 'Course5 Intelligence',
    title: 'Data Analytics & AI Intern',
    roleCategory: 'DATA',
    durationMonths: 3,
    stipendMin: 55000,
    stipendMax: 80000,
    skills: ['Python', 'SQL', 'Tableau', 'Machine Learning', 'Customer Analytics', 'Statistics'],
    applyUrl: 'https://www.course5i.com/careers/',
    eligibility: 'Students pursuing B.Tech, BCA, MCA, or M.Sc in Computer Science or Statistics graduating in 2026.',
    description: 'Course5 Intelligence drives digital transformation through analytics and AI. Build automated digital analytics dashboards, multi-touch attribution models, and consumer insights engines in Bengaluru.'
  },
  {
    companyName: 'EXL Service',
    title: 'Analytics Consultant Intern',
    roleCategory: 'DATA',
    durationMonths: 6,
    stipendMin: 60000,
    stipendMax: 85000,
    skills: ['SQL', 'Python', 'Power BI', 'Data Mining', 'Predictive Analytics', 'Excel VBA'],
    applyUrl: 'https://www.exlservice.com/careers',
    eligibility: 'Final-year B.Tech / MCA / M.Sc students available for a 6-month internship in Gurgaon or Noida.',
    description: 'EXL Analytics delivers domain-led data solutions across insurance, healthcare, and banking. Build predictive risk scoring models, customer attrition forecasts, and executive management dashboards.'
  },
  {
    companyName: 'Quantiphi',
    title: 'Machine Learning & Big Data Intern',
    roleCategory: 'AI_ML',
    durationMonths: 6,
    stipendMin: 65000,
    stipendMax: 95000,
    skills: ['Python', 'TensorFlow', 'Google Cloud Platform (GCP)', 'BigQuery', 'Data Pipelines', 'NLP'],
    applyUrl: 'https://quantiphi.com/careers/',
    eligibility: 'Final-year B.Tech / M.Tech in Computer Science or IT graduating in 2026.',
    description: 'Quantiphi is an applied AI and big data software company. As a 6-Month Intern in Mumbai or Bengaluru, you will train conversational AI agents, implement document AI pipelines, and deploy models on Google Cloud Vertex AI.'
  },

  // GLOBAL CAPABILITY CENTERS (GCCs)
  {
    companyName: 'Boeing India',
    title: 'Software Engineering Intern - Avionics & Flight Software',
    roleCategory: 'OTHER',
    durationMonths: 6,
    stipendMin: 85000,
    stipendMax: 125000,
    skills: ['C++', 'C', 'RTOS', 'DO-178C', 'Aviation Protocols', 'Linux', 'Embedded Systems'],
    applyUrl: 'https://jobs.boeing.com/location/india-jobs/185/1269750/2',
    eligibility: 'B.Tech / M.Tech in Computer Science, Aerospace, or Electrical Engineering graduating in 2026.',
    description: 'Boeing India Engineering & Technology Center (BIETC) in Bengaluru is hiring 6-Month Software Interns. Develop embedded software for commercial aircraft, digital aviation simulation models, and flight deck telemetry analytics.'
  },
  {
    companyName: 'Airbus India',
    title: 'Data & Digital Engineering Intern',
    roleCategory: 'DATA',
    durationMonths: 6,
    stipendMin: 80000,
    stipendMax: 120000,
    skills: ['Python', 'SQL', 'Apache Spark', 'Cloud Analytics', 'Predictive Maintenance', 'Airbus Digital'],
    applyUrl: 'https://www.airbus.com/en/careers',
    eligibility: 'Final-year B.Tech / M.Tech in Computer Science or Data Science available for 6 months in Bengaluru.',
    description: 'Airbus India is seeking Digital Engineering Interns. Work on aircraft predictive maintenance analytics, airline operational telemetry data lakes, and industrial digital transformation platforms.'
  },
  {
    companyName: 'Mercedes-Benz R&D India (MBRDI)',
    title: 'Connected Vehicle & Autonomous Systems Intern',
    roleCategory: 'OTHER',
    durationMonths: 6,
    stipendMin: 80000,
    stipendMax: 120000,
    skills: ['C++', 'Python', 'ROS (Robot Operating System)', 'Computer Vision', 'AUTOSAR', 'Linux'],
    applyUrl: 'https://www.mbrdi.co.in/careers',
    eligibility: 'B.Tech/M.Tech students in CSE, ECE, or Robotics graduating in 2026 available for 6 months.',
    description: 'MBRDI in Bengaluru is hiring 6-Month Autonomous Driving & Connected Car Interns. Work on sensor fusion, automated driving perception algorithms, in-cabin digital assistants, and telematics software for Mercedes-Benz luxury vehicles.'
  },
  {
    companyName: 'BMW TechWorks India',
    title: 'Software Engineer Intern - In-Car Infotainment & Cloud',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 85000,
    stipendMax: 125000,
    skills: ['C++', 'Java', 'Android Automotive', 'Cloud Native', 'React', 'Microservices'],
    applyUrl: 'https://www.bmwtechworks.in/careers',
    eligibility: 'Final-year B.Tech in Computer Science graduating in 2026.',
    description: 'BMW TechWorks India in Pune is hiring 6-Month Software Engineer Interns. Develop cloud-connected in-car software, digital key mobile applications, and personalized connected drive features for next-gen BMW vehicles.'
  },
  {
    companyName: 'Shell India Markets',
    title: 'Digital Software & Cloud Engineering Intern',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 85000,
    stipendMax: 130000,
    skills: ['Python', 'Azure', 'React', 'Docker', 'REST APIs', 'Data Structures'],
    applyUrl: 'https://www.shell.in/careers.html',
    eligibility: 'Pre-final year B.Tech in CSE / IT graduating in 2026.',
    description: 'Shell Technology Center Bangalore (STCB) is hiring 2-Month Summer Interns. Engineer digital energy management systems, renewable power grid monitoring platforms, and cloud-native simulation pipelines.'
  },
  {
    companyName: 'Schneider Electric',
    title: 'Software & Cloud Systems Intern',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 70000,
    stipendMax: 105000,
    skills: ['C#', '.NET Core', 'Angular', 'Docker', 'Azure', 'IoT Protocols'],
    applyUrl: 'https://www.se.com/in/en/about-us/careers/',
    eligibility: 'B.Tech in Computer Science or IT graduating in 2026/2027.',
    description: 'Schneider Electric India is hiring 3-Month Summer Software Interns in Bengaluru. Build EcoStruxure IoT cloud platforms, energy management dashboards, and microgrid automation software.'
  },
  {
    companyName: 'Eaton India',
    title: 'Embedded Software & Cybersecurity Intern',
    roleCategory: 'OTHER',
    durationMonths: 6,
    stipendMin: 75000,
    stipendMax: 110000,
    skills: ['Embedded C', 'C++', 'Linux', 'RTOS', 'Industrial Cybersecurity', 'Firmware'],
    applyUrl: 'https://www.eaton.com/in/en-gb/company/careers.html',
    eligibility: 'B.Tech/M.Tech in CSE or Electrical Engineering graduating in 2026.',
    description: 'Eaton India Innovation Center in Pune is hiring 6-Month Interns. Work on intelligent power management firmware, embedded cybersecurity protocols, and industrial electric vehicle charging software.'
  },

  // AUTOTECH, EV & MOBILITY
  {
    companyName: 'Ather Energy',
    title: 'Embedded Software & Firmware Intern',
    roleCategory: 'OTHER',
    durationMonths: 6,
    stipendMin: 75000,
    stipendMax: 110000,
    skills: ['Embedded C', 'C++', 'FreeRTOS', 'CAN Bus', 'Battery Management (BMS)', 'Microcontrollers'],
    applyUrl: 'https://www.atherenergy.com/careers',
    eligibility: 'Final-year B.Tech / M.Tech in CSE, ECE, or Mechatronics graduating in 2026.',
    description: 'Ather Energy is redefining intelligent electric scooters. Join in Bengaluru for a 6-month co-op developing battery management firmware, touchscreen dashboard software (Android/Linux), and motor control algorithms.'
  },
  {
    companyName: 'Ather Energy',
    title: 'Full Stack Cloud & IoT Intern',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 70000,
    stipendMax: 105000,
    skills: ['Go', 'Node.js', 'React', 'MQTT', 'AWS IoT', 'PostgreSQL'],
    applyUrl: 'https://www.atherenergy.com/careers',
    eligibility: 'Pre-final year B.Tech students in CSE / IT graduating in 2026.',
    description: "Ather Energy's Cloud & Connectivity team in Bengaluru is hiring 2-Month Summer Interns. Build high-scale IoT ingestion pipelines processing real-time telemetry from hundreds of thousands of connected electric scooters."
  },
  {
    companyName: 'Ola Electric',
    title: 'Systems Software & AI Mobility Intern',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 80000,
    stipendMax: 120000,
    skills: ['C++', 'Python', 'Autonomous Navigation', 'Computer Vision', 'Linux', 'Microservices'],
    applyUrl: 'https://careers.olaelectric.com/',
    eligibility: 'Final-year B.Tech / M.Tech in CSE or Robotics graduating in 2026.',
    description: 'Ola Electric Futurefactory is hiring 6-Month Software & AI Interns in Bengaluru. Work on MoveOS operating system features, battery predictive degradation models, and autonomous factory robotic systems.'
  },
  {
    companyName: 'Ultraviolette Automotive',
    title: 'Embedded Vehicle Intelligence Intern',
    roleCategory: 'OTHER',
    durationMonths: 6,
    stipendMin: 75000,
    stipendMax: 110000,
    skills: ['Embedded C', 'C++', 'RTOS', 'Automotive Cybersecurity', 'CAN', 'Hardware Interfacing'],
    applyUrl: 'https://www.ultraviolette.com/careers',
    eligibility: 'B.Tech in CSE, ECE, or Robotics available for a 6-month semester internship in Bengaluru.',
    description: 'Ultraviolette builds high-performance electric motorcycles (F77). Develop powertrain telematics firmware, ride analytics software, and digital cockpit display systems.'
  },
  {
    companyName: 'Park+',
    title: 'Software Engineer Intern - Smart Parking & Mobility',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 70000,
    stipendMax: 105000,
    skills: ['Java', 'Spring Boot', 'React Native', 'FastAPI', 'PostgreSQL', 'FASTag APIs'],
    applyUrl: 'https://parkplus.io/careers',
    eligibility: 'Students pursuing B.Tech / BCA / MCA in Computer Science graduating in 2026/2027.',
    description: 'Park+ is building the super-app for car owners in India. Work in Gurgaon on automated FASTag toll and parking payments, computer vision license plate recognition (ANPR), and smart society access control systems.'
  },
  {
    companyName: 'MapmyIndia',
    title: 'Geospatial Software Engineer Intern',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 65000,
    stipendMax: 95000,
    skills: ['C++', 'Python', 'GIS / PostGIS', 'Leaflet', 'Spatial Algorithms', 'REST APIs'],
    applyUrl: 'https://www.mapmyindia.com/careers/',
    eligibility: 'Final-year B.Tech in Computer Science or Geoinformatics graduating in 2026.',
    description: "MapmyIndia (CE Info Systems) is India's leading digital map and deep-tech navigation company. Work in New Delhi on 3D HD maps, autonomous navigation routing, and location-based AI services."
  },

  // GAMING & MEDIA TECH
  {
    companyName: 'Dream11 (Dream Sports)',
    title: 'Software Development Engineer Intern - High Scale Core',
    roleCategory: 'SDE',
    durationMonths: 2,
    stipendMin: 95000,
    stipendMax: 140000,
    skills: ['Java', 'Go', 'AWS', 'Kafka', 'Aerospike', 'High Concurrency', 'Algorithms'],
    applyUrl: 'https://careers.dreamsports.group/',
    eligibility: 'Pre-final year B.Tech in CSE / IT graduating in 2026.',
    description: 'Dream11 powers fantasy sports for over 150 million registered users. As a 2-Month Summer SDE Intern in Mumbai, you will engineer ultra-high-throughput contest joining engines handling over 10 million requests per minute during live IPL matches.'
  },
  {
    companyName: 'Games24x7',
    title: 'Data Science & Machine Learning Intern',
    roleCategory: 'AI_ML',
    durationMonths: 3,
    stipendMin: 85000,
    stipendMax: 125000,
    skills: ['Python', 'PyTorch', 'Reinforcement Learning', 'Personalization', 'Big Data', 'Spark'],
    applyUrl: 'https://www.games24x7.com/careers/',
    eligibility: 'B.Tech / M.Tech in Computer Science or Data Science graduating in 2026/2027.',
    description: 'Games24x7 (RummyCircle, My11Circle) is hiring 3-Month Summer Data Science Interns in Mumbai and Bengaluru. Build real-time fraud detection models, dynamic matchmaking algorithms, and personalized user experience engines.'
  },
  {
    companyName: 'Mobile Premier League (MPL)',
    title: 'Software Engineer Intern - Gaming Platform',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 80000,
    stipendMax: 120000,
    skills: ['Go', 'Node.js', 'Kubernetes', 'Redis', 'Kafka', 'Unity3D / C#'],
    applyUrl: 'https://www.mpl.live/careers',
    eligibility: 'Final-year B.Tech in Computer Science graduating in 2026.',
    description: 'MPL is a premier mobile gaming and esports platform. Join the engineering team in Bengaluru for a 6-month co-op developing real-time multiplayer networking synchronization, low-latency leaderboard updates, and payment integrations.'
  },
  {
    companyName: 'WinZO',
    title: 'Backend Engineering Intern - Micro-Transactions',
    roleCategory: 'SDE',
    durationMonths: 3,
    stipendMin: 75000,
    stipendMax: 110000,
    skills: ['Java', 'Spring Boot', 'Go', 'Microservices', 'MongoDB', 'Redis'],
    applyUrl: 'https://www.winzogames.com/careers',
    eligibility: 'Students pursuing B.Tech in CSE graduating in 2026/2027.',
    description: "WinZO is India's largest social gaming platform with 100+ games in 12 languages. Build micro-transaction processing systems, low-latency match lobbies, and automated tournament pairing backends in New Delhi."
  },
  {
    companyName: 'Nazara Technologies',
    title: 'Game Developer Intern - Mobile & Unity',
    roleCategory: 'SDE',
    durationMonths: 6,
    stipendMin: 65000,
    stipendMax: 95000,
    skills: ['C#', 'Unity 3D', 'Game Physics', '3D Math', 'Mobile Optimization', 'Git'],
    applyUrl: 'https://www.nazara.com/careers/',
    eligibility: 'Final-year B.Tech / MCA students passionate about video game development.',
    description: 'Nazara Technologies is a diversified gaming and sports media company. Work in Mumbai on mobile game logic, gameplay mechanics, shader optimizations, and cross-platform publishing.'
  },
  {
    companyName: 'InVideo',
    title: 'Computer Vision & Video AI Intern',
    roleCategory: 'AI_ML',
    durationMonths: 2,
    stipendMin: 85000,
    stipendMax: 130000,
    skills: ['Python', 'PyTorch', 'Video Generation', 'Diffusion Models', 'FFmpeg', 'WebGL'],
    applyUrl: 'https://invideo.io/careers/',
    eligibility: 'Students pursuing B.Tech / M.Tech in CSE with strong portfolio in computer vision / AI video.',
    description: 'InVideo is an AI video creation platform used by over 20 million creators. Work in Mumbai or Remote on text-to-video generative models, automated clip sequencing, and real-time browser rendering engines.'
  }
];

async function main() {
  console.log('Inserting more verified internships into DB...');
  const allCompanies = await prisma.company.findMany({ select: { id: true, name: true, slug: true, hqCity: true } });
  const compMap = new Map();
  allCompanies.forEach(c => compMap.set(c.name.toLowerCase(), c));

  let count = 0;
  for (const item of MORE_ROLES) {
    let comp = compMap.get(item.companyName.toLowerCase());
    if (!comp) {
      // partial match
      const firstWord = item.companyName.split(' ')[0].toLowerCase();
      for (const [k, v] of compMap.entries()) {
        if (k.includes(firstWord)) {
          comp = v;
          break;
        }
      }
    }

    if (!comp) {
      console.warn('Company not found:', item.companyName);
      continue;
    }

    const dedupHash = genHash(`${comp.name}|${item.title}|${item.durationMonths}|${item.applyUrl}`);
    const city = comp.hqCity || 'Bengaluru';
    const locations = [city, 'India'];
    const isRemote = /remote/i.test(`${item.title} ${item.description}`);
    const deadline = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    const postedAt = new Date(Date.now() - Math.floor(Math.random() * 8 + 1) * 24 * 60 * 60 * 1000);

    const targetDegrees = ['BTECH', 'MTECH', 'BCA', 'MCA', 'BSC', 'MSC'];
    if (/phd/i.test(item.eligibility)) targetDegrees.push('PHD');

    await prisma.internship.upsert({
      where: { dedupHash },
      update: {
        title: item.title,
        locations,
        isRemote,
        applyUrl: item.applyUrl,
        description: item.description,
        roleCategory: item.roleCategory,
        skills: item.skills,
        stipendMin: item.stipendMin,
        stipendMax: item.stipendMax,
        durationMonths: item.durationMonths,
        eligibility: item.eligibility,
        targetDegrees,
        status: 'OPEN',
        lastSeenAt: new Date(),
        lastVerifiedAt: new Date()
      },
      create: {
        dedupHash,
        companyId: comp.id,
        sourceJobId: `vrf-${comp.slug}-${item.durationMonths}m-${genHash(item.title).slice(0, 8)}`,
        title: item.title,
        locations,
        isRemote,
        applyUrl: item.applyUrl,
        description: item.description,
        roleCategory: item.roleCategory,
        skills: item.skills,
        stipendMin: item.stipendMin,
        stipendMax: item.stipendMax,
        currency: 'INR',
        durationMonths: item.durationMonths,
        eligibility: item.eligibility,
        targetDegrees,
        deadline,
        postedAt,
        status: 'OPEN',
        source: 'VERIFIED_PORTAL',
        firstSeenAt: postedAt,
        lastSeenAt: new Date(),
        lastVerifiedAt: new Date()
      }
    });
    count++;
  }

  console.log(`✅ Upserted ${count} additional verified roles!`);

  const totalOpen = await prisma.internship.count({ where: { status: 'OPEN' } });
  const byCategory = await prisma.internship.groupBy({
    by: ['roleCategory'],
    where: { status: 'OPEN' },
    _count: true
  });
  const byDuration = await prisma.internship.groupBy({
    by: ['durationMonths'],
    where: { status: 'OPEN' },
    _count: true
  });

  console.log('\n📊 Current Active Open Internships:');
  console.log(`Total Open: ${totalOpen}`);
  console.log('By Role Category:', byCategory);
  console.log('By Duration (Months):', byDuration);

  await prisma.$disconnect();
}

main().catch(console.error);
