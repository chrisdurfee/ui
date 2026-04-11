import { Div } from "@base-framework/atoms";
import { Atom, Component } from "@base-framework/base";
import { Button } from "../../atoms/buttons/buttons.js";

/**
 * This will create an overlay back button.
 *
 * @param {object} props
 * @returns {object}
 */
export const BackButton = Atom((props) =>
{
	// @ts-ignore
	const margin = props.margin || 'm-4 ml-0';
	return Div({ class: `flex-none ${margin}` }, [
		Button({ variant: 'back', class: 'ghost', ...props })
	]);
});

/**
 * Overlay
 *
 * This will create an overlay.
 *
 * @class
 * @extends Component
 */
export class Overlay extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * @member {string} class
		 * @default ''
		 */
		this.class = '';

		/**
		 * @member {string} class
		 * @default ''
		 */
		this.zIndex = 'z-20';
	}

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Div(
			{
				class: this.getClassName(),
				// @ts-ignore
				animateIn: this.animateIn ?? null,
				// @ts-ignore
				animateOut: this.animateOut ?? null,
				onSet: ['loading', {
					loading: true
				}]
			},
			[
				this.addBody()
			]
		);
	}

	/**
	 * This will get the overlay className.
	 *
	 * @returns {string}
	 */
	getClassName()
	{
		// @ts-ignore
		const positioning = this.fixed ? 'fixed' : 'absolute';
		return `${positioning} flex flex-auto flex-col overlay left-0 top-0 right-0 ${this.zIndex}
			h-dvh max-h-dvh min-h-dvh
			bg-background pointer-events-auto
			lg:left-16
			 ${this.class || ''}`;
	}

	/**
	 * This will setup and render the component.
	 *
	 * @param {object} container
	 * @returns {void}
	 */
	setContainer(container)
	{
		// @ts-ignore
		this.container = app.root;
	}

	/**
	 * This will setup the overlay states.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		return {
			loading: false
		};
	}

	/**
	 * This will set the loading state.= to true.
	 *
	 * @returns {void}
	 */
	addLoading()
	{
		// @ts-ignore
		this.state.loading = true;
	}

	/**
	 * This will set the loading state to false.
	 *
	 * @returns {void}
	 */
	removeLoading()
	{
		// @ts-ignore
		this.state.loading = false;
	}

	/**
	 * This will add the body of the overlay.
	 *
	 * @returns {object}
	 */
	addBody()
	{
		return Div({ class: 'body fadeIn flex flex-auto flex-col bg-background' }, this.getContents());
	}

	/**
	 * This will get the body contents.
	 *
	 * @returns {array|null}
	 */
	getContents()
	{
		return this.children;
	}
}

export default Overlay;
