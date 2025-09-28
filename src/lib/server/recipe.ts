import z from 'zod';

const ingredientSchema = z.object({
	name: z.string().min(1, 'Le nom est requis'),
	quantity: z.coerce.number().positive('La quantité doit être positive'),
	unit: z.string().nullable(),
	order: z.coerce.number()
});

const stepSchema = z.object({
	step_number: z.coerce.number(),
	description: z.string().min(3, "La description de l'étape est requise")
});

export const recipeSchema = z.object({
	title: z.string().min(3, 'Le titre est requis'),
	description: z.string().nullable(),
	prep_time_minutes: z.coerce.number().min(0),
	cook_time_minutes: z.coerce.number().min(0),
	servings: z.coerce.number().positive(),
	difficulty: z.enum(['facile', 'moyen', 'difficile']),
	cost: z.enum(['bon marché', 'moyen', 'cher']),
	type: z.enum(['entrée', 'plat', 'dessert', 'boisson', 'accompagnement']),
	status: z.enum(['draft', 'published']),
	is_vegetarian: z.boolean(),
	is_vegan: z.boolean(),
	ingredients: z.array(ingredientSchema),
	steps: z.array(stepSchema)
});
