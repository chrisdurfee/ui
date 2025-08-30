import { Button, Div, Li, Nav, Section, Ul } from "@base-framework/atoms";
import { Component } from "@base-framework/base";

/**
 * This will create an underlined tab button atom.
 *
 * @param {object} props
 * @returns {object}
 */
const UnderlinedTabButton = (props) => (
	Li(
		{
			class: 'relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 after:scale-x-0 data-[state=active]:after:scale-x-100',
			dataSet: ['selected', ['state', props.value, 'active']],
		},
		[
			Button({
				class: 'flex flex-auto justify-center items-center px-4 py-3',
				onSet: ['selected', { selected: props.value }],
				click: (e) => props.callBack(props.value),
			}, props.label)
		]
	)
);

/**
 * This will add an option.
 *
 * @param {object} option
 * @param {function} callBack
 * @returns {object}
 */
const addOption = (option, callBack) =>
{
	option.callBack = callBack;
	return UnderlinedTabButton(option);
};

/**
 * UnderlinedNavigation
 *
 * This will create an underlined tab navigation component.
 *
 * @param {object} props
 * @returns {object}
 */
const UnderlinedNavigation = (props) => (
	Nav({ class: `border-b border-border ${props.class}` }, [
		Ul({ class: 'flex flex-row items-center', map: [props.options, (option) => addOption(option, props.callBack)] })
	])
);

/**
 * UnderlinedButtonTab
 *
 * This will create an underlined button tab component with content switching.
 *
 * @class
 */
export class UnderlinedButtonTab extends Component
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
		 * This will set the select call back.
		 * @member {function} callBack
		 */
		this.onSelect = null;
	}

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		const callBack = this.select.bind(this);

		return Div({ class: 'underlined-button-tab-panel' }, [
			UnderlinedNavigation({
				class: this.class,
				options: this.options,
				callBack
			}),
			Section({
				class: 'tab-content pt-6',
				switch: this.addGroup()
			})
		]);
	}

	/**
	 * This will set up the component.
	 *
	 * @returns {void}
	 */
	beforeSetup()
	{
		this.selectedIndex = 0;
		this.setSelectedIndex();
	}

	/**
	 * This will set the selected index.
	 *
	 * @returns {void}
	 */
	setSelectedIndex()
	{
		const options = this.options;
		for (let i = 0, length = options.length; i < length; i++)
		{
			if (options[i].selected === true)
			{
				this.selectedIndex = i;
				break;
			}
		}
	}

	/**
	 * This will select an option.
	 *
	 * @param {*} value
	 * @returns {void}
	 */
	select(value)
	{
		this.setSelected(value);

		if (this.onSelect)
		{
			this.onSelect(value, this.selectedIndex);
		}
	}

	/**
	 * This will set the selected option.
	 *
	 * @param {*} value
	 * @returns {void}
	 */
	setSelected(value)
	{
		const options = this.options;
		for (let i = 0, length = options.length; i < length; i++)
		{
			if (options[i].value === value)
			{
				this.selectedIndex = i;
				break;
			}
		}
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
				uri: option.value,
				component: option.component,
				title: option.title || null,
				persist: true
			});
		}
		return switches;
	}
}

export default UnderlinedButtonTab;
