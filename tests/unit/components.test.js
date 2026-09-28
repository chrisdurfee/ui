import { Builder } from '@base-framework/base';
import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Some atoms import the package entry (src/ui.js), which creates an
 * import cycle. Loading the entry first resolves it in the same order
 * as the library build.
 */
import '../../src/ui.js';
import { DelayComponent } from '../../src/components/molecules/delay-component.js';
import { Dialog } from '../../src/components/molecules/dialogs/dialog.js';
import { PopOver } from '../../src/components/molecules/popover.js';
import { InlineNavigation } from '../../src/components/organisms/navigation/inline-navigation.js';
import { NavigationPopover } from '../../src/components/organisms/navigation/mobile/nav-wrapper/navigation-popover.js';

afterEach(() =>
{
	vi.useRealTimers();
	document.body.innerHTML = '';
});

describe('NavigationPopover scroll lock', () =>
{
	/**
	 * Creates a popover-like object that uses the component hooks.
	 *
	 * @returns {object}
	 */
	const createPopover = () =>
	{
		const panel = document.createElement('div');
		return {
			panel,
			scrollPanel: panel,
			afterSetup: NavigationPopover.prototype.afterSetup,
			beforeDestroy: NavigationPopover.prototype.beforeDestroy
		};
	};

	it('locks on setup and always releases on destroy', () =>
	{
		const root = document.documentElement;
		const popover = createPopover();

		popover.afterSetup();
		expect(root.style.overscrollBehavior).toBe('none');
		expect(root.style.overflowY).toBe('');

		/**
		 * Destroyed without the open state flipping (e.g. route change).
		 */
		popover.beforeDestroy();
		expect(root.style.overscrollBehavior).toBe('');
	});

	it('only releases once', () =>
	{
		const root = document.documentElement;
		const first = createPopover();
		const second = createPopover();

		first.afterSetup();
		second.afterSetup();
		first.beforeDestroy();
		first.beforeDestroy();
		expect(root.style.overscrollBehavior).toBe('none');

		second.beforeDestroy();
		expect(root.style.overscrollBehavior).toBe('');
	});

	it('does not render an unresolved style binding', () =>
	{
		const popover = new NavigationPopover({ title: 'Menu' });
		const layout = popover.render();
		expect(layout.style).toBeUndefined();
	});
});

describe('Dialog native close', () =>
{
	it('runs the close path once when the dialog is cancelled', () =>
	{
		const onClose = vi.fn();
		const dialog = new Dialog({ title: 'Test', onClose });
		dialog.open();

		// @ts-ignore
		const panel = dialog.panel;
		expect(panel).toBeTruthy();
		expect(document.body.contains(panel)).toBe(true);

		const cancel = new Event('cancel', { cancelable: true });
		panel.dispatchEvent(cancel);
		panel.dispatchEvent(new Event('close'));

		expect(cancel.defaultPrevented).toBe(true);
		expect(onClose).toHaveBeenCalledTimes(1);
		expect(document.body.contains(panel)).toBe(false);
	});

	it('runs the close path once when the native dialog closes itself', () =>
	{
		const onClose = vi.fn();
		const dialog = new Dialog({ title: 'Test', onClose });
		dialog.open();

		// @ts-ignore
		const panel = dialog.panel;
		panel.dispatchEvent(new Event('close'));

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(document.body.contains(panel)).toBe(false);
	});

	it('runs onClose once when closed by a button', () =>
	{
		const onClose = vi.fn();
		const dialog = new Dialog({ title: 'Test', onClose });
		dialog.open();
		dialog.close();
		dialog.close();

		expect(onClose).toHaveBeenCalledTimes(1);
	});
});

describe('PopOver', () =>
{
	it('closes on outside clicks without a button', () =>
	{
		const panel = document.createElement('div');
		const inside = document.createElement('span');
		panel.appendChild(inside);

		const popover = { panel, button: null, isOutsideClick: PopOver.prototype.isOutsideClick };
		expect(popover.isOutsideClick(document.body)).toBe(true);
		expect(popover.isOutsideClick(inside)).toBe(false);
	});

	it('ignores clicks on the button', () =>
	{
		const panel = document.createElement('div');
		const button = document.createElement('button');
		const popover = { panel, button, isOutsideClick: PopOver.prototype.isOutsideClick };
		expect(popover.isOutsideClick(button)).toBe(false);
		expect(popover.isOutsideClick(document.body)).toBe(true);
	});

	it('falls back to the default size for unknown sizes', () =>
	{
		const getSize = PopOver.prototype.getSize;
		expect(getSize.call({ size: 'unknown' })).toBe('w-[250px]');
		expect(getSize.call({})).toBe('w-[250px]');
		expect(getSize.call({ size: 'sm' })).toBe('w-48');
	});

	it('does not write the position into the parent data', () =>
	{
		const parentData = { set: vi.fn() };
		const popover = { parent: { data: parentData }, setData: PopOver.prototype.setData };
		expect(popover.setData()).toBe(parentData);
		expect(parentData.set).not.toHaveBeenCalled();
	});

	it('renders without a stray class or position binding', () =>
	{
		const popover = new PopOver({ size: 'bogus' });
		const layout = popover.render();
		expect(layout.class.split(/\s+/)).not.toContain('r');
		expect(layout.class).not.toContain('undefined');
		expect(layout.style).toBeUndefined();
	});

	it('writes the position to the panel style', () =>
	{
		const panel = document.createElement('div');
		const popover = { panel, button: null, updatePosition: PopOver.prototype.updatePosition };
		popover.updatePosition();
		expect(panel.style.top).toMatch(/px$/);
		expect(panel.style.left).toMatch(/px$/);
	});
});

describe('DelayComponent', () =>
{
	it('removes the element when animationend never fires', () =>
	{
		vi.useFakeTimers();
		const component = new DelayComponent({ removingClass: 'fadeOut', removeDelay: 200 });
		const container = document.createElement('div');
		document.body.appendChild(container);
		Builder.render(component, container);

		// @ts-ignore
		const panel = component.panel;
		const removeContext = vi.spyOn(component, 'removeContext');
		component.remove();

		expect(removeContext).toHaveBeenCalledTimes(1);
		expect(panel.classList.contains('fadeOut')).toBe(true);
		expect(container.contains(panel)).toBe(true);

		vi.advanceTimersByTime(200);
		expect(container.contains(panel)).toBe(false);
	});

	it('removes the element on animationend', () =>
	{
		vi.useFakeTimers();
		const component = new DelayComponent({ removingClass: 'fadeOut' });
		const container = document.createElement('div');
		document.body.appendChild(container);
		Builder.render(component, container);

		// @ts-ignore
		const panel = component.panel;
		component.remove();
		panel.dispatchEvent(new Event('animationend'));
		expect(container.contains(panel)).toBe(false);

		expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
	});
});

describe('InlineNavigation links', () =>
{
	it('resets the links on every render', () =>
	{
		const nav = new InlineNavigation({
			options: [
				{ label: 'One', href: '/one' },
				{ label: 'Two', href: '/two' }
			]
		});

		nav.render();
		// @ts-ignore
		expect(nav.links.length).toBe(2);

		nav.render();
		// @ts-ignore
		expect(nav.links.length).toBe(2);
	});
});
