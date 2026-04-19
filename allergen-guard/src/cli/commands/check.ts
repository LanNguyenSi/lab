/**
 * Check command - main allergen safety check
 */

import chalk from 'chalk';
import { parseRecipeFile } from '../../core/recipe-parser';
import { detectRecipeAllergens, calculateSafetyRecommendation, getAllergenSummary } from '../../core/allergen-detector';
import { findAllSubstitutions, doSubstitutionsResolveAllConflicts } from '../../core/substitution-finder';
import { StandardAllergen } from '../../core/types';

interface CheckOptions {
  recipe: string;
  allergies: string;
  operator?: string;
  verbose?: boolean;
}

export async function checkCommand(options: CheckOptions) {
  try {
    console.log(chalk.blue('\n🛡️  AllergenGuard - Safety Check\n'));
    
    // Parse allergies list
    const customerAllergies = options.allergies
      .split(',')
      .map(a => a.trim().toLowerCase()) as StandardAllergen[];
    
    console.log(chalk.gray('Loading recipe...'));
    
    // Parse recipe
    const recipe = await parseRecipeFile(options.recipe);
    console.log(chalk.green(`✓ Loaded: ${recipe.name}`));
    
    // Detect allergens
    console.log(chalk.gray('Checking for allergen conflicts...'));
    const matches = detectRecipeAllergens(recipe, customerAllergies);
    const { isSafe, recommendation } = calculateSafetyRecommendation(matches);
    
    // Display results
    console.log();
    console.log(chalk.bold('━'.repeat(60)));
    console.log();
    
    if (matches.length === 0) {
      console.log(chalk.green.bold('✅ SAFE - No allergen conflicts detected'));
      console.log();
      console.log(chalk.gray(`Recipe: ${recipe.name}`));
      console.log(chalk.gray(`Customer allergies: ${customerAllergies.join(', ')}`));
      console.log();
      console.log(chalk.green('This recipe is safe for the customer.'));
      console.log();
      return;
    }
    
    // Show conflicts
    const summary = getAllergenSummary(matches);
    
    if (summary.critical.length > 0) {
      console.log(chalk.red.bold('❌ ALLERGEN CONFLICT DETECTED'));
    } else if (summary.high.length > 0) {
      console.log(chalk.yellow.bold('⚠️  CAUTION - Allergen Concerns'));
    } else {
      console.log(chalk.blue.bold('ℹ️  Minor Allergen Warnings'));
    }
    
    console.log();
    console.log(chalk.gray(`Recipe: ${recipe.name}`));
    console.log(chalk.gray(`Customer allergies: ${customerAllergies.join(', ')}`));
    console.log();
    
    // Critical issues
    if (summary.critical.length > 0) {
      console.log(chalk.red.bold('CRITICAL ISSUES:'));
      summary.critical.forEach(match => {
        console.log(chalk.red(`  ❌ ${match.ingredient} contains ${match.allergen.toUpperCase()}`));
        if (options.verbose) {
          console.log(chalk.gray(`     ${match.reason}`));
        }
      });
      console.log();
    }
    
    // High warnings
    if (summary.high.length > 0) {
      console.log(chalk.yellow.bold('HIGH WARNINGS:'));
      summary.high.forEach(match => {
        console.log(chalk.yellow(`  ⚠️  ${match.ingredient} - ${match.allergen}`));
        if (options.verbose) {
          console.log(chalk.gray(`     ${match.reason}`));
        }
      });
      console.log();
    }
    
    // Moderate warnings
    if (summary.moderate.length > 0 && options.verbose) {
      console.log(chalk.blue.bold('MODERATE WARNINGS:'));
      summary.moderate.forEach(match => {
        console.log(chalk.blue(`  ℹ️  ${match.ingredient} - ${match.allergen}`));
        console.log(chalk.gray(`     ${match.reason}`));
      });
      console.log();
    }
    
    // Find substitutions
    const substitutions = findAllSubstitutions(matches);
    
    if (substitutions.length > 0) {
      console.log(chalk.cyan.bold('SAFE ALTERNATIVES:'));
      substitutions.forEach(sub => {
        if (sub.fullyResolves) {
          console.log(chalk.green(`  ✅ ${sub.replaceIngredient} → ${sub.withIngredient}`));
        } else {
          console.log(chalk.yellow(`  ⚠️  ${sub.replaceIngredient} → ${sub.withIngredient}`));
        }
        if (options.verbose) {
          console.log(chalk.gray(`     ${sub.instructions}`));
        }
      });
      console.log();
      
      // Check if substitutions resolve everything
      const fullyResolved = doSubstitutionsResolveAllConflicts(matches, substitutions);
      if (fullyResolved) {
        console.log(chalk.green.bold('✓ All conflicts can be resolved with substitutions'));
      } else {
        console.log(chalk.yellow.bold('⚠️  Some conflicts cannot be fully resolved'));
      }
      console.log();
    }
    
    // Recommendation
    console.log(chalk.bold('RECOMMENDATION:'));
    switch (recommendation) {
      case 'SAFE':
        console.log(chalk.green('  ✅ Safe to serve'));
        break;
      case 'SUBSTITUTE':
        console.log(chalk.cyan('  🔄 Use substitutions listed above'));
        break;
      case 'CAUTION':
        console.log(chalk.yellow('  ⚠️  Proceed with extreme caution'));
        console.log(chalk.yellow('     Ensure separate equipment and careful prep'));
        break;
      case 'UNSAFE':
        console.log(chalk.red('  ❌ DO NOT SERVE - Suggest different dish'));
        break;
    }
    
    console.log();
    console.log(chalk.bold('━'.repeat(60)));
    console.log();
    
    // Audit log note
    if (options.operator) {
      console.log(chalk.gray(`Check performed by: ${options.operator}`));
    }
    console.log(chalk.gray(`Timestamp: ${new Date().toISOString()}`));
    console.log();
    
  } catch (error) {
    console.error(chalk.red('\n✗ Error:'), error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}
