<script setup lang="ts">
import { contactInfo } from "~/config/contact";

definePageMeta({
  layout: false,
});

const sections = [
  {
    id: "controller-info",
    title: "1. Data Controller Information",
    content: [
      'Unireach Consultancy ("we", "us", "our") is the data controller responsible for your personal information.',
      "",
      "Registered Office: Dhaka, Bangladesh",
      "Email: contact@Unireachbd.com",
      "WhatsApp: +880 189 879 6091",
      "",
      "This Privacy Policy complies with the General Data Protection Regulation (GDPR) and the Digital Security Act 2018 of Bangladesh.",
    ],
  },
  {
    id: "information-collection",
    title: "2. Information We Collect",
    content: [
      "We collect and process the following categories of personal data:",
      "",
      "a) Identity Data: Full name, date of birth, gender, nationality, passport details, national ID/birth certificate",
      "",
      "b) Contact Data: Email address, phone number, WhatsApp number, residential address, emergency contact information",
      "",
      "c) Educational Data: Academic transcripts, certificates, diplomas, language test scores (IELTS, TOEFL, etc.), letters of recommendation, statement of purpose",
      "",
      "d) Financial Data: Bank statements, proof of funds, scholarship information, payment details for our services",
      "",
      "e) Immigration Data: Visa application documents, travel history, previous visa refusals, criminal record checks (if required)",
      "",
      "f) Technical Data: IP address, browser type, device information, cookies, usage data, website analytics",
      "",
      "g) Communication Data: Correspondence via email, phone, WhatsApp, in-person consultations, feedback and survey responses",
    ],
  },
  {
    id: "legal-basis",
    title: "3. Legal Basis for Processing (GDPR Article 6)",
    content: [
      "We process your personal data based on the following legal grounds:",
      "",
      "a) Consent (Article 6(1)(a)): You have given explicit consent for processing your data for specific purposes",
      "",
      "b) Contract Performance (Article 6(1)(b)): Processing is necessary to fulfill our contractual obligations to provide education consultancy and immigration services",
      "",
      "c) Legal Obligation (Article 6(1)(c)): We must process data to comply with legal requirements under Bangladesh law, immigration regulations, and international education standards",
      "",
      "d) Legitimate Interests (Article 6(1)(f)): Processing is necessary for our legitimate business interests, such as fraud prevention, service improvement, and business analytics",
      "",
      "You have the right to withdraw consent at any time without affecting the lawfulness of processing based on consent before withdrawal.",
    ],
  },
  {
    id: "how-we-use",
    title: "4. How We Use Your Information",
    content: [
      "We use your personal data for the following purposes:",
      "",
      "• Application Processing: Preparing and submitting applications to universities, colleges, and immigration authorities",
      "• Consultation Services: Providing personalized guidance on study abroad and immigration options",
      "• Document Verification: Verifying the authenticity of submitted documents",
      "• Communication: Sending updates about your application status, important deadlines, and service-related information",
      "• Legal Compliance: Meeting regulatory requirements in Bangladesh and destination countries",
      "• Service Improvement: Analyzing usage patterns to enhance our services",
      "• Marketing: Sending promotional materials (only with your explicit consent, which can be withdrawn anytime)",
      "• Record Keeping: Maintaining records as required by law and professional standards",
    ],
  },
  {
    id: "information-sharing",
    title: "5. Information Sharing and Disclosure",
    content: [
      "We share your personal data with the following categories of recipients:",
      "",
      "a) Educational Institutions: Universities, colleges, and schools in destination countries for admission processing",
      "",
      "b) Immigration Authorities: Visa application centers, embassies, high commissions, and immigration departments",
      "",
      "c) Government Agencies: Bangladesh authorities as required under the Digital Security Act 2018 and other applicable laws",
      "",
      "d) Service Providers: Document translation services, courier companies, payment processors (operating under strict data processing agreements)",
      "",
      "e) Professional Advisors: Lawyers, accountants, and consultants bound by confidentiality obligations",
      "",
      "f) Legal Requirements: Law enforcement, regulatory bodies, or courts when legally obligated",
      "",
      "We do NOT sell, rent, or trade your personal information to third parties for marketing purposes. All third-party processors are contractually bound to protect your data in accordance with GDPR standards.",
    ],
  },
  {
    id: "international-transfers",
    title: "6. International Data Transfers",
    content: [
      "Your personal data may be transferred to and processed in countries outside Bangladesh, including:",
      "",
      "• European Union member states",
      "• United States",
      "• Canada",
      "• Australia",
      "• United Kingdom",
      "• Other countries where educational institutions or immigration authorities are located",
      "",
      "When transferring data internationally, we ensure adequate protection through:",
      "",
      "• Standard Contractual Clauses (SCCs) approved by the European Commission",
      "• Adequacy decisions recognizing equivalent data protection standards",
      "• Explicit consent for transfers where required",
      "",
      "You have the right to obtain information about the safeguards we use for international transfers.",
    ],
  },
  {
    id: "data-security",
    title: "7. Data Security Measures",
    content: [
      "We implement comprehensive technical and organizational security measures in compliance with GDPR Article 32:",
      "",
      "Technical Measures:",
      "• End-to-end encryption (TLS 1.3) for data transmission",
      "• AES-256 encryption for data at rest",
      "• Secure cloud storage with access controls",
      "• Regular security audits and penetration testing",
      "• Multi-factor authentication for staff access",
      "• Automated backup systems with encryption",
      "",
      "Organizational Measures:",
      "• Staff training on data protection and GDPR compliance",
      "• Confidentiality agreements with all employees",
      "• Access controls based on need-to-know principle",
      "• Incident response and data breach notification procedures",
      "• Regular review and update of security policies",
      "",
      "While we implement robust security measures, no system is completely secure. We will notify you and relevant authorities within 72 hours of discovering any data breach that poses a risk to your rights and freedoms.",
    ],
  },
  {
    id: "your-rights",
    title: "8. Your Data Protection Rights (GDPR Chapter III)",
    content: [
      "Under GDPR and Bangladesh law, you have the following rights:",
      "",
      "a) Right to Access (Article 15): Request copies of your personal data",
      "",
      "b) Right to Rectification (Article 16): Correct inaccurate or incomplete data",
      "",
      'c) Right to Erasure/"Right to be Forgotten" (Article 17): Request deletion of your data (subject to legal retention requirements)',
      "",
      "d) Right to Restriction of Processing (Article 18): Limit how we use your data",
      "",
      "e) Right to Data Portability (Article 20): Receive your data in a structured, machine-readable format",
      "",
      "f) Right to Object (Article 21): Object to processing based on legitimate interests or for direct marketing",
      "",
      "g) Rights Related to Automated Decision-Making (Article 22): Not be subject to decisions based solely on automated processing",
      "",
      "h) Right to Withdraw Consent: Withdraw consent at any time (without affecting prior lawful processing)",
      "",
      "To exercise these rights, contact us at contact@Unireachbd.com. We will respond within 30 days. You may also lodge a complaint with the Bangladesh Telecommunication Regulatory Commission (BTRC) or your local data protection authority.",
    ],
  },
  {
    id: "data-retention",
    title: "9. Data Retention Periods",
    content: [
      "We retain personal data only as long as necessary for the purposes outlined in this policy:",
      "",
      "• Active Client Data: Duration of service provision plus 2 years",
      "• Application Documents: 7 years after application completion (for reference and legal compliance)",
      "• Financial Records: 10 years (as required by Bangladesh tax and accounting laws)",
      "• Marketing Consent Records: Until consent is withdrawn plus 3 years",
      "• Communication Records: 5 years for quality assurance and dispute resolution",
      "• Website Analytics: 26 months",
      "",
      "After retention periods expire, we securely delete or anonymize your data. You may request earlier deletion subject to legal and contractual obligations.",
    ],
  },
  {
    id: "cookies",
    title: "10. Cookies and Tracking Technologies",
    content: [
      "We use cookies and similar technologies in compliance with GDPR Article 5(3) and ePrivacy Directive:",
      "",
      "Strictly Necessary Cookies: Essential for website functionality (no consent required)",
      "",
      "Performance Cookies: Analyze website usage and improve performance (requires consent)",
      "",
      "Functional Cookies: Remember your preferences and settings (requires consent)",
      "",
      "Marketing Cookies: Track your activity for targeted advertising (requires explicit consent)",
      "",
      "You can manage cookie preferences through our cookie consent banner or browser settings. Blocking certain cookies may impact website functionality.",
      "",
      "We use Google Analytics with IP anonymization enabled. You can opt-out using the Google Analytics Opt-out Browser Add-on.",
    ],
  },
  {
    id: "bangladesh-compliance",
    title: "11. Bangladesh Digital Security Act 2018 Compliance",
    content: [
      "In accordance with the Digital Security Act 2018 of Bangladesh:",
      "",
      "• We maintain secure systems to protect against unauthorized access (Section 21)",
      "• We do not unlawfully collect, sell, or distribute personal information (Section 26)",
      "• We comply with government requests for information when legally required (Section 32)",
      "• We maintain data integrity and prevent unauthorized modification (Section 3)",
      "• We report cybersecurity incidents to relevant Bangladesh authorities as required",
      "",
      "We also comply with:",
      "• Information and Communication Technology Act 2006 (amended 2013)",
      "• Bangladesh Telecommunication Regulation Act 2001",
      "• Any other applicable data protection regulations in Bangladesh",
    ],
  },
  {
    id: "children-privacy",
    title: "12. Children's Privacy",
    content: [
      "Our services are intended for individuals aged 16 and above. If you are under 16, we require verifiable parental or guardian consent before processing your data.",
      "",
      "If we discover we have collected data from a child under 16 without proper consent, we will delete it immediately.",
      "",
      "Parents/guardians have the right to access, correct, or delete their child's personal information by contacting us.",
    ],
  },
  {
    id: "dpo-contact",
    title: "13. Data Protection Officer",
    content: [
      "For data protection inquiries, you can contact our Data Protection Officer:",
      "",
      "Email: contact@Unireachbd.com",
      'Subject Line: "Data Protection Inquiry"',
      "WhatsApp: +880 189 879 6091",
      "",
      "We will respond to all data protection requests within 30 days.",
    ],
  },
  {
    id: "complaints",
    title: "14. Right to Lodge a Complaint",
    content: [
      "If you believe your data protection rights have been violated, you have the right to lodge a complaint with:",
      "",
      "Bangladesh:",
      "• Bangladesh Telecommunication Regulatory Commission (BTRC)",
      "• Address: IEB Bhaban, Ramna, Dhaka-1000, Bangladesh",
      "• Website: www.btrc.gov.bd",
      "",
      "European Union (if applicable):",
      "• Your local Data Protection Authority",
      "• EU Data Protection Supervisor",
      "",
      "You also have the right to seek judicial remedy through Bangladesh courts or courts in your jurisdiction.",
    ],
  },
  {
    id: "updates",
    title: "15. Policy Updates and Changes",
    content: [
      "We may update this Privacy Policy to reflect changes in our practices, legal requirements, or business operations.",
      "",
      "Material changes will be communicated through:",
      "• Prominent notice on our website",
      "• Email notification to registered users",
      '• Updated "Last Updated" date at the top of this policy',
      "",
      "Continued use of our services after changes constitutes acceptance of the updated policy. If you disagree with changes, you may terminate your relationship with us and request data deletion (subject to legal retention requirements).",
      "",
      "We encourage you to review this policy periodically to stay informed about how we protect your information.",
    ],
  },
];

