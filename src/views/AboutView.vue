<template>
  <div class="relative mx-auto flex h-full w-[90vw] max-w-7xl flex-col pt-32">
    <div class="mx-auto w-full max-w-5xl">
      <div class="mb-6 text-center">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700 uppercase shadow-sm ring-1 ring-blue-200/70"
        >
          About PhotoIn
        </span>
      </div>

      <div class="text-center">
        <h1 class="font-poppins text-4xl leading-[1.08] font-extrabold tracking-tight text-slate-900 md:text-5xl">
          A cute photobooth app
        </h1>
        <h2
          class="mt-2 bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text font-poppins text-4xl leading-[1.08] font-extrabold tracking-tight text-transparent md:text-5xl"
        >
          made for sweet memories
        </h2>
        <p class="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600/90 md:text-lg">
          PhotoIn is a simple, adorable photo booth experience you can run right in the browser — perfect for friends,
          events, and fun moments.
        </p>
      </div>

      <div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <h3 class="font-poppins text-lg font-bold text-slate-900">Brief Description</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            PhotoIn helps you capture photos quickly, apply cute vibes, and keep everything looking clean and
            share-ready. The goal is to make the photo booth flow feel effortless and fun.
          </p>
          <div class="mt-4 flex flex-wrap gap-2 text-sm">
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">📸 Instant capture</span>
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">🎨 Cute styling</span>
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">📤 Easy export</span>
          </div>
        </section>

        <section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <h3 class="font-poppins text-lg font-bold text-slate-900">How to Use</h3>
          <ol class="mt-4 space-y-2 text-sm text-slate-600">
            <li class="flex gap-3">
              <span
                class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/70"
                >1</span
              >
              <span>Open the app and tap <span class="font-semibold text-slate-700">Start Photo Session</span>.</span>
            </li>
            <li class="flex gap-3">
              <span
                class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/70"
                >2</span
              >
              <span>Allow camera access when your browser asks.</span>
            </li>
            <li class="flex gap-3">
              <span
                class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/70"
                >3</span
              >
              <span>Capture your photos, then pick your favorite look.</span>
            </li>
            <li class="flex gap-3">
              <span
                class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/70"
                >4</span
              >
              <span>Download or share your result.</span>
            </li>
          </ol>
        </section>

        <section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <h3 class="font-poppins text-lg font-bold text-slate-900">Technology Stack</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">Built with a modern, lightweight front-end stack:</p>
          <div class="mt-4 flex flex-wrap gap-2 text-sm">
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">Vue 3</span>
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">Vite</span>
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">TypeScript</span>
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">Tailwind CSS</span>
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">Vue Router</span>
            <!-- <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">Pinia</span> -->
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">Lucide Icons</span>
            <span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">GSAP</span>
          </div>
        </section>

        <section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <h3 class="font-poppins text-lg font-bold text-slate-900">Contact</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            Want to give feedback or report an issue? Reach out here:
          </p>
          <div class="mt-4 grid gap-2 text-sm">
            <a
              class="inline-flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-white"
              href="https://github.com/"
              target="_blank"
              rel="noopener"
            >
              <span class="font-medium">GitHub</span>
              <span class="text-slate-400">Open link</span>
            </a>
            <div
              class="inline-flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-slate-700 shadow-sm ring-1 ring-slate-200"
            >
              <span class="font-medium">Email</span>
              <span class="text-slate-400">hello@example.com</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
