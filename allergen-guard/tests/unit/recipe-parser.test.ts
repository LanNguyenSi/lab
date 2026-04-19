/**
 * Tests for recipe parser
 */

import { parseRecipeString, RecipeParseError } from '../../src/core/recipe-parser';

describe('Recipe Parser', () => {
  describe('parseRecipeString', () => {
    it('should parse valid recipe YAML', () => {
      const yaml = `
name: Test Recipe
category: test
servings: 2
prepTime: 10
ingredients:
  - name: Flour
    amount: 100g
    allergens:
      - gluten
`;
      
      const recipe = parseRecipeString(yaml);
      
      expect(recipe.name).toBe('Test Recipe');
      expect(recipe.category).toBe('test');
      expect(recipe.servings).toBe(2);
      expect(recipe.prepTime).toBe(10);
      expect(recipe.ingredients).toHaveLength(1);
      expect(recipe.ingredients[0].name).toBe('Flour');
      expect(recipe.ingredients[0].allergens).toContain('gluten');
    });
    
    it('should reject recipe without name', () => {
      const yaml = `
category: test
servings: 2
prepTime: 10
ingredients:
  - name: Flour
    amount: 100g
    allergens: []
`;
      
      expect(() => parseRecipeString(yaml)).toThrow(RecipeParseError);
    });
    
    it('should reject recipe without ingredients', () => {
      const yaml = `
name: Test Recipe
category: test
servings: 2
prepTime: 10
ingredients: []
`;
      
      expect(() => parseRecipeString(yaml)).toThrow(RecipeParseError);
    });
    
    it('should reject invalid allergen names', () => {
      const yaml = `
name: Test Recipe
category: test
servings: 2
prepTime: 10
ingredients:
  - name: Mystery Food
    amount: 100g
    allergens:
      - notarealthing
`;
      
      expect(() => parseRecipeString(yaml)).toThrow(RecipeParseError);
    });
    
    it('should handle optional fields', () => {
      const yaml = `
name: Simple Recipe
category: test
servings: 1
prepTime: 5
ingredients:
  - name: Water
    amount: 1 cup
    allergens: []
    notes: Just water
    optional: true
description: A very simple recipe
warnings:
  - This is a test warning
`;
      
      const recipe = parseRecipeString(yaml);
      
      expect(recipe.description).toBe('A very simple recipe');
      expect(recipe.warnings).toHaveLength(1);
      expect(recipe.ingredients[0].optional).toBe(true);
      expect(recipe.ingredients[0].notes).toBe('Just water');
    });
    
    it('should handle cross-contamination warnings', () => {
      const yaml = `
name: Test Recipe
category: test
servings: 1
prepTime: 5
ingredients:
  - name: Bacon
    amount: 100g
    allergens: []
    crossContamination:
      - gluten
`;
      
      const recipe = parseRecipeString(yaml);
      
      expect(recipe.ingredients[0].crossContamination).toContain('gluten');
    });
  });
});
