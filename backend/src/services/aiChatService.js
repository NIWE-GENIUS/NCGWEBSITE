// backend/src/services/aiChatService.js
// Rule-based AI chat that knows about NCG, can query the DB, and guides users.

const db = require('../database');

// ============================================================
// KNOWLEDGE BASE — hardcoded facts about NCG
// ============================================================
const KNOWLEDGE = {
  company: {
    name: 'NEXT Creatures Group Ltd',
    brand: 'NCG',
    tagline: 'Smart Solutions For Digital Future',
    location: 'Kigali, Rwanda',
    founded: '2024',
    mission: 'To identify real-world challenges and transform innovative ideas into practical, accessible, and sustainable solutions.',
    vision: 'To become a leading innovation and technology company in Africa, recognized for developing practical technologies, empowering young talent, and building solutions that create lasting social and economic impact.',
    email: 'info@nextcreaturesgroup.com',
    phone: '+250 788 123 456',
  },

  services: [
    { name: 'Software & Digital Solutions', slug: 'software', desc: 'Web, mobile, custom software, SaaS, and industry systems.' },
    { name: 'AI & Data Solutions', slug: 'ai-data', desc: 'AI, machine learning, analytics, and intelligent automation.' },
    { name: 'Business Automation', slug: 'automation', desc: 'Workflows, RPA, digital transformation, and process optimization.' },
    { name: 'ICT Infrastructure & Cloud', slug: 'infrastructure', desc: 'Networking, cloud, servers, and managed IT services.' },
    { name: 'Cybersecurity', slug: 'cybersecurity', desc: 'Audits, penetration testing, monitoring, and compliance.' },
    { name: 'IoT & Smart Systems', slug: 'smart-systems', desc: 'Smart homes, buildings, sensors, and industrial IoT.' },
    { name: 'Electrical & Engineering', slug: 'electrical', desc: 'Electrical systems, electronics, embedded, and energy.' },
    { name: 'AgriTech & Smart Agriculture', slug: 'agritech', desc: 'Smart irrigation, IoT agriculture, farm analytics.' },
    { name: 'Technology Consulting', slug: 'consulting', desc: 'IT strategy, digital transformation, and advisory.' },
    { name: 'ICT Training & Capacity Building', slug: 'training', desc: 'Bootcamps, courses, corporate training, and mentorship.' },
  ],

  collaboration: [
    { name: 'Strategic Partnerships', slug: 'strategic' },
    { name: 'Corporate Collaboration', slug: 'corporate' },
    { name: 'NGO & Development', slug: 'ngo' },
    { name: 'Schools & TVET', slug: 'schools' },
    { name: 'Investment & Sponsorship', slug: 'investment' },
    { name: 'Knowledge & Expertise', slug: 'expert' },
    { name: 'Education & Talent', slug: 'education' },
    { name: 'Innovation Collaboration', slug: 'innovation' },
    { name: 'Technology Collaboration', slug: 'technology' },
    { name: 'Community Collaboration', slug: 'community' },
    { name: 'Government Collaboration', slug: 'government' },
    { name: 'Partnership Program', slug: 'partnership' },
  ],

  // Quick navigation helpers
  navigation: {
    home: '/',
    about: '/about',
    services: '/services',
    programs: '/programs',
    projects: '/projects',
    innovation: '/innovation',
    team: '/team',
    blog: '/blog',
    contact: '/contact',
    donation: '/donate',
    login: '/login',
    register: '/register',
    collaboration: '/collaboration',
    search: '/search',
  },
};

// ============================================================
// INTENT DETECTION
// ============================================================
function detectIntent(message) {
  const q = message.toLowerCase().trim();

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)/.test(q)) return 'greeting';
  if (/thank|thanks|appreciate/.test(q)) return 'thanks';
  if (/bye|goodbye|see you/.test(q)) return 'goodbye';
  if (/help|support|assist/.test(q)) return 'help';

  if (/donat|give|support|contribute/.test(q)) return 'donation';
  if (/program|bootcamp|internship|course|coaching|tutoring/.test(q)) return 'programs';
  if (/service|solution|offer/.test(q)) return 'services';
  if (/collabor|partner|partnership/.test(q)) return 'collaboration';
  if (/register|sign up|create account/.test(q)) return 'register';
  if (/login|sign in|log in/.test(q)) return 'login';
  if (/contact|email|phone|call|reach/.test(q)) return 'contact';
  if (/about|company|who are you|ncg|next creatures/.test(q)) return 'about';
  if (/price|cost|fee|pay|payment/.test(q)) return 'pricing';
  if (/certificate|certif/.test(q)) return 'certificate';
  if (/team|staff|member|employee/.test(q)) return 'team';
  if (/project|built/.test(q)) return 'projects';
  if (/innovate|innovation|lab|research/.test(q)) return 'innovation';
  if (/location|where|address|kigali/.test(q)) return 'location';

  if (/urgent|emergency|immediate|asap|help now/.test(q)) return 'urgent';
  if (/problem|issue|error|not working|broken/.test(q)) return 'problem';

  return 'unknown';
}

