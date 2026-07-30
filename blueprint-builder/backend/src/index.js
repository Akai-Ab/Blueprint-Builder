import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${req.method} ${req.path}`);
  if (Object.keys(req.body || {}).length > 0 && !req.path.includes('/generate')) {
    console.log(`  body: ${JSON.stringify(req.body).slice(0, 300)}`);
  }
  next();
});

const blueprints = [];

app.get('/api/blueprints', (_req, res) => {
  console.log(`  → ${blueprints.length} blueprints found`);
  res.json(blueprints);
});

app.get('/api/blueprints/:id', (req, res) => {
  const bp = blueprints.find(b => b.id === req.params.id);
  if (!bp) {
    console.log(`  ✗ blueprint ${req.params.id} not found`);
    return res.status(404).json({ error: 'Blueprint not found' });
  }
  res.json(bp);
});

app.post('/api/blueprints', (req, res) => {
  const bp = { id: crypto.randomUUID(), ...req.body, createdAt: new Date().toISOString() };
  blueprints.push(bp);
  console.log(`  ✓ created ${bp.id} (${blueprints.length} total)`);
  res.status(201).json(bp);
});

app.put('/api/blueprints/:id', (req, res) => {
  const idx = blueprints.findIndex(b => b.id === req.params.id);
  if (idx === -1) {
    console.log(`  ✗ blueprint ${req.params.id} not found for update`);
    return res.status(404).json({ error: 'Blueprint not found' });
  }
  blueprints[idx] = { ...blueprints[idx], ...req.body, updatedAt: new Date().toISOString() };
  console.log(`  ✓ updated ${req.params.id}`);
  res.json(blueprints[idx]);
});

app.delete('/api/blueprints/:id', (req, res) => {
  const idx = blueprints.findIndex(b => b.id === req.params.id);
  if (idx === -1) {
    console.log(`  ✗ blueprint ${req.params.id} not found for delete`);
    return res.status(404).json({ error: 'Blueprint not found' });
  }
  blueprints.splice(idx, 1);
  console.log(`  ✓ deleted ${req.params.id} (${blueprints.length} remaining)`);
  res.status(204).end();
});

app.post('/api/recommendations', (req, res) => {
  const selections = req.body;
  const recommendations = [];

  if (selections.frontend?.includes('Next.js')) {
    recommendations.push('Tailwind CSS', 'Vercel', 'PostgreSQL', 'Prisma');
  }
  if (selections.frontend?.includes('React')) {
    recommendations.push('TypeScript', 'React Router', 'Tailwind CSS');
  }
  if (selections.backend?.some(b => b.startsWith('Node'))) {
    recommendations.push('Express', 'PostgreSQL', 'Redis');
  }
  if (selections.backend?.some(b => b.startsWith('Python'))) {
    recommendations.push('FastAPI', 'PostgreSQL', 'Docker');
  }
  if (selections.database?.includes('PostgreSQL')) {
    recommendations.push('Prisma ORM', 'pgAdmin', 'Connection Pooling');
  }
  if (!selections.authentication || selections.authentication?.length === 0) {
    recommendations.push('Add authentication for user management');
  }
  if (!selections.features?.includes('Automated Testing')) {
    recommendations.push('Add testing framework for reliability');
  }
  if (!selections.quality?.includes('Monitoring')) {
    recommendations.push('Add monitoring for production observability');
  }

  console.log(`  → ${recommendations.length} recommendations generated`);
  res.json(recommendations);
});

app.post('/api/validate', (req, res) => {
  const bp = req.body;
  const issues = [];

  if (!bp.name?.trim()) issues.push({ type: 'missing', field: 'name', message: 'Project name is required' });
  if (!bp.projectType) issues.push({ type: 'missing', field: 'projectType', message: 'Project type is required' });
  if (!bp.frontend?.length && !bp.backend?.length) {
    issues.push({ type: 'missing', field: 'technologies', message: 'Select at least one technology stack (frontend or backend)' });
  }
  if (bp.frontend?.includes('Next.js') && bp.hosting?.length > 0 &&
      !['Vercel', 'AWS'].some(h => bp.hosting.includes(h))) {
    issues.push({ type: 'conflict', message: 'Next.js works best with Vercel or AWS hosting' });
  }
  if (bp.features?.includes('Payments') && !bp.integrations?.some(i => ['Stripe', 'Razorpay'].includes(i))) {
    issues.push({ type: 'missing', message: 'Payments feature needs a payment integration (Stripe or Razorpay)' });
  }

  console.log(`  → ${issues.length} issues found, valid: ${issues.length === 0}`);
  res.json({ valid: issues.length === 0, issues });
});

app.post('/api/generate', (req, res) => {
  const bp = req.body;
  const date = new Date().toISOString().split('T')[0];
  const docs = {
    prd: `# Product Requirements Document\n\n## ${bp.name}\n\n**Date:** ${date}\n**Project Type:** ${bp.projectType}\n**Description:** ${bp.description || 'No description provided'}\n\n### Technology Stack\n- Frontend: ${bp.frontend?.join(', ') || 'TBD'}\n- Backend: ${bp.backend?.join(', ') || 'TBD'}\n- Database: ${bp.database?.join(', ') || 'TBD'}\n\n### Features\n${bp.features?.map(f => `- ${f}`).join('\n') || '- TBD'}\n\n### Integrations\n${bp.integrations?.map(i => `- ${i}`).join('\n') || '- None'}`,
    readme: `# ${bp.name}\n\n${bp.description || ''}\n\n## Tech Stack\n\n- **Frontend:** ${bp.frontend?.join(', ') || 'TBD'}\n- **Backend:** ${bp.backend?.join(', ') || 'TBD'}\n- **Database:** ${bp.database?.join(', ') || 'TBD'}\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Features\n\n${bp.features?.map(f => `- ${f}`).join('\n') || 'TBD'}`,
    apiSpec: `# API Specification\n\n## ${bp.name}\n\n### Base URL\n\`https://api.${bp.name.toLowerCase().replace(/\s+/g, '-')}.com/v1\`\n\n### Authentication\n${bp.features?.includes('Authentication') ? 'JWT Bearer token required' : 'TBD'}\n\n### Endpoints\n\n| Method | Endpoint | Description |\n|--------|----------|-------------|\n| GET | /health | Health check |\n| POST | /api/v1/items | Create item |\n| GET | /api/v1/items | List items |`,
    databaseDesign: `# Database Design\n\n## ${bp.name}\n\n### Tables\n\n**users**\n- id (UUID, PK)\n- email (VARCHAR, UNIQUE)\n- created_at (TIMESTAMP)\n\n**projects**\n- id (UUID, PK)\n- user_id (UUID, FK)\n- name (VARCHAR)\n- created_at (TIMESTAMP)\n\n### Relationships\n- users 1:N projects`
  };

  console.log(`  ✓ generated ${Object.keys(docs).length} documents for "${bp.name}"`);
  res.json(docs);
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error(`[ERROR]`, err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n  Backend running on http://localhost:${PORT}`);
  console.log(`  Endpoints:`);
  console.log(`    GET    /api/blueprints`);
  console.log(`    POST   /api/blueprints`);
  console.log(`    GET    /api/blueprints/:id`);
  console.log(`    PUT    /api/blueprints/:id`);
  console.log(`    DELETE /api/blueprints/:id`);
  console.log(`    POST   /api/recommendations`);
  console.log(`    POST   /api/validate`);
  console.log(`    POST   /api/generate\n`);
});
