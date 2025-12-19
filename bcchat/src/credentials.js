import fs from 'fs';

exports.getEnv = function(appName, envName) {
  const ids = loadIds();

  console.log(`Loaded ids: ${JSON.stringify(ids)}`);
  const app = ids.apps?.[appName];
  if (!app) {
    throw new Error(`App '${appName}' not found`);
  }

  const env = app.environments.find(e => e.name === envName);
  if (!env) {
    throw new Error(`Environment '${envName}' not found for ${appName}`);
  }

  return env;
};

exports.getEnvs = function(appName){
    const ids = loadIds();

    const app = ids.apps?.[appName];
    if (!app) {
        throw new Error(`App '${appName}' not found`);
    }
    
    return app.environments;
}

function loadIds() {
  const idsPath = '/opt/secrets/ids.json';
  const raw = fs.readFileSync(idsPath, 'utf8');
  return JSON.parse(raw);
}

