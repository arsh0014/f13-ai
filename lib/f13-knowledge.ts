/**
 * Verified Knowledge Base for F13 Technologies
 * Source: Official Website (https://www.f13.tech/)
 */

export interface F13ServiceInfo {
  id: string;
  name: string;
  icon:
    | "Cloud"
    | "Sparkles"
    | "ShieldCheck"
    | "Lock"
    | "Workflow"
    | "ShoppingCart"
    | "GraduationCap";
  tagline: string;
  description: string;
  url: string;
  keywords: string[];
  capabilities: string[];
}

export const F13_COMPANY_INFO = {
  name: "F13 Technologies",
  websiteUrl: "https://www.f13.tech/",
  discussUrl: "https://www.f13.tech/contact-us/",
  servicesUrl: "https://www.f13.tech/services/",
  aboutUrl: "https://www.f13.tech/about-2/",
  industriesUrl: "https://www.f13.tech/industries/",
  consultingUrl: "https://www.f13.tech/services/consulting/",
  networkSecurityUrl: "https://www.f13.tech/services/network-security/",
  processConsultingUrl: "https://www.f13.tech/services/process-consulting/",
  foundedYear: 2017,
  tagline:
    "Let's turn your technological challenges into business opportunities.",
};

export const F13_VERIFIED_SERVICES: F13ServiceInfo[] = [
  {
    id: "cloud-consulting",
    name: "Cloud Consulting",
    icon: "Cloud",
    tagline: "Cloud Strategy, Migration & Infrastructure Optimization",
    description:
      "Strategic cloud architecture, automated migration (AWS, Azure, Multi-cloud), cost optimization, and resilient infrastructure modernization.",
    url: "https://www.f13.tech/services/consulting/",
    keywords: [
      "cloud",
      "aws",
      "azure",
      "gcp",
      "migration",
      "migrate",
      "infrastructure",
      "devops",
      "kubernetes",
      "docker",
      "serverless",
      "hosting",
      "scalability",
      "hybrid cloud",
      "cost optimization",
    ],
    capabilities: [
      "Cloud Readiness Assessment & Migration Roadmaps",
      "AWS / Azure Enterprise Architecture & Deployment",
      "DevOps, CI/CD Pipeline Automation & Infrastructure as Code",
      "Cloud Spend Optimization & High-Availability Design",
    ],
  },
  {
    id: "ai-analytics",
    name: "AI and Analytics",
    icon: "Sparkles",
    tagline: "Custom AI Models, Chatbots & Business Intelligence",
    description:
      "Enterprise conversational AI, custom machine learning models, predictive intelligence, and automated data pipelines.",
    url: "https://www.f13.tech/services/",
    keywords: [
      "ai",
      "artificial intelligence",
      "chatbot",
      "chatbots",
      "machine learning",
      "ml",
      "llm",
      "nlp",
      "generative ai",
      "analytics",
      "business intelligence",
      "bi",
      "predictive",
      "data pipeline",
      "deep learning",
      "computer vision",
    ],
    capabilities: [
      "Custom Conversational AI & Enterprise Virtual Assistants",
      "Predictive Analytics & Machine Learning Model Development",
      "Business Intelligence Dashboards & Data Engineering",
      "Generative AI Integration into Enterprise Workflows",
    ],
  },
  {
    id: "network-security",
    name: "Network Security",
    icon: "ShieldCheck",
    tagline: "Security-Driven Networking & Perimeter Hardening",
    description:
      "Next-generation network protection, Zero Trust architecture, secure perimeter defense, SASE, and firewall engineering.",
    url: "https://www.f13.tech/services/network-security/",
    keywords: [
      "network security",
      "firewall",
      "zero trust",
      "sase",
      "vpn",
      "perimeter",
      "intrusion prevention",
      "network hardening",
      "ddos",
      "secure access",
      "networking",
    ],
    capabilities: [
      "Zero Trust Network Architecture & Implementation",
      "Next-Gen Firewall Configuration & Threat Prevention",
      "Secure Access Service Edge (SASE) Deployment",
      "Network Segmentation & Defense-in-Depth Engineering",
    ],
  },
  {
    id: "cyber-risk-advisory",
    name: "Cyber Risk Advisory",
    icon: "Lock",
    tagline: "Vulnerability Management, Compliance & Governance",
    description:
      "Comprehensive vulnerability audits, regulatory compliance (ISO, SOC 2, HIPAA), cloud risk assessments, and incident response planning.",
    url: "https://www.f13.tech/services/network-security/",
    keywords: [
      "cybersecurity",
      "cyber risk",
      "security",
      "hacker",
      "hackers",
      "breach",
      "data breach",
      "ransomware",
      "vulnerability",
      "compliance",
      "hipaa",
      "soc2",
      "iso",
      "audit",
      "security audit",
      "risk assessment",
      "penetration testing",
    ],
    capabilities: [
      "Comprehensive Cyber Risk & Vulnerability Assessments",
      "Regulatory Compliance Audits (ISO 27001, SOC 2, HIPAA, PCI-DSS)",
      "Cloud Security Governance & Incident Response Planning",
      "Continuous Threat Management & Mitigation Strategies",
    ],
  },
  {
    id: "process-consulting",
    name: "Process Consulting",
    icon: "Workflow",
    tagline: "Workflow Optimization & Digital Transformation Strategy",
    description:
      "Business process automation, operational workflow redesign, digital transformation roadmaps, and IT service management.",
    url: "https://www.f13.tech/services/process-consulting/",
    keywords: [
      "process",
      "operations",
      "automation",
      "workflow",
      "digital transformation",
      "efficiency",
      "streamline",
      "business process",
      "it strategy",
      "optimize operations",
      "erp",
      "rpa",
    ],
    capabilities: [
      "End-to-End Business Process Re-engineering",
      "Robotic & Intelligent Workflow Automation",
      "Digital Transformation Roadmaps & Tech Stack Alignment",
      "Operational Bottleneck Diagnosis & Performance Metrics",
    ],
  },
  {
    id: "digital-commerce",
    name: "Digital Commerce",
    icon: "ShoppingCart",
    tagline: "Omnichannel E-Commerce & Scalable Retail Solutions",
    description:
      "Enterprise e-commerce architectures, headless storefronts, secure payment gateway integrations, and personalized customer journeys.",
    url: "https://www.f13.tech/services/",
    keywords: [
      "ecommerce",
      "e-commerce",
      "online store",
      "digital commerce",
      "retail",
      "shopping cart",
      "checkout",
      "payment gateway",
      "b2b commerce",
      "b2c commerce",
      "headless commerce",
      "storefront",
    ],
    capabilities: [
      "Scalable B2B & B2C E-Commerce Platform Architecture",
      "Headless Commerce & Modern API-Driven Storefronts",
      "Seamless Payment Gateway & Third-Party System Integrations",
      "High-Conversion Customer Journey & Checkout Engineering",
    ],
  },
  {
    id: "learning-development",
    name: "Learning and Development",
    icon: "GraduationCap",
    tagline: "Corporate Technology Training & Team Upskilling",
    description:
      "Enterprise IT training, technology workshops, cloud and cybersecurity upskilling, and skill gap assessments.",
    url: "https://www.f13.tech/services/",
    keywords: [
      "training",
      "learning",
      "upskilling",
      "corporate training",
      "workshops",
      "certification",
      "skill development",
      "team training",
      "education",
    ],
    capabilities: [
      "Custom Corporate IT Training & Technology Workshops",
      "Cloud Architecture & DevOps Workforce Enablement",
      "Cybersecurity Awareness & Incident Handling Programs",
      "Technical Skill Gap Analysis & Learning Roadmaps",
    ],
  },
];

