import { Div, Section } from "@base-framework/atoms";
import { Veil } from "../../../components/atoms/veil.js";
import { TabNavigation } from "./tab-navigation.js";

/**
 * Tab
 *
 * This will create a tab component that can route
 * to tab panels.
 *
 * @class
 */
export class Tab extends Veil
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
		return Div({ class: 'tab-panel' }, [
			new TabNavigation({
				class: this.class,
				options: this.options
			}),
			Section({
				class: 'tab-content',
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

export default Tab;