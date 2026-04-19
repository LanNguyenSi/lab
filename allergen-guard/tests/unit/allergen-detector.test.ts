/**
 * Tests for allergen detector
 */

import {
  detectIngredientAllergens,
  detectRecipeAllergens,
  calculateSafetyRecommendation,
  getAllergenSummary,
  isSafeForCustomer
} from '../../src/core/allergen-detector';
import { Ingredient, Recipe, StandardAllergen } from '../../src/core/types';

describe('Allergen Detector', () => {
  describe('detectIngredientAllergens', () => {
    it('should detect direct allergen match', () => {
      const ingredient: Ingredient = {
        name: 'Spaghetti',
        amount: '200g',
        allergens: ['gluten']
      };
      
      const matches = detectIngredientAllergens(ingredient, ['gluten']);
      
      expect(matches).toHaveLength(1);
      expect(matches[0].allergen).toBe('gluten');
      expect(matches[0].severity).toBe('CRITICAL');
      expect(matches[0].isCrossContamination).toBe(false);
    });
    
    it('should detect cross-contamination', () => {
      const ingredient: Ingredient = {
        name: 'Bacon',
        amount: '100g',
        allergens: [],
        crossContamination: ['gluten']
      };
      
      const matches = detectIngredientAllergens(ingredient, ['gluten']);
      
      expect(matches).toHaveLength(1);
      expect(matches[0].severity).toBe('HIGH');
      expect(matches[0].isCrossContamination).toBe(true);
    });
    
    it('should return empty array if no allergen match', () => {
      const ingredient: Ingredient = {
        name: 'Water',
        amount: '1 cup',
        allergens: []
      };
      
      const matches = detectIngredientAllergens(ingredient, ['gluten', 'dairy']);
      
      expect(matches).toHaveLength(0);
    });
    
    it('should detect multiple allergens in one ingredient', () => {
      const ingredient: Ingredient = {
        name: 'Cheese',
        amount: '50g',
        allergens: ['dairy']
      };
      
      const matches = detectIngredientAllergens(ingredient, ['dairy', 'gluten']);
      
      expect(matches).toHaveLength(1);
      expect(matches[0].allergen).toBe('dairy');
    });
  });
  
  describe('detectRecipeAllergens', () => {
    it('should detect allergens across multiple ingredients', () => {
      const recipe: Recipe = {
        name: 'Test Recipe',
        category: 'test',
        servings: 2,
        prepTime: 10,
        ingredients: [
          {
            name: 'Pasta',
            amount: '200g',
            allergens: ['gluten']
          },
          {
            name: 'Eggs',
            amount: '2',
            allergens: ['eggs']
          },
          {
            name: 'Cheese',
            amount: '50g',
            allergens: ['dairy']
          }
        ]
      };
      
      const matches = detectRecipeAllergens(recipe, ['gluten', 'eggs', 'dairy']);
      
      expect(matches.length).toBeGreaterThanOrEqual(3);
      expect(matches.some(m => m.allergen === 'gluten')).toBe(true);
      expect(matches.some(m => m.allergen === 'eggs')).toBe(true);
      expect(matches.some(m => m.allergen === 'dairy')).toBe(true);
    });
    
    it('should return empty array for safe recipe', () => {
      const recipe: Recipe = {
        name: 'Safe Recipe',
        category: 'test',
        servings: 1,
        prepTime: 5,
        ingredients: [
          {
            name: 'Water',
            amount: '1 cup',
            allergens: []
          },
          {
            name: 'Salt',
            amount: '1 tsp',
            allergens: []
          }
        ]
      };
      
      const matches = detectRecipeAllergens(recipe, ['gluten', 'dairy']);
      
      expect(matches).toHaveLength(0);
    });
  });
  
  describe('calculateSafetyRecommendation', () => {
    it('should return SAFE when no matches', () => {
      const result = calculateSafetyRecommendation([]);
      
      expect(result.isSafe).toBe(true);
      expect(result.recommendation).toBe('SAFE');
    });
    
    it('should return UNSAFE for CRITICAL allergen without substitution', () => {
      const matches = [{
        allergen: 'peanuts' as StandardAllergen,
        ingredient: 'Peanut Butter',
        severity: 'CRITICAL' as const,
        reason: 'Contains peanuts',
        substitutionAvailable: false,
        isCrossContamination: false
      }];
      
      const result = calculateSafetyRecommendation(matches);
      
      expect(result.isSafe).toBe(false);
      expect(result.recommendation).toBe('UNSAFE');
    });
    
    it('should return SUBSTITUTE for CRITICAL with substitution available', () => {
      const matches = [{
        allergen: 'gluten' as StandardAllergen,
        ingredient: 'Pasta',
        severity: 'CRITICAL' as const,
        reason: 'Contains gluten',
        substitutionAvailable: true,
        isCrossContamination: false
      }];
      
      const result = calculateSafetyRecommendation(matches);
      
      expect(result.isSafe).toBe(false);
      expect(result.recommendation).toBe('SUBSTITUTE');
    });
    
    it('should return CAUTION for HIGH severity', () => {
      const matches = [{
        allergen: 'gluten' as StandardAllergen,
        ingredient: 'Bacon',
        severity: 'HIGH' as const,
        reason: 'Cross-contamination',
        substitutionAvailable: true,
        isCrossContamination: true
      }];
      
      const result = calculateSafetyRecommendation(matches);
      
      expect(result.isSafe).toBe(false);
      expect(result.recommendation).toBe('CAUTION');
    });
  });
  
  describe('getAllergenSummary', () => {
    it('should group matches by severity', () => {
      const matches = [
        {
          allergen: 'gluten' as StandardAllergen,
          ingredient: 'Pasta',
          severity: 'CRITICAL' as const,
          reason: 'test',
          substitutionAvailable: true,
          isCrossContamination: false
        },
        {
          allergen: 'dairy' as StandardAllergen,
          ingredient: 'Cheese',
          severity: 'HIGH' as const,
          reason: 'test',
          substitutionAvailable: true,
          isCrossContamination: false
        },
        {
          allergen: 'eggs' as StandardAllergen,
          ingredient: 'Mayonnaise',
          severity: 'MODERATE' as const,
          reason: 'test',
          substitutionAvailable: true,
          isCrossContamination: false
        }
      ];
      
      const summary = getAllergenSummary(matches);
      
      expect(summary.critical).toHaveLength(1);
      expect(summary.high).toHaveLength(1);
      expect(summary.moderate).toHaveLength(1);
      expect(summary.low).toHaveLength(0);
    });
  });
  
  describe('isSafeForCustomer', () => {
    it('should return true for recipe with no allergen conflicts', () => {
      const recipe: Recipe = {
        name: 'Safe Salad',
        category: 'salad',
        servings: 1,
        prepTime: 10,
        ingredients: [
          {
            name: 'Lettuce',
            amount: '1 cup',
            allergens: []
          },
          {
            name: 'Tomatoes',
            amount: '2',
            allergens: []
          }
        ]
      };
      
      expect(isSafeForCustomer(recipe, ['gluten', 'dairy'])).toBe(true);
    });
    
    it('should return false for recipe with allergen conflicts', () => {
      const recipe: Recipe = {
        name: 'Pasta Carbonara',
        category: 'italian',
        servings: 2,
        prepTime: 20,
        ingredients: [
          {
            name: 'Spaghetti',
            amount: '200g',
            allergens: ['gluten']
          },
          {
            name: 'Eggs',
            amount: '2',
            allergens: ['eggs']
          }
        ]
      };
      
      expect(isSafeForCustomer(recipe, ['gluten'])).toBe(false);
    });
  });
});
