// ALL site content lives here. Edit this file to update the site.
// Rule: nothing invented. Anything unknown is marked TODO and hidden until filled.

export type Category =
  | 'Data Science & ML'
  | 'Computer Vision'
  | 'AI Agents'
  | 'Analytics & Causal'
  | 'Product'
  | 'Research'

export type ChartKind = 'ladder' | 'retina' | 'profit' | 'faces' | 'agents' | 'phone' | 'stars' | 'quartile'

export interface Metric {
  label: string
  /** optional before → after numbers; the chip draws a sparkline between them on hover */
  from?: number
  to?: number
}

export interface Project {
  id: string
  title: string
  short: string
  oneLiner: string
  categories: Category[]
  status: 'Complete' | 'Live' | 'In progress' | 'Preprint'
  statusNote?: string
  problem: string
  did: string
  data?: string
  tools: string[]
  metrics: Metric[]
  /** the "result" lines a Run-cell types out */
  runOutput: string[]
  links: { label: string; url: string }[]
  repo?: string
  featured?: boolean
  chart: ChartKind
  accent: 'lime' | 'pink' | 'cyan' | 'sun' | 'violet'
}

export const site = {
  url: 'https://sabarishknight.github.io',
  name: 'Sabarish G',
  tagline: 'Data Scientist · Data Analyst · Business Analyst · Product Analyst',
  roles: ['Data Scientist', 'Data Analyst', 'Business Analyst', 'Product Analyst', 'Decision Scientist'],
  rotating: ['Data Analytics', 'Machine Learning', 'Statistics', 'Dashboards', 'Business Questions', 'Product'],
  location: 'Bengaluru, India',
  bio: "I solve problems domain-first: I learn how the business works, clean the data, then build the analysis or model that drives a decision. The best answer rarely comes from a fancier algorithm; it comes from asking the right business question. I'm a final-year MS Business Analytics student with finance roots (BBA, 2 years at Wego and Jetapult), first author of a computer-vision research paper, and I use AI tools to turn ideas into working products fast.",
  email: 'sabarishknight@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sabarish-g-159809233',
  github: 'https://github.com/sabarishknight',
  githubUser: 'sabarishknight',
  arxiv: 'https://arxiv.org/abs/2610.22437',
  resume: '/Sabarish_G_Resume.pdf',
  phone: '+91 81236 74177',
  phoneHref: 'tel:+918123674177',
  whatsapp: 'https://wa.me/918123674177',
  // TODO: fill any of these to show them; empty strings stay hidden
  otherLinks: [
    { label: 'Kaggle', url: '' },
    { label: 'Medium', url: '' },
    { label: 'Google Scholar', url: '' },
    { label: 'ORCID', url: '' },
  ],
  available: 'Available from December 2026',
}

/** icon: simple-icons slug, or omitted to draw a monogram tile */
export interface Skill {
  name: string
  icon?: string
  color?: string
}

/** Core: daily tools I can be tested on. Everything in skillGroups is hands-on project work, often built with AI assistance. */
export const coreSkills: { group: string; accent: Project['accent']; skills: Skill[] }[] = [
  {
    group: 'Excel & Spreadsheets',
    accent: 'lime',
    skills: [
      { name: 'Advanced Excel', icon: 'microsoftexcel' },
      { name: 'XLOOKUP / INDEX-MATCH' },
      { name: 'Pivot Tables' },
      { name: 'Power Query', icon: 'microsoftexcel' },
      { name: 'Power Pivot', icon: 'microsoftexcel' },
      { name: 'VBA macros', color: '#867DB1' },
    ],
  },
  {
    group: 'Python & SQL',
    accent: 'cyan',
    skills: [
      { name: 'Python', icon: 'python' },
      { name: 'pandas', icon: 'pandas' },
      { name: 'NumPy', icon: 'numpy' },
      { name: 'SQL (CTEs, window functions, joins)', icon: 'postgresql' },
      { name: 'BigQuery', icon: 'googlebigquery' },
      { name: 'Jupyter', icon: 'jupyter' },
    ],
  },
  {
    group: 'Dashboards & BI',
    accent: 'sun',
    skills: [
      { name: 'Power BI', icon: 'powerbi' },
      { name: 'Tableau', icon: 'tableau' },
      { name: 'Looker / Looker Studio', icon: 'looker' },
      { name: 'Streamlit', icon: 'streamlit' },
      { name: 'KPI definition' },
      { name: 'Financial reporting' },
    ],
  },
  {
    group: 'Statistics & Causal',
    accent: 'pink',
    skills: [
      { name: 'Hypothesis testing' },
      { name: 'A/B testing' },
      { name: 'Regression' },
      { name: 'Bootstrap CIs' },
      { name: 'Causal inference basics' },
      { name: 'Forecasting' },
    ],
  },
  {
    group: 'Machine learning concepts',
    accent: 'violet',
    skills: [
      { name: 'scikit-learn', icon: 'scikitlearn' },
      { name: 'Classification & regression' },
      { name: 'Gradient boosting' },
      { name: 'Model evaluation' },
      { name: 'Calibration' },
      { name: 'SHAP explanations' },
    ],
  },
]