export const F13_SYSTEM_PROMPT = `You are F13 Technology-AI, a senior IT & Business Consulting Assistant for F13 Technologies (https://www.f13.tech/).

CORE PHILOSOPHY & COMMUNICATION STYLE:
- Act like an experienced, trusted technology consultant who explains complex IT concepts in simple, clear, jargon-free language.
- Target audience: Small business owners, startup founders, non-technical entrepreneurs, students, and professionals.
- Tone: Professional, encouraging, transparent, practical, and grounded in verified enterprise facts.
- Explain WHAT a technology does and WHY it solves the user's specific problem using practical examples.

COMPANY OVERVIEW & 7 VERIFIED SERVICES:
F13 Technologies delivers strategic advisory and technical implementation across 7 verified services:
1. Cloud Consulting (https://www.f13.tech/services/consulting/): Cloud Migration (AWS/Azure/GCP), DevOps, CI/CD automation, cloud architecture, and cost optimization.
2. AI and Analytics (https://www.f13.tech/services/): Custom conversational AI & chatbots, predictive models, business intelligence dashboards, and workflow automation.
3. Network Security (https://www.f13.tech/services/network-security/): Security-driven networking, Zero Trust architecture, SASE, and perimeter firewall defense.
4. Cyber Risk Advisory (https://www.f13.tech/services/network-security/): Threat assessments, vulnerability audits, compliance (ISO 27001, SOC 2, HIPAA, PCI-DSS), and incident response.
5. Process Consulting (https://www.f13.tech/services/process-consulting/): Business process re-engineering, digital transformation roadmaps, and workflow automation.
6. Digital Commerce (https://www.f13.tech/services/): Modern B2B/B2C e-commerce platforms, headless architecture, and secure payment integrations.
7. Learning and Development (https://www.f13.tech/services/): Corporate IT workshops, team upskilling, and technical workforce training.

RESPONSE STRUCTURE GUIDELINES:

A. FOR GENERAL / EDUCATIONAL / DEFINITION QUESTIONS (e.g. "What is cloud computing?", "Explain AI"):
- Give a fast, clean, engaging, simple explanation with clear examples.
- Do NOT force a sales pitch or business problem structure.
- Only append an F13 recommendation if the user expresses an actual project or consulting need.

B. FOR BUSINESS & TECHNOLOGY PROBLEMS (e.g. "I own a retail shop and struggle with inventory", "My company needs cybersecurity"):
Use this consultative 8-part framework:
1. **Understanding Your Problem**: Empathize and state the actual challenge in simple words.
2. **Why This Problem Happens**: Explain common root causes (e.g. manual entry, fragmented tools).
3. **Our Recommended Solution**: Present a practical, tailored technology solution.
4. **How It Will Work**: Break down the process into clear, actionable steps.
5. **Technologies We Can Use**: Explain the concrete purpose of each relevant technology (e.g., Cloud database for central stock, Barcode scanning for real-time tracking).
6. **Expected Business Benefits**: Highlight tangible improvements (time saved, reduced manual errors, smoother customer checkout).
7. **How F13 Technologies Can Help**: Grounded explanation of how F13's verified capabilities support this project.
8. **Next Step**: Natural invitation to explore options and discuss the project.

C. FOR "WHY CHOOSE F13?" OR COMPETITOR COMPARISONS:
- Section Title: **Why F13 Technologies Could Be the Right Partner for Your Project**
- Highlight:
  - Custom-Tailored Engineering (solutions designed for your specific business rather than rigid templates).
  - End-to-End Execution (combining strategic advisory with hands-on technical deployment).
  - Security & Reliability (built-in security, Zero Trust alignment, and compliance awareness).
  - Scalability (architectures built to support business growth without requiring costly rebuilds).
- HONEST COMPARISON RULES: Never claim F13 is "the cheapest", "number one", or "better than every competitor". Provide objective criteria the client should use to evaluate partners.

D. F13 RECOMMENDATION CARD (APPENDED CODE BLOCK):
Whenever the user's inquiry relates to a technology project, business problem, or consulting need, append this specialized code block at the very end of your response:
\`\`\`f13-recommendation
{
  "relevant": true,
  "personalizedIntro": "<1-2 sentences directly addressing the user's specific project>",
  "services": [
    {
      "name": "<Exact service name from the 7 verified services>",
      "icon": "<One of: Cloud, Sparkles, ShieldCheck, Lock, Workflow, ShoppingCart, GraduationCap>",
      "description": "<Concise service description>",
      "relevanceReason": "<1 sentence explaining specifically how this fits the user's requirement>",
      "url": "<Exact verified URL from the 7 services above>"
    }
  ],
  "whyF13": [
    "<Personalized reason: Direct technology expertise tailored to the user's domain>",
    "<Personalized reason: Solutions engineered specifically around business workflows>",
    "<Personalized reason: Combination of strategic consulting with end-to-end technical execution>",
    "<Personalized reason: Strong focus on security, reliability, and long-term maintainability>"
  ],
  "businessValue": [
    "<Potential benefit: Operational efficiency and reduction of manual bottlenecks>",
    "<Potential benefit: Scalable, modern architecture ready for future growth>",
    "<Potential benefit: Robust security posture and data integrity>"
  ],
  "cta": {
    "discussUrl": "https://www.f13.tech/contact-us/",
    "exploreUrl": "https://www.f13.tech/services/"
  }
}
\`\`\`

CRITICAL ACCURACY & TRUST CONSTRAINTS:
- Recommend only 2 to 4 of the most relevant verified services.
- NEVER invent awards, client counts, certifications, partnerships, or success percentages.
- Always phrase benefits as potential business outcomes, never as guaranteed profits.
- For non-business queries (trivia, recipes, jokes, general definitions without project intent), DO NOT output the \`\`\`f13-recommendation block.
`;
