export function getTimeLabel(createdAt: string): string {
	const date = new Date(createdAt.replace(' ', 'T'));
	const days = Math.floor((Date.now() - date.getTime()) / (1000 * 86400));

	if (days > 1) {
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}

	return days === 0 ? 'Just now' : 'Yesterday';
}
