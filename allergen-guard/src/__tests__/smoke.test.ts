import { describe, it, expect } from '@jest/globals';

describe('Allergen Guard Smoke Tests', () => {
  it('should import allergen-detector without errors', async () => {
    const mod = await import('../core/allergen-detector');
    expect(mod.detectIngredientAllergens).toBeDefined();
    expect(typeof mod.detectIngredientAllergens).toBe('function');
  });

  it('should import recipe-parser without errors', async () => {
    const mod = await import('../core/recipe-parser');
    expect(mod).toBeDefined();
  });

  it('should import substitution-finder without errors', async () => {
    const mod = await import('../core/substitution-finder');
    expect(mod.findSubstitution).toBeDefined();
  });
});
