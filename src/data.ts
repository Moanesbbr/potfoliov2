// All portfolio content lives here, so text can change without touching layout.
// Sources: CV (c:/dev/personal/cv), GitHub profile README, public + private repos.

export const profile = {
  name: 'Moanes Ben Brahim',
  short: 'Moanes',
  role: 'Software engineer',
  location: 'Tunis, Tunisia',
  email: 'moanesbbr@gmail.com',
  links: {
    github: 'https://github.com/moanesbbr',
    linkedin: 'https://www.linkedin.com/in/moanesbbr',
    x: 'https://x.com/Moanesbbr',
    calendly: 'https://calendly.com/moanesbbr',
  },
  bio: 'Software engineer and founder of Tunispare, based in Tunis. I build products end to end, from the database to the server they run on.',
  availability: 'Open to work in Tunisia, abroad or remotely.',
}

export const heroWords = {
  left: ['Design', 'Build', 'Ship', 'Repeat'],
  right: ['Web', 'Mobile', 'DevOps', 'AI'],
}

export const stats = [
  '3+ years shipping to production',
  '4 apps published on the stores',
  '168 architecture decisions on Tunispare',
  'AI search in French, darija and English',
  'Clients in Tunisia and the Gulf',
  '31 public repos, plus the private ones',
]

export type Shot = { src: string; alt: string }
export type Theme = 'navy' | 'ink' | 'orange' | 'sky'
export type Product = {
  id: string
  name: string
  kind: string
  role: string
  tagline: string
  story: string
  points: string[]
  metrics: { value: string; label: string }[]
  stack: string[]
  url?: string
  urlLabel?: string
  note?: string
  /** teaser: the one-minute narrated tour (square, subtitled), played in the page; full: the demo film, in a dialog */
  video?: { teaser: string; teaserPoster: string; full: string; poster: string; length: string }
  theme: Theme
  phone?: boolean
  shots: Shot[]
}

