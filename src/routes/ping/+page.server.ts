import type { Actions } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const question = formData.get('question');

		if (!question || typeof question !== 'string') {
			return fail(400, { error: 'Question is required' });
		}

		if (question.length > 200) {
			return fail(400, { error: 'Question exceeds maximum length' });
		}

		const url = env.PING_ENDPOINT_URL;
		const token = env.PING_BEARER_TOKEN;

		if (!token) {
			console.error('PING_BEARER_TOKEN environment variable is not set');
			return fail(500, { error: 'Server configuration error' });
		}

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ question: question.trim() })
		});

		if (response.status === 429) {
			return fail(429, { error: 'Too many requests, try again later' });
		}

		if (!response.ok) {
			const errorText = await response.text().catch(() => 'Unknown error');
			console.error(`Ping service error: ${response.status} - ${errorText}`);
			return fail(500, { error: 'Failed to submit question' });
		}

		return { success: true };
	}
};
