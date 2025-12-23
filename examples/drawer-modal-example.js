import { Button as BaseButton, Div, Input, P, Textarea } from '@base-framework/atoms';
import { Button } from '@base-framework/ui/atoms';
import { Icons } from '@base-framework/ui/icons';
import { Drawer } from '@base-framework/ui/molecules';

/**
 * Example 1: Make an Offer Drawer
 * Slides up from bottom on mobile, centered on desktop
 * Swipe down to close on mobile
 */
export class OfferDrawer extends Drawer
{
	declareProps()
	{
		super.declareProps();
		this.title = 'Make an Offer';
		this.size = 'md';
		this.back = true; // Shows back button on mobile
	}

	getButtons()
	{
		return [
			Button({ variant: 'outline', click: () => this.destroy() }, 'Cancel'),
			Button({ variant: 'primary', type: 'submit' }, 'Submit Offer')
		];
	}
}

// Content for the offer drawer
export const OfferDrawerContent = () => [
	// Last Offer Alert
	Div({ class: 'bg-muted/50 border border-muted rounded-lg p-4 mb-4' }, [
		Div({ class: 'flex items-start gap-2' }, [
			Div({ class: 'text-green-500 text-xl' }, '📈'),
			Div({ class: 'flex-1' }, [
				P({ class: 'font-semibold text-sm mb-1' }, 'Last Offer: $55,000'),
				P({ class: 'text-sm text-muted-foreground' },
					'For better results, consider submitting an offer higher than the last rejected offer. This shows serious intent and increases your chances of acceptance.'
				)
			])
		])
	]),

	// Offer Amount Input
	Div({ class: 'mb-4' }, [
		Div({ class: 'text-sm font-medium mb-2' }, 'Your Offer Amount'),
		Div({ class: 'relative' }, [
			Div({ class: 'absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg' }, '$'),
			Input({
				type: 'text',
				placeholder: 'Enter your offer',
				class: 'w-full pl-8 pr-4 py-3 bg-muted/30 border border-border rounded-lg'
			})
		])
	]),

	// Optional Message
	Div({ class: 'mb-4' }, [
		Div({ class: 'text-sm font-medium mb-2' }, 'Message (Optional)'),
		Textarea({
			placeholder: 'Add a personal message to strengthen your offer...',
			rows: 4,
			class: 'w-full p-4 bg-muted/30 border border-border rounded-lg resize-none'
		})
	]),

	// Offer Tips
	Div({ class: 'bg-blue-500/10 border border-blue-500/20 rounded-lg p-4' }, [
		Div({ class: 'flex items-start gap-2 mb-3' }, [
			Div({ class: 'text-blue-500 mt-0.5' }, 'ℹ️'),
			Div({ class: 'font-semibold text-sm' }, 'Offer Tips')
		]),
		Div({ class: 'space-y-2 text-sm text-muted-foreground ml-6' }, [
			Div('• Research similar vehicles to make competitive offers'),
			Div('• Include financing pre-approval if applicable'),
			Div('• Be respectful and professional in your message')
		])
	])
];

/**
 * Example 2: Comments Drawer
 * Similar to social media comments that slide up on mobile
 * Swipe down to close
 */
export class CommentsDrawer extends Drawer
{
	declareProps()
	{
		super.declareProps();
		this.title = 'Comments';
		this.description = '23 comments on Sarah Chen\'s post';
		this.size = 'md';
		this.back = true;
		this.hideFooter = true; // No footer buttons for comments view
	}
}

/**
 * Example 3: Shop the Spec Drawer
 * For displaying product/part specifications
 * Pull up to expand, swipe down to close
 */
export class ShopSpecDrawer extends Drawer
{
	declareProps()
	{
		super.declareProps();
		this.title = 'Shop the Spec';
		this.description = 'Share your build with the community';
		this.size = 'lg';
		this.back = true;
		this.hideFooter = true;
	}
}

// Content for shop spec modal
export const ShopSpecContent = () => [
	// Description
	P({ class: 'text-sm text-muted-foreground mb-6' },
		'Share your build with the community! Add affiliate links to the parts and modifications you\'ve installed to help others recreate your look while earning commissions.'
	),

	// Parts List
	Div({ class: 'space-y-3 mb-6' }, [
		// Part Item 1
		Div({ class: 'flex items-center justify-between p-4 bg-muted/30 rounded-lg' }, [
			Div({ class: 'flex items-center gap-3' }, [
				Div({ class: 'w-10 h-10 bg-muted rounded-lg flex items-center justify-center' }, '📦'),
				Div([
					Div({ class: 'font-semibold text-sm' }, 'Wheels & Tires'),
					Div({ class: 'text-xs text-muted-foreground' }, 'HRE P101 19" Wheels')
				])
			]),
			Button({ variant: 'outline', size: 'sm', icon: Icons.arrows.topRight }, 'Shop')
		]),

		// Part Item 2
		Div({ class: 'flex items-center justify-between p-4 bg-muted/30 rounded-lg' }, [
			Div({ class: 'flex items-center gap-3' }, [
				Div({ class: 'w-10 h-10 bg-muted rounded-lg flex items-center justify-center' }, '🔧'),
				Div([
					Div({ class: 'font-semibold text-sm' }, 'Suspension'),
					Div({ class: 'text-xs text-muted-foreground' }, 'KW Coilover System')
				])
			]),
			Button({ variant: 'outline', size: 'sm', icon: Icons.arrows.topRight }, 'Shop')
		]),

		// Part Item 3
		Div({ class: 'flex items-center justify-between p-4 bg-muted/30 rounded-lg' }, [
			Div({ class: 'flex items-center gap-3' }, [
				Div({ class: 'w-10 h-10 bg-muted rounded-lg flex items-center justify-center' }, '💨'),
				Div([
					Div({ class: 'font-semibold text-sm' }, 'Exhaust System'),
					Div({ class: 'text-xs text-muted-foreground' }, 'Akrapovic Evolution')
				])
			]),
			Button({ variant: 'outline', size: 'sm', icon: Icons.arrows.topRight }, 'Shop')
		])
	]),

	// Add More Button
	BaseButton({
		type: 'button',
		class: 'w-full py-3 border-2 border-dashed border-muted rounded-lg text-sm font-medium hover:bg-muted/20 transition-colors',
		click: () => console.log('Add more parts')
	}, '+ Add More Parts')
];

/**
 * Usage Example:
 *
 * // Open an offer drawer
 * const drawer = new OfferDrawer();
 * drawer.children = OfferDrawerContent();
 * drawer.open();
 *
 * // Open a comments drawer
 * const commentsDrawer = new CommentsDrawer();
 * commentsDrawer.children = [
 *   // Your comments list here
 * ];
 * commentsDrawer.open();
 *
 * // Open shop spec drawer
 * const shopDrawer = new ShopSpecDrawer();
 * shopDrawer.children = ShopSpecContent();
 * shopDrawer.open();
 *
 * // Customize swipe behavior
 * const customDrawer = new OfferDrawer();
 * customDrawer.closeThreshold = 200; // Require 200px drag to close
 * customDrawer.swipeToClose = true; // Enable swipe gesture (default)
 * customDrawer.open();
 */

