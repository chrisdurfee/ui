import { Div, Footer, H2, Header } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";
import { Button } from "../../atoms/buttons/buttons.js";
import { Icon } from "../../atoms/icon.js";
import { Icons } from "../../icons/icons.js";
import { Form } from "../form/form.js";

/**
 * This will create a dialog header.
 *
 * @param {object} props
 * @returns {object}
 */
const ModalHeader = ({ title, description, back, icon, options = [] }) => (
	Header({ class: 'modal-header bg-background/80 backdrop-blur-md sticky flex flex-none items-center py-4 px-6 z-10 min-w-0' }, [

		/**
		 * Back Button
		 */
		back && Button({ variant: 'icon', icon: Icons.arrows.left, class: 'mr-2 p-0 flex sm:hidden', click: (e, parent) => parent.close() }),

		/**
		 * Icon
		 */
		icon && Div({ class: 'mr-2 w-12 h-12 rounded-full bg-muted flex flex-none items-center justify-center' }, [ Icon(icon) ]),

		/**
		 * Title and Description
		 */
		Div({ class: 'flex flex-auto flex-row justify-between ml-2 gap-2 min-w-0' }, [
			Div({ class: 'flex flex-auto flex-col min-w-0' }, [
				H2({ class: 'text-lg font-semibold m-0 truncate' }, title),
				description && Div({ class: 'text-sm text-muted-foreground truncate' }, description)
			]),
			Div({ class: 'flex flex-none items-center gap-2' }, options)
		])
	])
);

/**
 * This will create a dialog component.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
export const ModalContainer = Atom((props, children) => (
	Div({
			popover: 'manual',
			class: `modal m-auto top-0 right-0 bottom-0 left-0 fixed z-20 grid w-full h-full max-h-screen gap-2 lg:border bg-background text-foreground shadow-xl break-words p-0 overflow-y-auto ${props.class}`,
			click: (e, parent) =>
			{
				const isClickOutside = (e.target === parent.panel);
				if (isClickOutside)
				{
					e.preventDefault();
					e.stopPropagation();

					parent.state.open = false;
				}
			}
		}, [
		Form({ class: 'modal-content relative bg-background z-[1] flex flex-auto flex-col gap-y-4', submit: (e, parent) => (props.onSubmit && props.onSubmit(parent)) }, [
			ModalHeader(props),
			Div({ class: 'modal-body flex flex-grow flex-col py-0 px-6 z-0', cache: 'modalBody' }, children),
			!props.hideFooter && Footer({ class: 'modal-footer sticky bg-background/80 backdrop-blur-md flex flex-none justify-between py-4 px-6 z-10' }, props.buttons)
		])
	])
));