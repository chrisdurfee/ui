import { base } from "@base-framework/base";

/**
 * EventController
 *
 * Manages pointer and gesture events for a given parent controller and container element.
 *
 * @class
 */
export class EventController
{
	/**
	 * Creates an EventController instance.
	 *
	 * @constructor
	 * @param {object} parent - The parent object (ImageScaler) that handles actions.
	 * @param {HTMLElement} container - The DOM element to attach events to.
	 */
	constructor(parent, container)
	{
		/** @type {object} */
		this.parent = parent;

		/** @type {HTMLElement} */
		this.container = container;

		/** @type {{x: number, y: number, status: string}} */
		this.pointer = { x: 0, y: 0, status: "up" };

		this.setup();
	}

	/**
	 * Initializes event setup.
	 *
	 * @returns {void}
	 */
	setup()
	{
		this.setupEvents();
	}

	/**
	 * Removes all event listeners.
	 *
	 * @returns {void}
	 */
	remove()
	{
		this.removeEvents();
	}

	/**
	 * Creates and binds all required event listeners.
	 *
	 * @returns {void}
	 */
	setupEvents()
	{
		const container = this.container;

		const callBackPos = base.bind(this, this.pointerMove);
		const callBackUp = base.bind(this, this.pointerUp);
		const callBackDown = base.bind(this, this.pointerDown);
		const wheel = base.bind(this, this.wheel);
		const resize = base.bind(this, this.resize);

		// Add all event listeners
		this.addEvents = function()
		{
			// @ts-ignore
			base.on(["mousemove", "touchmove"], container, callBackPos);
			// @ts-ignore
			base.on(["mouseup", "mouseout", "touchend", "touchcancel"], container, callBackUp);
			// @ts-ignore
			base.on(["mousedown", "touchstart"], container, callBackDown);
			// @ts-ignore
			base.onMouseWheel(wheel, container, true);
			// @ts-ignore
			base.on("resize", globalThis, resize);
		};

		// Immediately attach
		this.addEvents();

		// Provide a method to remove these
		this.removeEvents = function()
		{
			// @ts-ignore
			base.off(["mousemove", "touchmove"], container, callBackPos);
			// @ts-ignore
			base.off(["mouseup", "mouseout", "touchend", "touchcancel"], container, callBackUp);
			// @ts-ignore
			base.off(["mousedown", "touchstart"], container, callBackDown);
			// @ts-ignore
			base.offMouseWheel(wheel, container);
			// @ts-ignore
			base.off("resize", globalThis, resize);
		};
	}

	/**
	 * Handles mouse wheel or pinch events.
	 *
	 * @param {number} delta - The wheel direction (positive or negative).
	 * @param {Event} e - The associated event.
	 * @returns {void}
	 */
	wheel(delta, e)
	{
		this.parent.callAction("pinch", e, delta);
	}

	/**
	 * Extracts the position from mouse or touch events and updates `this.pointer`.
	 *
	 * @param {Event} e - The event object.
	 * @returns {void}
	 */
	getEventPosition(e)
	{
		let eX, eY;
		// @ts-ignore
		const touches = e.touches;

		if (touches && touches.length)
		{
			const touch = touches[0];
			eX = touch.clientX;
			eY = touch.clientY;
		}
		else
		{
			// @ts-ignore
			eX = e.clientX;
			// @ts-ignore
			eY = e.clientY;
		}

		this.pointer.x = eX;
		this.pointer.y = eY;
	}

	/**
	 * Called when the pointer goes down (mouse/touch).
	 *
	 * @param {Event} e - The associated event.
	 * @returns {void}
	 */
	pointerDown(e)
	{
		this.getEventPosition(e);
		this.pointer.status = "down";

		if (this.isGesture(e) === false)
		{
			this.parent.callAction("pointerDown", e);
		}
	}

	/**
	 * Called when the pointer is released.
	 *
	 * @param {Event} e - The associated event.
	 * @returns {void}
	 */
	pointerUp(e)
	{
		this.pointer.status = "up";
		this.parent.callAction("pointerUp", e);

		this.pinchTracker.reset();
	}

	/**
	 * Handles window resize actions.
	 *
	 * @returns {void}
	 */
	resize()
	{
		this.parent.resize();
	}

