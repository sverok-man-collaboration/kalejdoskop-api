import { exec } from "child_process";
import fs from "fs";
import cron from "node-cron";

// Middleware imports
import errorLogging from "./error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

const backupDirPath = "./backups";
const maxBackups = 3;

function databaseBackup() {
  // Defines the cron schedule for the backup script
  cron.schedule("* * * * *", async () => {
    try {
      // Gets the path to the database file
      let databasePath: string | undefined;
      try {
        databasePath = process.env["DATABASE_FILEPATH"];
        if (!databasePath) {
          throw new Error("process.env.DATABASE_URL is undefined");
        }
      } catch (error) {
        throw error;
      }

      const timestamp = new Date()
        .toLocaleString()
        .replace(/:/g, "-")
        .replace(/\//g, "-")
        .replace(/ /g, "")
        .replace(/,/g, "-");
      const backupFileName = `database-${timestamp}.sqlite`;
      const backupFilePath = `${backupDirPath}/${backupFileName}`;

      // Check if the directory exists, if not, create it
      if (!fs.existsSync(backupDirPath)) {
        fs.mkdirSync(backupDirPath);
      }

      // The `exec()` method is used to run `sqlite3` commands
      exec(
        `sqlite3 ${databasePath} ".backup ${backupFilePath}"`,
        (error, _stdout: string, stderr: string) => {
          if (error) {
            const errorMessage = stderr || "Error creating backup";
            console.log(errorMessage);
            errorLogging(errorMessage, __filename);
            return;
          }
          console.log(`Backup created: ${backupFilePath}`);

          // Gets a list of all backup files in the backup directory
          const backupFiles = fs.readdirSync(backupDirPath);

          // Sorts the backup files in descending order by the creation time
          backupFiles.sort((a: string, b: string) => {
            return (
              fs.statSync(`${backupDirPath}/${b}`).ctime.getTime() -
              fs.statSync(`${backupDirPath}/${a}`).ctime.getTime()
            );
          });

          // Removes the oldest backup files if the maximum number of backups has been exceeded
          while (backupFiles.length > maxBackups) {
            const oldestBackup = backupFiles.pop() as string;
            fs.unlinkSync(`${backupDirPath}/${oldestBackup}`);
            console.log(`Backup removed: ${oldestBackup}`);
          }
        }
      );
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
    }
  });
}

export default databaseBackup;
