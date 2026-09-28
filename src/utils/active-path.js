/**
 * Cache of compiled active path patterns keyed by path.
 *
 * @type {Map<string, RegExp>}
 */
const pathRegexCache = new Map();

/**
 * This will escape the regex characters in a string.
 *
 * @param {string} value
 * @returns {string}
 */
export const escapeRegExp = (value) =>
{
	return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * This will get the compiled pattern for a path.
 *
 * The pattern is anchored to the start of the url and only
 * matches when the path is followed by the end of the url,
 * a slash, a dot, a query string or a hash.
 *
 * @param {string} path
 * @returns {RegExp}
 */
const getPathPattern = (path) =>
{
	let pattern = pathRegexCache.get(path);
	if (pattern)
	{
		return pattern;
	}

	/**
	 * A trailing slash is ignored so "/users/" matches "/users/5".
	 */
	const normalized = (path.length > 1 && path.endsWith('/')) ? path.slice(0, -1) : path;
	pattern = new RegExp(`^${escapeRegExp(normalized)}($|[/.?#])`);
	pathRegexCache.set(path, pattern);
	return pattern;
};

/**
 * This will validate if a path is active for a url.
 *
 * "/users" matches "/users", "/users/5", "/users?page=2"
 * but not "/admin/users" or "/users-archive".
 *
 * @param {string} path
 * @param {string} url
 * @returns {boolean}
 */
export const isPathActive = (path, url) =>
{
	if (typeof path !== 'string' || path === '' || typeof url !== 'string')
	{
		return false;
	}

	return getPathPattern(path).test(url);
};

export default isPathActive;
