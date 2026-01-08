'use client';

import Link from 'next/link';
import { Cookie, ArrowLeft } from 'lucide-react';

export default function CookiePolicyPage() {
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
            <Cookie className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="prose prose-invert prose-indigo max-w-none space-y-10">
          {/* Introduction */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              This Cookie Policy explains how VentureDeck, Inc. (&quot;VentureDeck,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar tracking technologies when you visit our website and use our Services. This policy should be read alongside our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By continuing to use our website, you consent to our use of cookies as described in this policy. If you do not agree to the use of cookies, you should adjust your browser settings accordingly or refrain from using our Services.
            </p>
          </section>

          {/* What Are Cookies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, provide useful information to website owners, and enhance user experience.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cookies can be &quot;persistent&quot; or &quot;session&quot; cookies. Persistent cookies remain on your device after you close your browser, while session cookies are deleted when you close your browser.
            </p>
          </section>

          {/* Types of Cookies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">3.1 Essential Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies are strictly necessary for the operation of our website. They enable core functionality such as security, network management, and account authentication.
            </p>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/80">
                    <th className="pb-2">Cookie</th>
                    <th className="pb-2">Purpose</th>
                    <th className="pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="py-2">__clerk_*</td>
                    <td className="py-2">User authentication (Clerk)</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="py-2">__session</td>
                    <td className="py-2">Session management</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="py-2">csrf_token</td>
                    <td className="py-2">Security - CSRF protection</td>
                    <td className="py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.2 Functional Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
            </p>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/80">
                    <th className="pb-2">Cookie</th>
                    <th className="pb-2">Purpose</th>
                    <th className="pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="py-2">theme_preference</td>
                    <td className="py-2">Remember dark/light mode</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-2">locale</td>
                    <td className="py-2">Language preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.3 Analytics Cookies</h3>
            <p className="text-muted-foreground mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-white/80">
                    <th className="pb-2">Cookie</th>
                    <th className="pb-2">Purpose</th>
                    <th className="pb-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="py-2">_ga, _gid</td>
                    <td className="py-2">Google Analytics - Usage tracking</td>
                    <td className="py-2">2 years / 24 hours</td>
                  </tr>
                  <tr>
                    <td className="py-2">_gat</td>
                    <td className="py-2">Google Analytics - Rate limiting</td>
                    <td className="py-2">1 minute</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-medium mb-3 text-white/90">3.4 Marketing Cookies</h3>
            <p className="text-muted-foreground">
              These cookies track your browsing habits to deliver advertising more relevant to you. We do not currently use marketing cookies, but may introduce them in the future with proper notice and consent mechanisms.
            </p>
          </section>

          {/* Third-Party Cookies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Third-Party Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use services from third parties that may set cookies on your device. These include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-white/80">Clerk:</strong> Authentication and user management</li>
              <li><strong className="text-white/80">Convex:</strong> Real-time database and backend services</li>
              <li><strong className="text-white/80">Google Analytics:</strong> Website usage analytics (if enabled)</li>
              <li><strong className="text-white/80">Vercel:</strong> Hosting and performance monitoring</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              These third parties have their own privacy policies addressing how they use such information.
            </p>
          </section>

          {/* Managing Cookies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white/90">5.1 Browser Settings</h3>
            <p className="text-muted-foreground mb-4">
              Most web browsers allow you to control cookies through their settings. You can set your browser to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
              <li>Notify you when you receive a cookie</li>
              <li>Block all cookies</li>
              <li>Delete cookies when you close your browser</li>
              <li>Block third-party cookies only</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white/90">5.2 Browser-Specific Instructions</h3>
            <div className="text-muted-foreground space-y-2 mb-6">
              <p>• <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></p>
              <p>• <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></p>
              <p>• <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></p>
              <p>• <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></p>
            </div>

            <h3 className="text-xl font-medium mb-3 text-white/90">5.3 Opt-Out Tools</h3>
            <p className="text-muted-foreground">
              For Google Analytics, you can opt out by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a>.
            </p>
          </section>

          {/* Impact of Disabling */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Impact of Disabling Cookies</h2>
            <p className="text-muted-foreground">
              If you disable or delete essential cookies, certain features of our Services may not function properly. For example, you may not be able to log in to your account or maintain your session. Disabling non-essential cookies will not affect the core functionality of our Services but may impact personalization and analytics features.
            </p>
          </section>

          {/* Other Tracking Technologies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Other Tracking Technologies</h2>
            <p className="text-muted-foreground mb-4">
              In addition to cookies, we may use other tracking technologies:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-white/80">Local Storage:</strong> Similar to cookies but stored in your browser for longer periods</li>
              <li><strong className="text-white/80">Session Storage:</strong> Temporary storage cleared when you close your browser</li>
              <li><strong className="text-white/80">Pixel Tags/Web Beacons:</strong> Small images used to track user behavior (e.g., email open rates)</li>
            </ul>
          </section>

          {/* Do Not Track */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Do Not Track Signals</h2>
            <p className="text-muted-foreground">
              Some browsers offer a &quot;Do Not Track&quot; (DNT) signal. Currently, no uniform standard has been adopted for responding to DNT signals. We do not currently respond to DNT signals, but we respect your choices regarding cookies and tracking as described in this policy.
            </p>
          </section>

          {/* Updates */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will post the updated policy on this page with a revised &quot;Last updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="text-muted-foreground space-y-2">
              <p><strong className="text-white/80">Email:</strong> <a href="mailto:privacy@venturedeck.com" className="text-primary hover:underline">privacy@venturedeck.com</a></p>
            </div>
          </section>

          {/* Related Policies */}
          <section className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Related Policies</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy →</Link>
              <Link href="/terms" className="text-primary hover:underline">Terms of Service →</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
