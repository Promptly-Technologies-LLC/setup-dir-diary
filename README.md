# setup-dir-diary

[![units-test](https://github.com/Promptly-Technologies-LLC/setup-dir-diary/actions/workflows/test.yml/badge.svg)](https://github.com/Promptly-Technologies-LLC/setup-dir-diary/actions/workflows/test.yml)

This Github Action installs the [dir-diary CLI tool](https://github.com/Promptly-Technologies-LLC/dir-diary), which queries OpenAI's GPT-3.5-Turbo Large Language Model (LLM) for the purpose of generating a comprehensive pseudocode summary of the code in your project folder. A comprehensive pseudocode summary makes your project easier to grasp at a glance, and can also be embedded in a vector database or dumped into context when working with an LLM. 

With the `setup-dir-diary` action, you can update your project summary on every push or at regular intervals as part of a CI/CD workflow or automation pipeline. Thanks to the low cost of GPT-3.5-Turbo, the workflow costs pennies to run even if you've made substantial changes to your project (and little or nothing if you haven't).

## Usage

To use the action in a Github Actions script, reference the stable v1 branch:

```yaml
uses: actions/setup-dir-diary@v1
with:
  install-python: 'true'
```

Note that Python 3.8 or higher is required to install the dir-diary tool. This action will handle pre-installation of Python 3.11 for you if you set the `install-python` option to `true`. If the option is set to `false`, you will need to install Python 3.8 or higher as a separate step before running this action.

### Example Workflow

For a full working example, see the [example workflow](https://github.com/Promptly-Technologies-LLC/setup-dir-diary/blob/main/.github/example_workflows/summarize.yml) in this repo. This example runs on a manual trigger, checks out the repo, installs Python 3.11, installs the dir-diary tool, and then runs the tool on the repo. The output is saved to the 'docs' folder in the repo and then staged, committed, and pushed back to the repo. Note that write permissions are required in order to push the changes back to the repo, and that you must create a repository secret named `OPENAI_API_KEY` for the `summarize` step of this example workflow to work correctly.

For instructions on how to create a repository secret, see [the Github documentation](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/managing-secrets-for-your-repository-and-organization-for-github-codespaces#adding-secrets-for-a-repository).

To make your workflow run on every push to your repo, change the `on` trigger to `push`:

```yaml
on:
  push:
    branches: [ main ]
```

Alternatively, you can run the workflow on a schedule by changing the `on` trigger to `schedule`:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'
```

This will run the workflow every day at midnight UTC.

## Contributing

### Development

To install the dependencies, use:

```bash
npm install
```

Make changes on a development branch, run lint/build/test pipeline with `npm run all`. If all tests pass, open a pull request from `main`.

### Create a release branch

For maintainers only: to create a new major release branch, use:

```bash
git checkout -b v2
git push origin v2
```