	/**
	 * Tracks and measures distances between touches for pinch gestures.
	 */
	pinchTracker =
	{
		/** @type {number|null} */
		previousDistance: null,

		/** @type {number|null} */
		currentDistance: null,

		/**
		 * Calculates Euclidean distance between two points.
		 *
		 * @param {number} x1
		 * @param {number} y1
		 * @param {number} x2
		 * @param {number} y2
		 * @returns {number}
		 */
		distance(x1, y1, x2, y2)
		{
			return Math.sqrt(
				(x1 - x2) * (x1 - x2) +
				(y1 - y2) * (y1 - y2)
			);
		},

		/**
		 * If currentDistance is set, store it as previousDistance.
		 *
		 * @returns {void}
		 */
		setPreviousDistance()
		{
			if (this.currentDistance !== null)
			{
				this.previousDistance = this.currentDistance;
			}
		},

		/**
		 * Sets the current distance between two touch points.
		 *
		 * @param {object} touch1
		 * @param {object} touch2
		 * @returns {void}
		 */
		setCurrentDistance(touch1, touch2)
		{
			this.currentDistance = this.distance(touch1.x, touch1.y, touch2.x, touch2.y);
		},

		/**
		 * Updates currentDistance and keeps track of the previous distance.
		 *
		 * @param {object} touch1
		 * @param {object} touch2
		 * @returns {number} The updated current distance.
		 */
		updateCurrentDistance(touch1, touch2)
		{
			this.setPreviousDistance();
			this.setCurrentDistance(touch1, touch2);
			return this.currentDistance;
		},

		/**
		 * Determines the scale direction (zoom in/out) based on distance changes.
		 *
		 * @param {object} touch1
		 * @param {object} touch2
		 * @returns {number} 1 for zoom in, -1 for zoom out, 0 if below threshold.
		 */
		getScale(touch1, touch2)
		{
			let scale = 0;
			const currentDistance = this.updateCurrentDistance(touch1, touch2);
			const previousDistance = this.previousDistance;

			if (previousDistance === null)
			{
				return scale;
			}

			const threshold = 2;
			const distance = Math.abs(currentDistance - previousDistance);

			if (distance < threshold)
			{
				return scale;
			}

			if (currentDistance > previousDistance)
			{
				scale = 1;
			}
			else if (currentDistance < previousDistance)
			{
				scale = -1;
			}

			return scale;
		},

		/**
		 * Resets the distance measurements.
		 *
		 * @returns {void}
		 */
		reset()
		{
			this.previousDistance = null;
			this.currentDistance = null;
		}
	};

	/**
	 * Extracts all touches from the event object.
	 *
	 * @param {Event} e - The touch event.
	 * @returns {Array<object>} Array of touch points.
	 */
	getTouches(e)
	{
		const eventTouches = [];
		// @ts-ignore
		const touches = e.touches;
		if (touches && touches.length)
		{
			for (let i = 0; i < touches.length; i++)
			{
				eventTouches.push(touches[i]);
			}
		}
		return eventTouches;
	}

	/**
	 * Calculates the midpoint (center) between two sets of coordinates.
	 *
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} x2
	 * @param {number} y2
	 * @returns {{x: number, y: number}} The center coordinates.
	 */
	getCenter(x1, y1, x2, y2)
	{
		return {
			x: (x1 + x2) / 2,
			y: (y1 + y2) / 2
		};
	}

	/**
	 * Attempts a pinch gesture if two touches are present.
	 *
	 * @param {Event} e - The touch event.
	 * @returns {void}
	 */
	pinch(e)
	{
		const touches = this.getTouches(e);
		if (touches.length === 2)
		{
			this.pointer.status = "down";

			const touch1 = touches[0];
			const touch2 = touches[1];

			const touch1Position = this.getPosition(touch1.clientX, touch1.clientY);
			const touch2Position = this.getPosition(touch2.clientX, touch2.clientY);

			this.centerMousePinch(touch1, touch2);

			const scale = this.pinchTracker.getScale(touch1Position, touch2Position);
			this.parent.callAction("pinch", e, scale);
		}
	}

	/**
	 * Creates a coordinate object from x/y.
	 *
	 * @param {number} eX
	 * @param {number} eY
	 * @returns {{x: number, y: number}}
	 */
	getPosition(eX, eY)
	{
		return {
			x: parseInt(String(eX)),
			y: parseInt(String(eY))
		};
	}

	/**
	 * Moves pointer coordinates to the midpoint of two touches for pinch usage.
	 *
	 * @param {Touch} touch1
	 * @param {Touch} touch2
	 * @returns {void}
	 */
	centerMousePinch(touch1, touch2)
	{
		const center = this.getCenter(
			touch1.clientX,
			touch1.clientY,
			touch2.clientX,
			touch2.clientY
		);

		const pointer = this.pointer;
		pointer.x = center.x;
		pointer.y = center.y;
	}

	/**
	 * Called on a rotate gesture (currently not used).
	 *
	 * @param {Event} e - The associated event.
	 * @returns {void}
	 */
	rotate(e)
	{
		this.pointer.status = "down";
		this.parent.callAction("rotate", e);
	}

	/**
	 * Checks if the event is a multi-touch gesture. If yes, performs pinch logic.
	 *
	 * @param {Event} e - The event object.
	 * @returns {boolean} True if it was a gesture (pinch); false otherwise.
	 */
	isGesture(e)
	{
		let gesture = false;
		// @ts-ignore
		const touches = e.touches;
		if (touches && touches.length > 1)
		{
			e.preventDefault();
			this.pinch(e);
			gesture = true;
		}
		return gesture;
	}

	/**
	 * Called when the pointer moves (mouse/touch) but might also detect pinch.
	 *
	 * @param {Event} e - The associated event.
	 * @returns {void}
	 */
	pointerMove(e)
	{
		this.getEventPosition(e);

		if (this.isGesture(e) === false)
		{
			this.parent.callAction("pointerMove", e);
		}
	}
}
