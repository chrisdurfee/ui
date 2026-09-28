/**
 * Ensure an element can safely use the Popover API.
 *
 * Chrome throws NotSupportedError when showPopover() is called on a node
 * that is not a popover. If the `popover` atom prop did not land as an
 * HTML attribute (or `this.panel` is the wrong node), set it here first.
 *
 * @param {HTMLElement|null|undefined} el
 * @returns {boolean}
 */
export const ensurePopoverApi = (el) =>
{
	if (!el || typeof el.showPopover !== 'function')
	{
		return false;
	}

	if (!el.hasAttribute('popover'))
	{
		el.setAttribute('popover', 'manual');
	}

	return true;
};

/**
 * Hide a popover without throwing when the node is missing or is not
 * a popover.
 *
 * @param {HTMLElement|null|undefined} el
 * @returns {void}
 */
export const hidePopoverSafe = (el) =>
{
	if (!el || typeof el.hidePopover !== 'function' || !el.hasAttribute('popover'))
	{
		return;
	}

	try
	{
		el.hidePopover();
	}
	catch
	{
		// Already closed or not in the top layer.
	}
};
