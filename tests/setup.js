/**
 * Global test setup.
 *
 * jsdom does not implement scrolling, the modal dialog API or the
 * Popover API. They are stubbed here so components that call them can
 * be rendered in tests.
 */
window.scrollTo = () => {};
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || function() {};

if (typeof HTMLDialogElement !== 'undefined')
{
	const proto = HTMLDialogElement.prototype;
	if (typeof proto.showModal !== 'function')
	{
		proto.showModal = function()
		{
			this.setAttribute('open', '');
		};
	}

	if (typeof proto.show !== 'function')
	{
		proto.show = function()
		{
			this.setAttribute('open', '');
		};
	}

	if (typeof proto.close !== 'function')
	{
		proto.close = function()
		{
			if (!this.hasAttribute('open'))
			{
				return;
			}

			this.removeAttribute('open');
			this.dispatchEvent(new Event('close'));
		};
	}
}

if (typeof HTMLElement.prototype.showPopover !== 'function')
{
	HTMLElement.prototype.showPopover = function()
	{
		this.setAttribute('data-popover-open', '');
	};
}

if (typeof HTMLElement.prototype.hidePopover !== 'function')
{
	HTMLElement.prototype.hidePopover = function()
	{
		this.removeAttribute('data-popover-open');
	};
}

/**
 * Components that render into the app shell use the global `app.root`.
 */
// @ts-ignore
globalThis.app = globalThis.app || { root: document.body };
