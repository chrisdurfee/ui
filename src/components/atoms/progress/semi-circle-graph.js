import { Div } from "@base-framework/atoms";
import { Atom } from "@base-framework/base";
import { getValue } from "./circle-graph.js";

/**
 * This will get the semi-circle progress graph with Tailwind styling.
 *
 * @param {number} progress
 * @param {string} className
 * @returns {object}
 */
const SemiCircleProgress = (progress, className) =>
{
	const percent = progress;
	const radius = 16; // Radius of the arc
	const arcLength = Math.PI * radius; // Half circumference
	const bar = (percent / 100) * arcLength;
	const arcPath = "M 2 20 A 16 16 0 0 1 34 20";

	const startSvg = `
	<svg class="w-40 h-auto mx-auto" viewBox="0 0 36 22" xmlns="http://www.w3.org/2000/svg">
		<!-- Background Arc -->
		<path
			d="${arcPath}"
			fill="none"
			stroke="currentColor"
			stroke-width="4"
			class="bg-muted"
			stroke-opacity="0.2"
			stroke-linecap="round"
		/>
		<!-- Progress Arc -->
		<path
			d="${arcPath}"
			fill="none"
			stroke="currentColor"
			stroke-width="4"
			stroke-dasharray="${arcLength}"
			stroke-dashoffset="${arcLength - bar}"
			stroke-linecap="round"
			class="stroke-primary ${className}"
		/>
		<!-- Percentage Text -->
		<text
			x="18"
			y="18"
			class="text-[0.25em] font-medium fill-primary"
			text-anchor="middle"
			dominant-baseline="middle">
			${percent}%
		</text>
	</svg>
	`;

	return Div({
		class: `semi-circle-graph text-inherit`,
		html: startSvg,
	});
};


/**
 * This will create a semi-circle graph with Tailwind styling.
 *
 * @param {object} props
 * @returns {object}
 */
export const SemiCircleGraph = Atom((props) => {
	// @ts-ignore
	const startingValue = props.progress || 0;
	// @ts-ignore
	const className = props.class || "";
	const empty = SemiCircleProgress(startingValue, className);

	return Div({
		class: "semi-circle-graph-wrap",
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

				return SemiCircleProgress(val, className);
			},
		],
	}, [empty]);
});
