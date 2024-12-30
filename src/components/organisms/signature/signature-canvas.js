import { base, Component, Dom } from "@base-framework/base";
import { IntervalTimer } from "@base-framework/organisms";

/**
 * SignatureCanvas
 *
 * The underlying canvas component for drawing signatures. Manages
 * pointer events, drawing, and resizing.
 *
 * @class
 * @extends Component
 */
export class SignatureCanvas extends Component
{
    /**
     * Runs before rendering, sets up defaults, a timer for drawing,
     * and basic canvas properties.
     *
     * @returns {void}
     */
    onCreated()
    {
        this.lineWidth = this.lineWidth || 3;
        this.lineColor = this.lineColor || '#000000';
        this.canvas = null;
        this.ctx = null;

        // Manages an animation/drawing loop
        this.status = 'stopped';
        const duration = 1000 / 60;
        this.timer = new IntervalTimer(duration, base.bind(this, this.draw));

        this.width = 0;
        this.height = 0;
        this.signed = false;

        this.mouse = { x: 0, y: 0, status: 'up' };
        this.margin = this.margin || { x: 40, y: 60 };
        this.targetSize = this.targetSize || { width: 740, height: 345 };

        this.baseLineWidth = this.baseLineWidth || 2;
        this.baseStrokeColor = this.baseStrokeColor || '#000000';
    }

    /**
     * Renders a <canvas> element.
     *
     * @returns {object} Layout definition for the canvas.
     */
    render()
    {
        return {
            tag: 'canvas'
        };
    }

    /**
     * Called before the component is destroyed. Stops the timer
     * to prevent memory leaks or ongoing animation.
     *
     * @returns {void}
     */
    beforeDestroy()
    {
        this.stopTimer();
    }

    /**
     * Called after component setup. Initializes canvas context,
     * schedules a resize, and draws the initial content.
     *
     * @returns {void}
     */
    afterSetup()
    {
        this.canvas = this.panel;
        this.ctx = this.canvas.getContext("2d");

        // Resize and draw after the parent has fully rendered
        window.setTimeout(() =>
        {
            this.resize();
            this.draw();
        }, 1);
    }

    /**
     * Defines the DOM events to set up for this canvas component.
     *
     * @returns {Array} An array of [eventName, element, callback] definitions.
     */
    setupEvents()
    {
        const panel = this.panel,
              callBackPos = base.bind(this, this.pointerPosition),
              callBackUp = base.bind(this, this.pointerUp),
              callBackDown = base.bind(this, this.pointerDown),
              resize = base.bind(this, this.resize);

        return [
            ['pointermove', panel, callBackPos],
            ['pointerup', panel, callBackUp],
            ['pointerdown', panel, callBackDown],
            ['pointerout', panel, callBackUp],
            ['resize', window, resize]
        ];
    }

    /**
     * Calculates and saves the current pointer position in canvas coordinates.
     *
     * @param {Event} e The event object (mouse or touch).
     * @returns {void}
     */
    getEventPosition(e)
    {
        let eX, eY;

        const canvas = this.canvas,
              scale = canvas.width / parseInt(canvas.style.width),
              rect = canvas.getBoundingClientRect();

        // @ts-ignore
        if (e.touches && e.touches.length)
        {
            // @ts-ignore
            const touch = e.touches[0];
            eX = touch.clientX;
            eY = touch.clientY;
        }
        else
        {
            // @ts-ignore
            eX = e.x || e.clientX;
            // @ts-ignore
            eY = e.y || e.clientY;
        }

        // Adjust for element offset
        // @ts-ignore
        const x = parseInt((eX - rect.left) * scale);
        // @ts-ignore
        const y = parseInt((eY - rect.top) * scale);

        this.mouse.x = x;
        this.mouse.y = y;
    }

    /**
     * Called when the pointer goes down on the canvas.
     * Begins a new path, sets the mouse status, and starts the timer.
     *
     * @param {Event} e The event object.
     * @returns {void}
     */
    pointerDown(e)
    {
        e.preventDefault();

        this.getEventPosition(e);
        const { ctx, mouse } = this;

        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        mouse.status = 'down';

        this.startTimer();
    }

    /**
     * Called when the pointer goes up or leaves the canvas area.
     * Closes the path and stops the drawing timer.
     *
     * @param {Event} e The event object.
     * @returns {void}
     */
    pointerUp(e)
    {
        e.preventDefault();

        this.ctx.closePath();
        this.mouse.status = 'up';
        this.stopTimer();
    }

    /**
     * Tracks pointer movement, updates position in real time.
     *
     * @param {Event} e The event object.
     * @returns {void}
     */
    pointerPosition(e)
    {
        this.getEventPosition(e);

        if (this.mouse.status === 'down')
        {
            e.preventDefault();
        }
    }

