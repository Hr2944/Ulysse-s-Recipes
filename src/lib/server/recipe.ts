import z from 'zod';

const ingredientSchema = z.object({
	name: z.string().min(1, "Le nom de l'ingrédient est requis"),
	quantity: z.coerce.number().positive("La quantité de l'ingrédient doit être positive"),
	unit: z.string().nullable(),
	order: z.coerce.number()
});

const stepSchema = z.object({
	step_number: z.coerce.number(),
	description: z.string().min(3, "La description de l'étape est requise")
});

export const recipeSchema = z.object({
	title: z.string().min(3, 'Le titre doit faire 3 caractères minimum'),
	description: z.string().nullable(),
	prep_time_minutes: z.coerce.number().min(0, 'Le temps de préparation est requis'),
	cook_time_minutes: z.coerce.number().min(0, 'Le temps de cuisson est requis'),
	servings: z.coerce.number().min(0, 'Le nombre de couverts est requis et doit être positif'),
	difficulty: z.enum(['facile', 'moyen', 'difficile'], 'La difficulté est requise'),
	cost: z.enum(['bon marché', 'moyen', 'cher'], 'Le coût est requis'),
	type: z.enum(
		['entrée', 'plat', 'dessert', 'boisson', 'accompagnement'],
		'Le type de plat est requis'
	),
	status: z.enum(['draft', 'published'], 'Le statut de la recette est requis'),
	is_vegetarian: z.boolean('Veuillez indiquer si la recette est végétarienne'),
	is_vegan: z.boolean('Veuillez indiquer si la recette est végan'),
	ingredients: z.array(ingredientSchema).min(1, 'La recette doit contenir au moins un ingrédient'),
	steps: z.array(stepSchema).min(1, 'La recette doit contenir au moins une étape')
});

const draftIngredientSchema = ingredientSchema.partial().extend({
	name: z.string().optional(), // Remove .min(1)
	quantity: z.coerce.number().optional() // Remove .positive()
});

const draftStepSchema = stepSchema.partial().extend({
	description: z.string().optional() // Remove .min(3)
});

export const draftRecipeSchema = recipeSchema.partial().extend({
	title: z.string().optional(), // Remove .min(3)
	servings: z.coerce.number().optional().default(1), // Remove .positive()

	difficulty: z.preprocess(
		(val) => (val === '' || val === null ? 'facile' : val),
		z.enum(['facile', 'moyen', 'difficile']).optional()
	),
	cost: z.preprocess(
		(val) => (val === '' || val === null ? 'bon marché' : val),
		z.enum(['bon marché', 'moyen', 'cher']).optional()
	),
	type: z.preprocess(
		(val) => (val === '' || val === null ? 'plat' : val),
		z.enum(['entrée', 'plat', 'dessert', 'boisson', 'accompagnement']).optional()
	),

	ingredients: z.array(draftIngredientSchema).optional(),
	steps: z.array(draftStepSchema).optional()
});
