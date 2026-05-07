import { A, Div, Footer, H3, Header, P } from "@base-framework/atoms";
import { Atom, Component } from "@base-framework/base";
import { Timer } from "@base-framework/organisms";
import { Button } from "../../atoms/buttons/buttons.js";
import { UniversalIcon } from "../../atoms/universal-icon.js";
import { Icons } from "../../icons/icons.js";

/**
 * Type styles mapping (reusing from Alert component style)
 *
 * @constant
 * @type {object}
 */
const typeStyles =
{
	info: {
		bgColor: '',
		borderColor: 'border-border',
		iconColor: 'text-blue-500',
		iconBg: 'bg-blue-500/10'
	},
	warning: {
		bgColor: '',
		borderColor: 'border-border',
		iconColor: 'text-warning',
		iconBg: 'bg-warning/10'
	},
	destructive: {
		bgColor: '',
		borderColor: 'border-border',
		iconColor: 'text-destructive',
		iconBg: 'bg-destructive/10'
	},
	success: {
		bgColor: '',
		borderColor: 'border-border',
		iconColor: 'text-emerald-500',
		iconBg: 'bg-emerald-500/10'
	},
	default: {
		bgColor: '',
		borderColor: 'border-border',
		iconColor: 'text-muted-foreground',
		iconBg: 'bg-muted/40'
	}
};

/**
 * This will get the title bar
 *
 * @param {object} title
 * @returns Header
 */
const TitleBar = (title) => (
	Header({ class: 'flex' }, [
		H3({ class: 'text-sm font-semibold leading-tight m-0 text-foreground' }, title)
	])
);

/**
 * This will create a link for the notification.
 *
 * @param {object} props
 * @returns {object}
 */
// @ts-ignore
const NotificationLink = Atom(({ href, class: customClass }, children) => (
	A({
		class: `bg-popover/95 backdrop-blur-md text-popover-foreground relative flex flex-col justify-start shadow-lg shadow-black/5 pointer-events-auto p-3 sm:p-4 border rounded-xl w-full sm:max-w-[420px] sm:ml-auto mt-2 sm:mt-3 transition-shadow hover:shadow-xl ${customClass}`,
		href: href,
		animateIn: 'pullRightIn',
		animateOut: 'pullRight',
		role: 'alert'
	}, children)
));

/**
 * This will create a button notification.
 *
 * @param {object} props
 * @returns {object}
 */
// @ts-ignore
const NotificationButton = Atom(({ close, class: customClass }, children) => (
	Div({
		class: `pullRightIn bg-popover/95 backdrop-blur-md text-popover-foreground relative flex flex-col justify-start shadow-lg shadow-black/5 pointer-events-auto p-3 sm:p-4 border rounded-xl w-full sm:max-w-[420px] sm:ml-auto mt-2 sm:mt-3 transition-shadow hover:shadow-xl ${customClass}`,
		click: () => close(),
		animateIn: 'pullRightIn',
		animateOut: 'pullRight',
		role: 'alert'
	}, children)
));

/**
 * Notification
 *
 * A component that displays notifications.
 *
 * @class
 * @extends Component
 */
export class Notification extends Component
{
	/**
	 * This will declare the props for the compiler.
	 *
	 * @returns {void}
	 */
	declareProps()
	{
		/**
		 * @member {function|null} secondaryAction
		 */
		this.secondaryAction = null;

		/**
		 * @member {function|null} primaryAction
		 */
		this.primaryAction = null;

		/**
		 * @member {boolean} primary
		 */
		this.primary = false;

		/**
		 * @member {boolean} secondary
		 */
		this.secondary = false;

		/**
		 * @member {string} title
		 */
		this.title = null;

		/**
		 * @member {string} description
		 */
		this.description = null;

		/**
		 * @member {string} icon
		 */
		this.icon = null;

		/**
		 * @member {function} onClick
		 */
		this.onClick = null;
	}

	/**
	 * This will be called when the component is created.
	 *
	 * @returns {void}
	 */
	onCreated()
	{
		this.duration = this.duration || 4000;
	}

	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		const { bgColor, borderColor, iconColor, iconBg } = this.getTypeStyles();
		// @ts-ignore
		const href = this.href || null;
		const notificationContent = this.getChildren(iconColor, iconBg);

		/**
		 * The notification can be either a link or a button.
		 */
		if (href)
		{
			return NotificationLink({
				href,
				class: `${bgColor} ${borderColor}`,
			}, notificationContent);
		}

		return NotificationButton({
			close: this.close.bind(this),
			class: `${bgColor} ${borderColor}`,
		}, notificationContent);
	}

	/**
	 * This will be called after the component is set up.
	 *
	 * @returns {void}
	 */
	afterSetup()
	{
		const duration = this.duration;
		if (duration !== 'infinite')
		{
			this.timer = new Timer(duration, this.close.bind(this));
			this.timer.start();
		}
	}

	/**
	 * This will get the style properties based on the notification type.
	 *
	 * @returns {object}
	 */
	getTypeStyles()
	{
		// @ts-ignore
		const type = this.type || 'default';
		return typeStyles[type] || typeStyles.default;
	}

	/**
	 * This will get the buttons for the notification.
	 *
	 * @returns {array}
	 */
	getButtons()
	{
		return [
			Div({ class: 'flex flex-row mt-3 gap-2' }, [
				this.secondary && Button({ variant: 'outline', click: () => this.secondaryAction && this.secondaryAction() }, this.secondary),
				this.primary && Button({ click: () => this.primaryAction && this.primaryAction() }, this.primary)
			])
		];
	}

	/**
	 * This will get the children for the notification.
	 *
	 * @param {string} iconColor
	 * @returns {array}
	 */
	getChildren(iconColor, iconBg)
	{
		return [
			Div({ class: 'flex items-start gap-3' }, [
				this.icon && Div({ class: `flex shrink-0 items-center justify-center w-8 h-8 rounded-full ${iconBg} ${iconColor}` }, [
					UniversalIcon({ size: 'sm' }, this.icon)
				]),
				Div({ class: 'flex flex-auto flex-col min-w-0 gap-0.5 pr-7' }, [
					this.title && TitleBar(this.title),
					this.description && P({ class: 'text-xs sm:text-sm text-muted-foreground leading-snug m-0' }, this.description),
					(this.primary || this.secondary) && Footer({ class: 'flex items-center' }, this.getButtons())
				])
			]),
			Button({
				class: 'absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground',
				variant: 'icon',
				icon: Icons.x,
				click: this.close.bind(this)
			})
		];
	}

	/**
	 * This will close the notification.
	 *
	 * @param {object} e The event object.
	 * @returns {void}
	 */
	close(e)
	{
		if (e)
		{
			e.stopPropagation();
		}

		if (this.duration !== 'infinite')
		{
			// @ts-ignore
			this.timer.stop();
		}

		if (this.onClick)
		{
			this.onClick();
		}

		this.destroy();
	}
}

export default Notification;
