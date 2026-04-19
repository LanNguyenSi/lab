/**
 * Allergen Detection Engine
 * 
 * Safety-critical: This is the core logic that detects allergen conflicts.
 * Must be thorough, accurate, and conservative (better false positive than false negative).
 */

import { Recipe, Ingredient, StandardAllergen, AllergenMatch, Severity } from './types';
import allergensData from '../data/allergens.json';

/**
 * Allergen database structure
 */
interface AllergenInfo {
  name: string;
  sources: string[];
  hiddenSources: string[];
  severity: string;
  description: string;
}

type AllergenDatabase = {
  allergens: Record<StandardAllergen, AllergenInfo>;
};

const allergenDB = allergensData as AllergenDatabase;

/**
 * Detect allergen matches in an ingredient
 * 
 * @param ingredient Ingredient to check
 * @param customerAllergies List of customer's allergies
 * @returns Array of allergen matches found
 */
export function detectIngredientAllergens(
  ingredient: Ingredient,
  customerAllergies: StandardAllergen[]
): AllergenMatch[] {
  const matches: AllergenMatch[] = [];
  
  for (const allergen of customerAllergies) {
    // Direct allergen match
    if (ingredient.allergens.includes(allergen)) {
      matches.push({
        allergen,
        ingredient: ingredient.name,
        severity: 'CRITICAL',
        reason: `${ingredient.name} directly contains ${allergen}`,
        substitutionAvailable: true, // Will be refined by substitution finder
        isCrossContamination: false
      });
    }
    
    // Cross-contamination match
    if (ingredient.crossContamination?.includes(allergen)) {
      matches.push({
        allergen,
        ingredient: ingredient.name,
        severity: 'HIGH',
        reason: `${ingredient.name} may be cross-contaminated with ${allergen}`,
        substitutionAvailable: true,
        isCrossContamination: true
      });
    }
    
    // Hidden allergen detection (ingredient name contains allergen source)
    const allergenInfo = allergenDB.allergens[allergen];
    if (allergenInfo) {
      const ingredientLower = ingredient.name.toLowerCase();
      
      // Check common sources
      for (const source of allergenInfo.sources) {
        if (ingredientLower.includes(source.toLowerCase())) {
          // Skip if already detected directly
          if (!ingredient.allergens.includes(allergen)) {
            matches.push({
              allergen,
              ingredient: ingredient.name,
              severity: 'HIGH',
              reason: `${ingredient.name} contains ${source}, which has ${allergen}`,
              substitutionAvailable: true,
              isCrossContamination: false
            });
          }
        }
      }
      
      // Check hidden sources (more suspicious patterns)
      for (const hiddenSource of allergenInfo.hiddenSources) {
        if (ingredientLower.includes(hiddenSource.toLowerCase())) {
          matches.push({
            allergen,
            ingredient: ingredient.name,
            severity: 'MODERATE',
            reason: `${ingredient.name} may contain hidden ${allergen} (${hiddenSource})`,
            substitutionAvailable: true,
            isCrossContamination: false
          });
        }
      }
    }
  }
  
  return matches;
}

/**
 * Detect all allergen conflicts in a recipe
 * 
 * @param recipe Recipe to check
 * @param customerAllergies Customer's allergen restrictions
 * @returns Array of all allergen matches found
 */
export function detectRecipeAllergens(
  recipe: Recipe,
  customerAllergies: StandardAllergen[]
): AllergenMatch[] {
  const allMatches: AllergenMatch[] = [];
  
  for (const ingredient of recipe.ingredients) {
    const matches = detectIngredientAllergens(ingredient, customerAllergies);
    allMatches.push(...matches);
  }
  
  // Deduplicate matches (same allergen + ingredient)
  const uniqueMatches = deduplicateMatches(allMatches);
  
  return uniqueMatches;
}

/**
 * Deduplicate allergen matches
 * Keep the most severe match for each allergen+ingredient combination
 */
function deduplicateMatches(matches: AllergenMatch[]): AllergenMatch[] {
  const severityOrder: Record<Severity, number> = {
    'CRITICAL': 4,
    'HIGH': 3,
    'MODERATE': 2,
    'LOW': 1
  };
  
  const matchMap = new Map<string, AllergenMatch>();
  
  for (const match of matches) {
    const key = `${match.allergen}:${match.ingredient}`;
    const existing = matchMap.get(key);
    
    if (!existing || severityOrder[match.severity] > severityOrder[existing.severity]) {
      matchMap.set(key, match);
    }
  }
  
  return Array.from(matchMap.values());
}

/**
 * Calculate overall safety recommendation
 */
export function calculateSafetyRecommendation(matches: AllergenMatch[]): {
  isSafe: boolean;
  recommendation: 'SAFE' | 'CAUTION' | 'UNSAFE' | 'SUBSTITUTE';
} {
  if (matches.length === 0) {
    return {
      isSafe: true,
      recommendation: 'SAFE'
    };
  }
  
  const hasCritical = matches.some(m => m.severity === 'CRITICAL');
  const hasHigh = matches.some(m => m.severity === 'HIGH');
  const allHaveSubstitutions = matches.every(m => m.substitutionAvailable);
  
  if (hasCritical) {
    if (allHaveSubstitutions) {
      return {
        isSafe: false,
        recommendation: 'SUBSTITUTE'
      };
    }
    return {
      isSafe: false,
      recommendation: 'UNSAFE'
    };
  }
  
  if (hasHigh) {
    return {
      isSafe: false,
      recommendation: 'CAUTION'
    };
  }
  
  // Only moderate/low matches
  return {
    isSafe: false,
    recommendation: 'CAUTION'
  };
}

/**
 * Get allergen summary for display
 */
export function getAllergenSummary(matches: AllergenMatch[]): {
  critical: AllergenMatch[];
  high: AllergenMatch[];
  moderate: AllergenMatch[];
  low: AllergenMatch[];
} {
  return {
    critical: matches.filter(m => m.severity === 'CRITICAL'),
    high: matches.filter(m => m.severity === 'HIGH'),
    moderate: matches.filter(m => m.severity === 'MODERATE'),
    low: matches.filter(m => m.severity === 'LOW')
  };
}

/**
 * Check if customer can safely consume this recipe
 */
export function isSafeForCustomer(
  recipe: Recipe,
  customerAllergies: StandardAllergen[]
): boolean {
  const matches = detectRecipeAllergens(recipe, customerAllergies);
  const { isSafe } = calculateSafetyRecommendation(matches);
  return isSafe;
}
