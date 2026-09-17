<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import SearchDialog from './search_dialog.svelte';
	import { getInitials } from '$lib/repository/utils.js';
	import type { Note, User } from '$lib/repository/type.js';

	let searchDialog: SearchDialog;
	let menuOpen: boolean = $state(false);

	let { data } = $props();
	let notes: Note = $derived(data.note);
	let user: User = $derived(data.user);

	function handleOpen() {
		menuOpen = true;
		document.body.addEventListener('click', handleClose);
	}

	function handleClose() {
		menuOpen = false;
		document.body.removeEventListener('click', handleClose);
	}
</script>

<header class="border-b border-line bg-canvas/95">
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
		<a class="flex items-center gap-2.5" href="/" aria-label="PaperNotes home">
			<span class="grid h-9 w-9 place-items-center rounded-lg bg-[#1e2022]" aria-hidden="true"
				><svg class="h-6 w-6" viewBox="0 0 100 100" fill="none">
					<path
						d="M30 26C30 23.7909 31.7909 22 34 22H56L70 36V74C70 76.2091 68.2091 78 66 78H34C31.7909 78 30 76.2091 30 74V26Z"
						fill="#FAF9F6"
					/>
					<path d="M56 22V34C56 35.1046 56.8954 36 58 36H70" fill="#E5E5E0" />
					<line
						x1="40"
						y1="46"
						x2="60"
						y2="46"
						stroke="#1E2022"
						stroke-width="3.5"
						stroke-linecap="round"
					/>
					<line
						x1="40"
						y1="56"
						x2="56"
						y2="56"
						stroke="#1E2022"
						stroke-width="3.5"
						stroke-linecap="round"
					/>
					<line
						x1="40"
						y1="66"
						x2="48"
						y2="66"
						stroke="#F59E0B"
						stroke-width="3.5"
						stroke-linecap="round"
					/>
				</svg></span
			>
			<span class="text-lg font-bold tracking-normal">PaperNotes</span>
		</a>
		<div class="flex items-center gap-2">
			<button
				class="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted transition hover:bg-soft hover:text-ink"
				id="open-search"
				onclick={() => searchDialog.open()}
				type="button"
				><span class="material-symbols-outlined text-xl" aria-hidden="true">search</span><span
					class="hidden sm:inline">Search</span
				></button
			>
			<div class="relative">
				<button
					onclick={(e) => {
						e.stopPropagation();
						handleOpen();
					}}
					class="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-[#e3e2e0] bg-soft text-sm font-bold transition hover:bg-[#e3e2e0]"
					id="account-toggle"
					type="button"
					aria-label="Open account menu for Riandy N."
					aria-expanded="false">{getInitials(user.name)}</button
				>
				<div
					class="absolute top-full right-0 z-20 mt-3 hidden w-80 rounded-2xl border border-line bg-paper p-3 shadow-lift"
					class:hidden={!menuOpen}
					id="account-menu"
					role="menu"
				>
					<div class="flex items-center gap-3 px-2 py-2">
						<span
							class="flex h-12 w-12 items-center justify-center rounded-full bg-soft text-sm font-bold"
							>{getInitials(user.name)}</span
						><span
							><span class="block text-sm font-bold">{user.name}</span><span
								class="mt-0.5 block text-xs text-muted">{user.email}</span
							></span
						>
					</div>
					<div class="my-2 border-t border-line"></div>
					<div class="flex items-center gap-3 px-2 py-2">
						<span class="material-symbols-outlined text-xl text-muted" aria-hidden="true"
							>workspaces</span
						><span
							><span class="block text-xs text-muted">Workspace</span><span
								class="block text-sm font-semibold">Personal</span
							></span
						>
					</div>
					<div class="my-2 border-t border-line"></div>
					<form method="POST" action={resolve('/logout')} use:enhance>
						<button
							class="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6]"
							id="logout-button"
							type="submit"
							role="menuitem"
							><span class="material-symbols-outlined text-xl" aria-hidden="true">logout</span>Log
							out</button
						>
					</form>
				</div>
			</div>
		</div>
	</div>
</header>

<SearchDialog bind:this={searchDialog} {notes}></SearchDialog>
