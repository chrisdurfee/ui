import { Nav, Ul } from "@base-framework/atoms";
import { Component, NavLink, router } from "@base-framework/base";

/**
 * This will validate if a path is active.
 *
 * @param {string} path
 * @param {string} url
 * @returns {boolean}
 */
const isPathActive = (path, url) => new RegExp(`${path}($|/|\\.).*`).test(url);

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
export class UnderlinedTabNavigation extends Component
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
	}

	/**
	 * This will configure the links.
	 */
	beforeSetup()
	{
		this.links = [];
	}

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		return Nav({ class: `border-b border-border ${this.class}` }, [
			Ul({
				class: 'flex flex-row items-center',
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
		let check = false,
		firstLink = this.links[0];

		this.deactivateAllLinks();

		for (const link of this.links)
		{
			if (link.rendered === false)
			{
				continue;
			}

			check = isLinkActive(link, value);
			if (check === true)
			{
				this.updateLink(link, true);
				break;
			}
		}

		if (check !== true && firstLink)
		{
			this.updateLink(firstLink, true);
		}
	}

	/**
	 * This will deactivate all links.
	 *
	 * @returns {void}
	 */
	deactivateAllLinks()
	{
		for (const link of this.links)
		{
			this.updateLink(link, false);
		}
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
	}
}

export default UnderlinedTabNavigation;
