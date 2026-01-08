import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Legal document templates with placeholder variables
type TemplateType = 'SAFE' | 'NDA' | 'ADVISOR' | 'FOUNDER' | 'CONVERTIBLE_NOTE' | 'TERM_SHEET' | 'INVESTMENT_AGREEMENT';

const TEMPLATES: Record<TemplateType, { name: string; content: string }> = {
  SAFE: {
    name: 'Simple Agreement for Future Equity (SAFE)',
    content: `SIMPLE AGREEMENT FOR FUTURE EQUITY

THIS CERTIFIES THAT in exchange for the payment by {{INVESTOR_NAME}} (the "Investor") of {{INVESTMENT_AMOUNT}} (the "Purchase Amount") on or about {{DATE}}, {{COMPANY_NAME}}, a company (the "Company"), hereby issues to the Investor the right to certain shares of the Company's capital stock, subject to the terms set forth below.

1. EVENTS
(a) Equity Financing: If there is an Equity Financing before the termination of this Safe, on the initial closing of such Equity Financing, this Safe will automatically convert into the number of shares of Standard Preferred Stock equal to the Purchase Amount divided by the Discount Price.

(b) Liquidity Event: If there is a Liquidity Event before the termination of this Safe, the Investor will, at its option, either (i) receive a cash payment equal to the Purchase Amount or (ii) automatically receive from the Company a number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price.

2. DEFINITIONS
"Discount Price" means the price per share of the Standard Preferred Stock sold in the Equity Financing multiplied by the Discount Rate.
"Discount Rate" means 100% minus {{DISCOUNT_PERCENTAGE}}%.
"Equity Financing" means a bona fide transaction or series of transactions with the principal purpose of raising capital.
"Liquidity Price" means the price per share equal to the quotient obtained by dividing the Valuation Cap by the Company Capitalization.
"Valuation Cap" means {{VALUATION_CAP}}.

3. COMPANY REPRESENTATIONS
The Company is a corporation duly organized, validly existing, and in good standing under the laws of its state of incorporation.

Signed:
Company: {{COMPANY_NAME}}
Representative: {{FOUNDER_NAME}}
Date: {{DATE}}

Investor: {{INVESTOR_NAME}}
Date: __________`,
  },
  NDA: {
    name: 'Non-Disclosure Agreement',
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (this "Agreement") is entered into as of {{DATE}} by and between:

{{COMPANY_NAME}} ("Company")
and
{{RECIPIENT_NAME}} ("Recipient")

RECITALS
The parties wish to explore a business opportunity of mutual interest and, in connection with this opportunity, each party may disclose to the other certain confidential technical and business information that the disclosing party desires the receiving party to treat as confidential.

AGREEMENT
1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by either party to the other party, either directly or indirectly, in writing, orally, or by inspection of tangible objects, which is designated as "Confidential," "Proprietary," or some similar designation.

2. NON-USE AND NON-DISCLOSURE
Each party agrees not to use any Confidential Information of the other party for any purpose except to evaluate and engage in discussions concerning a potential business relationship between the parties.

3. TERM
This Agreement shall remain in effect for a period of two (2) years from the date of execution.

4. RETURN OF MATERIALS
All documents and other tangible objects containing or representing Confidential Information shall be and remain the property of the disclosing party.

5. NO WARRANTY
ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS."

6. GOVERNING LAW
This Agreement shall be governed by the laws of the state where the Company is incorporated.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

{{COMPANY_NAME}}
By: {{FOUNDER_NAME}}
Title: Founder
Date: {{DATE}}

{{RECIPIENT_NAME}}
Date: __________`,
  },
  ADVISOR: {
    name: 'Advisor Agreement',
    content: `ADVISOR AGREEMENT

This Advisor Agreement (this "Agreement") is entered into as of {{DATE}} by and between:

{{COMPANY_NAME}}, a company ("Company")
and
{{ADVISOR_NAME}} ("Advisor")

RECITALS
The Company desires to retain Advisor to provide advisory services, and Advisor desires to provide such services to the Company, on the terms set forth in this Agreement.

1. ADVISORY SERVICES
Advisor agrees to provide strategic advice and guidance to the Company in the following areas:
- Business strategy and development
- Introductions to potential investors, partners, and customers
- Industry expertise and market insights
- General mentorship and guidance to the founding team

2. COMPENSATION
In consideration for the advisory services, the Company shall grant Advisor {{EQUITY_PERCENTAGE}}% of the Company's fully-diluted equity, subject to a vesting schedule of {{VESTING_MONTHS}} months with a {{CLIFF_MONTHS}}-month cliff.

3. TIME COMMITMENT
Advisor agrees to make themselves reasonably available to the Company, with an expected time commitment of approximately {{HOURS_PER_MONTH}} hours per month.

4. CONFIDENTIALITY
Advisor agrees to maintain the confidentiality of all proprietary information disclosed by the Company.

5. TERM
This Agreement shall commence on the date hereof and shall continue for a period of {{TERM_YEARS}} year(s), unless earlier terminated by either party with 30 days written notice.

6. INDEPENDENT CONTRACTOR
Advisor is an independent contractor and not an employee, partner, or joint venturer of the Company.

7. GOVERNING LAW
This Agreement shall be governed by the laws of the state where the Company is incorporated.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

COMPANY: {{COMPANY_NAME}}
By: {{FOUNDER_NAME}}
Title: Founder/CEO
Date: {{DATE}}

ADVISOR: {{ADVISOR_NAME}}
Date: __________`,
  },
  FOUNDER: {
    name: 'Founder Agreement',
    content: `FOUNDER AGREEMENT

This Founder Agreement (this "Agreement") is entered into as of {{DATE}} by and among the undersigned individuals (each a "Founder" and collectively, the "Founders") in connection with the formation and operation of {{COMPANY_NAME}} (the "Company").

1. FORMATION OF COMPANY
The Founders agree to form the Company and to operate it in accordance with the terms of this Agreement and applicable law.

2. EQUITY ALLOCATION
The Founders' initial equity ownership shall be allocated as follows:

Founder 1: {{FOUNDER_1_NAME}} - {{FOUNDER_1_PERCENTAGE}}%
Founder 2: {{FOUNDER_2_NAME}} - {{FOUNDER_2_PERCENTAGE}}%
[Additional founders to be added as needed]

3. VESTING
All Founder equity shall be subject to a {{VESTING_YEARS}}-year vesting schedule with a {{CLIFF_MONTHS}}-month cliff and monthly vesting thereafter. Vesting shall accelerate upon a change of control.

4. ROLES AND RESPONSIBILITIES
Each Founder shall devote their full-time efforts to the Company. Initial roles are as follows:
- {{FOUNDER_1_NAME}}: {{FOUNDER_1_ROLE}}
- {{FOUNDER_2_NAME}}: {{FOUNDER_2_ROLE}}

5. DECISION MAKING
Major decisions requiring unanimous Founder consent include:
- Raising capital or taking on debt
- Hiring key executives
- Entering into material contracts
- Changing the Company's principal business
- Any transaction that would result in a change of control

6. INTELLECTUAL PROPERTY
Each Founder assigns to the Company all intellectual property created in connection with the Company's business.

7. CONFIDENTIALITY
Each Founder agrees to maintain the confidentiality of the Company's proprietary information during and after their involvement with the Company.

8. NON-COMPETE
During their involvement with the Company and for {{NON_COMPETE_MONTHS}} months thereafter, each Founder agrees not to engage in any business that competes with the Company.

9. DEPARTURE
If a Founder departs before their equity is fully vested:
- Voluntary departure: Unvested shares are forfeited
- Termination for cause: Unvested shares are forfeited, and the Company may repurchase vested shares at fair market value
- Termination without cause: Accelerated vesting of {{ACCELERATION_MONTHS}} additional months

10. DISPUTE RESOLUTION
Any disputes arising under this Agreement shall be resolved through binding arbitration.

11. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware.

IN WITNESS WHEREOF, the Founders have executed this Agreement as of the date first written above.

FOUNDER 1: {{FOUNDER_1_NAME}}
Date: {{DATE}}

FOUNDER 2: {{FOUNDER_2_NAME}}
Date: __________

[Additional signature blocks as needed]`,
  },
  CONVERTIBLE_NOTE: {
    name: 'Convertible Note',
    content: `CONVERTIBLE PROMISSORY NOTE

Principal Amount: {{PRINCIPAL_AMOUNT}}
Date of Issuance: {{DATE}}

FOR VALUE RECEIVED, {{COMPANY_NAME}}, a company (the "Company"), hereby promises to pay to {{INVESTOR_NAME}} (the "Holder") the principal sum of {{PRINCIPAL_AMOUNT}}, together with interest thereon, in accordance with the following terms:

1. INTEREST
Interest shall accrue on the outstanding principal balance at a rate of {{INTEREST_RATE}}% per annum, compounded annually.

2. MATURITY DATE
Unless earlier converted pursuant to the terms hereof, the outstanding principal balance and all accrued interest shall be due and payable on {{MATURITY_DATE}} (the "Maturity Date").

3. CONVERSION

3.1 Automatic Conversion
Upon the closing of a Qualified Financing (as defined below), this Note shall automatically convert into shares of the equity securities issued in such financing at a conversion price equal to the lesser of:
(a) {{DISCOUNT_PERCENTAGE}}% of the price per share paid by investors in the Qualified Financing; or
(b) The price per share derived from a {{VALUATION_CAP}} valuation cap.

3.2 Qualified Financing
"Qualified Financing" means an equity financing with gross proceeds to the Company of at least {{QUALIFIED_FINANCING_THRESHOLD}}.

3.3 Optional Conversion
At the option of the Holder, this Note may be converted into shares of common stock at a conversion price derived from a {{VALUATION_CAP}} valuation cap.

4. CHANGE OF CONTROL
Upon a Change of Control (as defined below) prior to conversion, the Holder may elect to:
(a) Receive payment of {{CHANGE_OF_CONTROL_MULTIPLE}}x the outstanding principal plus accrued interest; or
(b) Convert this Note into common stock at the valuation cap.

"Change of Control" means a merger, acquisition, sale of substantially all assets, or similar transaction.

5. PREPAYMENT
This Note may not be prepaid without the prior written consent of the Holder.

6. REPRESENTATIONS
The Company represents that it is duly organized, has the authority to issue this Note, and that this Note constitutes a valid and binding obligation.

7. SUBORDINATION
This Note is subordinate to any senior indebtedness of the Company.

8. GOVERNING LAW
This Note shall be governed by the laws of the State of Delaware.

COMPANY: {{COMPANY_NAME}}
By: {{FOUNDER_NAME}}
Title: CEO
Date: {{DATE}}

Acknowledged and Agreed:
HOLDER: {{INVESTOR_NAME}}
Date: __________`,
  },
  TERM_SHEET: {
    name: 'Term Sheet (Non-Binding)',
    content: `TERM SHEET
(NON-BINDING)

Date: {{DATE}}

This term sheet summarizes the principal terms of a proposed investment in {{COMPANY_NAME}} (the "Company"). This term sheet is for discussion purposes only and is not binding except for the provisions regarding confidentiality, exclusivity, and expenses.

1. OFFERING TERMS

Company: {{COMPANY_NAME}}
Security: Series {{SERIES}} Preferred Stock
Investment Amount: {{INVESTMENT_AMOUNT}}
Pre-Money Valuation: {{PRE_MONEY_VALUATION}}
Investors: {{INVESTOR_NAME}} ("Lead Investor") and other investors acceptable to Company and Lead Investor

2. PRICE PER SHARE

Price Per Share: {{PRICE_PER_SHARE}}

Based on fully-diluted capitalization of {{FULLY_DILUTED_SHARES}} shares, resulting in:
- Post-money ownership by new investors: {{INVESTOR_OWNERSHIP_PERCENTAGE}}%
- Post-money ownership by existing stockholders: {{EXISTING_OWNERSHIP_PERCENTAGE}}%

3. LIQUIDATION PREFERENCE

In the event of any liquidation, dissolution, or winding up of the Company, the Preferred shall be entitled to receive, prior to any distribution to Common Stock, an amount equal to {{LIQUIDATION_PREFERENCE_MULTIPLE}}x the original purchase price (plus declared but unpaid dividends).

Participation: [Participating / Non-Participating / Capped at {{PARTICIPATION_CAP}}x]

4. DIVIDENDS

[Non-cumulative / Cumulative] dividends at the rate of {{DIVIDEND_RATE}}% per annum, payable when and if declared by the Board.

5. CONVERSION

Each share of Preferred shall be convertible into one share of Common Stock at any time at the option of the holder, subject to customary anti-dilution adjustments.

Automatic conversion upon (i) closing of a qualified IPO with gross proceeds of at least \${{IPO_THRESHOLD}} or (ii) consent of holders of {{CONVERSION_THRESHOLD}}% of Preferred.

6. ANTI-DILUTION

Broad-based weighted average anti-dilution protection.

7. VOTING RIGHTS

Preferred shall vote together with Common on an as-converted basis.

8. BOARD OF DIRECTORS

Upon closing, the Board shall consist of {{BOARD_SIZE}} members:
- {{FOUNDER_BOARD_SEATS}} seat(s) designated by the Founders
- {{INVESTOR_BOARD_SEATS}} seat(s) designated by the Investors
- {{INDEPENDENT_SEATS}} independent director(s) mutually acceptable

9. PROTECTIVE PROVISIONS

Consent of holders of {{PROTECTIVE_THRESHOLD}}% of Preferred required for:
- Any change to Preferred rights or preferences
- Authorization of additional shares
- Incurrence of debt above \${{DEBT_THRESHOLD}}
- Sale of Company or substantially all assets
- Changes to Board size

10. INFORMATION RIGHTS

Investors holding at least {{INFORMATION_THRESHOLD}} shares shall receive:
- Annual audited financial statements
- Quarterly unaudited financial statements
- Annual budget and business plan

11. EXCLUSIVITY

For a period of {{EXCLUSIVITY_DAYS}} days from the date hereof, the Company agrees not to solicit, encourage, or engage in negotiations with any other potential investors.

12. CONFIDENTIALITY

This term sheet and the proposed transaction shall remain confidential.

13. EXPENSES

The Company shall pay reasonable legal fees of the Lead Investor up to \${{LEGAL_FEE_CAP}}.

14. NON-BINDING

Except for Sections 11, 12, and 13, this term sheet is non-binding and is intended solely as a summary of terms for discussion purposes.

COMPANY: {{COMPANY_NAME}}

By: {{FOUNDER_NAME}}
Title: CEO
Date: {{DATE}}

LEAD INVESTOR: {{INVESTOR_NAME}}

By: ____________________
Title: ____________________
Date: __________`,
  },
  INVESTMENT_AGREEMENT: {
    name: 'Investment Agreement',
    content: `INVESTMENT AGREEMENT

This Investment Agreement (this "Agreement") is entered into as of {{DATE}} by and between:

{{COMPANY_NAME}}, a company incorporated in {{JURISDICTION}} (the "Company")

and

{{INVESTOR_NAME}}, {{INVESTOR_TYPE}} (the "Investor")

RECITALS

WHEREAS, the Company is seeking to raise capital to fund its operations and growth;

WHEREAS, the Investor desires to invest in the Company on the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants herein, the parties agree as follows:

1. INVESTMENT

1.1 Investment Amount
The Investor agrees to invest {{INVESTMENT_AMOUNT}} (the "Investment Amount") in the Company in exchange for securities as described in Section 2.

1.2 Closing
The closing of the investment (the "Closing") shall occur on {{CLOSING_DATE}}, or such other date as mutually agreed by the parties.

1.3 Payment
The Investment Amount shall be paid by wire transfer to the Company's designated account.

2. SECURITIES

2.1 Issuance
Upon Closing, the Company shall issue to the Investor {{SHARES_ISSUED}} shares of {{SECURITY_TYPE}} (the "Securities").

2.2 Price Per Share
The purchase price per share shall be {{PRICE_PER_SHARE}}, based on a pre-money valuation of {{PRE_MONEY_VALUATION}}.

3. REPRESENTATIONS AND WARRANTIES OF THE COMPANY

The Company represents and warrants to the Investor that:

3.1 Organization
The Company is duly organized, validly existing, and in good standing under the laws of its jurisdiction of incorporation.

3.2 Authorization
The Company has full corporate power and authority to enter into this Agreement and to issue the Securities.

3.3 Capitalization
The capitalization of the Company as of the date hereof is set forth on Schedule A attached hereto.

3.4 No Conflicts
The execution and delivery of this Agreement and the issuance of the Securities do not violate any law, regulation, or agreement to which the Company is a party.

3.5 Financial Statements
The financial statements provided to the Investor fairly present the financial condition of the Company.

3.6 Litigation
There is no material litigation pending or threatened against the Company.

3.7 Intellectual Property
The Company owns or has rights to all intellectual property necessary for its business.

4. REPRESENTATIONS AND WARRANTIES OF THE INVESTOR

The Investor represents and warrants to the Company that:

4.1 Accredited Investor
The Investor is an "accredited investor" as defined in Rule 501 of Regulation D under the Securities Act of 1933.

4.2 Investment Intent
The Investor is acquiring the Securities for investment purposes only and not with a view to distribution.

4.3 Risk Acknowledgment
The Investor acknowledges that investment in the Company involves a high degree of risk and that the Investor may lose the entire Investment Amount.

4.4 Due Diligence
The Investor has had the opportunity to ask questions of and receive answers from the Company regarding the investment.

5. COVENANTS

5.1 Use of Proceeds
The Company agrees to use the Investment Amount for {{USE_OF_PROCEEDS}}.

5.2 Information Rights
The Company shall provide the Investor with quarterly financial reports and an annual audited financial statement.

5.3 Board Observer Rights
[If applicable] The Investor shall have the right to appoint a non-voting observer to the Company's Board of Directors.

6. CONDITIONS TO CLOSING

6.1 Conditions to Investor's Obligations
The Investor's obligation to close is subject to:
- Accuracy of Company's representations and warranties
- Compliance with all covenants
- No material adverse change

6.2 Conditions to Company's Obligations
The Company's obligation to close is subject to:
- Accuracy of Investor's representations and warranties
- Receipt of the Investment Amount

7. INDEMNIFICATION

Each party agrees to indemnify and hold harmless the other party from any losses arising from any breach of representations, warranties, or covenants in this Agreement.

8. GENERAL PROVISIONS

8.1 Governing Law
This Agreement shall be governed by the laws of {{GOVERNING_LAW_STATE}}.

8.2 Dispute Resolution
Any disputes arising under this Agreement shall be resolved through binding arbitration in {{ARBITRATION_LOCATION}}.

8.3 Entire Agreement
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations and agreements.

8.4 Amendment
This Agreement may only be amended in writing signed by both parties.

8.5 Notices
All notices under this Agreement shall be in writing and delivered to the addresses set forth below.

8.6 Severability
If any provision of this Agreement is invalid or unenforceable, the remaining provisions shall continue in full force and effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

COMPANY: {{COMPANY_NAME}}
By: {{FOUNDER_NAME}}
Title: CEO
Address: {{COMPANY_ADDRESS}}
Date: {{DATE}}

INVESTOR: {{INVESTOR_NAME}}
By: ____________________
Title: ____________________
Address: {{INVESTOR_ADDRESS}}
Date: __________

SCHEDULE A: CAPITALIZATION TABLE
[To be attached]`,
  },
};


export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Get available templates
export const getTemplates = query({
  args: {},
  handler: async () => {
    return Object.entries(TEMPLATES).map(([key, value]) => ({
      type: key as TemplateType,
      name: value.name,
    }));
  },
});

// Generate filled template content
export const generateTemplate = query({
  args: {
    projectId: v.id('projects'),
    type: v.union(
      v.literal('SAFE'),
      v.literal('NDA'),
      v.literal('ADVISOR'),
      v.literal('FOUNDER'),
      v.literal('CONVERTIBLE_NOTE'),
      v.literal('TERM_SHEET'),
      v.literal('INVESTMENT_AGREEMENT')
    ),
    // Optional overrides for template variables
    investorName: v.optional(v.string()),
    investmentAmount: v.optional(v.string()),
    discountPercentage: v.optional(v.number()),
    valuationCap: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthorized');

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error('Project not found');

    const owner = await ctx.db.get(project.ownerId);
    if (!owner) throw new Error('Project owner not found');

    const template = TEMPLATES[args.type];
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let content = template.content
      .replace(/\{\{COMPANY_NAME\}\}/g, project.title)
      .replace(/\{\{FOUNDER_NAME\}\}/g, owner.displayName || `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || owner.username)
      .replace(/\{\{DATE\}\}/g, today)
      .replace(/\{\{INVESTOR_NAME\}\}/g, args.investorName || '[INVESTOR NAME]')
      .replace(/\{\{RECIPIENT_NAME\}\}/g, args.investorName || '[RECIPIENT NAME]')
      .replace(/\{\{INVESTMENT_AMOUNT\}\}/g, args.investmentAmount || `$${project.fundingGoal.toLocaleString()}`)
      .replace(/\{\{DISCOUNT_PERCENTAGE\}\}/g, String(args.discountPercentage || 20))
      .replace(/\{\{VALUATION_CAP\}\}/g, args.valuationCap || `$${(project.fundingGoal * 5).toLocaleString()}`);

    return {
      type: args.type,
      name: template.name,
      content,
      projectTitle: project.title,
    };
  },
});

