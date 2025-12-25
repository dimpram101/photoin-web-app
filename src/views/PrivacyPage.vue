<template>
	<div class="relative mx-auto flex h-full w-[90vw] max-w-7xl flex-col pt-32 pb-16">
		<div class="mx-auto w-full max-w-5xl">
			<div class="mb-6 text-center">
				<span
					class="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700 uppercase shadow-sm ring-1 ring-blue-200/70"
				>
					Privacy Policy
				</span>
			</div>

			<div class="text-center">
				<h1 class="font-poppins text-4xl leading-[1.08] font-extrabold tracking-tight text-slate-900 md:text-5xl">
					Your privacy,
				</h1>
				<h2
					class="mt-2 bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text font-poppins text-4xl leading-[1.08] font-extrabold tracking-tight text-transparent md:text-5xl"
				>
					kept simple and cute
				</h2>
				<p class="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600/90 md:text-lg">
					This page explains how PhotoIn uses your camera, what data is stored, and what third-party services (if any)
					are involved.
				</p>
			</div>

			<div class="mt-10 grid grid-cols-1 gap-4">
				<section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
					<h3 class="font-poppins text-lg font-bold text-slate-900">Camera Permission Usage</h3>
					<p class="mt-3 text-sm leading-relaxed text-slate-600">
						PhotoIn requests camera permission only to preview and capture photos inside the app. Your camera feed is
						used in real-time so you can take pictures.
					</p>
					<div class="mt-4 flex flex-wrap gap-2 text-sm">
						<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">✅ Used for capture</span>
						<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">✅ Used for preview</span>
						<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">❌ Not recorded silently</span>
					</div>
				</section>

				<section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
					<h3 class="font-poppins text-lg font-bold text-slate-900">Data Storage</h3>
					<p class="mt-3 text-sm leading-relaxed text-slate-600">
						PhotoIn stores your captured photos locally on your device (in-browser) and only when needed for the
						session. We do not upload your photos to a server for storage.
					</p>
					<div class="mt-4 flex flex-wrap gap-2 text-sm">
						<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">🗂️ Local only</span>
						<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">🚫 No server storage</span>
						<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">📥 You control downloads</span>
					</div>
				</section>

        <section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <h3 class="font-poppins text-lg font-bold text-slate-900">Changes to This Policy</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

				<!-- <section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
					<h3 class="font-poppins text-lg font-bold text-slate-900">Third-Party Services</h3>
					<p class="mt-3 text-sm leading-relaxed text-slate-600">
						PhotoIn may load static assets (like icons or stickers) via Supabase storage. This is used for serving
						assets only — not for storing your personal photos.
					</p>
					<div class="mt-4 flex flex-wrap gap-2 text-sm">
						<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">Supabase: assets only</span>
						<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">No photo uploads</span>
					</div>
				</section> -->

				<section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
					<h3 class="font-poppins text-lg font-bold text-slate-900">Questions</h3>
					<p class="mt-3 text-sm leading-relaxed text-slate-600">
						If you have questions about privacy, please contact us.
					</p>
					<div
						class="mt-4 inline-flex w-full items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200"
					>
						<span class="font-medium">Email</span>
						<span class="text-slate-400">hello@example.com</span>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>
