/**
 * Validate command - check recipe file format
 */

import chalk from 'chalk';
import { validateRecipeFile } from '../../core/recipe-parser';

interface ValidateOptions {
  recipe: string;
}

export async function validateCommand(options: ValidateOptions) {
  try {
    console.log(chalk.blue('\n✓ AllergenGuard - Recipe Validation\n'));
    
    console.log(chalk.gray(`Validating: ${options.recipe}`));
    
    const result = await validateRecipeFile(options.recipe);
    
    if (result.valid && result.recipe) {
      console.log(chalk.green('\n✅ Recipe is valid!\n'));
      
      console.log(chalk.bold('Recipe Details:'));
      console.log(chalk.gray(`  Name: ${result.recipe.name}`));
      console.log(chalk.gray(`  Category: ${result.recipe.category}`));
      console.log(chalk.gray(`  Ingredients: ${result.recipe.ingredients.length}`));
      console.log(chalk.gray(`  Servings: ${result.recipe.servings}`));
      console.log(chalk.gray(`  Prep time: ${result.recipe.prepTime} minutes`));
      
      // Check for allergens
      const totalAllergens = result.recipe.ingredients.reduce(
        (sum, ing) => sum + ing.allergens.length,
        0
      );
      
      if (totalAllergens > 0) {
        console.log(chalk.yellow(`  Allergens: ${totalAllergens} found`));
      } else {
        console.log(chalk.green(`  Allergens: None`));
      }
      
      console.log();
      console.log(chalk.green('✓ This recipe can be used with AllergenGuard'));
      console.log();
      
    } else {
      console.log(chalk.red('\n❌ Recipe validation failed\n'));
      
      if (result.errors && result.errors.length > 0) {
        console.log(chalk.red.bold('Errors found:'));
        result.errors.forEach(error => {
          console.log(chalk.red(`  • ${error}`));
        });
        console.log();
      }
      
      console.log(chalk.yellow('Please fix the errors and try again.'));
      console.log(chalk.gray('Refer to the recipe format documentation for help.'));
      console.log();
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error(chalk.red('\n✗ Error:'), error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
