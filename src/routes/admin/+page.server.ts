import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { verifyPassword, createSession, validateSession } from '$lib/server/auth';
import { getDraftStore } from '$lib/server/draft-store';
import { getOldestReadingListCard, getLikedCollectionId, markCard } from '$lib/server/semble';

export async function load(event) {
  const authenticated = await validateSession(event);

  if (!authenticated) {
    return { authenticated: false, drafts: [], readingListItem: null, hasLikedCollection: false };
  }

  const store = getDraftStore(event);
  const [drafts, readingListItem, likedCollectionId] = await Promise.all([
    store.list(),
    getOldestReadingListCard(),
    getLikedCollectionId()
  ]);
  return {
    authenticated: true,
    drafts,
    readingListItem,
    hasLikedCollection: likedCollectionId !== null
  };
}

export const actions = {
  login: async (event) => {
    const data = await event.request.formData();
    const password = data.get('password');

    if (!password || !verifyPassword(String(password))) {
      return fail(401, { error: 'Invalid password' });
    }

    const token = await createSession(event);

    event.cookies.set('admin_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: !dev,
      maxAge: 60 * 60 * 24
    });

    throw redirect(302, '/admin');
  },

  like: async (event) => {
    const authenticated = await validateSession(event);
    if (!authenticated) return fail(401);

    const data = await event.request.formData();
    const cardId = data.get('cardId');

    if (!cardId) {
      return fail(400, { error: 'Missing cardId' });
    }

    const likedCollectionId = await getLikedCollectionId();
    if (!likedCollectionId) {
      return fail(400, { error: 'No Liked collection found' });
    }

    const ok = await markCard('like', String(cardId), likedCollectionId);
    if (!ok) {
      return fail(500, { error: 'Failed to move card' });
    }

    throw redirect(302, '/admin');
  },

  remove: async (event) => {
    const authenticated = await validateSession(event);
    if (!authenticated) return fail(401);

    const data = await event.request.formData();
    const cardId = data.get('cardId');

    if (!cardId) {
      return fail(400, { error: 'Missing cardId' });
    }

    const ok = await markCard('remove', String(cardId));
    if (!ok) {
      return fail(500, { error: 'Failed to remove card' });
    }

    throw redirect(302, '/admin');
  }
};
