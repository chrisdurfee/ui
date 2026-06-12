import { Icon } from '../atoms/icon.js';
import { MaterialIcon } from '../atoms/material-icon.js';

/**
 * Universal Icon Handler
 *
 * This utility detects whether an icon is an SVG string (Heroicons)
 * or a Material Symbol object/string and renders the appropriate component.
 *
 * @param {object} props - Icon properties (size, class, variant, etc.)
 * @param {string|object} iconData - Either SVG string or Material Symbol name/object
 * @returns {object|null} - Icon or MaterialIcon component, or null if no icon
 */
export const UniversalIcon = (props = {}, iconData) =>
{
	if (!iconData)
	{
		return null;
	}

	// Check if it's an SVG string (Heroicons)
	if (typeof iconData === 'string' && iconData.includes('<svg'))
	{
		return Icon(props, iconData);
	}

	// Check if it's a Material Symbol (object with name property)
	if (typeof iconData === 'object' && iconData.name)
	{
		return MaterialIcon({
			...props,
			name: iconData.name,
			variant: iconData.variant || props.variant || 'outlined'
		});
	}

	// Check if it's a plain string (Material Symbol name)
	if (typeof iconData === 'string')
	{
		return MaterialIcon({
			...props,
			name: iconData
		});
	}

	// Unknown icon data type; render nothing rather than risk injecting it as HTML.
	return null;
};

/**
 * Helper to check if icon data is a Material Symbol
 *
 * @param {string|object} iconData
 * @returns {boolean}
 */
export const isMaterialIcon = (iconData) =>
{
	if (!iconData)
	{
		return false;
	}

	// Check if it's an object with name property
	if (typeof iconData === 'object' && iconData.name)
	{
		return true;
	}

	// Check if it's a string that doesn't contain SVG markup
	if (typeof iconData === 'string' && !iconData.includes('<svg'))
	{
		return true;
	}

	return false;
};

/**
 * Helper to check if icon data is a Heroicon (SVG)
 *
 * @param {string|object} iconData
 * @returns {boolean}
 */
export const isHeroicon = (iconData) =>
{
	return typeof iconData === 'string' && iconData.includes('<svg');
};
