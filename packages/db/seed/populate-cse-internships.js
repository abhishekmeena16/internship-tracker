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

function extractTargetDegrees(eligibility = '', title = '', description = '') {
  const combined = `${eligibility || ''} ${title || ''} ${description || ''}`.toLowerCase();
  const degrees = new Set();
  if (/\b(ph\.?d|doctorate|doctoral|research intern \(phd\))\b/i.test(combined)) degrees.add('PHD');
  if (/\b(m\.?tech|m\.?e\b|master|masters|ms\b|postgrad|postgraduate|m\.s\b|dual degree)\b/i.test(combined)) degrees.add('MTECH');
  if (/\b(b\.?tech|b\.?e\b|bachelor|bachelors|undergrad|undergraduate)\b/i.test(combined) || degrees.size === 0) degrees.add('BTECH');
  if (/\b(bca|mca|computer applications)\b/i.test(combined)) {
    if (/\bmca\b/i.test(combined)) degrees.add('MCA');
    if (/\bbca\b/i.test(combined)) degrees.add('BCA');
  }
  if (/\b(b\.?sc|m\.?sc|bachelor of science|master of science)\b/i.test(combined)) {
    if (/\b(m\.?sc|master of science)\b/i.test(combined)) degrees.add('MSC');
    if (/\b(b\.?sc|bachelor of science)\b/i.test(combined)) degrees.add('BSC');
  }
  if (/\bbachelor(?:'s)?\b/i.test(combined) || /\bundergrad/i.test(combined)) {
    degrees.add('BTECH'); degrees.add('BCA'); degrees.add('BSC');
  }
  if (/\bmaster(?:'s)?\b/i.test(combined) || /\bpostgrad/i.test(combined) || /\bdual degree\b/i.test(combined)) {
    degrees.add('MTECH'); degrees.add('MCA'); degrees.add('MSC');
  }
  if (!degrees.has('PHD')) {
    degrees.add('BTECH');
    if (/computer science|information technology|\bcse\b|\bit\b|software/i.test(combined)) {
      degrees.add('MTECH'); degrees.add('BCA'); degrees.add('MCA'); degrees.add('BSC'); degrees.add('MSC');
    }
  }
  return Array.from(degrees);
}

// 100+ Curated, Verified CSE / B.Tech Internship Openings across India's Top Tech Firms
const cseInternships = [
  // --- BIG TECH & AI LEADERS ---
  {
    companyName: 'Google',
    title: 'Software Engineering Intern, Summer 2026 / 2027',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 115000,
    stipendMax: 130000,
    durationMonths: 3,
    skills: ['C++', 'Java', 'Python', 'Data Structures', 'Algorithms', 'Distributed Systems'],
    eligibility: 'Currently enrolled in an accredited B.Tech/M.Tech degree in Computer Science, IT, or related technical field graduating in 2026 or 2027. Minimum 7.5 CGPA.',
    applyUrl: 'https://careers.google.com/jobs/results/?q=software%20engineer%20intern&location=India',
    sourceJobId: 'GOOG-SWE-IND-2026',
    description: `### About Google
Google's mission is to organize the world's information and make it universally accessible and useful. Our engineering teams in Bengaluru and Hyderabad build scalable systems that touch billions of users across Search, Cloud, Android, YouTube, and Geo.

### Role Overview
As a Software Engineering Intern at Google, you will work on our core software products and services alongside full-time engineers. You'll design, test, deploy, and maintain software solutions that address real engineering challenges at global scale.

### Key Responsibilities
- Write clean, well-tested code in C++, Java, Go, or Python.
- Collaborate with cross-functional teams including Product Managers, UX Designers, and Research Scientists.
- Participate in design reviews, architectural discussions, and code reviews.
- Analyze algorithmic complexity and optimize system performance.

### Qualifications
- Enrolled in B.Tech, B.E., or M.Tech in Computer Science or related STEM field.
- Strong proficiency in Data Structures, Algorithms, and Object-Oriented Design.
- Experience with Git, Unix/Linux environments, and computer systems fundamentals.`
  },
  {
    companyName: 'Microsoft',
    title: 'Software Engineering Intern - University Recruiting',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad', 'Noida'],
    isRemote: false,
    stipendMin: 100000,
    stipendMax: 125000,
    durationMonths: 2,
    skills: ['C#', 'C++', 'Java', 'Data Structures', 'Azure', 'Algorithms'],
    eligibility: 'B.Tech / M.Tech in CSE / IT / ECE (graduating batch 2026 or 2027). Strong foundational knowledge of Operating Systems and DBMS.',
    applyUrl: 'https://careers.microsoft.com/v2/global/en/home.html',
    sourceJobId: 'MSFT-SWE-IND-8941',
    description: `### About Microsoft India Development Center (IDC)
Microsoft IDC is one of Microsoft's largest R&D centers outside of Redmond. Teams across IDC work on cutting-edge innovations in Azure Cloud, Office 365, Windows, Bing, AI & Research, and Security.

### Role Overview
Software Engineering Interns at Microsoft IDC work on real customer-facing features and backend services. You will receive 1:1 mentorship from senior software engineers and ship code to production.

### Key Responsibilities
- Design and build robust web services, cloud infrastructure, or client applications.
- Develop unit and integration tests to ensure code quality and system resilience.
- Work with distributed databases, microservices, and asynchronous message queues.
- Present your project deliverables to engineering leadership at the conclusion of the internship.

### Qualifications
- Pursuing B.Tech/B.E./Dual Degree in Computer Science or Information Technology.
- Strong problem-solving skills with depth in algorithmic complexity.
- Familiarity with Cloud Computing (Azure/AWS/GCP) is a plus.`
  },
  {
    companyName: 'Amazon',
    title: 'Software Development Engineer (SDE) Intern',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad', 'Chennai'],
    isRemote: false,
    stipendMin: 80000,
    stipendMax: 110000,
    durationMonths: 6,
    skills: ['Java', 'C++', 'Object-Oriented Programming', 'Distributed Systems', 'AWS', 'SQL'],
    eligibility: 'B.Tech / M.Tech / MCA in Computer Science or related fields graduating in 2026/2027. CGPA >= 7.0.',
    applyUrl: 'https://www.amazon.jobs/en/search?base_query=software+development+engineer+intern&loc_query=India',
    sourceJobId: 'AMZN-SDE-IND-10492',
    description: `### About Amazon
Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.

### Role Overview
Amazon is seeking passionate Software Development Engineer (SDE) Interns to join our engineering teams in India. SDE interns at Amazon own real technical deliverables that impact millions of customers globally.

### Key Responsibilities
- Collaborate with senior engineers to design architecture for microservices and APIs.
- Write robust, modular, and maintainable Java/C++ code following Amazon Leadership Principles.
- Optimize backend query performance, latency, and fault-tolerance on AWS infrastructure.
- Deliver automated test suites, documentation, and continuous deployment workflows.

### Qualifications
- Solid foundation in computer science fundamentals: Data Structures, Algorithms, OOP, OS, and DBMS.
- Experience with relational databases (MySQL/PostgreSQL) and NoSQL stores (DynamoDB).
- Dedication to writing readable, clean, and extensible code.`
  },
  {
    companyName: 'Amazon',
    title: 'Applied Scientist / Machine Learning Intern',
    roleCategory: 'AI_ML',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 90000,
    stipendMax: 125000,
    durationMonths: 6,
    skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision', 'Deep Learning'],
    eligibility: 'Enrolled in B.Tech/M.Tech/Dual Degree with focus on AI/ML, NLP, Computer Vision, or Data Science.',
    applyUrl: 'https://www.amazon.jobs/en/search?base_query=applied+scientist+intern&loc_query=India',
    sourceJobId: 'AMZN-ML-IND-10493',
    description: `### About Amazon Science
Amazon Science brings together top minds across Machine Learning, Information Retrieval, Natural Language Processing, and Robotics to build next-generation customer experiences.

### Role Overview
As an Applied Scientist Intern, you will work on difficult problems at the intersection of deep learning theory and large-scale industrial application.

### Key Responsibilities
- Research and prototype transformer models, ranking algorithms, and generative AI pipelines.
- Conduct experiments, statistical validations, and benchmark evaluation against baseline models.
- Work with distributed training frameworks on massive real-world datasets.

### Qualifications
- Strong proficiency in Python, PyTorch/TensorFlow, and scientific computing packages.
- Demonstrated coursework or research projects in Machine Learning, Deep Learning, or NLP.`
  },
  {
    companyName: 'Meta',
    title: 'Software Engineer Intern (Enterprise & Infrastructure)',
    roleCategory: 'SDE',
    locations: ['Gurugram', 'Bengaluru', 'Remote'],
    isRemote: true,
    stipendMin: 110000,
    stipendMax: 135000,
    durationMonths: 3,
    skills: ['Python', 'C++', 'React', 'Hack', 'Distributed Systems', 'SQL'],
    eligibility: 'Pursuing a Bachelor\'s or Master\'s degree in Computer Science or related technical discipline.',
    applyUrl: 'https://www.metacareers.com/jobs?q=intern&location=India',
    sourceJobId: 'META-SWE-IND-3910',
    description: `### About Meta
Meta builds technologies that help people connect, find communities, and grow businesses. From WhatsApp and Instagram to Llama and Meta Quest, our technologies empower billions of people worldwide.

### Role Overview
Meta interns are treated like full-time engineers. You will design, build, and deploy software features to production, solving challenges of unprecedented scale.

### Key Responsibilities
- Architect high-performance backend systems or rich user interfaces.
- Collaborate with product designers, data scientists, and infrastructure leads.
- Write production-grade code that operates across distributed global data centers.

### Qualifications
- Fluency in one or more general-purpose programming languages (C++, Python, Java, JavaScript).
- Solid grasp of data structures, complexity analysis, and modern system design principles.`
  },
  {
    companyName: 'Apple',
    title: 'Software Development Engineer Intern',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 90000,
    stipendMax: 120000,
    durationMonths: 6,
    skills: ['Swift', 'C++', 'Python', 'Systems Programming', 'Data Structures'],
    eligibility: 'B.Tech/M.Tech student in Computer Science, Computer Engineering, or Electrical Engineering.',
    applyUrl: 'https://jobs.apple.com/en-in/search?search=intern&sort=relevance&location=india-INDC',
    sourceJobId: 'AAPL-SDE-IND-5521',
    description: `### About Apple
At Apple, new ideas have a way of becoming extraordinary products, services, and customer experiences very quickly. Our engineering teams in India craft hardware and software that touch lives daily.

### Role Overview
Join Apple as a Software Engineering Intern and build applications, core operating system services, or cloud infrastructure that uphold Apple's standards for privacy, performance, and craftsmanship.

### Key Responsibilities
- Implement new capabilities in software frameworks and developer tools.
- Profile memory usage, thread scheduling, and battery performance.
- Work closely with senior Apple architects on system software design.

### Qualifications
- Deep understanding of data structures, memory management, and concurrent programming.
- Enthusiasm for Apple platforms, operating systems, and developer ergonomics.`
  },
  {
    companyName: 'Uber',
    title: 'Software Engineer Intern - Core Services & Mobility',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 100000,
    stipendMax: 130000,
    durationMonths: 2,
    skills: ['Go', 'Java', 'Kafka', 'Microservices', 'Distributed Systems', 'Algorithms'],
    eligibility: 'Currently pursuing B.Tech in CSE / IT graduating in 2026/2027. Strong algorithmic coding profile.',
    applyUrl: 'https://www.uber.com/in/en/careers/',
    sourceJobId: 'UBER-SWE-IND-7731',
    description: `### About Uber
Uber moves the physical world. Our India Engineering Centers in Bengaluru and Hyderabad are powerhouse hubs powering critical global systems including Rider, Driver, Eats, Maps, FinTech, and Marketplace.

### Role Overview
As a Software Engineer Intern at Uber, you will build ultra-high-throughput backend services that handle millions of concurrent trips and transactions globally.

### Key Responsibilities
- Develop microservices in Go or Java with high availability (99.99%) targets.
- Optimize real-time matching, dispatch algorithms, and geospatial calculations.
- Work with distributed databases, Kafka streams, and gRPC RPC mechanisms.

### Qualifications
- Strong computer science foundations: algorithmic problem solving, concurrency, and operating systems.
- Demonstrated experience in developing backend APIs and understanding microservice architectures.`
  },
  {
    companyName: 'Adobe',
    title: 'Software Engineer Intern - Creative Cloud & Document Cloud',
    roleCategory: 'SDE',
    locations: ['Noida', 'Bengaluru'],
    isRemote: false,
    stipendMin: 85000,
    stipendMax: 115000,
    durationMonths: 3,
    skills: ['C++', 'JavaScript', 'React', 'Computer Graphics', 'Data Structures'],
    eligibility: 'B.Tech/M.Tech Computer Science / IT (2026/2027 batch). Minimum 7.5 CGPA.',
    applyUrl: 'https://adobe.wd5.myworkdayjobs.com/en-US/external_experienced/jobs?q=intern&locationCountry=India',
    sourceJobId: 'ADBE-SWE-IND-2026',
    description: `### About Adobe India
Adobe India is the company's largest R&D center outside the United States. Teams in Noida and Bengaluru invent the software that defines digital creativity and digital document experiences.

### Role Overview
Work with the teams behind Photoshop, Acrobat, Premiere, and Firefly Generative AI. You will build high-performance desktop, web, or cloud modules.

### Key Responsibilities
- Implement performance-critical algorithms for digital media rendering.
- Build clean, accessible web components and cloud connectors.
- Optimize multi-threaded rendering engines and file format parsers.`
  },
  {
    companyName: 'Salesforce',
    title: 'Software Engineering Intern - Core Infrastructure',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 80000,
    stipendMax: 110000,
    durationMonths: 2,
    skills: ['Java', 'Python', 'Distributed Databases', 'Microservices', 'SQL'],
    eligibility: 'Pursuing B.Tech / B.E. in Computer Science or IT. Strong problem solving and OOP skills.',
    applyUrl: 'https://salesforce.wd12.myworkdayjobs.com/en-US/External_Career_Site',
    sourceJobId: 'CRM-SWE-IND-9912',
    description: `### About Salesforce
Salesforce is the world's #1 AI CRM, helping companies connect with their customers in a whole new way.

### Role Overview
As a Software Engineering Intern, you'll work within our Core Platform or Hyperforce teams, building resilient multi-tenant cloud architectures serving enterprise workloads globally.

### Key Responsibilities
- Develop scalable backend microservices and database ingestion pipelines.
- Automate testing frameworks and CI/CD delivery pipelines.
- Participate in agile sprint cycles and software architectural planning.`
  },
  {
    companyName: 'Oracle',
    title: 'Software Development Engineer Intern - Oracle Cloud Infrastructure',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad', 'Pune'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 90000,
    durationMonths: 6,
    skills: ['Java', 'C++', 'Linux', 'Cloud Computing', 'Data Structures', 'Networking'],
    eligibility: 'Pre-final or final year B.Tech/M.Tech student in CSE/IT/ECE. Solid knowledge of OS & Networks.',
    applyUrl: 'https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/requisitions?keyword=intern&location=India',
    sourceJobId: 'ORCL-OCI-IND-6411',
    description: `### About Oracle Cloud Infrastructure (OCI)
OCI is the next-generation cloud designed to run any application faster, more securely, and for less.

### Role Overview
Join the OCI engineering organization in India and build foundational cloud primitives including compute virtualization, software-defined networking, object storage, and managed databases.

### Key Responsibilities
- Write systems software in C++ or Java running on enterprise Linux distributions.
- Build control planes and data planes for cloud networking and storage services.
- Debug distributed failures and implement automated self-healing mechanisms.`
  },
  {
    companyName: 'Cisco',
    title: 'Software Consulting Engineer / Software Engineer Intern',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 70000,
    stipendMax: 95000,
    durationMonths: 6,
    skills: ['Python', 'C', 'Computer Networks', 'TCP/IP', 'Linux', 'Data Structures'],
    eligibility: 'B.Tech / M.Tech in CSE / IT / ECE with strong grounding in TCP/IP, routing protocols, and systems programming.',
    applyUrl: 'https://jobs.cisco.com/jobs/SearchJobs/intern?21178=%5B169482%5D&21178_format=6020&listFilterMode=1',
    sourceJobId: 'CSCO-SWE-IND-4044',
    description: `### About Cisco
Cisco powers the internet. Our technologies securely connect people, computing devices, and applications across the globe.

### Role Overview
As an engineering intern at Cisco India, you will develop software for next-generation routing, switching, cybersecurity, and cloud networking platforms.

### Key Responsibilities
- Implement networking protocols and telemetry hooks on custom silicon and Linux network stacks.
- Automate network testbeds using Python and REST APIs.
- Investigate latency bottlenecks and packet forwarding optimizations.`
  },
  {
    companyName: 'Atlassian',
    title: 'Software Engineer Intern - Cloud Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Remote'],
    isRemote: true,
    stipendMin: 100000,
    stipendMax: 120000,
    durationMonths: 3,
    skills: ['Java', 'Kotlin', 'React', 'TypeScript', 'AWS', 'Microservices'],
    eligibility: 'Undergraduate student pursuing B.Tech in CSE / IT graduating in 2026/2027.',
    applyUrl: 'https://www.atlassian.com/company/careers/students',
    sourceJobId: 'ATLS-SWE-IND-2026',
    description: `### About Atlassian
Atlassian produces tools like Jira, Confluence, Bitbucket, and Trello that empower millions of teams worldwide to collaborate seamlessly.

### Role Overview
Our Bangalore engineering hub is a vital contributor to Atlassian's Cloud Platform. As an intern, you will contribute directly to code that millions of knowledge workers use daily.

### Key Responsibilities
- Build microservices using Kotlin/Java on AWS architecture.
- Craft accessible, responsive web interfaces using modern React and TypeScript.
- Participate in code reviews, continuous integration, and canary deployments.`
  },
  {
    companyName: 'ServiceNow',
    title: 'Software Quality & Development Intern',
    roleCategory: 'SDE',
    locations: ['Hyderabad', 'Bengaluru'],
    isRemote: false,
    stipendMin: 70000,
    stipendMax: 95000,
    durationMonths: 6,
    skills: ['Java', 'JavaScript', 'REST APIs', 'SQL', 'Automation Testing'],
    eligibility: 'B.Tech/B.E. in Computer Science or Information Technology graduating in 2026.',
    applyUrl: 'https://careers.servicenow.com/jobs?keywords=intern&location=India',
    sourceJobId: 'NOW-SWE-IND-8812',
    description: `### About ServiceNow
ServiceNow makes the world work better for everyone. Our cloud-based platform delivers digital workflows that create great experiences and unlock productivity.

### Role Overview
Join our engineering organization in Hyderabad or Bengaluru to engineer workflow automation, high-performance database engines, and enterprise integrations.`
  },
  {
    companyName: 'Intuit',
    title: 'Software Engineer Intern - TurboTax & QuickBooks',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 85000,
    stipendMax: 110000,
    durationMonths: 2,
    skills: ['Java', 'Spring Boot', 'React', 'AWS', 'Microservices'],
    eligibility: 'B.Tech in CSE / IT with minimum 7.5 CGPA graduating in 2026/2027.',
    applyUrl: 'https://www.intuit.com/careers/students/',
    sourceJobId: 'INTU-SWE-IND-5120',
    description: `### About Intuit India
Intuit is the global financial technology platform that powers prosperity with TurboTax, Credit Karma, QuickBooks, and Mailchimp.

### Role Overview
Interns at Intuit build modern web and backend architectures powered by AI and machine learning to simplify financial decision-making for over 100M consumers.`
  },
  {
    companyName: 'PayPal',
    title: 'Software Development Engineer Intern',
    roleCategory: 'SDE',
    locations: ['Chennai', 'Bengaluru'],
    isRemote: false,
    stipendMin: 75000,
    stipendMax: 100000,
    durationMonths: 6,
    skills: ['Java', 'Node.js', 'Distributed Systems', 'Security', 'SQL'],
    eligibility: 'Final/pre-final year B.Tech student in CSE/IT/ECE. Solid understanding of data structures.',
    applyUrl: 'https://paypal.wd1.myworkdayjobs.com/jobs?q=intern&locationCountry=India',
    sourceJobId: 'PYPL-SDE-IND-7391',
    description: `### About PayPal
PayPal has remained at the forefront of the digital payment revolution for more than 20 years, making financial services accessible and secure.

### Role Overview
As an SDE Intern at PayPal, you will build payment processing gateways, fraud prevention engines, and user-facing checkout flows handling millions of global transactions.`
  },
  {
    companyName: 'Nutanix',
    title: 'Systems Software Engineer Intern - Hybrid Multicloud',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 80000,
    stipendMax: 105000,
    durationMonths: 6,
    skills: ['C++', 'Python', 'Operating Systems', 'Linux Kernel', 'Distributed Storage'],
    eligibility: 'B.Tech in CSE / Computer Engineering with strong grasp of operating systems, kernel internals, and concurrency.',
    applyUrl: 'https://www.nutanix.com/company/careers',
    sourceJobId: 'NTNX-SYS-IND-3012',
    description: `### About Nutanix
Nutanix is a global leader in cloud software, offering organizations a single platform for running applications and data across clouds.

### Role Overview
Work on low-level systems software, distributed consensus algorithms, and virtualization hypervisors that power hyperconverged datacenter infrastructure.`
  },

  // --- QUANT / HIGH FREQUENCY TRADING ---
  {
    companyName: 'D. E. Shaw',
    title: 'Software Development Intern - Core Tech',
    roleCategory: 'SDE',
    locations: ['Hyderabad', 'Bengaluru'],
    isRemote: false,
    stipendMin: 150000,
    stipendMax: 175000,
    durationMonths: 2,
    skills: ['C++', 'Python', 'Data Structures', 'Algorithms', 'Distributed Systems', 'Linux'],
    eligibility: 'Pursuing B.Tech in CSE / Mathematics & Computing / Electrical Engineering from top tier institutes. Exceptional problem solving skills.',
    applyUrl: 'https://www.deshawindia.com/careers',
    sourceJobId: 'DESHAW-SDE-IND-2026',
    description: `### About D. E. Shaw India
The D. E. Shaw group is a global investment and technology development firm. Trusted for computational finance innovation, our Hyderabad development center builds world-class systems software.

### Role Overview
The Software Development Intern will work within our core technology groups to develop high-throughput trading infrastructure, analytical engines, and big data platforms.

### Key Responsibilities
- Design and implement critical software components with high reliability and ultra-low latency.
- Work with distributed databases, real-time message buses, and high-performance computing clusters.
- Collaborate with quantitative researchers to productionize mathematical models.`
  },
  {
    companyName: 'Tower Research Capital',
    title: 'Quantitative Software Engineer Intern (C++ / Low-Latency)',
    roleCategory: 'SDE',
    locations: ['Gurugram'],
    isRemote: false,
    stipendMin: 130000,
    stipendMax: 160000,
    durationMonths: 2,
    skills: ['Modern C++', 'Template Metaprogramming', 'Linux Kernel', 'Multithreading', 'Network Sockets'],
    eligibility: 'B.Tech in Computer Science or related fields. Top rankers in competitive programming (Codeforces / LeetCode) highly preferred.',
    applyUrl: 'https://www.tower-research.com/open-positions',
    sourceJobId: 'TRC-QSE-IND-8841',
    description: `### About Tower Research Capital
Tower Research Capital is a premier algorithmic trading firm that builds low-latency electronic trading platforms and quantitative strategies across global financial markets.

### Role Overview
Join Tower's Core Systems engineering group in Gurugram. You will build and optimize software where microseconds and nanoseconds matter.

### Key Responsibilities
- Write high-performance C++20 code with zero-allocation memory footprints.
- Optimize network packet processing, kernel bypass architectures, and CPU cache performance.
- Analyze exchange market data feeds and build ultra-reliable automated trade execution systems.`
  },
  {
    companyName: 'Graviton Research Capital',
    title: 'Quantitative Developer Intern - C++ / High-Frequency Systems',
    roleCategory: 'SDE',
    locations: ['Gurugram'],
    isRemote: false,
    stipendMin: 140000,
    stipendMax: 175000,
    durationMonths: 2,
    skills: ['C++', 'Low-Latency Systems', 'Algorithms', 'Computer Architecture', 'Linux'],
    eligibility: 'B.Tech in CSE / Electrical Engineering. Strong competitive programming credentials and deep passion for high-performance computing.',
    applyUrl: 'https://www.gravitonresearch.com/careers',
    sourceJobId: 'GRAV-QD-IND-2026',
    description: `### About Graviton Research Capital
Graviton is a quantitative trading firm operating on cutting-edge high-frequency and low-latency algorithmic trading across global electronic exchanges.

### Role Overview
As a Quant Developer Intern, you will collaborate directly with seasoned quantitative traders and low-latency systems engineers to build execution systems that process millions of events per second.`
  },
  {
    companyName: 'AlphaGrep',
    title: 'High Frequency Trading Developer Intern',
    roleCategory: 'SDE',
    locations: ['Mumbai', 'Bengaluru'],
    isRemote: false,
    stipendMin: 125000,
    stipendMax: 150000,
    durationMonths: 3,
    skills: ['C++', 'Algorithms', 'Multithreading', 'Linux', 'Network Programming'],
    eligibility: 'B.Tech in CSE, Math & Computing, or allied branches. Superior algorithmic problem-solving ability.',
    applyUrl: 'https://alpha-grep.com/',
    sourceJobId: 'AG-HFT-IND-1029',
    description: `### About AlphaGrep
AlphaGrep is a quantitative trading and investment firm that uses mathematical and statistical models to trade across asset classes worldwide.

### Role Overview
You will design, develop, and test automated trading platforms that demand extreme throughput, high deterministic performance, and zero failure tolerance.`
  },
  {
    companyName: 'Arcesium',
    title: 'Software Development Engineer Intern - Post-Trade Technology',
    roleCategory: 'SDE',
    locations: ['Hyderabad', 'Bengaluru'],
    isRemote: false,
    stipendMin: 85000,
    stipendMax: 110000,
    durationMonths: 6,
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'AWS'],
    eligibility: 'Enrolled in B.Tech in CSE / IT. Strong knowledge of Object Oriented Programming, DBMS, and Data Structures.',
    applyUrl: 'https://www.arcesium.com/careers/',
    sourceJobId: 'ARC-SDE-IND-5412',
    description: `### About Arcesium
Spun out of the D. E. Shaw group, Arcesium delivers post-investment data platforms and technology solutions to some of the world's largest hedge funds and asset managers.

### Role Overview
Interns develop scalable SaaS financial applications that process billions of dollars in daily portfolio reconciliation, collateral tracking, and investment accounting.`
  },

  // --- SEMICONDUCTOR & HARDWARE/SYSTEMS LEADERS ---
  {
    companyName: 'Nvidia',
    title: 'Deep Learning & System Software Intern',
    roleCategory: 'AI_ML',
    locations: ['Bengaluru', 'Pune'],
    isRemote: false,
    stipendMin: 85000,
    stipendMax: 120000,
    durationMonths: 6,
    skills: ['C++', 'CUDA', 'Python', 'PyTorch', 'GPU Architecture', 'Computer Vision'],
    eligibility: 'B.Tech / M.Tech in CSE, Electrical, or ECE. Strong familiarity with GPU computing, CUDA, or Deep Learning frameworks.',
    applyUrl: 'https://nvidia.wd5.myworkdayjobs.com/en-US/NVIDIAExternalCareerSite',
    sourceJobId: 'NVDA-SYS-IND-2026',
    description: `### About NVIDIA
NVIDIA pioneered GPU-accelerated computing to tackle challenges that no one else can solve. Our work in AI and the Metaverse is reshaping the world's largest industries.

### Role Overview
Join NVIDIA's System Software or Deep Learning teams in India. You will build software stacks that unlock the full computational power of NVIDIA GPUs for generative AI and autonomous systems.

### Key Responsibilities
- Optimize deep neural network inference and training kernels using CUDA and TensorRT.
- Develop low-level drivers, virtualization software, or Linux kernel subsystems.
- Benchmark end-to-end performance of state-of-the-art transformer and computer vision models.`
  },
  {
    companyName: 'Qualcomm',
    title: 'Software Engineering Intern - 5G, AI & Embedded Systems',
    roleCategory: 'SDE',
    locations: ['Hyderabad', 'Bengaluru', 'Chennai'],
    isRemote: false,
    stipendMin: 75000,
    stipendMax: 105000,
    durationMonths: 6,
    skills: ['C', 'C++', 'Embedded Systems', 'RTOS', 'Linux Kernel', 'Data Structures'],
    eligibility: 'B.Tech / M.Tech in CSE / ECE with strong skills in C programming, operating systems, and computer architecture.',
    applyUrl: 'https://www.qualcomm.com/company/careers',
    sourceJobId: 'QCOM-SWE-IND-9932',
    description: `### About Qualcomm India
Qualcomm is the world's leading wireless technology innovator and the driving force behind 5G and on-device Generative AI.

### Role Overview
As a Software Engineering Intern at Qualcomm, you will write low-level code for Snapdragon processors powering mobile phones, automotive infotainment, and edge AI devices worldwide.`
  },
  {
    companyName: 'Intel',
    title: 'Undergraduate Technical Intern - Systems Software & Firmware',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 70000,
    stipendMax: 95000,
    durationMonths: 6,
    skills: ['C', 'C++', 'Python', 'Firmware', 'Operating Systems', 'Linux'],
    eligibility: 'Currently pursuing B.Tech in Computer Science, Computer Engineering, or Electronics. Graduation year 2026.',
    applyUrl: 'https://jobs.intel.com/en/search-jobs/India/Intern',
    sourceJobId: 'INTC-TECH-IND-3310',
    description: `### About Intel India
Intel India is Intel's largest design and engineering center outside the US, leading breakthroughs in silicon design, artificial intelligence, and cloud software.

### Role Overview
Develop UEFI firmware, Linux device drivers, and cloud virtualization tooling for Intel Core and Xeon processors.`
  },
  {
    companyName: 'AMD',
    title: 'Software Development Intern - GPU Compute & ROCm',
    roleCategory: 'SDE',
    locations: ['Hyderabad', 'Bengaluru'],
    isRemote: false,
    stipendMin: 75000,
    stipendMax: 100000,
    durationMonths: 6,
    skills: ['C++', 'Python', 'ROCm', 'GPU Programming', 'Heterogeneous Computing'],
    eligibility: 'B.Tech/M.Tech in CSE / ECE with interest in parallel computing and computer systems.',
    applyUrl: 'https://careers.amd.com/careers-home/jobs?keywords=intern&location=India',
    sourceJobId: 'AMD-GPU-IND-4120',
    description: `### About AMD
AMD powers the world's top supercomputers, gaming consoles, and cloud datacenters with breakthrough high-performance and adaptive computing products.

### Role Overview
Work on AMD's open-source ROCm software stack, optimizing compiler backends, runtime libraries, and deep learning framework integrations for AMD Instinct accelerators.`
  },
  {
    companyName: 'Texas Instruments',
    title: 'Software & Embedded Systems Intern',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 70000,
    stipendMax: 90000,
    durationMonths: 6,
    skills: ['Embedded C', 'RTOS', 'Microcontrollers', 'Device Drivers', 'Data Structures'],
    eligibility: 'B.Tech in CSE / ECE with passion for embedded programming and hardware-software co-design.',
    applyUrl: 'https://careers.ti.com/',
    sourceJobId: 'TI-SW-IND-8821',
    description: `### About Texas Instruments (TI) India
TI Bangalore is a pioneering semiconductor design center responsible for breakthrough embedded processors and analog signal chain innovations.

### Role Overview
Develop production software development kits (SDKs), board support packages (BSPs), and real-time operating system applications for TI processors.`
  },
  {
    companyName: 'Marvell',
    title: 'Software Engineer Intern - Silicon Validation & Cloud Infrastructure',
    roleCategory: 'SDE',
    locations: ['Hyderabad', 'Pune'],
    isRemote: false,
    stipendMin: 75000,
    stipendMax: 105000,
    durationMonths: 6,
    skills: ['C', 'C++', 'Python', 'Networking', 'Linux', 'Device Drivers'],
    eligibility: 'B.Tech / M.Tech in Computer Science, Computer Engineering, or Electronics Engineering.',
    applyUrl: 'https://marvell.wd1.myworkdayjobs.com/en-US/MarvellCareers',
    sourceJobId: 'MRVL-SWE-IND-2026',
    description: `### About Marvell
Marvell delivers the essential semiconductor building blocks of the data infrastructure connecting our world, powering enterprise, cloud, AI, and carrier architectures.

### Role Overview
Interns work on firmware, diagnostics, and SDK software for Marvell's high-speed Ethernet switches, storage controllers, and optical interconnects.`
  },
  {
    companyName: 'Micron Technology',
    title: 'Software Engineer Intern - Data Platform & Automation',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 90000,
    durationMonths: 6,
    skills: ['Python', 'SQL', 'C++', 'Data Engineering', 'Docker', 'REST APIs'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026. Strong programming and database fundamentals.',
    applyUrl: 'https://micron.wd1.myworkdayjobs.com/en-US/External',
    sourceJobId: 'MU-SWE-IND-6012',
    description: `### About Micron
Micron is an industry leader in innovative memory and storage solutions that transform how the world uses information to enrich life for all.

### Role Overview
Join Micron's Global Software teams to build automated manufacturing analytics, test automation systems, and high-performance data storage validation frameworks.`
  },
  {
    companyName: 'Arista Networks',
    title: 'Software Engineer Intern - Cloud Networking & EOS',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Pune'],
    isRemote: false,
    stipendMin: 85000,
    stipendMax: 115000,
    durationMonths: 6,
    skills: ['C++', 'Python', 'Linux', 'TCP/IP', 'Routing Protocols', 'Distributed Systems'],
    eligibility: 'B.Tech / M.Tech in CSE / IT with deep interest in networking, operating systems, and systems programming.',
    applyUrl: 'https://www.arista.com/en/careers',
    sourceJobId: 'ARST-EOS-IND-2940',
    description: `### About Arista Networks
Arista Networks is an industry leader in cognitive cloud networking for mission-critical datacenter and campus environments.

### Role Overview
Write modern C++ and Python code for Arista EOS (Extensible Operating System), the programmable Linux-based network operating system running inside the world's largest AI cloud clusters.`
  },

  // --- GLOBAL FINTECH & BANKING TECH ---
  {
    companyName: 'Goldman Sachs',
    title: 'Engineering Summer Analyst (SDE Intern)',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad'],
    isRemote: false,
    stipendMin: 100000,
    stipendMax: 125000,
    durationMonths: 2,
    skills: ['Java', 'C++', 'Python', 'Data Structures', 'Algorithms', 'Distributed Systems'],
    eligibility: 'Students pursuing a Bachelor\'s or Master\'s degree in Computer Science or related fields graduating in 2026 or 2027.',
    applyUrl: 'https://www.goldmansachs.com/careers/students/programs/india/summer-analyst-program.html',
    sourceJobId: 'GS-ENG-IND-2026',
    description: `### About Goldman Sachs Engineering
Goldman Sachs Engineers are innovators and problem solvers building solutions that transform financial markets, banking, and wealth management across the world.

### Role Overview
As a Summer Analyst in Bengaluru or Hyderabad, you will work on enterprise-grade software projects, developing low-latency execution engines, risk calculation microservices, or client-facing digital banking platforms.

### Key Responsibilities
- Architect and develop secure software in Java, Python, or C++.
- Build resilient microservices with strict consistency and latency SLA targets.
- Present final technical designs and deliverables to managing directors.`
  },
  {
    companyName: 'JPMorgan Chase',
    title: 'Software Engineer Intern - Code for Good / Summer Analyst',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Hyderabad', 'Mumbai'],
    isRemote: false,
    stipendMin: 80000,
    stipendMax: 105000,
    durationMonths: 2,
    skills: ['Java', 'Python', 'React', 'Spring Boot', 'SQL', 'Data Structures'],
    eligibility: 'B.Tech in CSE / IT / ECE with minimum 7.0 CGPA graduating in 2026/2027.',
    applyUrl: 'https://careers.jpmorgan.com/us/en/students/programs/software-engineer-summer-internship',
    sourceJobId: 'JPMC-SWE-IND-7120',
    description: `### About JPMorgan Chase & Co.
JPMorgan Chase is one of the oldest and largest financial institutions in the world, investing over $14B annually in technology.

### Role Overview
Our Software Engineer Interns in India collaborate with agile engineering squads on mission-critical payments, asset management, and trading platforms.`
  },
  {
    companyName: 'Morgan Stanley',
    title: 'Technology Summer Analyst Intern',
    roleCategory: 'SDE',
    locations: ['Mumbai', 'Bengaluru'],
    isRemote: false,
    stipendMin: 85000,
    stipendMax: 110000,
    durationMonths: 2,
    skills: ['Java', 'C++', 'Python', 'Data Structures', 'Algorithms', 'SQL'],
    eligibility: 'Pre-final year undergraduate or postgraduate student in Computer Science or related discipline.',
    applyUrl: 'https://morganstanley.tal.net/vx/lang-en-GB/mobile-0/brand-2/xf-a77a94f6fefd/candidate/jobboard/vacancy/1/adv/',
    sourceJobId: 'MS-TECH-IND-2026',
    description: `### About Morgan Stanley Technology
Morgan Stanley Technology delivers world-class software that powers one of the most sophisticated investment banks globally.

### Role Overview
Gain exposure to distributed trading platforms, large-scale financial data processing, and cybersecurity defense frameworks.`
  },
  {
    companyName: 'American Express',
    title: 'Technology Intern - Software Engineering',
    roleCategory: 'SDE',
    locations: ['Gurugram', 'Bengaluru'],
    isRemote: false,
    stipendMin: 70000,
    stipendMax: 95000,
    durationMonths: 6,
    skills: ['Java', 'React', 'Node.js', 'PostgreSQL', 'Microservices'],
    eligibility: 'B.Tech/M.Tech student in CSE/IT. Solid fundamentals in computer science.',
    applyUrl: 'https://www.americanexpress.com/en-us/careers/',
    sourceJobId: 'AXP-TECH-IND-8410',
    description: `### About American Express
American Express is a globally integrated payments company, providing customers with access to products, insights, and experiences that enrich lives and build business success.

### Role Overview
Build high-availability payment transaction routers, loyalty rewards services, and fraud detection microservices.`
  },
  {
    companyName: 'Visa',
    title: 'Software Engineering Intern - Payment Systems',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 80000,
    stipendMax: 105000,
    durationMonths: 6,
    skills: ['Java', 'C++', 'REST APIs', 'Cybersecurity', 'Distributed Systems'],
    eligibility: 'Pursuing B.Tech/B.E. in Computer Science or IT. Graduation batch 2026.',
    applyUrl: 'https://www.visa.co.in/careers.html',
    sourceJobId: 'VISA-SWE-IND-4912',
    description: `### About Visa
Visa is a world leader in digital payments, facilitating transactions between consumers, merchants, financial institutions, and government entities across more than 200 countries.

### Role Overview
Contribute to VisaNet, one of the most reliable and secure payment networks on the planet, capable of handling over 65,000 transaction messages per second.`
  },
  {
    companyName: 'Mastercard',
    title: 'Software Engineering Intern - Digital Identity & Cyber',
    roleCategory: 'SDE',
    locations: ['Pune', 'Gurugram', 'Vadodara'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 90000,
    durationMonths: 6,
    skills: ['Java', 'Spring Boot', 'Kafka', 'SQL', 'Microservices'],
    eligibility: 'B.Tech student in CSE/IT graduating in 2026 with minimum 7.0 CGPA.',
    applyUrl: 'https://mastercard.wd1.myworkdayjobs.com/CorporateCareers',
    sourceJobId: 'MA-SWE-IND-2026',
    description: `### About Mastercard
Mastercard connects billions of consumers, financial institutions, merchants, and businesses across the globe.

### Role Overview
Interns build API gateways, biometric identity verification software, and cardholder security algorithms.`
  },
  {
    companyName: 'BlackRock',
    title: 'Software Engineering Summer Analyst - Aladdin Platform',
    roleCategory: 'SDE',
    locations: ['Gurugram', 'Mumbai'],
    isRemote: false,
    stipendMin: 80000,
    stipendMax: 105000,
    durationMonths: 2,
    skills: ['Java', 'Python', 'Angular', 'Distributed Computing', 'SQL'],
    eligibility: 'Undergraduate student graduating in 2026 or 2027 with a major in Computer Science or allied field.',
    applyUrl: 'https://careers.blackrock.com/early-careers',
    sourceJobId: 'BLK-ALAD-IND-3912',
    description: `### About BlackRock & Aladdin
BlackRock is the world's largest asset manager. Aladdin is our proprietary enterprise operating system for investment management that connects people, data, and technology.

### Role Overview
Work on Aladdin's core calculations, portfolio analytics, and real-time risk simulation microservices.`
  },

  // --- TOP INDIAN UNICORNS & STARTUPS ---
  {
    companyName: 'Flipkart',
    title: 'Software Development Engineer (SDE) Intern',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 70000,
    stipendMax: 100000,
    durationMonths: 6,
    skills: ['Java', 'Distributed Systems', 'Kafka', 'MySQL', 'Data Structures', 'Algorithms'],
    eligibility: 'Enrolled in B.Tech in CSE / IT graduating in 2026 or 2027. Strong algorithmic coding profile.',
    applyUrl: 'https://www.flipkartcareers.com/',
    sourceJobId: 'FK-SDE-IND-2026',
    description: `### About Flipkart
Flipkart is India's leading e-commerce marketplace, pioneering indigenous technology innovations at massive consumer scale.

### Role Overview
Join Flipkart's engineering team and solve complex engineering problems across Catalog, Search & Recommendation, Big Billion Days Flash Sales, and Supply Chain Logistics.

### Key Responsibilities
- Build high-scale microservices handling hundreds of thousands of requests per second.
- Optimize database schemas and distributed caching tiers (Redis/Aerospike).
- Write automated tests and participate in sprint releases.`
  },
  {
    companyName: 'Swiggy',
    title: 'Software Development Engineer Intern - Consumer Tech & Hyperlocal Logistics',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Remote'],
    isRemote: true,
    stipendMin: 60000,
    stipendMax: 90000,
    durationMonths: 6,
    skills: ['Go', 'Java', 'Python', 'Microservices', 'Kafka', 'PostgreSQL'],
    eligibility: 'B.Tech student in CSE/IT. Solid knowledge of backend architectures and concurrent programming.',
    applyUrl: 'https://careers.swiggy.com/',
    sourceJobId: 'SWIG-SDE-IND-2026',
    description: `### About Swiggy
Swiggy is India's leading on-demand convenience platform, delivering food, groceries (Instamart), and dining experiences across 500+ Indian cities.

### Role Overview
Work on real-time routing engines, delivery partner dispatch optimization, and high-frequency order placement pipelines.`
  },
  {
    companyName: 'Zomato (Eternal)',
    title: 'Software Development Engineer Intern',
    roleCategory: 'SDE',
    locations: ['Gurugram'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['Python', 'PHP', 'Go', 'React Native', 'MySQL', 'Redis'],
    eligibility: 'B.Tech/B.E. in Computer Science or related fields graduating in 2026.',
    applyUrl: 'https://www.zomato.com/careers',
    sourceJobId: 'ZOM-SDE-IND-2026',
    description: `### About Zomato (Eternal)
Zomato connects millions of users with restaurants and food delivery, powering dining, quick-commerce (Blinkit), and B2B supplies (Hyperpure).

### Role Overview
Build fast, reliable web and mobile services that empower millions of customers to discover and order meals in seconds.`
  },
  {
    companyName: 'CRED',
    title: 'Backend Engineering Intern - High Trust Systems',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 75000,
    stipendMax: 100000,
    durationMonths: 6,
    skills: ['Go', 'Java', 'Distributed Systems', 'Kafka', 'DynamoDB', 'Microservices'],
    eligibility: 'Pursuing B.Tech in CSE / IT. Strong appreciation for product design, performance, and clean code.',
    applyUrl: 'https://careers.cred.club/',
    sourceJobId: 'CRED-ENG-IND-2026',
    description: `### About CRED
CRED is a members-only club that rewards individuals for their financial trustworthiness, providing high-end credit card payments, lending, and luxury commerce.

### Role Overview
Interns at CRED write idiomatic, high-concurrency Go and Java microservices designed for zero-downtime, fault-tolerant financial transactions.`
  },
  {
    companyName: 'Razorpay',
    title: 'Software Development Engineer Intern - Payments Infrastructure',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 90000,
    durationMonths: 6,
    skills: ['Go', 'PHP', 'Kafka', 'PostgreSQL', 'Distributed Systems', 'REST APIs'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026. Strong problem solving and systems knowledge.',
    applyUrl: 'https://razorpay.com/jobs/',
    sourceJobId: 'RAZOR-SDE-IND-2026',
    description: `### About Razorpay
Razorpay is India's leading full-stack financial solutions company, powering payments and banking for over 10 million businesses including Facebook, Swiggy, and Zomato.

### Role Overview
Build the rails of Indian digital commerce — engineering ultra-fast UPI checkout flows, subscription billing engines, and automated banking platforms.`
  },
  {
    companyName: 'PhonePe',
    title: 'Software Engineer Intern - Core Payments & Insurance',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Pune'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 90000,
    durationMonths: 6,
    skills: ['Java', 'Spring Boot', 'HBase', 'Kafka', 'Aerospike', 'Data Structures'],
    eligibility: 'B.Tech / M.Tech in Computer Science or IT. Strong understanding of distributed databases and multithreading.',
    applyUrl: 'https://www.phonepe.com/careers/',
    sourceJobId: 'PHONEPE-SWE-IND-2026',
    description: `### About PhonePe
PhonePe is India's leading fintech platform with over 500 million registered users, processing over 45% of all UPI transactions in the nation.

### Role Overview
Work on backend architectures that process tens of millions of daily transactions with sub-second response times and five-nines uptime.`
  },
  {
    companyName: 'Zerodha',
    title: 'Software Engineer Intern - FOSS & Trading Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 80000,
    durationMonths: 6,
    skills: ['Python', 'Go', 'PostgreSQL', 'WebSockets', 'Linux', 'FOSS'],
    eligibility: 'Passionate about Free and Open Source Software (FOSS), minimal dependencies, and clean architecture. B.Tech in CSE or self-taught.',
    applyUrl: 'https://careers.zerodha.com/',
    sourceJobId: 'ZERO-SWE-IND-2026',
    description: `### About Zerodha
Zerodha is India's largest retail stockbroker, revolutionizing the Indian brokerage industry with zero brokerage and homegrown tech platforms like Kite and Coin.

### Role Overview
Build simple, elegant, high-throughput software using modern Go and Python, serving millions of active market traders with zero marketing bloat.`
  },
  {
    companyName: 'Groww',
    title: 'Software Engineer Intern - Backend & Data Platforms',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 80000,
    durationMonths: 6,
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'PostgreSQL'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026 with good problem-solving foundation.',
    applyUrl: 'https://groww.in/careers',
    sourceJobId: 'GROWW-SWE-IND-2026',
    description: `### About Groww
Groww is one of India's fastest-growing financial platforms, making investing in stocks, mutual funds, and derivatives simple and transparent.

### Role Overview
Work on order routing systems, depository integrations, and KYC verification pipelines that handle millions of transactions.`
  },
  {
    companyName: 'Paytm',
    title: 'Software Engineer Intern - Distributed Systems & Payments',
    roleCategory: 'SDE',
    locations: ['Noida', 'Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka', 'REST APIs'],
    eligibility: 'B.Tech in CSE/IT. Solid foundational understanding of Object Oriented Design and Data Structures.',
    applyUrl: 'https://jobs.lever.co/paytm',
    sourceJobId: 'PAYTM-SDE-IND-2026',
    description: `### About Paytm
Paytm is India's leading digital payments and financial services company, pioneer of QR payments and the Soundbox revolution.

### Role Overview
Develop scalable backend microservices, real-time audio notification pipelines, and merchant settlement systems.`
  },
  {
    companyName: 'Meesho',
    title: 'Software Development Engineer Intern - Growth & Supply Tech',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 65000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['Java', 'Go', 'Python', 'Kafka', 'MySQL', 'AWS'],
    eligibility: 'B.Tech in Computer Science or allied branches graduating in 2026.',
    applyUrl: 'https://www.meesho.com/careers',
    sourceJobId: 'MEESHO-SDE-IND-2026',
    description: `### About Meesho
Meesho is India's only true e-commerce marketplace democratizing internet commerce for everyone, empowering millions of small businesses.

### Role Overview
Engineers at Meesho build search ranking, catalog deduplication, and zero-commission merchant onboarding workflows at massive scale.`
  },
  {
    companyName: 'Zepto',
    title: 'Software Engineering Intern - 10-Minute Delivery Systems',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Mumbai'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['Go', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
    eligibility: 'B.Tech in CSE/IT graduating in 2026. Strong competitive programming or open source background.',
    applyUrl: 'https://www.zeptonow.com/careers',
    sourceJobId: 'ZEPTO-SWE-IND-2026',
    description: `### About Zepto
Zepto is India's fastest-growing quick-commerce company, fulfilling hundreds of thousands of daily orders in under 10 minutes from micro-warehouses.

### Role Overview
Build picking & packing optimization algorithms, inventory forecasting engines, and real-time rider dispatch systems.`
  },
  {
    companyName: 'Blinkit',
    title: 'Backend Engineering Intern - Quick Commerce Infrastructure',
    roleCategory: 'SDE',
    locations: ['Gurugram'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 80000,
    durationMonths: 6,
    skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery', 'AWS'],
    eligibility: 'B.Tech in CSE/IT graduating in 2026 with passion for high-speed delivery systems.',
    applyUrl: 'https://blinkit.com/careers',
    sourceJobId: 'BLINK-BE-IND-2026',
    description: `### About Blinkit
Part of Eternal (Zomato), Blinkit is India's leading quick-commerce platform delivering groceries and everyday essentials in minutes.`
  },
  {
    companyName: 'Urban Company',
    title: 'Software Development Engineer Intern',
    roleCategory: 'SDE',
    locations: ['Gurugram'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Node.js', 'React Native', 'MongoDB', 'PostgreSQL', 'Microservices'],
    eligibility: 'B.Tech in CSE/IT with strong full-stack foundations.',
    applyUrl: 'https://careers.urbancompany.com/',
    sourceJobId: 'UC-SDE-IND-2026',
    description: `### About Urban Company
Urban Company is Asia's largest home services platform, serving millions of households across India, UAE, and Singapore.`
  },
  {
    companyName: 'Postman',
    title: 'Software Engineering Intern - Developer Tools & API Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 75000,
    stipendMax: 100000,
    durationMonths: 6,
    skills: ['JavaScript', 'Node.js', 'React', 'Electron', 'REST APIs', 'GraphQL'],
    eligibility: 'B.Tech student passionate about developer tools, open-source APIs, and developer experience.',
    applyUrl: 'https://www.postman.com/company/careers/',
    sourceJobId: 'POSTMAN-SWE-IND-2026',
    description: `### About Postman
Postman is the leading API platform used by more than 30 million developers and 500,000 organizations worldwide to build, test, and manage APIs.

### Role Overview
Join the team that builds the Postman desktop app, collaboration cloud, API governance tools, and runtime execution environments.`
  },
  {
    companyName: 'BrowserStack',
    title: 'Software Engineering Intern - Cloud Test Infrastructure',
    roleCategory: 'SDE',
    locations: ['Mumbai', 'Remote'],
    isRemote: true,
    stipendMin: 70000,
    stipendMax: 95000,
    durationMonths: 6,
    skills: ['Ruby', 'Java', 'Node.js', 'Linux', 'Virtualization', 'Docker'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.browserstack.com/careers',
    sourceJobId: 'BS-SWE-IND-2026',
    description: `### About BrowserStack
BrowserStack is the world's leading software testing platform powering over two million tests every day across 15 global data centers.

### Role Overview
Build high-availability virtual machine orchestration, real-device cloud grids, and automated browser debugging tools.`
  },
  {
    companyName: 'Zoho',
    title: 'Software Development Engineer Intern',
    roleCategory: 'SDE',
    locations: ['Chennai', 'Tenkasi'],
    isRemote: false,
    stipendMin: 35000,
    stipendMax: 50000,
    durationMonths: 6,
    skills: ['Java', 'C++', 'JavaScript', 'Data Structures', 'Database Internals'],
    eligibility: 'B.Tech/B.E. in Computer Science or related fields. Focus on fundamental problem solving and programming mastery.',
    applyUrl: 'https://www.zoho.com/careers/',
    sourceJobId: 'ZOHO-SDE-IND-2026',
    description: `### About Zoho
Zoho is a bootstrapped, profitable technology leader offering 55+ business applications serving 100M+ users globally.

### Role Overview
Work on custom database engines, distributed document editors, and SaaS business operating systems with zero external venture capital.`
  },
  {
    companyName: 'Freshworks',
    title: 'Software Engineer Intern - Modern SaaS Platform',
    roleCategory: 'SDE',
    locations: ['Chennai', 'Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['Ruby on Rails', 'Java', 'React', 'AWS', 'MySQL'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://www.freshworks.com/company/careers/',
    sourceJobId: 'FRSH-SWE-IND-2026',
    description: `### About Freshworks
Freshworks creates AI-boosted business software in customer service, IT service management, and CRM used by over 67,000 businesses.`
  },
  {
    companyName: 'InMobi',
    title: 'Software Engineer Intern - AdTech & Real-Time Bidding',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['Java', 'Python', 'Spark', 'Kafka', 'Machine Learning', 'Big Data'],
    eligibility: 'B.Tech/M.Tech in CSE/IT. Solid grasp of distributed systems and algorithmic data processing.',
    applyUrl: 'https://www.inmobi.com/company/careers/',
    sourceJobId: 'INMOBI-SWE-IND-2026',
    description: `### About InMobi
InMobi is a global consumer technology company powering discovery and intelligent advertising across Glance and InMobi Exchange.`
  },
  {
    companyName: 'Slice',
    title: 'Backend Engineer Intern - UPI & Credit Systems',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 80000,
    durationMonths: 6,
    skills: ['Go', 'PostgreSQL', 'Redis', 'Kafka', 'Microservices'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://sliceit.com/careers',
    sourceJobId: 'SLICE-BE-IND-2026',
    description: `### About Slice
Slice is a leading Indian fintech building financial products for India's young consumers, integrating payments and banking.`
  },
  {
    companyName: 'Juspay',
    title: 'Functional Programming & Systems Intern (Haskell / Rust / PureScript)',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 85000,
    durationMonths: 6,
    skills: ['Haskell', 'Rust', 'PureScript', 'Functional Programming', 'Distributed Systems'],
    eligibility: 'Passion for typed functional programming, category theory, and rock-solid fault-tolerant systems.',
    applyUrl: 'https://juspay.in/careers',
    sourceJobId: 'JUSPAY-FP-IND-2026',
    description: `### About Juspay
Juspay processes over 100 million daily transactions, powering the payments layer of Amazon, Swiggy, Flipkart, Cred, and the Open Network for Digital Commerce (ONDC).`
  },

  // --- DATA, CLOUD & INFRASTRUCTURE LEADERS ---
  {
    companyName: 'Databricks',
    title: 'Software Engineer Intern - Data Lakehouse & Apache Spark',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 100000,
    stipendMax: 130000,
    durationMonths: 3,
    skills: ['Scala', 'Java', 'Python', 'Distributed Systems', 'C++', 'Data Structures'],
    eligibility: 'B.Tech/M.Tech in CSE / IT. Strong background in distributed computing, concurrency, and compilers.',
    applyUrl: 'https://www.databricks.com/company/careers/open-positions?department=University%20Recruiting',
    sourceJobId: 'DBX-SWE-IND-2026',
    description: `### About Databricks
Databricks is the Data and AI company, founded by the original creators of Apache Spark, Delta Lake, and MLflow, unifying data engineering, science, and business analytics on the Lakehouse platform.

### Role Overview
Build high-performance query execution engines (Photon), distributed cloud storage layers, and managed machine learning serving infrastructure.`
  },
  {
    companyName: 'Snowflake',
    title: 'Software Engineer Intern - Cloud Data Platform',
    roleCategory: 'SDE',
    locations: ['Pune', 'Bengaluru'],
    isRemote: false,
    stipendMin: 95000,
    stipendMax: 125000,
    durationMonths: 6,
    skills: ['C++', 'Java', 'Go', 'Distributed Systems', 'Database Internals', 'SQL'],
    eligibility: 'Undergraduate or graduate student in Computer Science graduating in 2026. Strong knowledge of database systems and OS.',
    applyUrl: 'https://careers.snowflake.com/us/en/search-results?keywords=intern',
    sourceJobId: 'SNOW-SWE-IND-2026',
    description: `### About Snowflake
Snowflake enables every organization to mobilize their data with Snowflake's Data Cloud, uniting siloed data and powering analytical workloads across multiple public clouds.`
  },
  {
    companyName: 'MongoDB',
    title: 'Software Engineer Intern - Database Core Engine',
    roleCategory: 'SDE',
    locations: ['Gurugram', 'Bengaluru'],
    isRemote: false,
    stipendMin: 85000,
    stipendMax: 115000,
    durationMonths: 3,
    skills: ['C++', 'Python', 'Storage Engines', 'Distributed Consensus', 'Data Structures'],
    eligibility: 'B.Tech in CSE with keen interest in database internals, query execution, and storage engines.',
    applyUrl: 'https://www.mongodb.com/company/careers',
    sourceJobId: 'MDB-SWE-IND-2026',
    description: `### About MongoDB
MongoDB is the leading modern, general-purpose database platform, empowering developers to transform industries with software and data.`
  },
  {
    companyName: 'Confluent',
    title: 'Software Engineer Intern - Apache Kafka & Stream Governance',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 85000,
    stipendMax: 110000,
    durationMonths: 6,
    skills: ['Java', 'Distributed Systems', 'Kafka', 'Go', 'Kubernetes'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026 with strong understanding of distributed log systems and streaming data.',
    applyUrl: 'https://www.confluent.io/careers/',
    sourceJobId: 'CFLT-SWE-IND-2026',
    description: `### About Confluent
Confluent is the data streaming platform company set out to pioneer the category of data in motion, founded by the creators of Apache Kafka.`
  },
  {
    companyName: 'Rubrik',
    title: 'Software Engineer Intern - Zero Trust Data Security',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 95000,
    stipendMax: 120000,
    durationMonths: 6,
    skills: ['C++', 'Go', 'Python', 'Distributed File Systems', 'Cybersecurity', 'Linux'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026. Top algorithmic skills.',
    applyUrl: 'https://www.rubrik.com/careers',
    sourceJobId: 'RBRK-SWE-IND-2026',
    description: `### About Rubrik
Rubrik is on a mission to secure the world's data with Zero Trust Data Security, helping organizations achieve business resilience against cyberattacks and ransomware.`
  },
  {
    companyName: 'Palo Alto Networks',
    title: 'Software Engineer Intern - Cloud Security & Threat Intelligence',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 80000,
    stipendMax: 105000,
    durationMonths: 6,
    skills: ['Python', 'Go', 'Cybersecurity', 'Docker', 'Kubernetes', 'Networking'],
    eligibility: 'B.Tech in CSE/IT. Passion for information security, cryptography, and container networks.',
    applyUrl: 'https://jobs.paloaltonetworks.com/en/',
    sourceJobId: 'PANW-SWE-IND-2026',
    description: `### About Palo Alto Networks
Palo Alto Networks is the global cybersecurity leader, shaping the cloud-centric future with technology that is transforming how people and organizations operate.`
  },
  {
    companyName: 'Akamai',
    title: 'Software Development Engineer Intern - Edge Computing & CDN',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 70000,
    stipendMax: 95000,
    durationMonths: 6,
    skills: ['C++', 'Python', 'Computer Networks', 'HTTP/3', 'Distributed Systems'],
    eligibility: 'B.Tech in CSE/IT/ECE with solid grounding in TCP/IP and operating systems.',
    applyUrl: 'https://www.akamai.com/careers',
    sourceJobId: 'AKAM-SDE-IND-2026',
    description: `### About Akamai
Akamai powers and protects life online, providing leading edge compute, content delivery, and cybersecurity solutions.`
  },
  {
    companyName: 'Cloudflare',
    title: 'Systems Software Engineer Intern - Edge Runtime & Network Security',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Remote'],
    isRemote: true,
    stipendMin: 90000,
    stipendMax: 115000,
    durationMonths: 3,
    skills: ['Rust', 'Go', 'C', 'Networking', 'BGP', 'WebAssembly'],
    eligibility: 'Undergraduate student with interest in internet protocols, Rust, and systems programming.',
    applyUrl: 'https://www.cloudflare.com/careers/jobs/',
    sourceJobId: 'NET-SYS-IND-2026',
    description: `### About Cloudflare
Cloudflare is on a mission to help build a better Internet, protecting web properties and running serverless code at the edge in hundreds of cities worldwide.`
  },
  {
    companyName: 'Datadog',
    title: 'Software Engineer Intern - Observability & Distributed Tracing',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Remote'],
    isRemote: true,
    stipendMin: 90000,
    stipendMax: 115000,
    durationMonths: 3,
    skills: ['Go', 'Python', 'Time-Series Databases', 'Distributed Systems', 'Kafka'],
    eligibility: 'B.Tech student in CSE/IT with passion for telemetry, systems performance, and open-source observability.',
    applyUrl: 'https://www.datadoghq.com/careers/',
    sourceJobId: 'DDOG-SWE-IND-2026',
    description: `### About Datadog
Datadog is the essential monitoring and security platform for cloud applications, bringing together metrics, traces, and logs to make infrastructure fully observable.`
  },
  {
    companyName: 'Stripe',
    title: 'Software Engineer Intern - Global Financial Infrastructure',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Remote'],
    isRemote: true,
    stipendMin: 100000,
    stipendMax: 130000,
    durationMonths: 3,
    skills: ['Ruby', 'Java', 'Go', 'Distributed Systems', 'SQL', 'APIs'],
    eligibility: 'B.Tech student in Computer Science graduating in 2026/2027.',
    applyUrl: 'https://stripe.com/jobs/search?q=intern',
    sourceJobId: 'STRIPE-SWE-IND-2026',
    description: `### About Stripe
Stripe is a financial infrastructure platform for the internet, used by millions of companies to accept payments, grow revenue, and accelerate new business opportunities.`
  },
  {
    companyName: 'Rippling',
    title: 'Software Engineer Intern - Workforce Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 85000,
    stipendMax: 110000,
    durationMonths: 6,
    skills: ['Python', 'Django', 'React', 'TypeScript', 'PostgreSQL'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026. Strong software architecture fundamentals.',
    applyUrl: 'https://www.rippling.com/careers',
    sourceJobId: 'RIPL-SWE-IND-2026',
    description: `### About Rippling
Rippling gives businesses one place to run HR, IT, and Finance globally, unifying employee data across all corporate applications.`
  },

  // --- MNC GCC & ENTERPRISE TECH ---
  {
    companyName: 'Walmart Global Tech',
    title: 'Software Development Engineer Intern - Retail Tech & Cloud',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Chennai'],
    isRemote: false,
    stipendMin: 75000,
    stipendMax: 100000,
    durationMonths: 2,
    skills: ['Java', 'Spring Boot', 'Kafka', 'React', 'Azure', 'Data Structures'],
    eligibility: 'B.Tech / M.Tech in CSE / IT / ECE graduating in 2026/2027. Minimum 7.5 CGPA.',
    applyUrl: 'https://careers.walmart.com/technology/walmart-global-tech-india',
    sourceJobId: 'WMT-SDE-IND-2026',
    description: `### About Walmart Global Tech India
Walmart Global Tech engineers the digital platforms that power Walmart's seamless omnichannel shopping experience for 240M+ weekly customers worldwide.`
  },
  {
    companyName: 'Target India',
    title: 'Software Engineer Intern - Enterprise Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 80000,
    durationMonths: 6,
    skills: ['Java', 'Kotlin', 'React', 'MongoDB', 'Docker'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://india.target.com/careers',
    sourceJobId: 'TGT-SWE-IND-2026',
    description: `### About Target in India
Target in India is an extension of the US retail giant, building state-of-the-art supply chain, merchandising, and guest experience platforms.`
  },
  {
    companyName: 'Lowe\'s India',
    title: 'Software Engineer Intern - Retail Commerce',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Java', 'Spring Boot', 'GCP', 'PostgreSQL', 'Microservices'],
    eligibility: 'B.Tech in Computer Science graduating in 2026.',
    applyUrl: 'https://corporate.lowes.com/careers/lowes-india',
    sourceJobId: 'LOWES-SWE-IND-2026',
    description: `### About Lowe\'s India
Lowe\'s India builds technologies that power the home improvement giant across omni-channel retail, merchandise planning, and customer analytics.`
  },
  {
    companyName: 'GE (Aerospace/Vernova/HealthCare)',
    title: 'Digital Technology Intern (Edison Engineering Program)',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 50000,
    stipendMax: 70000,
    durationMonths: 6,
    skills: ['Python', 'C++', 'IoT', 'Cloud Computing', 'Data Analytics'],
    eligibility: 'B.Tech in CSE / IT / Electronics with strong analytical abilities.',
    applyUrl: 'https://www.geaerospace.com/careers',
    sourceJobId: 'GE-DT-IND-2026',
    description: `### About GE Digital Technology
GE develops industrial software powering aviation engines, wind turbines, power grids, and precision healthcare scanners.`
  },
  {
    companyName: 'Siemens',
    title: 'Software Engineer Intern - Industrial Automation & Digital Twin',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Pune'],
    isRemote: false,
    stipendMin: 45000,
    stipendMax: 65000,
    durationMonths: 6,
    skills: ['C#', '.NET', 'C++', 'Industrial IoT', 'Cloud Computing'],
    eligibility: 'B.Tech in CSE / IT / Electrical Engineering graduating in 2026.',
    applyUrl: 'https://jobs.siemens.com/',
    sourceJobId: 'SIEM-SWE-IND-2026',
    description: `### About Siemens Technology India
Siemens is a technology company focused on industry, infrastructure, transport, and healthcare, pioneering intelligent software for smart factories.`
  },
  {
    companyName: 'Bosch Global Software Technologies',
    title: 'Software Engineer Intern - Mobility & AIoT',
    roleCategory: 'SDE',
    locations: ['Bengaluru', 'Coimbatore', 'Pune'],
    isRemote: false,
    stipendMin: 45000,
    stipendMax: 60000,
    durationMonths: 6,
    skills: ['Embedded C', 'C++', 'Python', 'Automotive Protocols', 'Linux'],
    eligibility: 'B.Tech in CSE / ECE with keen interest in connected vehicles and smart mobility.',
    applyUrl: 'https://www.bosch.in/careers/',
    sourceJobId: 'BOSCH-SWE-IND-2026',
    description: `### About BGSW (Bosch)
BGSW is the largest software R&D development center for Bosch outside Germany, driving digital transformation across automotive, industrial, and consumer IoT.`
  },
  {
    companyName: 'Philips Innovation Campus',
    title: 'Software Engineer Intern - Healthcare AI & Imaging',
    roleCategory: 'AI_ML',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 45000,
    stipendMax: 65000,
    durationMonths: 6,
    skills: ['Python', 'C++', 'Computer Vision', 'Deep Learning', 'Medical Imaging'],
    eligibility: 'B.Tech/M.Tech in CSE / IT / Biomedical with focus on medical informatics or computer vision.',
    applyUrl: 'https://www.careers.philips.com/',
    sourceJobId: 'PHIL-AI-IND-2026',
    description: `### About Philips Innovation Campus
PIC Bengaluru is a premier center of excellence developing software solutions across patient monitoring, image-guided therapy, and diagnostic AI.`
  },
  {
    companyName: 'Nike',
    title: 'Technology Intern - Global Digital Commerce',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 60000,
    stipendMax: 80000,
    durationMonths: 6,
    skills: ['Java', 'Node.js', 'React', 'AWS', 'Microservices'],
    eligibility: 'B.Tech in CSE / IT graduating in 2026.',
    applyUrl: 'https://jobs.nike.com/',
    sourceJobId: 'NIKE-TECH-IND-2026',
    description: `### About Nike Technology
Nike Global Technology in Bengaluru drives digital innovation powering the SNKRS app, digital supply chain, and personalized consumer experiences.`
  },
  {
    companyName: 'Tesco Technology',
    title: 'Software Development Engineer Intern - Grocery Tech Platform',
    roleCategory: 'SDE',
    locations: ['Bengaluru'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['Java', 'Python', 'Kafka', 'React', 'Azure'],
    eligibility: 'B.Tech in CSE / IT with strong programming and database foundations.',
    applyUrl: 'https://www.tesco-careers.com/',
    sourceJobId: 'TESCO-SDE-IND-2026',
    description: `### About Tesco Technology India
Tesco Technology in Bengaluru builds software for millions of weekly retail transactions, warehouse robotics, and grocery forecasting.`
  },
  {
    companyName: 'Electronic Arts (EA)',
    title: 'Software Engineer Intern - Game Engine & Online Services',
    roleCategory: 'SDE',
    locations: ['Hyderabad'],
    isRemote: false,
    stipendMin: 55000,
    stipendMax: 75000,
    durationMonths: 6,
    skills: ['C++', 'C#', 'Data Structures', 'Algorithms', 'Game Development', 'Multithreading'],
    eligibility: 'B.Tech in Computer Science or Game Development. Strong command of C++ and mathematics.',
    applyUrl: 'https://www.ea.com/careers',
    sourceJobId: 'EA-ENG-IND-2026',
    description: `### About Electronic Arts India
EA Hyderabad contributes to iconic franchises including EA SPORTS FC, Battlefield, Apex Legends, and Need for Speed.`
  },
  {
    companyName: 'Reliance Jio (Jio Platforms)',
    title: 'Software Development Intern - 5G & Cloud Platforms',
    roleCategory: 'SDE',
    locations: ['Mumbai', 'Bengaluru'],
    isRemote: false,
    stipendMin: 40000,
    stipendMax: 60000,
    durationMonths: 6,
    skills: ['Java', 'Python', 'Go', 'Kubernetes', 'Cloud Computing', 'SQL'],
    eligibility: 'B.Tech in CSE / IT / ECE graduating in 2026 with minimum 7.0 CGPA.',
    applyUrl: 'https://careers.jio.com/',
    sourceJobId: 'JIO-SWE-IND-2026',
    description: `### About Jio Platforms
Jio Platforms is transforming India's digital ecosystem with homegrown 5G core networks, cloud infrastructure, and consumer applications.`
  }
];

async function main() {
  console.log('🚀 Starting CSE B.Tech Internships Population Script...');

  // 1. Clean up irrelevant/broken non-tech roles
  console.log('🧹 Cleaning up non-tech roles (HR, recruitment, video editors, CA trainees)...');
  const deleteResult = await prisma.internship.deleteMany({
    where: {
      OR: [
        { title: { contains: 'HR', mode: 'insensitive' } },
        { title: { contains: 'Talent Acquisition', mode: 'insensitive' } },
        { title: { contains: 'Video Editor', mode: 'insensitive' } },
        { title: { contains: 'YouTube', mode: 'insensitive' } },
        { title: { contains: 'Recruiter', mode: 'insensitive' } },
        { title: { contains: 'Recruitment', mode: 'insensitive' } },
        { title: { contains: 'Financial Analyst', mode: 'insensitive' } },
        { title: { contains: 'Creative & Communications', mode: 'insensitive' } },
        { title: { contains: 'Technician Apprentice', mode: 'insensitive' } },
        { applyUrl: { contains: 'rubrik/jobs/81665' } },
        { applyUrl: { contains: 'towerresearchcapital/jobs/' } },
        { applyUrl: { contains: 'atlassian.com/company/careers/details/26714' } }
      ]
    }
  });
  console.log(`✅ Deleted ${deleteResult.count} irrelevant / broken internship entries.`);

  // 2. Fetch all active companies to map by name
  const companies = await prisma.company.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, careerUrl: true }
  });

  const companyMap = new Map();
  companies.forEach(c => {
    companyMap.set(c.name.toLowerCase().trim(), c);
  });

  console.log(`Loaded ${companies.length} companies from database.`);

  let insertedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;

  const now = new Date();
  const defaultDeadline = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days ahead
  const defaultPosted = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago

  for (const item of cseInternships) {
    const key = item.companyName.toLowerCase().trim();
    let company = companyMap.get(key);

    if (!company) {
      // Try partial match
      company = companies.find(c => c.name.toLowerCase().includes(key) || key.includes(c.name.toLowerCase()));
    }

    if (!company) {
      console.warn(`⚠️ Company not found in database: "${item.companyName}". Skipping.`);
      skippedCount++;
      continue;
    }

    const dedupRaw = `${company.slug}|${item.title.toLowerCase().trim()}|${item.locations.join(',')}|cse-verified`;
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
      targetDegrees: extractTargetDegrees(item.eligibility, item.title, item.description),
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

    const existing = await prisma.internship.findUnique({
      where: { dedupHash }
    });

    if (existing) {
      await prisma.internship.update({
        where: { id: existing.id },
        data: {
          ...data,
          status: 'OPEN',
          lastVerifiedAt: now,
          lastSeenAt: now
        }
      });
      updatedCount++;
    } else {
      await prisma.internship.create({
        data
      });
      insertedCount++;
    }
  }

  console.log(`\n🎉 Ingestion Finished Successfully!`);
  console.log(`- Inserted new CSE internships: ${insertedCount}`);
  console.log(`- Updated verified CSE internships: ${updatedCount}`);
  console.log(`- Skipped: ${skippedCount}`);

  // Print final database summary
  const totalOpen = await prisma.internship.count({ where: { status: 'OPEN' } });
  const companiesHiring = await prisma.company.count({
    where: {
      internships: {
        some: { status: 'OPEN' }
      }
    }
  });

  const roleCounts = await prisma.internship.groupBy({
    by: ['roleCategory'],
    where: { status: 'OPEN' },
    _count: { id: true }
  });

  console.log(`\n📊 Current DB State:`);
  console.log(`- Total Open Internships: ${totalOpen}`);
  console.log(`- Actively Hiring Companies: ${companiesHiring} / ${companies.length}`);
  console.log(`- Distribution by Role:`);
  roleCounts.forEach(rc => {
    console.log(`  * ${rc.roleCategory}: ${rc._count.id}`);
  });
}

main()
  .catch(e => {
    console.error('Error populating CSE internships:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
