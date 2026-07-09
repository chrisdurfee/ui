import {
	Input as BaseInput,
	Textarea as BaseTextarea,
	Div,
	Label,
	Span,
} from '@base-framework/atoms';
import { Atom, Html } from '@base-framework/base';
import { MaterialIcon } from '../../material-icon.js';
import { borderClass, disabledClass, focusClass } from './input-classes.js';

/**
 * Formats a string as a telephone number in the format (XXX) XXX-XXXX.
 *
 * @param {string} number The raw phone number string.
 * @returns {string} The formatted phone number.
 */
const formatTel = (number) =>
{
	if (!number || 0 === number.length) return '';

	const cleaned = number.replace(/\D/g, '');
	const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
	if (!match)
	{
		return number;
	}

	if (!match[2])
	{
		return match[1] || '';
	}

	return `(${match[1]}) ${match[2]}${match[3] ? '-' + match[3] : ''}`;
};

/**
 * Keyup handler that formats the phone number in the input field.
 *
 * @param {object} e The DOM event object.
 * @returns {void}
 */
const formatPhoneNumber = (e) =>
{
	const target = e.target;
	const formattedNumber = formatTel(target.value);
	if (formattedNumber)
	{
		target.value = formattedNumber;
	}
};

// ---- Class Constants ----

/**
 * @constant {string} FLOATING_INPUT_CLASSES
 * Classes for the floating label input element.
 * Uses peer for label animation, placeholder-transparent hides the
 * actual placeholder so the label serves as a visual placeholder.
 */
const FLOATING_INPUT_CLASSES = [
	'peer w-full min-w-0 max-w-full h-14 px-3 pt-5 pb-1',
	'text-base text-foreground',
	borderClass,
	focusClass,
	disabledClass,
	'placeholder-transparent',
].join(' ');

/**
 * @constant {string} FLOATING_TEXTAREA_CLASSES
 * Classes for the floating label textarea element.
 */
const FLOATING_TEXTAREA_CLASSES = [
	'peer w-full min-h-[120px] px-3 pt-6 pb-2',
	'text-base text-foreground',
	borderClass,
	focusClass,
	disabledClass,
	'placeholder-transparent resize-y',
].join(' ');

/**
 * @constant {string} FLOATING_SELECT_CLASSES
 * Classes for the floating label select element.
 */
const FLOATING_SELECT_CLASSES = [
	'peer w-full h-14 px-3 pt-5 pb-1 pr-10',
	'text-base text-foreground appearance-none',
	borderClass,
	focusClass,
	disabledClass,
].join(' ');

/**
 * @constant {string} FLOATING_LABEL_CLASSES
 * Animated floating label classes for single-line inputs.
 *
 * Default state = "floated" (small text at the top).
 * When the input shows its placeholder (empty) AND is not focused,
 * the label drops to the center and grows to base size.
 */
const FLOATING_LABEL_CLASSES = [
	'absolute left-3',
	'text-foreground-secondary',
	'transition-all duration-200',
	'pointer-events-none select-none',
	// Floated state (default — input has a value or is focused)
	'top-2 text-xs',
	// Centered / placeholder state (empty + not focused)
	'peer-[:placeholder-shown:not(:focus)]:top-1/2',
	'peer-[:placeholder-shown:not(:focus)]:-translate-y-1/2',
	'peer-[:placeholder-shown:not(:focus)]:text-base',
].join(' ');

/**
 * @constant {string} FLOATING_TEXTAREA_LABEL_CLASSES
 * Animated floating label classes for textareas.
 * Same behaviour as input labels but positioned for multi-line height.
 */
const FLOATING_TEXTAREA_LABEL_CLASSES = [
	'absolute left-3',
	'text-foreground-secondary',
	'transition-all duration-200',
	'pointer-events-none select-none',
	// Floated state
	'top-1 text-xs',
	// Placeholder state (empty + not focused)
	'peer-[:placeholder-shown:not(:focus)]:top-3.5',
	'peer-[:placeholder-shown:not(:focus)]:text-base',
].join(' ');

/**
 * @constant {string} ALWAYS_FLOATED_LABEL_CLASSES
 * Label that always stays in the floated position (used for select).
 */
const ALWAYS_FLOATED_LABEL_CLASSES = [
	'absolute left-3 top-2',
	'text-xs text-foreground-secondary',
	'pointer-events-none select-none',
].join(' ');

// ---- Helpers ----

/**
 * Counter for generating unique IDs when none is provided.
 * @type {number}
 */
let floatingIdCounter = 0;

/**
 * Returns an existing ID from props or generates a unique one.
 *
 * @param {object} props Component props.
 * @returns {string} A unique ID string.
 */
const getFloatingId = (props) =>
	props.id || props.name || `floating-${++floatingIdCounter}`;

/**
 * Creates a label element with optional required asterisk.
 *
 * @param {string} label Label text.
 * @param {boolean} required Whether to append a red asterisk.
 * @param {string} id The associated input's ID.
 * @param {string} classes CSS classes for the label.
 * @returns {object|null} A Label element, or null if label is falsy.
 */
const createFloatingLabel = (label, required, id, classes) =>
{
	if (!label) return null;

	return Label(
		{ htmlFor: id, class: classes },
		required
			? [Span(label), Span({ class: 'text-destructive ml-0.5' }, '*')]
			: label
	);
};

/**
 * Dropdown arrow indicator for floating selects.
 *
 * @returns {object} An absolutely-positioned chevron icon.
 */
const SelectArrow = () =>
	MaterialIcon({
		name: 'expand_more',
		size: 'xs',
		class: 'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-secondary',
	});

