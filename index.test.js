const core = require('@actions/core');
const exec = require('@actions/exec');
const run = require('./index');

jest.mock('@actions/core');
jest.mock('@actions/exec');

describe('Setup dir-diary', () => {
  let originalPlatform;

  beforeEach(() => {
    jest.resetAllMocks();
    originalPlatform = Object.getOwnPropertyDescriptor(process, 'platform');
  });

  afterEach(() => {
    jest.resetAllMocks();
    Object.defineProperty(process, 'platform', originalPlatform);
  });

  it('Installs Python on Ubuntu when install-python is true and Python is not present', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux'
    });
    core.getInput.mockReturnValueOnce('true');
    exec.exec.mockImplementationOnce(() => {
      throw new Error('Python not found');
    });

    await run();

    expect(exec.exec).toHaveBeenCalledWith('sudo apt-get update');
    expect(exec.exec).toHaveBeenCalledWith('sudo apt-get install python3.11');
  });

  it('Does not install Python on Ubuntu when Python is already present', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux'
    });
    core.getInput.mockReturnValueOnce('true');
    exec.exec.mockImplementationOnce(() => Promise.resolve());

    await run();

    expect(exec.exec).not.toHaveBeenCalledWith('sudo apt-get update');
    expect(exec.exec).not.toHaveBeenCalledWith('sudo apt-get install python3.11');
  });

  it('Installs Python on Windows when install-python is true and Python is not present', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    });
    core.getInput.mockReturnValueOnce('true');
    exec.exec.mockImplementationOnce(() => {
      throw new Error('Python not found');
    });
  
    await run();
  
    // Check only the relevant calls to exec.exec
    const relevantCalls = exec.exec.mock.calls.filter(
      (call) => !call[0].includes('python3.11 --version')
    );
  
    expect(relevantCalls).toEqual([
      ['pwsh -Command "Invoke-WebRequest -Uri \'https://www.python.org/ftp/python/3.11.0/python-3.11.0-amd64.exe\' -OutFile \'python-installer.exe\'"', [], { shell: '/bin/bash' }],
      ['pwsh -Command "Start-Process -FilePath \'python-installer.exe\' -ArgumentList \'/quiet InstallAllUsers=1 PrependPath=1\' -Wait"', [], { shell: '/bin/bash' }],
      ['pip install dir-diary']
    ]);
  });  

  it('Does not install Python on Windows when Python is already present', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    });
    core.getInput.mockReturnValueOnce('true');
    exec.exec.mockImplementationOnce(() => Promise.resolve());

    await run();

    // Update this line to match the new Windows installation command if you switch from PowerShell
    expect(exec.exec).not.toHaveBeenCalledWith('Invoke-WebRequest -Uri "https://www.python.org/ftp/python/3.11.0/python-3.11.0-amd64.exe" -OutFile "python-installer.exe"');
    expect(exec.exec).not.toHaveBeenCalledWith('Start-Process -FilePath "python-installer.exe" -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1" -Wait');
  });

  it('Does not install Python when install-python is false', async () => {
    core.getInput.mockReturnValueOnce('false');

    await run();

    expect(exec.exec).not.toHaveBeenCalledWith('sudo apt-get update');
    expect(exec.exec).not.toHaveBeenCalledWith('sudo apt-get install python3.11');
    expect(exec.exec).not.toHaveBeenCalledWith('choco install python --version=3.11');
  });

  it('Installs dir-diary', async () => {
    core.getInput.mockReturnValueOnce('false');

    await run();

    const wasCalledWithExpectedCommand = exec.exec.mock.calls.some(
      (call) => call[0] === 'pip install dir-diary' || call[0] === 'pip3 install dir-diary'
    );

    expect(wasCalledWithExpectedCommand).toBe(true);
  });
});
