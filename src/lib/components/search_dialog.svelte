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
	class="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-line bg-paper p-0 text-ink shadow-lift backdrop:bg-ink/25"
	id="search-dialog"
>
	<div class="p-5 sm:p-6">
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-bold">Search notes</h2>
			<button
				onclick={close}
				class="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-muted transition hover:bg-soft"
				id="close-search"
				type="button"
				aria-label="Close search"
				><span class="material-symbols-outlined text-xl" aria-hidden="true">close</span></button
			>
		</div>
		<label class="mt-5 flex h-12 items-center rounded-lg bg-soft px-4" for="note-search"
			><span class="material-symbols-outlined text-xl text-muted" aria-hidden="true">search</span
			><input
				class="min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-[#75777a]"
				id="note-search"
				type="search"
				placeholder="Search your notes..."
				autocomplete="off"
			/></label
		>
		<div
			class="mt-4 max-h-80 space-y-2 overflow-y-auto"
			id="search-results"
			aria-live="polite"
		></div>
	</div>
</dialog>
