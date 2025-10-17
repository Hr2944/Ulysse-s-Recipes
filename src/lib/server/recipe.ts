import z from 'zod';

const ingredientSchema = z.object({
	name: z.string().min(1, 'Le nom de l\'ingrédient est requis'),
	quantity: z.coerce.number().positive('La quantité de l\'ingrédient doit être positive'),
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
	servings: z.coerce.number().positive('Le nombre de personnes est requis et doit être positif'),
	difficulty: z.enum(['facile', 'moyen', 'difficile'], 'La difficulté est requise'),
	cost: z.enum(['bon marché', 'moyen', 'cher'], 'Le coût est requis'),
	type: z.enum(['entrée', 'plat', 'dessert', 'boisson', 'accompagnement'], 'Le type de plat est requis'),
	status: z.enum(['draft', 'published'], 'Le statut de la recette est requis'),
	is_vegetarian: z.boolean('Veuillez indiquer si la recette est végétarienne'),
	is_vegan: z.boolean('Veuillez indiquer si la recette est végan'),
	ingredients: z.array(ingredientSchema),
	steps: z.array(stepSchema)
});
