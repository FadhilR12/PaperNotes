<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types.js';

	let { form }: { form: ActionData } = $props();
</script>

<main class="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12 sm:px-8">
	<a
		class="inline-flex items-center gap-2.5 self-start"
		href="index.html"
		aria-label="PaperNotes home"
	>
		<span class="grid h-9 w-9 place-items-center rounded-lg bg-[#1e2022]" aria-hidden="true"
			><svg class="h-6 w-6" viewBox="0 0 100 100" fill="none"
				><path
					d="M30 26C30 23.7909 31.7909 22 34 22H56L70 36V74C70 76.2091 68.2091 78 66 78H34C31.7909 78 30 76.2091 30 74V26Z"
					fill="#FAF9F6"
				/><path d="M56 22V34C56 35.1046 56.8954 36 58 36H70" fill="#E5E5E0" /><line
					x1="40"
					y1="46"
					x2="60"
					y2="46"
					stroke="#1E2022"
					stroke-width="3.5"
					stroke-linecap="round"
				/><line
					x1="40"
					y1="56"
					x2="56"
					y2="56"
					stroke="#1E2022"
					stroke-width="3.5"
					stroke-linecap="round"
				/><line
					x1="40"
					y1="66"
					x2="48"
					y2="66"
					stroke="#F59E0B"
					stroke-width="3.5"
					stroke-linecap="round"
				/></svg
			></span
		>
		<span class="text-lg font-bold">PaperNotes</span>
	</a>
	<div class="mt-12">
		<p class="text-sm font-semibold text-muted">Start writing</p>
		<h1 class="mt-2 text-3xl font-bold">Create your account</h1>
		{#if form?.message}
			<p class="mt-7 rounded-md bg-[#ba1a1a]/10 p-5 text-[16px] font-medium text-[#ba1a1a]">
				{form.message}
			</p>
		{/if}
		<form method="POST" action="?/create" use:enhance class="mt-8 space-y-5" id="signup-form">
			<div>
				<label
					class="block text-sm font-semibold {form?.errors?.name ? 'text-[#ba1a1a]' : 'text-black'}"
					for="name">Your name</label
				><input
					class="mt-2 h-12 w-full rounded-lg border {form?.errors?.name
						? 'border-[#ba1a1a]'
						: 'border-line'} bg-paper px-4 text-base transition outline-none placeholder:text-[#8a8b8d] focus:border-[#8b8e8a] focus:ring-2 focus:ring-[#1e2022]/10"
					id="name"
					name="name"
					type="text"
					placeholder="How should we call you?"
					autocomplete="name"
					value={form?.data?.name ?? ''}
				/>
			</div>
			<div>
				<label
					class="block text-sm font-semibold {form?.errors?.email
						? 'text-[#ba1a1a]'
						: 'text-black'}"
					for="email">Email</label
				><input
					class="mt-2 h-12 w-full rounded-lg border {form?.errors?.email
						? 'border-[#ba1a1a]'
						: 'border-line'} bg-paper px-4 text-base transition outline-none placeholder:text-[#8a8b8d] focus:border-[#8b8e8a] focus:ring-2 focus:ring-[#1e2022]/10"
					id="email"
					name="email"
					type="email"
					placeholder="you@example.com"
					autocomplete="email"
					value={form?.data?.email ?? ''}
				/>
			</div>
			<div>
				<label
					class="block text-sm font-semibold {form?.errors?.password
						? 'text-[#ba1a1a]'
						: 'text-black'}"
					for="password">Password</label
				><input
					class="mt-2 h-12 w-full rounded-lg border {form?.errors?.password
						? 'border-[#ba1a1a]'
						: 'border-line'} bg-paper px-4 text-base transition outline-none placeholder:text-[#8a8b8d] focus:border-[#8b8e8a] focus:ring-2 focus:ring-[#1e2022]/10"
					id="password"
					name="password"
					type="password"
					placeholder="At least 8 characters"
					autocomplete="new-password"
				/>
			</div>
			{#if form?.errors?.terms}
				<p class="mb-2 text-xs text-[#ba1a1a]">{form.errors.terms[0]}</p>
			{/if}
			<label class="flex cursor-pointer items-start gap-3 text-sm leading-5 text-muted"
				><input
					class="mt-0.5 h-4 w-4 cursor-pointer rounded border-line text-[#2f312f] focus:ring-[#1e2022]/20"
					name="terms"
					type="checkbox"
				/><span
					>I agree to the <a
						class="font-semibold text-ink underline decoration-line underline-offset-4"
						href="/terms">terms</a
					>
					and
					<a
						class="font-semibold text-ink underline decoration-line underline-offset-4"
						href="/privacy">privacy policy</a
					>.</span
				></label
			>
			<button
				class="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#2f312f] px-5 text-sm font-bold text-white transition hover:bg-[#1e2022] active:scale-[0.98]"
				type="submit">Create account</button
			>
		</form>
		<p class="mt-7 text-center text-sm text-muted">
			Already have an account? <a
				class="font-bold text-ink underline decoration-line underline-offset-4"
				href="/login">Log in</a
			>
		</p>
	</div>
</main>
