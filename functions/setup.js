const helpers = require('@twilio-labs/runtime-helpers');
const { listEnvironments } = require('@twilio-labs/serverless-api/dist/api/environments');
const { getOrCreateAssetResources, uploadAsset } = require('@twilio-labs/serverless-api/dist/api/assets');
const { TwilioServerlessApiClient } = require('@twilio-labs/serverless-api');
const {
  getBuild,
  triggerBuild,
  getBuildStatus,
  activateBuild,
} = require('@twilio-labs/serverless-api/dist/api/builds');

async function loadPluginData(context, pluginName, replacementMap) {
  return ['.js', '.js.LICENSE.txt', '.js.map'].map((suffix) => {
    const filename = pluginName + suffix;
    let content = Runtime.getAssets()['/' + filename].open();
    if (content) {
      Object.entries(replacementMap).forEach(([key, value]) => {
        content = content.replace(new RegExp(key, 'g'), value);
      });
    } else {
      console.error(`${pluginName} is not found`);
    }
    return {
      filename,
      content,
    };
  });
}

function getAssetBaseUrl(pluginName, version) {
  return '/plugins/' + pluginName + '/' + version;
}

async function uploadFiles(assets, serviceSid, serverlessClient) {
  const assetsToUpload = await getOrCreateAssetResources(assets, serviceSid, serverlessClient);
  return Promise.all(
    assetsToUpload.map((asset) => {
      return uploadAsset(asset, serviceSid, serverlessClient, serverlessClient.config);
    }),
  );
}

async function getEnvironment(serverlessApiClient, serviceSid, pluginName) {
  const environments = await listEnvironments(serviceSid, serverlessApiClient);
  const pluginEnvironment = environments.find((environment) => {
    return environment.unique_name.toLowerCase() === pluginName.toLowerCase();
  });

  if (pluginEnvironment) {
    return {
      environmentSid: pluginEnvironment.sid,
      buildSid: pluginEnvironment.build_sid,
      domain_name: pluginEnvironment.domain_name,
    };
  }
}

exports.handler = async function (context, event, callback) {
  const pluginName = event.name;
  const version = event.version || '1.0.0';
  const pluginBaseUrl = getAssetBaseUrl(pluginName, version);
  const bundleUri = `${pluginBaseUrl}/bundle.js`;
  const sourceMapUri = `${pluginBaseUrl}/bundle.js.map`;
  const replacementMap = {
    '<FLEX_APP_SERVERLESS_FUNCTONS_DOMAIN>': 'https://' + context.DOMAIN_NAME,
  };
  const serviceSid = event.serviceSid;
  const serverlessClient = new TwilioServerlessApiClient({
    username: context.ACCOUNT_SID,
    password: context.AUTH_TOKEN,
  });
  try {
    if (!context.IN_PROGRESS_BUILD_SID) {
      const [bundleData, sourceMapData] = await loadPluginData(context, pluginName, replacementMap);
      const assetsToUpload = [
        {
          access: 'protected',
          content: bundleData.content,
          name: bundleUri,
          path: bundleUri,
          filePath: bundleData.filename,
        },
        {
          access: 'protected',
          content: sourceMapData.content,
          name: sourceMapUri,
          path: sourceMapUri,
          filePath: sourceMapData.filename,
        },
      ];

      const assetSids = await uploadFiles(assetsToUpload, serviceSid, serverlessClient);
      const { buildSid } = await getEnvironment(serverlessClient, serviceSid, pluginName);
      let buildAssets = [];
      let buildFunctions = [];
      let buildDependencies = [];
      if (buildSid) {
        const build = await getBuild(buildSid, serviceSid, serverlessClient);
        buildAssets = build.asset_versions;
        buildDependencies = build.dependencies;
        buildFunctions = build.function_versions;
      }

      buildAssets = [
        ...buildAssets.filter((x) => x.path !== bundleUri && x.path !== sourceMapUri).map((x) => x.sid),
        ...assetSids,
      ];

      const payload = {
        dependencies: buildDependencies,
        functionVersions: buildFunctions.map((x) => x.sid),
        assetVersions: buildAssets,
      };

      const { sid: newBuildSid } = await triggerBuild(payload, serviceSid, serverlessClient);
      console.log(newBuildSid);

      const currentEnvironment = await helpers.environment.getCurrentEnvironment(context);
      await helpers.environment.setEnvironmentVariable(
        context,
        currentEnvironment,
        'IN_PROGRESS_BUILD_SID',
        newBuildSid,
      );
      return callback(null, {
        status: 'building',
        newBuildSid,
      });
    }
    const status = await getBuildStatus(context.IN_PROGRESS_BUILD_SID, serviceSid, serverlessClient);
    if (status === 'completed') {
      const { environmentSid, domain_name } = await getEnvironment(serverlessClient, serviceSid, pluginName);
      await activateBuild(context.IN_PROGRESS_BUILD_SID, environmentSid, serviceSid, serverlessClient);
      const currentEnvironment = await helpers.environment.getCurrentEnvironment(context);
      await helpers.environment.setEnvironmentVariable(context, currentEnvironment, 'IN_PROGRESS_BUILD_SID', '');
      return callback(null, { status: 'completed', pluginURI: `${domain_name}${pluginBaseUrl}/bundle.js` });
    } else {
      return callback(null, { status: 'building' });
    }
  } catch (err) {
    if (err.name === 'AxiosError') {
      console.error(err.response);
      console.error(err.response.request);
      console.error(err.response.data);
    } else {
      console.error(err);
    }
    return callback(null, { status: 'failed' });
  }
};
