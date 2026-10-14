// src/data/featureData.js
// Every "Learn More" links to one of these slugs.
// Each feature explains: what it is, how it aligns with NCG, and why it matters for Rwanda & Africa.

export const FEATURES = {
  // ============================================================
  // COLLABORATION FEATURES
  // ============================================================
  strategic: {
    category: 'Collaboration',
    icon: 'Handshake',
    title: 'Strategic Partnerships',
    tagline: 'Long-term collaboration for lasting impact',
    color: '#064B7A',
    overview: `Strategic partnerships are long-term alliances between NCG and organizations
      that share our vision of using technology to solve real problems. Unlike one-off
      projects, strategic partnerships build joint roadmaps, shared resources, and
      multi-year commitments that compound impact over time.`,
    alignment: [
      {
        title: 'Rwanda Vision 2050 Alignment',
        text: 'Rwanda\'s Vision 2050 aims to transform the country into a high-income, knowledge-based economy. Strategic partnerships accelerate this by pooling expertise, capital, and networks across public, private, and civil society sectors.',
      },
      {
        title: 'Africa\'s Agenda 2063',
        text: 'The African Union\'s Agenda 2063 calls for a "prosperous Africa based on inclusive growth and sustainable development." Strategic partnerships align directly by creating long-term infrastructure for technology, education, and innovation.',
      },
      {
        title: 'NCG\'s Mission',
        text: 'NCG exists to identify real-world challenges and transform innovative ideas into practical, accessible, and sustainable solutions. Strategic partnerships are how we scale this mission beyond what any single organization can do alone.',
      },
      {
        title: 'Why It Matters for Technology Enthusiasts',
        text: 'For young African technologists, strategic partnerships mean funded projects, mentorship pipelines, cross-border collaboration, and access to opportunities that would otherwise be out of reach.',
      },
    ],
    benefits: [
      'Co-created technology, education, and innovation roadmaps',
      'Access to NCG\'s full talent and engineering ecosystem',
      'Shared infrastructure, research, and networks',
      'Measurable social and economic impact reporting',
      'Multi-year engagement with predictable outcomes',
    ],
    howItWorks: [
      { step: '01', title: 'Reach Out', text: 'Contact NCG via our partnership form or email partnerships@nextcreaturesgroup.com.' },
      { step: '02', title: 'Discovery', text: 'A 30-minute call to align goals, values, and mutual interests.' },
      { step: '03', title: 'Design', text: 'Co-create a partnership framework with clear KPIs, timeline, and resource commitments.' },
      { step: '04', title: 'Launch & Scale', text: 'Execute together, measure impact quarterly, and expand as results compound.' },
    ],
    cta: {
      primary: { label: 'Start a Partnership', to: '/register' },
      secondary: { label: 'Contact Partnership Team', to: '/contact?purpose=partnership' },
      donation: { label: 'Support Our Mission', to: '/donate' },
    },
  },

  corporate: {
    category: 'Collaboration',
    icon: 'Building2',
    title: 'Corporate Collaboration',
    tagline: 'Partner with Africa\'s next generation of technologists',
    color: '#8BCB2A',
    overview: `Corporate collaboration gives companies direct access to NCG's talent
      pipeline, engineering capacity, and innovation ecosystem. From co-developing
      products to sponsoring programs to hiring trained graduates — corporations
      plug into a working innovation infrastructure.`,
    alignment: [
      {
        title: 'Bridging the Skills Gap',
        text: 'Rwanda\'s ICT sector grows ~15% annually, but companies struggle to find skilled developers, engineers, and analysts. Corporate collaboration with NCG addresses this directly through talent pipelines and co-designed training.',
      },
      {
        title: 'CSR That Actually Works',
        text: 'Rwanda\'s corporate sector increasingly seeks measurable CSR. NCG provides transparent, technology-driven community programs with quarterly impact reports.',
      },
      {
        title: 'Local Innovation Advantage',
        text: 'African problems need African solutions. Corporate partners gain early access to NCG-developed technologies designed for local realities — from smart agriculture to fintech infrastructure.',
      },
      {
        title: 'Employee Engagement & Purpose',
        text: 'Corporate teams that mentor, sponsor, or co-build with NCG report stronger employee engagement and purpose — critical for retention in competitive markets.',
      },
    ],
    benefits: [
      'Direct access to NCG-trained developers, engineers, and analysts',
      'Co-development of products, systems, and pilot projects',
      'Brand visibility across NCG\'s public platform and programs',
      'Measurable CSR impact with quarterly reporting',
      'Priority hiring from NCG\'s graduate cohort',
      'Custom employee-giving and volunteering programs',
    ],
    howItWorks: [
      { step: '01', title: 'Corporate Inquiry', text: 'Submit your corporate interest via our form or email partnerships@nextcreaturesgroup.com.' },
      { step: '02', title: 'Needs Assessment', text: 'We assess your hiring, co-development, or CSR goals and propose a fit.' },
      { step: '03', title: 'Agreement & Launch', text: 'Formalize the engagement (MOU, sponsorship, or hiring contract) and start.' },
      { step: '04', title: 'Quarterly Reviews', text: 'Measure outcomes, adjust scope, and report impact.' },
    ],
    cta: {
      primary: { label: 'Become a Corporate Partner', to: '/register' },
      secondary: { label: 'Talk to Corporate Team', to: '/contact?purpose=partnership' },
      donation: { label: 'Sponsor a Program', to: '/donate/programs' },
    },
  },

  ngo: {
    category: 'Collaboration',
    icon: 'Globe2',
    title: 'NGO & Development Partnerships',
    tagline: 'Technology for social impact at scale',
    color: '#F39C12',
    overview: `NGOs and development organizations partner with NCG to use technology
      as a tool for social impact. Together we deliver digital skills training,
      build tools for community organizations, and reach underserved populations
      with technology that actually fits their needs.`,
    alignment: [
      {
        title: 'SDG Alignment',
        text: 'NCG-NGO partnerships directly contribute to UN Sustainable Development Goals 4 (Quality Education), 8 (Decent Work), 9 (Industry & Innovation), and 17 (Partnerships for the Goals).',
      },
      {
        title: 'Digital Inclusion in Rwanda',
        text: 'Rwanda has 96% mobile penetration but only ~30% meaningful internet access in rural areas. NGO-NCG partnerships bridge this digital divide with targeted training and offline-first tools.',
      },
      {
        title: 'Youth Empowerment',
        text: 'Over 60% of Africa\'s population is under 25. NGOs working with NCG reach these young people with digital skills, mentorship, and job pathways.',
      },
      {
        title: 'Community-Led Innovation',
        text: 'NGOs bring deep community trust; NCG brings technology. Together we build solutions that are technically sound AND culturally appropriate.',
      },
    ],
    benefits: [
      'Digital skills training for your beneficiaries',
      'Custom-built tools and platforms',
      'Data collection, monitoring & evaluation systems',
      'Youth digital empowerment programs',
      'Joint grant applications and funding',
      'Impact measurement dashboards',
    ],
    howItWorks: [
      { step: '01', title: 'Intro Call', text: 'Discuss your mission, beneficiaries, and technology needs.' },
      { step: '02', title: 'Co-Design Workshop', text: 'Joint workshop with your team and NCG engineers.' },
      { step: '03', title: 'Pilot', text: 'Launch a small pilot program with clear metrics.' },
      { step: '04', title: 'Scale & Report', text: 'Expand the program and publish impact results.' },
    ],
    cta: {
      primary: { label: 'Start NGO Partnership', to: '/register' },
      secondary: { label: 'Contact NGO Team', to: '/contact?purpose=partnership' },
      donation: { label: 'Support Digital Inclusion', to: '/donate' },
    },
  },

  schools: {
    category: 'Collaboration',
    icon: 'School',
    title: 'Schools & TVET Partnerships',
    tagline: 'Building future-ready students',
    color: '#9B59B6',
    overview: `NCG partners with secondary schools and TVET institutions to deliver
      practical ICT education, teacher training, and industry-aligned curriculum.
      Students graduate with real skills, real portfolios, and real career pathways.`,
    alignment: [
      {
        title: 'Rwanda\'s TVET Strategy',
        text: 'Rwanda\'s Ministry of Education aims to enroll 60% of secondary students in TVET by 2024. NCG partners on the ICT track, ensuring TVET graduates are industry-ready.',
      },
      {
        title: 'Closing the Curriculum Gap',
        text: 'Most schools teach outdated ICT theory. NCG brings real-world projects, modern tools, and instructor training into the classroom.',
      },
      {
        title: 'Teacher Development',
        text: 'We train teachers, not just students. This multiplies impact as each trained teacher reaches hundreds of learners over their career.',
      },
      {
        title: 'Career Pathways',
        text: 'NCG connects graduates directly to internships, bootcamps, and employers — closing the loop from classroom to career.',
      },
    ],
    benefits: [
      'ICT skills training programs (programming, networks, digital literacy)',
      'Teacher professional development',
      'Student projects, hackathons, and competitions',
      'Lab setup and equipment support',
      'Industry-aligned curriculum development',
      'Career guidance and job placement support',
    ],
    howItWorks: [
      { step: '01', title: 'Connect', text: 'Reach out with your school\'s goals and current ICT capacity.' },
      { step: '02', title: 'Assessment', text: 'NCG visits or video-calls to assess resources and needs.' },
      { step: '03', title: 'Plan', text: 'Co-design a partnership plan tailored to your school.' },
      { step: '04', title: 'Deliver & Grow', text: 'Deliver programs, track student progress, expand annually.' },
    ],
    cta: {
      primary: { label: 'Partner Your School', to: '/register' },
      secondary: { label: 'Contact Schools Team', to: '/contact?purpose=training' },
      donation: { label: 'Sponsor a Student', to: '/donate/scholarships' },
    },
  },

  investment: {
    category: 'Collaboration',
    icon: 'HeartHandshake',
    title: 'Investment & Sponsorship',
    tagline: 'Invest in Africa\'s innovation future',
    color: '#16A085',
    overview: `NCG offers investors and sponsors direct access to Africa's most
      promising technology projects, startups, and programs. Every investment is
      structured for measurable social and economic return.`,
    alignment: [
      {
        title: 'Africa\'s Tech Investment Gap',
        text: 'African tech startups raised $4.9B in 2023 — less than 1% of global VC. NCG opens a curated, de-risked pipeline for investors who want exposure to African innovation.',
      },
      {
        title: 'Rwanda as Testbed',
        text: 'Rwanda\'s regulatory environment, digital infrastructure, and government support make it Africa\'s best testbed for new technology ventures.',
      },
      {
        title: 'Impact + Return',
        text: 'NCG projects combine commercial viability with social impact — from agritech to fintech to education — creating dual returns.',
      },
      {
        title: 'Structured Transparency',
        text: 'Every NCG investment comes with clear KPIs, quarterly reporting, and transparent financials.',
      },
    ],
    benefits: [
      'Early access to NCG-developed startups and IP',
      'Curated deal flow in agritech, AI, IoT, and education',
      'Direct co-investment opportunities',
      'Quarterly impact and financial reporting',
      'Advisory board and mentorship roles',
      'Tax-advantaged giving in Rwanda',
    ],
    howItWorks: [
      { step: '01', title: 'Initial Inquiry', text: 'Contact us with your investment thesis and interests.' },
      { step: '02', title: 'Due Diligence', text: 'Review our portfolio, financials, and roadmaps.' },
      { step: '03', title: 'Structure', text: 'Design the investment or sponsorship structure.' },
      { step: '04', title: 'Deploy & Report', text: 'Deploy capital and receive quarterly impact reports.' },
    ],
    cta: {
      primary: { label: 'Invest With NCG', to: '/register' },
      secondary: { label: 'Contact Investment Team', to: '/contact?purpose=investment' },
      donation: { label: 'Make a Donation', to: '/donate' },
    },
  },

  expert: {
    category: 'Collaboration',
    icon: 'Users',
    title: 'Knowledge & Expertise',
    tagline: 'Share your skills, shape the future',
    color: '#E67E22',
    overview: `NCG invites professionals, researchers, educators, and technical experts
      to contribute their knowledge. Whether you mentor one student or train a
      cohort of 50, your expertise multiplies through NCG's platform.`,
    alignment: [
      {
        title: 'Africa\'s Mentorship Deficit',
        text: 'Many African tech professionals navigate their careers without mentors. NCG connects them with experienced practitioners globally.',
      },
      {
        title: 'Reverse Knowledge Transfer',
        text: 'Diaspora professionals bring global best practices; local experts bring deep contextual knowledge. NCG is the bridge.',
      },
      {
        title: 'Train-the-Trainer Model',
        text: 'Every expert who trains with NCG trains future trainers — creating exponential impact over years.',
      },
      {
        title: 'Community of Practice',
        text: 'NCG builds a sustained community of practitioners who support each other long after formal training ends.',
      },
    ],
    benefits: [
      'Mentor emerging talent through structured programs',
      'Deliver workshops, lectures, and training',
      'Contribute to research and R&D projects',
      'Share industry insights through our platform',
      'Build your professional brand and network',
      'Access to NCG\'s innovation ecosystem',
    ],
    howItWorks: [
      { step: '01', title: 'Register Interest', text: 'Tell us your expertise and availability.' },
      { step: '02', title: 'Match', text: 'We match you with programs, mentees, or projects that fit.' },
      { step: '03', title: 'Onboard', text: 'Brief orientation to NCG\'s tools and expectations.' },
      { step: '04', title: 'Contribute', text: 'Deliver mentoring, training, or research — on your schedule.' },
    ],
    cta: {
      primary: { label: 'Contribute Expertise', to: '/register' },
      secondary: { label: 'Contact Expert Team', to: '/contact?purpose=mentorship' },
      donation: { label: 'Fund a Mentor', to: '/donate' },
    },
  },

  education: {
    category: 'Collaboration',
    icon: 'GraduationCap',
    title: 'Education & Talent Development',
    tagline: 'From classroom to career',
    color: '#E91E63',
    overview: `Education and talent development is NCG's core mission. We partner
      with institutions, companies, and governments to create learning pathways
      that lead directly to employment, entrepreneurship, or further study.`,
    alignment: [
      {
        title: 'Rwanda\'s Human Capital Goals',
        text: 'Rwanda targets 200,000 new TVET graduates per year by 2030. NCG contributes directly through training, internships, and job placement.',
      },
      {
        title: 'Africa\'s Youth Bulge',
        text: '10-12 million young Africans enter the job market each year, but only ~3 million formal jobs are created. Education + entrepreneurship programs are essential.',
      },
      {
        title: 'Skills-Based Hiring',
        text: 'NCG pioneers skills-based, portfolio-driven hiring — reducing reliance on credentials and increasing real capability.',
      },
      {
        title: 'Lifelong Learning',
        text: 'Technology changes fast. NCG builds continuous learning habits in its community, not just one-time certifications.',
      },
    ],
    benefits: [
      'Training programs (technical + soft skills)',
      'Paid internship opportunities',
      'Scholarships for underserved students',
      'Mentorship matching with professionals',
      'Portfolio-building real projects',
      'Job placement support',
    ],
    howItWorks: [
      { step: '01', title: 'Identify Need', text: 'Employers or individuals tell us what skills are needed.' },
      { step: '02', title: 'Design Program', text: 'We design training, internships, or scholarships to fit.' },
      { step: '03', title: 'Deliver', text: 'Run the program with clear learning outcomes.' },
      { step: '04', title: 'Place & Track', text: 'Support job placement and track long-term outcomes.' },
    ],
    cta: {
      primary: { label: 'Partner With Us', to: '/register' },
      secondary: { label: 'Contact Education Team', to: '/contact?purpose=training' },
      donation: { label: 'Sponsor a Student', to: '/donate/scholarships' },
    },
  },

  innovation: {
    category: 'Collaboration',
    icon: 'Lightbulb',
    title: 'Innovation Collaboration',
    tagline: 'From idea to real-world impact',
    color: '#E74C3C',
    overview: `Bring us a problem, an idea, or an opportunity — we research it,
      prototype it, test it, and build the solution. NCG's innovation pipeline
      turns concepts into working technology.`,
    alignment: [
      {
        title: 'Rwanda\'s Innovation Ecosystem',
        text: 'Rwanda ranks #1 in East Africa for innovation (Global Innovation Index). NCG is part of this ecosystem, translating that ranking into real projects.',
      },
      {
        title: 'Africa\'s Problem-Rich Environment',
        text: 'Africa has the world\'s biggest unsolved problems in health, agriculture, education, and finance. Each one is an innovation opportunity.',
      },
      {
        title: 'Local-to-Global Model',
        text: 'NCG builds solutions for African problems, then exports them to similar markets globally — from sub-Saharan Africa to Southeast Asia.',
      },
      {
        title: 'AI + IoT for Africa',
        text: 'NCG specializes in applied AI and IoT that fits African infrastructure: offline-first, solar-powered, mobile-money-native.',
      },
    ],
    benefits: [
      'Feasibility research and technical assessment',
      'Rapid prototyping and MVP development',
      'Full-stack software + hardware capability',
      'Real-world testing and iteration',
      'IP co-development agreements',
      'Scale-up support',
    ],
    howItWorks: [
      { step: '01', title: 'Ideation', text: 'Share your problem or idea with NCG.' },
      { step: '02', title: 'Discovery', text: 'Joint research into feasibility and market.' },
      { step: '03', title: 'Prototype', text: 'Build a working prototype to test.' },
      { step: '04', title: 'Build & Launch', text: 'Develop the full solution and deploy.' },
      { step: '05', title: 'Scale', text: 'Grow adoption and measure impact.' },
    ],
    cta: {
      primary: { label: 'Start Innovation Project', to: '/register' },
      secondary: { label: 'Contact Innovation Lab', to: '/contact?purpose=collaboration' },
      donation: { label: 'Fund Innovation', to: '/donate/projects' },
    },
  },

  technology: {
    category: 'Collaboration',
    icon: 'Cpu',
    title: 'Technology Collaboration',
    tagline: 'Build with Africa\'s engineering talent',
    color: '#3498DB',
    overview: `Technology collaboration means co-developing software, IoT, AI, cloud,
      or engineering solutions with NCG's technical team. Whether you're a startup,
      enterprise, or research institution — we build together.`,
    alignment: [
      {
        title: 'Rwanda\'s ICT Hub Ambition',
        text: 'Rwanda aims to become Africa\'s ICT hub by 2035. NCG contributes through software, AI, and IoT engineering that\'s globally competitive.',
      },
      {
        title: 'Open-Source Movement',
        text: 'NCG contributes to open-source and shares IP where appropriate — accelerating the broader African tech ecosystem.',
      },
      {
        title: 'Cloud-First Architecture',
        text: 'African infrastructure constraints make cloud-first, low-bandwidth-optimized systems essential. NCG specializes in these.',
      },
      {
        title: 'Cross-Border Talent',
        text: 'NCG collaborates across Rwanda, Kenya, Uganda, Tanzania, and the diaspora — building a pan-African engineering team.',
      },
    ],
    benefits: [
      'Co-development of software, mobile, and web apps',
      'AI/ML model development and deployment',
      'IoT device design and manufacturing',
      'Cloud architecture and DevOps',
      'Cybersecurity assessments',
      'Long-term engineering partnership',
    ],
    howItWorks: [
      { step: '01', title: 'Scope Call', text: 'Define the technical challenge or product scope.' },
      { step: '02', title: 'Architecture', text: 'Design the system architecture and stack.' },
      { step: '03', title: 'Build Sprints', text: 'Agile development with weekly demos.' },
      { step: '04', title: 'Deploy & Maintain', text: 'Launch, monitor, and iterate.' },
    ],
    cta: {
      primary: { label: 'Start Tech Collaboration', to: '/register' },
      secondary: { label: 'Contact Engineering', to: '/contact?purpose=collaboration' },
      donation: { label: 'Fund Technology Projects', to: '/donate/projects' },
    },
  },

  community: {
    category: 'Collaboration',
    icon: 'Network',
    title: 'Community Collaboration',
    tagline: 'Building Africa\'s tech community',
    color: '#1ABC9C',
    overview: `Communities are where technology meets purpose. NCG supports and
      co-builds tech communities, developer groups, and grassroots initiatives
      across Rwanda and Africa.`,
    alignment: [
      {
        title: 'Rwanda\'s Tech Community Growth',
        text: 'Rwanda\'s developer community grew 3x between 2020-2024. NCG fuels this through events, open-source, and mentorship.',
      },
      {
        title: 'Pan-African Networks',
        text: 'NCG connects communities across Africa — from Kigali to Nairobi to Lagos to Accra — building shared knowledge and opportunities.',
      },
      {
        title: 'Diversity in Tech',
        text: 'NCG actively supports women in tech, rural developers, and underrepresented groups through targeted community programs.',
      },
      {
        title: 'Community-Led Content',
        text: 'We publish, podcast, and share what our community builds — amplifying local voices globally.',
      },
    ],
    benefits: [
      'Co-hosting tech meetups, hackathons, and conferences',
      'Speaker series and knowledge-sharing events',
      'Study groups and peer learning',
      'Open-source contribution support',
      'Community-led project funding',
      'Cross-border networking',
    ],
    howItWorks: [
      { step: '01', title: 'Reach Out', text: 'Tell us about your community and goals.' },
      { step: '02', title: 'Co-Plan', text: 'Design events or programs together.' },
      { step: '03', title: 'Launch', text: 'Host events, fund projects, or support initiatives.' },
      { step: '04', title: 'Sustain', text: 'Build recurring programs, not one-offs.' },
    ],
    cta: {
      primary: { label: 'Join the Community', to: '/register' },
      secondary: { label: 'Contact Community Team', to: '/contact?purpose=collaboration' },
      donation: { label: 'Support Community Programs', to: '/donate' },
    },
  },

  government: {
    category: 'Collaboration',
    icon: 'FlaskConical',
    title: 'Government Collaboration',
    tagline: 'Technology for public good',
    color: '#34495E',
    overview: `NCG collaborates with government institutions on national digital
      initiatives, e-government services, ICT education policy, and public-sector
      innovation.`,
    alignment: [
      {
        title: 'Rwanda\'s Digital Government',
        text: 'Rwanda aims for 100% digital government services by 2026. NCG contributes engineering, AI, and data expertise.',
      },
      {
        title: 'National ICT Policy',
        text: 'NCG aligns with Rwanda\'s National Digital Transformation Policy, contributing to skills, infrastructure, and innovation pillars.',
      },
      {
        title: 'Data-Driven Governance',
        text: 'NCG builds data platforms that help government make evidence-based decisions.',
      },
      {
        title: 'Public-Private Partnership Models',
        text: 'NCG pioneers PPP frameworks where government provides scale, private sector provides speed, and citizens get better services.',
      },
    ],
    benefits: [
      'Digital government service design and delivery',
      'Public infrastructure engineering',
      'ICT education policy and curriculum',
      'National innovation challenges',
      'Data platforms for public decision-making',
      'Regional development programs',
    ],
    howItWorks: [
      { step: '01', title: 'Formal Engagement', text: 'Government agency reaches out or responds to RFP.' },
      { step: '02', title: 'Scoping', text: 'Define problem, scope, budget, and outcomes.' },
      { step: '03', title: 'Pilot', text: 'Launch a pilot in a specific region or department.' },
      { step: '04', title: 'National Scale', text: 'Expand to national rollout with full reporting.' },
    ],
    cta: {
      primary: { label: 'Government Inquiry', to: '/register' },
      secondary: { label: 'Contact Government Team', to: '/contact?purpose=partnership' },
      donation: { label: 'Support Public Innovation', to: '/donate' },
    },
  },

  partnership: {
    category: 'Collaboration',
    icon: 'Handshake',
    title: 'Partnership Program',
    tagline: 'The formal way to partner with NCG',
    color: '#8E44AD',
    overview: `The NCG Partnership Program is our formal, structured engagement
      framework. Partners get benefits, recognition, and priority access across
      NCG's ecosystem.`,
    alignment: [
      {
        title: 'Scaling Through Partnership',
        text: 'NCG\'s growth depends on partners who amplify our reach — from corporate sponsors to community leaders to international organizations.',
      },
      {
        title: 'Transparent Engagement',
        text: 'Every partnership follows a clear framework: benefits, commitments, KPIs, and reporting.',
      },
      {
        title: 'Recognition Ecosystem',
        text: 'Partners get public recognition across our platform, events, and communications.',
      },
      {
        title: 'Compounding Value',
        text: 'Partners who stay multi-year see compounding benefits as our ecosystem grows.',
      },
    ],
    benefits: [
      'Recognition across all NCG channels',
      'Network access to partners, experts, and innovators',
      'Priority support and dedicated relationship manager',
      'Strategic alignment workshops',
      'Joint initiative opportunities',
      'Early access to new programs and products',
    ],
    howItWorks: [
      { step: '01', title: 'Apply', text: 'Submit your partnership application.' },
      { step: '02', title: 'Review', text: 'NCG team reviews and schedules a call.' },
      { step: '03', title: 'Onboard', text: 'Sign agreement and receive partner welcome kit.' },
      { step: '04', title: 'Engage', text: 'Access all benefits and start collaborating.' },
    ],
    cta: {
      primary: { label: 'Apply for Partnership', to: '/register' },
      secondary: { label: 'Talk to Partnership Team', to: '/contact?purpose=partnership' },
      donation: { label: 'Support Partnership Fund', to: '/donate' },
    },
  },

  // ============================================================
  // SERVICE FEATURES
  // ============================================================
  software: {
    category: 'Service',
    icon: 'Code2',
    title: 'Software & Digital Solutions',
    tagline: 'Modern software for African businesses',
    color: '#064B7A',
    overview: `From websites and mobile apps to ERP and CRM systems, NCG builds
      custom software that fits African business realities — mobile-money ready,
      low-bandwidth optimized, and built to scale.`,
    alignment: [
      {
        title: 'Digitizing African SMEs',
        text: 'Over 90% of African businesses are SMEs, yet most run on paper. NCG\'s software digitizes operations at accessible price points.',
      },
      {
        title: 'Mobile-First Design',
        text: 'Africa skips desktop — over 80% of internet access is mobile. Every NCG system is mobile-first.',
      },
      {
        title: 'Payment Integration',
        text: 'NCG integrates MTN Mobile Money, Airtel Money, and local bank APIs — not just cards.',
      },
      {
        title: 'Multi-language Ready',
        text: 'English, French, Kinyarwanda, Swahili — NCG software ships multilingual from day one.',
      },
    ],
    benefits: [
      'Custom websites & web applications',
      'Mobile apps (iOS, Android, cross-platform)',
      'ERP, CRM, and business management systems',
      'E-commerce and payment platforms',
      'API development and integration',
      'Ongoing maintenance and support',
    ],
    howItWorks: [
      { step: '01', title: 'Discovery', text: 'We understand your business processes and pain points.' },
      { step: '02', title: 'Design', text: 'We design the system and architecture.' },
      { step: '03', title: 'Build', text: 'Agile development with weekly demos.' },
      { step: '04', title: 'Deploy & Support', text: 'Launch, train your team, and provide ongoing support.' },
    ],
    cta: {
      primary: { label: 'Start Software Project', to: '/register' },
      secondary: { label: 'Contact Software Team', to: '/contact?purpose=services' },
      donation: { label: 'Fund a Software Project', to: '/donate/projects' },
    },
  },

  'ai-data': {
    category: 'Service',
    icon: 'Brain',
    title: 'AI & Data Solutions',
    tagline: 'Applied AI for African problems',
    color: '#8BCB2A',
    overview: `NCG builds AI and data solutions designed for African contexts —
      from chatbots that speak Kinyarwanda to predictive analytics for agriculture,
      to business intelligence dashboards for SMEs.`,
    alignment: [
      {
        title: 'AI for African Languages',
        text: 'Most AI tools don\'t work in Kinyarwanda, Swahili, or Amharic. NCG builds language-inclusive AI.',
      },
      {
        title: 'Data-Driven Agriculture',
        text: 'NCG\'s AI models predict crop yields, detect pests, and optimize irrigation — directly improving farmer incomes.',
      },
      {
        title: 'Business Intelligence for SMEs',
        text: 'African SMEs make decisions blind. NCG brings analytics that turn raw data into action.',
      },
      {
        title: 'Responsible AI',
        text: 'NCG follows responsible AI principles: privacy-first, human-in-loop, bias-audited.',
      },
    ],
    benefits: [
      'AI strategy and readiness consulting',
      'Chatbots and virtual assistants',
      'Machine learning model development',
      'Computer vision and NLP',
      'Data analytics and visualization',
      'Business intelligence dashboards',
    ],
    howItWorks: [
      { step: '01', title: 'Assessment', text: 'We evaluate your data readiness and AI potential.' },
      { step: '02', title: 'Design', text: 'We scope the AI use case and success metrics.' },
      { step: '03', title: 'Train & Test', text: 'We build, train, and validate the model.' },
      { step: '04', title: 'Deploy & Monitor', text: 'We deploy to production and monitor for drift.' },
    ],
    cta: {
      primary: { label: 'Explore AI Solutions', to: '/register' },
      secondary: { label: 'Contact AI Team', to: '/contact?purpose=services' },
      donation: { label: 'Fund AI Research', to: '/donate/projects' },
    },
  },

  automation: {
    category: 'Service',
    icon: 'Bot',
    title: 'Business Automation',
    tagline: 'Automate the work, focus on growth',
    color: '#3498DB',
    overview: `NCG automates business processes using workflows, RPA, and AI —
      freeing African businesses from repetitive tasks so they can focus on
      customers and growth.`,
    alignment: [
      {
        title: 'Efficiency for SMEs',
        text: 'Small businesses can\'t afford large ops teams. NCG automation makes them lean and scalable.',
      },
      {
        title: 'Paperless Africa',
        text: 'NCG automates document workflows, moving African businesses from paper to digital.',
      },
      {
        title: 'WhatsApp-First Automation',
        text: 'Since Africa runs on WhatsApp, NCG automates WhatsApp workflows natively.',
      },
      {
        title: 'AI + RPA Combination',
        text: 'NCG combines robotic process automation with AI decision-making for intelligent automation.',
      },
    ],
    benefits: [
      'Business process automation',
      'Workflow and approval systems',
      'RPA (robotic process automation)',
      'Document automation',
      'Email and WhatsApp automation',
      'Finance, HR, and inventory automation',
    ],
    howItWorks: [
      { step: '01', title: 'Process Mapping', text: 'We map your current workflows and bottlenecks.' },
      { step: '02', title: 'Automation Design', text: 'We design the automated workflow.' },
      { step: '03', title: 'Build & Test', text: 'We build, test, and refine the automation.' },
      { step: '04', title: 'Deploy & Train', text: 'Launch and train your team on the new process.' },
    ],
    cta: {
      primary: { label: 'Start Automation', to: '/register' },
      secondary: { label: 'Contact Automation Team', to: '/contact?purpose=services' },
      donation: { label: 'Fund Automation for SMEs', to: '/donate/programs' },
    },
  },

  infrastructure: {
    category: 'Service',
    icon: 'Server',
    title: 'ICT Infrastructure & Cloud',
    tagline: 'Reliable infrastructure for African businesses',
    color: '#F39C12',
    overview: `NCG designs, deploys, and manages ICT infrastructure: networks, cloud,
      servers, and managed IT. Built for African realities — power fluctuations,
      bandwidth constraints, and security needs.`,
    alignment: [
      {
        title: 'Reliable Power + IT',
        text: 'NCG designs infrastructure with UPS, solar backup, and graceful recovery for African power realities.',
      },
      {
        title: 'Cloud for Africa',
        text: 'NCG leverages AWS Cape Town, Azure South Africa, and local data centers to reduce latency.',
      },
      {
        title: 'Security-First Networks',
        text: 'NCG builds networks with firewalls, encryption, and monitoring from day one.',
      },
      {
        title: 'Managed Services',
        text: 'NCG manages infrastructure so African businesses can focus on their core.',
      },
    ],
    benefits: [
      'Network design and installation',
      'Cloud migration and management',
      'Server installation and hosting',
      'Data center solutions',
      'Backup and disaster recovery',
      'Managed IT and helpdesk',
    ],
    howItWorks: [
      { step: '01', title: 'Assessment', text: 'We audit your current infrastructure.' },
      { step: '02', title: 'Design', text: 'We design the target architecture.' },
      { step: '03', title: 'Deploy', text: 'We install, configure, and migrate.' },
      { step: '04', title: 'Manage', text: 'We monitor and manage ongoing.' },
    ],
    cta: {
      primary: { label: 'Build Infrastructure', to: '/register' },
      secondary: { label: 'Contact Infrastructure Team', to: '/contact?purpose=services' },
      donation: { label: 'Fund Infrastructure Programs', to: '/donate/programs' },
    },
  },

  cybersecurity: {
    category: 'Service',
    icon: 'Shield',
    title: 'Cybersecurity',
    tagline: 'Protecting Africa\'s digital businesses',
    color: '#E74C3C',
    overview: `NCG provides cybersecurity services for African organizations:
      audits, penetration testing, monitoring, compliance, and training.
      Protecting the businesses that power Africa\'s digital economy.`,
    alignment: [
      {
        title: 'Rising Cyber Threats',
        text: 'Cyberattacks against African businesses grew 40% in 2024. NCG provides affordable, effective defense.',
      },
      {
        title: 'Rwanda\'s Data Protection Law',
        text: 'Rwanda\'s Law No. 058/2021 requires data protection compliance. NCG helps businesses comply.',
      },
      {
        title: 'Cyber-Aware Workforce',
        text: 'NCG trains employees to spot phishing, social engineering, and other threats.',
      },
      {
        title: 'Africa\'s First Cyber Defenders',
        text: 'NCG trains the first generation of African cybersecurity professionals.',
      },
    ],
    benefits: [
      'Cybersecurity audits and assessments',
      'Penetration testing',
      'Security monitoring (24/7)',
      'Incident response',
      'Compliance (GDPR, ISO 27001)',
      'Security awareness training',
    ],
    howItWorks: [
      { step: '01', title: 'Assessment', text: 'We audit your current security posture.' },
      { step: '02', title: 'Findings', text: 'We deliver a prioritized risk report.' },
      { step: '03', title: 'Remediate', text: 'We help implement fixes and controls.' },
      { step: '04', title: 'Monitor', text: 'We provide ongoing monitoring and response.' },
    ],
    cta: {
      primary: { label: 'Secure Your Business', to: '/register' },
      secondary: { label: 'Contact Security Team', to: '/contact?purpose=services' },
      donation: { label: 'Fund Security Training', to: '/donate/programs' },
    },
  },

  'smart-systems': {
    category: 'Service',
    icon: 'Cpu',
    title: 'IoT & Smart Systems',
    tagline: 'Connected systems for smart Africa',
    color: '#9B59B6',
    overview: `NCG builds IoT and smart systems for homes, buildings, farms, and
      industries. From smart irrigation to factory automation — connected systems
      that make African operations efficient and sustainable.`,
    alignment: [
      {
        title: 'Smart Agriculture',
        text: 'Rwanda\'s agriculture sector employs 70% of the population. NCG\'s IoT solutions double yields through smart irrigation and monitoring.',
      },
      {
        title: 'Smart Cities',
        text: 'Kigali aims to be Africa\'s smartest city. NCG builds the IoT backbone: sensors, networks, dashboards.',
      },
      {
        title: 'Energy Efficiency',
        text: 'NCG\'s smart energy systems reduce consumption 30-40% — critical for Africa\'s power-constrained grids.',
      },
      {
        title: 'Low-Power Design',
        text: 'NCG IoT devices run on batteries, solar, and low-power networks like LoRaWAN.',
      },
    ],
    benefits: [
      'Smart home and building automation',
      'Smart agriculture (irrigation, monitoring)',
      'Industrial IoT and factory automation',
      'Environmental and asset monitoring',
      'Smart energy management',
      'Custom IoT device development',
    ],
    howItWorks: [
      { step: '01', title: 'Discovery', text: 'We identify your automation opportunities.' },
      { step: '02', title: 'Design', text: 'We design the IoT architecture.' },
      { step: '03', title: 'Prototype', text: 'We build and test a working prototype.' },
      { step: '04', title: 'Deploy & Scale', text: 'We deploy to production and scale.' },
    ],
    cta: {
      primary: { label: 'Start IoT Project', to: '/register' },
      secondary: { label: 'Contact IoT Team', to: '/contact?purpose=services' },
      donation: { label: 'Fund Smart Agriculture', to: '/donate/projects' },
    },
  },

  electrical: {
    category: 'Service',
    icon: 'Zap',
    title: 'Electrical & Engineering',
    tagline: 'Powering Africa\'s industry',
    color: '#E67E22',
    overview: `NCG delivers electrical and engineering services: system design,
      installation, maintenance, solar power, and embedded systems. Powering
      Africa\'s homes, businesses, and industries.`,
    alignment: [
      {
        title: 'Rwanda\'s Energy Goals',
        text: 'Rwanda targets 100% electricity access by 2030. NCG contributes solar and electrical expertise.',
      },
      {
        title: 'Solar Africa',
        text: 'Africa has 40% of global solar potential but less than 2% installed capacity. NCG is part of closing this gap.',
      },
      {
        title: 'Embedded Systems',
        text: 'NCG designs embedded systems that power African devices — from smart meters to medical equipment.',
      },
      {
        title: 'Skilled Engineers',
        text: 'NCG trains electrical engineers with hands-on, modern skills.',
      },
    ],
    benefits: [
      'Electrical system design and installation',
      'Solar power system design',
      'Energy audits and management',
      'Embedded and control systems',
      'PCB design and prototyping',
      'Maintenance and support',
    ],
    howItWorks: [
      { step: '01', title: 'Assessment', text: 'We evaluate your electrical or energy needs.' },
      { step: '02', title: 'Design', text: 'We design the system.' },
      { step: '03', title: 'Install', text: 'We install and commission.' },
      { step: '04', title: 'Maintain', text: 'We provide ongoing maintenance.' },
    ],
    cta: {
      primary: { label: 'Start Electrical Project', to: '/register' },
      secondary: { label: 'Contact Engineering', to: '/contact?purpose=services' },
      donation: { label: 'Fund Solar Projects', to: '/donate/projects' },
    },
  },

  agritech: {
    category: 'Service',
    icon: 'Sprout',
    title: 'AgriTech & Smart Agriculture',
    tagline: 'Smart farming for African yields',
    color: '#27AE60',
    overview: `NCG builds AgriTech that doubles yields, reduces water use, and
      connects farmers to markets. From smart irrigation to AI crop analysis —
      technology that transforms African agriculture.`,
    alignment: [
      {
        title: 'Africa\'s Food Challenge',
        text: 'Africa imports $50B of food annually despite having 60% of the world\'s arable land. AgriTech can reverse this.',
      },
      {
        title: 'Rwanda\'s Agriculture Transformation',
        text: 'Rwanda\'s PSTA 4 strategy targets agriculture modernization. NCG is directly contributing.',
      },
      {
        title: 'Smallholder Impact',
        text: '80% of African farmers are smallholders. NCG\'s AgriTech is designed for them — affordable, mobile, and simple.',
      },
      {
        title: 'Climate Resilience',
        text: 'NCG\'s AgriTech helps farmers adapt to climate change through precise monitoring and forecasting.',
      },
    ],
    benefits: [
      'Smart irrigation systems',
      'Soil and crop monitoring',
      'Weather forecasting and alerts',
      'AI-powered crop analysis',
      'Farm management software',
      'Market connection platforms',
    ],
    howItWorks: [
      { step: '01', title: 'Farm Assessment', text: 'We assess your farm and needs.' },
      { step: '02', title: 'Design', text: 'We design a custom AgriTech solution.' },
      { step: '03', title: 'Install & Train', text: 'We install, then train you and your team.' },
      { step: '04', title: 'Support & Scale', text: 'We support ongoing and help you scale.' },
    ],
    cta: {
      primary: { label: 'Transform Your Farm', to: '/register' },
      secondary: { label: 'Contact AgriTech Team', to: '/contact?purpose=services' },
      donation: { label: 'Fund Smart Agriculture', to: '/donate/projects' },
    },
  },

  consulting: {
    category: 'Service',
    icon: 'BarChart3',
    title: 'Technology Consulting',
    tagline: 'Strategic guidance for Africa\'s digital future',
    color: '#16A085',
    overview: `NCG advises businesses, governments, and NGOs on technology strategy:
      digital transformation, AI readiness, IT governance, and technology roadmaps.
      We turn technology from cost to competitive advantage.`,
    alignment: [
      {
        title: 'Africa\'s Digital Transformation',
        text: 'Africa\'s digital economy could reach $180B by 2025. NCG helps organizations capture this opportunity.',
      },
      {
        title: 'Evidence-Based Strategy',
        text: 'NCG consulting is grounded in data, not opinion.',
      },
      {
        title: 'AI Readiness for Africa',
        text: 'Many African organizations aren\'t ready for AI. NCG builds readiness roadmaps.',
      },
      {
        title: 'Technology Governance',
        text: 'NCG helps boards and executives govern technology wisely — with security, ethics, and ROI in mind.',
      },
    ],
    benefits: [
      'IT strategy and roadmaps',
      'Digital transformation planning',
      'AI readiness and strategy',
      'Software selection and vendor advisory',
      'Technology ROI analysis',
      'Process optimization',
    ],
    howItWorks: [
      { step: '01', title: 'Assessment', text: 'We audit your current technology posture.' },
      { step: '02', title: 'Strategy', text: 'We design a tailored technology roadmap.' },
      { step: '03', title: 'Implementation Plan', text: 'We provide a phased execution plan.' },
      { step: '04', title: 'Ongoing Advisory', text: 'We support execution with advisory retainers.' },
    ],
    cta: {
      primary: { label: 'Book a Consultation', to: '/register' },
      secondary: { label: 'Contact Consulting Team', to: '/contact?purpose=services' },
      donation: { label: 'Fund Consulting for NGOs', to: '/donate' },
    },
  },

  training: {
    category: 'Service',
    icon: 'GraduationCap',
    title: 'ICT Training & Capacity Building',
    tagline: 'Building Africa\'s tech workforce',
    color: '#E91E63',
    overview: `NCG trains Africa\'s next generation of technologists — from
      beginner coding to advanced AI to executive digital literacy. Practical,
      project-based, and industry-aligned.`,
    alignment: [
      {
        title: 'Africa\'s Skills Gap',
        text: 'Africa has 700,000+ unfilled tech jobs. NCG training directly addresses this gap.',
      },
      {
        title: 'Rwanda\'s Digital Talent',
        text: 'NCG contributes to Rwanda\'s goal of 100,000 digital jobs by 2030.',
      },
      {
        title: 'Train-the-Trainer',
        text: 'NCG trains teachers who multiply impact across schools.',
      },
      {
        title: 'Lifelong Learning',
        text: 'Technology changes fast. NCG builds learning communities that keep skills current.',
      },
    ],
    benefits: [
      'Bootcamps (8-12 weeks)',
      'Internships (3-6 months)',
      'Online self-paced courses',
      'Corporate training',
      'Teacher training',
      'Executive digital literacy',
    ],
    howItWorks: [
      { step: '01', title: 'Choose Track', text: 'Pick from web, AI, cybersecurity, IoT, and more.' },
      { step: '02', title: 'Learn', text: 'Learn through hands-on projects with mentor support.' },
      { step: '03', title: 'Build', text: 'Build real projects for your portfolio.' },
      { step: '04', title: 'Get Certified & Placed', text: 'Earn your certificate and get job support.' },
    ],
    cta: {
      primary: { label: 'Start Learning', to: '/programs' },
      secondary: { label: 'Contact Training Team', to: '/contact?purpose=training' },
      donation: { label: 'Sponsor a Student', to: '/donate/scholarships' },
    },
  },
};

export function getFeatureBySlug(slug) {
  return FEATURES[slug] || null;
}

export function getFeaturesByCategory(category) {
  return Object.entries(FEATURES)
    .filter(([_, f]) => f.category === category)
    .map(([slug, f]) => ({ slug, ...f }));
}