/**
 * Core types for AllergenGuard system
 * 
 * Safety-critical: These types define the contract for allergen detection.
 * Changes here must be carefully reviewed and tested.
 */

// ============================================================================
// Allergen Types
// ============================================================================

/**
 * Standard allergens based on EU (EFSA) and FDA guidelines
 */
export type StandardAllergen =
  | 'gluten'
  | 'crustaceans'
  | 'eggs'
  | 'fish'
  | 'peanuts'
  | 'soybeans'
  | 'dairy'
  | 'nuts'
  | 'celery'
  | 'mustard'
  | 'sesame'
  | 'sulphites'
  | 'lupin'
  | 'molluscs';

/**
 * Specific nut types (part of 'nuts' allergen)
 */
export type NutType =
  | 'almonds'
  | 'hazelnuts'
  | 'walnuts'
  | 'cashews'
  | 'pecans'
  | 'pistachios'
  | 'macadamia'
  | 'brazil-nuts';

/**
 * Severity levels for allergen matches
 */
export type Severity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

// ============================================================================
// Recipe Types
// ============================================================================

/**
 * Single ingredient in a recipe
 */
export interface Ingredient {
  /** Ingredient name (e.g., "Spaghetti", "Eggs") */
  name: string;
  
  /** Amount (e.g., "200g", "2 pieces", "1 cup") */
  amount: string;
  
  /** Direct allergens present in this ingredient */
  allergens: StandardAllergen[];
  
  /** Optional notes about the ingredient */
  notes?: string;
  
  /** Cross-contamination risks from processing/equipment */
  crossContamination?: StandardAllergen[];
  
  /** Whether this ingredient can be omitted */
  optional?: boolean;
}

/**
 * Complete recipe definition
 */
export interface Recipe {
  /** Recipe name */
  name: string;
  
  /** Category (italian, asian, american, desserts, etc.) */
  category: string;
  
  /** Number of servings */
  servings: number;
  
  /** Preparation time in minutes */
  prepTime: number;
  
  /** All ingredients */
  ingredients: Ingredient[];
  
  /** General warnings about preparation */
  warnings?: string[];
  
  /** Optional description */
  description?: string;
}

// ============================================================================
// Detection Types
// ============================================================================

/**
 * Result of allergen detection for one ingredient
 */
export interface AllergenMatch {
  /** Which allergen was matched */
  allergen: StandardAllergen;
  
  /** Which ingredient contains it */
  ingredient: string;
  
  /** How severe is this match */
  severity: Severity;
  
  /** Explanation of why this is a match */
  reason: string;
  
  /** Whether a safe substitution exists */
  substitutionAvailable: boolean;
  
  /** If cross-contamination risk */
  isCrossContamination: boolean;
}

/**
 * Complete allergen check result
 */
export interface AllergenCheckResult {
  /** Recipe that was checked */
  recipe: Recipe;
  
  /** Customer's allergies */
  customerAllergies: StandardAllergen[];
  
  /** All allergen matches found */
  matches: AllergenMatch[];
  
  /** Whether this recipe is safe (no CRITICAL or HIGH matches) */
  isSafe: boolean;
  
  /** Recommended action */
  recommendation: 'SAFE' | 'CAUTION' | 'UNSAFE' | 'SUBSTITUTE';
  
  /** Suggested alternatives if unsafe */
  alternatives?: SubstitutionSuggestion[];
}

// ============================================================================
// Substitution Types
// ============================================================================

/**
 * A safe alternative for an allergenic ingredient
 */
export interface Substitution {
  /** Original ingredient */
  original: string;
  
  /** Safe alternative */
  alternative: string;
  
  /** Usage notes (ratio, cooking differences, etc.) */
  notes: string;
  
  /** Which allergen this substitution avoids */
  avoidsAllergen: StandardAllergen;
}

/**
 * Suggestion for recipe substitution
 */
export interface SubstitutionSuggestion {
  /** Ingredient to replace */
  replaceIngredient: string;
  
  /** Suggested replacement */
  withIngredient: string;
  
  /** Instructions */
  instructions: string;
  
  /** Whether this fully resolves the allergen issue */
  fullyResolves: boolean;
}

// ============================================================================
// Audit Types
// ============================================================================

/**
 * Audit log entry for allergen check
 */
export interface AuditLog {
  /** Timestamp of check */
  timestamp: Date;
  
  /** Who performed the check */
  operator?: string;
  
  /** Recipe name */
  recipe: string;
  
  /** Customer allergies checked */
  customerAllergies: StandardAllergen[];
  
  /** Result of check */
  result: 'SAFE' | 'UNSAFE' | 'SUBSTITUTION_SUGGESTED' | 'CONFLICT_DETECTED';
  
  /** Action taken */
  action?: string;
  
  /** Any alternatives suggested */
  alternatives?: string[];
  
  /** Additional notes */
  notes?: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * System configuration
 */
export interface AllergenGuardConfig {
  /** Severity thresholds */
  severityRules: {
    directMatch: Severity;
    crossContamination: Severity;
    traceAmounts: Severity;
  };
  
  /** Audit logging settings */
  auditLogging: {
    enabled: boolean;
    logPath: string;
  };
  
  /** Recipe directory */
  recipeDirectory: string;
}

// ============================================================================
// CLI Types
// ============================================================================

/**
 * Options for check command
 */
export interface CheckOptions {
  recipe: string;
  allergies: string;
  operator?: string;
  verbose?: boolean;
}

/**
 * Options for scan command
 */
export interface ScanOptions {
  recipe: string;
  verbose?: boolean;
}

/**
 * Options for prep command
 */
export interface PrepOptions {
  shift: 'lunch' | 'dinner' | 'all';
  allergiesFile?: string;
  date?: string;
}
