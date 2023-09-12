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

  it('Installs Python on Ubuntu when install-python is true', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux'
    });
    core.getInput.mockReturnValueOnce('true');

    await run();

    expect(exec.exec).toHaveBeenCalledWith('sudo apt-get update');
    expect(exec.exec).toHaveBeenCalledWith('sudo apt-get install python3.11');
  });

  it('Installs Python on Windows when install-python is true', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32'
    });
    core.getInput.mockReturnValueOnce('true');

    await run();

    expect(exec.exec).toHaveBeenCalledWith('choco install python --version=3.11');
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
