// frontend/src/pages/LegalPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Loader2, FileText, Calendar, AlertCircle, ArrowLeft,
  Shield, Scale, BookOpen, Cookie, ArrowRight,
} from 'lucide-react';
import api from '../lib/api';

const LEGAL_PAGES = [
  { slug: 'privacy', title: 'Privacy Policy', Icon: Shield },
  { slug: 'terms', title: 'Terms of Service', Icon: Scale },
  { slug: 'code-of-conduct', title: 'Code of Conduct', Icon: BookOpen },
  { slug: 'cookie-policy', title: 'Cookie Policy', Icon: Cookie },
];

export default function LegalPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/legal/${slug}`)
      .then((res) => setPage(res.data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F5F9FB]">
        <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" />
      </div>
    );
  }

  // Fallback content when DB not seeded
  if (!page) {
    const fallbacks = {
      privacy: { title: 'Privacy Policy', content: PRIVACY_FALLBACK },
      terms: { title: 'Terms of Service', content: TERMS_FALLBACK },
      'code-of-conduct': { title: 'Code of Conduct', content: CONDUCT_FALLBACK },
      'cookie-policy': { title: 'Cookie Policy', content: COOKIE_FALLBACK },
    };
    const fallback = fallbacks[slug];
    if (fallback) {
      return <LegalLayout slug={slug} title={fallback.title} content={fallback.content} />;
    }
    return (
      <div className="section container-ncg text-center">
        <AlertCircle className="w-16 h-16 text-[#E74C3C] mx-auto mb-4" />
        <h1 className="section-title">Legal page not found</h1>
        <Link to="/" className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-bold px-6 py-3 rounded-lg mt-4">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>
      </div>
    );
  }

  return <LegalLayout slug={slug} title={page.title} content={page.content} version={page.version} effectiveDate={page.effectiveDate} />;
}

function LegalLayout({ slug, title, content, version = 1, effectiveDate = '2025-01-01' }) {
  const current = LEGAL_PAGES.find((p) => p.slug === slug);

  return (
    <div className="bg-[#F5F9FB]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#064B7A] via-[#062F4A] to-[#031B2A] text-white">
        <div className="container-ncg py-16 md:py-20">
          <div className="max-w-3xl">
            {current && (
              <div className="w-16 h-16 rounded-2xl bg-[#8BCB2A]/20 border border-[#8BCB2A]/40 flex items-center justify-center mb-6">
                <current.Icon className="w-8 h-8 text-[#8BCB2A]" />
              </div>
            )}
            <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold leading-[1.1] mb-4 text-white">
              {title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <FileText className="w-4 h-4" /> Version {version}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Effective {new Date(effectiveDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                <p className="text-xs uppercase tracking-wider font-bold text-[#6D7E89] mb-3">
                  Legal Documents
                </p>
                {LEGAL_PAGES.map((p) => {
                  const Icon = p.Icon;
                  const active = p.slug === slug;
                  return (
                    <Link
                      key={p.slug}
                      to={`/legal/${p.slug}`}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-[#8BCB2A]/10 text-[#064B7A] border-l-2 border-[#8BCB2A]'
                          : 'text-[#6D7E89] hover:bg-[#F5F9FB] hover:text-[#064B7A]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {p.title}
                    </Link>
                  );
                })}
              </div>
            </aside>

            {/* Content */}
            <div className="lg:col-span-3">
              <div
                className="legal-content prose prose-lg max-w-none text-[#163247]"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Footer note */}
              <div className="mt-12 pt-8 border-t border-[#EDF2F5] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="text-sm text-[#6D7E89]">
                  Questions about this document? Contact{' '}
                  <a href="mailto:info@nextcreaturesgroup.com" className="text-[#064B7A] font-semibold hover:underline">
                    info@nextcreaturesgroup.com
                  </a>
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] hover:text-[#8BCB2A]"
                >
                  Contact Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal content styles */}
      <style>{`
        .legal-content h1,
        .legal-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          color: #031B2A;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .legal-content h1 { font-size: 1.875rem; }
        .legal-content h2 { font-size: 1.5rem; padding-top: 0.5rem; }
        .legal-content h3 {
          font-family: 'Space Grotesk', sans-serif;
          color: #031B2A;
          font-weight: 600;
          font-size: 1.125rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .legal-content p {
          font-size: 0.95rem;
          line-height: 1.75;
          margin-bottom: 1rem;
          color: #163247;
        }
        .legal-content ul,
        .legal-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .legal-content li {
          font-size: 0.95rem;
          line-height: 1.75;
          margin-bottom: 0.5rem;
          color: #163247;
        }
        .legal-content ul li { list-style-type: disc; }
        .legal-content ol li { list-style-type: decimal; }
        .legal-content strong { color: #031B2A; font-weight: 600; }
        .legal-content a {
          color: #064B7A;
          font-weight: 600;
          text-decoration: underline;
        }
        .legal-content a:hover { color: #8BCB2A; }
        .legal-content blockquote {
          border-left: 4px solid #8BCB2A;
          background: #F5F9FB;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
          border-radius: 8px;
          font-style: italic;
          color: #6D7E89;
        }
        .legal-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.9rem;
        }
        .legal-content th,
        .legal-content td {
          border: 1px solid #EDF2F5;
          padding: 10px 14px;
          text-align: left;
        }
        .legal-content th {
          background: #F5F9FB;
          font-weight: 600;
          color: #031B2A;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// FALLBACK CONTENT (used if DB hasn't been seeded)
// ============================================================
const PRIVACY_FALLBACK = `
<h1>Privacy Policy</h1>
<p>NEXT Creatures Group Ltd ("NCG", "we", "us") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
<h2>1. Information We Collect</h2>
<ul>
  <li><strong>Personal Info:</strong> Name, email, phone, organization</li>
  <li><strong>Account Info:</strong> Password (hashed), preferences</li>
  <li><strong>Usage Data:</strong> IP address, browser type, pages visited</li>
  <li><strong>Payment Data:</strong> Processed securely via third-party providers</li>
</ul>
<h2>2. How We Use Your Information</h2>
<ul>
  <li>Provide, maintain, and improve our services</li>
  <li>Respond to inquiries and support requests</li>
  <li>Send updates and newsletters (with consent)</li>
  <li>Analyze usage to improve user experience</li>
  <li>Comply with legal obligations</li>
</ul>
<h2>3. Data Sharing</h2>
<p>We do not sell your data. We may share with trusted service providers under strict agreements.</p>
<h2>4. Your Rights</h2>
<p>You have the right to access, correct, delete your data, and unsubscribe at any time. Contact <a href="mailto:info@nextcreaturesgroup.com">info@nextcreaturesgroup.com</a>.</p>
<h2>5. Security</h2>
<p>We implement industry-standard security measures to protect your data.</p>
<h2>6. Contact</h2>
<p>NEXT Creatures Group Ltd · Kigali, Rwanda · info@nextcreaturesgroup.com</p>
`;

const TERMS_FALLBACK = `
<h1>Terms of Service</h1>
<p>Welcome to NEXT Creatures Group Ltd. By accessing our platform, you agree to these terms.</p>
<h2>1. Acceptance of Terms</h2>
<p>Using our services means you accept these terms. If you disagree, please do not use our platform.</p>
<h2>2. User Accounts</h2>
<ul>
  <li>You must provide accurate information</li>
  <li>You are responsible for your account security</li>
  <li>You must be at least 16 years old</li>
  <li>One person, one account</li>
</ul>
<h2>3. Acceptable Use</h2>
<ul>
  <li>No illegal activities</li>
  <li>No harassment or hate speech</li>
  <li>No spam or unauthorized advertising</li>
  <li>No attempts to breach security</li>
</ul>
<h2>4. Intellectual Property</h2>
<p>All NCG content is protected. You may not reproduce without permission.</p>
<h2>5. Limitation of Liability</h2>
<p>NCG is provided "as is". We are not liable for indirect damages.</p>
<h2>6. Termination</h2>
<p>We may suspend or terminate accounts violating these terms.</p>
<h2>7. Changes</h2>
<p>We may update these terms. Continued use means acceptance.</p>
<h2>8. Contact</h2>
<p>info@nextcreaturesgroup.com</p>
`;

const CONDUCT_FALLBACK = `
<h1>Code of Conduct</h1>
<p>NEXT Creatures Group Ltd is committed to a respectful, inclusive, and professional community.</p>
<h2>Our Values</h2>
<ul>
  <li><strong>Integrity</strong> — Act honestly and responsibly</li>
  <li><strong>Respect</strong> — Treat everyone with dignity</li>
  <li><strong>Collaboration</strong> — Work together toward shared goals</li>
  <li><strong>Excellence</strong> — Pursue quality in everything</li>
  <li><strong>Innovation</strong> — Embrace creativity and learning</li>
</ul>
<h2>Expected Behavior</h2>
<ul>
  <li>Be kind, patient, and welcoming</li>
  <li>Use inclusive language</li>
  <li>Accept constructive criticism</li>
  <li>Focus on what's best for the community</li>
  <li>Respect privacy and confidentiality</li>
</ul>
<h2>Unacceptable Behavior</h2>
<ul>
  <li>Harassment, discrimination, or hate speech</li>
  <li>Sexual content or unwelcome advances</li>
  <li>Trolling, insulting comments, personal attacks</li>
  <li>Publishing private information without consent</li>
  <li>Any conduct inappropriate in a professional setting</li>
</ul>
<h2>Enforcement</h2>
<p>Violations may result in warnings, suspension, or permanent ban. Report issues to <a href="mailto:info@nextcreaturesgroup.com">info@nextcreaturesgroup.com</a>.</p>
`;

const COOKIE_FALLBACK = `
<h1>Cookie Policy</h1>
<p>This policy explains how NEXT Creatures Group Ltd uses cookies and similar technologies.</p>
<h2>1. What Are Cookies?</h2>
<p>Cookies are small text files stored on your device when you visit our site.</p>
<h2>2. Types of Cookies We Use</h2>
<ul>
  <li><strong>Essential:</strong> Required for the site to function (login, security)</li>
  <li><strong>Analytics:</strong> Help us understand how visitors use our site</li>
  <li><strong>Functional:</strong> Remember your preferences</li>
  <li><strong>Marketing:</strong> Deliver relevant content and ads (opt-in)</li>
</ul>
<h2>3. Managing Cookies</h2>
<p>You can manage cookies in your browser settings. Disabling may affect site functionality.</p>
<h2>4. Third-Party Cookies</h2>
<p>We may use third-party services (analytics, payment processors) that set their own cookies.</p>
<h2>5. Contact</h2>
<p>info@nextcreaturesgroup.com</p>
`;