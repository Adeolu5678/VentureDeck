'use client';

import Link from 'next/link';
import { Ban, ArrowLeft } from 'lucide-react';

export default function AcceptableUsePolicyPage() {
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
            <Ban className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Acceptable Use Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="prose prose-invert prose-indigo max-w-none space-y-10">
          {/* Introduction */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              This Acceptable Use Policy (&quot;AUP&quot;) governs your use of VentureDeck&apos;s platform, website, and services (collectively, the &quot;Services&quot;). This policy is incorporated into and forms part of our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By using our Services, you agree to comply with this AUP. We reserve the right to take any action we deem appropriate, including suspending or terminating access to our Services, for violations of this policy.
            </p>
          </section>

          {/* Prohibited Activities */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Prohibited Activities</h2>
            <p className="text-muted-foreground mb-4">You may not use our Services to engage in or facilitate:</p>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">2.1 Illegal Activities</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Any activity that violates local, state, national, or international laws</li>
              <li>Money laundering, terrorist financing, or other financial crimes</li>
              <li>Securities fraud or violations of securities laws</li>
              <li>Tax evasion or fraudulent financial reporting</li>
              <li>Circumventing export controls or sanctions</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">2.2 Fraud and Misrepresentation</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Creating fake accounts or impersonating others</li>
              <li>Providing false or misleading information about yourself, your business, or your projects</li>
              <li>Misrepresenting your accredited investor status or qualifications</li>
              <li>Operating pyramid schemes, Ponzi schemes, or fraudulent investment offerings</li>
              <li>Phishing or attempting to obtain credentials through deception</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">2.3 Harmful Content</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Content that promotes hate, violence, or discrimination</li>
              <li>Sexually explicit or pornographic material</li>
              <li>Content that exploits or endangers minors</li>
              <li>Graphic violence or gore</li>
              <li>Content promoting self-harm or suicide</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">2.4 Harassment and Abuse</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Harassing, threatening, or intimidating other users</li>
              <li>Stalking or unwanted persistent contact</li>
              <li>Doxxing or publishing private information without consent</li>
              <li>Bullying or defaming other users or their businesses</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">2.5 Spam and Manipulation</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Sending unsolicited bulk messages or commercial communications</li>
              <li>Artificially inflating metrics, follows, or engagement</li>
              <li>Using bots or automated tools to interact with the platform without authorization</li>
              <li>Manipulating search results, rankings, or recommendations</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">2.6 Intellectual Property Violations</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Uploading content that infringes on copyrights, trademarks, or patents</li>
              <li>Distributing pirated software, media, or other materials</li>
              <li>Misappropriating trade secrets or confidential information</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">2.7 Security Violations</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Attempting to bypass security measures or access controls</li>
              <li>Introducing malware, viruses, or other harmful code</li>
              <li>Interfering with or disrupting the Services or servers</li>
              <li>Attempting to probe, scan, or test system vulnerabilities</li>
              <li>Collecting user data through unauthorized means (scraping, harvesting)</li>
            </ul>
          </section>

          {/* Platform-Specific Rules */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Platform-Specific Rules</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">3.1 Project Listings (Entrepreneurs)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>All project information must be truthful and not misleading</li>
              <li>Financial projections must be reasonable and clearly labeled as estimates</li>
              <li>Do not solicit investments that would violate securities laws</li>
              <li>Disclose all material risks and conflicts of interest</li>
              <li>Respond to investor inquiries in good faith</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.2 Investment Activity (Investors)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Accurately represent your accredited investor status</li>
              <li>Do not make investment commitments you do not intend to honor</li>
              <li>Respect the confidentiality of non-public project information</li>
              <li>Communicate professionally with entrepreneurs</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.3 Bounties and Work Submissions</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Submit only original work or work you have rights to</li>
              <li>Complete bounties as described and by agreed deadlines</li>
              <li>Do not submit plagiarized or AI-generated content as original work</li>
              <li>Respect project confidentiality requirements</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.4 Messaging and Communication</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Communicate respectfully and professionally</li>
              <li>Do not use the messaging system for spam or solicitation</li>
              <li>Do not send harassing or threatening messages</li>
              <li>Respect when users decline to respond</li>
            </ul>
          </section>

          {/* Content Standards */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Content Standards</h2>
            <p className="text-muted-foreground mb-4">All content uploaded to our platform must:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Be accurate and not misleading</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Be appropriate for a professional business environment</li>
              <li>Not contain malicious code or links to harmful websites</li>
              <li>Maintain a professional tone and appearance</li>
            </ul>
          </section>

          {/* Enforcement */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Enforcement</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">5.1 Reporting Violations</h3>
            <p className="text-muted-foreground mb-6">
              If you believe someone has violated this AUP, please report it to us at <a href="mailto:abuse@venturedeck.com" className="text-primary hover:underline">abuse@venturedeck.com</a>. Include as much detail as possible, including usernames, screenshots, and descriptions of the violation.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">5.2 Investigation</h3>
            <p className="text-muted-foreground mb-6">
              We will investigate reported violations and take appropriate action. Investigations may be conducted without notice to the accused party, and we are not obligated to disclose the results of any investigation.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">5.3 Consequences</h3>
            <p className="text-muted-foreground mb-4">
              Violations of this AUP may result in:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Warning notices</li>
              <li>Temporary suspension of account features</li>
              <li>Removal of content</li>
              <li>Permanent account termination</li>
              <li>Reporting to law enforcement where appropriate</li>
              <li>Legal action to recover damages</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">5.4 Appeals</h3>
            <p className="text-muted-foreground">
              If you believe your account was suspended or terminated in error, you may appeal by contacting us at <a href="mailto:appeals@venturedeck.com" className="text-primary hover:underline">appeals@venturedeck.com</a>. We will review your appeal and respond within a reasonable time.
            </p>
          </section>

          {/* Cooperation with Authorities */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Cooperation with Authorities</h2>
            <p className="text-muted-foreground">
              We may disclose information about AUP violations to law enforcement agencies, regulatory authorities, or other third parties when we believe it is necessary to protect our rights, the safety of our users, or to comply with legal obligations. We may also cooperate with investigations of suspected illegal activity.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Acceptable Use Policy from time to time. Material changes will be notified through our platform or via email. Your continued use of the Services after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this policy or wish to report a violation:
            </p>
            <div className="text-muted-foreground space-y-2">
              <p><strong className="text-white/80">Report Abuse:</strong> <a href="mailto:abuse@venturedeck.com" className="text-primary hover:underline">abuse@venturedeck.com</a></p>
              <p><strong className="text-white/80">Appeals:</strong> <a href="mailto:appeals@venturedeck.com" className="text-primary hover:underline">appeals@venturedeck.com</a></p>
              <p><strong className="text-white/80">General Inquiries:</strong> <a href="mailto:legal@venturedeck.com" className="text-primary hover:underline">legal@venturedeck.com</a></p>
            </div>
          </section>

          {/* Related Policies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Related Policies</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="text-primary hover:underline">Terms of Service →</Link>
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy →</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
