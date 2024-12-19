#!/usr/bin/env node
const { Command } = require("commander");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Resolve paths
const PROJECT_ROOT = process.cwd();
const MOCK_FOLDER = path.resolve(PROJECT_ROOT, "__mock__");

// Utility Functions
function promptUserConfirmation(message, onConfirm, onCancel) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(message);

  rl.question("Do you want to proceed? Type Y to confirm: ", (answer) => {
    rl.close();
    if (answer.trim().toUpperCase() === "Y") {
      onConfirm();
    } else {
      console.log("Operation aborted.");
      if (onCancel) {
        onCancel();
      } else {
        process.exit(1);
      }
    }
  });
}

function executeImport({ db, collection, filePath, file }) {
  console.log(
    `Importing ${file} into database ${db}, collection ${collection}`
  );

  // Execute mongoimport
  /**
   * @todo Make `--drop` an option
   */
  execSync(
    `mongoimport --drop --db "${db}" --collection "${collection}" --file "${filePath}" --jsonArray`,
    { stdio: "inherit" }
  );

  console.log("Data imported successfully.");
}

// Command Handlers
const commandHandlers = {
  // Debug commands
  debug: {
    ping: () => {
      console.log("pong");
    },
  },

  // Migration commands
  migration: {
    "migrate:mock": (options) => {
      const { db, collection, file } = options;

      // Validate required options
      if (!db || !collection || !file) {
        console.error(
          "Error: Options --db, --collection, and --file are required."
        );
        process.exit(1);
      }

      // Create the full file path
      const filePath = path.join(MOCK_FOLDER, file);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found in mock folder: ${file}`);
        console.error(`Searched path: ${filePath}`);
        console.error(
          `Mock folder contents: ${fs.readdirSync(MOCK_FOLDER).join(", ")}`
        );
        process.exit(1);
      }

      // Confirmation and import workflow
      promptUserConfirmation(
        `The collection "${collection}" in the database "${db}" will be dropped and replaced.`,
        () => {
          try {
            executeImport({
              db,
              collection,
              filePath,
              file,
            });
          } catch (error) {
            console.error(`Failed to import ${file}:`, error.message);
            process.exit(1);
          }
        }
      );
    },
  },
};

// Function to execute a command
const executeCommand = (commandString, options) => {
  // Split the command into parts
  const parts = commandString.split(":");

  // Ensure we have at least two parts (prefix and command)
  if (parts.length < 2) {
    throw new Error(
      'Invalid command format. Expected "prefix:command" or "prefix:command:*".'
    );
  }

  // Extract prefix and remaining command
  const prefix = parts[0];
  const command = parts.slice(1).join(":");

  // Find the appropriate handler
  const prefixHandlers = commandHandlers[prefix];
  if (!prefixHandlers) {
    throw new Error(`Unknown command prefix: ${prefix}`);
  }

  // Find the specific command handler
  const commandHandler = prefixHandlers[command];
  if (!commandHandler) {
    throw new Error(`Unknown command: ${commandString}`);
  }

  // Execute the command handler
  commandHandler(options);
};

// Configure the program
const program = new Command();
program
  .arguments("<command>")
  .description("Execute a specific command")
  .option("--db <database>", "Name of the database")
  .option("--collection <collection>", "Name of the collection")
  .option("--file <filename>", "Name of the mock file in __mock__ folder")
  .action((command, options) => {
    try {
      executeCommand(command, program.opts());
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  });

// Parse the CLI arguments
program.parse(process.argv);

// Export for potential testing or module use
module.exports = {
  executeCommand,
  commandHandlers,
};