export const skillGroups: { group: string; accent: Project['accent']; skills: Skill[] }[] = [
  {
    group: 'Data tooling',
    accent: 'lime',
    skills: [
      { name: 'DuckDB', icon: 'duckdb' },
      { name: 'Parquet', icon: 'apacheparquet' },
      { name: 'dbt', icon: 'dbt' },
      { name: 'Git', icon: 'git' },
    ],
  },
  {
    group: 'ML & Deep Learning',
    accent: 'pink',
    skills: [
      { name: 'LightGBM', color: '#9ACD32' },
      { name: 'CatBoost', color: '#FFCC00' },
      { name: 'XGBoost', color: '#1A8CFF' },
      { name: 'PyTorch', icon: 'pytorch' },
      { name: 'torchvision', icon: 'pytorch' },
      { name: 'statsmodels', color: '#3F7FBF' },
      { name: 'Conformal prediction', color: '#8B5CF6' },
    ],
  },
  {
    group: 'Computer Vision',
    accent: 'cyan',
    skills: [
      { name: 'SCRFD face detection', icon: 'opencv' },
      { name: 'ArcFace embeddings', color: '#FF3E9A' },
      { name: 'ONNX Runtime', icon: 'onnx' },
      { name: 'Test-time adaptation', color: '#B8FF3C' },
      { name: 'Medical imaging', color: '#FF6B35' },
    ],
  },
  {
    group: 'AI Agents & LLMs',
    accent: 'violet',
    skills: [
      { name: 'LangGraph', icon: 'langchain' },
      { name: 'MCP', icon: 'anthropic' },
      { name: 'Claude', icon: 'claude' },
      { name: 'Vapi voice agents', color: '#5DFECA' },
      { name: 'Tool calling', color: '#FFD60A' },
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'Prompt engineering', color: '#FF3E9A' },
      { name: 'AI-assisted coding', icon: 'claude' },
    ],
  },
  {
    group: 'Advanced statistics',
    accent: 'sun',
    skills: [
      { name: 'Regression discontinuity' },
      { name: 'Propensity-score matching' },
      { name: 'Fixed effects' },
      { name: 'Doubly-robust (AIPW)' },
      { name: 'Quantile regression' },
      { name: 'matplotlib', color: '#11557C' },
    ],
  },
  {
    group: 'Product & Business',
    accent: 'pink',
    skills: [
      { name: 'Requirements' },
      { name: 'Six Sigma DMAIC' },
      { name: 'Process mapping' },
      { name: 'Agile / Jira', icon: 'jira' },
      { name: 'Stakeholder management' },
      { name: 'Unit economics' },
    ],
  },
  {
    group: 'Engineering',
    accent: 'cyan',
    skills: [
      { name: 'pytest', icon: 'pytest' },
      { name: 'Flask', icon: 'flask' },
      { name: 'Google Cloud Run', icon: 'googlecloud' },
      { name: 'Terraform', icon: 'terraform' },
      { name: 'Google Sheets API', icon: 'googlesheets' },
      { name: 'uv / Makefile', icon: 'uv' },
    ],
  },
]

export const categories: ('All' | Category)[] = [
  'All',
  'Data Science & ML',
  'Computer Vision',
  'AI Agents',
  'Analytics & Causal',
  'Product',
  'Research',
]

const gh = (r: string) => `https://github.com/sabarishknight/${r}`