// ---- Floating Input ----

/**
 * A large input with an animated floating label.
 * Designed for prominent forms: onboarding, login, settings, etc.
 *
 * The label sits inside the input as a placeholder and floats to the
 * top-left corner when the input is focused or has a value.
 *
 * @param {object} props
 * @param {string} props.label - Display text for the floating label.
 * @param {string} [props.id] - Input ID (auto-generated if omitted).
 * @param {string} [props.name] - Input name (used as fallback ID).
 * @param {boolean} [props.required] - Appends a red asterisk to the label.
 * @param {string} [props.type] - Input type (text, email, tel, etc.).
 * @param {string} [props.bind] - Two-way data binding path.
 * @param {string} [props.class] - Extra CSS classes for the input element.
 * @returns {object} A container Div with the floating-label input.
 */
export const FloatingInput = Atom((props) =>
{
	const id = getFloatingId(props);

	return Div({ class: 'flex relative min-w-0' }, [
		BaseInput({
			...props,
			id,
			placeholder: ' ',
			class: `${FLOATING_INPUT_CLASSES} ${props.class || ''}`.trim(),
		}),
		createFloatingLabel(props.label, props.required, id, FLOATING_LABEL_CLASSES),
	]);
});

/**
 * Floating label input for telephone numbers.
 * Includes automatic formatting to (XXX) XXX-XXXX.
 *
 * @param {object} props
 * @returns {object} A FloatingInput of type "tel".
 */
export const FloatingTelInput = Atom((props) =>
	FloatingInput({
		...props,
		type: 'tel',
		name: props.name || 'Phone',
		label: props.label || 'Phone',
		pattern: props.pattern || '\\(\\d{3}\\) \\d{3}-\\d{4}',
		keyup: formatPhoneNumber,
	})
);

/**
 * Floating label input for email addresses.
 *
 * @param {object} props
 * @returns {object} A FloatingInput of type "email".
 */
export const FloatingEmailInput = Atom((props) =>
	FloatingInput({
		...props,
		type: 'email',
		name: props.name || 'Email',
		label: props.label || 'Email',
	})
);

/**
 * Floating label input for passwords.
 *
 * @param {object} props
 * @returns {object} A FloatingInput of type "password".
 */
export const FloatingPasswordInput = Atom((props) =>
	FloatingInput({
		...props,
		type: 'password',
		name: props.name || 'Password',
		label: props.label || 'Password',
	})
);

/**
 * Floating label input for numbers.
 *
 * @param {object} props
 * @returns {object} A FloatingInput of type "number".
 */
export const FloatingNumberInput = Atom((props) =>
	FloatingInput({
		...props,
		type: 'number',
	})
);

/**
 * Floating label input for URLs.
 *
 * @param {object} props
 * @returns {object} A FloatingInput of type "url".
 */
export const FloatingUrlInput = Atom((props) =>
	FloatingInput({
		...props,
		type: 'url',
		name: props.name || 'Url',
		label: props.label || 'URL',
	})
);

// ---- Floating Textarea ----

/**
 * A textarea with an animated floating label.
 * Same visual language as FloatingInput but for multi-line text.
 *
 * @param {object} props
 * @param {string} props.label - Display text for the floating label.
 * @param {string} [props.id] - Textarea ID (auto-generated if omitted).
 * @param {string} [props.name] - Textarea name (used as fallback ID).
 * @param {boolean} [props.required] - Appends a red asterisk to the label.
 * @param {string} [props.bind] - Two-way data binding path.
 * @param {string} [props.class] - Extra CSS classes for the textarea.
 * @returns {object} A container Div with the floating-label textarea.
 */
export const FloatingTextarea = Atom((props) =>
{
	const id = getFloatingId(props);

	return Div({ class: 'flex relative min-w-0' }, [
		BaseTextarea({
			...props,
			id,
			placeholder: ' ',
			class: `${FLOATING_TEXTAREA_CLASSES} ${props.class || ''}`.trim(),
		}),
		createFloatingLabel(props.label, props.required, id, FLOATING_TEXTAREA_LABEL_CLASSES),
	]);
});

// ---- Floating Select ----

/**
 * A select dropdown with a floating label and custom arrow.
 * The label always remains in the floated (small) position since
 * a select always displays a value.
 *
 * @param {object} props
 * @param {string} props.label - Display text for the floating label.
 * @param {Array} [props.options] - Array of options passed to Html.setupSelectOptions.
 * @param {string} [props.id] - Select ID (auto-generated if omitted).
 * @param {string} [props.name] - Select name (used as fallback ID).
 * @param {boolean} [props.required] - Appends a red asterisk to the label.
 * @param {string} [props.bind] - Two-way data binding path.
 * @param {string} [props.class] - Extra CSS classes for the select.
 * @returns {object} A container Div with the floating-label select.
 */
export const FloatingSelect = Atom((props) =>
{
	const id = getFloatingId(props);
	const { options, onCreated: userOnCreated, ...attrs } = props;

	return Div({ class: 'flex relative min-w-0' }, [
		{
			tag: 'select',
			...attrs,
			id,
			class: `[&>option]:text-foreground [&>option]:bg-background ${FLOATING_SELECT_CLASSES} ${attrs.class || ''}`.trim(),
			onCreated(ele)
			{
				if (options)
				{
					Html.setupSelectOptions(ele, options);
				}

				if (typeof userOnCreated === 'function')
				{
					userOnCreated(ele);
				}
			},
		},
		SelectArrow(),
		createFloatingLabel(props.label, props.required, id, ALWAYS_FLOATED_LABEL_CLASSES),
	]);
});
