import React from 'react';
import { Helmet } from 'react-helmet-async';

const DOMAIN = 'https://www.mysolarwidget.com';

export default function TermsOfService() {
  return (
    <div style={{ background: 'var(--bg, #f1f5f9)', minHeight: '100vh' }}>
      <Helmet>
        <title>Terms of Service | MySolarWidget</title>
        <meta name="description" content="MySolarWidget terms of service. Read our terms and conditions for using the MySolarWidget free solar savings calculator." />
        <link rel="canonical" href={`${DOMAIN}/terms-of-service`} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Page Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '56px 24px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(147,197,253,0.12)', border: '1px solid rgba(147,197,253,0.25)', borderRadius: 999, padding: '4px 14px', marginBottom: 18 }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#93c5fd', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Legal</span>
        </div>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 10, letterSpacing: '-0.02em' }}>Terms of Service</h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Last updated: March 20, 2026</p>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>

        <Section title="1. Acceptance of Terms">
          <p>By accessing or using the MySolarWidget website at mysolarwidget.com (the "Site") or the solar savings calculator (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site or Service.</p>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Site after changes constitutes acceptance of the updated Terms.</p>
        </Section>

        <Section title="2. Description of Service">
          <p>MySolarWidget provides a free online solar savings calculator that estimates solar panel installation costs, monthly savings, and return on investment for residential homeowners in the United States. The calculator uses publicly available data including:</p>
          <ul style={ulStyle}>
            <li>Solar irradiance data from the NREL PVWatts API</li>
            <li>Electricity rate data from the U.S. Energy Information Administration (EIA)</li>
            <li>Current market installation cost estimates</li>
            <li>Federal Investment Tax Credit (ITC) rates</li>
          </ul>
        </Section>

        <Section title="3. Estimates & Disclaimers">
          <p><strong>The calculator provides estimates only.</strong> All results are approximations intended for informational and educational purposes. They do not constitute professional financial, engineering, or installation advice.</p>
          <ul style={ulStyle}>
            <li>Estimates may vary 10–20% from actual installer quotes</li>
            <li>Actual savings depend on your specific home, usage patterns, local rates, and equipment</li>
            <li>Tax credit eligibility depends on your individual tax situation — consult a tax professional</li>
            <li>Solar production will vary with weather, shading, and panel degradation over time</li>
          </ul>
          <p>Always obtain quotes from multiple licensed solar installers before making any purchasing decision.</p>
        </Section>

        <Section title="4. User Responsibilities">
          <p>By using the Service you agree to:</p>
          <ul style={ulStyle}>
            <li>Provide accurate information when requested</li>
            <li>Use the Service only for lawful purposes</li>
            <li>Not attempt to reverse-engineer, scrape, or systematically extract data from the Site</li>
            <li>Not use automated tools to access the Service without prior written consent</li>
            <li>Not submit false or misleading information</li>
          </ul>
        </Section>

        <Section title="5. Lead Submission & Installer Connection">
          <p>The calculator includes an optional lead capture form. By submitting your contact information:</p>
          <ul style={ulStyle}>
            <li>You consent to being contacted by MySolarWidget and/or solar installers in your area</li>
            <li>You understand that submitting the form does not obligate you to purchase anything</li>
            <li>You may opt out of communications at any time</li>
          </ul>
          <p>MySolarWidget is not a solar installer and does not endorse or guarantee any specific installer. We are not responsible for the products, services, or representations made by any installer.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>All content on the Site, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of MySolarWidget or its content suppliers and is protected by applicable copyright and intellectual property laws.</p>
          <p>You may use the Site for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works without our prior written permission.</p>
        </Section>

        <Section title="7. Third-Party Data & Services">
          <p>Our Service incorporates data from third-party sources including NREL, the EIA, and others. We make no representations about the accuracy, completeness, or reliability of such third-party data. References to third-party resources do not constitute an endorsement.</p>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <p>THE SITE AND SERVICE ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          <p>WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>TO THE FULLEST EXTENT PERMITTED BY LAW, MYSOLARWIDGET SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR SERVICE, INCLUDING ANY DECISIONS MADE BASED ON CALCULATOR ESTIMATES.</p>
          <p>Our total liability to you for any claim shall not exceed $100.</p>
        </Section>

        <Section title="10. Indemnification">
          <p>You agree to indemnify, defend, and hold harmless MySolarWidget and its officers, directors, employees, and agents from any claims, damages, losses, and expenses (including reasonable attorneys' fees) arising from your use of the Site or violation of these Terms.</p>
        </Section>

        <Section title="11. Governing Law">
          <p>These Terms are governed by and construed in accordance with the laws of the United States. Any disputes shall be resolved in the applicable courts, and you consent to personal jurisdiction in such courts.</p>
        </Section>

        <Section title="12. Contact Us">
          <p>For questions about these Terms, please contact us:</p>
          <div style={{ background: '#f8fafc', borderRadius: 12, padding: '20px 24px', marginTop: 12 }}>
            <p style={{ margin: 0, lineHeight: 2 }}>
              <strong>MySolarWidget</strong><br />
              Email: <a href="mailto:legal@mysolarwidget.com" style={linkStyle}>legal@mysolarwidget.com</a><br />
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
    <section style={{ marginBottom: 24 }}>
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px 12px', borderBottom: '1px solid #f1f5f9' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h2>
        </div>
        <div style={{ padding: '14px 22px 18px', fontSize: 14, color: '#374151', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {children}
        </div>
      </div>
    </section>
  );
}

const ulStyle = { paddingLeft: 20, margin: '4px 0', lineHeight: 1.8 };
const linkStyle = { color: '#2563eb', textDecoration: 'underline' };
