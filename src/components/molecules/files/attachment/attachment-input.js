import { Div } from "@base-framework/atoms";
import { Events, Jot } from "@base-framework/base";
import { FileInput } from "../../../atoms/form/inputs/inputs.js";

/**
 * Get file size in MB.
 *
 * @param {number} bytes - The size in bytes.
 * @returns {number} - The size in MB rounded to two decimal places.
 */
const getFileSize = (bytes) =>  (Math.round(bytes * 100 / (1024 * 1024)) / 100);

/**
 * AttachmentInput
 *
 * This component handles file attachments.
 *
 * @class
 */
export const AttachmentInput = Jot(
{
    declareProps()
    {
        /**
         * @member { array} files - The list of files attached.
         */
        // @ts-ignore
        this.files = [];
    },

    /**
     * This will render the component.
     *
     * @returns {object}
     */
    render()
    {
        return Div({ class: 'hidden' }, [
            FileInput({
                cache: 'attachment',
                // @ts-ignore
                accept: this.accept ?? '*/*',
                // @ts-ignore
                multiple: this.multiple ?? false,
            })
        ]);
    },

    /**
     * This will open the file browse dialog.
     *
     * @returns {void}
     */
    openFileBrowse()
	{
        // @ts-ignore
		const ele = this.attachment;
		if (ele)
		{
			ele.value = '';
			Events.trigger('click', ele);
		}
	},

    /**
     * This will check if the file is below the minimum size.
     *
     * @param {File} file - The file to check.
     * @returns {boolean} - True if the file is below the minimum size, false otherwise.
     */
    isBelowMinimum(file)
	{
        // @ts-ignore
		const MAX_FILE_SIZE = this.maxUploadSize || 0;
        if (MAX_FILE_SIZE <= 0)
        {
            return true;
        }

		const fileSize = getFileSize(file.size);
		return (fileSize <= MAX_FILE_SIZE);
	},

    addFile(file, type, orientation)
	{
        // @ts-ignore
		this.files.push(option);

        // @ts-ignore
		const callBack = this.afterAddFile;
		if(typeof callBack === 'function')
		{
			callBack(file);
		}
	},

    /**
     * This will setup the states.
     *
     * @returns {object}
     */
    state()
    {
        return {
            method: globalThis.localStorage.getItem('theme') ?? 'system'
        };
    }
});

export default AttachmentInput;