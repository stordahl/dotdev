import { env } from '$env/dynamic/private';
import type { SembleCard } from '../types';

const API_BASE = 'https://api.semble.so/xrpc';
const HANDLE = 'stordahl.dev';
const READING_LIST_RKEY = '3mrv5hzbfdz27';

interface SembleCollectionItem {
  id: string;
  uri: string;
  name: string;
}

function apiHeaders(): Record<string, string> {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-API-Key': env.SEMBLE_API_KEY ?? ''
  };
}

async function listCollections(): Promise<SembleCollectionItem[]> {
  const url = new URL(`${API_BASE}/network.cosmik.collection.listMine`);
  url.searchParams.set('limit', '100');

  const response = await fetch(url.toString(), { headers: apiHeaders() });
  if (!response.ok) return [];

  const data = await response.json();
  return data.collections ?? [];
}

async function findCollectionIdByRkey(rkey: string): Promise<string | null> {
  const collections = await listCollections();
  const found = collections.find((c) => c.uri.endsWith('/' + rkey));
  return found?.id ?? null;
}

export async function getOldestReadingListCard(): Promise<(SembleCard & { id: string }) | null> {
  const url = new URL(`${API_BASE}/network.cosmik.collection.getByAtUri`);
  url.searchParams.set('handle', HANDLE);
  url.searchParams.set('recordKey', READING_LIST_RKEY);
  url.searchParams.set('sortBy', 'createdAt');
  url.searchParams.set('sortOrder', 'asc');
  url.searchParams.set('limit', '1');

  const response = await fetch(url.toString(), { headers: apiHeaders() });
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.urlCards?.length) return null;

  const card = data.urlCards[0];
  const content = card.cardContent ?? {};

  return {
    id: card.id,
    url: content.url ?? card.url ?? '',
    title: content.title ?? '',
    author: content.author,
    siteName: content.siteName,
    imageUrl: content.imageUrl,
    description: content.description,
    createdAt: card.createdAt ?? ''
  };
}

export async function getLikedCollectionId(): Promise<string | null> {
  const rkey = env.SEMBLE_LIKED_COLLECTION_RKEY;
  if (!rkey) return null;
  return findCollectionIdByRkey(rkey);
}

export async function markCard(
  action: 'like' | 'remove',
  cardId: string,
  likedCollectionId?: string
): Promise<boolean> {
  const readingListId = await findCollectionIdByRkey(READING_LIST_RKEY);
  if (!readingListId) {
    return false;
  }

  const body: Record<string, unknown> = {
    cardId,
    removeFromCollections: [readingListId]
  };

  if (action === 'like' && likedCollectionId) {
    body.addToCollections = [likedCollectionId];
  }

  const response = await fetch(`${API_BASE}/network.cosmik.card.updateUrlAssociations`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify(body)
  });

  return response.ok;
}
