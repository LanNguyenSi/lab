/**
 * Recipe schema validation using Zod
 * 
 * Ensures all recipes follow the correct format and contain required information
 * for safe allergen detection.
 */

import { z } from 'zod';
import { StandardAllergen } from './types';

/**
 * Valid allergen values
 */
const allergenSchema = z.enum([
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soybeans',
  'dairy',
  'nuts',
  'celery',
  'mustard',
  'sesame',
  'sulphites',
  'lupin',
  'molluscs'
]);

/**
 * Ingredient schema
 */
export const ingredientSchema = z.object({
  name: z.string()
    .min(1, 'Ingredient name is required')
    .max(100, 'Ingredient name too long'),
  
  amount: z.string()
    .min(1, 'Amount is required')
    .max(50, 'Amount description too long'),
  
  allergens: z.array(allergenSchema)
    .default([]),
  
  notes: z.string()
    .max(500, 'Notes too long')
    .optional(),
  
  crossContamination: z.array(allergenSchema)
    .optional()
    .default([]),
  
  optional: z.boolean()
    .optional()
    .default(false)
});

/**
 * Recipe schema
 */
export const recipeSchema = z.object({
  name: z.string()
    .min(1, 'Recipe name is required')
    .max(200, 'Recipe name too long'),
  
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category name too long'),
  
  servings: z.number()
    .int('Servings must be a whole number')
    .positive('Servings must be positive')
    .max(100, 'Servings too large'),
  
  prepTime: z.number()
    .int('Prep time must be a whole number')
    .positive('Prep time must be positive')
    .max(1440, 'Prep time too large (max 24 hours)'),
  
  ingredients: z.array(ingredientSchema)
    .min(1, 'Recipe must have at least one ingredient')
    .max(100, 'Too many ingredients'),
  
  warnings: z.array(z.string().max(500))
    .optional()
    .default([]),
  
  description: z.string()
    .max(1000, 'Description too long')
    .optional()
});

/**
 * Type inference from schemas
 */
export type IngredientInput = z.infer<typeof ingredientSchema>;
export type RecipeInput = z.infer<typeof recipeSchema>;

/**
 * Validate a recipe object
 */
export function validateRecipe(data: unknown): RecipeInput {
  return recipeSchema.parse(data);
}

/**
 * Validate a recipe with detailed error reporting
 */
export function validateRecipeWithErrors(data: unknown): {
  success: boolean;
  data?: RecipeInput;
  errors?: string[];
} {
  try {
    const validated = recipeSchema.parse(data);
    return {
      success: true,
      data: validated
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => 
        `${err.path.join('.')}: ${err.message}`
      );
      return {
        success: false,
        errors
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error']
    };
  }
}

/**
 * Check if a value is a valid allergen
 */
export function isValidAllergen(value: string): value is StandardAllergen {
  return allergenSchema.safeParse(value).success;
}

/**
 * Get all valid allergen names
 */
export function getAllergenNames(): StandardAllergen[] {
  return allergenSchema.options as StandardAllergen[];
}
