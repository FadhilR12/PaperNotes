<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { deserialize } from '$app/forms';
	import type { Folder, Note, NoteVersion } from '$lib/repository/type.js';

	let dialogElement: HTMLDialogElement;
	let selectedNote = $state<Note | null>(null);
	let folders = $state<Folder[]>([]);
	let versions = $state<NoteVersion[]>([]);
	let historyOpen = $state(false);
	let historyLoading = $state(false);
	let actionError = $state('');

	function isActionData(
		data: unknown
	): data is { success: boolean; message?: string; versions?: NoteVersion[] } {
		return (
			typeof data === 'object' &&
			data !== null &&
			'success' in data &&
			typeof data.success === 'boolean' &&
			(!('versions' in data) || Array.isArray(data.versions))
		);
	}

	export function open(note: Note, availableFolders: Folder[]) {
		selectedNote = { ...note, tags: [...note.tags] };
		folders = availableFolders;
		versions = [];
		historyOpen = false;
		actionError = '';
		dialogElement.showModal();
	}

	export function close() {
		dialogElement.close();
		selectedNote = null;
	}

	async function sendAction(form: HTMLFormElement, formData = new FormData(form)) {
		actionError = '';
		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData,
				headers: { 'x-sveltekit-action': 'true' }
			});
			const result = deserialize(await response.text());
			const actionData =
				result.type === 'success' || result.type === 'failure' ? result.data : undefined;
			if (result.type !== 'success' || !isActionData(actionData) || !actionData.success) {
				actionError = isActionData(actionData)
					? (actionData.message ?? 'Terjadi kesalahan. Silakan coba lagi.')
					: 'Terjadi kesalahan. Silakan coba lagi.';
				return false;
			}
			await invalidateAll();
			return true;
		} catch {
			actionError = 'Koneksi bermasalah. Periksa jaringan lalu coba lagi.';
			return false;
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) return;
		if (await sendAction(form)) close();
	}

	async function loadHistory() {
		if (!selectedNote || historyLoading) return;
		historyLoading = true;
		actionError = '';
		const noteId = selectedNote.id;
		const formData = new FormData();
		formData.set('id', noteId);
		try {
			const response = await fetch('?/history', {
				method: 'POST',
				body: formData,
				headers: { 'x-sveltekit-action': 'true' }
			});
			const result = deserialize(await response.text());
			const actionData =
				result.type === 'success' || result.type === 'failure' ? result.data : undefined;
			if (
				result.type !== 'success' ||
				!isActionData(actionData) ||
				!actionData.success ||
				!actionData.versions
			) {
				actionError = isActionData(actionData)
					? (actionData.message ?? 'Riwayat catatan gagal dimuat.')
					: 'Riwayat catatan gagal dimuat.';
				return;
			}
			if (selectedNote?.id === noteId) {
				versions = actionData.versions;
				historyOpen = true;
			}
		} catch {
			actionError = 'Riwayat catatan gagal dimuat. Periksa koneksi lalu coba lagi.';
		} finally {
			historyLoading = false;
		}
	}

	async function restoreVersion(versionId: string) {
		if (!selectedNote) return;
		const form = document.querySelector<HTMLFormElement>('#update-note-form');
		if (!form) return;
		const data = new FormData(form);
		data.set('versionId', versionId);
		const restoreForm = document.createElement('form');
		restoreForm.action = '?/restoreVersion';
		if (await sendAction(restoreForm, data)) close();
	}
</script>

<dialog
	bind:this={dialogElement}
	class="m-auto w-[calc(100%-2rem)] max-w-3xl rounded-2xl border border-line bg-paper p-0 text-ink shadow-lift backdrop:bg-ink/25"
	id="note-dialog"
