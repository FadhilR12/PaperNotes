<script lang="ts">
	let dialogElement: HTMLDialogElement;

	export function open() {
		dialogElement.showModal();
	}

	export function close() {
		dialogElement.close();
	}
</script>

<dialog
	bind:this={dialogElement}
	class="m-auto w-[calc(100%-2rem)] max-w-3xl rounded-2xl border border-line bg-paper p-0 text-ink shadow-lift backdrop:bg-ink/25"
	id="note-dialog"
>
	<div class="p-5 sm:p-6">
		<label class="sr-only" for="modal-note-title">Note title</label><input
			class="w-full border-0 bg-transparent text-xl font-bold outline-none placeholder:text-[#9a9b9d] sm:text-2xl"
			id="modal-note-title"
			type="text"
			placeholder="Title"
		/>
		<div class="my-5 border-t border-line"></div>
		<label class="sr-only" for="modal-note-content">Note content</label><textarea
			class="min-h-44 w-full resize-y border-0 bg-transparent text-base leading-7 outline-none placeholder:text-[#75777a] sm:min-h-52 sm:text-lg sm:leading-8"
			id="modal-note-content"
			placeholder="Start writing..."></textarea>
		<div class="mt-5 flex items-center justify-between border-t border-line pt-4">
			<button
				class="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-[#ba1a1a] transition hover:bg-[#ffdad6]"
				id="delete-note"
				type="button"
				aria-label="Delete note"
				title="Delete note"
				><span class="material-symbols-outlined text-xl" aria-hidden="true">delete</span></button
			><button
				onclick={close}
				class="inline-flex h-10 cursor-pointer items-center rounded-lg px-4 text-sm font-bold text-muted transition hover:bg-soft hover:text-ink"
				id="close-note"
				type="button">Close</button
			>
		</div>
	</div>
</dialog>
