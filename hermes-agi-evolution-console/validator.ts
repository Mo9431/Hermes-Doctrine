import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';

export async function executePythonReplay(synthesizedCode: string, mockData: any): Promise<any> {
  const pyFile = path.join(process.cwd(), 'temp_eval.py');
  const jsonFile = path.join(process.cwd(), 'temp_data.json');

  try {
    fs.writeFileSync(jsonFile, JSON.stringify(mockData, null, 2));
    
    // Inject logic to read the json file and print JSON response to stdout
    // if the provided script doesn't have it natively, but the instructions say
    // "The Python script should be instructed to read the JSON file, run its logic, and print a JSON result to stdout."
    // This is handled by Vulcan instruction usually.
    fs.writeFileSync(pyFile, synthesizedCode);

    return new Promise((resolve, reject) => {
      // 5-second timeout for safety against infinite loops
      exec(`python3 ${pyFile}`, { timeout: 5000 }, (error, stdout, stderr) => {
        try {
          if (fs.existsSync(pyFile)) fs.unlinkSync(pyFile);
          if (fs.existsSync(jsonFile)) fs.unlinkSync(jsonFile);
        } catch (cleanupErr) {
          console.error("Cleanup error:", cleanupErr);
        }

        if (error) {
          return reject(error);
        }

        const out = stdout.trim();
        try {
          const parsed = JSON.parse(out);
          resolve(parsed);
        } catch (parseErr) {
          if (out.toLowerCase() === 'true') resolve(true);
          if (out.toLowerCase() === 'false') resolve(false);
          resolve(out);
        }
      });
    });
  } catch (err) {
    if (fs.existsSync(pyFile)) fs.unlinkSync(pyFile);
    if (fs.existsSync(jsonFile)) fs.unlinkSync(jsonFile);
    throw err;
  }
}
