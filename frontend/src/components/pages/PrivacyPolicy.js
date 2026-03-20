import React from 'react';
import { Helmet } from 'react-helmet-async';

const DOMAIN = 'https://www.mysolarwidget.com';

export default function PrivacyPolicy() {
  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <Helmet>
        <title>Privacy Policy — MySolarWidget</title>
        <meta name="description" content="MySolarWidget privacy policy. Learn how we collect, use, and protect your personal information when you use our free solar savings calculator." />
        <link rel="canonical" href={`${DOMAIN}/privacy-policy`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 40 }}>Last updated: March 20, 2026</p>

        <Section title="1. Introduction">
          <p>MySolarWidget ("we," "us," or "our") operates the website at mysolarwidget.com (the "Site"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Site or use our free solar savings calculator.</p>
          <p>By using our Site you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use the Site.</p>
        </Section>

        <Section title="2. Information We Collect">
          <h3 style={h3Style}>Information You Provide</h3>
          <p>When you use the solar calculator you may optionally provide:</p>
          <ul style={ulStyle}>
            <li>Name, email address, and phone number (lead capture form)</li>
            <li>ZIP code or state</li>
            <li>Monthly electricity bill amount</li>
            <li>Home and roof details</li>
            <li>Solar financing preference</li>
          </ul>
          <p>This information is provided voluntarily. You may use the calculator without submitting your contact details.</p>

          <h3 style={h3Style}>Automatically Collected Information</h3>
          <p>When you visit our Site we automatically collect certain information, including:</p>
          <ul style={ulStyle}>
            <li><strong>Usage data:</strong> pages visited, time spent, buttons clicked, calculator steps completed</li>
            <li><strong>Device data:</strong> browser type and version, operating system, screen resolution, language</li>
            <li><strong>IP address</strong> (used to infer general geographic region; not stored linked to personal data)</li>
            <li><strong>Cookies and similar tracking technologies</strong> (see Section 5)</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul style={ulStyle}>
            <li>Provide and improve the solar savings calculator</li>
            <li>Deliver your personalized solar estimate</li>
            <li>Connect you with solar installers if you request a quote (with your consent)</li>
            <li>Send you relevant solar information you have requested</li>
            <li>Analyze site usage to improve user experience</li>
            <li>Comply with legal obligations</li>
            <li>Detect and prevent fraud or abuse</li>
          </ul>
          <p>We do <strong>not</strong> sell your personal information to third parties.</p>
        </Section>

        <Section title="4. Sharing Your Information">
          <p>We may share your information with:</p>
          <ul style={ulStyle}>
            <li><strong>Solar installers:</strong> If you submit the lead capture form and request to be connected with an installer, your contact information is shared with that installer. You will be informed before this happens.</li>
            <li><strong>Service providers:</strong> Third-party vendors who assist us in operating our Site (e.g., hosting, analytics, email services). These vendors are contractually obligated to keep your information confidential and use it only to provide services to us.</li>
            <li><strong>Legal requirements:</strong> If required by law, regulation, or legal process.</li>
            <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          </ul>
        </Section>

        <Section title="5. Cookies & Tracking Technologies">
          <p>We use cookies and similar technologies to:</p>
          <ul style={ulStyle}>
            <li>Remember your calculator progress</li>
            <li>Analyze site traffic (Google Analytics)</li>
            <li>Serve relevant advertisements (Google AdSense, if applicable)</li>
          </ul>
          <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of the Site may not function properly without cookies.</p>

          <h3 style={h3Style}>Google Analytics</h3>
          <p>We use Google Analytics to understand how visitors interact with our Site. Google Analytics collects information such as how often users visit the Site, which pages they visit, and what other sites they used before coming to our Site. We use this information to improve our Site. Google's ability to use and share information collected by Google Analytics is restricted by the <a href="https://marketingplatform.google.com/about/analytics/terms/us/" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google Analytics Terms of Service</a>.</p>

          <h3 style={h3Style}>Google AdSense</h3>
          <p>We may display advertisements served by Google AdSense. Google uses cookies to serve ads based on your prior visits to our Site and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={linkStyle}>Google Ads Settings</a>.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain personal information only as long as necessary to fulfill the purposes described in this policy, or as required by law. Calculator usage data and contact form submissions are retained for up to 12 months. You may request deletion of your data at any time (see Section 8).</p>
        </Section>

        <Section title="7. Data Security">
          <p>We implement industry-standard security measures to protect your information, including HTTPS encryption, access controls, and secure database storage. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        </Section>

        <Section title="8. Your Rights & Choices">
          <p>Depending on your location, you may have the following rights:</p>
          <ul style={ulStyle}>
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Opt-out:</strong> Opt out of marketing communications at any time</li>
            <li><strong>Data portability:</strong> Request your data in a portable format</li>
          </ul>
          <p>To exercise these rights, contact us at <a href="mailto:privacy@mysolarwidget.com" style={linkStyle}>privacy@mysolarwidget.com</a>.</p>
          <p><strong>California residents</strong> have additional rights under the California Consumer Privacy Act (CCPA). We do not sell personal information as defined by the CCPA.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>Our Site is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately so we can delete it.</p>
        </Section>

        <Section title="10. Third-Party Links">
          <p>Our Site may contain links to third-party websites (such as NREL, government energy sites, or solar installers). We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.</p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will post the updated policy on this page with a revised "last updated" date. We encourage you to review this policy periodically. Continued use of the Site after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="12. Contact Us">
          <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px 24px', marginTop: 12 }}>
            <p style={{ margin: 0, lineHeight: 2 }}>
              <strong>MySolarWidget</strong><br />
              Email: <a href="mailto:privacy@mysolarwidget.com" style={linkStyle}>privacy@mysolarwidget.com</a><br />
              Website: <a href={DOMAIN} style={linkStyle}>www.mysolarwidget.com</a>
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #e2e8f0' }}>{title}</h2>
      <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </section>
  );
}

const h3Style = { fontSize: 16, fontWeight: 600, color: '#0f172a', marginTop: 8, marginBottom: 4 };
const ulStyle = { paddingLeft: 20, margin: '4px 0', lineHeight: 1.8 };
const linkStyle = { color: '#1e40af', textDecoration: 'underline' };
