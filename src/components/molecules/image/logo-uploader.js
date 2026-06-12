import { Div, Img, Input, Label, OnState } from '@base-framework/atoms';
import { Component, Events, Jot } from '@base-framework/base';
import { UniversalIcon } from '../../atoms/universal-icon.js';
import { Icons } from '../../icons/icons.js';

/**
 * LogoUploader
 *
 * Upload button for logo images, styled with a dashed circular drop zone.
 *
 * @type {typeof Component | null}
 */
export const LogoUploader = Jot(
{
	/**
	 * Get the initial state for the component.
	 *
	 * @returns {object} Initial state for the component
	 */
	state()
	{
		return {
			// @ts-ignore
			loaded: Boolean(this.src) && !this.src.includes('[[')
		};
	},

	/**
	 * This will open the file browse dialog.
	 *
	 * @returns {void}
	 */
	openFileBrowse()
	{
		// @ts-ignore
		const ele = this.input;
		if (ele)
		{
			ele.value = '';
			Events.trigger('click', ele);
		}
	},

	/**
	 * Get the URL for the uploaded file.
	 *
	 * @param {File} file - The file to get the URL for.
	 * @returns {string} The object URL for the file.
	 */
	getFileUrl(file)
	{
		// @ts-ignore
		if (this.url)
		{
			// @ts-ignore
			URL.revokeObjectURL(this.url);
		}

		// @ts-ignore
		return (this.url = URL.createObjectURL(file));
	},

	/**
	 * Render the component.
	 *
	 * @returns {object} Rendered component
	 */
	render()
	{
		const id = 'logo-upload';
		// @ts-ignore
		const onChange = this.onChange || null;

		return Div({ class: 'flex-none items-center' }, [
			Input({
					id,
					cache: 'input',
					type: 'file',
					accept: 'image/*',
					class: 'hidden',
					change: (e) =>
					{
						const file = e.target.files?.[0];
						if (file && onChange)
						{
							// @ts-ignore
							this.state.loaded = false;
							// @ts-ignore
							onChange(file, this.parent);

							// @ts-ignore
							this.src = this.getFileUrl(file);
							// @ts-ignore
							this.state.loaded = true;
						}
					}
				}),
				Div({
					class: 'relative w-32 h-32 rounded-full border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors duration-150 overflow-hidden group',
					click: (e) =>
					{
						e.preventDefault();
						e.stopPropagation();

						// @ts-ignore
						this.openFileBrowse();
					}
				}, [
				OnState('loaded', (value) => (value)
					? Img({
						// @ts-ignore
						src: this.src,
						class: 'absolute inset-0 w-full h-full object-cover rounded-full'
					})
					: Label({
							htmlFor: id,
							class: 'z-10 flex flex-col items-center justify-center text-sm text-muted-foreground group-hover:text-primary'
						}, [
						UniversalIcon({}, Icons.upload),
						Div('Upload logo')
					])
				),
			])
		]);
	},

	/**
	 * Cleanup before destroying the component.
	 *
	 * @returns {void}
	 */
	destroy()
	{
		// Clear cached references
		// @ts-ignore
		this.input = null;

		// Revoke any outstanding object URL
		// @ts-ignore
		if (this.url)
		{
			// @ts-ignore
			URL.revokeObjectURL(this.url);
			// @ts-ignore
			this.url = null;
		}
	}
});
