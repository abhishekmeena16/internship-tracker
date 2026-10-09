/**
 * Industry-accurate internship role templates for top tech employers in India.
 * Generates realistic, clean markdown descriptions, stipends in INR, skills, and eligibility.
 */

export function getRoleTemplates(company) {
  const name = company.name;
  const nameUpper = name.toUpperCase();
  const city = company.hqCity || 'Bengaluru';

  // 1. Big Tech Leaders (Google, Amazon, Microsoft, Meta, Apple, Uber, Adobe, Salesforce)
  if (['GOOGLE', 'AMAZON', 'MICROSOFT', 'META', 'APPLE', 'UBER', 'ADOBE', 'SALESFORCE'].includes(nameUpper)) {
    return [
      {
        title: 'Software Development Engineer (SDE) Intern',
        roleCategory: 'SDE',
        stipendMin: 90000,
        stipendMax: 135000,
        durationMonths: nameUpper === 'GOOGLE' || nameUpper === 'MICROSOFT' || nameUpper === 'META' ? 2 : 6,
        skills: ['Data Structures', 'Algorithms', 'Java', 'C++', 'Python', 'Distributed Systems'],
        eligibility: 'Currently pursuing B.Tech / M.Tech / Dual Degree in Computer Science, IT, or related fields (2025, 2026, or 2027 graduating batch). Minimum 7.5 CGPA or equivalent.',
        description: `### About ${name}
${name} is one of the world's most influential technology pioneers, developing hyperscale platforms and products utilized by billions of users worldwide.

### Role Overview
As a Software Engineering Intern at ${name} India, you will be integrated into core product engineering teams. You will tackle complex distributed computing challenges, design scalable APIs, and ship production-grade features.

### Key Responsibilities
- Architect, build, and deploy reliable, highly scalable backend services and microservices.
- Write clean, maintainable, performant code in Java, C++, Python, or Go.
- Participate in technical design reviews, automated test suite creation, and CI/CD pipelines.
- Collaborate closely with Product Managers, UX Designers, and senior engineering mentors.

### Requirements & Eligibility
- Currently enrolled in B.Tech / B.E. / M.Tech in Computer Science, Information Technology, or closely related engineering fields.
- 2025, 2026, or 2027 graduating batch.
- Exceptional problem-solving skills with a deep understanding of Data Structures and Algorithms.
- Strong proficiency in modern object-oriented programming (C++, Java, Python, or Go).

### Stipend & Benefits
- Industry-leading monthly stipend (₹90,000 - ₹1,35,000/month).
- Comprehensive corporate healthcare coverage and wellness benefits.
- Relocation assistance, housing allowance, and high-spec development workstation.
- Direct consideration for a Pre-Placement Offer (PPO) based on performance.`
      },
      {
        title: 'Machine Learning & Applied AI Research Intern',
        roleCategory: 'AI_ML',
        stipendMin: 95000,
        stipendMax: 140000,
        durationMonths: 6,
        skills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'Data Structures'],
        eligibility: 'B.Tech / M.Tech / MS / Ph.D. students in Computer Science, AI, or Data Science (2025, 2026, or 2027 batch).',
        description: `### About ${name}
${name} is pushing the boundaries of Artificial Intelligence, large-scale deep learning, and intelligent automation across global services.

### Role Overview
Join our AI and Machine Learning research and engineering group in India. You will research and apply state-of-the-art neural architectures, generative models, and intelligent ranking systems.

### Key Responsibilities
- Design, experiment with, and deploy deep learning models for NLP, computer vision, or multimodal systems.
- Benchmark and optimize model inference latency and throughput for edge and cloud deployment.
- Process large-scale unstructured training datasets using distributed computing frameworks.
- Publish or present novel architectural improvements to internal engineering summits.

### Requirements & Eligibility
- Enrolled in B.Tech, M.Tech, Dual Degree, or Ph.D. in Computer Science, Machine Learning, Mathematics, or Electrical Engineering.
- Deep theoretical and practical foundation in Linear Algebra, Probability, and Deep Learning.
- Hands-on experience with PyTorch, TensorFlow, and Python scientific computing libraries.
- 2025, 2026, or 2027 graduating batch.`
      }
    ];
  }

  // 2. Quant / HFT firms (D. E. Shaw, Arcesium, Tower Research, WorldQuant, AlphaGrep, Graviton, QuadEye)
  if (['D. E. SHAW', 'ARCESIUM', 'TOWER RESEARCH CAPITAL', 'WORLDQUANT', 'ALPHAGREP', 'GRAVITON RESEARCH CAPITAL', 'QUADEYE'].includes(nameUpper)) {
    return [
      {
        title: 'Quantitative Research Intern',
        roleCategory: 'DATA',
        stipendMin: 130000,
        stipendMax: 175000,
        durationMonths: 2,
        skills: ['Python', 'C++', 'SQL', 'Machine Learning', 'Statistics', 'Linux'],
        eligibility: 'Pursuing B.Tech / M.Tech / Dual Degree in Computer Science, Mathematics, Electrical Engineering, or Physics from top-tier institutions (2025/2026/2027 batch).',
        description: `### About ${name}
${name} is a premier global quantitative investment management and trading firm deploying mathematical, statistical, and computational techniques to global financial markets.

### Role Overview
As a Quantitative Research Intern, you will work alongside world-class quantitative researchers and algorithmic traders to analyze complex financial datasets, evaluate market dynamics, and build predictive statistical models.

### Key Responsibilities
- Design, evaluate, and test algorithmic trading signals and statistical arbitrage models.
- Clean and explore petabyte-scale market microstructure, order book, and alternative datasets.
- Implement robust backtesting simulations and risk evaluation frameworks in Python and C++.
- Present research findings and mathematical insights to senior portfolio managers.

### Requirements & Eligibility
- Pursuing B.Tech / M.Tech / Dual Degree in Computer Science, Mathematics, Electrical Engineering, or Physics.
- Exceptional problem-solving abilities and mathematical intuition (probability, statistics, linear algebra).
- Strong proficiency in Python (NumPy, SciPy, Pandas) or modern C++.
- 2025, 2026, or 2027 graduating batch.

### Stipend & Benefits
- Premier compensation benchmarked at ₹1,30,000 - ₹1,75,000/month.
- Comprehensive relocation support, premium corporate accommodation, and mentorship.
- Direct path to full-time Quantitative Researcher / Trader conversion.`
      },
      {
        title: 'Low-Latency Systems Software Engineer Intern',
        roleCategory: 'SDE',
        stipendMin: 125000,
        stipendMax: 165000,
        durationMonths: 6,
        skills: ['C++', 'Linux', 'Computer Architecture', 'Distributed Systems', 'Git'],
        eligibility: 'B.Tech / M.Tech in CS/ECE with exceptional proficiency in systems programming and C++ (2025/2026/2027 batch).',
        description: `### About ${name}
${name} develops cutting-edge proprietary trading infrastructure capable of processing millions of market messages per second with sub-microsecond latency.

### Role Overview
Join our core low-latency systems engineering team. You will build and optimize ultra-fast trading engines, exchange connectivity gateways, and high-throughput network architectures.

### Key Responsibilities
- Architect high-performance, cache-friendly data structures and zero-copy messaging protocols in modern C++ (C++17/20).
- Optimize kernel bypass networking (Solarflare OpenOnload, DPDK) and memory layout.
- Profile and tune execution pipelines using Linux perf, hardware performance counters, and Valgrind.
- Write rigorous automated unit, performance, and fuzzing tests.

### Requirements & Eligibility
- Strong understanding of Computer Architecture, Operating Systems, Memory Hierarchies, and Networking (TCP/UDP).
- Advanced proficiency in C++, multithreading, and lock-free concurrency.
- Passion for low-level systems programming and latency optimization.
- 2025, 2026, or 2027 graduating batch.`
      }
    ];
  }

  // 3. Semiconductor & Hardware (Qualcomm, Nvidia, Intel, AMD, Texas Instruments, Samsung SRI-B, Micron, Western Digital, Synopsys, Cadence)
  if (['QUALCOMM', 'NVIDIA', 'INTEL', 'AMD', 'TEXAS INSTRUMENTS', 'SAMSUNG R&D INSTITUTE INDIA', 'MICRON TECHNOLOGY', 'WESTERN DIGITAL', 'ARISTA NETWORKS', 'JUNIPER NETWORKS', 'MARVELL', 'ANALOG DEVICES', 'ARM', 'SYNOPSYS', 'CADENCE', 'SIEMENS EDA', 'MEDIATEK INDIA', 'RENESAS ELECTRONICS', 'STMICROELECTRONICS'].includes(nameUpper)) {
    return [
      {
        title: 'Software Development Engineer Intern (Systems & Firmware)',
        roleCategory: 'SDE',
        stipendMin: 65000,
        stipendMax: 95000,
        durationMonths: 6,
        skills: ['C++', 'Linux', 'Python', 'Computer Architecture', 'Git'],
        eligibility: 'Enrolled in B.Tech / M.Tech in Computer Science, Electronics, or Electrical Engineering (2025, 2026, or 2027 graduating batch).',
        description: `### About ${name}
${name} is a global pioneer in semiconductor technologies, high-performance computing, and hardware-accelerated systems powering next-generation devices.

### Role Overview
As a Systems Software & Firmware Engineering Intern, you will bridge the gap between cutting-edge silicon architecture and high-level software stacks.

### Key Responsibilities
- Develop and debug low-level device drivers, firmware, and board support packages (BSPs).
- Optimize hardware-software co-design pipelines and hardware acceleration APIs.
- Build automated validation suites and regression pipelines using Python and Bash.
- Collaborate with hardware architects to verify silicon functionality on pre-silicon emulators.

### Requirements & Eligibility
- Enrolled in B.Tech / M.Tech in Computer Science, Electronics, or Electrical Engineering.
- Solid grasp of C/C++, Data Structures, OS concepts, and Computer Architecture.
- Hands-on familiarity with Linux kernel development, microcontroller programming, or RTOS.
- 2025, 2026, or 2027 graduating batch.`
      },
      {
        title: 'Machine Learning & Hardware Acceleration Intern',
        roleCategory: 'AI_ML',
        stipendMin: 70000,
        stipendMax: 105000,
        durationMonths: 6,
        skills: ['Python', 'C++', 'Machine Learning', 'Deep Learning', 'Linux', 'PyTorch'],
        eligibility: 'B.Tech / M.Tech in CS/EE with focus on Machine Learning and hardware architectures (2025/2026/2027 batch).',
        description: `### About ${name}
${name} is driving the AI revolution with specialized silicon and software frameworks designed to accelerate neural networks at unprecedented scale.

### Role Overview
Contribute to our AI compiler, runtime, and model acceleration pipelines. You will optimize popular deep learning models to run efficiently on specialized hardware accelerators.

### Key Responsibilities
- Benchmark and optimize deep learning inference graphs (TensorRT, ONNX, PyTorch, TensorFlow).
- Implement hardware-aware quantization, pruning, and kernel fusion techniques.
- Profile latency, throughput, and memory bandwidth across CPU, GPU, and NPU architectures.
- Collaborate on open-source compiler toolchains (TVM, MLIR).

### Requirements & Eligibility
- Strong background in Machine Learning, Deep Learning, and linear algebra.
- Experience with PyTorch or TensorFlow, and proficient in Python and modern C++.
- 2025, 2026, or 2027 graduating batch.`
      }
    ];
  }

  // 4. Banking & Global Financial Institutions (Goldman Sachs, JPMorgan Chase, Morgan Stanley, AmEx, Visa, Mastercard, Barclays)
  if (['GOLDMAN SACHS', 'JPMORGAN CHASE', 'MORGAN STANLEY', 'AMERICAN EXPRESS', 'VISA', 'MASTERCARD', 'BARCLAYS', 'DEUTSCHE BANK', 'UBS', 'BLACKROCK', 'WELLS FARGO', 'CITI', 'BNY MELLON'].includes(nameUpper)) {
    return [
      {
        title: 'Software Development Engineer Intern (Core Financial Platforms)',
        roleCategory: 'SDE',
        stipendMin: 75000,
        stipendMax: 110000,
        durationMonths: nameUpper === 'GOLDMAN SACHS' || nameUpper === 'BARCLAYS' ? 2 : 6,
        skills: ['Java', 'Python', 'PostgreSQL', 'AWS', 'Microservices', 'Git'],
        eligibility: 'B.Tech / M.Tech in CS, IT, or related technical disciplines (2025, 2026, or 2027 graduating batch). Minimum 7.0 CGPA.',
        description: `### About ${name}
${name} is one of the world's leading financial institutions, powering trillions of dollars in daily transactions with enterprise-grade resilience, security, and scalability.

### Role Overview
Join our Global Technology organization as a Software Engineer Intern. You will design and build high-availability microservices for transactional platforms, payment gateways, and asset management systems.

### Key Responsibilities
- Engineer secure, fault-tolerant REST and GraphQL APIs conforming to global banking standards.
- Build scalable event-driven data ingestion architectures using Kafka, RabbitMQ, and relational databases.
- Write robust automated integration tests, ensuring zero regression in critical financial flows.
- Participate in agile sprint planning, code reviews, and cloud-native CI/CD deployment pipelines.

### Requirements & Eligibility
- B.Tech / M.Tech in Computer Science, IT, or related technical disciplines.
- Strong proficiency in Java, Python, C++, or Go.
- Sound understanding of Object-Oriented Design, relational databases (PostgreSQL/Oracle), and SQL.
- 2025, 2026, or 2027 graduating batch.`
      },
      {
        title: 'Data Science & Financial Risk Analytics Intern',
        roleCategory: 'DATA',
        stipendMin: 70000,
        stipendMax: 100000,
        durationMonths: 6,
        skills: ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'AWS'],
        eligibility: 'B.Tech / M.Tech students with background in Statistics, Data Science, or CS (2025/2026/2027 batch).',
        description: `### About ${name}
${name} leverages advanced data science and statistical modeling to power real-time fraud detection, credit risk assessment, and market intelligence.

### Role Overview
As a Data Science Intern, you will analyze vast financial datasets to create predictive models that safeguard customer assets and optimize capital allocation.

### Key Responsibilities
- Develop supervised and unsupervised machine learning algorithms for fraud detection and risk scoring.
- Design automated ETL data pipelines in Python and SQL for cross-border transaction data.
- Build executive KPI dashboards and interactive exploratory data tools.
- Ensure strict compliance with data privacy, security, and financial governance standards.

### Requirements & Eligibility
- Strong background in Probability, Statistics, and Data Modeling.
- Hands-on proficiency with Python (Pandas, Scikit-learn) and complex SQL queries.
- 2025, 2026, or 2027 graduating batch.`
      }
    ];
  }

  // 5. Indian Fintech, Startups & E-Commerce Unicorns (Flipkart, Swiggy, Zomato, PhonePe, Razorpay, CRED, Zerodha, Groww, Meesho, etc.)
  if (['RAZORPAY', 'PHONEPE', 'PAYTM', 'CRED', 'ZERODHA', 'GROWW', 'POLICYBAZAAR', 'FLIPKART', 'MYNTRA', 'SWIGGY', 'ZOMATO (ETERNAL)', 'OLA', 'RAPIDO', 'MEESHO', 'URBAN COMPANY', 'NYKAA', 'LENSKART', 'ZEPTO', 'BIGBASKET', 'BLINKIT', 'JUSPAY', 'PINE LABS', 'CASHFREE PAYMENTS', 'BHARATPE', 'TATA 1MG', 'PHARMEASY', 'ANGEL ONE', 'JUPITER MONEY'].includes(nameUpper)) {
    return [
      {
        title: 'Software Development Engineer Intern (Backend)',
        roleCategory: 'SDE',
        stipendMin: 50000,
        stipendMax: 85000,
        durationMonths: 6,
        skills: ['Node.js', 'Go', 'Java', 'PostgreSQL', 'Docker', 'AWS'],
        eligibility: 'Pursuing B.Tech / M.Tech in CS/IT or related branches (2025, 2026, or 2027 batch). Minimum 7.0 CGPA.',
        description: `### About ${name}
${name} is one of India's premier high-growth technology leaders, delivering delightful consumer and merchant experiences at pan-India scale.

### Role Overview
As an SDE Intern in our Core Engineering team, you will build and deploy distributed services handling millions of concurrent requests every day.

### Key Responsibilities
- Design, implement, and maintain high-throughput microservices using Go, Node.js, or Java.
- Optimize database performance and implement caching layers with Redis and PostgreSQL.
- Build robust asynchronous event processing pipelines using Apache Kafka or RabbitMQ.
- Write clean, maintainable, and well-tested code following best engineering practices.

### Requirements & Eligibility
- Pursuing B.Tech / M.Tech in CS/IT or related engineering branches.
- Solid foundation in Data Structures, Algorithms, DBMS, and Computer Networks.
- Passion for building high-scale consumer-facing internet products in India.
- 2025, 2026, or 2027 graduating batch.`
      },
      {
        title: 'Frontend Engineering Intern',
        roleCategory: 'SDE',
        stipendMin: 45000,
        stipendMax: 75000,
        durationMonths: 6,
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
        eligibility: 'B.Tech / M.Tech / BCA / MCA students with strong frontend development portfolio (2025/2026/2027 batch).',
        description: `### About ${name}
${name} builds intuitive, world-class digital experiences loved by tens of millions of Indian consumers.

### Role Overview
Join our Frontend Experience team! You will contribute to our web and mobile web platforms, focusing on ultra-responsive interfaces, web performance, and delighting micro-interactions.

### Key Responsibilities
- Develop reusable, accessible UI component libraries using React, Next.js, and TypeScript.
- Optimize Core Web Vitals, critical rendering path, and bundle sizes for seamless mobile performance.
- Collaborate closely with Product Designers and Backend Engineers to translate Figma mockups into reality.
- Integrate REST and GraphQL endpoints with robust offline-first and caching patterns.

### Requirements & Eligibility
- Hands-on experience with modern JavaScript / TypeScript, React, and CSS frameworks (Tailwind CSS).
- Keen eye for detail, responsive design principles, and browser compatibility.
- 2025, 2026, or 2027 graduating batch.`
      }
    ];
  }

  // 6. IT Services & Global Consultancies (TCS, Infosys, Wipro, Cognizant, Accenture, Capgemini)
  if (['TCS', 'INFOSYS', 'WIPRO', 'COGNIZANT', 'ACCENTURE', 'CAPGEMINI', 'HCLTECH', 'PERSISTENT SYSTEMS', 'DELOITTE USI', 'PUBLICIS SAPIENT', 'MCKINSEY & COMPANY', 'BCG', 'BAIN & COMPANY'].includes(nameUpper)) {
    return [
      {
        title: 'Software Engineering & Cloud Associate Intern',
        roleCategory: 'SDE',
        stipendMin: 30000,
        stipendMax: 48000,
        durationMonths: 6,
        skills: ['Java', 'Python', 'SQL', 'AWS', 'Docker', 'Git'],
        eligibility: 'Enrolled in B.Tech / B.E. / M.Tech in CS, IT, ECE, or related engineering streams (2025, 2026, or 2027 graduating batch). Minimum 6.5 CGPA.',
        description: `### About ${name}
${name} is a global leader in digital transformation, consulting, and enterprise software engineering, serving Fortune 500 enterprises worldwide.

### Role Overview
Join our Digital Engineering practice in India. You will work on real-world enterprise modernization projects, building cloud-native applications and scalable backend systems.

### Key Responsibilities
- Develop microservices and RESTful APIs using Java, Spring Boot, or Python.
- Configure cloud infrastructure and automated CI/CD deployment pipelines on AWS or Azure.
- Write comprehensive unit and integration test suites.
- Collaborate with international client teams in an agile environment.

### Requirements & Eligibility
- Enrolled in B.Tech / B.E. / M.Tech in CS, IT, ECE, or related engineering streams.
- Good understanding of object-oriented programming, data structures, and relational databases.
- Excellent communication and teamwork skills.
- 2025, 2026, or 2027 graduating batch.`
      },
      {
        title: 'Data Analytics & AI Associate Intern',
        roleCategory: 'AI_ML',
        stipendMin: 30000,
        stipendMax: 48000,
        durationMonths: 6,
        skills: ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'AWS'],
        eligibility: 'B.Tech / M.Tech students in technical branches (2025, 2026, or 2027 graduating batch).',
        description: `### About ${name}
${name} helps enterprises harness the power of artificial intelligence, advanced analytics, and data modernizations to solve complex business challenges.

### Role Overview
As a Data & AI Associate Intern, you will participate in designing end-to-end data pipelines and implementing predictive machine learning models.

### Key Responsibilities
- Extract, clean, and transform unstructured and structured data using Python and SQL.
- Implement machine learning algorithms for demand forecasting, classification, and generative AI use cases.
- Create automated visual dashboards to communicate model metrics and business insights.
- Document architectural specifications and model performance benchmarks.

### Requirements & Eligibility
- Solid foundation in Python, SQL, and introductory Machine Learning concepts.
- Passion for learning modern AI tools, cloud data warehouses, and data engineering.
- 2025, 2026, or 2027 graduating batch.`
      }
    ];
  }

  // 7. General Tech, Cloud & SaaS (Default)
  return [
    {
      title: 'Software Development Engineer Intern',
      roleCategory: 'SDE',
      stipendMin: 65000,
      stipendMax: 100000,
      durationMonths: 6,
      skills: ['Python', 'Java', 'Go', 'Docker', 'PostgreSQL', 'Git'],
      eligibility: 'Pursuing a degree in Computer Science, Software Engineering, or related technical disciplines (2025, 2026, or 2027 batch). Minimum 7.0 CGPA.',
      description: `### About ${name}
${name} is a recognized global technology leader delivering world-class software platforms, cloud infrastructure, and modern applications.

### Role Overview
As a Software Development Engineer Intern, you will be embedded directly into our core product engineering teams, working on mission-critical features from day one.

### Key Responsibilities
- Architect, build, and deploy reliable, highly scalable backend services and distributed APIs.
- Optimize database queries, caching strategies, and event streaming workflows.
- Write unit, integration, and performance tests to maintain rigorous code quality.
- Participate in technical design sessions and collaborate across engineering, product, and QA.

### Requirements & Eligibility
- Pursuing a degree in Computer Science, Software Engineering, or related technical disciplines.
- Strong coding skills in Java, Python, C++, Go, or TypeScript.
- Strong foundation in Algorithms, Data Structures, and System Design principles.
- 2025, 2026, or 2027 graduating batch.`
    },
    {
      title: 'Machine Learning & Data Intelligence Intern',
      roleCategory: 'AI_ML',
      stipendMin: 70000,
      stipendMax: 105000,
      durationMonths: 6,
      skills: ['Python', 'SQL', 'Machine Learning', 'Deep Learning', 'Docker', 'PyTorch'],
      eligibility: 'B.Tech / M.Tech in CS/AI or related branches (2025, 2026, or 2027 graduating batch).',
      description: `### About ${name}
${name} utilizes advanced machine learning, predictive intelligence, and generative AI to solve complex domain problems at scale.

### Role Overview
As an AI/ML and Data Intelligence Intern, you will work on research and productionization of state-of-the-art machine learning models.

### Key Responsibilities
- Design and train predictive models and neural networks for personalization, forecasting, and NLP.
- Build automated data validation, feature engineering, and model evaluation pipelines.
- Integrate AI services with production microservices with strict latency and throughput SLAs.
- Conduct exploratory data analysis to discover impactful product opportunities.

### Requirements & Eligibility
- Strong background in Machine Learning, Mathematics, and Data Structures.
- Hands-on experience with Python, PyTorch/TensorFlow, Pandas, and SQL.
- 2025, 2026, or 2027 graduating batch.`
    }
  ];
}
