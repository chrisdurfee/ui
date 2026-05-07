import { Div } from "@base-framework/atoms";
import { Component } from "@base-framework/base";
import { List } from "@base-framework/organisms";
import { Notification } from "./notification.js";

let id = 0;

/**
 * NotificationContainer
 *
 * A component that manages notifications.
 *
 * @class
 */
export class NotificationContainer extends Component
{
	/**
	 * This will render the component.
	 *
	 * @returns {object}
	 */
	render()
	{
		/**
		 * The container needs to be set as a popover to allow it
		 * to be shown over modals and popups.
		 */
		return Div({ class: 'notification-container pointer-events-none inset-auto bg-transparent backdrop:bg-transparent overflow-visible fixed bottom-[80px] left-0 right-0 sm:left-auto z-50 px-2 sm:px-5 pb-2 sm:pb-5 flex flex-col items-stretch sm:items-end', popover: 'manual', }, [
			new List({
				cache: 'list',
				key: 'id',
				role: 'list',
				class: 'flex flex-col items-stretch sm:items-end w-full',
				rowItem: (item) => new Notification(item)
			})
		]);
	}

	/**
	 * This will add a notification.
	 *
	 * @param {object} props
	 * @returns {void}
	 */
	addNotice(props = {})
	{
		/**
		 * The list requires an id on the itme to keep track of the items.
		 */
		props.id = id++;

		/**
		 * The notice needs to have the remove callback set to remove the notice.
		 */
		props.callBack = () => this.removeNotice(props);
		// @ts-ignore
		this?.list?.append([ props ]);

		/**
		 * The popup needs to be hidden first incase we have
		 * multiple notifications at the same time to show it
		 * all content.
		 */
		// @ts-ignore
		this?.panel?.hidePopover();
		// @ts-ignore
		this?.panel?.showPopover();
	}

	/**
	 * This will remove a notification.
	 *
	 * @param {object} notice
	 * @returns {void}
	 */
	removeNotice(notice)
	{
		// @ts-ignore
		this?.list?.delete(notice.id);

		// @ts-ignore
		if (this?.list?.isEmpty())
		{
			// @ts-ignore
			this?.panel?.hidePopover();
		}
	}
}

export default NotificationContainer;