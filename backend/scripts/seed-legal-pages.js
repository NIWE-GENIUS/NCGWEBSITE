// backend/scripts/seed-legal-pages.js
// Run: node scripts/seed-legal-pages.js

require('dotenv').config();
const db = require('../src/database');

const LEGAL_PAGES = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    version: 1,
    effectiveDate: '2025-01-01',
    content: `
<h1>Privacy Policy</h1>
<p><em>Last updated: January 1, 2025</em></p>
<p>NEXT Creatures Group Ltd ("NCG", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our services.</p>

<h2>1. Information We Collect</h2>
<h3>Personal Information</h3>
<ul>
  <li>Name, email address, phone number</li>
  <li>Organization and position</li>
  <li>Location (country, city)</li>
  <li>Profile photo and bio</li>
</ul>
<h3>Account Information</h3>
<ul>
  <li>Encrypted password (bcrypt-hashed, never stored in plain text)</li>
  <li>Account preferences and settings</li>
  <li>Role and permissions</li>
</ul>
<h3>Usage Information</h3>
<ul>
  <li>IP address, browser type, device information</li>
  <li>Pages visited, time spent, referring URLs</li>
  <li>Search queries and interactions</li>
</ul>
<h3>Payment Information</h3>
<p>Payment details are processed securely through third-party providers (Stripe, PayPal, Flutterwave, MTN Mobile Money). NCG does not store credit card details on our servers.</p>

<h2>2. How We Use Your Information</h2>
<ul>
  <li>Provide, operate, and maintain our platform</li>
  <li>Process program applications and enrollments</li>
  <li>Respond to inquiries and provide support</li>
  <li>Send updates, newsletters, and announcements (with consent)</li>
  <li>Analyze usage to improve our services</li>
  <li>Prevent fraud and enhance security</li>
  <li>Comply with legal obligations</li>
</ul>

<h2>3. Legal Basis for Processing (GDPR)</h2>
<p>We process your data based on:</p>
<ul>
  <li><strong>Consent</strong> — For newsletters and marketing</li>
  <li><strong>Contract</strong> — To deliver services you've requested</li>
  <li><strong>Legitimate Interest</strong> — Security, fraud prevention, service improvement</li>
  <li><strong>Legal Obligation</strong> — Compliance with Rwandan and international law</li>
</ul>

<h2>4. Data Sharing and Disclosure</h2>
<p>We do not sell your personal information. We may share data with:</p>
<ul>
  <li>Trusted service providers (hosting, email, payments) under strict agreements</li>
  <li>Legal authorities when required by law</li>
  <li>Business partners with your explicit consent</li>
</ul>

<h2>5. Data Retention</h2>
<ul>
  <li>Account data: Until account deletion + 30 days</li>
  <li>Application data: 5 years (for audit purposes)</li>
  <li>Payment records: 7 years (legal requirement)</li>
  <li>Analytics data: Anonymized after 2 years</li>
</ul>

<h2>6. Your Rights</h2>
<p>Depending on your jurisdiction, you have the right to:</p>
<ul>
  <li><strong>Access</strong> — Request a copy of your data</li>
  <li><strong>Rectify</strong> — Correct inaccurate information</li>
  <li><strong>Delete</strong> — Request deletion ("right to be forgotten")</li>
  <li><strong>Portability</strong> — Export your data in a machine-readable format</li>
  <li><strong>Object</strong> — Object to processing based on legitimate interest</li>
  <li><strong>Withdraw Consent</strong> — Unsubscribe from marketing anytime</li>
</ul>
<p>To exercise these rights, contact <a href="mailto:info@nextcreaturesgroup.com">info@nextcreaturesgroup.com</a>.</p>

<h2>7. Data Security</h2>
<p>We implement industry-standard security measures:</p>
<ul>
  <li>TLS/HTTPS encryption in transit</li>
  <li>Encrypted passwords (bcrypt)</li>
  <li>Regular security audits</li>
  <li>Access controls and role-based permissions</li>
  <li>Secure backup and disaster recovery</li>
</ul>

<h2>8. International Data Transfers</h2>
<p>Your data may be stored and processed in Rwanda and other countries where our service providers operate. We ensure appropriate safeguards (Standard Contractual Clauses) are in place.</p>

<h2>9. Children's Privacy</h2>
<p>Our services are not directed to children under 16. We do not knowingly collect data from children.</p>

<h2>10. Changes to This Policy</h2>
<p>We may update this policy. Material changes will be notified via email or platform announcement.</p>

<h2>11. Contact Us</h2>
<p>NEXT Creatures Group Ltd<br>
Kigali, Rwanda<br>
Email: <a href="mailto:info@nextcreaturesgroup.com">info@nextcreaturesgroup.com</a><br>
Phone: +250 788 123 456</p>
`,
  },

  {
    slug: 'terms',
    title: 'Terms of Service',
    version: 1,
    effectiveDate: '2025-01-01',
    content: `
<h1>Terms of Service</h1>
<p><em>Last updated: January 1, 2025</em></p>
<p>Welcome to NEXT Creatures Group Ltd ("NCG"). These Terms of Service ("Terms") govern your use of our platform, programs, and services. By accessing or using our services, you agree to be bound by these Terms.</p>

<h2>1. Acceptance of Terms</h2>
<p>By using any NCG service, you acknowledge that you have read, understood, and agree to these Terms and our <a href="/legal/privacy">Privacy Policy</a>.</p>

<h2>2. Eligibility</h2>
<ul>
  <li>You must be at least 16 years old</li>
  <li>You must provide accurate and complete information</li>
  <li>You are responsible for maintaining your account security</li>
  <li>One account per person</li>
</ul>

<h2>3. User Accounts</h2>
<ul>
  <li>You are responsible for all activities under your account</li>
  <li>Notify us immediately of unauthorized use</li>
  <li>We reserve the right to suspend accounts violating these Terms</li>
  <li>You can delete your account anytime via settings</li>
</ul>

<h2>4. Acceptable Use</h2>
<p>You agree NOT to:</p>
<ul>
  <li>Violate any applicable laws or regulations</li>
  <li>Harass, abuse, or harm other users</li>
  <li>Post hate speech, discriminatory, or violent content</li>
  <li>Distribute spam, malware, or unauthorized advertising</li>
  <li>Attempt to breach platform security</li>
  <li>Impersonate others</li>
  <li>Scrape or copy our content without permission</li>
</ul>

<h2>5. Intellectual Property</h2>
<p>All NCG content — including text, graphics, logos, code, and design — is owned by NEXT Creatures Group Ltd and protected by copyright and trademark law. You may not reproduce, distribute, or create derivative works without written permission.</p>

<h2>6. Programs and Services</h2>
<ul>
  <li>Program applications are subject to review and approval</li>
  <li>Program fees are non-refundable unless specified</li>
  <li>Certificates are issued upon successful completion</li>
  <li>We reserve the right to modify programs, schedules, or curricula</li>
  <li>Instructors and mentors may change</li>
</ul>

<h2>7. Payments and Refunds</h2>
<ul>
  <li>All fees are displayed in the program details page</li>
  <li>Payments are processed securely via third-party providers</li>
  <li>Refund requests must be submitted within 7 days of payment</li>
  <li>Donations are generally non-refundable</li>
  <li>We may offer scholarships at our discretion</li>
</ul>

<h2>8. User Content</h2>
<p>You retain ownership of content you create (projects, comments, posts). By posting, you grant NCG a worldwide, non-exclusive, royalty-free license to display and promote your content on our platform.</p>

<h2>9. Limitation of Liability</h2>
<p>NCG services are provided "as is" and "as available". We make no warranties, express or implied. To the maximum extent permitted by law, NCG is not liable for indirect, incidental, or consequential damages.</p>

<h2>10. Indemnification</h2>
<p>You agree to indemnify and hold NCG harmless from any claims arising from your use of our services or violation of these Terms.</p>

<h2>11. Termination</h2>
<ul>
  <li>You may delete your account anytime</li>
  <li>We may suspend or terminate accounts that violate these Terms</li>
  <li>Termination does not release you from outstanding obligations</li>
</ul>

<h2>12. Governing Law</h2>
<p>These Terms are governed by the laws of the Republic of Rwanda. Any disputes shall be resolved in the courts of Kigali, Rwanda.</p>

<h2>13. Changes to Terms</h2>
<p>We may update these Terms. Continued use constitutes acceptance. Material changes will be notified.</p>

<h2>14. Contact</h2>
<p>NEXT Creatures Group Ltd<br>
Kigali, Rwanda<br>
Email: <a href="mailto:info@nextcreaturesgroup.com">info@nextcreaturesgroup.com</a></p>
`,
  },

  {
    slug: 'code-of-conduct',
    title: 'Code of Conduct',
    version: 1,
    effectiveDate: '2025-01-01',
    content: `
<h1>Code of Conduct</h1>
<p><em>Effective: January 1, 2025</em></p>
<p>NEXT Creatures Group Ltd is committed to maintaining a respectful, inclusive, and professional community. This Code of Conduct applies to all members, participants, staff, partners, and visitors of our platform and events.</p>

<h2>Our Values</h2>
<ul>
  <li><strong>Integrity</strong> — We act honestly and responsibly in all interactions</li>
  <li><strong>Respect</strong> — We treat everyone with dignity regardless of background</li>
  <li><strong>Collaboration</strong> — We work together toward shared goals</li>
  <li><strong>Excellence</strong> — We pursue quality and continuous improvement</li>
  <li><strong>Innovation</strong> — We embrace creativity, learning, and experimentation</li>
</ul>

<h2>Expected Behavior</h2>
<p>We expect all community members to:</p>
<ul>
  <li>Be kind, patient, and welcoming to everyone</li>
  <li>Use inclusive language and respect different viewpoints</li>
  <li>Give and accept constructive feedback gracefully</li>
  <li>Focus on what is best for the community and NCG's mission</li>
  <li>Respect privacy and confidentiality</li>
  <li>Show empathy toward other community members</li>
  <li>Credit others' work appropriately</li>
  <li>Report concerns about behavior to NCG staff</li>
</ul>

<h2>Unacceptable Behavior</h2>
<p>The following behaviors are considered unacceptable:</p>
<ul>
  <li>Harassment, intimidation, or discrimination of any kind</li>
  <li>Racist, sexist, homophobic, or otherwise offensive language</li>
  <li>Unwelcome sexual attention or advances</li>
  <li>Trolling, insulting comments, or personal attacks</li>
  <li>Publishing others' private information without consent</li>
  <li>Disrupting events, talks, or online discussions</li>
  <li>Violence or threats of violence</li>
  <li>Any conduct inappropriate in a professional setting</li>
</ul>

<h2>Reporting</h2>
<p>If you experience or witness unacceptable behavior, please report it to:</p>
<ul>
  <li>Email: <a href="mailto:info@nextcreaturesgroup.com">info@nextcreaturesgroup.com</a></li>
  <li>Subject line: "Code of Conduct Report"</li>
</ul>
<p>All reports will be handled confidentially. We will respond within 48 hours.</p>

<h2>Enforcement</h2>
<p>Violations may result in:</p>
<ul>
  <li>A warning from NCG staff</li>
  <li>Temporary suspension from the platform or events</li>
  <li>Permanent ban from all NCG services</li>
  <li>Referral to appropriate authorities in severe cases</li>
</ul>

<h2>Scope</h2>
<p>This Code applies to:</p>
<ul>
  <li>Our website and platform</li>
  <li>All NCG events (in-person and virtual)</li>
  <li>Official communication channels (email, Slack, WhatsApp)</li>
  <li>Representation of NCG in any capacity</li>
</ul>

<h2>Attribution</h2>
<p>This Code of Conduct is inspired by the Contributor Covenant and adapted for NEXT Creatures Group's mission and values.</p>

<h2>Questions</h2>
<p>Questions about this Code of Conduct? Contact us at <a href="mailto:info@nextcreaturesgroup.com">info@nextcreaturesgroup.com</a>.</p>
`,
  },

  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    version: 1,
    effectiveDate: '2025-01-01',
    content: `
<h1>Cookie Policy</h1>
<p><em>Effective: January 1, 2025</em></p>
<p>This Cookie Policy explains how NEXT Creatures Group Ltd uses cookies and similar technologies when you visit our platform.</p>

<h2>1. What Are Cookies?</h2>
<p>Cookies are small text files stored on your device by your browser when you visit a website. They help websites remember your actions and preferences over time.</p>

<h2>2. Types of Cookies We Use</h2>

<h3>Essential Cookies (Required)</h3>
<p>Necessary for the platform to function. Cannot be disabled.</p>
<ul>
  <li><strong>auth_token</strong> — Your login session</li>
  <li><strong>csrf_token</strong> — Security protection</li>
  <li><strong>cookie_consent</strong> — Your cookie preferences</li>
</ul>

<h3>Analytics Cookies (Optional)</h3>
<p>Help us understand how visitors use our site so we can improve.</p>
<ul>
  <li><strong>_ga</strong> — Google Analytics user ID</li>
  <li><strong>_gid</strong> — Google Analytics session</li>
  <li><strong>ncg_analytics</strong> — Internal anonymous analytics</li>
</ul>

<h3>Functional Cookies (Optional)</h3>
<p>Remember your preferences for a better experience.</p>
<ul>
  <li><strong>theme</strong> — Light/dark mode preference</li>
  <li><strong>language</strong> — Your preferred language</li>
  <li><strong>recently_viewed</strong> — Your recent activity</li>
</ul>

<h3>Marketing Cookies (Optional)</h3>
<p>Used to deliver relevant content and measure campaign effectiveness.</p>
<ul>
  <li><strong>_fbp</strong> — Facebook Pixel</li>
  <li><strong>_gcl_au</strong> — Google Ads conversion</li>
</ul>

<h2>3. How to Manage Cookies</h2>
<p>You can control cookies through:</p>
<ul>
  <li><strong>Our consent banner</strong> — On your first visit, choose which categories to allow</li>
  <li><strong>Browser settings</strong> — Most browsers allow you to block or delete cookies
    <ul>
      <li>Chrome: Settings → Privacy → Cookies</li>
      <li>Firefox: Preferences → Privacy</li>
      <li>Safari: Preferences → Privacy</li>
      <li>Edge: Settings → Cookies</li>
    </ul>
  </li>
</ul>
<p>Disabling essential cookies may affect platform functionality.</p>

<h2>4. Third-Party Cookies</h2>
<p>Some third-party services set their own cookies when you interact with them:</p>
<ul>
  <li><strong>Google Analytics</strong> — Usage analytics</li>
  <li><strong>Stripe</strong> — Payment processing</li>
  <li><strong>Cloudinary</strong> — Image hosting</li>
</ul>
<p>These third parties have their own privacy and cookie policies.</p>

<h2>5. Cookie Duration</h2>
<ul>
  <li><strong>Session cookies</strong> — Deleted when you close your browser</li>
  <li><strong>Persistent cookies</strong> — Remain until expiry or manual deletion</li>
</ul>

<h2>6. Updates to This Policy</h2>
<p>We may update this Cookie Policy periodically. Changes will be posted here with a new effective date.</p>

<h2>7. Contact</h2>
<p>Questions about our cookie practices? Contact:</p>
<p>NEXT Creatures Group Ltd<br>
Kigali, Rwanda<br>
Email: <a href="mailto:info@nextcreaturesgroup.com">info@nextcreaturesgroup.com</a></p>
`,
  },
];

async function seed() {
  try {
    console.log('\n🌱 Seeding legal pages...\n');

    for (const page of LEGAL_PAGES) {
      const existing = await db.queryOne('SELECT id FROM legal_pages WHERE slug = $1', [page.slug]);

      if (existing) {
        await db.query(
          `UPDATE legal_pages SET title = $1, content = $2, version = $3, effective_date = $4, updated_at = NOW() WHERE slug = $5`,
          [page.title, page.content, page.version, page.effectiveDate, page.slug]
        );
        console.log(`✅ Updated: ${page.title}`);
      } else {
        await db.query(
          `INSERT INTO legal_pages (slug, title, content, version, effective_date, published)
           VALUES ($1, $2, $3, $4, $5, TRUE)`,
          [page.slug, page.title, page.content, page.version, page.effectiveDate]
        );
        console.log(`✅ Created: ${page.title}`);
      }
    }

    console.log('\n🎉 Legal pages seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

seed();