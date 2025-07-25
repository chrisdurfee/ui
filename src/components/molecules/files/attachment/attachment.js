import { Div } from "@base-framework/atoms";
import { Jot } from "@base-framework/base";
import AttachmentInput from "./attachment-input.js";

/**
 * Get file size in MB.
 *
 * @param {number} bytes - The size in bytes.
 * @returns {number} - The size in MB rounded to two decimal places.
 */
const getFileSize = (bytes) =>  (Math.round(bytes * 100 / (1024 * 1024)) / 100);

/**
 * Attachment
 *
 * This creates an attachment.
 *
 * @class
 */
export const Attachment = Jot(
{
    /**
     * Declare the component's props.
     *
     * @returns {void}
     */
    declareProps()
    {
        /**
         * @member { number } thumbSize - The size of the thumbnail.
         */
        // @ts-ignore
        this.thumbSize = 300;

        /**
         * @member { string|null } thumb
         */
        // @ts-ignore
        this.thumb = null;
    },

    /**
     * This will render the component.
     *
     * @returns {object}
     */
    render()
    {
        return Div({ class: 'flex flex-col' }, [

        ]);
    },

    /**
     * Called when the component is destroyed.
     *
     * @returns {void}
     */
    destroy()
    {
        // @ts-ignore
        const callBack = this.callBack;
		if (typeof callBack === 'function')
		{
			callBack(this);
		}
    }
});

export default AttachmentInput;