export const projects: Project[] = [
  {
    id: 'flight',
    title: 'Flight Disruption Prediction: When Does Model Complexity Pay Off?',
    short: 'Flight Delay Prediction',
    oneLiner:
      'Predicts which US flights will be delayed or cancelled 2 hours ahead, and proves that better data beats a fancier model.',
    categories: ['Data Science & ML'],
    status: 'Complete',
    problem:
      'Will a US domestic flight depart 15+ min late or be cancelled? Forecast it 2 hours before departure and test whether more information or a fancier algorithm earns its keep.',
    did: 'Audited 65 raw monthly BTS files one by one (date corruption in 36, schema drift in 7), built one validated UTC clock across 387 airports, then climbed a model ladder from climatology to CatBoost with TreeSHAP and conformal prediction on top.',
    data: '39,073,000 public BTS flights (Jan 2021 – May 2026), 65 monthly files.',
    tools: ['Python 3.11', 'LightGBM', 'CatBoost', 'Logistic regression', 'scikit-learn', 'Parquet', 'TreeSHAP', 'Conformal prediction', 'Streamlit', 'pytest (22 tests)'],
    metrics: [
      { label: 'PR-AUC 0.748 vs 0.350 baseline', from: 0.35, to: 0.748 },
      { label: 'ROC-AUC 0.855' },
      { label: 'Brier Skill Score 38.3%' },
      { label: 'Up to 55% lower alerting cost' },
      { label: 'Test ECE 0.003 · beat climatology in all 23 test months' },
      { label: 'Inbound-aircraft data +21.7% vs costlier model +0.3%', from: 0.3, to: 21.7 },
      { label: 'Conformal coverage 60.9% → 90.9%', from: 60.9, to: 90.9 },
    ],
    runOutput: [
      'loading 39,073,000 flights … ok',
      'auditing 65 files → 36 date-corrupted, 7 schema drift',
      'PR-AUC   0.748   (baseline 0.350)',
      'ROC-AUC  0.855   ECE 0.003',
      'verdict: inbound-aircraft data +21.7%, CatBoost +0.3% at ~11× time → ship LightGBM',
    ],
    links: [{ label: 'Code', url: gh('regime-aware-flight-delay-prediction') }],
    repo: 'regime-aware-flight-delay-prediction',
    featured: true,
    chart: 'ladder',
    accent: 'lime',
  },
  {
    id: 'cfnode',
    title: 'CF-NODE: Counterfactual Spatial Node Intervention for Test-Time Adaptation Under Domain Shift',
    short: 'CF-NODE (Research)',
    oneLiner:
      'A training-free method that keeps diabetic-retinopathy grading models reliable on images from new hospitals and cameras.',
    categories: ['Computer Vision', 'Research', 'Data Science & ML'],
    status: 'Preprint',
    statusNote: 'Preprint on arXiv',
    problem:
      'Medical-imaging models break under domain shift (new hospitals, new cameras), and retraining is often impossible. Images also arrive one at a time, so batch-based adaptation does not fit the clinic.',
    did: 'Designed a frozen-model method that weakens the spatial nodes the model relies on most, measures how stable the predicted grade stays, and uses that sensitivity to calibrate each image on its own: no gradients, no target batches, no target statistics.',
    data: 'Source: EyePACS (balanced 3,540 images). Targets: IDRiD, MESSIDOR-2, OIA-DDR, DeepDRiD, SUSTech-SYSU.',
    tools: ['PyTorch', 'torchvision', 'NumPy', 'scikit-learn', 'pandas', 'ResNet-50', 'MIT-licensed run_tta API'],
    metrics: [
      { label: 'Avg AUC 80.3% (+2.1 pp vs source)', from: 78.2, to: 80.3 },
      { label: 'Avg macro-F1 42.1% (+6.2 pp vs source)', from: 35.9, to: 42.1 },
      { label: 'Best AUC on all 5 external datasets' },
      { label: 'Beats TENT, EATA, SAR, T3A (p ≤ 0.05 AUC, p ≤ 0.01 F1)' },
    ],
    runOutput: [
      'source: EyePACS → 5 unseen target domains',
      'ranking 100 spatial nodes · 4 intervention levels · 5 views',
      'avg AUC      80.3%  (source 78.2%)',
      'avg macro-F1 42.1%  (source 35.9%)',
      'best AUC on 5/5 datasets · no gradients, no target stats',
    ],
    links: [
      { label: 'Paper (arXiv)', url: 'https://arxiv.org/abs/2610.22437' },
      { label: 'Code', url: gh('CF-Node') },
    ],
    repo: 'CF-Node',
    featured: true,
    chart: 'retina',
    accent: 'pink',
  },
  {
    id: 'credit',
    title: 'Credit Policy Optimizer: Approve, Refer or Decline on 789K Real Loans',
    short: 'Credit Policy Optimizer',
    oneLiner: "A credit scorecard + decision policy that more than doubled a lender's profit while halving defaults.",
    categories: ['Data Science & ML', 'Analytics & Causal', 'Product'],
    status: 'Complete',
    statusNote: 'with Streamlit policy simulator',
    problem:
      'A consumer lender approves everything its process passes and ~1 in 12 loans defaults within a year. Build a profit-optimal approve / refer / decline policy with reason codes.',
    did: 'Built a WoE-binned logistic scorecard, challenged it with gradient boosting, kept the simpler explainable model, then turned scores into a profit-optimal three-way policy with a reason code for every decline.',
    data: '789,144 real Bondora consumer loans (EE, FI, NL, LV, DK, 2009 – Jun 2026); out-of-time test on 81,464 loans (€155M lent).',
    tools: ['Python', 'pandas', 'scikit-learn', 'Logistic regression', 'HistGradientBoosting', 'WoE binning', 'Streamlit', 'pytest', 'Jupyter'],
    metrics: [
      { label: 'Profit €2.0M → €4.7M on unseen loans', from: 2.0, to: 4.7 },
      { label: 'Default rate 8.1% → 4.7% at 70% approval', from: 8.1, to: 4.7 },
      { label: 'Scorecard AUC 0.730 (Gini 0.46, KS 0.334)' },
      { label: "Beat gradient boosting (0.721) and the lender's grade (0.689)" },
      { label: 'PSI 0.07 on live data · reason code for every decline (EU / GDPR)' },
    ],
    runOutput: [
      'scoring 81,464 out-of-time loans (€155M lent) …',
      'scorecard AUC 0.730  vs  GBM 0.721  vs  lender grade 0.689',
      'profit    €2.0M → €4.7M',
      'defaults  8.1% → 4.7%   approval 70%',
      'PSI 0.07 → stable · 31 leakage fields logged',
    ],
    links: [{ label: 'Code', url: gh('credit-policy-optimizer') }],
    repo: 'credit-policy-optimizer',
    featured: true,
    chart: 'profit',
    accent: 'sun',
  },
  {
    id: 'faceroll',
    title: 'FaceRoll: Face-Recognition Attendance App',
    short: 'FaceRoll',
    oneLiner: 'One class photo marks attendance for the whole room.',
    categories: ['Computer Vision', 'Product'],
    status: 'Live',
    statusNote: 'used daily by 2 professors in my MSc class',
    problem: 'Manual roll-call wastes class time; professors needed something fast and reviewable.',
    did: 'Built and deployed a Flask app with SCRFD detection + ArcFace embeddings (ONNX) and Hungarian matching, plus guided 5-pose phone enrolment, a review screen for unclear matches and Excel export.',
    tools: ['Python', 'Flask', 'SCRFD', 'ArcFace (ONNX)', 'Hungarian matching', 'Google Cloud Run', 'Excel export'],
    metrics: [{ label: '~40 s for a 56-face class photo on 2 CPUs' }, { label: 'Used daily by 2 professors' }],
    runOutput: [
      'detecting faces (SCRFD) … 56 found',
      'embedding (ArcFace, ONNX) · Hungarian matching',
      'unclear matches → review screen',
      'done in ~40 s on 2 CPUs → attendance.xlsx',
    ],
    links: [{ label: 'Code', url: gh('faceroll-attendance') }],
    repo: 'faceroll-attendance',
    featured: true,
    chart: 'faces',
    accent: 'cyan',
  },
  {
    id: 'metric-on-call',
    title: 'Metric On-Call: Multi-Agent AI That Explains Why a KPI Moved',
    short: 'Metric On-Call',
    oneLiner: "8 AI agents that run a senior analyst's root-cause investigation when a KPI suddenly moves.",
    categories: ['AI Agents', 'Analytics & Causal'],
    status: 'In progress',
    statusNote: 'design complete, build in progress',
    problem: 'When revenue or conversion drops, analysts spend days figuring out why.',
    did: 'Designing Supervisor, Data Quality Auditor, Metric Decomposer, Context Investigator, Hypothesis Tester, Skeptic, Impact & Forecast and Reporter agents, plus a no-LLM Monitor and human approval. Tested SQL and Python do the maths; the Skeptic challenges every answer.',
    tools: ['LangGraph', 'MCP', 'BigQuery / DuckDB', 'dbt', 'BigQuery ML', 'Streamlit', 'Looker Studio', 'Terraform'],
    metrics: [
      { label: 'Evaluation plan (target): 13 planted incidents + 10 quiet weeks' },
      { label: 'Synthetic 24-store chain' },
    ],
    runOutput: [
      'status: in progress — no results yet',
      'eval plan: 13 planted incidents (pipeline bugs, cannibalisation, Simpson’s paradox)',
      '          + 10 quiet weeks on a synthetic 24-store chain',
    ],
    links: [{ label: 'Code', url: gh('metric-on-call') }],
    repo: 'metric-on-call',
    featured: true,
    chart: 'agents',
    accent: 'violet',
  },
  {
    id: 'callback',
    title: 'CallBack AI: AI Voice Agent for Enquiry Follow-up',
    short: 'CallBack AI',
    oneLiner:
      'An AI voice agent that calls every website enquiry within 30 seconds, qualifies the lead and books the meeting.',
    categories: ['AI Agents', 'Product'],
    status: 'Complete',
    statusNote: 'validated on a 20-lead test dataset',
    problem: 'Leads go cold when sales teams call back hours later.',
    did: 'Calls 30 s after form submission, qualifies on service, budget and timeline, answers 6 FAQs, books meetings in English + Hindi via 3 LLM tool calls, scores leads hot/warm/cold with a written reason, with AI disclosure, consent capture, test mode, duplicate-call prevention and prompt-injection protection.',
    tools: ['Python', 'FastAPI', 'Vapi', 'Claude (LLM)', 'Google Sheets API', 'Streamlit'],
    metrics: [
      { label: 'Calls within 30 s of form submission' },
      { label: '8-point hot / warm / cold lead score' },
      { label: 'English + Hindi · 3 tool calls' },
      { label: '36 automated tests' },
    ],
    runOutput: [
      'form submitted → dialling in 30 s',
      'qualify: service · budget · timeline',
      'tools: check_slots → book_meeting → save_results',
      'lead score 8-pt → hot / warm / cold + reason · 36 tests passing',
    ],
    links: [{ label: 'Code', url: gh('callback-ai') }],
    repo: 'callback-ai',
    chart: 'phone',
    accent: 'pink',
  },
  {
    id: 'olist',
    title: 'The Broken Promise Tax: Cost of Late E-commerce Deliveries',
    short: 'Broken Promise Tax',
    oneLiner: 'Measured what a late delivery really costs a marketplace and which fix to fund first.',
    categories: ['Analytics & Causal', 'Data Science & ML', 'Product'],
    status: 'Complete',
    problem: 'Late deliveries hurt reviews, but by how much, why, and which fix pays back first?',
    did: 'Built a SQL star schema, estimated the causal effect of lateness five ways (doubly-robust headline), traced late orders to routes vs sellers and built a quantile-regression promise engine.',
    data: '96,203 delivered Olist (Brazil) orders, R$15.8M GMV, 3,060 sellers.',
    tools: ['SQL (star schema, CTEs, window functions)', 'SQLite', 'pandas', 'statsmodels', 'scikit-learn', 'Jupyter'],
    metrics: [
      { label: 'Lateness causes −1.98★ per order (95% CI −2.03 to −1.94)' },
      { label: '94% of 3+ day late orders reviewed before arrival' },
      { label: '12 routes cause 67% of late orders' },
      { label: 'Promise engine: late rate 7.7% → 6.6%', from: 7.7, to: 6.6 },
      { label: '24 data-quality tests · honest null on repeat purchases' },
    ],
    runOutput: [
      'orders 96,203 · GMV R$15.8M · sellers 3,060',
      'AIPW effect of lateness: −1.98★ (−2.03, −1.94) · 5 methods agree',
      'route persistence r = 0.73 vs seller r = 0.14',
      'quantile promise engine: late 7.7% → 6.6%',
    ],
    links: [{ label: 'Code', url: gh('ecommerce-late-delivery-cost-analysis') }],
    repo: 'ecommerce-late-delivery-cost-analysis',
    chart: 'stars',
    accent: 'sun',
  },
  {
    id: 'energy',
    title: 'Retail Energy & Carbon Analytics',
    short: 'Retail Energy & Carbon',
    oneLiner: 'Found which retail stores waste energy, which utility bills are wrong, and what fixing them is worth.',
    categories: ['Analytics & Causal', 'Data Science & ML'],
    status: 'Complete',
    statusNote: 'core analysis complete',
    problem: 'Which stores waste energy, which bills are wrong, and what is fixing them worth?',
    did: 'Benchmarked energy intensity across a retail portfolio, audited monthly bills, and fitted weather-normalised baselines checked against ASHRAE-14.',
    data: '1,166 NYC retail buildings (3,428 building-years), 42,264 monthly utility bills, daily weather.',
    tools: ['Python', 'pandas', 'DuckDB + Parquet', 'statsmodels', 'LightGBM', 'matplotlib', 'pytest'],
    metrics: [
      { label: 'Bottom quartile uses 4.0× energy/m² of top quartile', from: 1, to: 4 },
      { label: 'Technical potential: 82 GWh, ~$17.3M, 32 kt CO₂e/yr' },
      { label: 'Building age R² = 0.002 → the gap is operational' },
      { label: '59 bill tickets: $61k/yr real waste vs $279k likely billing errors' },
      { label: '6 of 8 baselines meet ASHRAE-14 · LightGBM portfolio error 3.6%' },
    ],
    runOutput: [
      'buildings 1,166 · bills 42,264 · weather daily',
      'bottom vs top quartile: 4.0× energy per m²',
      'technical potential: 82 GWh · ~$17.3M · 32 kt CO₂e/yr',
      'bill audit: 59 tickets → $61k/yr waste, $279k likely billing errors',
    ],
    links: [{ label: 'Code', url: gh('retail-energy-carbon-analytics') }],
    repo: 'retail-energy-carbon-analytics',
    chart: 'quartile',
    accent: 'lime',
  },
  // TODO: auto-apply job agent (title, one-liner, repo) if you want it shown
]

