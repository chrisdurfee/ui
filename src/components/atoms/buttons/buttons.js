import { Button as BaseButton } from '@base-framework/atoms';
import { Atom, Component } from '@base-framework/base';
import { Icons } from '../../icons/icons.js';
import { Icon } from '../icon.js';

/**
 * This will create a button.
 *
 * @param {object} defaultProps
 * @returns {object}
 */
const DefaultVariant = (defaultProps) => (
	Atom((props, children) => (
		BaseButton({
			...defaultProps,
			...props,
			class: `bttn ${defaultProps.class} ${props.class || ''}`
		}, children)
	))
);

/**
 *  This will create a button with an icon.
 *
 *  @param {object} props
 *  @param {array} children
 *  @returns {object}
 */
const IconButton = Atom((props, children) => (
		BaseButton({
			...props,
			class: props.class
		}, [
			props.icon && props.position !== 'right' ? Icon({ size: 'sm', class: props.animation ?? null }, props.icon) : null,
			...(children || []),
			props.icon && props.position === 'right' ? Icon({ size: 'sm', class: props.animation ?? null }, props.icon) : null
		])
	)
);

/**
 * This will create a button with an icon.
 *
 * @param {object} defaultProps
 * @returns {object}
 */
const WithIconVariant = (defaultProps) => (
	Atom((props, children) => (
		IconButton({
			...defaultProps,
			...props,
			class: `bttn ${defaultProps.class} ${props.class || ''}`
		}, children)
	))
);

/**
 * BackButton
 *
 * This will create a back button that tracks history length to ensure
 * it goes back to the previous page even if tabs/navigation were used.
 *
 * @class
 * @extends Component
 */
class BackButton extends Component
{
	/**
	 * This will set the start history length.
	 *
	 * @param {object} props
	 * @param {array} children
	 */
	constructor(props, children)
	{
		super(props, children);
		this.startHistoryLength = globalThis.history.length;
	}

	/**
	 * This will handle the click event.
	 *
	 * @returns {void}
	 */
	goBack()
	{
		// @ts-ignore
		if (this.props.allowHistory === true && globalThis.history.length > 1)
		{
			const currentLength = globalThis.history.length;
			const delta = this.startHistoryLength - currentLength - 1;
			if (delta < -1)
			{
				globalThis.history.go(delta);
				return;
			}

			globalThis.history.back();
			return;
		}

		// @ts-ignore
		if (this.props.backUrl)
		{
			// @ts-ignore
			app.navigate(this.props.backUrl);
			return;
		}

		globalThis.history.back();
	}

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		// @ts-ignore
		const props = { ...this };
		// @ts-ignore
		props.icon = props.icon || Icons.chevron.single.left;
		// @ts-ignore
		props.click = props.click || (() => this.goBack());

		return IconButton(props, this.children);
	}
}

/**
 * This will create a back button variant.
 *
 * @param {object} defaultProps
 * @returns {object}
 */
const BackVariant = (defaultProps) => (
	(props, children) => new BackButton({ ...defaultProps, ...props }, children)
);

/**
 * This will set upt the variants for the button.
 *
 * @constant
 * @type {object}
 */
const BUTTON_VARIANTS = {
	primary: DefaultVariant({ class: 'primary' }),
	secondary: DefaultVariant({ class: 'secondary' }),
	destructive: DefaultVariant({ class: 'destructive' }),
	warning: DefaultVariant({ class: 'warning' }),
	outline: DefaultVariant({ class: 'outline' }),
	ghost: DefaultVariant({ class: 'ghost' }),
	link: DefaultVariant({ class: 'link' }),
	icon: WithIconVariant({ class: 'icon' }),
	withIcon: WithIconVariant({ class: 'with-icon' }),
	back: BackVariant({ class: 'with-icon back-button' }),
};

/**
 * This will create a button by variant or default.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const Button = Atom((props, children) =>
{
	const VariantButton = BUTTON_VARIANTS[props.variant] || BUTTON_VARIANTS.primary;
	return VariantButton(props, children);
});

export default Button;

/**
 * This will create a primary button that has a loading icon.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const LoadingButton = Atom((props, children) =>
{
	return Button({ ...props, variant: 'withIcon', icon: Icons.loading, animation: 'animate-spin' }, children);
});