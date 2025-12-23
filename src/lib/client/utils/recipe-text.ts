// Cache to store compiled regexes so we don't rebuild them for every step/render
const regexCache = new Map<string, RegExp>();

const aposChars = '[\u0027\u2019]';
const elisions = [`d${aposChars}`, `l${aposChars}`];
const words = [
	'de la',
	'de',
	'du',
	'des',
	'le',
	'la',
	'les',
	'un',
	'une',
	'aux',
	'au',
	'à la',
	'à'
];
const accents: Record<string, string> = {
	a: '[aàâä]',
	e: '[eéèêë]',
	i: '[iîï]',
	o: '[oôö]',
	u: '[uùûü]',
	c: '[cç]',
	n: '[nñ]'
};
const aposCharsFuzzyRegExp = '\\u0027\\u2019';
const fullPrefix = `(?:(?:de[\\s\\u00A0]+la|de|du|des|le|la|les|un|une|aux|au|à[\\s\\u00A0]+la|à)[\\s\\u00A0]+)?(?:d[${aposChars}]|l[${aposChars}])?`;
const boundary = `(^|[\\s\\u00A0${aposCharsFuzzyRegExp}"(\\[>,:;!?.\\-])`;

const elisionsRegExp = new RegExp(`^(${elisions.join('|')})`, 'i');
const wordsRegExp = new RegExp(`^(${words.join('|')})[\\s\\u00A0]+`, 'i');

export function formatQuantity(qty: number): string {
	if (qty === null || qty === undefined) return '';
	const roundedQty = Math.round(qty * 100) / 100;
	if (roundedQty === 0.5) return '½';
	if (roundedQty === 0.25) return '¼';
	if (roundedQty === 0.75) return '¾';
	return String(roundedQty);
}

function cleanIngredientName(name: string): string {
	const cleaned = name.replace(elisionsRegExp, '');
	// Remove prefixes
	return cleaned.replace(wordsRegExp, '').trim();
}

function getCharRegex(char: string): string {
	return accents[char.toLowerCase()] || char;
}

function createFuzzyRegex(ingredientName: string): RegExp {
	// Check cache first
	if (regexCache.has(ingredientName)) return regexCache.get(ingredientName)!;

	const cleanedName = cleanIngredientName(ingredientName);
	if (!cleanedName.trim()) return /(?!)/;

	const words = cleanedName.split(/[\s\u00A0]+/);
	const regexParts = words.map((word) => {
		let root = word;
		if (word.length > 2) root = word.replace(/[eéèêë]*[sx]*$/i, '');

		let pattern = '';
		for (const char of root) pattern += getCharRegex(char);

		pattern += word.length > 2 ? '(?:[eéèêë]*(?:s|x)?)?' : '(?:s|x)?';
		return pattern;
	});

	const corePattern = regexParts.join('[\\s\\u00A0]+');

	const regex = new RegExp(
		`${boundary}(${fullPrefix})(${corePattern})(?![\\w\u00C0-\u00FF])`,
		'gi'
	);

	// Save to cache
	regexCache.set(ingredientName, regex);
	return regex;
}

export function renderStepText(description: string, ingredients: any[]): string {
	let renderedText = description;
	if (!ingredients?.length) return description;

	for (const ingredient of ingredients) {
		try {
			const regex = createFuzzyRegex(ingredient.name);
			renderedText = renderedText.replace(regex, (match, separator, prefix, coreText) => {
				if (match.includes('text-primary')) return match; // Prevent double replacement

				const safeSeparator = separator || '';
				const safePrefix = prefix || '';
				const formattedQty = formatQuantity(ingredient.quantity);
				const unit = ingredient.unit ? ` ${ingredient.unit}` : '';

				return `${safeSeparator}${safePrefix}<span class="font-bold text-primary">${coreText} (${formattedQty}${unit})</span>`;
			});
		} catch (e) {
			console.warn(`Could not create regex for ${ingredient.name}`, e);
		}
	}
	return renderedText;
}
