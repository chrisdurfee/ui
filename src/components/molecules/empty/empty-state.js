import { Div, H2, Header, P } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";
import { Icon } from "../../atoms/icon.js";
import { Form } from "../form/form.js";

/**
 * This will create an empty state component for unsubscription errors.
 *
 * @param {object} props - The properties for the empty state.
 * @param {array} children - The children elements to be rendered inside the empty state.
 * @return {object} - The empty state component.
 */
export const EmptyState = Atom((props, children = []) => (
	Div({ class: 'w-full max-w-md p-6 m-auto' }, [
		Form({ class: 'flex flex-auto flex-col' }, [
			Div({ class: 'flex flex-auto flex-col space-y-4' }, [
				Div({ class: 'flex flex-auto items-center justify-center' }, [
					props.icon && Div({ class: 'w-16 h-16 mb-2 text-primary' }, [
						Icon(props.icon)
					])
				]),
				Header({ class: 'py-4 text-center' }, [
					H2({ class: 'text-xl font-bold' }, props.title),
					P({ class: 'pb-8 text-muted-foreground' }, props.description || ''),
					...children
				])
			])
		])
	])
));

export default EmptyState;
