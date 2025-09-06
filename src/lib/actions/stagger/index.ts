import type { Action } from 'svelte/action';
import { animate, inView, stagger as _stagger } from 'motion';
import SplitType from 'split-type';

type TextStaggerOptions = {
	/**
	 * @description Extra height given to a line to account for character with descenders (g, j, q, p, y, & sometimes f)
	 * @default 10
	 */
	lineOffset: number;

	/**
	 * @description Passed to motion's inView function as the margin option. Determines when the animation starts
	 */
	inViewOffset: number;

	/**
	 * @description Passed to motion's stagger function in the animation
	 * @default 0.07
	 */
	staggerDelay: number;

	/***/
	yoyo: boolean;
};

export const stagger: Action<HTMLElement, TextStaggerOptions> = (
	node: HTMLElement,
	{ inViewOffset, lineOffset, staggerDelay, yoyo } = {
		inViewOffset: -200,
		lineOffset: 10,
		staggerDelay: 0.07,
		yoyo: false
	}
) => {
	if (typeof node?.textContent !== 'string') {
		console.error('no text content in node');
		return;
	}

	node.ariaLabel = node.innerText;
	const text = new SplitType(node);
	const lineHeight = parseInt(window.getComputedStyle(node).lineHeight);
	const offset = lineHeight + lineOffset;

	if (text?.lines)
		text.lines.forEach((line) => {
			line.style.overflowY = 'hidden';
			line.style.height = `${offset}px`;
		});

	if (text?.chars)
		text.chars.forEach((char) => {
			char.style.transform = `translateY(${lineHeight}px)`;
		});

	let hasPlayed = false;

	inView(
		node,
		({ target }) => {
			if (!hasPlayed || yoyo) {
				textStaggerAnimation('forward', offset, staggerDelay, target);
				hasPlayed = true;
			}
			return () => {
				if (yoyo) textStaggerAnimation('backward', offset, staggerDelay, target);
			};
		},
		{ margin: `${inViewOffset}px` }
	);
};

function textStaggerAnimation(
	direction: 'forward' | 'backward',
	offset: number,
	staggerDelay: number,
	target: Element
) {
	const y = direction === 'forward' ? [offset, 0] : [0, offset];
	animate(target.querySelectorAll('.char'), { y }, { delay: _stagger(staggerDelay) });
}