// ============================================================
// FETCH LIVE DATA FROM DB
// ============================================================
async function fetchPrograms() {
  try {
    return await db.queryMany(
      `SELECT name, slug, category, description_short, price, currency, duration
       FROM programs WHERE published = TRUE ORDER BY display_order LIMIT 10`
    );
  } catch (_) { return []; }
}

async function fetchTeam() {
  try {
    return await db.queryMany(
      `SELECT full_name, position FROM team_members WHERE published = TRUE AND deleted_at IS NULL ORDER BY display_order LIMIT 10`
    );
  } catch (_) { return []; }
}

async function fetchProjects() {
  try {
    return await db.queryMany(
      `SELECT title, slug, category, description_short FROM projects WHERE published = TRUE ORDER BY display_order LIMIT 10`
    );
  } catch (_) { return []; }
}

async function fetchTestimonials() {
  try {
    return await db.queryMany(
      `SELECT name, position, company, content, rating FROM testimonials WHERE published = TRUE AND featured = TRUE LIMIT 5`
    );
  } catch (_) { return []; }
}

// ============================================================
// CORE RESPONSE ENGINE
// ============================================================
async function generateReply(message, { user } = {}) {
  const intent = detectIntent(message);
  const q = message.toLowerCase();

  // ============================================================
  // URGENT / EMERGENCY → notify admin
  // ============================================================
  if (intent === 'urgent' || intent === 'problem' || /emergency|help me now|critical/.test(q)) {
    // Log an urgent notification for admins
    try {
      await db.query(
        `INSERT INTO notifications (user_id, type, title, message, data, is_read)
         SELECT id, 'urgent_chat', 'URGENT: User needs immediate help',
                $1, $2, FALSE
         FROM users WHERE role IN ('admin', 'super_admin') AND deleted_at IS NULL`,
        [
          `User sent urgent message: "${message.substring(0, 200)}"`,
          JSON.stringify({ userEmail: user?.email || 'guest', message, priority: 'high' }),
        ]
      );
    } catch (_) {}

    return {
      text: `I've flagged this as urgent and notified our team immediately. Someone will reach out to you shortly.\n\nFor faster help, you can also:\n• Call us: **+250 788 123 456**\n• Email: **info@nextcreaturesgroup.com**\n• Or use our contact form: [Contact Us](/contact)`,
      links: [
        { label: 'Contact Us', to: '/contact', type: 'primary' },
        { label: 'Call Now', to: 'tel:+250788123456', type: 'secondary' },
      ],
      intent: 'urgent',
    };
  }

  // ============================================================
  // GREETING / FAREWELL / THANKS
  // ============================================================
  if (intent === 'greeting') {
    return {
      text: `Hello! 👋 I'm the NCG assistant. I can help you with:\n\n• **Programs** — Bootcamps, internships, and courses\n• **Services** — Software, AI, IoT, cybersecurity\n• **Collaboration** — Partnerships and ways to work with us\n• **Donations** — Support our mission\n• **Navigation** — Find any page on our site\n\nWhat would you like to explore?`,
      quickReplies: ['Programs', 'Services', 'Donate', 'Collaborate', 'Contact'],
    };
  }

  if (intent === 'thanks') {
    return { text: `You're welcome! Is there anything else I can help you with?` };
  }

  if (intent === 'goodbye') {
    return { text: `Goodbye! Feel free to come back anytime. Have a great day! 🌟` };
  }

  // ============================================================
  // ABOUT / COMPANY
  // ============================================================
  if (intent === 'about') {
    const c = KNOWLEDGE.company;
    return {
      text: `**${c.name}** (${c.brand})\n\n${c.tagline}\n\n📍 ${c.location}\n📅 Founded: ${c.founded}\n\n**Mission:** ${c.mission}\n\n**Vision:** ${c.vision}`,
      links: [
        { label: 'About NCG', to: '/about', type: 'primary' },
        { label: 'Our Team', to: '/team', type: 'secondary' },
      ],
    };
  }

  // ============================================================
  // PROGRAMS — fetch from DB
  // ============================================================
  if (intent === 'programs') {
    const programs = await fetchPrograms();
    if (programs.length === 0) {
      return {
        text: `We offer bootcamps, internships, online learning, coaching, and private tutoring. Visit our Programs page to explore.`,
        links: [{ label: 'View Programs', to: '/programs', type: 'primary' }],
      };
    }
    const list = programs
      .slice(0, 6)
      .map((p) => `• **${p.name}** — ${p.description_short || ''} (${p.duration || 'flexible'})`)
      .join('\n');

    return {
      text: `Here are our current programs:\n\n${list}\n\nClick any program below to learn more and apply.`,
      links: [
        { label: 'View All Programs', to: '/programs', type: 'primary' },
        ...programs.slice(0, 3).map((p) => ({ label: p.name, to: `/programs/${p.slug}`, type: 'secondary' })),
      ],
      quickReplies: ['How to apply', 'Pricing', 'Duration'],
    };
  }

  // ============================================================
  // SERVICES
  // ============================================================
  if (intent === 'services') {
    const list = KNOWLEDGE.services.map((s) => `• **${s.name}** — ${s.desc}`).join('\n');
    return {
      text: `NCG offers 10 service divisions:\n\n${list}\n\nWhich service are you interested in?`,
      links: [
        { label: 'All Services', to: '/services', type: 'primary' },
        { label: 'Software', to: '/features/software', type: 'secondary' },
        { label: 'AI & Data', to: '/features/ai-data', type: 'secondary' },
      ],
      quickReplies: ['Software', 'AI', 'Cybersecurity', 'Consulting'],
    };
  }

  // ============================================================
  // COLLABORATION
  // ============================================================
  if (intent === 'collaboration') {
    const list = KNOWLEDGE.collaboration.map((c) => `• ${c.name}`).join('\n');
    return {
      text: `NCG is open to collaborate with everyone. Here are the ways to work with us:\n\n${list}\n\nWhich one fits you?`,
      links: [
        { label: 'Collaborate', to: '/collaboration', type: 'primary' },
        { label: 'Corporate', to: '/features/corporate', type: 'secondary' },
        { label: 'NGO', to: '/features/ngo', type: 'secondary' },
      ],
    };
  }

  // ============================================================
  // DONATION
  // ============================================================
  if (intent === 'donation') {
    // Notify admins
    try {
      await db.query(
        `INSERT INTO notifications (user_id, type, title, message, data, is_read)
         SELECT id, 'donation_interest', 'Donation interest detected',
                $1, $2, FALSE
         FROM users WHERE role IN ('admin', 'super_admin') AND deleted_at IS NULL`,
        [
          `User asked about donations: "${message.substring(0, 200)}"`,
          JSON.stringify({ userEmail: user?.email || 'guest', message }),
        ]
      );
    } catch (_) {}

    return {
      text: `Thank you for wanting to support NCG! 🎉\n\nYour gift helps us:\n• Train students in technology\n• Fund innovation projects\n• Support youth empowerment\n\nYou can give in many ways — individual, corporate, monthly, scholarships, equipment, and more.`,
      links: [
        { label: 'Donate Now', to: '/donate', type: 'primary' },
        { label: 'Scholarships', to: '/donate/scholarships', type: 'secondary' },
        { label: 'Monthly Giving', to: '/donate/monthly', type: 'secondary' },
      ],
      quickReplies: ['How much', 'Is it safe', 'Tax receipt'],
    };
  }

  // ============================================================
  // REGISTER
  // ============================================================
  if (intent === 'register') {
    return {
      text: `Creating an NCG account takes less than 2 minutes! You'll get access to:\n• Program applications\n• Your personal dashboard\n• Course tracking\n• Community features`,
      links: [
        { label: 'Register Now', to: '/register', type: 'primary' },
        { label: 'Sign In', to: '/login', type: 'secondary' },
      ],
    };
  }

  // ============================================================
  // LOGIN
  // ============================================================
  if (intent === 'login') {
    return {
      text: `Welcome back! Sign in to access your dashboard, applications, and messages.`,
      links: [
        { label: 'Sign In', to: '/login', type: 'primary' },
        { label: 'Create Account', to: '/register', type: 'secondary' },
      ],
    };
  }

  // ============================================================
  // CONTACT
  // ============================================================
  if (intent === 'contact') {
    return {
      text: `You can reach NCG at:\n\n📧 **info@nextcreaturesgroup.com**\n📞 **+250 788 123 456**\n📍 Kigali, Rwanda\n\nOr send us a message through our contact form — we respond within 24-48 hours.`,
      links: [
        { label: 'Contact Form', to: '/contact', type: 'primary' },
        { label: 'Email Us', to: 'mailto:info@nextcreaturesgroup.com', type: 'secondary' },
      ],
    };
  }

  // ============================================================
  // TEAM
  // ============================================================
  if (intent === 'team') {
    const team = await fetchTeam();
    if (team.length === 0) {
      return {
        text: `Meet our growing team on the Team page.`,
        links: [{ label: 'Our Team', to: '/team', type: 'primary' }],
      };
    }
    const list = team.slice(0, 5).map((m) => `• **${m.full_name}** — ${m.position}`).join('\n');
    return {
      text: `Here are some of our team members:\n\n${list}`,
      links: [{ label: 'Full Team', to: '/team', type: 'primary' }],
    };
  }

  // ============================================================
  // PROJECTS
  // ============================================================
  if (intent === 'projects') {
    const projects = await fetchProjects();
    if (projects.length === 0) {
      return {
        text: `Explore our projects and case studies.`,
        links: [{ label: 'View Projects', to: '/projects', type: 'primary' }],
      };
    }
    const list = projects.slice(0, 5).map((p) => `• **${p.title}** — ${p.description_short || ''}`).join('\n');
    return {
      text: `Some of our work:\n\n${list}`,
      links: [{ label: 'All Projects', to: '/projects', type: 'primary' }],
    };
  }

  // ============================================================
  // INNOVATION
  // ============================================================
  if (intent === 'innovation') {
    return {
      text: `Our Innovation Lab turns bold ideas into real-world solutions through research, prototyping, and testing — from AI to IoT to smart agriculture.`,
      links: [
        { label: 'Innovation Lab', to: '/innovation', type: 'primary' },
        { label: 'Start a Project', to: '/features/innovation', type: 'secondary' },
      ],
    };
  }

  // ============================================================
  // PRICING
  // ============================================================
  if (intent === 'pricing') {
    const programs = await fetchPrograms();
    const priceList = programs
      .filter((p) => p.price > 0)
      .map((p) => `• **${p.name}** — ${Number(p.price).toLocaleString()} ${p.currency}`)
      .join('\n');
    return {
      text: `Program pricing varies:\n\n${priceList || '• Some programs are free — check the Programs page for details.'}\n\nMany programs offer scholarships for students who need financial support.`,
      links: [
        { label: 'View Programs', to: '/programs', type: 'primary' },
        { label: 'Apply for Scholarship', to: '/donate/scholarships', type: 'secondary' },
      ],
    };
  }

  // ============================================================
  // CERTIFICATE
  // ============================================================
  if (intent === 'certificate') {
    return {
      text: `Yes! Most NCG programs provide certificates upon successful completion. Your certificates are available in your dashboard.`,
      links: [
        { label: 'Programs', to: '/programs', type: 'primary' },
        { label: 'My Dashboard', to: '/dashboard', type: 'secondary' },
      ],
    };
  }

  // ============================================================
  // LOCATION
  // ============================================================
  if (intent === 'location') {
    return {
      text: `We're based in **Kigali, Rwanda** 🇷🇼. Our office operates Monday–Friday, 8:00 AM – 5:00 PM (GMT+2).`,
      links: [{ label: 'Contact Us', to: '/contact', type: 'primary' }],
    };
  }

  // ============================================================
  // HELP
  // ============================================================
  if (intent === 'help') {
    return {
      text: `I can help with many things! Try asking:\n\n• "What programs do you offer?"\n• "How do I register?"\n• "Tell me about your team"\n• "I want to collaborate"\n• "How can I donate?"\n• "Where are you located?"`,
      quickReplies: ['Programs', 'Services', 'Team', 'Contact', 'Donate'],
    };
  }

  // ============================================================
  // FALLBACK — smart keyword matching + general guidance
  // ============================================================
  const keywords = q.split(/\s+/).filter((w) => w.length > 2);
  let bestMatch = null;

  for (const [key, value] of Object.entries(KNOWLEDGE.navigation)) {
    if (keywords.some((k) => key.includes(k) || k.includes(key))) {
      bestMatch = { label: key, to: value };
      break;
    }
  }

  if (bestMatch) {
    return {
      text: `I think you might be looking for our **${bestMatch.label}** page. Let me guide you there.`,
      links: [{ label: `Go to ${bestMatch.label}`, to: bestMatch.to, type: 'primary' }],
    };
  }

  return {
    text: `I'm not sure I understood that completely. I'm here to help with questions about NCG — our programs, services, team, collaborations, or donations.\n\nYou can also try:\n• "What programs do you offer?"\n• "How do I register?"\n• "I want to work with NCG"\n\nFor specific questions, our team is always available at **info@nextcreaturesgroup.com**.`,
    links: [
      { label: 'Contact Us', to: '/contact', type: 'primary' },
      { label: 'Browse Site', to: '/', type: 'secondary' },
    ],
    quickReplies: ['Programs', 'Services', 'Contact', 'Donate'],
  };
}

module.exports = { generateReply, detectIntent };