import {
    Checkbox as BaseCheckbox,
    Input as BaseInput,
    Textarea as BaseTextarea,
    Div,
    Label,
} from '@base-framework/atoms';
import { Atom } from '@base-framework/base';
import { commonInputClasses, disabledClass, focusClass, placeholderClass } from './input-classes.js';

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

/**
 * A basic Input atom that reuses common classes.
 *
 * @param {object} props Props passed to the BaseInput.
 * @returns {object} A BaseInput element with common classes.
 */
export const Input = Atom((props) => (
    BaseInput({
		...props,
		class: `${commonInputClasses} ${props.class || ''}`.trim(),
	})
));

/**
 * Input component specifically for telephone numbers.
 *
 * @param {object} props Props passed to the Input.
 * @returns {object} An Input element of type "tel" with phone formatting.
 */
export const TelInput = Atom((props) => (
    Input({
		...props,
		type: "tel",
		name: props.name || "Phone",
		label: props.label || "Phone",
		placeholder: "(555) 555-5555",
		required: true,
		pattern: props.pattern || "\\(\\d{3}\\) \\d{3}-\\d{4}",
		keyup: formatPhoneNumber,
	})
));

/**
 * Input component specifically for email addresses.
 *
 * @param {object} props Props passed to the Input.
 * @returns {object} An Input element of type "email".
 */
export const EmailInput = Atom((props) => (
    Input({
		...props,
		type: "email",
		name: props.name || "Email",
		label: props.label || "Email",
		placeholder: "Email address",
	})
));

/**
 * Textarea component reusing parts of the common classes.
 *
 * @param {object} props Props passed to the BaseTextarea.
 * @returns {object} A BaseTextarea element.
 */
export const Textarea = Atom((props) => (
    BaseTextarea({
		...props,
		as: "textarea",
		class: `flex w-full h-24 px-3 py-2 text-sm rounded-md border border-input bg-background ${focusClass} ${placeholderClass} ${disabledClass} ${props.class || ''}`.trim(),
	})
));

/**
 * Radio input component.
 *
 * @param {object} [props={}] Props passed to the BaseInput.
 * @returns {object} A Div containing a radio input and label.
 */
export const Radio = (props = {}) => (
    Div({ class: 'flex items-center space-x-2' }, [
		BaseInput({
			...props,
			type: 'radio',
			class: `cursor-pointer appearance-none h-4 w-4 border rounded-full checked:border-primary checked:bg-primary focus:ring focus:ring-primary`.trim(),
		}),
		props.label && Label({ forHTML: props.value, class: 'cursor-pointer' }, props.label),
	])
);

/**
 * Input component specifically for dates.
 *
 * @param {object} props Props passed to the BaseInput.
 * @returns {object} A BaseInput element of type "date".
 */
export const DateInput = Atom((props) => (
    BaseInput({
		...props,
		type: "date",
		class: `rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.class || ''}`.trim(),
	})
));

/**
 * Input component specifically for times.
 *
 * @param {object} props Props passed to the BaseInput.
 * @returns {object} A BaseInput element of type "time".
 */
export const TimeInput = Atom((props) => (
    BaseInput({
		...props,
		type: "time",
		class: `rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.class || ''}`.trim(),
	})
));

/**
 * Input component specifically for datetime-local.
 *
 * @param {object} props Props passed to the BaseInput.
 * @returns {object} A BaseInput element of type "datetime-local".
 */
export const DateTimeInput = Atom((props) => (
    BaseInput({
		...props,
		type: "datetime-local",
		class: `rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.class || ''}`.trim(),
	})
));

/**
 * Input component specifically for months.
 *
 * @param {object} props Props passed to the BaseInput.
 * @returns {object} A BaseInput element of type "month".
 */
export const MonthInput = Atom((props) => (
    BaseInput({
		...props,
		type: "month",
		class: `rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.class || ''}`.trim(),
	})
));

/**
 * Input component specifically for weeks.
 *
 * @param {object} props Props passed to the BaseInput.
 * @returns {object} A BaseInput element of type "week".
 */
export const WeekInput = Atom((props) => (
    BaseInput({
		...props,
		type: "week",
		class: `rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.class || ''}`.trim(),
	})
));

/**
 * Input component specifically for numbers.
 *
 * @param {object} props Props passed to the Input.
 * @returns {object} An Input element of type "number".
 */
export const NumberInput = Atom((props) => (
    Input({
		...props,
		type: "number",
	})
));

/**
 * Input component specifically for passwords.
 *
 * @param {object} props Props passed to the Input.
 * @returns {object} An Input element of type "password".
 */
export const PasswordInput = Atom((props) => (
    Input({
		...props,
		type: "password",
	})
));

/**
 * Input component specifically for search.
 *
 * @param {object} props Props passed to the Input.
 * @returns {object} An Input element of type "search".
 */
export const SearchInput = Atom((props) => (
    Input({
		...props,
		type: "search",
	})
));

/**
 * Input component specifically for URLs.
 *
 * @param {object} props Props passed to the Input.
 * @returns {object} An Input element of type "url".
 */
export const UrlInput = Atom((props) => (
    Input({
		...props,
		type: "url",
	})
));

/**
 * Input component specifically for hidden fields.
 *
 * @param {object} props Props passed to the Input.
 * @returns {object} An Input element of type "hidden".
 */
export const HiddenInput = Atom((props) => (
    Input({
		...props,
		type: "hidden",
	})
));

/**
 * Input component specifically for color pickers.
 *
 * @param {object} props Props passed to the BaseInput.
 * @returns {object} A BaseInput element of type "color".
 */
export const ColorInput = Atom((props) => (
    BaseInput({
		...props,
		type: "color",
		class: `border rounded-md border-input bg-background text-foreground p-0 disabled:cursor-not-allowed disabled:opacity-50 ${props.class || ''}`.trim(),
	})
));

/**
 * Checkbox input component.
 *
 * @param {object} props Props passed to the BaseCheckbox.
 * @returns {object} A BaseCheckbox element.
 */
const Checkbox = Atom((props) => (
    BaseCheckbox({
		...props,
		class: `flex h-4 w-4 rounded-md border border-input bg-background text-foreground ${focusClass} ${disabledClass} ${props.class || ''}`.trim(),
	})
));

/**
 * @constant {string} fileExtraClasses
 * Extra classes specific to file inputs (file:* classes).
 */
const fileExtraClasses = "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground";

/**
 * Input component specifically for file uploads.
 *
 * @param {object} props Props passed to the BaseInput.
 * @returns {object} A BaseInput element of type "file".
 */
export const FileInput = Atom((props) => (
    BaseInput({
		...props,
		type: "file",
		class: `${commonInputClasses} ${fileExtraClasses} ${props.class || ''}`.trim(),
	})
));