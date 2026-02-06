/**
 * Material Symbols
 *
 * Common icon names for Google Material Symbols.
 * These are ligature names that work with the Material Symbols font.
 *
 * Usage with MaterialIcon:
 * ```javascript
 * import { MaterialIcon } from '@base-framework/ui/atoms';
 * import { MaterialSymbols } from '@base-framework/ui/icons';
 *
 * MaterialIcon({ name: MaterialSymbols.home, size: 'md' })
 * MaterialIcon({ name: MaterialSymbols.actions.delete, variant: 'filled' })
 * ```
 *
 * @link https://fonts.google.com/icons
 * @type {object}
 */
export const MaterialSymbols = {
	// Common actions
	add: 'add',
	remove: 'remove',
	edit: 'edit',
	delete: 'delete',
	save: 'save',
	cancel: 'cancel',
	check: 'check',
	close: 'close',
	done: 'done',

	// Navigation
	home: 'home',
	menu: 'menu',
	search: 'search',
	settings: 'settings',
	more_vert: 'more_vert',
	more_horiz: 'more_horiz',
	arrow_back: 'arrow_back',
	arrow_forward: 'arrow_forward',
	arrow_upward: 'arrow_upward',
	arrow_downward: 'arrow_downward',
	expand_more: 'expand_more',
	expand_less: 'expand_less',
	chevron_left: 'chevron_left',
	chevron_right: 'chevron_right',

	// Content
	file_copy: 'file_copy',
	content_copy: 'content_copy',
	content_paste: 'content_paste',
	filter_list: 'filter_list',
	sort: 'sort',
	refresh: 'refresh',
	download: 'download',
	upload: 'upload',
	share: 'share',
	print: 'print',

	// Communication
	email: 'email',
	phone: 'phone',
	chat: 'chat',
	notifications: 'notifications',
	notifications_active: 'notifications_active',

	// Social
	favorite: 'favorite',
	star: 'star',
	thumb_up: 'thumb_up',
	thumb_down: 'thumb_down',
	person: 'person',
	group: 'group',

	// Files & Folders
	folder: 'folder',
	folder_open: 'folder_open',
	insert_drive_file: 'insert_drive_file',
	description: 'description',
	image: 'image',
	attachment: 'attachment',

	// Status & Alerts
	error: 'error',
	warning: 'warning',
	info: 'info',
	help: 'help',
	check_circle: 'check_circle',

	// UI Controls
	visibility: 'visibility',
	visibility_off: 'visibility_off',
	lock: 'lock',
	lock_open: 'lock_open',
	login: 'login',
	logout: 'logout',

	// Time & Date
	schedule: 'schedule',
	today: 'today',
	calendar_today: 'calendar_today',
	event: 'event',
	history: 'history',

	// Device & System
	computer: 'computer',
	phone_iphone: 'phone_iphone',
	tablet: 'tablet',
	desktop_windows: 'desktop_windows',

	// Nested categories for better organization
	actions: {
		add: 'add',
		remove: 'remove',
		edit: 'edit',
		delete: 'delete',
		save: 'save',
		cancel: 'cancel',
		undo: 'undo',
		redo: 'redo',
	},

	arrows: {
		back: 'arrow_back',
		forward: 'arrow_forward',
		up: 'arrow_upward',
		down: 'arrow_downward',
		left: 'arrow_back',
		right: 'arrow_forward',
	},

	chevrons: {
		left: 'chevron_left',
		right: 'chevron_right',
		up: 'expand_less',
		down: 'expand_more',
	},

	content: {
		copy: 'content_copy',
		paste: 'content_paste',
		cut: 'content_cut',
	},

	social: {
		favorite: 'favorite',
		star: 'star',
		share: 'share',
		like: 'thumb_up',
		dislike: 'thumb_down',
	},

	status: {
		error: 'error',
		warning: 'warning',
		info: 'info',
		success: 'check_circle',
		help: 'help_outline',
	},
};
