import type { LayoutServerLoad } from './$types';
import { validateSession } from '$lib/server/auth';

export const load: LayoutServerLoad = async (event) => {
	const authenticated = await validateSession(event);
	return { authenticated };
};
