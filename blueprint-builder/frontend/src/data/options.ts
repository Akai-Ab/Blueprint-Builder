import type { BuilderSection } from '../types';

export const sections: BuilderSection[] = [
  {
    id: 'basics',
    title: 'Project Basics',
    description: 'Tell us about your project',
    key: 'projectType',
    multiple: false,
    options: [
      'Website', 'Web App', 'Mobile App', 'Desktop App',
      'API', 'Browser Extension', 'AI Product', 'CLI Tool', 'Custom'
    ]
  },
  {
    id: 'platforms',
    title: 'Platforms',
    description: 'Where will your project run?',
    key: 'platforms',
    multiple: true,
    options: ['Web', 'iOS', 'Android', 'Desktop', 'CLI']
  },
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Choose your frontend technology',
    key: 'frontend',
    multiple: true,
    options: [
      'Next.js', 'React', 'Vue', 'Angular', 'Svelte', 'Nuxt',
      'Astro', 'Remix', 'Solid.js', 'Qwik', 'HTML/CSS/JS'
    ]
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'Choose your backend technology',
    key: 'backend',
    multiple: true,
    options: [
      'Node.js/Express', 'Python/FastAPI', 'Python/Django', 'Go',
      'Ruby on Rails', 'PHP/Laravel', 'Java/Spring Boot', 'C#/.NET',
      'Rust/Actix', 'Deno', 'Bun/Elysia'
    ]
  },
  {
    id: 'database',
    title: 'Database',
    description: 'Choose your database',
    key: 'database',
    multiple: true,
    options: [
      'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis',
      'Firebase/Firestore', 'Supabase', 'PlanetScale', 'Neon',
      'SQL Server', 'MariaDB', 'DynamoDB', 'Cassandra'
    ]
  },
  {
    id: 'features',
    title: 'Features',
    description: 'Select features for your project',
    key: 'features',
    multiple: true,
    options: [
      'Authentication', 'Dashboard', 'User Profiles', 'Notifications',
      'Messaging/Chat', 'Payments', 'AI Features', 'File Uploads',
      'Analytics', 'Admin Panel', 'Reports', 'Search',
      'Settings', 'Localization', 'Accessibility'
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Connect third-party services',
    key: 'integrations',
    multiple: true,
    options: [
      'Stripe', 'Razorpay', 'Firebase', 'Supabase', 'Cloudinary',
      'AWS', 'Google Cloud', 'GitHub', 'GitLab', 'Slack',
      'Discord', 'Twilio', 'SendGrid', 'Resend', 'Algolia',
      'OpenAI', 'Anthropic', 'Google AI'
    ]
  },
  {
    id: 'quality',
    title: 'Quality & Deployment',
    description: 'Set quality standards and deployment preferences',
    key: 'quality',
    multiple: true,
    options: [
      'Security Hardening', 'Performance Optimization', 'SEO',
      'Accessibility', 'Automated Testing', 'CI/CD Pipeline',
      'Monitoring', 'Error Tracking', 'Logging', 'Documentation'
    ]
  }
];

export const optionDetails: Record<string, {
  description: string;
  bestFor: string;
  advantages: string[];
  limitations: string[];
  difficulty: string;
  popularity: number;
  tags: string[];
  docsUrl?: string;
}> = {
  'Next.js': {
    description: 'React framework for production web applications',
    bestFor: 'SEO-friendly websites, SaaS, dashboards',
    advantages: ['Server-side rendering', 'App Router', 'Fast performance', 'Excellent DX'],
    limitations: ['React knowledge required', 'Can be complex for simple sites'],
    difficulty: 'Intermediate',
    popularity: 98,
    tags: ['frontend', 'react', 'ssr', 'framework']
  },
  'React': {
    description: 'A JavaScript library for building user interfaces',
    bestFor: 'SPAs, interactive UIs, component-based apps',
    advantages: ['Huge ecosystem', 'Component reuse', 'Strong community'],
    limitations: ['Requires build tools', 'SEO needs workarounds'],
    difficulty: 'Intermediate',
    popularity: 97,
    tags: ['frontend', 'ui', 'library']
  },
  'Vue': {
    description: 'Progressive JavaScript framework',
    bestFor: 'SPAs,渐进式 adoption, small to large apps',
    advantages: ['Gentle learning curve', 'Excellent docs', 'Flexible'],
    limitations: ['Smaller ecosystem than React', 'Less corporate backing'],
    difficulty: 'Beginner',
    popularity: 88,
    tags: ['frontend', 'framework', 'progressive']
  },
  'PostgreSQL': {
    description: 'Advanced open-source relational database',
    bestFor: 'Complex queries, data integrity, enterprise apps',
    advantages: ['ACID compliant', 'Strong type system', 'Extensions', 'Mature'],
    limitations: ['Vertical scaling only', 'More complex than MySQL'],
    difficulty: 'Intermediate',
    popularity: 95,
    tags: ['database', 'sql', 'relational']
  },
  'MongoDB': {
    description: 'Leading NoSQL document database',
    bestFor: 'Flexible schemas, rapid prototyping, JSON data',
    advantages: ['Schema-less', 'Easy to scale', 'Great for JSON'],
    limitations: ['No joins', 'Less ACID compliance'],
    difficulty: 'Beginner',
    popularity: 88,
    tags: ['database', 'nosql', 'document']
  },
  'Node.js/Express': {
    description: 'JavaScript runtime with minimalist web framework',
    bestFor: 'APIs, real-time apps, microservices',
    advantages: ['JavaScript everywhere', 'Fast I/O', 'NPM ecosystem'],
    limitations: ['Single-threaded', 'Callback-heavy patterns'],
    difficulty: 'Intermediate',
    popularity: 95,
    tags: ['backend', 'javascript', 'api']
  },
  'Python/FastAPI': {
    description: 'Modern Python web framework for APIs',
    bestFor: 'APIs, ML/AI backends, data services',
    advantages: ['Fast performance', 'Auto docs', 'Type validation'],
    limitations: ['Smaller ecosystem than Django', 'Async complexity'],
    difficulty: 'Intermediate',
    popularity: 90,
    tags: ['backend', 'python', 'api']
  },
  'Stripe': {
    description: 'Payment processing platform',
    bestFor: 'Online payments, subscriptions, marketplaces',
    advantages: ['Excellent DX', 'Global payments', 'Comprehensive docs'],
    limitations: ['Fees per transaction', 'Not available in all countries'],
    difficulty: 'Beginner',
    popularity: 95,
    tags: ['payments', 'integrations']
  },
  'Firebase': {
    description: 'Google\'s app development platform',
    bestFor: 'MVPs, real-time features, serverless apps',
    advantages: ['Free tier', 'Real-time sync', 'Auth + DB + Hosting'],
    limitations: ['Vendor lock-in', 'Can get expensive at scale'],
    difficulty: 'Beginner',
    popularity: 90,
    tags: ['backend', 'baas', 'realtime']
  }
};
