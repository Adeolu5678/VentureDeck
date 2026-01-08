'use client';

import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const lastUpdated = 'December 26, 2024';

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="prose prose-invert prose-indigo max-w-none space-y-10">
          {/* Introduction */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              VentureDeck, Inc. (&quot;VentureDeck,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and related services (collectively, the &quot;Services&quot;).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our Services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">2.1 Personal Information</h3>
            <p className="text-muted-foreground mb-4">We may collect personally identifiable information that you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li><strong className="text-white/80">Identity Information:</strong> Full name, username, profile photo</li>
              <li><strong className="text-white/80">Contact Information:</strong> Email address, phone number, mailing address</li>
              <li><strong className="text-white/80">Professional Information:</strong> Resume, LinkedIn profile, work history, skills, education</li>
              <li><strong className="text-white/80">Account Credentials:</strong> Password and security questions (encrypted)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">2.2 Financial Information</h3>
            <p className="text-muted-foreground mb-4">For investors and payment processing, we may collect:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Bank account and payment card information (processed securely through third-party providers)</li>
              <li>Accredited investor status documentation</li>
              <li>Investment preferences and history on our platform</li>
              <li>Tax identification numbers for regulatory compliance</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">2.3 Project and Business Information</h3>
            <p className="text-muted-foreground mb-4">For entrepreneurs using our platform:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Business plans, pitch decks, and project descriptions</li>
              <li>Company formation documents</li>
              <li>Funding goals and financial projections</li>
              <li>Milestones, metrics, and traction data</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">2.4 Automatically Collected Information</h3>
            <p className="text-muted-foreground mb-4">When you use our Services, we automatically collect:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Device information (type, operating system, browser type)</li>
              <li>IP address and geolocation data</li>
              <li>Usage patterns, pages visited, and time spent on our platform</li>
              <li>Cookies and similar tracking technologies (see our <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>)</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect for the following purposes:</p>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">3.1 Platform Operations</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Provide, operate, and maintain our Services</li>
              <li>Process transactions and send related information</li>
              <li>Authenticate users and maintain account security</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.2 Matchmaking and Discovery</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Match entrepreneurs with suitable investors and talent</li>
              <li>Power our AI-driven recommendation engine</li>
              <li>Facilitate introductions based on investment criteria and project needs</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.3 Trust and Safety</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Verify user identities and credentials</li>
              <li>Validate accredited investor status</li>
              <li>Prevent fraud, abuse, and illegal activities</li>
              <li>Maintain platform integrity through certifications and vouches</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.4 Communications</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Send administrative messages, updates, and security alerts</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Deliver marketing communications (with your consent)</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Information Sharing and Disclosure</h2>
            <p className="text-muted-foreground mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">4.1 With Your Consent</h3>
            <p className="text-muted-foreground mb-6">
              When you explicitly consent to share information with other users (e.g., sharing your project with potential investors).
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">4.2 Platform Users</h3>
            <p className="text-muted-foreground mb-6">
              Your public profile information is visible to other authenticated users. Project owners can control which information is shared with investors.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">4.3 Service Providers</h3>
            <p className="text-muted-foreground mb-6">
              We work with third-party service providers who assist us in operating our Services, including payment processors, cloud hosting providers, analytics services, and identity verification services. These providers are contractually bound to protect your information.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">4.4 Legal Requirements</h3>
            <p className="text-muted-foreground">
              We may disclose your information if required by law, subpoena, court order, or other governmental request, or when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
            </p>
          </section>

          {/* Data Security */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Encryption of data in transit (TLS/SSL) and at rest</li>
              <li>Secure authentication via Clerk authentication services</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls limiting employee access to personal data</li>
              <li>Secure cloud infrastructure with Convex and industry-leading providers</li>
            </ul>
            <p className="text-muted-foreground">
              While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Rights and Choices</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">6.1 Access and Portability</h3>
            <p className="text-muted-foreground mb-6">
              You can access, download, and export your personal data through your account settings.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">6.2 Correction</h3>
            <p className="text-muted-foreground mb-6">
              You can update or correct inaccurate personal information through your profile settings.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">6.3 Deletion</h3>
            <p className="text-muted-foreground mb-6">
              You can request deletion of your account and associated data. Note that some information may be retained for legal or legitimate business purposes.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">6.4 Marketing Opt-Out</h3>
            <p className="text-muted-foreground mb-6">
              You can opt out of marketing communications at any time by clicking the &quot;unsubscribe&quot; link in our emails or adjusting your notification preferences.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">6.5 GDPR Rights (EEA Residents)</h3>
            <p className="text-muted-foreground mb-4">
              If you are located in the European Economic Area, you have additional rights including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Right to object to processing</li>
              <li>Right to restrict processing</li>
              <li>Right to withdraw consent</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">6.6 CCPA Rights (California Residents)</h3>
            <p className="text-muted-foreground">
              California residents have the right to know what personal information we collect, request deletion, and opt-out of the sale of personal information (though we do not sell your data).
            </p>
          </section>

          {/* Data Retention */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as needed to provide you Services. We may also retain and use your information as necessary to comply with legal obligations, resolve disputes, prevent fraud, and enforce our agreements. When data is no longer needed, it will be securely deleted or anonymized.
            </p>
          </section>

          {/* International Transfers */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer data internationally, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by regulatory authorities.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information promptly.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically. Your continued use of our Services after any modifications indicates your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="text-muted-foreground space-y-2">
              <p><strong className="text-white/80">Email:</strong> <a href="mailto:privacy@venturedeck.com" className="text-primary hover:underline">privacy@venturedeck.com</a></p>
              <p><strong className="text-white/80">Data Protection Officer:</strong> <a href="mailto:dpo@venturedeck.com" className="text-primary hover:underline">dpo@venturedeck.com</a></p>
              <p><strong className="text-white/80">Address:</strong> VentureDeck, Inc., [Business Address]</p>
            </div>
          </section>

          {/* Related Policies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Related Policies</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="text-primary hover:underline">Terms of Service →</Link>
              <Link href="/cookies" className="text-primary hover:underline">Cookie Policy →</Link>
              <Link href="/acceptable-use" className="text-primary hover:underline">Acceptable Use Policy →</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
