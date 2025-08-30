import { Div, Section } from "@base-framework/atoms";
import { Component } from "@base-framework/base";
import { UnderlinedTabNavigation } from "./underlined-tab-navigation.js";

/**
 * UnderlinedTab
 *
 * This will create an underlined tab component that can route
 * to tab panels with an active bottom border indicator.
 *
 * @class
 */
export class UnderlinedTab extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * This will set the options.
		 * @member {array} options
		 * @default []
		 */
		this.options = [];

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
		return Div({ class: 'underlined-tab-panel' }, [
			new UnderlinedTabNavigation({
				class: this.class,
				options: this.options
			}),
			Section({
				class: 'tab-content pt-6',
				switch: this.addGroup()
			})
		]);
	}

	/**
	 * This will add the group.
	 *
	 * @returns {array}
	 */
	addGroup()
	{
		let option;
		const switches = [];

		const options = this.options;
		for (let i = 0, length = options.length; i < length; i++)
		{
			option = options[i];
			switches.push(
			{
				uri: option.uri || option.href,
				component: option.component,
				title: option.title || null,
				persist: true
			});
		}
		return switches;
	}
}

export default UnderlinedTab;
