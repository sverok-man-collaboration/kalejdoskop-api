import fs from "fs";
import path from "path";

const directory = "backups";
const target = "prisma/database.sqlite";

// Access command line arguments
const args = process.argv.slice(2);
console.log(args);

if (args.length !== 1) {
  console.error("Please provide a single argument to select the source file");
  process.exit(1);
}

const chosenIndex = Number(args[0]);

// Read the contents of the directory
fs.readdir(directory, (error, files) => {
  if (error) throw error;

  // Filter the files to only include ones that start with "database"
  const backupFiles = files.filter((file) => file.startsWith("database"));

  // Check if the argument is a valid index
  if (
    chosenIndex < 0 ||
    chosenIndex >= backupFiles.length ||
    isNaN(chosenIndex)
  ) {
    console.error(
      "Invalid argument. Please provide a number to select the source file"
    );
    process.exit(1);
  }

  // Choose the file you want to use to overwrite target.txt
  const chosenFileName = backupFiles[chosenIndex];

  if (!chosenFileName) {
    console.error("No file found with the provided index");
    process.exit(1);
  }

  const chosenFile = path.join(directory, chosenFileName);

  // Copy the file and overwrite the existing file
  fs.copyFile(chosenFile, target, (error) => {
    if (error) throw error;
    console.log(
      `The file has been overwritten with the contents of ${path.basename(
        chosenFile
      )}!`
    );
  });
});
