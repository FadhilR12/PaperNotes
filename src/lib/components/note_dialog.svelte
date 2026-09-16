<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Note } from '$lib/repository/type.js';

	let dialogElement: HTMLDialogElement;

	let selectedNote = $state<Note | null>(null);

	export function open(note: Note) {
		selectedNote = note;
		dialogElement.showModal();
	}

	export function close() {
		dialogElement.close();
		selectedNote = null;
	}
</script>

<dialog
	bind:this={dialogElement}
	class="m-auto w-[calc(100%-2rem)] max-w-3xl rounded-2xl border border-line bg-paper p-0 text-ink shadow-lift backdrop:bg-ink/25"
	id="note-dialog"
>
	{#if selectedNote}
		<div class="p-5 sm:p-6">
			<form
				id="update-note-form"
				method="POST"
				action="?/update"
				use:enhance={() => {
					return async ({ update }) => {
						close();
						update();
					};
				}}
			>
				<input type="hidden" name="id" value={selectedNote.id} />
				<label class="sr-only" for="modal-note-title">Note title</label><input
					class="w-full border-0 bg-transparent text-xl font-bold outline-none placeholder:text-[#9a9b9d] sm:text-2xl"
					id="modal-note-title"
					name="title"
					bind:value={selectedNote.title}
					type="text"
					placeholder="Title"
				/>
				<div class="my-5 border-t border-line"></div>
				<label class="sr-only" for="modal-note-content">Note content</label><textarea
					class="min-h-44 w-full resize-y border-0 bg-transparent text-base leading-7 outline-none placeholder:text-[#75777a] sm:min-h-52 sm:text-lg sm:leading-8"
					id="modal-note-content"
					name="desc"
					bind:value={selectedNote.desc}
					placeholder="Start writing..."></textarea>
			</form>
			<div class="mt-5 flex items-center justify-between border-t border-line pt-4">
				<form
					method="POST"
					action="?/delete"
					use:enhance={() => {
						return async ({ update }) => {
							close();
							update();
						};
					}}
				>
					<input type="hidden" name="id" value={selectedNote.id} />
					<button
						class="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-[#ba1a1a] transition hover:bg-[#ffdad6]"
						id="delete-note"
						type="submit"
						aria-label="Delete note"
						title="Delete note"
						><span class="material-symbols-outlined text-xl" aria-hidden="true">delete</span
						></button
					>
				</form>
				<button
					form="update-note-form"
					class="inline-flex h-10 cursor-pointer items-center rounded-lg px-4 text-sm font-bold text-muted transition hover:bg-soft hover:text-ink"
					id="close-note"
					type="submit">Close</button
				>
			</div>
		</div>
	{/if}
</dialog>
