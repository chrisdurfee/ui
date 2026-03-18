import { Nav, Ul } from "@base-framework/atoms";
import { NavLink, router } from "@base-framework/base";
import { Veil } from '../../../components/atoms/veil.js';

/**
 * This will validate if a path is active.
 *
 * @param {string} path
 * @param {string} url
 * @returns {boolean}
 */
const pathRegexCache = new Map();

const isPathActive = (path, url) =>
{
	if (!pathRegexCache.has(path))
	{
		pathRegexCache.set(path, new RegExp(`${path}($|/|\\.).*`));
	}
	return pathRegexCache.get(path).test(url);
};

/**
 * This will check if a link is active.
 *
 * @param {object} link
 * @param {string} url
 * @returns {boolean}
 */
const isLinkActive = (link, url) =>
{
	const path = link.getLinkPath();
	return link.exact? (url === path) : isPathActive(path, url);
};

/**
 * This will create an underlined tab link.
 *
 * @param {object} props
 * @returns {object}
 */
const UnderlinedLink = ({ text, href, exact }) => (
	new NavLink({
		text,
		href,
		exact,
		dataSet: ['selected', ['state', true, 'active']],
		class: 'relative inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 after:scale-x-0 data-[state=active]:after:scale-x-100'
	})
);

/**
 * UnderlinedTabNavigation
 *
 * This will create an underlined tab navigation component with active bottom border.
 *
 * @class
 */
export class UnderlinedTabNavigation extends Veil
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * This will set the options.
		 * @member {array} options
		 * @default []
		 */
		this.options = [];

		/**
		 * This will set the class.
		 * @member {string} class
		 * @default ''
		 */
		this.class = '';

		/**
		 * This will set the select call back.
		 * @member {function} callBack
		 */
		this.onSelect = null;

		/**
		 * Whether the tab navigation is scrollable.
		 * When true, the nav becomes horizontally scrollable
		 * and the active tab scrolls into view.
		 * @member {boolean} scrollable
		 * @default false
		 */
		this.scrollable = false;
	}

	/**
	 * This will configure the links.
	 */
	beforeSetup()
	{
		this.links = [];
		this.activeLink = null;
	}

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		const scrollableClass = this.scrollable ? 'overflow-x-auto no-scrollbar' : '';
		const listClass = this.scrollable ? 'flex flex-row items-center min-w-max' : 'flex flex-row items-center';

		return Nav({ class: `border-b border-border ${scrollableClass} ${this.class}` }, [
			Ul({
				class: listClass,
				map: [this.options, (option) => this.addLink(option)],
				watch: {
					value: ['[[path]]', router.data],
					callBack: this.updateLinks.bind(this)
				}
			})
		]);
	}

	/**
	 * This will update the links.
	 *
	 * @returns {void}
	 */
	afterSetup()
	{
		// @ts-ignore
		const path = router.data.path;
		this.updateLinks(path);
	}

	/**
	 * This will update the links.
	 *
	 * @param {string} value
	 * @returns {void}
	 */
	updateLinks(value)
	{
		// @ts-ignore
		const firstLink = this.links[0];
		let newActiveLink = null;

		// @ts-ignore
		for (const link of this.links)
		{
			if (link.rendered === false)
			{
				continue;
			}

			if (isLinkActive(link, value))
			{
				newActiveLink = link;
				break;
			}
		}

		if (newActiveLink === null && firstLink)
		{
			newActiveLink = firstLink;
		}

		// Only update the two links that actually change state
		// @ts-ignore
		if (this.activeLink && this.activeLink !== newActiveLink)
		{
			// @ts-ignore
			this.updateLink(this.activeLink, false);
		}

		if (newActiveLink && newActiveLink !== this.activeLink)
		{
			this.updateLink(newActiveLink, true);
		}

		// @ts-ignore
		this.activeLink = newActiveLink;
	}

	/**
	 * This will update the link.
	 *
	 * @param {object} link
	 * @param {boolean} selected
	 * @returns {void}
	 */
	updateLink(link, selected)
	{
		link.update(selected);

		if (selected && this.scrollable && link.panel)
		{
			const el = link.panel;
			const container = el.closest('nav');
			if (!container) return;

			const elRect = el.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			const isVisible = elRect.left >= containerRect.left && elRect.right <= containerRect.right;

			if (!isVisible)
			{
				el.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
			}
		}
	}

	/**
	 * This will add a link.
	 *
	 * @param {object} option
	 * @returns {object}
	 */
	addLink({ label: text, href, exact })
	{
		const link = UnderlinedLink({ text, href, exact });
		// @ts-ignore
		this.links.push(link);
		return link;
	}

	/**
	 * This will remove all the links.
	 *
	 * @returns {void}
	 */
	beforeDestroy()
	{
		this.links = [];
		this.activeLink = null;
	}
}

export default UnderlinedTabNavigation;