export const products: Product[] = [
  {
    id: 'tunispare',
    name: 'Tunispare',
    kind: 'Founder',
    role: 'Founder, since 2025',
    tagline: 'Spare parts and shop software for phone repairers in Tunisia.',
    story:
      'I founded Tunispare and built it alone, from the scrapers that collect part compatibility to the cluster it runs on. Repair workshops find the part that fits, buy it from local suppliers with delivery, and run the shop: stock, till, repair tickets, invoices. It is live since October 2026 and was my graduation project.',
    points: [
      'AI search on a self-hosted Qwen model: French, Tunisian darija and English, typed or spoken, always from Tunispare’s own catalogue',
      'k3s set up with Ansible, CI/CD with GitHub Actions, Prometheus + Grafana + Loki, nightly encrypted backups',
      'Security tested: SAST, dependency and image scanning, DAST, OWASP ASVS Level 2, k6 load tests',
    ],
    metrics: [
      { value: 'Live', label: 'since Oct 2026' },
      { value: '168', label: 'decisions recorded' },
      { value: '4', label: 'apps: API, site, back-office, AI' },
    ],
    stack: ['NestJS', 'Next.js', 'TypeScript', 'MySQL', 'Python', 'Qwen', 'k3s', 'Ansible'],
    url: 'https://tunispare.com',
    urlLabel: 'tunispare.com',
    theme: 'navy',
    video: { teaser: '/video/tunispare-in-one-minute.mp4', teaserPoster: '/video/tunispare-in-one-minute-poster.jpg', full: '/video/tunispare-demo.mp4', poster: '/video/tunispare-poster.jpg', length: '6 min' },
    shots: [
      { src: '/img/tunispare-home.webp', alt: 'Tunispare home page: compatible phone and PC spare parts from Tunisian suppliers' },
      { src: '/img/tunispare-search.webp', alt: 'Tunispare search: offers from nearby suppliers for a Galaxy A52 screen' },
      { src: '/img/tunispare-till.webp', alt: 'Tunispare till: point of sale for a repair shop' },
      { src: '/img/tunispare-grafana.webp', alt: 'Grafana dashboard monitoring Tunispare in production' },
    ],
  },
  {
    id: 'moaneslife',
    name: 'moaneslife',
    kind: 'My own app',
    role: 'Built for myself, used every day since July 2026',
    tagline: 'My coach in my pocket: training, food, water, supplements and progress.',
    story:
      'I built moaneslife to stay consistent while training, and it is the app I open every day. It plans my split and logs every set, reads the macros of a meal from a photo or a sentence, reminds me to drink and take my supplements, and follows my weight trend and progress photos. Using my own product daily taught me what makes an app worth opening again: one-tap inputs, no friction, reminders that arrive on time.',
    points: [
      'Workout programs with splits, per-set logging that pre-fills the last weight, alternative exercises and insights',
      'Food macros from a photo or a sentence with Gemini, Hugging Face as fallback, manual entry as last resort',
      'Water and supplement reminders by Web Push, triggered every 15 minutes by an external scheduler',
      'Installable app behind a PIN, hidden from search engines',
    ],
    metrics: [
      { value: 'Daily', label: 'use since Jul 2026' },
      { value: '7', label: 'trackers in one app' },
      { value: '3-step', label: 'AI fallback chain' },
    ],
    stack: ['Next.js 16', 'TypeScript', 'Tailwind', 'MongoDB', 'Cloudinary', 'Gemini', 'Web Push'],
    note: 'Private app, locked behind a PIN',
    theme: 'ink',
    phone: true,
    shots: [
      { src: '/img/life-today.webp', alt: 'moaneslife Today screen: workout of the day, water and vitamins' },
      { src: '/img/life-workouts.webp', alt: 'moaneslife workouts: current split and sessions' },
      { src: '/img/life-vitamins.webp', alt: 'moaneslife vitamins with AI guidance' },
      { src: '/img/life-login.webp', alt: 'moaneslife PIN screen' },
    ],
  },
  {
    id: 'malltech',
    name: 'Malltech',
    kind: 'Client work',
    role: 'Developer: built it end to end for its owner',
    tagline: 'A full e-commerce platform for the Tunisian market.',
    story:
      'I built the whole platform as three TypeScript services deployed independently: a NestJS + MongoDB REST API, a Next.js storefront and a back-office. It covers the commerce cycle: catalogue, orders, promotions, invoicing, customer support and content, and I set up the server it runs on.',
    points: [
      'Store, admin and API on their own subdomains behind Caddy with automatic HTTPS',
      'Docker images built by GitHub Actions, published to GHCR, deployed on a VPS',
      'Netdata monitoring with an auto-heal script that restarts unhealthy containers',
    ],
    metrics: [
      { value: '3', label: 'independent services' },
      { value: '7', label: 'containers in production' },
      { value: 'CI/CD', label: 'GitHub Actions → GHCR' },
    ],
    stack: ['NestJS', 'MongoDB', 'Next.js', 'Docker', 'Caddy', 'GitHub Actions'],
    note: 'Delivered to its owner. The public store is offline today.',
    theme: 'orange',
    shots: [
      { src: '/img/malltech-store.webp', alt: 'Malltech storefront home page' },
      { src: '/img/malltech-products.webp', alt: 'Malltech back-office product list' },
      { src: '/img/malltech-deploy.webp', alt: 'Malltech deployment architecture on a VPS' },
    ],
  },
  {
    id: 'achabs',
    name: 'Achabs Vintage',
    kind: 'Client work',
    role: 'Developer: built it for the boutique',
    tagline: 'The online shop of a vintage clothing boutique.',
    story:
      'A Laravel 11 store for a vintage fashion brand: catalogue with categories, cart, wishlist and checkout, loyalty-card requests and the shop’s selling points on a map. Banners, media and site settings are managed from an admin panel with an activity log.',
    points: [
      'Customer side: catalogue, cart, wishlist, checkout, billing addresses',
      'Admin side: products, orders, banners, media, site settings, activity log',
    ],
    metrics: [
      { value: 'L11', label: 'Laravel 11' },
      { value: '15', label: 'domain models' },
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Blade', 'JavaScript'],
    note: 'Handed over to the boutique. Its online shop is offline today.',
    theme: 'sky',
    shots: [{ src: '/img/achabs-store.webp', alt: 'Achabs Vintage boutique' }],
  },
]

export const help = [
  {
    title: 'Build',
    text: 'You have an idea or a prototype and need it in production. I take it from spec to a deployed web or mobile product: API, interface and back-office.',
  },
  {
    title: 'Ship',
    text: 'Your product works but shipping hurts. I set up containers, Kubernetes, CI/CD, monitoring and backups so a release is a button, not a day.',
  },
  {
    title: 'Automate',
    text: 'Your team retypes the same data every week. I build scrapers, data pipelines and AI features on your own data, self-hosted when privacy matters.',
  },
]

export type Partner = { name: string; note: string; logo: string }

export const workedWith: Partner[] = [
  { name: 'Traveltodo', note: 'Employer', logo: '/img/logos/traveltodo.webp' },
  { name: 'Iberis', note: 'Employer', logo: '/img/logos/iberis.webp' },
  { name: 'Solidwall Consulting', note: 'Employer', logo: '/img/logos/solidwall.webp' },
  { name: 'Malltech', note: 'Client', logo: '/img/logos/malltech.webp' },
  { name: 'Achabs Vintage', note: 'Client', logo: '/img/logos/achabs.webp' },
  { name: 'Ceni-Comores', note: 'Government client', logo: '/img/logos/ceni.webp' },
  { name: 'Vacyss', note: 'Mobile app', logo: '/img/logos/vacyss.webp' },
  { name: 'DentalStore TN', note: 'Mobile app', logo: '/img/logos/dentalstore.webp' },
  { name: 'Fitnuvo', note: 'Mobile app', logo: '/img/logos/fitnuvo.webp' },
]

export type Step = { period: string; title: string; role: string; text: string; current?: boolean }
export type Track = { id: string; label: string; steps: Step[] }

// Three parallel tracks: studies, employment, and my own company.
// Traveltodo is my current job; Tunispare is the company I founded alongside it.
export const tracks: Track[] = [
  {
    id: 'education',
    label: 'Education',
    steps: [
      { period: '2019 – 2023', title: 'ISET Radès', role: 'Bachelor in Information Technology', text: 'First web and mobile projects: a football club site, a PHP store, a Flutter food-delivery app.' },
      { period: '2023 – 2026', title: 'TEK-UP University', role: 'Software engineering degree', text: 'Engineering cycle done alongside full-time work. Graduation project: Tunispare.' },
    ],
  },
  {
    id: 'work',
    label: 'Work',
    steps: [
      { period: 'Feb 2023 – Apr 2024', title: 'Solidwall Consulting', role: 'Mobile developer', text: 'Four Flutter apps on the App Store and Google Play, and an electoral platform for the Comoros government.' },
      { period: 'May – Jul 2024', title: 'Iberis', role: 'Full-stack developer', text: 'Features end to end with Laravel and Vue.js on a regular release cycle.' },
      { period: 'Aug 2024 – now', title: 'Traveltodo', role: 'Software engineer', text: 'Legacy platform and its rewrite in Laravel + Vue/TypeScript, and the platform’s DevOps on AWS.', current: true },
    ],
  },
  {
    id: 'founder',
    label: 'Founder',
    steps: [
      { period: '2025 – now', title: 'Tunispare', role: 'Founder', text: 'Built alone next to my job. Live since October 2026 with a self-hosted AI search, on a cluster I run myself.', current: true },
    ],
  },
]

export type LabStatus = 'Live' | 'Open source' | 'Private' | 'Academic'
export type LabItem = { name: string; text: string; status: LabStatus; url?: string }

export const lab: LabItem[] = [
  { name: 'TEK-UP Grades Calculator', text: 'Privacy-friendly grades calculator for TEK-UP students: everything stays in the browser.', status: 'Live', url: 'https://tekup-grades-calculator.vercel.app' },
  { name: 'EZanswer', text: 'Real-time trivia for streamers: AI-generated questions, viewers answer in Twitch or Kick chat, first correct answer wins.', status: 'Private' },
  { name: 'WebMaster Pro', text: 'Extensible suite for network management and control on Windows.', status: 'Open source', url: 'https://github.com/Moanesbbr/WebMaster-Pro' },
  { name: 'HotspotKeeper', text: 'Lightweight Windows tool that keeps the mobile hotspot switched on.', status: 'Open source', url: 'https://github.com/Moanesbbr/HotspotKeeper' },
  { name: 'ExpenseFlow', text: 'iOS expense tracker in Swift with AI financial advice, multi-currency and budgets.', status: 'Open source', url: 'https://github.com/Moanesbbr/ExpenseFlow' },
  { name: 'Phone specs dataset', text: 'GSMArena scraper and an anonymised dataset of 10,000+ phone specifications.', status: 'Private' },
  { name: 'FunCalcify', text: 'Seven quirky, SEO-friendly calculators rendered on the server with Express.', status: 'Private' },
  { name: 'SEO Analyzer', text: 'Desktop SEO analysis tool with real-time checks, in Python.', status: 'Open source', url: 'https://github.com/Moanesbbr/seo-analyzer' },
  { name: 'Sports ball classifier', text: 'Keras/TensorFlow CNN that tells five kinds of sports balls apart.', status: 'Open source', url: 'https://github.com/Moanesbbr/sports-ball-classifier' },
  { name: 'Expense Tracker API tests', text: 'Full QA of a Node.js API: test plan, test cases, Jest and Supertest.', status: 'Open source', url: 'https://github.com/Moanesbbr/expense-tracker-api-comprehensive-testing' },
  { name: 'CDN Downloader', text: 'GUI that downloads CSS and JS assets from CDNs for local use.', status: 'Open source', url: 'https://github.com/Moanesbbr/cdn-downloader-bot' },
  { name: 'urls-to-asset', text: 'Converts CSS url() paths into Laravel Blade asset() calls.', status: 'Open source', url: 'https://github.com/Moanesbbr/urls-to-asset' },
  { name: 'FitConnect', text: 'Ionic + Angular app connecting clients with fitness coaches.', status: 'Academic', url: 'https://github.com/Moanesbbr/fitconnect' },
  { name: 'Clubisti', text: 'Site for a Tunisian football club in HTML, CSS and Bootstrap.', status: 'Academic', url: 'https://clubisti.vercel.app' },
  { name: '24shop', text: 'Online store for Tunisia in native PHP and JavaScript.', status: 'Academic', url: 'https://24shop-tau.vercel.app' },
]

export const stack = [
  { title: 'Product', items: ['Laravel', 'NestJS', 'Next.js', 'Vue.js', 'React', 'Angular', 'Flutter'] },
  { title: 'Data & AI', items: ['MySQL', 'MongoDB', 'Firestore', 'Python', 'Qwen, self-hosted', 'Gemini', 'TensorFlow'] },
  { title: 'Infra', items: ['Docker', 'Kubernetes / k3s', 'Terraform', 'Ansible', 'GitHub Actions', 'Prometheus · Grafana · Loki', 'AWS'] },
  { title: 'Quality', items: ['Pest · PHPUnit', 'Jest', 'Trivy · Semgrep', 'OWASP ASVS', 'k6', 'Postman', 'Figma'] },
]

export const channels = [
  { name: 'Calendly', text: 'Book a 30-minute call straight into my calendar.', handle: 'calendly.com/moanesbbr', href: 'https://calendly.com/moanesbbr' },
  { name: 'GitHub', text: 'Open-source tools, side projects and experiments.', handle: 'moanesbbr', href: 'https://github.com/moanesbbr' },
  { name: 'LinkedIn', text: 'Work history and longer notes on what I ship.', handle: 'moanesbbr', href: 'https://www.linkedin.com/in/moanesbbr' },
  { name: 'Tunispare blog', text: 'Guides for repair workshops and parts suppliers, in French.', handle: 'tunispare.com/blog', href: 'https://tunispare.com/blog' },
  { name: 'X', text: 'Short updates while I build.', handle: '@Moanesbbr', href: 'https://x.com/Moanesbbr' },
  { name: 'Email', text: 'The fastest way to reach me.', handle: 'moanesbbr@gmail.com', href: 'mailto:moanesbbr@gmail.com' },
]

export const nav = [
  { label: 'Products', href: '#products' },
  { label: 'Lab', href: '#lab' },
  { label: 'Work with me', href: '#help' },
  { label: 'Path', href: '#path' },
  { label: 'Stack', href: '#stack' },
]
