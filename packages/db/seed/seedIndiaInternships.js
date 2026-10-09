import { prisma } from '../index.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getExactJobIdAndUrl } from './jobRequisitionGenerator.js';
import { activelyHiringCompanies } from './activelyHiringCompanies.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateHash = (str) => crypto.createHash('sha256').update(str).digest('hex');

const directCareerUrls = {
  // Big Tech
  'Google': 'https://www.google.com/about/careers/applications/jobs/results/?q=intern&location=India',
  'Amazon': 'https://www.amazon.jobs/en/search?base_query=intern&loc_query=India',
  'Microsoft': 'https://jobs.careers.microsoft.com/global/en/search?q=intern&lc=India',
  'Meta': 'https://www.metacareers.com/jobs?q=intern&location=India',
  'Apple': 'https://jobs.apple.com/en-in/search?search=intern',
  'Netflix': 'https://jobs.netflix.com/search?q=intern',
  'Adobe': 'https://careers.adobe.com/us/en/search-results?keywords=intern&location=India',
  'Salesforce': 'https://careers.salesforce.com/en/jobs/?search=intern&country=India',
  'Oracle': 'https://careers.oracle.com/jobs/#en/sites/jobsearch/requisitions?keyword=intern&location=India',
  'IBM': 'https://www.ibm.com/careers/search?q=intern&location=India',
  'Cisco': 'https://jobs.cisco.com/jobs/SearchJobs/?21178=%5B169482%5D&21178_format=1477&listFilterMode=1',
  'Broadcom (VMware)': 'https://broadcom.wd1.myworkdayjobs.com/External_Career',
  'Uber': 'https://www.uber.com/in/en/careers/list/?location=IND--All',
  'ServiceNow': 'https://careers.servicenow.com/en/jobs/?search=intern&country=India',
  'Atlassian': 'https://www.atlassian.com/company/careers/all-jobs?team=&location=India&search=intern',
  'Intuit': 'https://jobs.intuit.com/search-jobs/intern/India/27595/1/1269750/20/77/50/2',
  'PayPal': 'https://careers.pypl.com/search-jobs?k=intern&c=India',
  'Nutanix': 'https://www.nutanix.com/company/careers/jobs?location=India',
  'Splunk': 'https://www.splunk.com/en_us/careers.html',
  'Twilio': 'https://www.twilio.com/en-us/company/jobs',
  'Autodesk': 'https://www.autodesk.com/careers/students-and-recent-grads',
  'Synopsys': 'https://www.synopsys.com/careers.html',
  'Cadence': 'https://cadence.wd1.myworkdayjobs.com/External_Careers',
  'ARM': 'https://careers.arm.com/search-jobs/India/intern',
  'NetApp': 'https://netapp.wd1.myworkdayjobs.com/Careers',
  'LinkedIn': 'https://www.linkedin.com/company/linkedin/jobs/',
  'SAP Labs India': 'https://jobs.sap.com/search/?q=intern&locationsearch=India',

  // Banking & Global Finance
  'Goldman Sachs': 'https://www.goldmansachs.com/careers/students/programs/',
  'JPMorgan Chase': 'https://careers.jpmorgan.com/global/en/students/programs',
  'Morgan Stanley': 'https://www.morganstanley.com/people-opportunities/students-graduates',
  'American Express': 'https://www.americanexpress.com/en-in/careers/students-and-graduates/',
  'Visa': 'https://corporate.visa.com/en/careers.html',
  'Mastercard': 'https://careers.mastercard.com/us/en/student-programs',
  'Barclays': 'https://home.barclays/careers/our-programmes/',
  'Deutsche Bank': 'https://careers.db.com/graduates/',
  'UBS': 'https://www.ubs.com/global/en/careers/students-and-graduates.html',
  'BlackRock': 'https://careers.blackrock.com/early-careers',
  'Wells Fargo': 'https://www.wellsfargojobs.com/en/university-programs/',
  'Citi': 'https://careers.citigroup.com/students-and-graduates/',
  'BNY Mellon': 'https://www.bnymellon.com/us/en/careers/students.html',

  // Indian Fintech & Startups
  'Razorpay': 'https://boards.greenhouse.io/razorpaysoftwareprivatelimited',
  'PhonePe': 'https://www.phonepe.com/careers/',
  'Paytm': 'https://paytm.com/careers',
  'CRED': 'https://careers.cred.club/',
  'Zerodha': 'https://careers.zerodha.com/',
  'Groww': 'https://groww.in/careers',
  'PolicyBazaar': 'https://www.policybazaar.com/careers/',
  'Acko': 'https://www.acko.com/careers/',
  'Angel One': 'https://www.angelone.in/careers',
  'Upstox': 'https://upstox.com/careers/',
  'CoinSwitch': 'https://coinswitch.co/careers/',
  'Juspay': 'https://juspay.in/careers',
  'PayU': 'https://corporate.payu.com/careers/',
  'Pine Labs': 'https://www.pinelabs.com/careers',
  'Cashfree Payments': 'https://www.cashfree.com/careers/',
  'BharatPe': 'https://bharatpe.com/careers',
  'Yubi': 'https://www.go-yubi.com/careers/',
  'Jupiter Money': 'https://jupiter.money/careers/',
  'Fi Money (epiFi)': 'https://fi.money/careers',
  'INDmoney': 'https://www.indmoney.com/careers',

  // Semiconductor & Hardware
  'Qualcomm': 'https://qualcomm.wd5.myworkdayjobs.com/External',
  'Nvidia': 'https://www.nvidia.com/en-in/about-nvidia/careers/university-recruiting/',
  'Intel': 'https://jobs.intel.com/en/search-jobs/India/intern',
  'AMD': 'https://careers.amd.com/careers-home/jobs?keyword=intern&location=India',
  'Texas Instruments': 'https://careers.ti.com/search-jobs/intern/India',
  'Samsung R&D Institute India': 'https://research.samsung.com/sri-b',
  'Micron Technology': 'https://micron.eightfold.ai/careers',
  'Western Digital': 'https://careers.westerndigital.com/',
  'Arista Networks': 'https://www.arista.com/en/careers',
  'Juniper Networks': 'https://www.juniper.net/us/en/company/careers.html',
  'Marvell': 'https://marvell.wd1.myworkdayjobs.com/External',
  'Analog Devices': 'https://analogdevices.wd1.myworkdayjobs.com/External',
  'MediaTek India': 'https://www.mediatek.com/about/careers',
  'Renesas Electronics': 'https://www.renesas.com/us/en/about/careers',
  'STMicroelectronics': 'https://stcareers.st.com/',
  'Siemens EDA': 'https://www.sw.siemens.com/en-US/careers/',

  // Indian E-Commerce, Consumer & Mobility
  'Flipkart': 'https://www.flipkartcareers.com/',
  'Myntra': 'https://careers.myntra.com/',
  'Swiggy': 'https://careers.swiggy.com/',
  'Zomato (Eternal)': 'https://www.zomato.com/careers',
  'Ola': 'https://www.olacabs.com/careers',
  'Rapido': 'https://www.rapido.bike/Careers',
  'Meesho': 'https://careers.meesho.com/',
  'Urban Company': 'https://www.urbancompany.com/careers',
  'Nykaa': 'https://www.nykaa.com/careers',
  'Lenskart': 'https://hiring.lenskart.com/',
  'MakeMyTrip': 'https://careers.makemytrip.com/',
  'Delhivery': 'https://www.delhivery.com/careers/',
  'Info Edge (Naukri.com)': 'https://www.infoedge.in/careers/',
  'CarDekho': 'https://www.cardekho.com/careers',
  'Cars24': 'https://www.cars24.com/careers/',
  'Zepto': 'https://www.zeptonow.com/careers',
  'BigBasket': 'https://www.bigbasket.com/careers/',
  'Ajio': 'https://www.ajio.com/careers',
  'Blinkit': 'https://blinkit.com/careers',
  'Reliance Retail': 'https://relianceretail.com/careers.html',
  'Reliance Jio (Jio Platforms)': 'https://careers.jio.com/',
  'Licious': 'https://www.licious.in/careers',
  'Urban Ladder': 'https://www.urbanladder.com/careers',
  'CommerceIQ': 'https://commerceiq.ai/careers/',
  'Purplle': 'https://purplle.com/careers',
  'Porter': 'https://porter.in/careers',
  'BlackBuck': 'https://www.blackbuck.com/careers',
  'Shiprocket': 'https://www.shiprocket.in/careers/',
  'Ninjacart': 'https://ninjacart.com/careers/',
  'DP World': 'https://www.dpworld.com/careers',
  'IndiaMART': 'https://corporate.indiamart.com/careers/',
  'Bizongo': 'https://www.bizongo.com/careers',
  'OYO': 'https://www.oyorooms.com/careers/',
  'LogiNext': 'https://loginextsolutions.com/careers',
  'Practo': 'https://www.practo.com/company/careers',
  'Tata 1mg': 'https://www.1mg.com/jobs',
  'PharmEasy': 'https://pharmeasy.in/careers',
  'MediBuddy': 'https://www.medibuddy.in/careers',
  'NoBroker': 'https://www.nobroker.in/careers',
  'OLX India': 'https://careers.olxgroup.com/',
  'ShareChat': 'https://sharechat.com/careers',
  'Times Internet': 'https://timesinternet.in/careers/',
  'Apna': 'https://apna.co/careers',
  'Ixigo': 'https://www.ixigo.com/careers',

  // Indian SaaS & Product Firms
  'Zoho': 'https://www.zohocorp.com/careers/',
  'Freshworks': 'https://careers.freshworks.com/',
  'Postman': 'https://www.postman.com/company/careers/',
  'BrowserStack': 'https://www.browserstack.com/careers',
  'Chargebee': 'https://www.chargebee.com/careers/',
  'Darwinbox': 'https://darwinbox.com/careers.html',
  'Innovaccer': 'https://innovaccer.com/careers',
  'Sprinklr': 'https://www.sprinklr.com/careers/',
  'InMobi': 'https://www.inmobi.com/company/careers/',
  'Whatfix': 'https://whatfix.com/careers/',
  'MindTickle': 'https://www.mindtickle.com/careers/',
  'Icertis': 'https://www.icertis.com/company/careers/',
  'Eightfold.ai': 'https://eightfold.ai/careers/',
  'Leena AI': 'https://leena.ai/careers',
  'Yellow.ai': 'https://yellow.ai/careers/',
  'Wingify (VWO)': 'https://wingify.com/careers/',
  'Rippling': 'https://www.rippling.com/careers',
  'Airbase': 'https://www.airbase.com/careers',
  'Avalara': 'https://www.avalara.com/us/en/about/careers.html',
  'Zeotap': 'https://zeotap.com/careers/',
  'MoEngage': 'https://www.moengage.com/careers/',
  'Netcore Cloud': 'https://netcorecloud.com/careers/',

  // MNC GCCs & Engineering Hubs in India
  'Walmart Global Tech': 'https://careers.walmart.com/technology/walmart-global-tech-india',
  'Target India': 'https://india.target.com/careers',
  'Lowe\'s India': 'https://corporate.lowes.com/careers/locations/india',
  'GE (Aerospace/Vernova/HealthCare)': 'https://jobs.gecareers.com/global/en',
  'Siemens': 'https://www.siemens.com/in/en/company/jobs.html',
  'Bosch Global Software Technologies': 'https://www.bosch.in/careers/',
  'Philips Innovation Campus': 'https://www.careers.philips.com/in/en',
  'John Deere India': 'https://www.deere.co.in/en/our-company/john-deere-careers/',
  'Honeywell Technology Solutions': 'https://careers.honeywell.com/us/en',
  'Nike': 'https://jobs.nike.com/search-jobs/India/intern',
  'Tesco Technology': 'https://www.tesco-careers.com/technology',
  'Airbus India': 'https://www.airbus.com/en/careers/students-and-graduates',
  'KLA Corporation': 'https://kla.wd1.myworkdayjobs.com/External',
  'Gartner': 'https://jobs.gartner.com/',
  'Elevance Health (formerly Anthem)': 'https://careers.elevancehealth.com/',
  'Electronic Arts (EA)': 'https://www.ea.com/careers/students',
  'F5 Networks': 'https://f5.wd5.myworkdayjobs.com/External',

  // Quant, HFT & Analytics
  'D. E. Shaw': 'https://www.deshawindia.com/careers/students-and-graduates',
  'Arcesium': 'https://www.arcesium.com/careers/',
  'Tower Research Capital': 'https://www.tower-research.com/open-positions',
  'WorldQuant': 'https://www.worldquant.com/careers/',
  'AlphaGrep': 'https://alpha-grep.com/careers/',
  'Graviton Research Capital': 'https://gravitonresearch.com/careers/',
  'QuadEye': 'https://www.quadeye.com/careers/',
  'Fractal Analytics': 'https://fractal.ai/careers/',
  'LatentView Analytics': 'https://www.latentview.com/careers/',
  'Tredence': 'https://www.tredence.com/careers',
  'ZS Associates': 'https://www.zs.com/careers',
  'Tiger Analytics': 'https://www.tigeranalytics.com/careers/',
  'EXL Service': 'https://www.exlservice.com/careers',
  'Quantiphi': 'https://quantiphi.com/careers/',

  // Data, Cloud & Infrastructure
  'Databricks': 'https://www.databricks.com/company/careers/university-recruiting',
  'Snowflake': 'https://careers.snowflake.com/us/en/university',
  'MongoDB': 'https://www.mongodb.com/company/careers/students-and-graduates',
  'Confluent': 'https://www.confluent.io/careers/',
  'Couchbase': 'https://www.couchbase.com/careers/',
  'Yugabyte': 'https://www.yugabyte.com/careers/',
  'Rubrik': 'https://www.rubrik.com/company/careers/university',
  'Cohesity': 'https://www.cohesity.com/company/careers/',
  'Commvault': 'https://careers.commvault.com/',
  'Informatica': 'https://www.informatica.com/about-us/careers.html',
  'Palo Alto Networks': 'https://jobs.paloaltonetworks.com/en/teams/early-in-career/',
  'Akamai': 'https://www.akamai.com/careers',
  'AppDynamics': 'https://www.appdynamics.com/company/careers',
  'Sumo Logic': 'https://www.sumologic.com/company/careers/',
  'Datadog': 'https://careers.datadoghq.com/early-career/',
  'UiPath': 'https://www.uipath.com/company/careers',
  'Harness': 'https://www.harness.io/careers',
  'LambdaTest': 'https://www.lambdatest.com/careers',
  'Agoda': 'https://careersatagoda.com/',
  'Stripe': 'https://stripe.com/jobs/university',
  'Booking.com': 'https://careers.booking.com/',
  'Expedia Group': 'https://lifeatexpediagroup.com/',
  'SABRE': 'https://www.sabre.com/about/careers/',
  'Airbnb': 'https://careers.airbnb.com/university/',

  // IT Services & Global Consultancies
  'TCS': 'https://www.tcs.com/careers/india/entry-level',
  'Infosys': 'https://www.infosys.com/careers/graduates.html',
  'Wipro': 'https://careers.wipro.com/early-careers',
  'Cognizant': 'https://careers.cognizant.com/in/en',
  'Accenture': 'https://www.accenture.com/in-en/careers/life-at-accenture/entry-level',
  'Capgemini': 'https://www.capgemini.com/in-en/careers/',
  'HCLTech': 'https://www.hcltech.com/careers',
  'Persistent Systems': 'https://www.persistent.com/careers/',
  'Deloitte USI': 'https://usirecruitment.deloitte.com/',
  'McKinsey & Company': 'https://www.mckinsey.com/careers/students',
  'BCG': 'https://careers.bcg.com/students-and-graduates',
  'Bain & Company': 'https://www.bain.com/careers/roles/ac/',
  'Publicis Sapient': 'https://careers.publicissapient.com/'
};

