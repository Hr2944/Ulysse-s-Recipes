import { vegan_badge, veggie_badge } from '$lib/assets/svg-paths';

type Badge = {
	label: string;
	svgPath: string;
}

export const veggieBadge: Badge = {
	label: 'Végétarien',
	svgPath: veggie_badge
};

export const veganBadge: Badge = {
	label: 'Végan',
	svgPath: vegan_badge
};
