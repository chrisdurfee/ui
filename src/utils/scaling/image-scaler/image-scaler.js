import { ElementScaler } from "./element-scaler.js";
import { EventController } from "./event-controller.js";

/**
 * ImageScaler
 *
 * Handles scaling, panning, and zooming for an image using ElementScaler.
 *
 * @class
 */
export class ImageScaler
{
    /**
     * Creates an instance of ImageScaler.
     *
     * @constructor
     * @param {HTMLImageElement} element - The image element to scale.
     */
    constructor(element)
    {
        /** @type {ElementScaler} */
        this.elementScaler = new ElementScaler(element);

        /** @type {number} */
        this.scale = this.getImageScale(element);

        /** @type {boolean} */
        this.panning = false;

        /** @type {EventController|null} */
        this.events = null;

        /** @type {{x: number, y: number}} */
        this.start = { x: 0, y: 0 };

        /** @type {{x: number, y: number}} */
        this.delta = { x: 0, y: 0 };

        this.setup();
    }

    /**
     * Initializes event handling and centers the image.
     *
     * @returns {void}
     */
    setup()
    {
        this.setupEvents();
        this.center();
    }

    /**
     * Removes all event bindings.
     *
     * @returns {void}
     */
    remove()
    {
        this.events.remove();
    }

    /**
     * Invokes a method on this class by name, passing event/data.
     *
     * @param {string} action - The method name to call.
     * @param {Event} e - The associated event object.
     * @param {*} [data] - Additional data passed to the method.
     * @returns {void}
     */
    callAction(action, e, data)
    {
        this[action](e, data);
    }

    /**
     * Sets up the event controller for the image.
     *
     * @returns {void}
     */
    setupEvents()
    {
        this.events = new EventController(this, this.elementScaler.element);
    }

    /**
     * Calculates an initial scale based on the element's offsetWidth vs. naturalWidth.
     *
     * @param {HTMLImageElement} element - The image element.
     * @returns {number} The initial scale factor.
     */
    getImageScale(element)
    {
        return element.offsetWidth / element.naturalWidth;
    }

    /**
     * Gets the offset position of the pointer, adjusted by scale and delta.
     *
     * @param {Event} e - The associated event object.
     * @returns {{x: number, y: number}} The pointer offset without scale.
     */
    getOffset(e)
    {
        const scale = this.scale;
        const delta = this.delta;

        const position = this.getPointerPosition();
        // Remove the scale so we have the native offset
        return {
            x: (position.x - delta.x) / scale,
            y: (position.y - delta.y) / scale
        };
    }

    /**
     * Transforms the element (x, y, scale) and then re-centers it if needed.
     *
     * @param {number} x - The new left offset.
     * @param {number} y - The new top offset.
     * @param {number} scale - The scale factor.
     * @returns {void}
     */
    scaleElement(x, y, scale)
    {
        const size = this.elementScaler.transform(x, y, scale);
        this.center(size.width, size.height);
    }

    /**
     * Attempts to center the scaled element within its container, respecting boundaries.
     *
     * @param {number} [width] - Width of the scaled element.
     * @param {number} [height] - Height of the scaled element.
     * @returns {void}
     */
    center(width, height)
    {
        const elementScaler = this.elementScaler;
        const parentSize = elementScaler.containerSize;
        const size = elementScaler.elementBoundingBox;
        const delta = this.delta;

        width = width || size.width;
        height = height || size.height;

        let x, y;

        // Horizontal
        const parentWidth = parentSize.width;
        if (width < parentWidth)
        {
            x = (parentWidth / 2) - (width / 2);
            x = x > 0 ? x : 0;
        }
        else
        {
            x = delta.x;
            const rightBorder = width + delta.x;

            if (rightBorder < parentWidth)
            {
                x = rightBorder + (parentWidth - rightBorder) - width;
            }
            const leftBorder = delta.x;
            if (leftBorder > 0)
            {
                x = 0;
            }
        }

        // Vertical
        const parentHeight = parentSize.height;
        if (height < parentHeight)
        {
            y = (parentHeight / 2) - (height / 2);
            y = y > 0 ? y : 0;
        }
        else
        {
            y = delta.y;
            const bottomBorder = height + delta.y;

            if (bottomBorder < parentHeight)
            {
                y = bottomBorder + (parentHeight - bottomBorder) - height;
            }
            const topBorder = delta.y;
            if (topBorder > 0)
            {
                y = 0;
            }
        }

        const eleStyle = elementScaler.element.style;
        eleStyle.left = x + "px";
        eleStyle.top = y + "px";

        this.delta = { x, y };
    }

    /** @type {number} Minimum allowed scale factor. */
    minScale = 0.2;

    /**
     * Updates the current scale (zoom) value based on scroll delta.
     *
     * @param {number} delta - Positive = zoom in, negative = zoom out.
     * @returns {number} The updated scale factor.
     */
    updateScale(delta)
    {
        let scale = this.scale;

        if (delta !== 0)
        {
            // 1.05 scale factor steps
            scale = (delta > 0) ? (this.scale *= 1.05) : (this.scale /= 1.05);
        }

        // Limit the smallest size so the image does not disappear
        if (scale <= this.minScale)
        {
            this.scale = this.minScale;
        }
        return this.scale;
    }

    /**
     * Returns the pointer position relative to the container.
     *
     * @returns {{x: number, y: number}} The pointer coordinates.
     */
    getPointerPosition()
    {
        const containerSize = this.elementScaler.containerSize;
        const position = this.events.pointer;
        return {
            x: position.x - containerSize.left,
            y: position.y - containerSize.top
        };
    }

    /**
     * Called when the user presses down on the pointer (mouse/touch).
     *
     * @param {Event} e - The associated event object.
     * @returns {void}
     */
    pointerDown(e)
    {
        const delta = this.delta;
        const position = this.getPointerPosition();
        this.start = {
            x: position.x - delta.x,
            y: position.y - delta.y
        };
        this.panning = true;
    }

    /**
     * Called when the user moves the pointer (mouse/touch).
     *
     * @param {Event} e - The associated event object.
     * @returns {void}
     */
    pointerMove(e)
    {
        e.preventDefault();
        if (!this.panning)
        {
            return;
        }

        const position = this.getPointerPosition();
        const delta = this.delta;
        const start = this.start;

        delta.x = position.x - start.x;
        delta.y = position.y - start.y;

        this.scaleElement(delta.x, delta.y, this.scale);
    }

    /**
     * Called when the user releases the pointer (mouse/touch).
     *
     * @param {Event} e - The associated event object.
     * @returns {void}
     */
    pointerUp(e)
    {
        this.panning = false;
    }

    /**
     * Recalculates container/element bounding sizes, e.g., on window resize.
     *
     * @returns {void}
     */
    resize()
    {
        this.elementScaler.resize();
    }

    /**
     * Called on pinch gesture (usually from a wheel or multi-touch).
     *
     * @param {Event} e - The associated event.
     * @param {number} delta - Positive = zoom in, negative = zoom out.
     * @returns {void}
     */
    pinch(e, delta)
    {
        const offset = this.getOffset(e);
        e.preventDefault();

        const scale = this.updateScale(delta);
        const position = this.getPointerPosition();

        // Recalculate offsets after updating scale
        const d = this.delta;
        d.x = position.x - offset.x * scale;
        d.y = position.y - offset.y * scale;

        this.scaleElement(d.x, d.y, scale);
    }
}
