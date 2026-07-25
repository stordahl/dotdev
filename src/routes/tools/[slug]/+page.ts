import type { PageLoad } from './$types';
import { allProjects } from 'content-collections';
import { error } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
  const project = allProjects.find((p) => p.slug === params.slug && p.type === 'tools');
  if (!project) {
    error(404, 'Not found');
  }
  return { project };
};
