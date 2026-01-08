'use client';

import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="prose prose-invert prose-indigo max-w-none space-y-10">
          {/* Agreement */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and VentureDeck, Inc. (&quot;VentureDeck,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) governing your access to and use of the VentureDeck platform, website, and related services (collectively, the &quot;Services&quot;).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By accessing, browsing, or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and all applicable laws and regulations. If you do not agree to these Terms, you may not access or use our Services.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email or prominent notice on our platform. Your continued use of the Services following any modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Eligibility */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Eligibility</h2>
            <p className="text-muted-foreground mb-4">To use our Services, you must:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding contracts</li>
              <li>Not be prohibited from using the Services under applicable law</li>
              <li>Provide accurate, current, and complete registration information</li>
            </ul>
            <p className="text-muted-foreground">
              <strong className="text-white/80">For Investors:</strong> If you participate in investment activities on our platform, you represent that you are an &quot;accredited investor&quot; as defined by applicable securities laws or meet the qualifications required in your jurisdiction to participate in private investment offerings.
            </p>
          </section>

          {/* Account Responsibilities */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Account Registration and Responsibilities</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">3.1 Account Creation</h3>
            <p className="text-muted-foreground mb-6">
              To access certain features of the Services, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to maintain its accuracy.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.2 Account Security</h3>
            <p className="text-muted-foreground mb-6">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other security breach.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.3 Account Verification</h3>
            <p className="text-muted-foreground">
              We may require identity verification for certain account types or activities. You agree to cooperate with our verification processes and provide any requested documentation. Failure to verify your identity may result in restricted access or account termination.
            </p>
          </section>

          {/* User Types and Roles */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. User Types and Role-Specific Terms</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">4.1 Entrepreneurs</h3>
            <p className="text-muted-foreground mb-4">If you use our platform as an entrepreneur, you agree to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Provide accurate and truthful information about your projects, business, and funding needs</li>
              <li>Not misrepresent your business&apos;s financial condition, performance, or prospects</li>
              <li>Respect the confidentiality of any non-public information shared by investors</li>
              <li>Comply with all applicable securities laws when seeking funding</li>
              <li>Use committed funds only for stated business purposes</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">4.2 Investors</h3>
            <p className="text-muted-foreground mb-4">If you use our platform as an investor, you acknowledge and agree that:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>You meet the accreditation or qualification requirements for your jurisdiction</li>
              <li>Investing in startups involves significant risk, including potential total loss of investment</li>
              <li>VentureDeck does not provide investment advice or recommendations</li>
              <li>You are responsible for your own due diligence before making any investment</li>
              <li>Investment commitments made through the platform may be binding</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">4.3 Talent / Contributors</h3>
            <p className="text-muted-foreground">
              If you participate in bounties or provide services through our platform, you agree to deliver work as described, respect project confidentiality requirements, and maintain professional conduct in all interactions.
            </p>
          </section>

          {/* Platform Services */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Platform Services</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">5.1 Service Description</h3>
            <p className="text-muted-foreground mb-6">
              VentureDeck provides a platform for entrepreneurs to showcase their projects, connect with investors, and build their teams. We facilitate introductions and provide tools for managing fundraising activities but do not provide investment advice, broker-dealer services, or act as a funding intermediary.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">5.2 No Guarantee of Results</h3>
            <p className="text-muted-foreground mb-6">
              We do not guarantee that any project will receive funding or that
              any investor is accredited. We are not a broker-dealer or investment
              advisor. Users are responsible for their own due diligence.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">5.3 Service Modifications</h3>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue any part of our Services at any time, with or without notice. We will make reasonable efforts to notify users of material changes.
            </p>
          </section>

          {/* User Content */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. User Content</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">6.1 Your Content</h3>
            <p className="text-muted-foreground mb-6">
              You retain ownership of all content you submit, post, or display through our Services (&quot;User Content&quot;), including pitch decks, business plans, messages, and profile information. You are solely responsible for the accuracy, legality, and appropriateness of your User Content.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">6.2 License Grant</h3>
            <p className="text-muted-foreground mb-6">
              By submitting User Content, you grant VentureDeck a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, and display such content solely for the purpose of operating and improving our Services. This license terminates when you delete your User Content or account, except where shared with other users.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">6.3 Content Restrictions</h3>
            <p className="text-muted-foreground mb-4">You agree not to submit content that:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Is false, misleading, or fraudulent</li>
              <li>Infringes on intellectual property rights of others</li>
              <li>Contains malware, viruses, or harmful code</li>
              <li>Violates any applicable law or regulation</li>
              <li>Violates our <Link href="/acceptable-use" className="text-primary hover:underline">Acceptable Use Policy</Link></li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Intellectual Property</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">7.1 VentureDeck IP</h3>
            <p className="text-muted-foreground mb-6">
              The Services, including all text, graphics, logos, software, and other materials (&quot;VentureDeck Content&quot;), are owned by or licensed to VentureDeck and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, modify, distribute, or create derivative works from VentureDeck Content without our prior written consent.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">7.2 Trademarks</h3>
            <p className="text-muted-foreground">
              &quot;VentureDeck,&quot; our logo, and other marks are trademarks of VentureDeck, Inc. You may not use our trademarks without prior written permission.
            </p>
          </section>

          {/* Payments and Fees */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Payments and Fees</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">8.1 Subscription and Service Fees</h3>
            <p className="text-muted-foreground mb-6">
              Certain features or services may require payment. Fees will be clearly disclosed before you incur any charges. All fees are non-refundable unless otherwise stated or required by law.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">8.2 Bounty Payments</h3>
            <p className="text-muted-foreground mb-6">
              For bounty-related transactions, project owners are responsible for funding bounties and compensating contributors according to agreed terms. VentureDeck may facilitate payment processing but is not responsible for disputes between parties.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">8.3 Investment Transactions</h3>
            <p className="text-muted-foreground">
              VentureDeck does not process investment funds directly. Any financial transactions between investors and entrepreneurs occur outside our platform and are governed by separate agreements between those parties.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">9.1 Disclaimer of Warranties</h3>
            <p className="text-muted-foreground mb-6 uppercase text-sm">
              THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">9.2 Investment Disclaimer</h3>
            <p className="text-muted-foreground mb-6">
              VentureDeck is not a registered broker-dealer, investment advisor, or funding portal. We do not provide investment advice, endorse any projects, or guarantee investment outcomes. All investment decisions are made at your own risk. See our <Link href="/disclaimer" className="text-primary hover:underline">Disclaimer</Link> for more details.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">9.3 Limitation of Liability</h3>
            <p className="text-muted-foreground uppercase text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, VENTUREDECK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF $100 OR THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS.
            </p>
          </section>

          {/* Indemnification */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify, defend, and hold harmless VentureDeck, its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys&apos; fees) arising out of or in connection with: (a) your use of the Services; (b) your User Content; (c) your violation of these Terms; (d) your violation of any rights of another party; or (e) any transaction or agreement between you and another user.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Dispute Resolution</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">11.1 Informal Resolution</h3>
            <p className="text-muted-foreground mb-6">
              Before initiating any formal dispute resolution, you agree to contact us at <a href="mailto:legal@venturedeck.com" className="text-primary hover:underline">legal@venturedeck.com</a> and attempt to resolve the dispute informally for at least 30 days.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">11.2 Binding Arbitration</h3>
            <p className="text-muted-foreground mb-6">
              Any disputes that cannot be resolved informally shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall be conducted in [Jurisdiction], and the arbitrator&apos;s decision shall be final and binding.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">11.3 Class Action Waiver</h3>
            <p className="text-muted-foreground">
              YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION.
            </p>
          </section>

          {/* Termination */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">12. Termination</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">12.1 Your Right to Terminate</h3>
            <p className="text-muted-foreground mb-6">
              You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">12.2 Our Right to Terminate</h3>
            <p className="text-muted-foreground mb-6">
              We may suspend or terminate your account immediately, without prior notice or liability, for any reason, including if you breach these Terms or engage in conduct that we determine is harmful to other users, us, or third parties.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">12.3 Effect of Termination</h3>
            <p className="text-muted-foreground">
              Upon termination, your right to use the Services will cease immediately. Sections of these Terms that by their nature should survive termination shall survive, including ownership, warranty disclaimers, indemnification, and limitations of liability.
            </p>
          </section>

          {/* General Provisions */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">13. General Provisions</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">13.1 Governing Law</h3>
            <p className="text-muted-foreground mb-6">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">13.2 Entire Agreement</h3>
            <p className="text-muted-foreground mb-6">
              These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and VentureDeck regarding the Services.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">13.3 Severability</h3>
            <p className="text-muted-foreground mb-6">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">13.4 Waiver</h3>
            <p className="text-muted-foreground">
              Our failure to enforce any right or provision of these Terms shall not be considered a waiver of those rights.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">14. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions or concerns about these Terms, please contact us:
            </p>
            <div className="text-muted-foreground space-y-2">
              <p><strong className="text-white/80">Email:</strong> <a href="mailto:legal@venturedeck.com" className="text-primary hover:underline">legal@venturedeck.com</a></p>
              <p><strong className="text-white/80">Address:</strong> VentureDeck, Inc., [Business Address]</p>
            </div>
          </section>

          {/* Related Policies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Related Policies</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy →</Link>
              <Link href="/cookies" className="text-primary hover:underline">Cookie Policy →</Link>
              <Link href="/acceptable-use" className="text-primary hover:underline">Acceptable Use Policy →</Link>
              <Link href="/disclaimer" className="text-primary hover:underline">Disclaimer →</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
