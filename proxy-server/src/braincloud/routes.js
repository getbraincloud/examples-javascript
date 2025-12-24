import express from "express";
import fs from "fs";
import CryptoJS from "crypto-js";

const appsPath = "/app/config/apps.json";

const router = express.Router();

function getAppsConfig(){
    return JSON.parse(fs.readFileSync(appsPath, "utf8"));
}

function removeAppSecrets(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeAppSecrets);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key]) => key !== "appSecret")
        .map(([key, value]) => [key, removeAppSecrets(value)])
    );
  } else {
    return obj; 
  }
}

router.get("/getEnvs/:appName", (req, res) => {
  const { appName } = req.params;
  const appsConfig = getAppsConfig();
  const appConfig = appsConfig[appName];
  if(!appConfig) return res.status(404).json({error: "App not found"});
  const envs = removeAppSecrets(appConfig.environments);
  
  res.json(envs);
});

router.get("/getApps", (req, res) => {
    const appsConfig = getAppsConfig();
    const apps = removeAppSecrets(appsConfig);
    res.json(apps);
});

router.post("/sign", (req, res) => {
    const { appname, envname } = req.headers;
    const appsConfig = getAppsConfig();
    const app = appsConfig[appname];
    if(!app){
        throw new Error(`App '${appname}' not found`);
    }
    const env = app.environments.find(e => e.name === envname);
    if (!env) {
        throw new Error(`Environment '${envname}' not found`);
    }
    const sig = CryptoJS.MD5(JSON.stringify(req.body) + env.appSecret).toString();
    res.json({sig:sig});
});

export default router;
