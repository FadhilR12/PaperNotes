<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import NoteDialog from '$lib/components/note_dialog.svelte';

	let isActive: boolean = $state(false);
	let noteDialog: NoteDialog;
	let { data } = $props();
</script>

<Navbar></Navbar>

<main class="mx-auto max-w-4xl px-5 pt-10 pb-16 sm:px-8 sm:pt-14">
	<section aria-labelledby="capture-title">
		<p class="text-sm font-semibold text-muted">Your space</p>
		<h1
			class="mt-2 text-base leading-tight font-bold whitespace-nowrap sm:text-4xl"
			id="capture-title"
		>
			Write your idea before it slips away.
		</h1>
		<!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
		<form
			class="mt-7 rounded-2xl border border-line bg-paper shadow-paper transition-shadow focus-within:shadow-lift {isActive
				? 'p-5 sm:p-6'
				: 'p-3'}"
			id="quick-note-form"
			aria-expanded="false"
		>
			<div class:hidden={!isActive} id="title-field">
				<label class="sr-only" for="note-title">Note title</label>
				<input
					class="w-full border-0 bg-transparent text-xl font-bold outline-none placeholder:text-[#9a9b9d] sm:text-2xl"
					id="note-title"
					type="text"
					placeholder="Title"
				/>
				<div class="my-5 border-t border-line"></div>
			</div>
			<div id="note-trigger-field" class:hidden={isActive}>
				<label class="sr-only" for="note-trigger">Take a note</label>
				<input
					onclick={() => (isActive = true)}
					class="h-8 w-full border-0 bg-transparent px-2 text-base outline-none placeholder:text-[#75777a] sm:text-lg"
					id="note-trigger"
					type="text"
					placeholder="Take a note..."
					autocomplete="off"
				/>
			</div>
			<div class:hidden={!isActive} id="note-content-field">
				<label class="sr-only" for="note-content">Note content</label>
				<textarea
					class="min-h-44 w-full resize-y border-0 bg-transparent text-base leading-7 outline-none placeholder:text-[#75777a] sm:min-h-52 sm:text-lg sm:leading-8"
					id="note-content"
					placeholder="Start writing..."></textarea>
			</div>
			<div
				class="mt-5 items-center justify-end border-t border-line pt-4"
				class:hidden={!isActive}
				id="composer-actions"
			>
				<button
					onclick={() => (isActive = false)}
					class="inline-flex h-10 items-center rounded-lg px-4 text-sm font-bold text-muted transition hover:bg-soft hover:text-ink"
					id="close-composer"
					type="button">Close</button
				>
			</div>
		</form>
	</section>

	<section class="mt-12 sm:mt-14" aria-labelledby="notes-title">
		<div class="mb-5 flex items-end justify-between">
			<div>
				<p class="text-sm font-semibold text-muted">Recent thoughts</p>
				<h2 class="mt-1 text-2xl font-bold" id="notes-title">Your notes</h2>
			</div>
			<span class="text-sm font-medium text-muted"
				><span id="note-count">{data.note.length}</span> notes</span
			>
		</div>
		<div class="grid gap-3 sm:grid-cols-2 sm:gap-4" id="notes-list">
			{#each data.note as note}
				<button
					onclick={() => noteDialog.open()}
					class="group flex w-full cursor-pointer flex-col rounded-2xl border border-line bg-paper p-4 text-left shadow-paper transition hover:-translate-y-0.5 hover:shadow-lift sm:min-h-52 sm:p-5"
					type="button"
					data-note
				>
					<h3 class="text-base leading-snug font-bold sm:text-lg">{note.title}</h3>
					<p class="mt-2.5 line-clamp-2 text-sm leading-6 text-muted sm:mt-3 sm:line-clamp-3">
						{note.desc}
					</p>
					<time
						class="mt-5 text-xs font-semibold text-[#75777a] sm:mt-auto sm:pt-5"
						datetime="2026-09-14">Yesterday</time
					>
				</button>
			{/each}
		</div>
		<p class="hidden py-16 text-center text-muted" id="empty-state">No notes match your search.</p>
	</section>
</main>

<NoteDialog bind:this={noteDialog}></NoteDialog>
