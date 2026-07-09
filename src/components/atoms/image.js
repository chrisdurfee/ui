import { Img } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';

/**
 * Image
 *
 * Creates an image element, hiding it on error.
 *
 * @param {object} props
 * @returns {object}
 */
// @ts-ignore
export const Image = Atom(({ src, alt, class: className, checkPath = true, loading = 'lazy', decoding = 'async', fetchPriority = 'auto' }) =>
{
	if (!src)
	{
		return null;
	}

	className = className || '';

	/**
	 * If we are not watching and the url doesn't look
	 * like a path, skip rendering the image.
	 */
	if (checkPath && src.indexOf('.') === -1 && src.indexOf('[[') === -1)
	{
		return null;
	}

	return Img({
		class: `absolute w-full h-full object-cover opacity-0 ${className}`,
		src,
		alt,
		loading,
		decoding,
		fetchPriority,

		/**
		 * Defer the fadeIn animation until the image is actually loaded
		 * to avoid running animations on lazy images that haven't loaded
		 * yet (and to reduce the number of concurrent animations on screen).
		 */
		load: (event) =>
		{
			event.target.classList.remove('opacity-0');
			event.target.classList.add('fadeIn');
			event.target.style.visibility = 'visible';
		},

		/**
		 * If there's an error loading the image, hide it.
		 */
		error: (event) => event.target.style.visibility = 'hidden'
	});
});
