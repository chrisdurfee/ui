import { Div, H2, P } from "@base-framework/atoms";
import { UnderlinedTab } from "./underlined-tab.js";
import { UnderlinedTabGroup } from "./underlined-tab-group.js";
import { UnderlinedButtonTab } from "./underlined-button-tab.js";

/**
 * Example components for tab content
 */
const ExampleContent1 = () => (
	Div({ class: 'p-4' }, [
		H2({ class: 'text-xl font-semibold mb-2' }, 'Posts Content'),
		P({ class: 'text-muted-foreground' }, 'This is the content for the Posts tab.')
	])
);

const ExampleContent2 = () => (
	Div({ class: 'p-4' }, [
		H2({ class: 'text-xl font-semibold mb-2' }, 'Stories Content'),
		P({ class: 'text-muted-foreground' }, 'This is the content for the Stories tab.')
	])
);

const ExampleContent3 = () => (
	Div({ class: 'p-4' }, [
		H2({ class: 'text-xl font-semibold mb-2' }, 'Reels Content'),
		P({ class: 'text-muted-foreground' }, 'This is the content for the Reels tab.')
	])
);

const ExampleContent4 = () => (
	Div({ class: 'p-4' }, [
		H2({ class: 'text-xl font-semibold mb-2' }, 'Photos Content'),
		P({ class: 'text-muted-foreground' }, 'This is the content for the Photos tab.')
	])
);

/**
 * Underlined Tab Examples
 */
export const UnderlinedTabExamples = () => (
	Div({ class: 'space-y-8 p-6' }, [
		
		// Routing Tabs Example
		Div({ class: 'space-y-4' }, [
			H2({ class: 'text-2xl font-bold' }, 'Underlined Routing Tabs'),
			P({ class: 'text-muted-foreground mb-4' }, 'These tabs route to different pages (replace with your actual routes):'),
			
			new UnderlinedTab({
				class: 'w-full',
				options: [
					{
						label: 'Posts',
						href: '/posts',
						exact: true,
						component: ExampleContent1,
						uri: 'posts'
					},
					{
						label: 'Stories', 
						href: '/stories',
						exact: true,
						component: ExampleContent2,
						uri: 'stories'
					},
					{
						label: 'Reels',
						href: '/reels', 
						exact: true,
						component: ExampleContent3,
						uri: 'reels'
					},
					{
						label: 'Photos',
						href: '/photos',
						exact: true, 
						component: ExampleContent4,
						uri: 'photos'
					}
				]
			})
		]),

		// Non-routing Button Tab Example 
		Div({ class: 'space-y-4' }, [
			H2({ class: 'text-2xl font-bold' }, 'Underlined Button Tabs'),
			P({ class: 'text-muted-foreground mb-4' }, 'These tabs switch content without routing:'),
			
			new UnderlinedButtonTab({
				class: 'w-full',
				onSelect: (value, index) => {
					console.log('Selected tab:', value, 'at index:', index);
				},
				options: [
					{
						label: 'Posts',
						value: 'posts',
						selected: true,
						component: ExampleContent1
					},
					{
						label: 'Stories',
						value: 'stories', 
						component: ExampleContent2
					},
					{
						label: 'Reels',
						value: 'reels',
						component: ExampleContent3
					},
					{
						label: 'Photos',
						value: 'photos',
						component: ExampleContent4
					}
				]
			})
		]),

		// Navigation Only Example
		Div({ class: 'space-y-4' }, [
			H2({ class: 'text-2xl font-bold' }, 'Underlined Tab Group (Navigation Only)'),
			P({ class: 'text-muted-foreground mb-4' }, 'Just the navigation without content switching:'),
			
			new UnderlinedTabGroup({
				class: 'w-full',
				onSelect: (value, index) => {
					console.log('Selected tab:', value, 'at index:', index);
				},
				options: [
					{
						label: 'Posts',
						value: 'posts',
						selected: true
					},
					{
						label: 'Stories',
						value: 'stories'
					},
					{
						label: 'Reels',
						value: 'reels'
					},
					{
						label: 'Photos',
						value: 'photos'
					}
				]
			})
		])
	])
);

export default UnderlinedTabExamples;
