import { Div } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";

/**
 * This will get the value. Zero is a valid progress value.
 *
 * @param {*} val
 * @returns {number|null}
 */
export const getValue = (val) =>
{
	if (val === null || val === undefined || val === '')
	{
		return null;
	}

	const num = Number(val);
	return isNaN(num) ? null : num;
};

/**
 * This will get the progress bar with Tailwind styling.
 *
 * @param {number} progress
 * @param {string} className
 * @returns {object}
 */
const CircleProgress = (progress, className) =>
{
	const percent = progress;
	const radius = 16; // Radius of the circle
	const circumference = 2 * Math.PI * radius;
	const bar = (percent / 100) * circumference;

	const startSvg = `
	<svg class="w-40 h-40 mx-auto" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
		<!-- Background Circle -->
		<circle
			cx="18"
			cy="18"
			r="${radius}"
			fill="none"
			stroke="currentColor"
			stroke-width="4"
			class="bg-muted"
			stroke-opacity="0.2"
		/>
		<!-- Progress Circle -->
		<circle
			cx="18"
			cy="18"
			r="${radius}"
			fill="none"
			stroke="currentColor"
			stroke-width="4"
			stroke-dasharray="${circumference}"
			stroke-dashoffset="${circumference - bar}"
			stroke-linecap="round"
			class="stroke-primary ${className}"
		/>
		<!-- Percentage Text -->
		<text
			x="18"
			y="20"
			class="text-[0.25em] font-medium fill-primary"
			text-anchor="middle"
			dominant-baseline="middle">
			${percent}%
		</text>
	</svg>
	`;

	return Div({
		class: `circle-graph text-inherit`,
		html: startSvg,
	});
};


/**
 * This will create a circle graph with Tailwind styling.
 *
 * @param {object} props
 * @returns {object}
 */
export const CircleGraph = Atom((props) => {
	// @ts-ignore
	const startingValue = props.progress || 0;
	// @ts-ignore
	const className = props.class || "";
	const empty = CircleProgress(startingValue, className);

	return Div({
		class: "circle-graph-wrap",
		onSet: [
			// @ts-ignore
			props.prop,
			(val) =>
			{
				val = getValue(val);
				if (val === null)
				{
					return empty;
				}

				return CircleProgress(val, className);
			},
		],
	}, [empty]);
});
