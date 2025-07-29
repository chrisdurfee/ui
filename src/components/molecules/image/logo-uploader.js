import { Div, Img, Input, Label, OnState } from '@base-framework/atoms';
import { Component, Jot } from '@base-framework/base';
import { Icon } from '../../atoms/icon.js';
import { Icons } from '../../icons/icons.js';

/**
 * LogoUploader
 *
 * Upload button for logo images, styled with a dashed circular drop zone.
 *
 * @type {typeof Component}
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
			loaded: Boolean(this.src)
		};
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

		return Div({ class: 'relative w-32 h-32 rounded-full border border-dashed border-muted-foreground flex items-center justify-center cursor-pointer hover:bg-muted transition-colors duration-150 overflow-hidden group' }, [
			Input({
				id,
				type: 'file',
				accept: 'image/*',
				class: 'hidden',
				change: (e) =>
				{
					const file = e.target.files?.[0];
					if (file && onChange)
					{
						// @ts-ignore
						onChange(file, this.parent);

						// @ts-ignore
						this.src = URL.createObjectURL(file);
						// @ts-ignore
						this.state.loaded = true;
					}
				}
			}),
			OnState('loaded', (value) => (value)
				? Img({
					// @ts-ignore
					src: this.src,
					class: 'absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none'
				})
				: Label({
						htmlFor: id,
						class: 'z-10 flex flex-col items-center justify-center text-sm text-muted-foreground pointer-events-none group-hover:text-primary'
					}, [
					Icon(Icons.upload),
					Div('Upload logo')
				])
			),
		]);
	}
});
