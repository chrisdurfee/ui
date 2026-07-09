/**
 * KeyboardInset
 *
 * Lifts a bottom-anchored drawer above the on-screen keyboard on iOS.
 *
 * iOS Safari (and installed PWAs) do NOT resize the layout viewport when the
 * software keyboard opens — the keyboard is painted *over* the page. A drawer
 * pinned to `bottom: 0` therefore ends up with its lower portion (footer /
 * input row) hidden behind the keyboard, and because the layout viewport never
 * changed there is nothing to scroll into view.
 *
 * The VisualViewport API is the only reliable signal for the keyboard: when the
 * keyboard opens, `visualViewport.height` shrinks (and/or `offsetTop` grows).
 * The covered height is:
 *
 *     keyboard = layoutViewportHeight - (visualViewport.height + offsetTop)
 *
 * That value is pushed onto the panel as an inline `bottom` (with `important`
 * so it beats the app's `.modal.drawer { bottom: 0 !important }`), and the
 * panel's `max-height` is clamped to the visible area so the drawer never
 * extends behind the keyboard.
 *
 * The DrawerGesture drag-to-close uses `transform`, which is independent of the
 * `bottom`/`max-height` written here, so the two never fight.
 *
 * @class KeyboardInset
 */
export class KeyboardInset
{
	/**
	 * @param {object} options
	 * @param {HTMLElement} options.panel - The drawer panel (`.modal.drawer`).
	 */
	constructor({ panel })
	{
		/**
		 * @type {HTMLElement|null}
		 */
		this.panel = panel;

		/**
		 * @type {VisualViewport|null}
		 */
		this.viewport = window.visualViewport || null;

		this._boundUpdate = this.update.bind(this);
	}

	/**
	 * Checks if the viewport is mobile size. The keyboard inset is only relevant
	 * on mobile where the drawer is bottom-anchored.
	 *
	 * @returns {boolean}
	 */
	isMobile()
	{
		return window.innerWidth < 1024;
	}

	/**
	 * Begins tracking the visual viewport.
	 *
	 * @returns {void}
	 */
	start()
	{
		if (!this.viewport || !this.panel)
		{
			return;
		}

		this.viewport.addEventListener('resize', this._boundUpdate);
		this.viewport.addEventListener('scroll', this._boundUpdate);
		this.update();
	}

	/**
	 * Recomputes the keyboard height and repositions the drawer.
	 *
	 * @returns {void}
	 */
	update()
	{
		if (!this.viewport || !this.panel)
		{
			return;
		}

		/**
		 * On desktop the drawer is a centered modal; never offset it.
		 */
		if (!this.isMobile())
		{
			this.clear();
			return;
		}

		/**
		 * Height of the keyboard (or any chrome) covering the bottom of the
		 * layout viewport. A small tolerance avoids reacting to sub-pixel /
		 * URL-bar jitter when the keyboard is closed.
		 */
		const covered = window.innerHeight - (this.viewport.height + this.viewport.offsetTop);
		const keyboard = covered > 1 ? covered : 0;

		if (keyboard === 0)
		{
			this.clear();
			return;
		}

		this.panel.style.setProperty('bottom', `${keyboard}px`, 'important');
		this.panel.style.setProperty('max-height', `${this.viewport.height}px`, 'important');
	}

	/**
	 * Removes the inline overrides, restoring the drawer to its CSS-defined
	 * bottom-anchored position.
	 *
	 * @returns {void}
	 */
	clear()
	{
		if (!this.panel)
		{
			return;
		}

		this.panel.style.removeProperty('bottom');
		this.panel.style.removeProperty('max-height');
	}

	/**
	 * Stops tracking and clears any applied offset.
	 *
	 * @returns {void}
	 */
	destroy()
	{
		if (this.viewport)
		{
			this.viewport.removeEventListener('resize', this._boundUpdate);
			this.viewport.removeEventListener('scroll', this._boundUpdate);
		}

		this.clear();
		this.panel = null;
		this.viewport = null;
	}
}
