import type { Snippet } from 'svelte';

export type SliderRootProps = {
	/**
	 * The class name applied to the slider element.
	 */
	class?: string;

	/**
	 * The content to render inside the slider.
	 */
	children?: Snippet;
};

export type SliderCardProps = {
	/**
	 * The URL the card should link to when clicked. When provided,
	 * the card is rendered as an anchor element.
	 */
	href?: string;

	/**
	 * Whether to open the link in a new tab.
	 *
	 * @default false
	 */
	blank?: boolean;

	/**
	 * The class name applied to the card element.
	 */
	class?: string;

	/**
	 * The content to render in the card's header.
	 */
	header?: Snippet;

	/**
	 * The main content of the card.
	 */
	content: Snippet;

	/**
	 * The content to render in the card's footer.
	 */
	footer?: Snippet;
};
