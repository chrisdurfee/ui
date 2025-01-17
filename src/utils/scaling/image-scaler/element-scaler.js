
/**
 * ElementScaler
 *
 * Handles scaling and positioning of a DOM element within its container.
 *
 * @class
 */
export class ElementScaler
{
	/**
	 * Creates an instance of ElementScaler.
	 *
	 * @constructor
	 * @param {HTMLElement} element - The DOM element to scale.
	 */
	constructor(element)
	{
		/** @type {HTMLElement} */
		this.element = element;

		/** @type {DOMRect|null} */
		this.elementBoundingBox = null;

		/** @type {HTMLElement|null} */
		// @ts-ignore
		this.container = element.parentNode;

		/** @type {{width: number, height: number, top: number, left: number}} */
		this.containerSize =
		{
			width: 0,
			height: 0,
			top: 0,
			left: 0
		};

		this.setup();
	}

	/**
	 * Initializes the scaling behavior by removing margins
	 * and triggering a resize check.
	 *
	 * @returns {void}
	 */
	setup()
	{
		this.removeMargin();
		this.resize();
	}

	/**
	 * Removes all margin from the element (top/right/bottom/left).
	 *
	 * @returns {void}
	 */
	removeMargin()
	{
		this.element.style.margin = "0px 0px 0px 0px";
	}

	/**
	 * Gets the current bounding box of the element.
	 *
	 * @returns {DOMRect|null} The bounding box or null if not set.
	 */
	getSize()
	{
		return this.elementBoundingBox;
	}

	/**
	 * Calculates and caches the bounding client rect for the element.
	 *
	 * @returns {void}
	 */
	setBoundingBox()
	{
		this.elementBoundingBox = this.element.getBoundingClientRect();
	}

	/**
	 * Applies translation and scaling (width/height) to the element.
	 *
	 * @param {number} x - The horizontal position (left).
	 * @param {number} y - The vertical position (top).
	 * @param {number} scale - Scale factor (e.g., 1.0 = 100%, 0.5 = 50%).
	 * @returns {{width: number, height: number}} The new width and height after scaling.
	 */
	transform(x, y, scale)
	{
		const element = this.element;
		const eleStyle = element.style;

		// Position
		eleStyle.top = y + "px";
		eleStyle.left = x + "px";

		// Scale
		// @ts-ignore
		const width = element.naturalWidth * scale;
		// @ts-ignore
		const height = element.naturalHeight * scale;

		eleStyle.width = width + "px";
		eleStyle.height = height + "px";

		return { width, height };
		// Alternative transform approach (commented out):
		// eleStyle.transform = `translate(${x}px, ${y}px) scale(${scale})`;
	}

	/**
	 * Updates internal bounding boxes for both the element and its container.
	 *
	 * @returns {void}
	 */
	resize()
	{
		this.setBoundingBox();
		this.containerSize = this.container.getBoundingClientRect();
	}
}
