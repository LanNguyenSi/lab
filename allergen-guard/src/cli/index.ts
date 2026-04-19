#!/usr/bin/env node

/**
 * AllergenGuard CLI
 * 
 * Command-line interface for allergen detection and recipe checking
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { checkCommand } from './commands/check';
import { scanCommand } from './commands/scan';
import { validateCommand } from './commands/validate';

const program = new Command();

program
  .name('allergen-guard')
  .description('Safety-critical allergen detection system for restaurants')
  .version('0.1.0');

// Check command - main safety check
program
  .command('check')
  .description('Check recipe for allergen conflicts')
  .requiredOption('-r, --recipe <path>', 'Path to recipe YAML file')
  .requiredOption('-a, --allergies <list>', 'Comma-separated list of customer allergies')
  .option('-o, --operator <name>', 'Operator name for audit log')
  .option('-v, --verbose', 'Show detailed information')
  .action(checkCommand);

// Scan command - show all allergens in recipe
program
  .command('scan')
  .description('Scan recipe and list all allergens present')
  .requiredOption('-r, --recipe <path>', 'Path to recipe YAML file')
  .option('-v, --verbose', 'Show detailed ingredient information')
  .action(scanCommand);

// Validate command - check recipe file format
program
  .command('validate')
  .description('Validate recipe file format and structure')
  .requiredOption('-r, --recipe <path>', 'Path to recipe YAML file')
  .action(validateCommand);

// Show helpful error on unknown command
program.on('command:*', function () {
  console.error(chalk.red('\n  ✗ Invalid command: %s\n'), program.args.join(' '));
  console.log(chalk.yellow('  See --help for a list of available commands.\n'));
  process.exit(1);
});

// Show help if no command provided
if (process.argv.length === 2) {
  program.help();
}

program.parse(process.argv);
