import type { RequestHandler } from '@sveltejs/kit';

const DISCORD_USER_ID = '1091709078058840106';

export const GET: RequestHandler = async () => {
	try {
		const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			if (response.status === 404) {
				console.error(
					'Lanyard 404: User not found. Join https://lanyard.rest Discord server to enable tracking.'
				);
			}
			throw new Error(`Lanyard API responded with ${response.status}`);
		}

		const data = await response.json();

		if (!data.success) {
			throw new Error('Lanyard API returned unsuccessful response');
		}

		const status: 'online' | 'offline' | 'idle' | 'dnd' = data.data.discord_status || 'offline';

		return new Response(JSON.stringify({ status, debug: data }), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'max-age=30, stale-while-revalidate=60'
			}
		});
	} catch {
		return new Response(JSON.stringify({ status: 'offline' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'max-age=30, stale-while-revalidate=60'
			}
		});
	}
};
