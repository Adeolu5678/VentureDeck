'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function DisclaimerPage() {
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
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Disclaimer</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="prose prose-invert prose-indigo max-w-none space-y-10">
          {/* Important Notice */}
          <section className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-amber-400">⚠️ Important Notice</h2>
            <p className="text-amber-100/90 leading-relaxed font-medium">
              INVESTING IN STARTUPS AND EARLY-STAGE COMPANIES INVOLVES A HIGH DEGREE OF RISK. YOU COULD LOSE YOUR ENTIRE INVESTMENT. CAREFULLY CONSIDER THE RISKS BEFORE MAKING ANY INVESTMENT DECISIONS. VENTUREDECK DOES NOT PROVIDE INVESTMENT ADVICE.
            </p>
          </section>

          {/* General Disclaimer */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. General Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The information provided on the VentureDeck platform (&quot;Platform&quot;) is for general informational purposes only. VentureDeck, Inc. (&quot;VentureDeck,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the Platform for any purpose.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Any reliance you place on such information is strictly at your own risk. In no event will we be liable for any loss or damage arising from the use of this Platform.
            </p>
          </section>

          {/* No Investment Advice */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. No Investment Advice</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-white/80">VentureDeck is not a registered broker-dealer, investment advisor, or funding portal.</strong> Nothing on this Platform should be construed as:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>An offer or solicitation to buy or sell any securities</li>
              <li>Investment advice or recommendations</li>
              <li>Tax, legal, or financial advice</li>
              <li>A guarantee of investment returns or outcomes</li>
              <li>An endorsement of any particular company, project, or investment opportunity</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Always consult with qualified legal, tax, and financial professionals before making any investment decisions. Past performance is not indicative of future results.
            </p>
          </section>

          {/* Investment Risks */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Investment Risks</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Investing in startups and early-stage companies involves significant risks, including but not limited to:
            </p>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">3.1 Loss of Investment</h3>
            <p className="text-muted-foreground mb-6">
              The majority of startups fail. There is a significant risk that you may lose your entire investment. Only invest money that you can afford to lose completely.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.2 Illiquidity</h3>
            <p className="text-muted-foreground mb-6">
              Investments in private companies are typically illiquid. There is no public market for shares, and you may be unable to sell your investment for an extended period, if ever.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.3 Dilution</h3>
            <p className="text-muted-foreground mb-6">
              Your ownership stake may be diluted by future financing rounds, stock option grants, or other equity issuances.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.4 Lack of Information</h3>
            <p className="text-muted-foreground mb-6">
              Unlike publicly traded companies, private companies are not required to disclose financial information. You may have limited access to information about the company&apos;s operations and financial condition.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.5 No Voting Rights</h3>
            <p className="text-muted-foreground mb-6">
              Depending on the investment structure, you may have limited or no voting rights or ability to influence company decisions.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.6 Fraud Risk</h3>
            <p className="text-muted-foreground">
              While VentureDeck takes steps to verify users and projects, we cannot guarantee the accuracy of information provided by third parties or eliminate the risk of fraudulent offerings.
            </p>
          </section>

          {/* Accredited Investor Requirements */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Accredited Investor Requirements</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Many investment opportunities on our Platform are available only to &quot;accredited investors&quot; as defined by relevant securities laws. In the United States, an accredited investor generally includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Individuals with income exceeding $200,000 (or $300,000 jointly with a spouse) in each of the prior two years, with a reasonable expectation of the same in the current year</li>
              <li>Individuals with a net worth exceeding $1 million, excluding the primary residence</li>
              <li>Certain entities with assets exceeding $5 million</li>
              <li>Individuals holding certain professional certifications (e.g., Series 7, 65, 82)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              If you invest as an accredited investor, you certify that you meet these requirements. Investing as an accredited investor when you do not qualify may violate securities laws.
            </p>
          </section>

          {/* User-Generated Content */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. User-Generated Content</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              VentureDeck provides a platform for entrepreneurs to share information about their projects. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>The accuracy, completeness, or reliability of user-generated content</li>
              <li>The quality or viability of any project listed on the Platform</li>
              <li>The business practices or conduct of any user</li>
              <li>Any transactions between users</li>
            </ul>
            <p className="text-muted-foreground">
              You should independently verify all information before making any decisions. VentureDeck does not endorse any project or user.
            </p>
          </section>

          {/* No Guarantees */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. No Guarantees</h2>
            <p className="text-muted-foreground leading-relaxed">
              VentureDeck does not guarantee:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>That entrepreneurs will secure funding</li>
              <li>That investors will find suitable investment opportunities</li>
              <li>Any particular investment outcome or return</li>
              <li>The success of any project or company</li>
              <li>The availability or uptime of the Platform</li>
              <li>The accuracy of AI-generated scores, recommendations, or analyses</li>
            </ul>
          </section>

          {/* Third-Party Links */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Third-Party Links and Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Platform may contain links to third-party websites or services that are not owned or controlled by VentureDeck. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that VentureDeck shall not be responsible or liable for any damage or loss caused by the use of any such third-party content, goods, or services.
            </p>
          </section>

          {/* Legal Templates */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Legal Document Templates</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              VentureDeck provides legal document templates (such as SAFE agreements and NDAs) for informational and convenience purposes only. These templates:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Are not a substitute for professional legal advice</li>
              <li>May not be appropriate for your specific situation</li>
              <li>May not comply with laws in all jurisdictions</li>
              <li>Should be reviewed by a qualified attorney before use</li>
            </ul>
            <p className="text-muted-foreground">
              <strong className="text-white/80">VentureDeck is not a law firm and does not provide legal advice.</strong> Use of these templates is at your own risk.
            </p>
          </section>

          {/* Jurisdiction */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Jurisdictional Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our Platform is designed for use in jurisdictions where such use is lawful. Users are responsible for ensuring their use of the Platform complies with all applicable local, state, national, and international laws and regulations, including securities laws.
            </p>
          </section>

          {/* Forward-Looking Statements */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Forward-Looking Statements</h2>
            <p className="text-muted-foreground leading-relaxed">
              Certain information on the Platform, particularly project descriptions and financial projections, may include forward-looking statements. These statements involve known and unknown risks, uncertainties, and other factors that could cause actual results to differ materially from those projected. Forward-looking statements speak only as of the date they are made and should not be relied upon as predictions of future events.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Disclaimer, please contact us:
            </p>
            <div className="text-muted-foreground space-y-2">
              <p><strong className="text-white/80">Email:</strong> <a href="mailto:legal@venturedeck.com" className="text-primary hover:underline">legal@venturedeck.com</a></p>
            </div>
          </section>

          {/* Related Policies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Related Policies</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/terms" className="text-primary hover:underline">Terms of Service →</Link>
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy →</Link>
              <Link href="/acceptable-use" className="text-primary hover:underline">Acceptable Use Policy →</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
