import { Checkbox as BaseCheckbox, Div, I, Label, OnState, Span } from '@base-framework/atoms';
import { Jot } from '@base-framework/base';
import { Icons } from '../../../icons/icons.js';
import { borderClass, disabledClass, focusClass } from './input-classes.js';

/**
 * This will create a hidden checkbox atom.
 *
 * @param {object} props
 * @returns {object}
 */
const HiddenCheckox = ({ id, checked, bind, required }) => (
	BaseCheckbox({
		id,
		cache: 'checkbox',
		class: "absolute opacity-0 w-full h-full cursor-pointer pointer-events-none",
		aria: {
			checked: ['checked'],
		},
		required,
		checked,
		bind
	})
);

/**
 * This will create a checkbox icon atom.
 *
 * @returns {object}
 */
const CheckBoxIcon = () => (
	Span({ class: "absolute text-xs pointer-events-none" }, [
		OnState('checked', (value) => !value
            ? null
            : I({
                class: 'w-2 h-2 pointer-events-none',
                html: Icons.check,
            })
		)
	])
);

/**
 * This will create a custom checkbox atom.
 *
 * @param {object} props
 * @returns {object}
 */
const CustomCheckbox = ({ id, bind, checked, required, clickHandler }) => (
	Div({
		class: `relative flex items-center justify-center w-5 h-5 transition-colors duration-200 border-primary hover:border-accent-foreground
			${borderClass}
			${focusClass}
			${disabledClass}`.trim(),
		onState: [
			'checked',
			{
				'bg-primary': true,
				'text-primary-foreground': true,
				'border-primary': true
			}
		],
		role: 'checkbox',
		aria: {
			checked: ['checked'],
		},
		tabIndex: 0,
		click: clickHandler,
	}, [
		HiddenCheckox({ bind, checked, id, required }),
		CheckBoxIcon(),
	])
);

/**
 * CheckboxLabel
 *
 * This will create a checkbox label atom.
 *
 * @param {object} props
 * @returns {object}
 */
const CheckboxLabel = ({ id, label, clickHandler }) => (
	Label({
		class: "text-base cursor-pointer",
		htmlFor: id,
		click: clickHandler
	}, label)
);

/**
 * Checkbox
 *
 * This will create an accessible checkbox component.
 *
 * @param {object} props
 * @returns {object}
 */
export const Checkbox = Jot(
{
	/**
	 * This will initialize the state of the checkbox.
	 *
	 * @returns {object}
	 */
	state()
	{
		return {
			// @ts-ignore
			checked: this.checked ?? false
		};
	},

	/**
	 * This is added to check the checkbox after the component is rendered
	 * to see if the bind updated the checked value.
	 *
	 * @returns {void}
	 */
	after()
	{
		// @ts-ignore
		this.state.checked = this.checkbox.checked;
	},

	/**
	 * This will handle the click event for the checkbox.
	 *
	 * @param {object} e
	 * @returns {void}
	 */
	clickHandler(e)
	{
		// @ts-ignore
		this.state.toggle('checked');
		// @ts-ignore
		this.checkbox.checked = this.state.checked;

		// @ts-ignore
		if (typeof this.onChange === 'function')
		{
			// @ts-ignore
			this.onChange(this.state.checked, this);
		}
	},

	/**
	 * This will render the checkbox component.
	 *
	 * @returns {object}
	 */
	render()
	{
		// @ts-ignore
		const id = this.getId();

		// @ts-ignore
		return Div({ class: `flex items-center space-x-2 cursor-pointer ${this.class || ''}` }, [
			CustomCheckbox({
				id,
				// @ts-ignore
				bind: this.bind,
				// @ts-ignore
				checked: this.state.checked,
				// @ts-ignore
				required: this.required,
				// @ts-ignore
				clickHandler: (e) => this.clickHandler(e)
			}),
			// @ts-ignore
			this.label && CheckboxLabel({ id, label: this.label, clickHandler: () => this.clickHandler() })
		]);
	}
});

export default Checkbox;