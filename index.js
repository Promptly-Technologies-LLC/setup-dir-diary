const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
  try {
    const installPython = core.getInput('install-python') === 'true';
    const isWindows = process.platform === 'win32';
    let pythonExists = false;

    // Check if Python 3.11 is already installed
    try {
      await exec.exec('python3.11 --version');
      pythonExists = true;
    } catch (error) {
      pythonExists = false;
    }

    if (installPython && !pythonExists) {
      if (isWindows) {
        // Mimic actions/setup-python for Windows
        await exec.exec('Invoke-WebRequest -Uri "https://www.python.org/ftp/python/3.11.0/python-3.11.0-amd64.exe" -OutFile "python-installer.exe"');
        await exec.exec('Start-Process -FilePath "python-installer.exe" -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1" -Wait');
      } else {
        // Mimic actions/setup-python for Ubuntu
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
