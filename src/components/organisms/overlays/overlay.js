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
	const margin = props.margin || 'm-4 ml-0';
	props.allowHistory = (props.allowHistory === true);
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
		return 'overlay absolute top-[0px] left-0 bottom-0 right-0 flex-col bg-background z-20 lg:z-10 flex flex-auto lg:left-[64px] lg:top-0 overflow-y-visible will-change-contents ' + (this.class || '');
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
		this.state.loading = true;
	}

	/**
	 * This will set the loading state to false.
	 *
	 * @returns {void}
	 */
	removeLoading()
	{
		this.state.loading = false;
	}

	/**
	 * This will add the body of the overlay.
	 *
	 * @returns {object}
	 */
	addBody()
	{
		return Div({ class: 'body fadeIn flex flex-auto flex-col' }, this.getContents());
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