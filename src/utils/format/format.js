import { DateTime } from "@base-framework/base";

/**
 * Creates a watcher callback.
 *
 * @param {string|object|array} watcher
 * @param {function} callBack
 * @returns {array|object}
 */
export const createWatcherCallback = (watcher, callBack) =>
{
	if (typeof watcher === 'string')
	{
		watcher = [watcher];
	}

	if (Array.isArray(watcher))
	{
		watcher.push(callBack);
		return watcher;
	}

	return {
		...watcher,
		callBack
	};
};

/**
 * Returns a default value if the value is undefined or null.
 *
 * @param {*} value - The value to check.
 * @param {*} defaultValue - The default value if value is undefined or null.
 * @returns {*} - The original value or the default.
 */
const defaultValueCallBack = (value, defaultValue = '') =>
{
	return (value !== undefined && value !== null && value !== '') ? value : defaultValue;
};

/**
 * Format utility functions.
 *
 * @module Format
 */
export const Format =
{
	/**
	 * Formats a number with commas.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {string|null} defaultValue - Value if original is null or undefined.
	 * @returns {object|array}
	 */
	number(watcher, defaultValue = null)
	{
		const callBack = (value) =>
		{
			if (!isNaN(value))
			{
				const pattern = /\B(?=(\d{3})+(?!\d))/g;
				return value.toString().replace(pattern, ',');
			}

			return defaultValue || '';
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats a boolean value as a yes/no string.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {string} yes - Text for true values.
	 * @param {string} no - Text for false values.
	 * @returns {object|array}
	 */
	yesno(watcher, yes = 'Yes', no = 'No')
	{
		const callBack = (value) =>
		{
			return value ? yes : no;
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats a value as money with two decimals.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {string} currency - Currency symbol.
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	money(watcher, currency = '$', defaultValue = null)
	{
		const callBack = (value) =>
		{
			const numeric = parseFloat(value);
			if (isNaN(numeric))
			{
				return currency + defaultValue || '';
			}

			const pattern = /\B(?=(\d{3})+(?!\d))/g;
			return currency + numeric.toFixed(2).toString().replace(pattern, ',');
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats a value as a US phone number (10 digits).
	 *
	 * @param {string|object|array} watcher
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	phone(watcher, defaultValue = null)
	{
		const callBack = (value) =>
		{
			value = value || '';
			const digits = String(value.toString()).replace(/\D/g, '');
			if (digits.length === 10)
			{
				return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
			}
			return (value)? value : defaultValue;
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats a value as an integer (rounds down).
	 *
	 * @param {string|number|object|array} watcher
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	integer(watcher, defaultValue = null)
	{
		const callBack = (value) =>
		{
			value = defaultValueCallBack(value, defaultValue);
			const intVal = parseInt(value, 10);
			return isNaN(intVal) ? defaultValue : intVal.toString();
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats a date value to a standard date format.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	date(watcher, defaultValue = null)
	{
		const callBack = (value) =>
		{
			return (value)? DateTime.format('standard', value) : (defaultValue || '');
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats a date and time value to a standard date and time format.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	dateTime(watcher, defaultValue = null)
	{
		const callBack = (value) =>
		{
			return (value)? DateTime.format('standard', value) + ' ' + DateTime.formatTime(value, 12) : (defaultValue || '');
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats a time value to a standard time format.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	time(watcher, defaultValue = null)
	{
		const callBack = (value) =>
		{
			return (value)? DateTime.formatTime(value, 12) : (defaultValue || '');
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats a value with a default value if null or undefined.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {string|null} defaultValue - Value if original is null or undefined.
	 * @returns {object|array}
	 */
	default(watcher, defaultValue = null)
	{
		const callBack = (value) =>  defaultValueCallBack(value, defaultValue);
		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats a number as a percentage.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {number} decimals - Number of decimal places (default: 0).
	 * @param {boolean} isDecimal - Whether input is decimal (0.85) or whole number (85).
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	percentage(watcher, decimals = 0, isDecimal = false, defaultValue = null)
	{
		const callBack = (value) =>
		{
			const numeric = parseFloat(value);
			if (isNaN(numeric))
			{
				return defaultValue || '';
			}

			const percentage = isDecimal ? numeric * 100 : numeric;
			return percentage.toFixed(decimals) + '%';
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Capitalizes the first letter of each word.
	 *
	 * @param {string|object|array} watcher
	 * @param {boolean} allWords - Capitalize all words (true) or just first word (false).
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	capitalize(watcher, allWords = true, defaultValue = null)
	{
		const callBack = (value) =>
		{
			if (!value)
			{
				return defaultValue || '';
			}

			const str = String(value);
			if (allWords)
			{
				return str.replace(/\b\w/g, char => char.toUpperCase());
			}

			return str.charAt(0).toUpperCase() + str.slice(1);
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Converts a string to uppercase.
	 *
	 * @param {string|object|array} watcher
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	uppercase(watcher, defaultValue = null)
	{
		const callBack = (value) =>
		{
			return value ? String(value).toUpperCase() : (defaultValue || '');
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Converts a string to lowercase.
	 *
	 * @param {string|object|array} watcher
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	lowercase(watcher, defaultValue = null)
	{
		const callBack = (value) =>
		{
			return value ? String(value).toLowerCase() : (defaultValue || '');
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Truncates a string to a maximum length with ellipsis.
	 *
	 * @param {string|object|array} watcher
	 * @param {number} maxLength - Maximum length before truncation.
	 * @param {string} suffix - Suffix to append (default: '...').
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	truncate(watcher, maxLength = 50, suffix = '...', defaultValue = null)
	{
		const callBack = (value) =>
		{
			if (!value)
			{
				return defaultValue || '';
			}

			const str = String(value);
			if (str.length <= maxLength)
			{
				return str;
			}

			return str.slice(0, maxLength - suffix.length) + suffix;
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Formats bytes to a human-readable file size.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {number} decimals - Number of decimal places (default: 2).
	 * @param {*} defaultValue - Value if original is invalid.
	 * @returns {object|array}
	 */
	fileSize(watcher, decimals = 2, defaultValue = null)
	{
		const callBack = (value) =>
		{
			const bytes = parseFloat(value);
			if (isNaN(bytes) || bytes < 0)
			{
				return defaultValue || '';
			}

			if (bytes === 0)
			{
				return '0 Bytes';
			}

			const k = 1024;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));

			return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
		};

		return createWatcherCallback(watcher, callBack);
	},

	/**
	 * Handles pluralization of words based on count.
	 *
	 * @param {string|number|object|array} watcher
	 * @param {string} singular - Singular form of the word.
	 * @param {string} plural - Plural form of the word (optional, adds 's' by default).
	 * @param {boolean} includeCount - Whether to include the count in output.
	 * @returns {object|array}
	 */
	plural(watcher, singular, plural = null, includeCount = true)
	{
		const callBack = (value) =>
		{
			const count = parseInt(value, 10);
			if (isNaN(count))
			{
				return '';
			}

			const word = count === 1 ? singular : (plural || singular + 's');
			return includeCount ? `${count} ${word}` : word;
		};

		return createWatcherCallback(watcher, callBack);
	}
};