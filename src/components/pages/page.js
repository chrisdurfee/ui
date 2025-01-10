import { Div } from '@base-framework/atoms';
import { Component } from '@base-framework/base';

/**
 * Page
 *
 * This will create a module to extend
 * to all child modules.
 *
 * @class
 * @extends Component
 */
export class Page extends Component
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
	 * This will render the page.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div({ class: `${this.class || ''}` }, this.children);
	}
}

export default Page;