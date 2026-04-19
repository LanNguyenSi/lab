/**
 * Scan command - show all allergens in recipe
 */

import chalk from 'chalk';
import { parseRecipeFile } from '../../core/recipe-parser';

interface ScanOptions {
  recipe: string;
  verbose?: boolean;
}

export async function scanCommand(options: ScanOptions) {
  try {
    console.log(chalk.blue('\n🔍 AllergenGuard - Recipe Scan\n'));
    
    console.log(chalk.gray('Loading recipe...'));
    const recipe = await parseRecipeFile(options.recipe);
    console.log(chalk.green(`✓ Loaded: ${recipe.name}\n`));
    
    // Collect all allergens
    const allergenSet = new Set<string>();
    const crossContaminationSet = new Set<string>();
    
    recipe.ingredients.forEach(ingredient => {
      ingredient.allergens.forEach(a => allergenSet.add(a));
      ingredient.crossContamination?.forEach(a => crossContaminationSet.add(a));
    });
    
    // Display recipe info
    console.log(chalk.bold('Recipe Information:'));
    console.log(chalk.gray(`  Category: ${recipe.category}`));
    console.log(chalk.gray(`  Servings: ${recipe.servings}`));
    console.log(chalk.gray(`  Prep time: ${recipe.prepTime} minutes`));
    if (recipe.description) {
      console.log(chalk.gray(`  Description: ${recipe.description}`));
    }
    console.log();
    
    // Display allergens
    if (allergenSet.size > 0) {
      console.log(chalk.red.bold('⚠️  Allergens Present:'));
      Array.from(allergenSet).sort().forEach(allergen => {
        console.log(chalk.red(`  • ${allergen.toUpperCase()}`));
      });
      console.log();
    } else {
      console.log(chalk.green('✅ No direct allergens detected\n'));
    }
    
    // Display cross-contamination risks
    if (crossContaminationSet.size > 0) {
      console.log(chalk.yellow.bold('⚠️  Cross-Contamination Risks:'));
      Array.from(crossContaminationSet).sort().forEach(allergen => {
        console.log(chalk.yellow(`  • ${allergen.toUpperCase()}`));
      });
      console.log();
    }
    
    // Detailed ingredient list
    if (options.verbose) {
      console.log(chalk.bold('Detailed Ingredient List:'));
      console.log();
      
      recipe.ingredients.forEach((ingredient, index) => {
        console.log(chalk.cyan(`${index + 1}. ${ingredient.name} (${ingredient.amount})`));
        
        if (ingredient.allergens.length > 0) {
          console.log(chalk.red(`   Allergens: ${ingredient.allergens.join(', ')}`));
        }
        
        if (ingredient.crossContamination && ingredient.crossContamination.length > 0) {
          console.log(chalk.yellow(`   Cross-contamination: ${ingredient.crossContamination.join(', ')}`));
        }
        
        if (ingredient.notes) {
          console.log(chalk.gray(`   Notes: ${ingredient.notes}`));
        }
        
        if (ingredient.optional) {
          console.log(chalk.gray(`   (Optional ingredient)`));
        }
        
        console.log();
      });
    }
    
    // Warnings
    if (recipe.warnings && recipe.warnings.length > 0) {
      console.log(chalk.yellow.bold('⚠️  Preparation Warnings:'));
      recipe.warnings.forEach(warning => {
        console.log(chalk.yellow(`  • ${warning}`));
      });
      console.log();
    }
    
  } catch (error) {
    console.error(chalk.red('\n✗ Error:'), error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
