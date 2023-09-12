const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    const installPython = core.getInput('install-python') === 'true';
    const isWindows = process.platform === 'win32';

    if (installPython) {
      if (isWindows) {
        // Install Python 3.11 on Windows
        await exec.exec('choco install python --version=3.11');
      } else {
        // Install Python 3.11 on Ubuntu
        await exec.exec('sudo apt-get update');
        await exec.exec('sudo apt-get install python3.11');
      }
    }

    // Install dir-diary
    const pipCommand = isWindows ? 'pip' : 'pip3';
    await exec.exec(`${pipCommand} install dir-diary`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

// Export `run` for testing
module.exports = run;

// Run the function if this script is the main module
if (require.main === module) {
  run();
}
