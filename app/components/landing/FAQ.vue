<template>
  <section class="relative py-20 overflow-hidden bg-surface-950">
    <!-- Background Effects -->
    <div class="absolute inset-0 z-0">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px)] bg-size-[80px_80px] opacity-20"
      />
      <div
        class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full"
      />
    </div>

    <div class="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 backdrop-blur-xl mb-6"
        >
          <i class="pi pi-question-circle text-primary-400 text-xs"/>
          <span
            class="text-[9px] font-black uppercase tracking-[0.5em] text-primary-400"
            >Got Questions?</span
          >
        </div>

        <h2
          class="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4"
        >
          <span class="block text-white">Frequently Asked</span>
          <span
            class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 italic"
            >Questions</span
          >
        </h2>

        <p class="text-sm text-surface-300 max-w-2xl mx-auto">
          Everything you need to know about studying, working, and doing
          business in Europe
        </p>
      </div>

      <!-- Category Tabs -->
      <div class="flex justify-center gap-3 mb-12 flex-wrap">
        <button
          v-for="category in categories"
          :key="category.id"
          class="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300"
          :class="
            activeCategory === category.id
              ? 'bg-primary-500 text-black shadow-xl shadow-primary-500/30'
              : 'bg-surface-900/50 text-surface-400 hover:bg-surface-800 border border-white/10'
          "
          @click="activeCategory = category.id"
        >
          <i :class="[category.icon, 'mr-2']"/>
          {{ category.label }}
        </button>
      </div>

      <!-- FAQ Accordion -->
      <div class="max-w-4xl mx-auto space-y-3">
        <div
          v-for="(faq, index) in filteredFAQs"
          :key="index"
          class="group bg-surface-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-300"
        >
          <button
            class="w-full px-6 py-5 flex items-center justify-between text-left transition-all duration-300"
            @click="toggleFAQ(index)"
          >
            <div class="flex items-start gap-4 flex-1">
              <div
                class="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-1"
              >
                <i class="pi pi-question text-primary-400 text-xs"/>
              </div>
              <h3
                class="text-sm md:text-base font-bold text-white group-hover:text-primary-400 transition-colors pr-4"
              >
                {{ faq.question }}
              </h3>
            </div>
            <i
              :class="[
                'pi',
                openFAQ === index ? 'pi-minus' : 'pi-plus',
                'text-primary-400 text-sm transition-transform duration-300 flex-shrink-0',
              ]"
            />
          </button>

          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[1000px]"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 max-h-[1000px]"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="openFAQ === index" class="px-6 pb-6">
              <div
                class="pl-12 text-sm text-surface-300 leading-relaxed space-y-3"
              >
                <p v-html="faq.answer"/>
                <div
                  v-if="faq.tip"
                  class="mt-4 p-4 bg-primary-500/5 border border-primary-500/20 rounded-xl"
                >
                  <div class="flex items-start gap-3">
                    <i
                      class="pi pi-lightbulb text-primary-400 text-sm mt-1"
                    />
                    <div>
                      <p class="text-xs font-bold text-primary-400 mb-1">
                        Pro Tip
                      </p>
                      <p class="text-xs text-surface-300">{{ faq.tip }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Still Have Questions CTA -->
      <div
        class="mt-16 text-center p-8 bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-500/20 rounded-2xl backdrop-blur-xl"
      >
        <i class="pi pi-comments text-primary-400 text-3xl mb-4"/>
        <h3 class="text-xl font-black text-white mb-2">
          Still Have Questions?
        </h3>
        <p class="text-sm text-surface-300 mb-6">
          Our expert counselors are here to help you 24/7
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <a
            :href="contactInfo.whatsapp.url"
            target="_blank"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all shadow-xl hover:shadow-primary-500/30"
          >
            <i class="pi pi-whatsapp"/>
            WhatsApp Us
          </a>
          <NuxtLink
            to="/apply"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-400 transition-all shadow-xl hover:shadow-primary-500/30"
          >
            <i class="pi pi-send"/>
            Book Consultation
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { contactInfo } from "~/config/contact";

// Category state
const activeCategory = ref("study");
const openFAQ = ref<number | null>(null);

// Categories
const categories = [
  { id: "study", label: "Study Abroad", icon: "pi pi-graduation-cap" },
  { id: "job", label: "Job Migration", icon: "pi pi-briefcase" },
  { id: "business", label: "Business", icon: "pi pi-building" },
  { id: "general", label: "General", icon: "pi pi-info-circle" },
];

// FAQ Data (Accurate as of 2026)
const faqs = [
  // STUDY ABROAD FAQs
  {
    category: "study",
    question: "Which EU countries offer tuition-free education?",
    answer:
      "<strong>Germany, Norway, Finland, and Austria</strong> offer tuition-free or very low-cost education at public universities for international students. Germany charges only a semester fee (€150-350), while Norway has no tuition fees. Finland offers free education for EU/EEA students, and Austria charges around €1,500/year for non-EU students. However, you'll need to budget for living expenses (€800-1,200/month).",
    tip: "Germany is the most popular choice with over 400 English-taught programs and strong post-study work opportunities.",
  },
  {
    category: "study",
    question: "What are the English language requirements for EU universities?",
    answer:
      "Most EU universities require <strong>IELTS 6.0-7.0</strong> or <strong>TOEFL 80-100</strong> for undergraduate programs, and <strong>IELTS 6.5-7.5</strong> or <strong>TOEFL 90-110</strong> for master's programs. Some universities also accept <strong>PTE Academic, Duolingo English Test (105-120)</strong>, or Cambridge English certificates. A few universities offer English proficiency waivers if you completed previous education in English.",
    tip: "Countries like Netherlands and Sweden have higher English proficiency requirements (IELTS 7.0+) compared to Germany or Italy.",
  },
  {
    category: "study",
    question: "How much does it cost to study in Europe?",
    answer:
      "Costs vary significantly by country:<br><br><strong>Low-cost:</strong> Germany (€0-3,000/year), Norway (€0), Austria (€1,500/year)<br><strong>Mid-range:</strong> France (€3,000-10,000/year), Spain (€1,000-5,000/year), Italy (€1,000-4,000/year)<br><strong>Higher-cost:</strong> Netherlands (€8,000-15,000/year), Denmark (€8,000-16,000/year), Sweden (€10,000-15,000/year)<br><br>Living expenses: €800-1,500/month depending on city.",
    tip: "Eastern European countries like Poland, Czech Republic, and Hungary offer quality education at €2,000-5,000/year with lower living costs.",
  },
  {
    category: "study",
    question: "Can I work while studying in the EU?",
    answer:
      "Yes! Most EU countries allow international students to work <strong>20 hours/week during semester</strong> and <strong>full-time during holidays</strong>. Germany, Netherlands, and Ireland are particularly student-friendly. Hourly wages range from €10-15 in most countries, helping cover living expenses. No separate work permit is needed; your student visa covers part-time work.",
    tip: "Germany allows 120 full days or 240 half days of work per year, giving you flexibility to earn while studying.",
  },
  {
    category: "study",
    question: "What is the post-study work visa policy in EU countries?",
    answer:
      "<strong>Germany:</strong> 18-month job-seeker visa<br><strong>Netherlands:</strong> 1-year orientation year<br><strong>Ireland:</strong> 1-2 year stay-back (depending on degree level)<br><strong>France:</strong> 1-year temporary residence permit<br><strong>Sweden:</strong> 1-year residence permit for job seeking<br><strong>Denmark:</strong> 3-year work permit after graduation<br><br>These visas allow you to find employment and transition to a work visa.",
    tip: "Germany's 18-month job-seeker visa is one of the most generous, and you can work full-time during this period.",
  },
  {
    category: "study",
    question:
      "Are scholarships available for international students in Europe?",
    answer:
      "Yes! Major scholarships include:<br><br><strong>Erasmus Mundus:</strong> €1,400/month + tuition coverage<br><strong>DAAD (Germany):</strong> €850-1,200/month<br><strong>Swedish Institute Scholarships:</strong> Full tuition + living allowance<br><strong>Holland Scholarship:</strong> €5,000 one-time<br><strong>Eiffel Excellence (France):</strong> €1,400/month<br><br>Many universities also offer merit-based scholarships (25-100% tuition waiver).",
    tip: "Apply early! Most scholarship deadlines are 6-8 months before program start dates.",
  },

  // JOB MIGRATION FAQs
  {
    category: "job",
    question: "Which EU countries have the easiest work visa processes?",
    answer:
      "<strong>Germany's EU Blue Card</strong> is the easiest for skilled workers (requires €45,300+ salary or €41,041.80+ for shortage occupations). <strong>Netherlands</strong> offers the Highly Skilled Migrant visa with employer sponsorship. <strong>Portugal's Tech Visa</strong> and <strong>Ireland's Critical Skills Permit</strong> are also relatively straightforward. Processing times: 2-12 weeks depending on country.",
    tip: "Germany's Blue Card allows family reunification immediately and leads to permanent residence in 21-33 months.",
  },
  {
    category: "job",
    question: "What are the most in-demand jobs in the EU?",
    answer:
      "Top shortage occupations in 2026:<br><br><strong>Tech:</strong> Software developers, data scientists, cybersecurity experts, AI/ML engineers<br><strong>Healthcare:</strong> Nurses, doctors, physiotherapists, medical technicians<br><strong>Engineering:</strong> Mechanical, electrical, civil engineers<br><strong>Skilled Trades:</strong> Electricians, plumbers, welders<br><strong>Finance:</strong> Accountants, financial analysts<br><br>These professions often have fast-track visa processes.",
    tip: "IT professionals can find jobs in Germany, Netherlands, and Ireland with salaries ranging €50,000-90,000/year.",
  },
  {
    category: "job",
    question: "Do I need to speak the local language to work in the EU?",
    answer:
      "It depends on the country and industry. <strong>English is sufficient</strong> in Netherlands, Ireland, Sweden, Denmark, and for tech jobs in Germany. However, learning the local language significantly improves job prospects and integration. <strong>Germany, France, Spain, and Italy</strong> prefer candidates with local language skills (B1-B2 level) for most non-tech roles.",
    tip: "Many EU countries offer free or subsidized language courses for work visa holders and residents.",
  },
  {
    category: "job",
    question: "What is the EU Blue Card and who qualifies?",
    answer:
      "The <strong>EU Blue Card</strong> is a work and residence permit for highly qualified non-EU workers. Requirements:<br><br>• University degree (Bachelor's or higher)<br>• Job offer with minimum salary (€45,300+ in Germany, varies by country)<br>• Employment contract for at least 1 year<br><br>Benefits: Fast-track permanent residence, family reunification, mobility within EU after 18 months.",
    tip: "Blue Card holders can apply for permanent residence after 21 months in Germany if they have B1 German language skills.",
  },
  {
    category: "job",
    question: "How long does it take to get permanent residence through work?",
    answer:
      "Timeline varies by country:<br><br><strong>Germany:</strong> 21-33 months (Blue Card) or 4-5 years (regular work permit)<br><strong>Netherlands:</strong> 5 years<br><strong>Sweden:</strong> 4 years<br><strong>Ireland:</strong> 5 years<br><strong>Portugal:</strong> 5 years<br><strong>Spain:</strong> 5 years<br><br>Requirements include continuous residence, language proficiency, and stable income.",
    tip: "Germany offers the fastest path to permanent residence for Blue Card holders with language skills.",
  },

  // BUSINESS MIGRATION FAQs
  {
    category: "business",
    question: "Which EU countries are best for starting a business?",
    answer:
      "<strong>Netherlands:</strong> Easy company registration, startup visa available, English-friendly<br><strong>Estonia:</strong> E-Residency program, digital-first, low bureaucracy<br><strong>Ireland:</strong> Low corporate tax (12.5%), English-speaking, EU access<br><strong>Portugal:</strong> Startup visa, growing tech scene, lower costs<br><strong>Germany:</strong> Large market, strong economy, entrepreneur visa available<br><br>Consider factors: tax rates, ease of doing business, market size, and language.",
    tip: "Estonia's e-Residency allows you to run an EU company 100% online from anywhere in the world.",
  },
  {
    category: "business",
    question: "What is the minimum investment required for a business visa?",
    answer:
      "Investment requirements vary:<br><br><strong>Netherlands:</strong> €4,500 startup capital<br><strong>Germany:</strong> €25,000 (recommended, not mandatory)<br><strong>Portugal:</strong> €5,000 minimum<br><strong>Spain:</strong> €50,000+ for entrepreneur visa<br><strong>Ireland:</strong> €50,000-75,000 for startup visa<br><strong>Greece:</strong> €250,000 (Golden Visa through real estate)<br><br>Some countries also require a detailed business plan and proof of funds.",
    tip: "Netherlands' startup visa doesn't require minimum investment if you're endorsed by a recognized facilitator.",
  },
  {
    category: "business",
    question: "Can I get residency by investing in EU real estate?",
    answer:
      "Yes, through <strong>Golden Visa programs</strong>:<br><br><strong>Portugal:</strong> €500,000 real estate (or €280,000 in low-density areas)<br><strong>Spain:</strong> €500,000 real estate<br><strong>Greece:</strong> €250,000 real estate (increasing to €500,000 in prime areas from 2024)<br><strong>Italy:</strong> €2 million investment (various options)<br><br>These programs offer residence permits, visa-free Schengen travel, and path to citizenship.",
    tip: "Portugal's Golden Visa is most popular, offering permanent residence after 5 years and citizenship after 6 years.",
  },
  {
    category: "business",
    question: "What are the tax implications of doing business in the EU?",
    answer:
      "Corporate tax rates vary significantly:<br><br><strong>Low-tax:</strong> Ireland (12.5%), Hungary (9%), Cyprus (12.5%)<br><strong>Mid-range:</strong> Netherlands (25.8%), Portugal (21%), Spain (25%)<br><strong>Higher:</strong> Germany (30%), France (25.8%)<br><br>Consider also: VAT (19-27%), dividend tax, wealth tax, and double taxation treaties. Many countries offer tax incentives for startups and R&D.",
    tip: "Netherlands has excellent tax treaties and the '30% ruling' for expat employees, making it attractive for international businesses.",
  },
  {
    category: "business",
    question: "How do I hire employees from outside the EU?",
    answer:
      "As an EU business owner, you can sponsor non-EU employees through:<br><br>• <strong>Work permits:</strong> Apply on behalf of employee (processing: 2-12 weeks)<br>• <strong>EU Blue Card:</strong> For highly skilled workers with university degrees<br>• <strong>Intra-company transfer:</strong> For transferring existing employees<br><br>Requirements: Prove no suitable EU candidate available, meet minimum salary thresholds, provide employment contract. Some countries have quota systems.",
    tip: "Germany and Netherlands have streamlined processes for tech companies to hire international talent.",
  },

  // GENERAL FAQs
  {
    category: "general",
    question: "What is the Schengen visa and how does it work?",
    answer:
      "The <strong>Schengen visa</strong> allows travel across 27 European countries without border checks. Types:<br><br><strong>Short-stay (Type C):</strong> Up to 90 days in 180-day period for tourism/business<br><strong>Long-stay (Type D):</strong> National visa for study/work/residence (90+ days)<br><br>Schengen countries include most EU nations plus Iceland, Norway, Switzerland, and Liechtenstein. Ireland and Cyprus are not part of Schengen.",
    tip: "Apply for Schengen visa at the embassy of your main destination country, at least 15 days before travel.",
  },
  {
    category: "general",
    question: "How long does the visa application process take?",
    answer:
      "Processing times vary by visa type and country:<br><br><strong>Student visa:</strong> 4-12 weeks<br><strong>Work visa/Blue Card:</strong> 2-12 weeks<br><strong>Business visa:</strong> 3-8 weeks<br><strong>Family reunification:</strong> 3-6 months<br><strong>Schengen tourist visa:</strong> 10-15 days<br><br>Apply well in advance and ensure all documents are complete to avoid delays.",
    tip: "Germany and Netherlands typically have faster processing times (2-6 weeks) compared to Southern European countries.",
  },
  {
    category: "general",
    question: "Can my family join me in the EU?",
    answer:
      "Yes! Most EU countries allow <strong>family reunification</strong> for:<br><br>• Spouse/registered partner<br>• Children under 18 (sometimes up to 21)<br>• Dependent parents (in some countries)<br><br>Requirements: Proof of relationship, adequate housing, sufficient income (usually 100-150% of minimum wage), health insurance. Processing: 3-6 months. Family members can usually work and study.",
    tip: "Blue Card holders can bring family immediately without waiting periods, unlike some other visa types.",
  },
  {
    category: "general",
    question: "What is the cost of living in major EU cities?",
    answer:
      "Monthly living costs (single person, excluding rent):<br><br><strong>Expensive:</strong> Copenhagen (€1,200), Amsterdam (€1,100), Dublin (€1,100)<br><strong>Mid-range:</strong> Berlin (€900), Madrid (€800), Lisbon (€750)<br><strong>Affordable:</strong> Prague (€650), Warsaw (€600), Budapest (€550)<br><br>Rent (1-bedroom city center): €800-2,000 depending on city. Add €100-150 for utilities and internet.",
    tip: "Eastern European cities offer 30-50% lower costs while still providing excellent quality of life and EU access.",
  },
  {
    category: "general",
    question: "Do I need health insurance to live in the EU?",
    answer:
      "Yes, <strong>health insurance is mandatory</strong> for all visa applications and residence permits. Options:<br><br><strong>Public health insurance:</strong> Available once you're employed/registered (€100-300/month)<br><strong>Private health insurance:</strong> Required for students and self-employed (€50-150/month)<br><strong>Travel insurance:</strong> Minimum €30,000 coverage for Schengen visa<br><br>EU residents get access to healthcare across all EU countries with European Health Insurance Card (EHIC).",
    tip: "Germany's public health insurance (Gesetzliche Krankenversicherung) is comprehensive and covers family members.",
  },
];

// Computed filtered FAQs
const filteredFAQs = computed(() => {
  return faqs.filter((faq) => faq.category === activeCategory.value);
});

// Toggle FAQ
const toggleFAQ = (index: number) => {
  openFAQ.value = openFAQ.value === index ? null : index;
};
</script>

<style scoped>
.bg-size-\[80px_80px\] {
  background-size: 80px 80px;
}

/* Smooth height transitions */
.max-h-0 {
  max-height: 0;
}

.max-h-\[1000px\] {
  max-height: 1000px;
}
</style>
