import { Div, Section } from "@base-framework/atoms";
import { Veil } from '../../../components/atoms/veil.js';
import { UnderlinedTabNavigation } from "./underlined-tab-navigation.js";

/**
 * UnderlinedTab
 *
 * This will create an underlined tab component that can route
 * to tab panels with an active bottom border indicator.
 *
 * @class
 */
export class UnderlinedTab extends Veil
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

		/**
		 * Whether the tab navigation is scrollable.
		 * @member {boolean} scrollable
		 * @default false
		 */
		this.scrollable = false;

		/**
		 * Whether to replace the history state instead of pushing.
		 * @member {boolean} replace
		 * @default false
		 */
		this.replace = false;
	}

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div({ class: 'underlined-tab-panel flex flex-auto flex-col' }, [
			new UnderlinedTabNavigation({
				class: this.class,
				options: this.options,
				scrollable: this.scrollable,
				replace: this.replace
			}),
			Section({
				class: 'tab-content pt-6 flex flex-auto flex-col',
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
		// @ts-ignore
		for (let i = 0, length = options.length; i < length; i++)
		{
			// @ts-ignore
			option = options[i];
			switches.push(
			{
				uri: option.uri || option.href,
				component: option.component || null,
				import: option.import || null,
				title: option.title || null,
				persist: true
			});
		}
		return switches;
	}
}

export default UnderlinedTab;
