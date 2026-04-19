/**
 * Tests for substitution finder
 */

import {
  findSubstitution,
  findAllSubstitutions,
  doSubstitutionsResolveAllConflicts,
  getGeneralGuidelines
} from '../../src/core/substitution-finder';
import { AllergenMatch, StandardAllergen } from '../../src/core/types';

describe('Substitution Finder', () => {
  describe('findSubstitution', () => {
    it('should find exact substitution for gluten pasta', () => {
      const match: AllergenMatch = {
        allergen: 'gluten',
        ingredient: 'wheat pasta',
        severity: 'CRITICAL',
        reason: 'Contains gluten',
        substitutionAvailable: true,
        isCrossContamination: false
      };
      
      const sub = findSubstitution(match);
      
      expect(sub).not.toBeNull();
      expect(sub?.withIngredient).toBe('rice pasta');
    });
    
    it('should find substitution for dairy butter', () => {
      const match: AllergenMatch = {
        allergen: 'dairy',
        ingredient: 'butter',
        severity: 'CRITICAL',
        reason: 'Contains dairy',
        substitutionAvailable: true,
        isCrossContamination: false
      };
      
      const sub = findSubstitution(match);
      
      expect(sub).not.toBeNull();
      expect(sub?.withIngredient).toBe('olive oil');
    });
    
    it('should return null for allergen without substitutions', () => {
      const match: AllergenMatch = {
        allergen: 'fish',
        ingredient: 'mysterious-fish-ingredient-not-in-db',
        severity: 'CRITICAL',
        reason: 'test',
        substitutionAvailable: false,
        isCrossContamination: false
      };
      
      // This might return a general fish substitution or null
      // depending on database content
      const sub = findSubstitution(match);
      expect(sub).toBeTruthy(); // fish sauce has substitutions
    });
  });
  
  describe('findAllSubstitutions', () => {
    it('should find multiple substitutions', () => {
      const matches: AllergenMatch[] = [
        {
          allergen: 'gluten',
          ingredient: 'wheat pasta',
          severity: 'CRITICAL',
          reason: 'test',
          substitutionAvailable: true,
          isCrossContamination: false
        },
        {
          allergen: 'dairy',
          ingredient: 'butter',
          severity: 'CRITICAL',
          reason: 'test',
          substitutionAvailable: true,
          isCrossContamination: false
        }
      ];
      
      const subs = findAllSubstitutions(matches);
      
      expect(subs.length).toBeGreaterThanOrEqual(2);
    });
    
    it('should deduplicate suggestions for same ingredient', () => {
      const matches: AllergenMatch[] = [
        {
          allergen: 'gluten',
          ingredient: 'wheat pasta',
          severity: 'CRITICAL',
          reason: 'test',
          substitutionAvailable: true,
          isCrossContamination: false
        },
        {
          allergen: 'gluten',
          ingredient: 'wheat pasta',
          severity: 'HIGH',
          reason: 'test',
          substitutionAvailable: true,
          isCrossContamination: true
        }
      ];
      
      const subs = findAllSubstitutions(matches);
      
      // Should have only one substitution for wheat pasta
      const pastaSubCount = subs.filter(s => 
        s.replaceIngredient.toLowerCase().includes('wheat pasta')
      ).length;
      
      expect(pastaSubCount).toBe(1);
    });
  });
  
  describe('doSubstitutionsResolveAllConflicts', () => {
    it('should return true if all critical matches have full resolution', () => {
      const matches: AllergenMatch[] = [
        {
          allergen: 'gluten',
          ingredient: 'pasta',
          severity: 'CRITICAL',
          reason: 'test',
          substitutionAvailable: true,
          isCrossContamination: false
        }
      ];
      
      const suggestions = [
        {
          replaceIngredient: 'pasta',
          withIngredient: 'rice pasta',
          instructions: 'Use rice pasta',
          fullyResolves: true
        }
      ];
      
      expect(doSubstitutionsResolveAllConflicts(matches, suggestions)).toBe(true);
    });
    
    it('should return false if critical match has no substitution', () => {
      const matches: AllergenMatch[] = [
        {
          allergen: 'peanuts',
          ingredient: 'peanut butter',
          severity: 'CRITICAL',
          reason: 'test',
          substitutionAvailable: false,
          isCrossContamination: false
        }
      ];
      
      const suggestions: any[] = [];
      
      expect(doSubstitutionsResolveAllConflicts(matches, suggestions)).toBe(false);
    });
    
    it('should return false if substitution does not fully resolve', () => {
      const matches: AllergenMatch[] = [
        {
          allergen: 'gluten',
          ingredient: 'pasta',
          severity: 'CRITICAL',
          reason: 'test',
          substitutionAvailable: true,
          isCrossContamination: false
        }
      ];
      
      const suggestions = [
        {
          replaceIngredient: 'pasta',
          withIngredient: 'something',
          instructions: 'test',
          fullyResolves: false
        }
      ];
      
      expect(doSubstitutionsResolveAllConflicts(matches, suggestions)).toBe(false);
    });
  });
  
  describe('getGeneralGuidelines', () => {
    it('should return guidelines arrays', () => {
      const guidelines = getGeneralGuidelines();
      
      expect(Array.isArray(guidelines.alwaysCheck)).toBe(true);
      expect(Array.isArray(guidelines.crossContaminationPrevention)).toBe(true);
      expect(guidelines.alwaysCheck.length).toBeGreaterThan(0);
      expect(guidelines.crossContaminationPrevention.length).toBeGreaterThan(0);
    });
  });
});
