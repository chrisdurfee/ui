import { Div, Footer } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";
import { Form } from "../form/form.js";
import { ModalHeader } from "./modal-header.js";

/**
 * ModalContainer
 *
 * Creates a container for modal/drawer components with header, body, and footer.
 * Handles popover behavior, form submission, and backdrop clicks.
 *
 * @param {object} props - Component properties
 * @param {string} [props.class] - Additional CSS classes
 * @param {string} props.title - Modal title
 * @param {string} [props.description] - Optional description
 * @param {boolean} [props.back=false] - Show back button on mobile
 * @param {string} [props.icon] - Icon to display in header
 * @param {Array} [props.options=[]] - Header action buttons
 * @param {Array} [props.buttons=[]] - Footer buttons
 * @param {boolean} [props.hideFooter=false] - Hide footer section
 * @param {Function} [props.onSubmit] - Form submission handler
 * @param {object} [props.gestureHandlers] - Touch gesture handlers for drawer
 * @param {Array} children - Modal body content
 * @returns {object}
 */
export const ModalContainer = Atom((props, children) =>
{
	// Don't apply positioning/sizing classes for drawer - CSS handles it
	const isDrawer = props.class?.includes('drawer');
	const positionClasses = isDrawer ? '' : 'm-auto top-0 right-0 bottom-0 left-0';
	const sizeClasses = isDrawer ? '' : 'h-full max-h-screen';

	return Div({
			popover: 'manual',
			class: `modal ${positionClasses} ${sizeClasses} fixed z-20 grid w-full gap-2 lg:border bg-background text-foreground shadow-xl break-words p-0 overflow-y-auto ${props.class}`,
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
		Form({
			class: 'modal-content relative bg-background z-[1] flex flex-auto flex-col gap-y-4 min-w-0',
			submit: (e, parent) => (props.onSubmit && props.onSubmit(parent)),
			cache: 'modalContent',
			...props.gestureHandlers
		}, [
			ModalHeader(props),
			Div({ class: 'modal-body flex flex-grow flex-col py-0 px-6 z-0', cache: 'modalBody' }, children),
			!props.hideFooter && Footer({ class: 'modal-footer sticky bottom-0 bg-background/80 backdrop-blur-md flex flex-none justify-between py-4 px-6 z-10' }, props.buttons)
		])
	]);
});