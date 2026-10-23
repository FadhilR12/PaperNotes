<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount, tick } from 'svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import NoteDialog from '$lib/components/note_dialog.svelte';
	import { getTimeLabel } from '$lib/repository/utils.js';
	import type { Note } from '$lib/repository/type.js';

	let isActive = $state(false);
	let noteDialog = $state<NoteDialog | undefined>(undefined);
	let { data, form } = $props();
	let selectedFolder = $state('');
	let renamingFolderId = $state('');
	let folderNameDraft = $state('');
	let folderNameInput = $state<HTMLInputElement | undefined>(undefined);
	let selectedTag = $state('');
	let tagScroller = $state<HTMLDivElement | undefined>(undefined);
	let tagDragActive = $state(false);
	let tagDragMoved = false;
	let tagPointerId: number | null = null;
	let tagDragStartX = 0;
	let tagDragStartScrollLeft = 0;
	let suppressTagClick = false;
	let notes = $derived(
		data.note.filter((note: Note) => {
			const inFolder = !selectedFolder || note.folder_id === selectedFolder;
			const hasTag = !selectedTag || note.tags.some((tag) => tag.id === selectedTag);
			return inFolder && hasTag;
		})
	);

	function openNote(note: Note) {
		noteDialog?.open(note, data.folders);
	}

	function closeFolderMenusOutside(event: MouseEvent) {
		if (!(event.target instanceof Node)) return;
		const target = event.target;
		document.querySelectorAll<HTMLDetailsElement>('[data-folder-menu][open]').forEach((menu) => {
			if (!menu.contains(target)) menu.open = false;
		});
	}

	function closeFolderMenuAfterSuccess(form: HTMLFormElement, result: unknown) {
		if (typeof result !== 'object' || result === null || !('type' in result)) return;
		if (result.type !== 'success' || !('data' in result)) return;

		const data = result.data;
		if (
			typeof data !== 'object' ||
			data === null ||
			!('success' in data) ||
			data.success !== true
		) {
			return;
		}

		const menu = form.closest<HTMLDetailsElement>('[data-folder-menu]');
		if (menu) menu.open = false;
	}

	onMount(() => {
		document.addEventListener('click', closeFolderMenusOutside);
		return () => document.removeEventListener('click', closeFolderMenusOutside);
	});

	function startTagDrag(event: PointerEvent) {
		if (event.button !== 0 || !tagScroller) return;
		tagPointerId = event.pointerId;
		tagDragStartX = event.clientX;
		tagDragStartScrollLeft = tagScroller.scrollLeft;
		tagDragMoved = false;
	}

	function moveTagDrag(event: PointerEvent) {
		if (event.pointerId !== tagPointerId || !tagScroller) return;
		const deltaX = event.clientX - tagDragStartX;
		if (!tagDragMoved && Math.abs(deltaX) > 5) {
			tagDragMoved = true;
			tagDragActive = true;
			tagScroller.setPointerCapture(event.pointerId);
		}
		if (tagDragMoved) {
			event.preventDefault();
			tagScroller.scrollLeft = tagDragStartScrollLeft - deltaX;
		}
	}

	function endTagDrag(event: PointerEvent) {
		if (event.pointerId !== tagPointerId) return;
		if (tagDragMoved && tagScroller) {
			suppressTagClick = true;
			setTimeout(() => (suppressTagClick = false), 0);
			if (tagScroller.hasPointerCapture(event.pointerId)) {
				tagScroller.releasePointerCapture(event.pointerId);
			}
		}
		tagPointerId = null;
		tagDragActive = false;
	}

	function preventDraggedTagClick(event: MouseEvent) {
		if (!suppressTagClick) return;
		event.preventDefault();
		event.stopPropagation();
	}
</script>

<Navbar {data} {noteDialog} />