export const createDoc = mutation({
  args: {
    projectId: v.id("projects"),
    type: v.union(
      v.literal("SAFE"),
      v.literal("NDA"),
      v.literal("ADVISOR"),
      v.literal("FOUNDER"),
      v.literal("CONVERTIBLE_NOTE"),
      v.literal("TERM_SHEET"),
      v.literal("INVESTMENT_AGREEMENT")
    ),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const docId = await ctx.db.insert("legalDocs", {
      projectId: args.projectId,
      type: args.type,
      storageId: args.storageId,
      status: "draft",
      createdAt: Date.now(),
    });

    return docId;
  },
});

export const getDocs = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("legalDocs")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        url: await ctx.storage.getUrl(doc.storageId),
      }))
    );
  },
});

export const signDoc = mutation({
  args: { docId: v.id("legalDocs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.docId, {
      status: "signed",
      signedAt: Date.now(),
      signerId: user._id,
    });
  },
});

// Delete a legal document (project owner only)
export const deleteDoc = mutation({
  args: { docId: v.id("legalDocs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    const doc = await ctx.db.get(args.docId);
    if (!doc) throw new Error("Document not found");

    const project = await ctx.db.get(doc.projectId);
    if (!project) throw new Error("Project not found");

    if (project.ownerId !== user._id) {
      throw new Error("Only project owner can delete documents");
    }

    // Delete the stored file
    await ctx.storage.delete(doc.storageId);
    
    // Delete the document record
    await ctx.db.delete(args.docId);
  },
});