/* ---------------- Research: everything below is from arXiv:2610.22437 v1 ---------------- */

export const paper = {
  title:
    'CF-NODE: Counterfactual Spatial Node Intervention for Test-Time Adaptation Under Domain Shift, Evaluated Across Five Diabetic Retinopathy Datasets',
  authors: [
    { name: 'Sabarish G', me: true, note: 'first author' },
    { name: 'Deepak Parashar', note: 'Senior Member, IEEE' },
  ],
  venue: 'arXiv preprint',
  arxivId: '2610.22437',
  submitted: '15 Oct 2026',
  year: 2026,
  subjects: 'cs.LG · cs.CV',
  arxivUrl: 'https://arxiv.org/abs/2610.22437',
  pdfUrl: 'https://arxiv.org/pdf/2610.22437',
  codeUrl: 'https://github.com/sabarishknight/CF-Node',
  doi: '10.48550/arXiv.2610.22437',
  codeDoi: '', // TODO: code-archive DOI (e.g. Zenodo) once minted
  lead: 'Fundus cameras differ from clinic to clinic, and a diabetic-retinopathy grader trained in one place quietly gets worse in another. CF-NODE fixes each prediction at test time, one image at a time, without touching the model.',
  problem: [
    {
      head: 'Confidence is not correctness',
      body: 'Entropy-minimising TTA (TENT, EATA, SAR) can make a confidently wrong grade even more confident under domain shift.',
    },
    {
      head: 'Clinics see one image at a time',
      body: 'Methods that need target batches, memory banks or a stream (T3A, FunOTTA) assume a stable target domain the clinic may not have.',
    },
    {
      head: 'No retraining, no shared state',
      body: 'One unreliable image should never change the model used for the next patient.',
    },
  ],
  steps: [
    {
      name: 'Rank the nodes',
      body: 'The 10×10 ResNet-50 feature map becomes 100 spatial nodes (128-d). Each is scored by attention, feature magnitude and similarity to the whole node set.',
      math: 'φᵢ = 0.50·aᵢ + 0.25·mᵢ + 0.25·cᵢ',
    },
    {
      name: 'Intervene, four times',
      body: 'Attenuate the top-ranked nodes at four strengths; attention, fusion and classifier are re-run on the weakened set.',
      math: '(r, ρ) ∈ (0.02, 0.75) (0.05, 0.40) (0.10, 0.20) (0.15, 0.10)',
    },
    {
      name: 'Measure sensitivity',
      body: 'Track how far the expected grade drops at each level; a large, consistent drop gives a high stable sensitivity score.',
      math: 'δ = μΔ / (σΔ + 0.15)',
    },
    {
      name: 'Calibrate, bounded',
      body: 'The sensitivity score sets a per-image temperature inside fixed bounds, sharpening the grade distribution only as far as the evidence allows.',
      math: 'T = clip(1.05 − 0.22·δ, 0.72, 1.08)',
    },
    {
      name: 'Five views + source prior',
      body: 'Repeat for the original, h-flip, v-flip, 90° and 270° views, average, then apply a fixed EyePACS class prior. Nothing is estimated from target images.',
      math: 'p = softmax(log p̄ + 0.18·log π_s)',
    },
  ],
  levels: [
    { r: 0, rho: 1, label: 'No intervention' },
    { r: 0.02, rho: 0.75, label: 'Level 1' },
    { r: 0.05, rho: 0.4, label: 'Level 2' },
    { r: 0.1, rho: 0.2, label: 'Level 3' },
    { r: 0.15, rho: 0.1, label: 'Level 4' },
  ],
  headline: [
    { value: '80.3%', label: 'average AUC across 5 unseen datasets' },
    { value: '42.1%', label: 'average macro-F1' },
    { value: '+2.1 pp', label: 'AUC over source-only' },
    { value: '+6.2 pp', label: 'macro-F1 over source-only' },
    { value: '5 / 5', label: 'datasets with the best AUC' },
  ],
  datasets: ['IDRiD', 'MESSIDOR-2', 'OIA-DDR', 'DeepDRiD', 'SUSTech-SYSU'],
  methods: ['ResNet-50 (source)', 'TENT†', 'EATA†', 'SAR†', 'T3A', 'CF-NODE'],
  /** Table II / III, mean over 5 seeds. rows follow `methods`, columns follow `datasets`, last = Avg */
  auc: [
    [80.8, 78.7, 76.7, 74.9, 80.0, 78.2],
    [81.2, 78.8, 75.9, 74.8, 80.4, 78.2],
    [81.3, 78.9, 77.3, 75.0, 78.1, 78.1],
    [79.2, 78.3, 74.4, 73.9, 82.2, 77.6],
    [80.9, 79.0, 78.2, 76.6, 80.7, 79.1],
    [83.7, 79.9, 78.3, 77.0, 82.4, 80.3],
  ],
  f1: [
    [40.0, 34.1, 28.9, 37.9, 38.4, 35.9],
    [40.4, 41.9, 34.6, 41.2, 35.4, 38.7],
    [39.9, 40.9, 34.3, 40.1, 31.6, 37.4],
    [38.8, 41.6, 32.6, 39.8, 34.8, 37.5],
    [41.4, 38.3, 30.9, 41.0, 28.7, 36.1],
    [48.0, 46.8, 38.8, 39.5, 37.3, 42.1],
  ],
  ablation: [
    { name: 'Fixed scaffold (no intervention)', auc: 79.7, f1: 40.7 },
    { name: 'Random-node intervention', auc: 79.8, f1: 40.7 },
    { name: 'Full CF-NODE (ranked nodes)', auc: 80.3, f1: 42.1 },
  ],
  data: [
    { name: 'EyePACS', role: 'source', n: '3,540', note: 'balanced subset of 35,126 (708 per grade), 2,832 train / 708 val' },
    { name: 'IDRiD', role: 'target', n: '516', note: '' },
    { name: 'MESSIDOR-2', role: 'target', n: '1,744', note: 'gradable of 1,748' },
    { name: 'OIA-DDR', role: 'target', n: '12,522', note: 'grade 0–4 of 13,673' },
    { name: 'DeepDRiD', role: 'target', n: '400', note: 'official validation set' },
    { name: 'SUSTech-SYSU', role: 'target', n: '1,151', note: '68 laser-spot / scar images excluded' },
  ],
  setup: [
    'ImageNet-initialised ResNet-50, 320×320 input, 10×10×2048 feature map → 100 nodes',
    'Attention-based DeepSets node pooling + learnable GeM global descriptor',
    'Cross-entropy (label smoothing 0.05) + focal loss (γ = 1.8), AdamW, EMA 0.999',
    'Every constant chosen on the EyePACS validation split only, before any external evaluation',
    'Mean ± SD over 5 seeds; paired t-test vs the second-best method',
    'PyTorch on two NVIDIA Tesla T4 GPUs',
  ],
  honest: [
    'On DeepDRiD, TENT† reaches a higher macro-F1 (41.2% vs 39.5%).',
    'On SUSTech-SYSU, macro-F1 is 1.1 pp below source-only (37.3% vs 38.4%); every method loses F1 there, CF-NODE loses the least.',
    'Evaluated on closed-set DR grading; glaucoma and AMD are future work.',
    'Node sensitivity measures dependence inside the model, not clinical causality.',
  ],
}