>
	{#if selectedNote}
		<div class="p-5 sm:p-6">
			<form id="update-note-form" method="POST" action="?/update" onsubmit={handleSubmit}>
				<input type="hidden" name="id" value={selectedNote.id} />
				<label class="sr-only" for="modal-note-title">Note title</label>
				<input
					class="w-full cursor-text border-0 bg-transparent text-xl font-bold outline-none placeholder:text-[#9a9b9d] sm:text-2xl"
					id="modal-note-title"
					name="title"
					bind:value={selectedNote.title}
					type="text"
					placeholder="Title"
				/>
				<div class="my-5 border-t border-line"></div>
				<label class="sr-only" for="modal-note-content">Note content</label>
				<textarea
					class="min-h-44 w-full cursor-text resize-y border-0 bg-transparent text-base leading-7 outline-none placeholder:text-[#75777a] sm:min-h-52 sm:text-lg sm:leading-8"
					id="modal-note-content"
					name="desc"
					bind:value={selectedNote.desc}
					placeholder="Start writing..."></textarea>
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					<label class="text-xs font-semibold text-muted" for="modal-note-folder"
						>Folder
						<select
							class="mt-1 block w-full cursor-pointer rounded-lg border border-line bg-paper px-3 py-2 text-sm font-normal text-ink"
							id="modal-note-folder"
							name="folder"
							bind:value={selectedNote.folder_id}
						>
							<option value="">No folder</option>
							{#each folders as folder}
								<option value={folder.id}>{folder.name}</option>
							{/each}
						</select>
					</label>
					<label class="text-xs font-semibold text-muted" for="modal-note-tags"
						>Tags (comma separated)
						<input
							class="mt-1 block w-full cursor-text rounded-lg border border-line bg-paper px-3 py-2 text-sm font-normal text-ink transition focus:border-ink focus:outline-none"
							id="modal-note-tags"
							name="tags"
							maxlength="520"
							value={selectedNote.tags.map((tag) => tag.name).join(', ')}
						/>
					</label>
				</div>
			</form>

			{#if actionError}
				<p class="mt-4 rounded-lg bg-[#ffdad6] p-3 text-sm text-[#ba1a1a]" role="alert">
					{actionError}
				</p>
			{/if}

			<div class="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
				<form method="POST" action="?/delete" onsubmit={handleSubmit}>
					<input type="hidden" name="id" value={selectedNote.id} />
					<button
						class="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-[#ba1a1a] transition hover:bg-[#ffdad6]"
						type="submit"
						aria-label="Delete note"
						title="Delete note"
						><span class="material-symbols-outlined text-xl" aria-hidden="true">delete</span
						></button
					>
				</form>
				<div class="flex items-center gap-2">
					<button
						class="inline-flex h-10 cursor-pointer items-center rounded-lg px-3 text-sm font-semibold text-muted transition hover:bg-soft hover:text-ink"
						onclick={loadHistory}
						type="button"
					>
						{historyLoading ? 'Loading...' : 'Version history'}
					</button>
					<button
						onclick={close}
						class="inline-flex h-10 cursor-pointer items-center rounded-lg px-3 text-sm font-bold text-muted transition hover:bg-soft hover:text-ink"
						type="button">Close</button
					>
					<button
						form="update-note-form"
						class="inline-flex h-10 cursor-pointer items-center rounded-lg bg-ink px-4 text-sm font-bold text-white transition hover:bg-ink/85"
						type="submit">Save changes</button
					>
				</div>
			</div>

			{#if historyOpen}
				<section class="mt-4 border-t border-line pt-4" aria-labelledby="history-title">
					<h2 class="text-sm font-bold" id="history-title">Previous versions (up to 3)</h2>
					{#if versions.length}
						<ul class="mt-3 max-h-56 space-y-2 overflow-y-auto">
							{#each versions as version}
								<li class="flex items-start justify-between gap-3 rounded-lg bg-soft p-3">
									<div class="min-w-0">
										<p class="truncate text-sm font-semibold">{version.title}</p>
										<p class="mt-1 line-clamp-2 text-xs text-muted">{version.desc}</p>
										<time class="mt-2 block text-xs text-muted">{version.created_at}</time>
									</div>
									<button
										class="shrink-0 cursor-pointer rounded px-2 py-1 text-xs font-bold text-ink underline transition hover:bg-paper"
										onclick={() => restoreVersion(version.id)}
										type="button">Restore</button
									>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="mt-2 text-sm text-muted">No previous versions yet.</p>
					{/if}
				</section>
			{/if}
		</div>
	{/if}
</dialog>
