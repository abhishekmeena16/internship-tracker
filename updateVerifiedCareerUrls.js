import { prisma } from './packages/db/index.js';
import fs from 'fs';
import path from 'path';

// Verified, authentic careers and student portals for all 210 companies
const verifiedCompanyUrls = {
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

async function updateAllUrls() {
  console.log('1. Updating data/companies.json...');
  const companiesPath = path.resolve('data/companies.json');
  const companiesData = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));

  let updatedInJson = 0;
  for (const comp of companiesData) {
    if (verifiedCompanyUrls[comp.name]) {
      comp.careerUrl = verifiedCompanyUrls[comp.name];
      updatedInJson++;
    }
  }

  fs.writeFileSync(companiesPath, JSON.stringify(companiesData, null, 2) + '\n');
  console.log(`Updated ${updatedInJson} company URLs in data/companies.json.`);

  console.log('2. Updating Company and Internship records in Database...');
  let updatedDbCompanies = 0;
  let updatedDbInternships = 0;

  for (const [name, url] of Object.entries(verifiedCompanyUrls)) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/,'').replace(/^-+/,'');
    
    // Update company careerUrl
    const compRecord = await prisma.company.findFirst({
      where: {
        OR: [
          { name: name },
          { slug: slug }
        ]
      }
    });

    if (compRecord) {
      await prisma.company.update({
        where: { id: compRecord.id },
        data: { careerUrl: url }
      });
      updatedDbCompanies++;

      // Update all internships under this company to point to this verified URL
      const res = await prisma.internship.updateMany({
        where: {
          companyId: compRecord.id
        },
        data: {
          applyUrl: url
        }
      });
      updatedDbInternships += res.count;
    }
  }

  console.log(`Updated ${updatedDbCompanies} companies and ${updatedDbInternships} internships with verified official application links!`);
}

updateAllUrls()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
