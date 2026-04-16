import { Div, H2, Header } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";
import { Button } from "../../atoms/buttons/buttons.js";
import { UniversalIcon } from "../../atoms/universal-icon.js";
import { Icons } from "../../icons/icons.js";

/**
 * ModalHeader
 *
 * Renders a header for modal/drawer components with title, description,
 * optional back button (mobile), icon, and action buttons.
 *
 * @param {object} props
 * @param {string} props.title - The modal title
 * @param {string} [props.description] - Optional description text
 * @param {boolean} [props.back=false] - Show back button on mobile
 * @param {string} [props.icon] - SVG icon string to display
 * @param {Array} [props.options=[]] - Array of action buttons/elements
 * @param {boolean} [props.titleCenter=false] - Center title and description vertically
 * @returns {object}
 */
// @ts-ignore
export const ModalHeader = Atom(({ title, description, back, icon, options = [], titleCenter = false }) => (
	Header({ class: 'modal-header bg-background/80 backdrop-blur-md sticky top-0 flex flex-none items-center py-4 px-6 z-10 min-w-0' }, [

		/**
		 * Back Button (Mobile Only)
		 */
		back && Button({
			variant: 'icon',
			icon: Icons.arrows.left,
			class: 'mr-2 p-0 flex sm:hidden',
			click: (e, parent) => parent.close()
		}),

		/**
		 * Icon Container
		 */
		icon && Div({ class: 'mr-2 w-12 h-12 rounded-full bg-muted flex flex-none items-center justify-center' }, [
			UniversalIcon({ size: 'md' }, icon)
		]),
		Div({ class: `flex flex-auto flex-row justify-between ml-2 gap-2 min-w-0` }, [
			Div({ class: `flex flex-auto flex-col min-w-0 ${titleCenter ? 'items-center' : ''}` }, [
				H2({ class: `text-lg font-semibold m-0 truncate` }, title),
				description && Div({ class: 'text-sm text-muted-foreground truncate' }, description)
			]),
			Div({ class: 'flex flex-none items-center gap-2' }, options)
		])
	])
));
