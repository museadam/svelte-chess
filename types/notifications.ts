// notifications for toast

enum themes {
	danger = 'danger',
	success = 'success',
	warning = 'warning',
	info = 'info',
	default = 'default'
}
export interface Notification {
	id: string;
	type: keyof typeof themes;
	message: string;
	timeout: number;
}
