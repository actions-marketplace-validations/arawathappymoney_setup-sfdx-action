const core = require('@actions/core');
const github = require('@actions/github');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const authenticate = require('./authenticate');

const onInstall = async ({ stdout, stderr }) => {
  if (stderr) {
    console.log(stderr);
  }
  if (stdout) {
    console.log(stdout);
  }

  const pluginList = core.getInput('plugins');
  const plugins = pluginList.split(',');
  for (const plugin of plugins) {
    if (plugin.trim().length < 1) {
      continue;
    }
    try {
      const { stdout, stderr } = await exec(`echo 'y' | sfdx plugins:install ${plugin}`);
      console.log(stderr);
      console.log(stdout);
    } catch (e) {
      core.setFailed(e.message);
    }
  }
};

const install = async () => {
  const installCommand = `wget -q https://developer.salesforce.com/media/salesforce-cli/sfdx/versions/7.173.0/5858bb0/sfdx-v7.173.0-5858bb0-linux-x64.tar.xz \
    && mkdir sfdx \
    && tar xJf sfdx-v7.173.0-5858bb0-linux-x64.tar.xz -C sfdx --strip-components 1 \
    && ./sfdx/install`;
  await onInstall(await exec(installCommand));
};

module.exports = async () => {
  try {
    await install();
    await authenticate();
  } catch (e) {
    core.setFailed(e.message);
  }
}

