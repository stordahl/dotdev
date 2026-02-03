<script lang="ts">
	import Seo from '$lib/Seo.svelte';
	import { enhance } from '$app/forms';

	let { form } = $props();

	let question = $state('');
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	const MAX_CHARS = 200;

	let charCount = $derived(question.length);
	let isOverLimit = $derived(charCount > MAX_CHARS);

	$effect(() => {
		if (form?.success) {
			status = 'success';
			question = '';
		} else if (form?.error) {
			status = 'error';
			errorMessage = form.error;
		}
	});

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		question = target.value;
		if (status === 'success' || status === 'error') {
			status = 'idle';
			errorMessage = '';
		}
	}
</script>

<Seo
	title="Ping Me | Jacob Stordahl"
	description="Ask me a question anonymously."
	ogImage="/images/og/base.jpg"
	author="Jacob Stordahl"
/>

<div class="question-form">
	<h3>Ping Me</h3>
	<p class="description">
		Got a question? Ask and I'll get a push notification on my phone. Look for replies on <a
			href="/bluesky">Bluesky</a
		>.
	</p>
	<p class="disclaimer">I reserve the right to post anything you send.</p>

	{#if status === 'success'}
		<div class="message success">
			<p>Thanks! Your question has been sent.</p>
		</div>
	{:else}
		<form
			method="POST"
			use:enhance={() => {
				status = 'loading';
				errorMessage = '';
				return async ({ result, update }) => {
					await update();
					if (result.type === 'success') {
						status = 'success';
						question = '';
					} else if (result.type === 'failure') {
						status = 'error';
						const errorData = result.data as { error?: string } | undefined;
						errorMessage = errorData?.error || 'Something went wrong';
					}
				};
			}}
		>
			<div class="textarea-wrapper">
				<textarea
					name="question"
					value={question}
					oninput={handleInput}
					placeholder="Type your question here..."
					rows="3"
					disabled={status === 'loading'}
					aria-describedby="char-count"
				></textarea>
				<span id="char-count" class="char-count" class:over-limit={isOverLimit}>
					{charCount}/{MAX_CHARS}
				</span>
			</div>

			{#if status === 'error'}
				<div class="message error">
					<p>{errorMessage}</p>
				</div>
			{/if}

			<button type="submit" disabled={status === 'loading' || !question.trim() || isOverLimit}>
				Send
			</button>
		</form>
	{/if}
</div>

<style>
	.question-form {
		margin: auto;
		margin-top: 3rem;
		max-width: 700px;
	}

	h3 {
		font-family: 'Basheq', serif;
		font-size: clamp(2.5rem, calc(2.5rem + 2vw), 4rem);
		font-weight: 300;
		text-align: center;
	}

	.description {
		font-size: 1.5rem;
		font-weight: 300;
		text-align: center;
		text-wrap: balance;
		margin-bottom: 1rem;
	}

	.disclaimer {
		font-size: 1rem;
		text-align: center;
		color: var(--light-grey);
		margin-bottom: 1rem;
	}

	.textarea-wrapper {
		position: relative;
		margin-bottom: 1rem;
	}

	textarea {
		width: 100%;
		padding: 1rem;
		padding-bottom: 2rem;
		background-color: transparent;
		border: 1px solid var(--grey);
		border-radius: 0px;
		color: var(--white);
		font-size: 1.1rem;
		font-family: 'Fraunces', serif;
		resize: vertical;
		transition: border-color 0.2s;
		resize: none;
	}

	textarea:focus {
		outline: none;
		border-color: var(--white);
	}

	textarea::placeholder {
		color: var(--light-grey);
		opacity: 0.7;
	}

	textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.char-count {
		position: absolute;
		bottom: 0.75rem;
		right: 1rem;
		font-size: 0.85rem;
		color: var(--light-grey);
		font-family: monospace;
	}

	.char-count.over-limit {
		color: var(--orange);
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: none;
		border: 1px solid var(--orange);
		color: var(--white);
		border-radius: 0px;
		font-size: 1.1rem;
		font-family: 'Fraunces', serif;
		font-weight: 500;
		cursor: pointer;
	}

	button:hover:not(:disabled) {
		opacity: 0.9;
	}

	button:active:not(:disabled) {
		transform: scale(0.98);
	}

	button:disabled {
		opacity: 0.5;
		cursor: initial;
	}

	.message {
		padding: 1rem;
		border-radius: 0px;
		margin-bottom: 1rem;
		font-size: 1rem;
	}

	.message.success {
		background-color: rgba(46, 125, 50, 0.2);
		border: 1px solid rgba(46, 125, 50, 0.5);
		color: #81c784;
	}

	.message.error {
		background-color: rgba(235, 94, 40, 0.2);
		border: 1px solid rgba(235, 94, 40, 0.5);
		color: var(--orange);
	}

	.message p {
		margin: 0;
		font-size: 1rem;
	}
</style>
