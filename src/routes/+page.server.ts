import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async () => {


	redirect(302, '/chess');
};