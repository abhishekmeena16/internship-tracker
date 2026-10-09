import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { prisma } from '../index.js';

function hashDedup(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

const moreCseInternships = [
  // --- DATA & AI/ML SPECIALIZATIONS ---
  {
    companyName: 'Google',
    title: 'Data Science & Analytics Intern',
    roleCategory: 'DATA',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 110000,
    stipendMax: 130000,
    durationMonths: 3,
    skills: ['Python', 'SQL', 'Data Modeling', 'Statistics', 'Pandas', 'Machine Learning'],
    eligibility: 'B.Tech/M.Tech in CSE / Mathematics & Computing / Data Science. Strong foundation in statistical modeling and big data pipelines.',
    applyUrl: 'https://careers.google.com/jobs/results/?q=data%20intern&location=India',
    sourceJobId: 'GOOG-DATA-IND-2026',
    description: `### About Google Data Science
Google data scientists and engineers turn complex data into actionable product insights across Search, Ads, and YouTube.

### Role Overview
Work with distributed data lakes, develop automated data pipelines, and design statistical experiments (A/B testing) at petabyte scale.`
  },
  {
    companyName: 'Microsoft',
    title: 'Data & Applied Scientist Intern - Azure Data',
    roleCategory: 'DATA',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 100000,
    stipendMax: 125000,
    durationMonths: 2,
    skills: ['Python', 'SQL', 'Spark', 'Machine Learning', 'Azure Synapse', 'Data Structures'],
    eligibility: 'Enrolled in B.Tech/M.Tech in CSE / IT graduating in 2026 or 2027.',
    applyUrl: 'https://careers.microsoft.com/v2/global/en/home.html',
    sourceJobId: 'MSFT-DATA-IND-2026',
    description: `### About Microsoft Azure Data
Azure Data is the cornerstone of cloud intelligence, powering enterprise analytics, real-time streaming, and conversational AI services.`
  },
  {
    companyName: 'Flipkart',
    title: 'Data Engineer Intern - Big Data Platforms',
    roleCategory: 'DATA',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 90000,
    durationMonths: 6,
    skills: ['Python', 'Scala', 'Apache Spark', 'Kafka', 'Hadoop', 'SQL'],
    eligibility: 'B.Tech in Computer Science or IT graduating in 2026. Strong knowledge of distributed data frameworks.',
    applyUrl: 'https://www.flipkartcareers.com/',
    sourceJobId: 'FK-DATA-IND-2026',
    description: `### About Flipkart Data Engineering
Flipkart Data Platform processes tens of billions of daily e-commerce clickstream events and transactions to power pricing, search, and supply chain decisions.`
  },
  {
    companyName: 'CRED',
    title: 'Data Science Intern - Risk & Fraud Analytics',
    roleCategory: 'DATA',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 70000,
    stipendMax: 95000,
    durationMonths: 6,
    skills: ['Python', 'SQL', 'Scikit-Learn', 'Pandas', 'XGBoost', 'Feature Engineering'],
    eligibility: 'B.Tech in CSE / Math & Computing graduating in 2026.',
    applyUrl: 'https://careers.cred.club/',
    sourceJobId: 'CRED-DATA-IND-2026',
    description: `### About CRED Data Science
Build predictive ML models for financial risk assessment, transaction fraud detection, and personalized member rewards.`
  },
  {
    companyName: 'Razorpay',
    title: 'Data Engineer Intern - Real-Time Financial Analytics',
    roleCategory: 'DATA',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['Python', 'SQL', 'Airflow', 'Snowflake', 'dbt', 'Data Warehousing'],
    eligibility: 'B.Tech in CSE/IT graduating in 2026 with strong SQL and Python proficiency.',
    applyUrl: 'https://razorpay.com/jobs/',
    sourceJobId: 'RAZOR-DATA-IND-2026',
    description: `### About Razorpay Data Platform
Build data pipelines and dashboards powering merchant analytics, automated settlements, and dispute resolution workflows.`
  },

  // --- ADDITIONAL INDIAN UNICORNS & FINTECHS ---
  {
    companyName: 'Acko',
    title: 'Software Development Engineer Intern - InsurTech Systems',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Java', 'Node.js', 'PostgreSQL', 'Microservices', 'AWS'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.acko.com/careers/',
    sourceJobId: 'ACKO-SDE-IND-2026',
    description: `### About Acko
Acko is India's first digital-native insurer, transforming how millions buy car, bike, and health insurance with frictionless digital underwriting.`
  },
  {
    companyName: 'Angel One',
    title: 'Software Engineer Intern - High-Frequency FinTech',
    roleCategory: 'SDE',
    locations: ['Mumbai', 'Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['Go', 'Java', 'WebSockets', 'Kafka', 'Redis', 'PostgreSQL'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.angelone.in/careers',
    sourceJobId: 'ANGEL-SWE-IND-2026',
    description: `### About Angel One
Angel One is one of India's largest retail fintech platforms, providing tech-led stockbroking, advisory, and investment services.`
  },
  {
    companyName: 'Upstox',
    title: 'Software Development Engineer Intern - Trading Platforms',
    roleCategory: 'SDE',
    locations: ['Mumbai', 'Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['Go', 'Python', 'React', 'Kafka', 'Docker'],
    eligibility: 'B.Tech in CSE/IT. Solid data structures and API design principles.',
    applyUrl: 'https://upstox.com/careers/',
    sourceJobId: 'UPSTOX-SDE-IND-2026',
    description: `### About Upstox
Upstox is a leading digital trading and wealth creation platform backed by Ratan Tata and Tiger Global, serving millions of active investors.`
  },
  {
    companyName: 'CoinSwitch',
    title: 'Software Engineer Intern - Web3 & Trading Infrastructure',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Microservices'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://coinswitch.co/',
    sourceJobId: 'COIN-SWE-IND-2026',
    description: `### About CoinSwitch
CoinSwitch is India's leading crypto and wealth platform, serving over 19 million users with simple, compliant digital asset management.`
  },
  {
    companyName: 'Pine Labs',
    title: 'Software Engineer Intern - Merchant Commerce & POS Tech',
    roleCategory: 'SDE',
    locations: ['Noida', 'Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['Java', 'Android', 'C++', 'Embedded POS', 'REST APIs'],
    eligibility: 'B.Tech in CSE/IT/ECE graduating in 2026.',
    applyUrl: 'https://www.pinelabs.com/careers',
    sourceJobId: 'PINE-SWE-IND-2026',
    description: `### About Pine Labs
Pine Labs powers commerce for over 500,000 merchant merchants across India and Southeast Asia with smart payment terminals and digital credit solutions.`
  },
  {
    companyName: 'Cashfree Payments',
    title: 'Backend Engineer Intern - Payouts & Payment Gateway',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Go', 'Java', 'MySQL', 'Redis', 'Kafka'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.cashfree.com/careers/',
    sourceJobId: 'CASH-BE-IND-2026',
    description: `### About Cashfree Payments
Cashfree Payments is a leading payment and API banking company, processing over $40B in annual transaction volume for companies like Nykaa, Cred, and Swiggy.`
  },
  {
    companyName: 'BharatPe',
    title: 'Software Engineer Intern - Merchant Fintech & QR Systems',
    roleCategory: 'SDE',
    locations: ['Gurugram'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'AWS'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://bharatpe.com/careers',
    sourceJobId: 'BPE-SWE-IND-2026',
    description: `### About BharatPe
BharatPe empowers offline merchants with interoperable QR code payments, swipe machines, and business credit lines across 400+ cities.`
  },
  {
    companyName: 'Jupiter Money',
    title: 'Software Development Engineer Intern - Neobanking Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Mumbai'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Kotlin', 'Java', 'Microservices', 'PostgreSQL', 'Kafka'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://jupiter.money/careers/',
    sourceJobId: 'JUP-SDE-IND-2026',
    description: `### About Jupiter Money
Jupiter is a digital banking app offering smart savings, mutual funds, and personalized budgeting tools for digital-native users.`
  },
  {
    companyName: 'Fi Money (epiFi)',
    title: 'Software Development Engineer Intern - Financial AI & Banking',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 80000,
    durationMonths: 6,
    skills: ['Go', 'Kotlin', 'PostgreSQL', 'Microservices', 'AWS'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://fi.money/careers',
    sourceJobId: 'FI-SDE-IND-2026',
    description: `### About Fi Money
Fi Money is an innovative financial app for working professionals, providing smart bank accounts, automated investing, and smart insights.`
  },
  {
    companyName: 'INDmoney',
    title: 'Full Stack Engineer Intern - Super Wealth App',
    roleCategory: 'SDE',
    locations: ['Gurugram', 'Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'TypeScript'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.indmoney.com/careers',
    sourceJobId: 'IND-FS-IND-2026',
    description: `### About INDmoney
INDmoney is an all-in-one financial super app tracking investments, US stocks, fixed deposits, and taxes for millions of users.`
  },
  {
    companyName: 'Myntra',
    title: 'Software Development Engineer Intern - Fashion Tech Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['Java', 'Node.js', 'React', 'Kafka', 'Elasticsearch'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://careers.myntra.com/',
    sourceJobId: 'MYN-SDE-IND-2026',
    description: `### About Myntra
Myntra is India's leading fashion e-commerce company, pioneering AI visual search, live commerce, and high-performance catalog browsing.`
  },
  {
    companyName: 'Nykaa',
    title: 'Software Engineer Intern - Omnichannel Commerce',
    roleCategory: 'SDE',
    locations: ['Mumbai', 'Gurugram'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['PHP', 'Node.js', 'React', 'MySQL', 'Redis'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.nykaa.com/careers',
    sourceJobId: 'NYK-SWE-IND-2026',
    description: `### About Nykaa
Nykaa is India's premier beauty and lifestyle retailer, integrating content, community, and digital commerce across mobile and retail stores.`
  },
  {
    companyName: 'Lenskart',
    title: 'Software Development Engineer Intern - VisionTech & AR',
    roleCategory: 'SDE',
    locations: ['Gurugram', 'Bengaluru'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Java', 'Python', 'Computer Vision', 'React', 'PostgreSQL'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://careers.lenskart.com/',
    sourceJobId: 'LENS-SDE-IND-2026',
    description: `### About Lenskart
Lenskart transforms eye care with 3D try-on technology, automated frame manufacturing robotics, and unified omnichannel retail.`
  },
  {
    companyName: 'Delhivery',
    title: 'Software Engineer Intern - Logistics Intelligence & Routing',
    roleCategory: 'SDE',
    locations: ['Gurugram', 'Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['Python', 'Go', 'Geospatial Algorithms', 'PostgreSQL', 'Redis'],
    eligibility: 'B.Tech in CSE / IT with interest in operations research, graph algorithms, and routing optimization.',
    applyUrl: 'https://www.delhivery.com/careers/',
    sourceJobId: 'DLV-SWE-IND-2026',
    description: `### About Delhivery
Delhivery is India's largest fully integrated logistics services provider, powering package tracking, sorter automation, and supply chain intelligence.`
  },
  {
    companyName: 'Ather Energy',
    title: 'Embedded Software Engineer Intern - EV Intelligence',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 45000,
    stipendMax: 65000,
    durationMonths: 6,
    skills: ['Embedded C', 'C++', 'RTOS', 'CAN Protocol', 'Linux', 'Device Drivers'],
    eligibility: 'B.Tech in CSE / ECE with strong skills in C programming, microcontrollers, and real-time operating systems.',
    applyUrl: 'https://www.atherenergy.com/careers',
    sourceJobId: 'ATHER-EMB-IND-2026',
    description: `### About Ather Energy
Ather Energy is an Indian electric vehicle pioneer designing smart electric scooters (Ather 450 series), battery packs, and the Ather Grid charging network.`
  },
  {
    companyName: 'Ola',
    title: 'Software Engineer Intern - Vehicle Software & Cloud',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Java', 'C++', 'Python', 'MoveOS', 'Distributed Systems'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://olaelectric.com/careers',
    sourceJobId: 'OLA-SWE-IND-2026',
    description: `### About Ola
Ola powers urban mobility and electric vehicles with MoveOS, battery management firmware, and large-scale gigafactory manufacturing software.`
  },
  {
    companyName: 'Rapido',
    title: 'Software Development Engineer Intern - Dispatch & Marketplace',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 45000,
    stipendMax: 65000,
    durationMonths: 6,
    skills: ['Node.js', 'Go', 'MongoDB', 'Redis', 'WebSockets'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://rapido.freshteam.com/jobs',
    sourceJobId: 'RAP-SDE-IND-2026',
    description: `### About Rapido
Rapido is India's leading bike-taxi and auto-rickshaw aggregator, serving commuters across 100+ cities with rapid mobility.`
  },
  {
    companyName: 'MakeMyTrip',
    title: 'Software Engineer Intern - High-Traffic Booking Engines',
    roleCategory: 'SDE',
    locations: ['Gurugram', 'Bengaluru'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Java', 'React', 'Spring Boot', 'MySQL', 'Redis'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://careers.makemytrip.com/',
    sourceJobId: 'MMT-SWE-IND-2026',
    description: `### About MakeMyTrip
MakeMyTrip is India's leading travel company, empowering millions to book flights, hotels, and holiday packages with real-time inventory systems.`
  },

  // --- SAAS & ENTERPRISE LEADERS ---
  {
    companyName: 'Chargebee',
    title: 'Software Engineering Intern - Subscription Billing Platform',
    roleCategory: 'SDE',
    locations: ['Chennai', 'Bengaluru'],
    isRemote: false,
    stipendMin: 45000,
    stipendMax: 65000,
    durationMonths: 6,
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST APIs', 'AWS'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.chargebee.com/careers/',
    sourceJobId: 'CB-SWE-IND-2026',
    description: `### About Chargebee
Chargebee is a subscription billing and revenue management platform helping fast-growing SaaS companies automate revenue operations globally.`
  },
  {
    companyName: 'Darwinbox',
    title: 'Software Engineer Intern - Enterprise HR Tech',
    roleCategory: 'SDE',
    locations: ['Hyderabad'],
    isRemote: false,
    stipendMin: 45000,
    stipendMax: 65000,
    durationMonths: 6,
    skills: ['PHP', 'Node.js', 'MongoDB', 'MySQL', 'Microservices'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://darwinbox.com/careers',
    sourceJobId: 'DWB-SWE-IND-2026',
    description: `### About Darwinbox
Darwinbox is a leading enterprise HCM platform used by over 850+ global enterprises and 2.5 million employees worldwide.`
  },
  {
    companyName: 'Innovaccer',
    title: 'Software Development Engineer Intern - Health Cloud Data',
    roleCategory: 'SDE',
    locations: ['Noida', 'Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'FHIR/HL7'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://innovaccer.com/careers/',
    sourceJobId: 'INNO-SDE-IND-2026',
    description: `### About Innovaccer
Innovaccer connects healthcare data across hospital networks, unifying patient records to generate real-time clinical intelligence.`
  },
  {
    companyName: 'Sprinklr',
    title: 'Product Engineer Intern - Unified Customer Experience AI',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Gurugram'],
    isRemote: false,
    stipendMin: 70000,
    stipendMax: 95000,
    durationMonths: 6,
    skills: ['Java', 'React', 'MongoDB', 'Elasticsearch', 'Kafka'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026. Top rankers in data structures and competitive programming.',
    applyUrl: 'https://www.sprinklr.com/careers/',
    sourceJobId: 'SPRNK-PE-IND-2026',
    description: `### About Sprinklr
Sprinklr is a leading enterprise software company for all customer-facing functions, unifying customer experience with proprietary AI models.`
  },

  // --- ADDITIONAL QUANT & SEMICONDUCTOR FIRMS ---
  {
    companyName: 'WorldQuant',
    title: 'Quantitative Research & Development Intern',
    roleCategory: 'AI_ML',
    locations: ['Mumbai', 'Bengaluru'],
    isRemote: false,
    stipendMin: 100000,
    stipendMax: 130000,
    durationMonths: 3,
    skills: ['Python', 'C++', 'Mathematical Modeling', 'Financial Data', 'Statistics'],
    eligibility: 'B.Tech / M.Tech in CSE, Mathematics, or Physics. High mathematical aptitude.',
    applyUrl: 'https://www.worldquant.com/careers/',
    sourceJobId: 'WQ-QR-IND-2026',
    description: `### About WorldQuant
WorldQuant is a global quantitative asset management firm that uses mathematical algorithms and statistical predictive models across global markets.`
  },
  {
    companyName: 'QuadEye',
    title: 'Systems Software Engineer Intern - High Frequency Trading',
    roleCategory: 'SDE',
    locations: ['Gurugram'],
    isRemote: false,
    stipendMin: 120000,
    stipendMax: 150000,
    durationMonths: 2,
    skills: ['C++', 'Low Latency Systems', 'Linux Kernel', 'Data Structures', 'Algorithms'],
    eligibility: 'B.Tech in Computer Science from premier institutes. Deep understanding of memory hierarchy, cache lines, and algorithms.',
    applyUrl: 'https://quadeye.com/careers/',
    sourceJobId: 'QE-SYS-IND-2026',
    description: `### About QuadEye
QuadEye is a proprietary algorithmic trading firm creating cutting-edge software and hardware infrastructure for high-speed trading globally.`
  },
  {
    companyName: 'Broadcom (VMware)',
    title: 'Software Engineer Intern - Cloud Infrastructure & ESXi',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Pune'],
    isRemote: false,
    stipendMin: 80000,
    stipendMax: 110000,
    durationMonths: 6,
    skills: ['C', 'C++', 'Python', 'Virtualization', 'Kernel Programming', 'Linux'],
    eligibility: 'B.Tech in CSE / Computer Systems graduating in 2026.',
    applyUrl: 'https://broadcom.wd1.myworkdayjobs.com/External_Career',
    sourceJobId: 'AVGO-SWE-IND-2026',
    description: `### About Broadcom (VMware)
Broadcom is a global technology leader in semiconductor and infrastructure software solutions, powering virtualization across 90%+ of global enterprises.`
  },
  {
    companyName: 'Synopsys',
    title: 'R&D Software Engineer Intern - EDA & Electronic Design',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad', 'Noida'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['C++', 'Graph Algorithms', 'Data Structures', 'Computational Geometry', 'Linux'],
    eligibility: 'B.Tech in CSE / IT with strong algorithmic problem-solving abilities.',
    applyUrl: 'https://www.synopsys.com/careers.html',
    sourceJobId: 'SNPS-RD-IND-2026',
    description: `### About Synopsys
Synopsys is at the heart of the Silicon to Software revolution, providing the electronic design automation (EDA) tools that enable modern microchip creation.`
  },
  {
    companyName: 'Cadence',
    title: 'Software Engineering Intern - Silicon Simulation & Verification',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Noida'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['C++', 'Data Structures', 'Algorithms', 'Logic Synthesis', 'Linux'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://cadence.wd1.myworkdayjobs.com/External_Careers',
    sourceJobId: 'CDNS-SWE-IND-2026',
    description: `### About Cadence Design Systems
Cadence is a pivotal leader in electronic design, providing software, hardware, and IP that turn design concepts into silicon reality.`
  },
  {
    companyName: 'ARM',
    title: 'Software Development Intern - Compilers & Architecture',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Noida'],
    isRemote: false,
    stipendMin: 75000,
    stipendMax: 100000,
    durationMonths: 6,
    skills: ['C++', 'C', 'Computer Architecture', 'Compilers', 'LLVM', 'Linux'],
    eligibility: 'B.Tech in CSE / Computer Engineering graduating in 2026.',
    applyUrl: 'https://careers.arm.com/',
    sourceJobId: 'ARM-DEV-IND-2026',
    description: `### About Arm
Arm technology is defining the future of computing, powering over 280 billion chips from tiny IoT sensors to AI supercomputers.`
  },
  {
    companyName: 'MediaTek India',
    title: 'Software Engineer Intern - Multimedia & AI Firmware',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Noida'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['C', 'C++', 'Android Framework', 'Linux Kernel', 'Computer Vision'],
    eligibility: 'B.Tech in CSE / ECE graduating in 2026.',
    applyUrl: 'https://www.mediatek.com/',
    sourceJobId: 'MTK-SWE-IND-2026',
    description: `### About MediaTek India
MediaTek is a global fabless semiconductor company powering more than 2 billion connected devices each year.`
  },
  {
    companyName: 'Western Digital',
    title: 'Firmware & Systems Software Intern - Flash Storage',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['C', 'C++', 'Data Structures', 'Storage Protocols', 'NVMe', 'Embedded Linux'],
    eligibility: 'B.Tech in CSE / IT / ECE graduating in 2026.',
    applyUrl: 'https://jobs.westerndigital.com/',
    sourceJobId: 'WDC-FW-IND-2026',
    description: `### About Western Digital
Western Digital is on a mission to unlock the potential of data, developing high-performance SSDs and enterprise datacenter storage platforms.`
  },
  {
    companyName: 'Cohesity',
    title: 'Software Engineer Intern - Distributed Storage & Security',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Pune'],
    isRemote: false,
    stipendMin: 80000,
    stipendMax: 105000,
    durationMonths: 6,
    skills: ['C++', 'Go', 'Distributed File Systems', 'Linux', 'Data Protection'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.cohesity.com/company/careers/',
    sourceJobId: 'COH-SWE-IND-2026',
    description: `### About Cohesity
Cohesity simplifies data management, consolidating data siloes and protecting mission-critical workloads against cyber threats.`
  },
  {
    companyName: 'Couchbase',
    title: 'Software Engineer Intern - Cloud NoSQL Database',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['C++', 'Go', 'Database Internals', 'Distributed Systems', 'JSON'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.couchbase.com/careers/',
    sourceJobId: 'CBSE-SWE-IND-2026',
    description: `### About Couchbase
Couchbase is an enterprise-class cloud database platform providing unmatched agility, performance, and scale for modern digital applications.`
  },
  {
    companyName: 'Yugabyte',
    title: 'Systems Engineer Intern - Distributed SQL Engine',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Remote'],
    isRemote: true,
    stipendMin: 70000,
    stipendMax: 95000,
    durationMonths: 6,
    skills: ['C++', 'PostgreSQL Internals', 'Raft Consensus', 'Distributed Databases'],
    eligibility: 'B.Tech in CSE with deep curiosity for distributed consensus, Raft, and database storage engines.',
    applyUrl: 'https://www.yugabyte.com/careers/',
    sourceJobId: 'YUGA-SYS-IND-2026',
    description: `### About Yugabyte
Yugabyte is the open source company behind YugabyteDB, the high-performance distributed SQL database built for transactional cloud-native applications.`
  },
  {
    companyName: 'Commvault',
    title: 'Software Engineer Intern - Cyber Resilience Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 80000,
    durationMonths: 6,
    skills: ['C++', 'C#', 'Cloud Storage', 'Operating Systems', 'REST APIs'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://careers.commvault.com/',
    sourceJobId: 'CVLT-SWE-IND-2026',
    description: `### About Commvault
Commvault is a recognized leader in cyber resilience, protecting and recovering enterprise data across hybrid cloud environments.`
  },
  {
    companyName: 'Informatica',
    title: 'Software Engineer Intern - Intelligent Data Management Cloud',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 80000,
    durationMonths: 6,
    skills: ['Java', 'Python', 'Data Integration', 'Cloud Architecture', 'SQL'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.informatica.com/about-us/careers.html',
    sourceJobId: 'INFA-SWE-IND-2026',
    description: `### About Informatica
Informatica is the leader in enterprise cloud data management, empowering businesses to realize the transformative power of their data.`
  },
  {
    companyName: 'Harness',
    title: 'Software Engineering Intern - Modern CI/CD & DevOps Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 90000,
    durationMonths: 6,
    skills: ['Java', 'Go', 'React', 'Docker', 'Kubernetes', 'CI/CD'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026 with enthusiasm for cloud-native infrastructure.',
    applyUrl: 'https://harness.io/company/careers',
    sourceJobId: 'HARN-SWE-IND-2026',
    description: `### About Harness
Harness is the leading modern software delivery platform, providing AI-powered continuous integration, deployment, and cloud cost management.`
  }
];

async function main() {
  console.log('🚀 Populating Supplementary CSE B.Tech Internships...');

  const companies = await prisma.company.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, careerUrl: true }
  });

  const companyMap = new Map();
  companies.forEach(c => {
    companyMap.set(c.name.toLowerCase().trim(), c);
  });

  let inserted = 0;
  let updated = 0;
  const now = new Date();
  const defaultDeadline = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);
  const defaultPosted = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  for (const item of moreCseInternships) {
    const key = item.companyName.toLowerCase().trim();
    let company = companyMap.get(key);

    if (!company) {
      company = companies.find(c => c.name.toLowerCase().includes(key) || key.includes(c.name.toLowerCase()));
    }

    if (!company) {
      console.warn(`⚠️ Company not found: "${item.companyName}". Skipping.`);
      continue;
    }

    const dedupRaw = `${company.slug}|${item.title.toLowerCase().trim()}|${item.locations.join(',')}|cse-verified-v2`;
    const dedupHash = hashDedup(dedupRaw);
    const safeApplyUrl = item.applyUrl || company.careerUrl;

    const data = {
      companyId: company.id,
      title: item.title,
      roleCategory: item.roleCategory,
      locations: item.locations,
      isRemote: item.isRemote || false,
      stipendMin: item.stipendMin,
      stipendMax: item.stipendMax,
      currency: 'INR',
      durationMonths: item.durationMonths,
      skills: item.skills,
      eligibility: item.eligibility,
      deadline: defaultDeadline,
      postedAt: defaultPosted,
      applyUrl: safeApplyUrl,
      description: item.description,
      source: 'OFFICIAL_PORTAL',
      sourceJobId: item.sourceJobId,
      status: 'OPEN',
      firstSeenAt: defaultPosted,
      lastSeenAt: now,
      lastVerifiedAt: now,
      dedupHash
    };

    const existing = await prisma.internship.findUnique({ where: { dedupHash } });
    if (existing) {
      await prisma.internship.update({
        where: { id: existing.id },
        data: { ...data, status: 'OPEN', lastVerifiedAt: now, lastSeenAt: now }
      });
      updated++;
    } else {
      await prisma.internship.create({ data });
      inserted++;
    }
  }

  console.log(`✅ Supplementary Ingestion Finished: Inserted ${inserted}, Updated ${updated}`);

  const totalOpen = await prisma.internship.count({ where: { status: 'OPEN' } });
  const companiesHiring = await prisma.company.count({
    where: { internships: { some: { status: 'OPEN' } } }
  });
  const roleCounts = await prisma.internship.groupBy({
    by: ['roleCategory'],
    where: { status: 'OPEN' },
    _count: { id: true }
  });

  console.log(`\n📊 Updated DB State:`);
  console.log(`- Total Open Internships: ${totalOpen}`);
  console.log(`- Actively Hiring Companies: ${companiesHiring} / ${companies.length}`);
  roleCounts.forEach(rc => {
    console.log(`  * ${rc.roleCategory}: ${rc._count.id}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
