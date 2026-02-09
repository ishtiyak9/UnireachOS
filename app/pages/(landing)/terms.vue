<script setup lang="ts">
import { contactInfo } from "~/config/contact";
definePageMeta({
  layout: false,
});

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using this website (the 'Site'), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Site's particular services, you shall be subject to any posted guidelines or rules applicable to such services. All such guidelines or rules are hereby incorporated by reference into the Terms of Use. ANY PARTICIPATION IN THIS SITE WILL CONSTITUTE ACCEPTANCE OF THIS AGREEMENT. IF YOU DO NOT AGREE TO ABIDE BY THE ABOVE, PLEASE DO NOT USE THIS SITE.",
  },
  {
    title: "2. Intellectual Property Rights",
    content:
      "The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights. The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited. You do not acquire ownership rights to any content, document or other materials viewed through the Site. The posting of information or materials on the Site does not constitute a waiver of any right in such information and materials.",
  },
  {
    title: "3. Service Disclaimer (No Guarantees)",
    content:
      "Unireach acts as an educational consultancy and advisory firm. While we strive to provide the most accurate and up-to-date guidance based on university admissions criteria and visa regulations, we cannot and do not guarantee admission to any specific university or the issuance of any visa or permit. Admission decisions are the sole prerogative of the respective educational institutions, and visa decisions are the sole prerogative of the respective government immigration authorities. Unireach is not liable for any rejection or delay in these processes.",
  },
  {
    title: "4. Use of Information",
    content:
      "We provide information on this Site for general guidance purposes only. While we make every effort to ensure the accuracy of the information presented, regulations and policies change frequently. You should formally consult with our advisors or the relevant official authorities before making any decisions based on the information provided on this Site.",
  },
  {
    title: "5. Limitation of Liability",
    content:
      "In no event will Unireach be liable for any incidental, indirect, consequential or special damages of any kind, or any damages whatsoever, including, without limitation, those resulting from loss of profit, loss of contracts, goodwill, data, information, income, anticipated savings or business relationships, whether or not advised of the possibility of such damage, arising out of or in connection with the use of this website or any linked websites.",
  },
  {
    title: "6. User Conduct",
    content:
      "You agree to use the Site only for lawful purposes. You are prohibited from posting on or transmitting through the Site any unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, sexually explicit, profane, hateful, racially, ethnically, or otherwise objectionable material of any kind, including but not limited to any material that encourages conduct that would constitute a criminal offense, give rise to civil liability, or otherwise violate any applicable local, state, national, or international law.",
  },
  {
    title: "7. Third-Party Links",
    content:
      "This Site may contain links to third-party websites. These links are provided solely as a convenience to you and not as an endorsement by Unireach of the contents on such third-party websites. Unireach is not responsible for the content of linked third-party sites and does not make any representations regarding the content or accuracy of materials on such third-party websites. If you decide to access linked third-party websites, you do so at your own risk.",
  },
  {
    title: "8. Modifications to Terms",
    content:
      "Unireach reserves the right to change these conditions from time to time as it sees fit and your continued use of the site will signify your acceptance of any adjustment to these terms. You are therefore advised to re-read this statement on a regular basis.",
  },
  {
    title: "9. Governing Law",
    content:
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of Bangladesh. Any dispute arising under these terms and conditions shall be subject to the exclusive jurisdiction of the courts of Bangladesh.",
  },
];
</script>

<template>
  <NuxtLayout name="landing">
    <div class="bg-surface-50 dark:bg-surface-950 min-h-screen">
      <!-- Header -->
      <section
        class="relative pt-32 pb-16 bg-white dark:bg-surface-900 border-b border-surface-100 dark:border-surface-800"
      >
        <div class="max-w-4xl mx-auto px-6 text-center">
          <h1
            class="text-3xl md:text-5xl font-black text-surface-900 dark:text-surface-0 mb-4 tracking-tight"
          >
            Terms of Use
          </h1>
          <p
            class="text-sm md:text-base text-surface-500 max-w-2xl mx-auto leading-relaxed"
          >
            Please read these terms carefully before using our services. Last
            updated: February 2026.
          </p>
        </div>
      </section>

      <!-- Terms Content -->
      <section class="py-16 md:py-24">
        <div class="max-w-4xl mx-auto px-6">
          <div
            class="bg-white dark:bg-surface-900 rounded-3xl p-8 md:p-12 shadow-xl border border-surface-100 dark:border-surface-800 space-y-12"
          >
            <div
              v-for="(section, index) in sections"
              :key="index"
              class="group"
            >
              <h2
                class="text-xl font-bold text-surface-900 dark:text-surface-0 mb-4 flex items-center gap-3"
              >
                <span class="w-1.5 h-6 bg-primary-500 rounded-full"/>
                {{ section.title }}
              </h2>
              <p
                class="text-surface-600 dark:text-surface-400 leading-loose text-sm pl-4 border-l-2 border-surface-100 dark:border-surface-800 group-hover:border-primary-100 dark:group-hover:border-primary-900 transition-colors"
              >
                {{ section.content }}
              </p>
            </div>

            <!-- Contact for Legal -->
            <div
              class="pt-12 border-t border-surface-100 dark:border-surface-800 mt-12"
            >
              <p class="text-sm text-surface-500 italic">
                If you have any questions about these Terms, please contact us
                at: <br >
                <a
                  :href="contactInfo.email.url"
                  class="text-primary-600 dark:text-primary-400 font-bold hover:underline not-italic"
                  >{{ contactInfo.email.address }}</a
                >
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>
