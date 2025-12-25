<script setup lang="ts">
import CuteHomeBackground from '@/components/CuteHomeBackground.vue';
import { Camera } from 'lucide-vue-next';
import { onMounted } from 'vue';

async function getVisitorLog() {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  const ua = navigator.userAgent;
  const browser = /firefox|chrome|safari|opera|edg/i.exec(ua)?.[0] || 'Unknown Browser';
  const os = /windows|mac|linux|android|ios/i.exec(ua)?.[0] || 'Unknown OS';
  const log = {
    ip: data.ip,
    city: data.city,
    region: data.region,
    country: data.country_name,
    browser: browser,
    os: os,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  return log;
}

async function sendToTelegram(log) {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = '1317265848';
  const message = `Visitor Log:
      - IP: ${log.ip}
      - Location: ${log.city}, ${log.region}, ${log.country}
      - Browser: ${log.browser}
      - OS: ${log.os}
      - Time: ${log.timestamp}
      - URL: ${log.url}`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getVisitorLog().then((log) => {
    sendToTelegram(log);
  });
});
</script>

<template>
  <CuteHomeBackground>
    <div class="flex h-full flex-col items-center justify-center px-6 text-center">
      <div class="mb-6">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700 uppercase shadow-sm ring-1 ring-blue-200/70"
        >
          PhotoIn Booth
        </span>
      </div>
      <div class="max-w-3xl">
        <h1 class="font-poppins text-5xl leading-[1.05] font-extrabold tracking-tight text-slate-900 md:text-6xl">
          Capture moments.
        </h1>
        <h2
          class="mt-2 bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text font-poppins text-5xl leading-[1.05] font-extrabold tracking-tight text-transparent md:text-6xl"
        >
          Make them adorable ✨
        </h2>

        <p class="mx-auto mt-6 text-lg leading-relaxed text-slate-600/90 md:text-xl">
          A cute photo booth experience for friends, fun times, and unforgettable memories
        </p>
      </div>

      <div class="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-700">
        <div
          class="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur"
        >
          <Camera class="h-4 w-4 text-blue-600" />
          Instant Capture
        </div>
        <div class="rounded-full bg-white/70 px-4 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          🎨 Cute Filters
        </div>
        <div class="rounded-full bg-white/70 px-4 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          📤 Easy Share
        </div>
      </div>
      <RouterLink
        to="/choose-layout"
        class="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <Camera class="h-5 w-5 transition group-hover:rotate-12" />
        Start Photo Session
      </RouterLink>
    </div>
  </CuteHomeBackground>
</template>
