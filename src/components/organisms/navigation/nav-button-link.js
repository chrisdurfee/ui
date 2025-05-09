import { Button } from "@base-framework/atoms";
import { Component } from "@base-framework/base";

/**
 * NavButtonLink
 *
 * This will create a button to open and close
 * nested navigations.
 * @class
 */
export class NavButtonLink extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * This will set the class.
		 * @member {string} class
		 * @default ''
		 */
		this.class = '';

		/**
		 * This will set the check callback.
		 * @member {function} checkCallBack
		 * @default null
		 */
		this.checkCallBack = null;
	}

	/**
	 * This will render the component.
	 *
	 * @override
	 * @returns {object}
	 */
	render()
	{
		const state = this.state;

		return Button({
			class: this.class || '',
			onState: [
				['selected', {
					selected: true
				}],
				['active', {
					active: true
				}]
			],
			click: () =>
			{
				state.toggle('active');

				if (!this.checkCallBack)
				{
					return;
				}

				const active = (state.active)? this : null;
				this.checkCallBack(active);
			}
		}, this.children);
	}

	/**
	 * This will set up the states.
	 *
	 * @override
	 * @protected
	 * @returns {object}
	 */
	setupStates()
	{
		return {
			selected: false,
			active: false
		};
	}

	/**
	 * This will update the states.
	 *
	 * @param {object} selected
	 * @returns {void}
	 */
	update(selected)
	{
		this.state.set({
			selected,
			active: selected
		});
	}
}

export default NavButtonLink;