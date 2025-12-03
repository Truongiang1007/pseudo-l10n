#!/usr/bin/env node
/**
 * CLI for pseudo-l10n package
 * 
 * Usage:
 *   pseudo-l10n input.json output.json [options]
 */

const { generatePseudoLocaleSync } = require("../index.js");
const path = require("path");

// Parse command line arguments
const args = process.argv.slice(2);

// Show help if needed
if (args.length < 2 || args.includes("--help") || args.includes("-h")) {
  console.log(`
pseudo-l10n - Pseudo-localization generator for i18n testing

Usage:
  pseudo-l10n <input.json> <output.json> [options]

Options:
  --expansion=<number>           Text expansion percentage (default: 40)
  --placeholder-format=<format>  Placeholder format (default: "{{key}}")
                                 Examples: "{{key}}", "{key}", "%key%", "\${key}"
  --replace-placeholders         Replace placeholders with <UPPERCASE> format
  --start-marker=<string>        Start marker (default: "⟦")
  --end-marker=<string>          End marker (default: "⟧")
  --rtl                          Enable RTL (Right-to-Left) simulation
  --no-reverse-placeholders      Don't reverse placeholders in RTL mode
  --expansion-char=<char>        Character for expansion (default: "ē")
  --help, -h                     Show this help message

Examples:
  # Basic usage with defaults
  pseudo-l10n en.json pseudo-en.json

  # Custom expansion and markers
  pseudo-l10n en.json pseudo-en.json --expansion=30 --start-marker="[[ " --end-marker=" ]]"

  # Different placeholder format (for Angular i18n)
  pseudo-l10n en.json pseudo-en.json --placeholder-format="{key}"

  # RTL simulation
  pseudo-l10n en.json pseudo-ar.json --rtl

  # Replace placeholders
  pseudo-l10n en.json pseudo-en.json --replace-placeholders

Learn more:
  https://medium.com/@AntonAntonov88/i18n-testing-a-practical-guide-for-qa-engineers-a92f7f4fc8b2
  `);
  process.exit(args.includes("--help") || args.includes("-h") ? 0 : 1);
}

const inputFile = path.resolve(args[0]);
const outputFile = path.resolve(args[1]);

// Parse options
const options = {
  expansion: 40,
  placeholderFormat: "{{key}}",
  replacePlaceholders: false,
  startMarker: "⟦",
  endMarker: "⟧",
  rtl: false,
  reversePlaceholders: true,
  expansionChar: "ē"
};

args.slice(2).forEach((arg) => {
  if (arg.startsWith("--expansion=")) {
    options.expansion = parseInt(arg.split("=")[1], 10) || 40;
  } else if (arg.startsWith("--placeholder-format=")) {
    options.placeholderFormat = arg.split("=")[1];
  } else if (arg === "--replace-placeholders") {
    options.replacePlaceholders = true;
  } else if (arg.startsWith("--start-marker=")) {
    options.startMarker = arg.split("=")[1];
  } else if (arg.startsWith("--end-marker=")) {
    options.endMarker = arg.split("=")[1];
  } else if (arg === "--rtl") {
    options.rtl = true;
  } else if (arg === "--no-reverse-placeholders") {
    options.reversePlaceholders = false;
  } else if (arg.startsWith("--expansion-char=")) {
    options.expansionChar = arg.split("=")[1];
  }
});

// Generate pseudo-locale file
try {
  generatePseudoLocaleSync(inputFile, outputFile, options);
  console.log(`✅ Pseudo-locale file generated: ${outputFile}`);
  console.log(`
Configuration used:
  - Expansion: ${options.expansion}%
  - Placeholder format: ${options.placeholderFormat}
  - Replace placeholders: ${options.replacePlaceholders}
  - Markers: "${options.startMarker}...${options.endMarker}"
  - RTL mode: ${options.rtl}
  - Reverse placeholders: ${options.reversePlaceholders}
  `);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
