import { Div } from "@base-framework/atoms";
import { Component } from "@base-framework/base";
import { Button } from "../../atoms/buttons/buttons.js";
import { HiddenInput } from "../../atoms/form/inputs/inputs.js";
import { Icons } from "../../icons/icons.js";
import { SignatureCanvas } from "./signature-canvas.js";

/**
 * SignaturePanel
 *
 * This panel manages a signature canvas and controls. It provides
 * a hidden input, a button to reset the signature, and a canvas
 * for drawing signatures.
 *
 * @class
 * @extends Component
 */
export class SignaturePanel extends Component
{
    /**
     * Sets up default properties for the signature panel.
     *
     * @returns {void}
     */
    declareProps()
    {
        this.data = null;
        this.lineColor = null;
        this.lineWidth = null;
        this.baseLineWidth = null;
        this.baseStrokeColor = null;
        this.margin = null;
        this.targetSize = null;
        this.callBackData = null;
        this.pointerUp = null;
        this.path = null;
        this.canvasLayer = null;
    }

    /**
     * Renders the main layout for the signature panel,
     * including a hidden input and a reset button.
     *
     * @returns {object} The layout object for the component.
     */
    render()
    {
        return Div({ class: 'signature-panel relative flex flex-auto' }, [
            HiddenInput({
                cache: 'hiddenInput',
                required: true,
                bind: this.path + '.data'
            }),
            Div({ class: 'absolute top-2 right-2' }, [
                Button({
                    variant: 'icon',
                    icon: Icons.circleX,
                    click: this.reset.bind(this)
                })
            ]),
            new SignatureCanvas({
                cache: 'canvasLayer',
                margin: this.margin,
                targetSize: this.targetSize,
                lineColor: this.lineColor,
                lineWidth: this.lineWidth,
                baseLineWidth: this.baseLineWidth,
                baseStrokeColor: this.baseStrokeColor,
                pointerUpCallBack: this.pointerUp,
                callBackData: this.callBackData
            })
        ]);
    }

    /**
     * Called after component setup. Resizes the signature canvas once
     * everything is ready.
     *
     * @returns {void}
     */
    afterSetup()
    {
        this.canvasLayer.resize();
    }

    /**
     * Gets the signature image from the canvas layer, as a data URL.
     *
     * @returns {string} The signature image data URL.
     */
    getImage()
    {
        return this.canvasLayer.getImage();
    }

    /**
     * Checks if the user has drawn anything on the signature canvas.
     *
     * @returns {boolean} True if the canvas has been signed, otherwise false.
     */
    isSigned()
    {
        if (this.canvasLayer)
        {
            return this.canvasLayer.signed;
        }
        return false;
    }

    /**
     * Resets the signature canvas to a blank state.
     *
     * @param {Event} [e] The event object (if called by a click event).
     * @returns {void}
     */
    reset(e)
    {
        if (this.canvasLayer)
        {
            return this.canvasLayer.reset();
        }
    }
}