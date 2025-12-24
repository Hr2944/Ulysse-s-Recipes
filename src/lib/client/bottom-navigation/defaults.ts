import { account, home, search } from '$lib/assets/svg-paths';

export const NAV_ITEMS = [
	{
		href: '/',
		regex: /^\/$/,
		label: 'Accueil',
		path: home
	},
	{
		href: '/search',
		regex: /^\/(search$|recipe\/.*)/,
		label: 'Recherche',
		path: search
	},
	{
		href: '/user',
		regex: /^\/(auth|user(\/.*)?)$/,
		label: 'Compte',
		path: account
	}
];
