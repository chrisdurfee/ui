import { Button, Li, Nav, Ul } from '@base-framework/atoms';
import { Veil } from '../../../components/atoms/veil.js';

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
			dataStateSet: ['selected', ['state', props.value, 'active']],
		},
		[
			Button({
				class: 'flex flex-auto justify-center items-center px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
				onState: ['selected', { selected: props.value }],
				click: (e) => props.callBack(props.value),
				disabled: props.disabled
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
 * UnderlinedTabGroup
 *
 * This will create an underlined tab group with bottom border indicators.
 *
 * @class
 * @extends Veil
 */
export class UnderlinedTabGroup extends Veil
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

		return UnderlinedNavigation({
			class: this.class,
			options: this.options,
			callBack
		});
	}

	/**
	 * This will select an option.
	 *
	 * @param {*} value
	 * @returns {void}
	 */
	select(value)
	{
		this.state.selected = value;

		if (typeof this.onSelect === 'function')
		{
			this.onSelect(value, this.parent);
		}
	}

	/**
	 * This will setup the states.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		return {
			// @ts-ignore
			selected: this.options[0]?.value || null
		};
	}
}

export default UnderlinedTabGroup;