    /**
     * Resizes the canvas, preserves existing drawing by converting
     * it to a data URL, then re-drawing.
     *
     * @returns {void}
     */
    resize()
    {
        const { canvas, ctx } = this;
        const canvasData = canvas.toDataURL();

        this.scale();
        this.setupBackground(ctx);

        // Redraw old image data
        if (canvasData !== 'data:,')
        {
            const img = new window.Image();
            // @ts-ignore
            base.on('load', img, function loadImage()
            {
                ctx.drawImage(img, 0, 0);
                // @ts-ignore
                base.off('load', img, loadImage);
            });
            img.src = canvasData;
        }

        this.draw();
    }

    /**
     * Returns a JPEG data URL of the current canvas content.
     *
     * @returns {string} The signature image as a data URL.
     */
    getImage()
    {
        // compress image for smaller data
        const quality = 0.7;
        return this.canvas.toDataURL('image/jpeg', quality);
    }

    /**
     * (Deprecated approach) Resize the canvas to the container size
     * without scaling logic.
     *
     * @returns {void}
     */
    noScaleResize()
    {
        // @ts-ignore
        const size = Dom.getSize(container);
        // @ts-ignore
        this.width = canvas.width = size.width;
        // @ts-ignore
        this.height = canvas.height = size.height;
    }

    /**
     * Scales the canvas to fit within its container, preserving aspect ratio
     * relative to this.targetSize.
     *
     * @returns {void}
     */
    scale()
    {
        const canvas = this.canvas,
        container = this.container,
        size = Dom.getSize(container),
        targetSize = this.targetSize,
        width = targetSize.width,
        height = targetSize.height;

        let widthStyle = width + 'px',
            heightStyle = height + 'px';

        this.width = canvas.width = width;
        this.height = canvas.height = height;

        // @ts-ignore
        if (size.width !== 0 && size.height !== 0)
        {
            // @ts-ignore
            const gameWidth = size.width,
            // @ts-ignore
            gameHeight = size.height,
            scaleToFitX = gameWidth / width,
            scaleToFitY = gameHeight / height,
            optimalRatio = Math.min(scaleToFitX, scaleToFitY);

            widthStyle = width * optimalRatio + "px";
            heightStyle = height * optimalRatio + "px";
        }
        canvas.style.width = widthStyle;
        canvas.style.height = heightStyle;
    }

    /**
     * Main drawing loop. If the mouse is down, adds a line
     * from the last point to the current pointer position.
     *
     * @returns {void}
     */
    draw()
    {
        if (this.mouse.status === 'down')
        {
            this.addLine(this.ctx, this.mouse.x, this.mouse.y, this.lineColor);
        }
    }

    /**
     * Draws the baseline at the bottom of the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx The canvas 2D context.
     * @returns {void}
     */
    drawBottomLine(ctx)
    {
        const canvas = this.canvas;

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        const gridLineX = this.margin.x,
        gridLineY = this.height - this.margin.y;

        ctx.beginPath();
        ctx.moveTo(gridLineX, gridLineY);
        ctx.lineTo(canvas.width - this.margin.x, gridLineY);
        ctx.lineWidth = this.baseLineWidth;
        ctx.strokeStyle = this.baseStrokeColor;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * Adds a line to the current path, updating the 'signed' status.
     *
     * @param {CanvasRenderingContext2D} ctx The canvas context.
     * @param {number} px The x-coordinate.
     * @param {number} py The y-coordinate.
     * @param {string} color The stroke color.
     * @returns {void}
     */
    addLine(ctx, px, py, color)
    {
        if (!this.signed)
        {
            this.signed = true;
        }

        const x = Math.round(px),
        y = Math.round(py);

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = color;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    /**
     * Clears the canvas, sets signed to false, and re-initializes
     * the background for a fresh signature.
     *
     * @returns {void}
     */
    reset()
    {
        this.signed = false;
        const { ctx } = this;
        ctx.clearRect(0, 0, this.width, this.height);

        this.setupBackground(ctx);
    }

    /**
     * Fills the canvas background with white and draws the baseline.
     *
     * @param {CanvasRenderingContext2D} ctx The canvas context.
     * @returns {void}
     */
    setupBackground(ctx)
    {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, this.width, this.height);

        this.drawBottomLine(ctx);
    }

    /**
     * Starts the drawing timer so new lines can be added as pointer moves.
     *
     * @returns {void}
     */
    startTimer()
    {
        this.stopTimer();
        this.draw();
        this.timer.start();
        this.status = 'started';
    }

    /**
     * Stops the drawing timer.
     *
     * @returns {void}
     */
    stopTimer()
    {
        this.timer.stop();
        this.status = 'stopped';
    }
}
