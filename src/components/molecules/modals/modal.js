import { Builder, Component } from "@base-framework/base";
import { Button } from "../../atoms/buttons/buttons.js";
import { ModalContainer } from "./modal-container.js";

/**
 * This will render the modal component.
 *
 * @param {object} component
 * @returns {object}
 */
// @ts-ignore
const render = (component) => { return Builder.render(component, app.root); };

/**
 * Modal
 *
 * This will create a modal component.
 *
 * @export
 * @class Modal
 * @extends {Component}
 */
export class Modal extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * @member {string} title
		 */
		this.title = null;

		/**
		 * @member {string} description
		 */
		this.description = null;

		/**
		 * @member {string|null} size
		 * @default null
		 * @values 'sm', 'md', 'lg', 'xl'
		 */
		this.size = null;

		/**
		 * @member {string|null} type
		 * @default null
		 * @values 'right', 'left'
		 * @description This will set the type of modal.
		 */
		this.type = null;

		/**
		 * @member {boolean} hidePrimaryButton
		 * @default false
		 * @description This will hide the primary button.
		 * @values true, false
		 */
		this.hidePrimaryButton = false;

		/**
		 * @member {string} icon
		 */
		this.icon = null;

		/**
		 * @member {function|nll} onSubmit
		 */
		this.onSubmit = null;

		/**
		 * @member {function|null} onClose
		 */
		this.onClose = null;

		/**
		 * @member {boolean} back
		 */
		this.back = false;
	}

	/**
	 * This will render the modal component.
	 *
	 * @returns {object}
	 */
	render()
	{
		const className = this.getMainClass();
		const title = this.title || '';
		const description = this.description || null;

		return ModalContainer({
				class: className,
				title,
				description,
				options: this.headerOptions(),
				buttons: this.getButtons(),
				onSubmit: (parent) =>
				{
					let canClose = true;
					if (this.onSubmit)
					{
						canClose = this.onSubmit(parent);
					}

					if (canClose !== false)
					{
						this.destroy();
					}
				},
				icon: this.icon,
				back: this.back ?? false,
				aria: { expanded: ['open']}
			},
			this.children
		);
	}

	/**
	 * This will setup the states.
	 *
	 * @returns {object}
	 */
	setupStates()
	{
		return {
			open: {
				state: false,
				callBack: (state) =>
				{
					if (!state)
					{
						this.destroy();
					}
				}
			}
		};
	}

	/**
	 * This will get the header options.
	 *
	 * @returns {Array<object>}
	 */
	headerOptions()
	{
		return [];
	}

	/**
	 * This will get the buttons for the modal.
	 *
	 * @returns {array}
	 */
	getButtons()
	{
		return [
			Button({ variant: 'outline', click: () => this.destroy() }, 'Cancel'),
			this.hidePrimaryButton !== true && Button({ variant: 'primary', type: 'submit' }, 'Save')
		];
	}

	/**
	 * This will check if the click was outside the component.
	 *
	 * @param {object} element
	 * @returns {boolean}
	 */
	isOutsideClick(element)
	{
		return (!this.panel.contains(element));
	}

	/**
	 * This will get the size class.
	 *
	 * @returns {string}
	 */
	getSizeClass()
	{
		switch (this.size)
		{
			// case 'sm':
			// 	return 'sm max-w-[646px]';
			case 'lg':
				return 'lg max-w-[900px]';
			case 'xl':
				return 'xl max-w-[1400px]';
			default:
				return 'md max-w-[760px]';
		}
	}

	/**
	 * This will get the type class.
	 *
	 * @returns {string}
	 */
	getTypeClass()
	{
		switch (this.type)
		{
			case 'right':
				return 'right right-0';
			case 'left':
				return 'left left-0';
			default:
				return '';
		}
	}

	/**
	 * This will get the modal class.
	 *
	 * @returns {string}
	 */
	getMainClass()
	{
		return this.getSizeClass() + ' ' + this.getTypeClass();
	}

	/**
	 * This will override the set up to use the app shell.
	 *
	 * @param {object} container
	 */
	setContainer(container)
	{
		// @ts-ignore
		this.container = app.root;
	}

	/**
	 * This will open the modal.
	 *
	 * @returns {void}
	 */
	open()
	{
		render(this);
		this.showModal();
	}

	/**
	 * This will destroy the modal.
	 *
	 * @returns {void}
	 */
	close()
	{
		this.destroy();
	}

	/**
	 * This will show the modal.
	 *
	 * @protected
	 * @returns {void}
	 */
	showModal()
	{
		/**
		 * This will delay calling to show modal to make sure
		 * it is added to the DOM.
		 */
		const DELAY = 10;
		globalThis.setTimeout(() => this.panel.showPopover(), DELAY);
		this.state.open = true;

		/**
		 * This will prevent the body from scrolling when the modal is open.
		 */
		document.documentElement.style.overflowY = 'hidden';
	}

	/**
	 * This will hide the modal.
	 *
	 * @protected
	 * @returns {void}
	 */
	beforeDestroy()
	{
		this.panel.hidePopover();
		this.state.open = false;

		if (typeof this.onClose === 'function')
		{
			this.onClose(this);
		}

		/**
		 * This will allow the body to scroll when the modal is closed.
		 */
		document.documentElement.style.overflowY = 'auto';
	}
}