/**
 * Recipe Parser
 * 
 * Reads YAML recipe files and converts them to validated Recipe objects.
 * Safety-critical: Must catch all parsing errors to prevent invalid data.
 */

import { readFile } from 'fs/promises';
import { parse as parseYAML } from 'yaml';
import { Recipe } from './types';
import { validateRecipe, validateRecipeWithErrors } from './recipe-schema';

/**
 * Parse error with detailed information
 */
export class RecipeParseError extends Error {
  constructor(
    public filePath: string,
    public details: string[],
    message?: string
  ) {
    super(message || `Failed to parse recipe: ${filePath}`);
    this.name = 'RecipeParseError';
  }
}

/**
 * Parse a recipe file from YAML
 * 
 * @param filePath Path to YAML recipe file
 * @returns Validated Recipe object
 * @throws RecipeParseError if parsing or validation fails
 */
export async function parseRecipeFile(filePath: string): Promise<Recipe> {
  try {
    // Read file
    const content = await readFile(filePath, 'utf-8');
    
    // Parse YAML
    let data: unknown;
    try {
      data = parseYAML(content);
    } catch (error) {
      throw new RecipeParseError(
        filePath,
        ['Invalid YAML syntax'],
        `YAML parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
    
    // Validate against schema
    const validation = validateRecipeWithErrors(data);
    if (!validation.success) {
      throw new RecipeParseError(
        filePath,
        validation.errors || ['Unknown validation error'],
        'Recipe validation failed'
      );
    }
    
    return validation.data as Recipe;
    
  } catch (error) {
    // Re-throw RecipeParseError as-is
    if (error instanceof RecipeParseError) {
      throw error;
    }
    
    // Wrap other errors
    throw new RecipeParseError(
      filePath,
      [error instanceof Error ? error.message : 'Unknown error'],
      'Failed to read recipe file'
    );
  }
}

/**
 * Parse recipe from YAML string (for testing)
 * 
 * @param yamlString YAML recipe content
 * @param source Optional source identifier for error messages
 * @returns Validated Recipe object
 * @throws RecipeParseError if parsing or validation fails
 */
export function parseRecipeString(yamlString: string, source: string = 'string'): Recipe {
  try {
    const data = parseYAML(yamlString);
    
    const validation = validateRecipeWithErrors(data);
    if (!validation.success) {
      throw new RecipeParseError(
        source,
        validation.errors || ['Unknown validation error'],
        'Recipe validation failed'
      );
    }
    
    return validation.data as Recipe;
    
  } catch (error) {
    if (error instanceof RecipeParseError) {
      throw error;
    }
    
    throw new RecipeParseError(
      source,
      [error instanceof Error ? error.message : 'Unknown error'],
      'Failed to parse YAML'
    );
  }
}

/**
 * Validate recipe without throwing (safe check)
 * 
 * @param filePath Path to YAML recipe file
 * @returns Success status and data or errors
 */
export async function validateRecipeFile(filePath: string): Promise<{
  valid: boolean;
  recipe?: Recipe;
  errors?: string[];
}> {
  try {
    const recipe = await parseRecipeFile(filePath);
    return {
      valid: true,
      recipe
    };
  } catch (error) {
    if (error instanceof RecipeParseError) {
      return {
        valid: false,
        errors: error.details
      };
    }
    return {
      valid: false,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
}

/**
 * Parse multiple recipe files
 * 
 * @param filePaths Array of recipe file paths
 * @returns Object with successful and failed parses
 */
export async function parseRecipeFiles(filePaths: string[]): Promise<{
  successful: Array<{ path: string; recipe: Recipe }>;
  failed: Array<{ path: string; errors: string[] }>;
}> {
  const results = await Promise.allSettled(
    filePaths.map(async (path) => ({ path, recipe: await parseRecipeFile(path) }))
  );
  
  const successful: Array<{ path: string; recipe: Recipe }> = [];
  const failed: Array<{ path: string; errors: string[] }> = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successful.push(result.value);
    } else {
      const error = result.reason;
      failed.push({
        path: filePaths[index],
        errors: error instanceof RecipeParseError 
          ? error.details 
          : [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  });
  
  return { successful, failed };
}
