// src/pages/services/ServiceDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import CTABox from '../../components/shared/CTABox';

const SERVICE_DATA = {
  'software': {
    title: 'Software & Digital Solutions',
    tagline: 'Build digital products and systems for businesses, institutions, and individuals.',
    sections: [
      { title: 'Web & Digital', items: ['Website Design & Development', 'Web Application Development', 'E-commerce Platforms', 'Booking & Reservation Systems'] },
      { title: 'Mobile & Apps', items: ['Mobile App Development', 'Cross-Platform Apps', 'UI/UX Design', 'App Maintenance & Support'] },
      { title: 'Enterprise Software', items: ['Custom Software Development', 'ERP Systems', 'CRM Systems', 'Business Management Systems', 'School Management Systems', 'Hospital Management Systems'] },
      { title: 'Data & Integration', items: ['Database Design', 'API Development & Integration', 'System Integration', 'Legacy Modernization', 'Payment Systems', 'SaaS Development'] },
    ],
  },
  'ai-data': {
    title: 'AI & Data Solutions',
    tagline: 'AI-powered solutions, machine learning, analytics and intelligent automation.',
    sections: [
      { title: 'AI Solutions', items: ['AI Strategy & Consulting', 'AI Chatbots', 'Virtual Assistants', 'Generative AI', 'AI Agents'] },
      { title: 'Machine Learning', items: ['ML Models', 'Deep Learning', 'NLP', 'Computer Vision'] },
      { title: 'Data Analytics', items: ['Predictive Analytics', 'Business Intelligence', 'Data Visualization', 'Data Engineering', 'Data Warehousing'] },
      { title: 'AI Implementation', items: ['AI Integration & Deployment', 'AI-Powered Recommendations', 'AI Document Processing', 'AI Customer Support'] },
    ],
  },
  'automation': {
    title: 'Business Automation & Digital Transformation',
    tagline: 'Transform your business with intelligent automation and digital workflows.',
    sections: [
      { title: 'Process Automation', items: ['Business Process Automation', 'Workflow Automation', 'RPA', 'AI-Powered Automation'] },
      { title: 'Document & Communication', items: ['Document Automation', 'Approval Workflows', 'Email Automation', 'WhatsApp/Chat Automation'] },
      { title: 'Business Functions', items: ['Finance & Accounting', 'HR Automation', 'Inventory', 'Sales & Marketing'] },
      { title: 'Digital Transformation', items: ['Strategy & Roadmap', 'Process Optimization', 'Paperless Office', 'Digital Workflow Design'] },
    ],
  },
  'infrastructure': {
    title: 'ICT Infrastructure & Cloud',
    tagline: 'Enterprise-grade infrastructure, cloud solutions and managed IT services.',
    sections: [
      { title: 'Networking', items: ['Network Design', 'LAN/WAN Installation', 'Wi-Fi Solutions', 'Enterprise Networking'] },
      { title: 'Cloud Services', items: ['Cloud Migration', 'Cloud Infrastructure', 'Cloud Backup', 'Disaster Recovery'] },
      { title: 'Server & Hosting', items: ['Server Installation & Management', 'Data Center Solutions', 'Managed Hosting', 'Virtualization'] },
      { title: 'Managed IT', items: ['IT Helpdesk', 'Managed IT Services', 'Infrastructure Monitoring', 'IT Equipment Installation'] },
    ],
  },
  'cybersecurity': {
    title: 'Cybersecurity',
    tagline: 'Protect your organization with comprehensive security solutions and consulting.',
    sections: [
      { title: 'Assessment', items: ['Cybersecurity Consulting', 'Security Audits', 'Vulnerability Assessment', 'Penetration Testing'] },
      { title: 'Implementation', items: ['Network Security', 'Application Security', 'Cloud Security', 'Endpoint Security', 'IAM'] },
      { title: 'Monitoring & Response', items: ['Security Monitoring', 'Incident Response', 'Backup & DR', 'Security Architecture'] },
      { title: 'Training & Compliance', items: ['Security Awareness', 'Policy Development', 'Compliance & Risk', 'Security Testing'] },
    ],
  },
  'smart-systems': {
    title: 'Smart Systems & IoT',
    tagline: 'Connected systems, IoT devices and smart automation for homes and businesses.',
    sections: [
      { title: 'Smart Home', items: ['Home Automation', 'Smart Lighting', 'Energy Management', 'Smart Appliances'] },
      { title: 'Smart Security', items: ['Smart Security Systems', 'Access Control', 'Smart Sensors', 'Remote Monitoring'] },
      { title: 'IoT Solutions', items: ['IoT Device Development', 'Sensor Systems', 'IoT Dashboards', 'Asset Tracking'] },
      { title: 'Industrial IoT', items: ['Industrial Automation', 'Building Automation', 'Environmental Monitoring', 'Equipment Monitoring'] },
    ],
  },
  'electrical': {
    title: 'Electrical & Engineering Technology',
    tagline: 'Electrical systems, electronics, embedded systems and energy solutions.',
    sections: [
      { title: 'Electrical Systems', items: ['System Design', 'Installation', 'Testing', 'Maintenance'] },
      { title: 'Energy Solutions', items: ['Solar Power Systems', 'Energy Management', 'Energy Audits', 'Backup Power'] },
      { title: 'Electronics & Embedded', items: ['Embedded Systems', 'Electronics Design', 'PCB Design', 'Microcontroller Systems'] },
      { title: 'Control Systems', items: ['Control Systems', 'Hardware Prototyping', 'HW-SW Integration', 'Smart Energy'] },
    ],
  },
  'agritech': {
    title: 'AgriTech & Smart Agriculture',
    tagline: 'Technology-driven agricultural solutions for efficiency and sustainability.',
    sections: [
      { title: 'Smart Irrigation', items: ['Smart Irrigation Systems', 'Automated Irrigation', 'Water Management', 'Weather Monitoring'] },
      { title: 'IoT Agriculture', items: ['IoT Agriculture', 'Soil Monitoring', 'Crop Monitoring', 'Greenhouse Automation'] },
      { title: 'Farm Analytics', items: ['Farm Management Systems', 'Agricultural Data Analytics', 'Precision Agriculture', 'Livestock Monitoring'] },
      { title: 'Advanced AgriTech', items: ['Agricultural Drones', 'Smart Fertilization', 'AI Crop Analysis', 'Farm ERP'] },
    ],
  },
  'consulting': {
    title: 'Technology Consulting',
    tagline: 'Strategic technology advisory, digital transformation, and IT project consulting.',
    sections: [
      { title: 'IT Strategy', items: ['IT Strategy & Consulting', 'Technology Assessment', 'Digital Transformation', 'Technology Roadmaps'] },
      { title: 'Advisory', items: ['Software Selection', 'Vendor Selection', 'IT Procurement', 'System Architecture'] },
      { title: 'AI Consulting', items: ['AI Readiness', 'AI Strategy', 'Use-Case Identification', 'Implementation Roadmap'] },
      { title: 'Business Consulting', items: ['Business Process Analysis', 'Process Optimization', 'Digitalization Strategy', 'Technology ROI'] },
    ],
  },
  'training': {
    title: 'ICT Training & Capacity Building',
    tagline: 'Professional training, bootcamps, internships and capacity building programs.',
    sections: [
      { title: 'Technical Training', items: ['Programming', 'Web & Mobile', 'Databases', 'Networking & Security'] },
      { title: 'Advanced Technology', items: ['Cloud Computing', 'AI & ML', 'Data Science', 'IoT & Electronics'] },
      { title: 'Programs', items: ['Technology Bootcamps', 'Internships', 'Apprenticeships', 'Online Courses'] },
      { title: 'Corporate & Individual', items: ['Corporate Training', 'Mentorship & Coaching', 'Private Tutoring', 'Certification Prep'] },
    ],
  },
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICE_DATA[slug];

  if (!service) {
    return (
      <div className="section container-ncg text-center">
        <p className="text-[#E74C3C] mb-4">Service not found</p>
        <Link to="/services" className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-6 py-3 rounded-md">Back to Services</Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
        <div className="relative container-ncg py-20 md:py-28">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/70 hover:text-[#8BCB2A] mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <h1 className="text-4xl md:text-5xl font-heading font-bold leading-[1.1] mb-4 text-white">
            {service.title}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl">{service.tagline}</p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.sections.map((section, si) => (
              <div key={si} className="border border-[#EDF2F5] rounded-2xl p-7">
                <h3 className="font-heading font-bold text-xl text-[#031B2A] mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2 text-sm text-[#163247]">
                      <CheckCircle2 className="w-4 h-4 text-[#8BCB2A] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Ready to Work Together"
        title="Discuss Your"
        highlight="Project"
        subtitle="Let's talk about your needs and how we can help."
        primary={{ to: '/contact', label: 'Contact Us' }}
        secondary={{ to: '/register', label: 'Get Started' }}
      />
    </>
  );
}