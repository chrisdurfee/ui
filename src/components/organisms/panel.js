import { Div } from "@base-framework/atoms";
import { Component } from "@base-framework/base";

/**
 * Panel
 *
 * This will create a panel.
 *
 * @class
 * @extends Component
 */
export class Panel extends Component
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
	}

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div({ class: this.class || '' }, this.children);
	}
}

export default Panel;