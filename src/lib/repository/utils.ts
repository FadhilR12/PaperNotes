export function getTimeLabel(createdAt: Date): string {
	const date = new Date(createdAt * 1000);
	const days = Math.round((Date.now() - date) / (1000 * 86400));
	return days === 0 ? `Today` : `Yesterday`;
}

// ${days} hari lalu