// Templates for role types
function getRoleTemplates(company) {
  const name = company.name;
  const sector = (company.sector || '').toUpperCase();
  const city = company.hqCity || 'Bengaluru';

  // Quant / HFT firms
  if (['D. E. SHAW', 'ARCESIUM', 'TOWER RESEARCH CAPITAL', 'WORLDQUANT', 'ALPHAGREP', 'GRAVITON RESEARCH CAPITAL', 'QUADEYE'].includes(name.toUpperCase())) {
    return [
      {
        title: 'Quantitative Research Intern',
        roleCategory: 'DATA',
        stipendMin: 120000,
        stipendMax: 150000,
        skills: ['Python', 'C++', 'SQL', 'Machine Learning', 'Linux'],
        description: `### About ${name}
${name} is a premier global quantitative trading and financial technology firm deploying advanced mathematical and statistical models across global markets.

### Role Overview
As a Quantitative Research Intern, you will work alongside world-class quantitative researchers and algorithmic traders to analyze complex financial datasets, evaluate market dynamics, and build predictive statistical models.

### Key Responsibilities
- Design, evaluate, and test algorithmic trading signals and statistical arbitrage models.
- Clean and explore petabyte-scale market microstructure, order book, and alternative datasets.
- Implement robust backtesting simulations and risk evaluation frameworks in Python and C++.
- Present research findings and mathematical insights to senior portfolio managers.

### Requirements & Eligibility
- Pursuing B.Tech / M.Tech / Dual Degree in Computer Science, Mathematics, Electrical Engineering, or Physics from top institutions.
- Exceptional problem-solving abilities and mathematical intuition (probability, statistics, linear algebra).
- Strong proficiency in Python (NumPy, SciPy, Pandas) or modern C++.
- 2025, 2026, or 2027 graduating batch.`
      },
      {
        title: 'Low-Latency Software Engineer Intern (Systems)',
        roleCategory: 'SDE',
        stipendMin: 120000,
        stipendMax: 150000,
        skills: ['C++', 'Linux', 'Git', 'Distributed Systems'],
        description: `### About ${name}
${name} develops cutting-edge proprietary trading infrastructure capable of processing millions of market messages per second with sub-microsecond latency.

### Role Overview
Join our core low-latency systems engineering team. You will build and optimize ultra-fast trading engines, exchange connectivity gateways, and high-throughput network architectures.

### Key Responsibilities
- Architect high-performance, cache-friendly data structures and zero-copy messaging protocols in modern C++.
- Optimize kernel bypass networking (Solarflare, Solarflare OpenOnload, DPDK) and memory layout.
- Profile and tune execution pipelines using Linux perf, hardware performance counters, and Valgrind.
- Write rigorous automated unit, performance, and fuzzing tests.

### Requirements & Eligibility
- Strong understanding of Computer Architecture, Operating Systems, Memory Hierarchies, and Networking (TCP/UDP).
- Advanced proficiency in C++ (C++17/20), multithreading, and lock-free concurrency.
- Passion for low-level systems programming and latency optimization.
- 2025, 2026, or 2027 graduating batch.`
      }
    ];
  }

  // Semiconductor & Hardware
  if (['QUALCOMM', 'NVIDIA', 'INTEL', 'AMD', 'TEXAS INSTRUMENTS', 'MICRON TECHNOLOGY', 'WESTERN DIGITAL', 'ARISTA NETWORKS', 'JUNIPER NETWORKS', 'MARVELL', 'ANALOG DEVICES', 'ARM', 'SYNOPSYS', 'CADENCE', 'SIEMENS EDA', 'MEDIATEK INDIA', 'RENESAS ELECTRONICS', 'STMICROELECTRONICS'].includes(name.toUpperCase())) {
    return [
      {
        title: 'Software Development Engineer Intern (Systems & Firmware)',
        roleCategory: 'SDE',
        stipendMin: 60000,
        stipendMax: 90000,
        skills: ['C++', 'Linux', 'Python', 'Git'],
        description: `### About ${name}
${name} is a global pioneer in semiconductor technologies, high-performance computing, and hardware-accelerated systems powering next-generation devices.

### Role Overview
As a Systems Software & Firmware Engineering Intern, you will bridge the gap between cutting-edge silicon architecture and high-level software stacks.

### Key Responsibilities
- Develop and debug low-level device drivers, firmware, and board support packages (BSPs).
- Optimize hardware-software co-design pipelines and hardware acceleration APIs.
- Build automated validation suites and regression pipelines using Python and Bash.
- Collaborate with hardware architects to verify silicon functionality on pre-silicon emulators (FPGA).

### Requirements & Eligibility
- Enrolled in B.Tech / M.Tech in Computer Science, Electronics, or Electrical Engineering.
- Solid grasp of C/C++, Data Structures, OS concepts, and Computer Architecture.
- Hands-on familiarity with Linux kernel development, microcontroller programming, or RTOS.
- 2025, 2026, or 2027 graduating batch.`
      },
      {
        title: 'Machine Learning & AI Acceleration Intern',
        roleCategory: 'AI_ML',
        stipendMin: 70000,
        stipendMax: 100000,
        skills: ['Python', 'C++', 'Machine Learning', 'Deep Learning', 'Linux'],
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

  // Banking & Financial Services
  if (['GOLDMAN SACHS', 'JPMORGAN CHASE', 'MORGAN STANLEY', 'AMERICAN EXPRESS', 'VISA', 'MASTERCARD', 'BARCLAYS', 'DEUTSCHE BANK', 'UBS', 'BLACKROCK', 'WELLS FARGO', 'CITI', 'BNY MELLON'].includes(name.toUpperCase())) {
    return [
      {
        title: 'Software Development Engineer Intern (Core Financial Platforms)',
        roleCategory: 'SDE',
        stipendMin: 75000,
        stipendMax: 110000,
        skills: ['Java', 'Python', 'PostgreSQL', 'AWS', 'Microservices'],
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
        skills: ['Python', 'SQL', 'Machine Learning', 'AWS'],
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

  // Indian Fintech / Startups / E-Commerce
  if (['RAZORPAY', 'PHONEPE', 'PAYTM', 'CRED', 'ZERODHA', 'GROWW', 'POLICYBAZAAR', 'FLIPKART', 'MYNTRA', 'SWIGGY', 'ZOMATO (ETERNAL)', 'OLA', 'RAPIDO', 'MEESHO', 'URBAN COMPANY', 'NYKAA', 'LENSKART', 'ZEPTO', 'BIGBASKET', 'BLINKIT', 'JUSPAY', 'PINE LABS', 'CASHFREE PAYMENTS', 'BHARATPE', 'TATA 1MG', 'PHARMEASY'].includes(name.toUpperCase())) {
    return [
      {
        title: 'Software Development Engineer Intern (Backend)',
        roleCategory: 'SDE',
        stipendMin: 50000,
        stipendMax: 80000,
        skills: ['Node.js', 'Go', 'PostgreSQL', 'Docker', 'AWS'],
        description: `### About ${name}
${name} is one of India's most innovative tech leaders, delivering delightful consumer and merchant experiences at pan-India scale.

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
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
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

  // IT Services / Consulting
  if (['TCS', 'INFOSYS', 'WIPRO', 'COGNIZANT', 'ACCENTURE', 'CAPGEMINI', 'HCLTECH', 'PERSISTENT SYSTEMS', 'DELOITTE USI', 'PUBLICIS SAPIENT', 'MCKINSEY & COMPANY', 'BCG', 'BAIN & COMPANY'].includes(name.toUpperCase())) {
    return [
      {
        title: 'Software Development & Cloud Engineering Intern',
        roleCategory: 'SDE',
        stipendMin: 30000,
        stipendMax: 45000,
        skills: ['Java', 'Python', 'SQL', 'AWS', 'Docker'],
        description: `### About ${name}
${name} is a global leader in digital transformation, consulting, and enterprise software engineering, serving Fortune 500 enterprises worldwide.

### Role Overview
Join our Digital Engineering practice. You will work on real-world enterprise modernization projects, building cloud-native applications and scalable backend systems.

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
        title: 'Data & AI Associate Intern',
        roleCategory: 'AI_ML',
        stipendMin: 30000,
        stipendMax: 45000,
        skills: ['Python', 'SQL', 'Machine Learning', 'AWS'],
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

  // Default tech company (Big Tech, Cloud, SaaS, Enterprise Software)
  return [
    {
      title: 'Software Development Engineer Intern',
      roleCategory: 'SDE',
      stipendMin: 60000,
      stipendMax: 100000,
      skills: ['Python', 'Java', 'Go', 'Docker', 'PostgreSQL'],
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
      stipendMin: 65000,
      stipendMax: 105000,
      skills: ['Python', 'SQL', 'Machine Learning', 'Deep Learning', 'Docker'],
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

async function main() {
  console.log('Starting comprehensive India-only internship seeding for all 210 companies...');

  const companiesPath = path.resolve(__dirname, '../../../data/companies.json');
  const companiesData = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));

  console.log(`Loading and ensuring ${companiesData.length} companies in DB...`);
  const companyMap = new Map();

  for (const comp of companiesData) {
    const slug = comp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/,'').replace(/^-+/,'');
    const atsId = comp.atsIdentifier || slug;
    const directUrl = directCareerUrls[comp.name] || comp.careerUrl;

    const record = await prisma.company.upsert({
      where: { slug },
      update: {
        name: comp.name,
        careerUrl: directUrl,
        atsType: comp.atsType,
        atsIdentifier: atsId,
        hqCity: comp.hqCity || 'Bengaluru',
        sector: comp.sector || 'Technology',
        isActive: true
      },
      create: {
        name: comp.name,
        slug,
        careerUrl: directUrl,
        atsType: comp.atsType,
        atsIdentifier: atsId,
        hqCity: comp.hqCity || 'Bengaluru',
        sector: comp.sector || 'Technology',
        isActive: true
      }
    });

    companyMap.set(comp.name, record);
  }

  // Deactivate companies not in the 210 list
  const validSlugs = companiesData.map(c => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/,'').replace(/^-+/,''));
  await prisma.company.updateMany({
    where: { slug: { notIn: validSlugs } },
    data: { isActive: false }
  });

  // Close all non-India internships currently in the DB
  const closedNonIndia = await prisma.internship.updateMany({
    where: {
      status: 'OPEN',
      NOT: {
        locations: {
          hasSome: [
            'Bengaluru', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai',
            'Gurgaon', 'Gurugram', 'Noida', 'Chennai', 'Delhi', 'New Delhi',
            'Delhi NCR', 'Remote - India', 'India'
          ]
        }
      }
    },
    data: { status: 'CLOSED' }
  });
  console.log(`Closed ${closedNonIndia.count} non-India internships.`);

  console.log('Generating tailored India internships for all 210 companies...');
  let totalSeeded = 0;

  for (const comp of companiesData) {
    const dbCompany = companyMap.get(comp.name);
    if (!dbCompany) continue;

    // Only add internships for companies that currently have active internship hiring
    if (!activelyHiringCompanies.has(comp.name)) {
      continue;
    }

    const templates = getRoleTemplates(comp);
    const directUrl = directCareerUrls[comp.name] || comp.careerUrl;
    const city = comp.hqCity || 'Bengaluru';

    for (let i = 0; i < templates.length; i++) {
      const tmpl = templates[i];
      const locations = [city];
      const isRemote = i === 1 && (comp.name === 'Notion' || comp.name === 'GitLab' || comp.name === 'Supabase' || comp.name === 'Postman' || comp.name === 'Automattic');
      if (isRemote) {
        locations.push('Remote - India');
      }

      const { jobId, applyUrl } = getExactJobIdAndUrl(comp, tmpl.title, tmpl.roleCategory, i);
      const effectiveApplyUrl = applyUrl || directUrl;

      const dedupHash = generateHash(`${comp.name.toLowerCase()}|${tmpl.title.toLowerCase()}|${locations.join(',')}|india-seed-${dbCompany.slug}`);
      const postedDaysAgo = Math.floor(Math.random() * 5) + 1;
      const postedAt = new Date(Date.now() - postedDaysAgo * 24 * 60 * 60 * 1000);
      const deadlineDays = Math.floor(Math.random() * 30) + 15;
      const deadline = new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000);

      await prisma.internship.upsert({
        where: { dedupHash },
        update: {
          title: tmpl.title,
          roleCategory: tmpl.roleCategory,
          locations,
          isRemote,
          stipendMin: tmpl.stipendMin,
          stipendMax: tmpl.stipendMax,
          currency: 'INR',
          durationMonths: 6,
          skills: tmpl.skills,
          eligibility: 'B.Tech / M.Tech / Dual Degree students in CS/IT/ECE or related branches (2025/2026/2027 graduating batch).',
          deadline,
          postedAt,
          applyUrl: effectiveApplyUrl,
          sourceJobId: jobId,
          description: tmpl.description,
          status: 'OPEN',
          lastSeenAt: new Date(),
          lastVerifiedAt: new Date()
        },
        create: {
          companyId: dbCompany.id,
          title: tmpl.title,
          roleCategory: tmpl.roleCategory,
          locations,
          isRemote,
          stipendMin: tmpl.stipendMin,
          stipendMax: tmpl.stipendMax,
          currency: 'INR',
          durationMonths: 6,
          skills: tmpl.skills,
          eligibility: 'B.Tech / M.Tech / Dual Degree students in CS/IT/ECE or related branches (2025/2026/2027 graduating batch).',
          deadline,
          postedAt,
          applyUrl: effectiveApplyUrl,
          description: tmpl.description,
          source: 'SEED',
          sourceJobId: jobId,
          status: 'OPEN',
          firstSeenAt: postedAt,
          lastSeenAt: new Date(),
          lastVerifiedAt: new Date(),
          dedupHash
        }
      });

      totalSeeded++;
    }
  }

  const finalOpenCount = await prisma.internship.count({ where: { status: 'OPEN' } });
  const finalCompaniesWithJobs = await prisma.company.count({
    where: {
      isActive: true,
      internships: {
        some: { status: 'OPEN' }
      }
    }
  });

  console.log(`\n========================================`);
  console.log(`Seed completed successfully!`);
  console.log(`Total active India internships: ${finalOpenCount}`);
  console.log(`Companies with active India internships: ${finalCompaniesWithJobs}`);
  console.log(`========================================\n`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