export const bibtex = `@misc{g2026cfnode,
  title         = {CF-NODE: Counterfactual Spatial Node Intervention for Test-Time Adaptation Under Domain Shift, Evaluated Across Five Diabetic Retinopathy Datasets},
  author        = {G, Sabarish and Parashar, Deepak},
  year          = {2026},
  eprint        = {2610.22437},
  archivePrefix = {arXiv},
  primaryClass  = {cs.LG},
  doi           = {10.48550/arXiv.2610.22437},
  url           = {https://arxiv.org/abs/2610.22437}
}`

/* ---------------- Journey, experience, education, certs ---------------- */

export type JourneyType = 'Research' | 'Project' | 'Education' | 'Work'

export const journey: {
  when: string
  type: JourneyType
  title: string
  where?: string
  detail: string
  points?: string[]
  tags?: string[]
}[] = [
  {
    when: 'Oct 2026',
    type: 'Research',
    title: 'CF-NODE published on arXiv',
    where: 'arXiv:2610.22437 · with Deepak Parashar',
    detail: 'First-author paper on keeping diabetic-retinopathy grading models reliable on images from new hospitals and cameras, without retraining.',
    points: ['Best average AUC and macro-F1 against TENT, EATA, SAR and T3A on five unseen datasets', 'Open-source code (MIT) with a plug-in run_tta API'],
    tags: ['PyTorch', 'Computer vision', 'Research'],
  },
  // TODO: exact months for each 2026 project
  {
    when: '2026',
    type: 'Project',
    title: 'Building projects end to end',
    detail: 'Analytics, ML and AI-agent projects on real public data, each with a write-up and code on GitHub.',
    points: ['Flight Delay Prediction on 39M flights', 'Credit Policy Optimizer on 789K loans', 'FaceRoll, live in my MSc class', 'CallBack AI voice agent', 'Metric On-Call (in progress)'],
  },
  {
    when: 'Jul 2025 – May 2027',
    type: 'Education',
    title: 'MS, Business Analytics',
    where: 'Manipal Academy of Higher Education · final year',
    detail: 'Where finance experience met statistics and machine learning.',
    points: ['Machine Learning', 'Predictive Analytics', 'Statistical Modeling', 'Data Visualization', 'Big Data Analytics'],
  },
  {
    when: 'Nov 2024 – Feb 2025',
    type: 'Work',
    title: 'Finance Associate · Jetapult',
    where: 'Mobile gaming venture studio · Bengaluru',
    detail: 'Reporting for leadership in a games studio.',
    points: ['Built leadership reports combining user-acquisition and game data', 'Prepared the data behind the investor pitch deck'],
    tags: ['Excel', 'Reporting', 'Dashboards'],
  },
  {
    when: 'Jun 2023 – Nov 2024',
    type: 'Work',
    title: 'Finance Associate · Wego',
    where: 'Online travel search platform · Bengaluru',
    detail: 'Finance data, dashboards and process automation.',
    points: [
      'Cleaned, mapped and validated two years of financial records (BigQuery, SQL, Excel) for the SAP → Oracle NetSuite migration, with the heads of Product, Engineering, Marketing and HR',
      'Built Tableau and Looker dashboards on booking volume, cost per booking and profitability by product and region for leadership',
      'Automated recurring reports with VBA and BigQuery and redesigned the workflow with Six Sigma DMAIC: 27% fewer process steps, 30+ hours saved per week',
    ],
    tags: ['BigQuery', 'SQL', 'Excel', 'VBA', 'Tableau', 'Looker', 'NetSuite', 'Six Sigma'],
  },
  {
    when: 'Jan 2023 – May 2023',
    type: 'Work',
    title: 'Finance Intern · Wego',
    where: 'Bengaluru',
    detail: 'Converted to a full-time role.',
  },
  {
    when: 'Aug 2020 – Aug 2023',
    type: 'Education',
    title: 'BBA, Finance',
    where: 'PES University, Bengaluru',
    detail: 'Finance foundations: accounting, financial reporting and business fundamentals.',
  },
]

/** logos that run across the band under the hero */
export const toolBand: Skill[] = [
  { name: 'Python', icon: 'python' },
  { name: 'Power BI', icon: 'powerbi' },
  { name: 'Tableau', icon: 'tableau' },
  { name: 'Excel', icon: 'microsoftexcel' },
  { name: 'SQL', icon: 'postgresql' },
  { name: 'BigQuery', icon: 'googlebigquery' },
  { name: 'Looker', icon: 'looker' },
  { name: 'pandas', icon: 'pandas' },
  { name: 'scikit-learn', icon: 'scikitlearn' },
  { name: 'Jupyter', icon: 'jupyter' },
  { name: 'Streamlit', icon: 'streamlit' },
  { name: 'PyTorch', icon: 'pytorch' },
]
