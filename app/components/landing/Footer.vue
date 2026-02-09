<script setup lang="ts">
import { contactInfo } from "~/config/contact";

const socialLinks = [
  {
    icon: "pi pi-facebook",
    url: contactInfo.social.facebook,
    label: "Facebook",
  },
  {
    icon: "pi pi-google",
    url: contactInfo.social.google,
    label: "Google",
  },
  {
    icon: "pi pi-linkedin",
    url: contactInfo.social.linkedin,
    label: "LinkedIn",
  },
  {
    icon: "pi pi-instagram",
    url: contactInfo.social.instagram,
    label: "Instagram",
  },
];

const quickLinks = [
  { label: "About Us", to: "/about", icon: "pi pi-info-circle" },
  { label: "Success Stories", to: "/success-stories", icon: "pi pi-star" },
  { label: "Partners", to: "/partners", icon: "pi pi-users" },
  { label: "Contact", to: "/contact", icon: "pi pi-send" },
];
</script>

<template>
  <footer class="relative bg-surface-950 overflow-hidden">
    <!-- Advanced Background -->
    <div class="absolute inset-0 z-0">
      <!-- Gradient Mesh -->
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-gradient-to-t from-primary-500/10 via-primary-600/5 to-transparent blur-[120px] opacity-50"
      ></div>
      <!-- Grid Pattern -->
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--p-primary-500-rgb),0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30"
      ></div>
      <!-- Top Border Glow -->
      <div
        class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"
      ></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
      <!-- Slim Footer CTA -->
      <div class="py-8 md:py-10">
        <div class="relative group">
          <!-- Animated Gradient Border -->
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          ></div>

          <!-- CTA Card -->
          <div
            class="relative rounded-2xl bg-gradient-to-br from-surface-900/80 to-surface-900/40 border border-white/10 backdrop-blur-2xl overflow-hidden"
          >
            <!-- Inner Glow -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-600/5"
            ></div>

            <!-- Content -->
            <div class="relative px-6 py-6 md:px-10 md:py-8">
              <div
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              >
                <!-- Left: Messaging -->
                <div class="space-y-2 max-w-xl">
                  <h3
                    class="text-xl md:text-2xl font-black tracking-tight leading-tight"
                  >
                    <span class="text-white">Ready to Start Your Journey?</span>
                  </h3>
                  <p class="text-sm text-surface-400 font-medium">
                    Get expert guidance for your study abroad or immigration
                    goals. Book a free consultation today.
                  </p>
                </div>

                <!-- Right: Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 sm:min-w-fit">
                  <NuxtLink
                    to="/contact"
                    class="group/btn relative px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-500 hover:scale-105 text-center overflow-hidden"
                  >
                    <span
                      class="relative z-10 flex items-center justify-center gap-2"
                    >
                      <span>Book Consultation</span>
                      <i
                        class="pi pi-arrow-right text-xs transform group-hover/btn:translate-x-1 transition-transform"
                      ></i>
                    </span>
                    <!-- Animated Shine -->
                    <div
                      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
                    ></div>
                  </NuxtLink>

                  <a
                    :href="contactInfo.whatsapp.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <i class="pi pi-whatsapp text-primary-500 text-xs"></i>
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Footer Content -->
      <div class="py-16 md:py-20">
        <div class="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <!-- Brand Section -->
          <div class="lg:col-span-5 space-y-8">
            <!-- Logo with Glow -->
            <div class="relative inline-block group">
              <div
                class="absolute -inset-4 bg-primary-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              ></div>
              <BaseLogo class="relative" />
            </div>

            <p
              class="text-sm md:text-base text-surface-300 leading-relaxed max-w-md font-medium"
            >
              Empowering dreams through
              <span class="text-primary-400 font-bold italic"
                >expert guidance</span
              >. Your trusted partner in global education and immigration
              excellence.
            </p>

            <!-- Premium Social Links -->
            <div class="space-y-4">
              <h4
                class="text-[9px] font-black text-surface-500 uppercase tracking-[0.3em]"
              >
                Connect With Us
              </h4>
              <div class="flex items-center gap-3">
                <a
                  v-for="social in socialLinks"
                  :key="social.icon"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group relative"
                >
                  <!-- Glow on Hover -->
                  <div
                    class="absolute -inset-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                  ></div>
                  <!-- Icon Container -->
                  <div
                    class="relative w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-surface-900/60 to-surface-900/30 border border-white/10 backdrop-blur-xl text-surface-400 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-all duration-300"
                  >
                    <i :class="[social.icon, 'text-lg']"></i>
                  </div>
                </a>
              </div>
            </div>

            <!-- Trust Indicators -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="group relative">
                <div
                  class="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div
                  class="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-surface-900/60 to-surface-900/30 border border-white/10 backdrop-blur-xl"
                >
                  <i class="pi pi-verified text-primary-500 text-sm"></i>
                  <span
                    class="text-xs text-surface-300 font-black uppercase tracking-wider"
                    >Verified</span
                  >
                </div>
              </div>
              <div class="group relative">
                <div
                  class="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                ></div>
                <div
                  class="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-surface-900/60 to-surface-900/30 border border-white/10 backdrop-blur-xl"
                >
                  <div class="flex gap-0.5">
                    <i
                      v-for="i in 5"
                      :key="i"
                      class="pi pi-star-fill text-yellow-400 text-[10px]"
                    ></i>
                  </div>
                  <span class="text-xs text-surface-300 font-black">5.0</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Links & Contact Grid -->
          <div class="lg:col-span-7 grid md:grid-cols-2 gap-10 md:gap-12">
            <!-- Quick Links -->
            <div class="space-y-6">
              <h4
                class="text-xs font-black text-white uppercase tracking-[0.25em] flex items-center gap-2"
              >
                <div
                  class="w-1 h-4 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"
                ></div>
                Quick Links
              </h4>
              <ul class="space-y-3">
                <li v-for="link in quickLinks" :key="link.label">
                  <NuxtLink
                    :to="link.to"
                    class="group flex items-center gap-3 text-sm text-surface-300 hover:text-primary-400 transition-all duration-300"
                  >
                    <div
                      class="w-8 h-8 rounded-lg bg-gradient-to-br from-surface-900/60 to-surface-900/30 border border-white/10 backdrop-blur-xl flex items-center justify-center group-hover:border-primary-500/30 group-hover:bg-primary-500/10 transition-all duration-300"
                    >
                      <i
                        :class="[
                          link.icon,
                          'text-xs text-surface-500 group-hover:text-primary-500',
                        ]"
                      ></i>
                    </div>
                    <span class="font-bold">{{ link.label }}</span>
                    <i
                      class="pi pi-arrow-right text-[8px] text-primary-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                    ></i>
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div class="space-y-6">
              <h4
                class="text-xs font-black text-white uppercase tracking-[0.25em] flex items-center gap-2"
              >
                <div
                  class="w-1 h-4 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"
                ></div>
                Get in Touch
              </h4>
              <div class="space-y-4">
                <a
                  :href="contactInfo.whatsapp.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-3 text-sm text-surface-300 hover:text-primary-400 transition-all duration-300"
                >
                  <div class="relative">
                    <div
                      class="absolute -inset-1 bg-primary-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    ></div>
                    <div
                      class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center group-hover:bg-primary-500/30 transition-all duration-300"
                    >
                      <i class="pi pi-whatsapp text-primary-500 text-sm"></i>
                    </div>
                  </div>
                  <div>
                    <div
                      class="text-[9px] text-surface-500 font-bold uppercase tracking-wider mb-0.5"
                    >
                      WhatsApp
                    </div>
                    <div class="font-bold">
                      {{ contactInfo.whatsapp.display }}
                    </div>
                  </div>
                </a>

                <a
                  :href="contactInfo.email.url"
                  class="group flex items-center gap-3 text-sm text-surface-300 hover:text-primary-400 transition-all duration-300"
                >
                  <div class="relative">
                    <div
                      class="absolute -inset-1 bg-primary-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    ></div>
                    <div
                      class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center group-hover:bg-primary-500/30 transition-all duration-300"
                    >
                      <i class="pi pi-envelope text-primary-500 text-sm"></i>
                    </div>
                  </div>
                  <div>
                    <div
                      class="text-[9px] text-surface-500 font-bold uppercase tracking-wider mb-0.5"
                    >
                      Email
                    </div>
                    <div class="font-bold">{{ contactInfo.email.address }}</div>
                  </div>
                </a>

                <div class="flex items-center gap-3 text-sm text-surface-300">
                  <div
                    class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0"
                  >
                    <i class="pi pi-map-marker text-primary-500 text-sm"></i>
                  </div>
                  <div>
                    <div
                      class="text-[9px] text-surface-500 font-bold uppercase tracking-wider mb-0.5"
                    >
                      Location
                    </div>
                    <div class="font-bold leading-relaxed">
                      {{ contactInfo.location.full }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Premium Bottom Bar -->
      <div class="py-6 border-t border-white/5">
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <!-- Copyright & Status -->
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <p class="text-xs text-surface-500 font-medium">
              © {{ new Date().getFullYear() }}
              <span class="font-black text-surface-400"
                >Unireach Consultancy</span
              >. All rights reserved.
            </p>
            <div
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-surface-900/60 to-surface-900/30 border border-white/10 backdrop-blur-xl"
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"
                ></span>
              </span>
              <span
                class="text-[9px] font-black text-surface-400 uppercase tracking-[0.2em]"
                >All Systems Operational</span
              >
            </div>
          </div>

          <!-- Legal Links -->
          <div class="flex items-center gap-6">
            <NuxtLink
              to="/faq"
              class="text-[10px] font-black text-surface-500 hover:text-primary-500 uppercase tracking-[0.2em] transition-colors duration-300"
            >
              FAQ
            </NuxtLink>
            <div class="w-px h-3 bg-white/10"></div>
            <NuxtLink
              to="/privacy"
              class="text-[10px] font-black text-surface-500 hover:text-primary-500 uppercase tracking-[0.2em] transition-colors duration-300"
            >
              Privacy Policy
            </NuxtLink>
            <div class="w-px h-3 bg-white/10"></div>
            <NuxtLink
              to="/terms"
              class="text-[10px] font-black text-surface-500 hover:text-primary-500 uppercase tracking-[0.2em] transition-colors duration-300"
            >
              Terms of Service
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.bg-\[size\:80px_80px\] {
  background-size: 80px 80px;
}
</style>
