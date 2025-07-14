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
	}``

	return {
		...watcher,
		callBack
	};
};

/**
 * Returns a default value if the value is undefined.
 *
 * @param {*} value - The value to check.
 * @param {*} defaultValue - The default value to return if the value is undefined
 * @return {*} - The value or the default value.
 */
const defaultValueCallBack = (value, defaultValue = '') =>
{
	return (value !== undefined && value !== null ? value : defaultValue);
};

/**
 * Format utility functions.
 *
 * This module provides functions to format data, such as numbers with commas.
 *
 * @module Format
 */
export const Format =
{
	/**
	 * Formats a number with commas.
	 *
	 * @param {string|number} watcher
	 * @param {string} [defaultValue] - The default value to return if the value is undefined.
	 * @returns {object|array}
	 */
	number(watcher, defaultValue = null)
	{
		const callBack = (value) =>
		{
			value = defaultValueCallBack(value, defaultValue);

			const pattern = /\B(?=(\d{3})+(?!\d))/g;
			return value.toString().replace(pattern, ',');
		};

		return createWatcherCallback(watcher, callBack);
	}
};