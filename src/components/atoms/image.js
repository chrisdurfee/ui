import { Img } from '@base-framework/atoms';
import { Atom } from '@base-framework/base';

/**
 * Image
 *
 * Creates an image element, hiding it on error.
 *
 * @param {object} props
 * @param {string} props.src
 * @param {string} [props.alt] - Defaults to "" so the attribute is always present.
 * @param {string} [props.class]
 * @param {boolean} [props.checkPath]
 * @param {string} [props.loading]
 * @param {string} [props.decoding]
 * @param {string} [props.fetchPriority]
 * @param {string} [props.srcset] - Responsive image candidates, e.g. "small.webp 320w, large.webp 800w".
 * @param {string} [props.sizes] - Slot-width hints for the browser, e.g. "(min-width: 768px) 280px, 100vw".
 * @param {string|number} [props.width] - Intrinsic width, used to prevent layout shift.
 * @param {string|number} [props.height] - Intrinsic height, used to prevent layout shift.
 * @param {string} [props.aspect] - Aspect ratio to reserve space, e.g. "16/9" (sets style aspect-ratio).
 * @param {boolean} [props.fade] - Set to false to never run the fade in.
 * @returns {object}
 */
/**
 * The max number of loaded srcs to remember.
 *
 * @type {number}
 */
const LOADED_LIMIT = 500;

/**
 * Srcs that have already loaded. Images that were loaded before
 * render visible immediately so rebuilt pages don't flash.
 *
 * @type {Set<string>}
 */
const loadedSrcs = new Set();

/**
 * This will remember a loaded src, dropping the oldest when full.
 *
 * @param {string} src
 * @returns {void}
 */
export const rememberLoadedSrc = (src) =>
{
	if (!src)
	{
		return;
	}

	/**
	 * Re-adding moves the src to the end so the set stays in
	 * least-recently-used order.
	 */
	loadedSrcs.delete(src);
	loadedSrcs.add(src);

	if (loadedSrcs.size > LOADED_LIMIT)
	{
		const oldest = loadedSrcs.values().next().value;
		loadedSrcs.delete(oldest);
	}
};

/**
 * This will check if a src has loaded before.
 *
 * @param {string} src
 * @returns {boolean}
 */
export const hasLoadedSrc = (src) => loadedSrcs.has(src);

/**
 * This will clear the loaded src cache.
 *
 * @returns {void}
 */
export const clearLoadedSrcs = () => loadedSrcs.clear();

/**
 * This will make the image visible without animating.
 *
 * @param {HTMLElement} ele
 * @returns {void}
 */
const showImage = (ele) =>
{
	ele.classList.remove('opacity-0');
	ele.style.visibility = 'visible';
};

/**
 * This will build the inline style with the aspect ratio.
 *
 * @param {string|undefined} style
 * @param {string|undefined} aspect
 * @returns {string|undefined}
 */
const getStyle = (style, aspect) =>
{
	if (!aspect)
	{
		return style;
	}

	const ratio = `aspect-ratio: ${aspect};`;
	return style ? `${ratio} ${style}` : ratio;
};

// @ts-ignore
export const Image = Atom(({
	src,
	alt,
	class: className,
	checkPath = true,
	loading = 'lazy',
	decoding = 'async',
	fetchPriority = 'auto',
	srcset,
	sizes,
	width,
	height,
	aspect,
	fade = true,
	style,
	...rest
}) =>
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

	/**
	 * Images that loaded before render visible immediately.
	 */
	const loaded = fade === false || (src.indexOf('[[') === -1 && hasLoadedSrc(src));
	const opacity = loaded ? '' : 'opacity-0 ';

	return Img({
		...rest,
		class: `absolute w-full h-full object-cover ${opacity}${className}`,
		style: getStyle(style, aspect),
		src,
		alt: alt == null ? '' : alt,
		loading,
		decoding,
		fetchPriority,
		srcset,
		sizes,
		width,
		height,

		/**
		 * If the image is already complete (cached by the browser)
		 * when it is created, show it without the fade.
		 */
		onCreated(ele)
		{
			if (ele.complete && ele.naturalWidth > 0)
			{
				rememberLoadedSrc(ele.currentSrc || ele.src);
				rememberLoadedSrc(src);
				showImage(ele);
			}
		},

		/**
		 * Defer the fadeIn animation until the image is actually loaded
		 * to avoid running animations on lazy images that haven't loaded
		 * yet (and to reduce the number of concurrent animations on screen).
		 */
		load: (event) =>
		{
			const ele = event.target;
			const wasHidden = ele.classList.contains('opacity-0');
			rememberLoadedSrc(ele.getAttribute('src'));
			rememberLoadedSrc(ele.currentSrc || ele.src);

			showImage(ele);
			if (wasHidden)
			{
				ele.classList.add('fadeIn');
			}
		},

		/**
		 * If there's an error loading the image, hide it.
		 */
		error: (event) => event.target.style.visibility = 'hidden'
	});
});
