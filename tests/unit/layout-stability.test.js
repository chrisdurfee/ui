import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Some atoms import the package entry (src/ui.js), which creates an
 * import cycle. Loading the entry first resolves it in the same order
 * as the library build.
 */
import '../../src/ui.js';
import { clearLoadedSrcs, hasLoadedSrc, Image, rememberLoadedSrc } from '../../src/components/atoms/image.js';
import { MaterialIcon } from '../../src/components/atoms/material-icon.js';
import { Avatar } from '../../src/components/molecules/avatars/avatar.js';
import { DialogContainer } from '../../src/components/molecules/dialogs/dialog-container.js';
import { ModalContainer } from '../../src/components/molecules/modals/modal-container.js';
import { NotificationContainer } from '../../src/components/molecules/notifications/notification-container.js';
import { clampX, PopOver } from '../../src/components/molecules/popover.js';
import { Calendar } from '../../src/components/organisms/calendar/calendar.js';
import { DataTable } from '../../src/components/organisms/lists/data-table.js';
import { Overlay } from '../../src/components/organisms/overlays/overlay.js';
import { TabGroup } from '../../src/components/organisms/tabs/tab-group.js';
import { TabNavigation } from '../../src/components/organisms/tabs/tab-navigation.js';
import { BlankPage } from '../../src/components/pages/blank-page.js';
import { MainSection } from '../../src/components/pages/main-section.js';
import { AsideTemplate } from '../../src/components/pages/templates/aside-template.js';

afterEach(() =>
{
	clearLoadedSrcs();
	vi.unstubAllGlobals();
});

describe('Image', () =>
{
	const createImg = (complete, naturalWidth) =>
	{
		const img = document.createElement('img');
		img.setAttribute('src', '/photo.jpg');
		img.className = 'opacity-0';
		Object.defineProperty(img, 'complete', { value: complete });
		Object.defineProperty(img, 'naturalWidth', { value: naturalWidth });
		return img;
	};

	it('starts hidden and fades in on the first load', () =>
	{
		const layout = Image({ src: '/photo.jpg' });
		expect(layout.class).toContain('opacity-0');
		expect(layout.decoding).toBe('async');
		expect(layout.loading).toBe('lazy');

		const img = createImg(false, 0);
		layout.load({ target: img });
		expect(img.classList.contains('opacity-0')).toBe(false);
		expect(img.classList.contains('fadeIn')).toBe(true);
		expect(hasLoadedSrc('/photo.jpg')).toBe(true);
	});

	it('renders visible without the fade when the src loaded before', () =>
	{
		rememberLoadedSrc('/photo.jpg');
		const layout = Image({ src: '/photo.jpg' });
		expect(layout.class).not.toContain('opacity-0');

		const img = document.createElement('img');
		layout.load({ target: img });
		expect(img.classList.contains('fadeIn')).toBe(false);
	});

	it('skips the fade when the image is complete at mount', () =>
	{
		const layout = Image({ src: '/photo.jpg' });
		const img = createImg(true, 100);
		layout.onCreated(img);
		expect(img.classList.contains('opacity-0')).toBe(false);
		expect(img.style.visibility).toBe('visible');
		expect(hasLoadedSrc('/photo.jpg')).toBe(true);
	});

	it('does not show an incomplete image at mount', () =>
	{
		const layout = Image({ src: '/photo.jpg' });
		const img = createImg(false, 0);
		layout.onCreated(img);
		expect(img.classList.contains('opacity-0')).toBe(true);
	});

	it('reserves space with width, height and aspect', () =>
	{
		const layout = Image({ src: '/photo.jpg', width: 320, height: 180, aspect: '16/9', style: 'color: red;' });
		expect(layout.width).toBe(320);
		expect(layout.height).toBe(180);
		expect(layout.style).toBe('aspect-ratio: 16/9; color: red;');
		expect('aspect' in layout).toBe(false);
	});

	it('bounds the loaded src cache', () =>
	{
		for (let i = 0; i < 510; i++)
		{
			rememberLoadedSrc(`/img-${i}.jpg`);
		}

		expect(hasLoadedSrc('/img-0.jpg')).toBe(false);
		expect(hasLoadedSrc('/img-9.jpg')).toBe(false);
		expect(hasLoadedSrc('/img-10.jpg')).toBe(true);
		expect(hasLoadedSrc('/img-509.jpg')).toBe(true);
	});
});

describe('Overlay animation', () =>
{
	it('animates the body by default', () =>
	{
		const overlay = new Overlay();
		expect(overlay.addBody().class).toContain('fadeIn');
	});

	it('can turn the animation off', () =>
	{
		const overlay = new Overlay({ animate: false });
		expect(overlay.addBody().class).not.toContain('fadeIn');
	});

	it('removes the animation when a kept-alive route is restored', () =>
	{
		const overlay = new Overlay();
		const body = document.createElement('div');
		body.className = 'body fadeIn';
		// @ts-ignore
		overlay.overlayBody = body;

		overlay.onActivate({}, { restored: false });
		expect(body.classList.contains('fadeIn')).toBe(true);

		overlay.onActivate({}, { restored: true });
		expect(body.classList.contains('fadeIn')).toBe(false);

		expect(() => overlay.onActivate()).not.toThrow();
	});
});

describe('MaterialIcon', () =>
{
	it('uses a fixed icon box', () =>
	{
		const layout = MaterialIcon({ name: 'home' });
		expect(layout.class).toContain('overflow-hidden');
		expect(layout.class).toContain('leading-none');
		expect(layout.class).toContain('shrink-0');
		expect(layout.class).toContain('w-6 h-6');
	});
});

