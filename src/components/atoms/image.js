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
export const Image = Atom(({ src, alt, class: className }) =>
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
	if (src.indexOf('.') === -1 && src.indexOf('[[') === -1)
	{
		return null;
	}

	return Img({
		class: `absolute w-full h-full rounded-full object-cover fadeIn ${className}`,
		src,
		alt,

		load: (event) => event.target.style.visibility = 'visible',

		/**
		 * If there's an error loading the image, hide it.
		 */
		error: (event) => event.target.style.visibility = 'hidden'
	});
});