<main class="mx-auto max-w-6xl px-5 pt-10 pb-16 sm:px-8 sm:pt-14">
	{#if form?.message}
		<div
			class="mb-6 rounded-lg border border-[#ba1a1a]/20 bg-[#ffdad6] p-4 text-sm font-medium text-[#ba1a1a]"
			role="alert"
		>
			{form.message}
		</div>
	{/if}

	<section aria-labelledby="capture-title">
		<p class="text-sm font-semibold text-muted">Your space</p>
		<h1 class="mt-2 text-2xl leading-tight font-bold sm:text-4xl" id="capture-title">
			Write Your Idea before it slips away.
		</h1>
		<form
			method="POST"
			action="?/create"
			use:enhance={({ formData, cancel }) => {
				const title = formData.get('title')?.toString().trim();
				const desc = formData.get('desc')?.toString().trim();
				if (!title && !desc) {
					cancel();
					return;
				}
				return async ({ update }) => {
					isActive = false;
					await update();
				};
			}}
			class="mt-6 rounded-2xl border border-line bg-paper shadow-paper transition-shadow focus-within:shadow-lift hover:shadow-lift {isActive
				? 'p-5 sm:p-6'
				: 'p-3'}"
			id="quick-note-form"
		>
			<div class:hidden={!isActive}>
				<label class="sr-only" for="note-title">Note title</label>
				<input
					class="w-full border-0 bg-transparent text-xl font-bold outline-none placeholder:text-[#9a9b9d] sm:text-2xl"
					id="note-title"
					name="title"
					type="text"
					placeholder="Title"
				/>
				<div class="my-5 border-t border-line"></div>
			</div>
			<div class:hidden={isActive}>
				<label class="sr-only" for="note-trigger">Take a note</label>
				<input
					onclick={() => (isActive = true)}
					class="h-8 w-full cursor-text border-0 bg-transparent px-2 text-base outline-none placeholder:text-[#75777a] sm:text-lg"
					id="note-trigger"
					type="text"
					placeholder="Take a note..."
					autocomplete="off"
				/>
			</div>
			<div class:hidden={!isActive}>
				<label class="sr-only" for="note-content">Note content</label>
				<textarea
					class="min-h-44 w-full resize-y border-0 bg-transparent text-base leading-7 outline-none placeholder:text-[#75777a] sm:min-h-52 sm:text-lg sm:leading-8"
					id="note-content"
					name="desc"
					placeholder="Start writing..."></textarea>
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					<label class="text-xs font-semibold text-muted" for="note-folder"
						>Folder
						<select
							class="mt-1 block w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm font-normal text-ink"
							id="note-folder"
							name="folder"
						>
							<option value="">No folder</option>
							{#each data.folders as folder}
								<option value={folder.id}>{folder.name}</option>
							{/each}
						</select>
					</label>
					<label class="text-xs font-semibold text-muted" for="note-tags"
						>Tags (comma separated)
						<input
							class="mt-1 block w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm font-normal text-ink"
							id="note-tags"
							name="tags"
							maxlength="520"
							placeholder="study, ideas"
						/>
					</label>
				</div>
			</div>
			<div
				class="mt-5 flex items-center justify-end gap-2 border-t border-line pt-4"
				class:hidden={!isActive}
			>
				<button
					onclick={() => (isActive = false)}
					class="inline-flex h-10 cursor-pointer items-center rounded-lg px-4 text-sm font-bold text-muted transition hover:bg-soft hover:text-ink"
					type="button">Cancel</button
				>
				<button
					class="inline-flex h-10 cursor-pointer items-center rounded-lg bg-ink px-4 text-sm font-bold text-white transition hover:bg-ink/85"
					type="submit">Save note</button
				>
			</div>
		</form>
	</section>

	<div class="mt-10 grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
		<aside aria-label="Note folders">
			<section aria-labelledby="folders-title">
				<h2 class="mb-3 text-sm font-bold tracking-wide text-muted" id="folders-title">
					All Your Folders
				</h2>
				<div class="space-y-1">
					<button
						class="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition {selectedFolder ===
						''
							? 'bg-soft text-ink'
							: 'text-muted hover:bg-soft'}"
						onclick={() => (selectedFolder = '')}
						type="button"
					>
						<span>All notes</span><span>{data.note.length}</span>
					</button>
					{#each data.folders as folder}
						<div class="flex items-center gap-1">
							{#if renamingFolderId === folder.id}
								<form
									class="min-w-0 flex-1"
									method="POST"
									action="?/renameFolder"
									use:enhance={() => {
										return async ({ result, update }) => {
											await update();
											if (result.type === 'success') renamingFolderId = '';
										};
									}}
								>
									<input type="hidden" name="id" value={folder.id} />
									<input
										bind:this={folderNameInput}
										class="w-full rounded-lg border border-ink bg-paper px-2 py-1.5 text-sm outline-none"
										id="folder-{folder.id}"
										name="name"
										bind:value={folderNameDraft}
										maxlength="100"
										aria-label="Folder name"
										required
										onkeydown={(event) => {
											if (event.key === 'Escape') {
												folderNameDraft = folder.name;
												renamingFolderId = '';
											}
										}}
										onblur={(event) => {
											const form = event.currentTarget.form;
											if (form?.checkValidity()) form.requestSubmit();
										}}
									/>
									<button class="sr-only" type="submit">Save folder name</button>
								</form>
							{:else}
								<button
									class="flex min-w-0 flex-1 cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition {selectedFolder ===
									folder.id
										? 'bg-soft font-semibold text-ink'
										: 'text-muted hover:bg-soft'}"
									onclick={() => (selectedFolder = folder.id)}
									type="button"
								>
									<span class="truncate">{folder.name}</span>
									<span
										>{data.note.filter((note: Note) => note.folder_id === folder.id).length}</span
									>
								</button>
								<details class="relative" data-folder-menu>
									<summary
										class="grid h-8 w-8 cursor-pointer list-none place-items-center rounded-full text-muted transition hover:bg-soft"
										aria-label="Manage {folder.name}"
									>
										<span class="material-symbols-outlined text-lg" aria-hidden="true"
											>more_horiz</span
										>
									</summary>
									<div
										class="absolute right-0 z-10 mt-1 w-56 rounded-xl border border-line bg-paper p-3 shadow-lift"
									>
										<form
											method="POST"
											action="?/renameFolder"
											use:enhance={({ formElement }) => {
												return async ({ result, update }) => {
													closeFolderMenuAfterSuccess(formElement, result);
													await update();
												};
											}}
										>
											<input type="hidden" name="id" value={folder.id} />
											<label class="text-xs font-semibold text-muted" for="folder-{folder.id}"
												>Rename folder</label
											>
											<input
												class="mt-1 w-full rounded-lg border border-line px-2 py-1.5 text-sm"
												id="folder-{folder.id}"
												name="name"
												value={folder.name}
												maxlength="100"
												required
											/>
											<button
												class="mt-2 cursor-pointer rounded px-1 py-1 text-sm font-semibold text-ink transition hover:bg-soft"
												type="submit">Save name</button
											>
										</form>
										<form
											class="mt-2 border-t border-line pt-2"
											method="POST"
											action="?/deleteFolder"
											use:enhance={({ formElement }) => {
												return async ({ result, update }) => {
													closeFolderMenuAfterSuccess(formElement, result);
													await update();
												};
											}}
										>
											<input type="hidden" name="id" value={folder.id} />
											<button
												class="cursor-pointer rounded px-1 py-1 text-sm font-semibold text-[#ba1a1a] transition hover:bg-[#ffdad6]"
												type="submit">Delete folder</button
											>
										</form>
									</div>
								</details>
							{/if}
						</div>
					{/each}
				</div>

				<form
					class="mt-3"
					method="POST"
					action="?/createFolder"
					use:enhance={({ formData }) => {
						formData.set('name', 'New Notes');
						return async ({ result, update }) => {
							await update();
							if (
								result.type === 'success' &&
								result.data &&
								typeof result.data === 'object' &&
								'folderId' in result.data &&
								typeof result.data.folderId === 'string'
							) {
								const folderId = result.data.folderId;
								renamingFolderId = folderId;
								folderNameDraft =
									data.folders.find((folder: { id: string; name: string }) => {
										return folder.id === folderId;
									})?.name ?? 'New Notes';
								await tick();
								folderNameInput?.focus();
								folderNameInput?.select();
							}
						};
					}}
				>
					<input type="hidden" name="name" value="New Notes" />
					<button
						class="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-line bg-paper px-3 text-sm font-semibold text-muted transition hover:border-ink hover:bg-soft hover:text-ink"
						type="submit"
						><span class="material-symbols-outlined text-lg" aria-hidden="true">add</span>New folder</button
					>
				</form>
			</section>
		</aside>

		<section class="min-w-0" aria-labelledby="notes-title">
			<div class="mb-5 flex items-end justify-between">
				<div>
					<p class="text-sm font-semibold text-muted">Recent thoughts</p>
					<h2 class="mt-1 text-2xl font-bold" id="notes-title">Your notes</h2>
				</div>
				<span class="text-sm font-medium text-muted">{notes.length} notes</span>
			</div>
			{#if data.tags.length}
				<div class="mb-2">
					<div
						bind:this={tagScroller}
						class="scrollbar-hidden flex touch-pan-y gap-2 overflow-x-auto py-1 select-none {tagDragActive
							? 'cursor-grabbing'
							: 'cursor-grab'}"
						aria-label="Tags"
						role="group"
						onpointerdown={startTagDrag}
						onpointermove={moveTagDrag}
						onpointerup={endTagDrag}
						onpointercancel={endTagDrag}
						onclickcapture={preventDraggedTagClick}
					>
						{#each data.tags as tag}
							<button
								class="shrink-0 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition {selectedTag ===
								tag.id
									? 'border-ink bg-ink text-white'
									: 'border-line text-muted hover:border-ink hover:bg-soft hover:text-ink'}"
								onclick={() => (selectedTag = selectedTag === tag.id ? '' : tag.id)}
								type="button">{tag.name}</button
							>
						{/each}
					</div>
				</div>
			{/if}
			{#if notes.length}
				<div class="grid gap-3 sm:grid-cols-2 sm:gap-4" id="notes-list">
					{#each notes as note}
						<article
							class="group relative flex min-h-48 min-w-0 flex-col rounded-2xl border border-line bg-paper p-4 shadow-paper transition duration-200 hover:-translate-y-0.5 hover:border-[#c8c9cb] hover:shadow-lift"
						>
							<button
								class="absolute inset-0 z-0 cursor-pointer rounded-2xl"
								onclick={() => openNote(note)}
								type="button"
								aria-label="Open note: {note.title}"
							></button>
							<div class="pointer-events-none relative z-10">
								<h3 class="text-base leading-snug font-bold sm:text-lg">{note.title}</h3>
								<p class="mt-2.5 line-clamp-2 text-sm leading-6 text-muted sm:mt-3 sm:line-clamp-3">
									{note.desc}
								</p>
							</div>
							<div class="pointer-events-none relative z-10 mt-auto">
								{#if note.folder_id}
									<p class="mt-3 text-xs font-semibold text-muted">
										{data.folders.find((folder: { id: string }) => folder.id === note.folder_id)
											?.name}
									</p>
								{/if}
								{#if note.tags.length}
									<div class="mt-3 flex flex-wrap gap-1.5">
										{#each note.tags as tag}
											<button
												class="pointer-events-auto relative z-20 cursor-pointer rounded-full bg-soft px-2.5 py-1 text-xs text-muted transition hover:bg-ink hover:text-white"
												onclick={() => (selectedTag = selectedTag === tag.id ? '' : tag.id)}
												type="button">{tag.name}</button
											>
										{/each}
									</div>
								{/if}
								<time class="mt-5 block text-xs font-semibold text-[#75777a]">
									{getTimeLabel(note.created_at)}
								</time>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<p class="py-16 text-center text-muted" id="empty-state">
					{data.note.length
						? 'No notes match these filters.'
						: 'No notes yet. Write your first note above.'}
				</p>
			{/if}
		</section>
	</div>
</main>

<NoteDialog bind:this={noteDialog} />
