import { I, Label, Span } from '@base-framework/atoms';
import { Atom, Component, NavLink } from '@base-framework/base';
import { Icon } from '../../atoms/icon.js';
import { Icons } from '../../icons/icons.js';
import { NavButtonLink } from './nav-button-link.js';

/**
 * This will create a navigation option.
 *
 * @param {object} props
 * @param {array} children
 * @returns {object}
 */
const Li = Atom(({ options, click }, children) =>
{
	const settings = {
		class: `relative flex flex-row w-auto text-left p-0 transition-all cursor-pointer min-w-[48px] option${options ? ' sub' : ''}`,
		click
	};

	return {
		tag: 'li',
		...settings,
		children
	};
});

/**
 * This will get the link content.
 *
 * @param {string} label
 * @param {string} icon
 * @param {boolean} hasChildren
 * @returns {array}
 */
const LinkContent = (label, icon = null, hasChildren = false) => [
	icon && I({
		class: 'icon w-12 rounded-md flex items-center justify-center min-w-12',
		onState: ['selected', {
			selected: true
		}],
		html: icon
	}),
	Label({ class: 'label flex flex-auto text-sm items-center cursor-pointer whitespace-nowrap' }, label),
	hasChildren && Span(
		{
			class: 'flex justify-center items-center px-1 transition-all text-muted-foreground mr-2',
			onState: [
				['selected', {
					rotate: true
				}],
				['active', {
					rotate: true
				}]
			]
		}, [
		Icon({ size: 'xs' }, Icons.chevron.single.down)
	])
];

/**
 * MainLink
 *
 * This will setup a navigation link.
 *
 * @class
 */
export class MainLink extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * This will set the label.
		 * @member {string} label
		 * @default ''
		 */
		this.label = '';

		/**
		 * This will set the icon.
		 * @member {string} icon
		 * @default null
		 */
		this.icon = null;

		/**
		 * This will set the href.
		 * @member {string} href
		 * @default null
		 */
		this.href = null;

		/**
		 * This will set the exact.
		 * @member {boolean} exact
		 * @default false
		 */
		this.exact = false;

		/**
		 * This will set the options.
		 * @member {array|null} options
		 */
		this.options = null;

		/**
		 * This will set the content.
		 * @member {array} content
		 * @default null
		 */
		this.content = null;

		/**
		 * This will set the call back.
		 * @member {function} callBack
		 */
		this.callBack = null;

		/**
		 * This will set the check call back.
		 * @member {function} checkCallBack
		 */
		this.checkCallBack = null;

		/**
		 * This will set the link.
		 * @member {object} link
		 */
		this.link = null;
	}

	/**
	 * This will render the component.
	 *
	 * @override
	 * @returns {object}
	 */
	render()
	{
		const click = !this.options && this.callBack;
		return Li({ options: this.options, click }, [
				this.addLink()
			]
		);
	}

	/**
	 * This will add the link.
	 *
	 * @returns {object}
	 * @protected
	 */
	addLink()
	{
		const hasChildren = this.options && this.options.length > 0;
		const children = this.content || LinkContent(this.label, this.icon, hasChildren);

		if (this.href)
		{
			return new NavLink(
			{
				class: 'flex flex-auto flex-row rounded-md transition-all overflow-x-hidden',
				cache: 'link',
				href: this.href,
				activeClass: 'selected',
				exact: this.exact || false
			}, children);
		}

		return new NavButtonLink({
			class: 'flex flex-auto flex-row rounded-md transition-all overflow-x-hidden',
			cache: 'link',
			checkCallBack: this.checkCallBack
		}, children);
	}

	/**
	 * This will check if the link is selected.
	 *
	 * @returns {boolean}
	 */
	isSelected()
	{
		return this.link.state.get('selected');
	}

	update(selected)
	{
		this.link.update(selected);
	}
}

export default MainLink;