describe('header and safe area offsets', () =>
{
	const offset = 'pt-[calc(var(--header-h,80px)_+_env(safe-area-inset-top,0px))] sm:pt-0';

	it('uses the header variable in MainSection', () =>
	{
		const layout = MainSection({}, []);
		expect(layout.class).toContain(offset);
		expect(layout.class).not.toContain('pt-[80px]');
	});

	it('uses the header variable in BlankPage', () =>
	{
		const page = new BlankPage();
		const layout = page.render();
		const inner = layout.children[0];
		expect(inner.class).toContain(offset);
	});

	it('adds the bottom safe area to the notifications', () =>
	{
		const container = new NotificationContainer();
		const layout = container.render();
		expect(layout.class).toContain('bottom-[calc(80px_+_env(safe-area-inset-bottom,0px))]');
	});
});

describe('viewport units', () =>
{
	it('limits the dialog height', () =>
	{
		const layout = DialogContainer({ class: '' }, []);
		expect(layout.class).toContain('max-h-[calc(100dvh-2rem)]');
		expect(layout.class).toContain('overflow-y-auto');
	});

	it('uses dvh for the modal', () =>
	{
		const layout = ModalContainer({ class: '' }, []);
		expect(layout.class).toContain('max-h-dvh');
		expect(layout.class).not.toContain('max-h-screen');
	});
});

describe('PopOver small screens', () =>
{
	it('clamps x inside the viewport', () =>
	{
		expect(clampX(0, 200, 400)).toBe(8);
		expect(clampX(50, 200, 400)).toBe(50);
		expect(clampX(300, 200, 400)).toBe(192);

		// wider than the viewport keeps the left gap
		expect(clampX(0, 500, 400)).toBe(8);
	});

	it('limits the width to the viewport', () =>
	{
		const popover = new PopOver({ size: 'xl' });
		expect(popover.render().class).toContain('max-w-[calc(100vw-1rem)]');
	});

	it('throttles repositioning to one frame', () =>
	{
		let frame = null;
		vi.stubGlobal('requestAnimationFrame', (cb) => { frame = cb; return 1; });
		const cancel = vi.fn();
		vi.stubGlobal('cancelAnimationFrame', cancel);

		const popover = {
			updatePosition: vi.fn(),
			schedulePosition: PopOver.prototype.schedulePosition,
			cancelPosition: PopOver.prototype.cancelPosition
		};

		popover.schedulePosition();
		popover.schedulePosition();
		popover.schedulePosition();
		expect(popover.updatePosition).not.toHaveBeenCalled();

		frame();
		expect(popover.updatePosition).toHaveBeenCalledTimes(1);

		popover.schedulePosition();
		popover.cancelPosition();
		expect(cancel).toHaveBeenCalledWith(1);
	});

	it('listens for scroll in the capture phase on the window', () =>
	{
		const events = PopOver.prototype.setupEvents.call({});
		const scroll = events.find((event) => event[0] === 'scroll');
		expect(scroll[1]).toBe(globalThis);
		expect(scroll[3]).toBe(true);
	});
});

describe('scrollable tabs', () =>
{
	it('scrolls the tab navigation by default', () =>
	{
		const nav = new TabNavigation({ options: [] });
		nav.beforeSetup();
		const layout = nav.render();
		expect(layout.class).toContain('overflow-x-auto');
		expect(layout.class).toContain('[scrollbar-width:none]');
		expect(layout.children[0].class).toContain('whitespace-nowrap');
	});

	it('can turn scrolling off on the tab navigation', () =>
	{
		const nav = new TabNavigation({ options: [], scrollable: false });
		nav.beforeSetup();
		expect(nav.render().class).not.toContain('overflow-x-auto');
	});

	it('scrolls the tab group by default', () =>
	{
		const group = new TabGroup({ options: [] });
		expect(group.render().class).toContain('overflow-x-auto');

		const fixed = new TabGroup({ options: [], scrollable: false });
		expect(fixed.render().class).not.toContain('overflow-x-auto');
	});
});

describe('small screen fixes', () =>
{
	it('uses max-w-full on the aside template', () =>
	{
		const layout = AsideTemplate({ left: null, right: null });
		expect(layout.class).toContain('max-w-full');
		expect(layout.class).not.toContain('max-w-[100vw]');
	});

	it('does not shrink the avatar', () =>
	{
		const layout = Avatar({ src: null, size: 'md' });
		expect(layout.class).toContain('shrink-0');
	});

	it('lets the calendar fit narrow screens', () =>
	{
		const calendar = new Calendar();
		const layout = calendar.render();
		expect(layout.class).toContain('min-w-[min(20rem,100%)]');
		expect(layout.class.split(/\s+/)).not.toContain('min-w-80');
	});
});

describe('DataTable empty state', () =>
{
	const findHidden = (layout) => layout.children.filter(Boolean).find((child) => child.onSet);

	it('keeps the header visible when empty', () =>
	{
		const table = new DataTable({
			headers: [{ label: 'Name' }],
			rows: [],
			rowItem: () => null,
			emptyState: () => ({ text: 'Empty' })
		});
		const layout = table.render();
		expect(findHidden(layout)).toBeUndefined();

		// the empty state renders after the table
		const children = layout.children.filter(Boolean);
		expect(children.length).toBe(2);
		expect(children[0].class).toContain('overflow-x-auto');
	});

	it('hides a table without a header when empty', () =>
	{
		const table = new DataTable({
			rows: [],
			rowItem: () => null,
			emptyState: () => ({ text: 'Empty' })
		});
		const layout = table.render();
		const wrapper = findHidden(layout);
		expect(wrapper.onSet).toEqual(['hasItems', { hidden: false }]);
	});
});