const lastUpdated = "February 9, 2026";
const policyVersion = "v2.0";
</script>

<template>
  <NuxtLayout name="landing">
    <!-- Hero Section -->
    <section
      class="relative bg-surface-950 pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden"
    >
      <!-- Background -->
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full"
        ></div>
      </div>

      <div class="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-surface-500 mb-6">
          <NuxtLink to="/" class="hover:text-primary-500 transition-colors"
            >Home</NuxtLink
          >
          <i class="pi pi-chevron-right text-xs"></i>
          <span class="text-surface-300">Privacy Policy</span>
        </div>

        <!-- Title -->
        <h1
          class="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4"
        >
          <span class="block text-white">Privacy</span>
          <span
            class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic mt-1"
            >Policy</span
          >
        </h1>

        <p class="text-lg text-surface-300 leading-relaxed mb-6">
          Your privacy is important to us. This policy explains how Unireach
          Consultancy collects, uses, and protects your personal information.
        </p>

        <!-- Last Updated & Version -->
        <div class="flex flex-wrap items-center gap-3">
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <i class="pi pi-calendar text-primary-500 text-sm"></i>
            <span class="text-xs text-surface-400 font-bold"
              >Last Updated: {{ lastUpdated }}</span
            >
          </div>
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/30 backdrop-blur-xl"
          >
            <i class="pi pi-shield text-primary-500 text-sm"></i>
            <span
              class="text-xs text-primary-400 font-black uppercase tracking-wider"
              >{{ policyVersion }} - GDPR & Bangladesh Compliant</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16 md:py-20 bg-surface-950">
      <div class="max-w-4xl mx-auto px-4 md:px-6">
        <!-- Introduction -->
        <div
          class="mb-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-surface-900/60 to-surface-900/30 border border-white/10 backdrop-blur-xl"
        >
          <p class="text-surface-300 leading-relaxed">
            At
            <span class="text-primary-400 font-bold">Unireach Consultancy</span
            >, we are committed to protecting your privacy and ensuring the
            security of your personal information. This Privacy Policy outlines
            our practices regarding the collection, use, and disclosure of your
            data when you use our services.
          </p>
        </div>

        <!-- Policy Sections -->
        <div class="space-y-8">
          <div
            v-for="(section, index) in sections"
            :key="section.id"
            class="group relative"
          >
            <!-- Section Number Badge -->
            <div
              class="absolute -left-4 top-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center"
            >
              <span class="text-xs font-black text-primary-400">{{
                index + 1
              }}</span>
            </div>

            <!-- Section Card -->
            <div
              class="pl-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-surface-900/40 to-surface-900/20 border border-white/5 hover:border-primary-500/20 transition-all duration-300"
            >
              <h2
                class="text-xl md:text-2xl font-black text-white mb-4 flex items-center gap-3"
              >
                {{ section.title }}
              </h2>
              <div class="space-y-3">
                <p
                  v-for="(paragraph, pIndex) in section.content"
                  :key="pIndex"
                  class="text-sm md:text-base text-surface-300 leading-relaxed"
                  :class="{ 'font-medium': paragraph.startsWith('•') }"
                >
                  {{ paragraph }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div
          class="mt-16 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 border border-primary-500/20 backdrop-blur-xl"
        >
          <h2
            class="text-2xl font-black text-white mb-4 flex items-center gap-3"
          >
            <i class="pi pi-envelope text-primary-500"></i>
            Contact Us About Privacy
          </h2>
          <p class="text-surface-300 leading-relaxed mb-6">
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us:
          </p>

          <div class="grid md:grid-cols-2 gap-4">
            <a
              :href="contactInfo.email.url"
              class="group/contact flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 hover:bg-white/10 transition-all duration-300"
            >
              <div
                class="w-10 h-10 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center group-hover/contact:bg-primary-500/30 transition-colors"
              >
                <i class="pi pi-envelope text-primary-500 text-sm"></i>
              </div>
              <div>
                <div
                  class="text-xs text-surface-500 font-bold uppercase tracking-wider"
                >
                  Email
                </div>
                <div class="text-sm font-bold text-white">
                  {{ contactInfo.email.address }}
                </div>
              </div>
            </a>

            <a
              :href="contactInfo.whatsapp.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group/contact flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 hover:bg-white/10 transition-all duration-300"
            >
              <div
                class="w-10 h-10 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center group-hover/contact:bg-primary-500/30 transition-colors"
              >
                <i class="pi pi-whatsapp text-primary-500 text-sm"></i>
              </div>
              <div>
                <div
                  class="text-xs text-surface-500 font-bold uppercase tracking-wider"
                >
                  WhatsApp
                </div>
                <div class="text-sm font-bold text-white">
                  {{ contactInfo.whatsapp.display }}
                </div>
              </div>
            </a>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="mt-12 text-center">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300"
          >
            <i class="pi pi-arrow-left text-xs"></i>
            <span>Back to Home</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.bg-\[size\:80px_80px\] {
  background-size: 80px 80px;
}
</style>
