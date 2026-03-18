import { Div, OnState, UseParent } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";
import { InlineNavigation } from "../../inline-navigation.js";
import { NavigationPopover } from "./navigation-popover.js";
import { NavButton, TitleHeader } from "./title-header.js";

/**
 * This will map the mobile options.
 *
 * @param {array} options
 * @param {function} callBack
 * @returns {Array<object>}
 */
const mapCloseCallBack = (options, callBack) =>
{
	return options.map(option =>
	{
		if (option.options)
		{
			return { ...option, options: mapCloseCallBack(option.options, callBack) };
		}

		return { ...option, callBack };
	});
};

/**
 * This will create the mobile navigation.
 *
 * @param {object} props
 * @returns {object}
 */
const MobileNav = (props) =>
{
	return Div({ class: 'bg-background flex flex-auto flex-col w-full relative' }, [
		OnState('open', (state) => (!state)
			? null
			: [
				new NavigationPopover({ title: props.title }, [
					UseParent(({ state }) =>
					{
						const closeCallBack = (e) => state.open = false;
						const mappedOptions = mapCloseCallBack(props.options, closeCallBack);

						return new InlineNavigation(
						{
							options: mappedOptions
						});
					})
				])
			]
		)
	]);
};

/**
 * This will create a mobile navigation button.
 *
 * @param {object} props
 * @return {object}
 */
export const MobileNavButton = Atom((props) =>
{
	return Div({ cache: 'mobileNav', class: 'inline-flex relative lg:hidden' }, [
		Div([
			NavButton(),
			MobileNav(props)
		])
	]);
});

/**
 * This will create a mobile navigation wrapper.
 *
 * @param {object} props
 * @return {object}
 */
export const MobileNavWrapper = Atom((props) =>
{
	return Div({ cache: 'mobileNav', class: 'flex flex-auto flex-col w-full relative lg:hidden' }, [
		Div({ class: 'flex flex-auto flex-col w-full' }, [
			TitleHeader(props),
			MobileNav(props)
		])
	]);
});