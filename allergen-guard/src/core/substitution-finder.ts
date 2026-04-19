/**
 * Substitution Finder
 * 
 * Finds safe alternatives for allergenic ingredients
 */

import { StandardAllergen, AllergenMatch, SubstitutionSuggestion, Ingredient } from './types';
import substitutionsData from '../data/substitutions.json';

interface SubstitutionEntry {
  original: string;
  alternative: string;
  ratio: string;
  notes: string;
  cookingAdjustment: string;
}

type SubstitutionsDatabase = {
  substitutions: Record<string, SubstitutionEntry[]>;
  generalGuidelines?: {
    alwaysCheck?: string[];
    crossContaminationPrevention?: string[];
  };
};

const substitutionsDB = substitutionsData as SubstitutionsDatabase;

/**
 * Find substitutions for a specific allergen match
 */
export function findSubstitution(
  match: AllergenMatch
): SubstitutionSuggestion | null {
  const allergenSubstitutions = substitutionsDB.substitutions[match.allergen];
  
  if (!allergenSubstitutions) {
    return null;
  }
  
  // Try to find exact match first
  const ingredientLower = match.ingredient.toLowerCase();
  
  for (const sub of allergenSubstitutions) {
    if (ingredientLower.includes(sub.original.toLowerCase())) {
      return {
        replaceIngredient: match.ingredient,
        withIngredient: sub.alternative,
        instructions: `${sub.ratio}. ${sub.notes}. ${sub.cookingAdjustment}`.trim(),
        fullyResolves: !match.isCrossContamination
      };
    }
  }
  
  // Return first general substitution if no exact match
  if (allergenSubstitutions.length > 0) {
    const sub = allergenSubstitutions[0];
    return {
      replaceIngredient: match.ingredient,
      withIngredient: sub.alternative,
      instructions: `Consider using ${sub.alternative} instead. ${sub.notes}`,
      fullyResolves: false
    };
  }
  
  return null;
}

/**
 * Find all substitutions for a list of allergen matches
 */
export function findAllSubstitutions(
  matches: AllergenMatch[]
): SubstitutionSuggestion[] {
  const suggestions: SubstitutionSuggestion[] = [];
  
  for (const match of matches) {
    const substitution = findSubstitution(match);
    if (substitution) {
      suggestions.push(substitution);
    }
  }
  
  // Deduplicate by ingredient name
  const uniqueSuggestions = deduplicateSubstitutions(suggestions);
  
  return uniqueSuggestions;
}

/**
 * Deduplicate substitution suggestions
 */
function deduplicateSubstitutions(
  suggestions: SubstitutionSuggestion[]
): SubstitutionSuggestion[] {
  const map = new Map<string, SubstitutionSuggestion>();
  
  for (const suggestion of suggestions) {
    const key = suggestion.replaceIngredient;
    const existing = map.get(key);
    
    // Prefer suggestions that fully resolve
    if (!existing || (suggestion.fullyResolves && !existing.fullyResolves)) {
      map.set(key, suggestion);
    }
  }
  
  return Array.from(map.values());
}

/**
 * Check if substitutions fully resolve all allergen conflicts
 */
export function doSubstitutionsResolveAllConflicts(
  matches: AllergenMatch[],
  suggestions: SubstitutionSuggestion[]
): boolean {
  // All critical matches must have a fully-resolving substitution
  const criticalMatches = matches.filter(m => m.severity === 'CRITICAL');
  
  for (const match of criticalMatches) {
    const hasSolution = suggestions.some(
      s => s.replaceIngredient === match.ingredient && s.fullyResolves
    );
    
    if (!hasSolution) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get general allergen-free cooking guidelines
 */
export function getGeneralGuidelines(): {
  alwaysCheck: string[];
  crossContaminationPrevention: string[];
} {
  return {
    alwaysCheck: substitutionsDB.generalGuidelines?.alwaysCheck || [],
    crossContaminationPrevention: substitutionsDB.generalGuidelines?.crossContaminationPrevention || []
  };
}
