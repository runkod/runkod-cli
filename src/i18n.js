import i18n from 'i18next';
import chalk from "chalk";


const check = chalk.green('✔');

const en = {
  "login-required": "You haven't logged in yet!",
  "login": {
    "input-label": "Enter your api key:",
    "input-error": "Empty key received",
    "success": "👍 Logged in as {{name}} <{{email}}>"
  },
  "logout": {
    "message": "👋 Bye"
  },
  "create": {
    "input-label": "Enter a project name or leave it empty for a random name:",
    "success": check + " New project has been created."
  },
  "list": {
    "no-projects": "You have no projects.",
    "no-projects-hint": "Run `runkod create` to create your first project.",
    "count-label-single": "1 project",
    "count-label": "{{n}} projects"
  },
  "show": {
    "no-projects": "You have no projects.",
    "no-projects-hint": "Run `runkod create` to create your first project.",
    "no-project": "No such a project: {{i}}",
    "select-project": "Select a project to show: "
  },
  "deploy": {
    "select-project": "Select a project: ",
    "no-project": "No such a project: {{i}}",
    "invalid-folder": "Invalid path! Please enter a valid folder!",
    "warning-no-html": "The deployment you are uploading doesn't contain any html files. Usually web applications contain at least one html file. Continue?",
    "warning-server-side": "Server side code detected. Note that Runkod doesn't provide server side code support. Continue?",
    "warning-node-modules": "You are about to deploy a folder that contains 'node_modules' folder. You might want to choose a build folder instead. Continue?",
    "cancelled": "Cancelled",
    "uploading": "Uploading {{p}}%",
    "completed": "🎉 Deploy completed",
    "activate": "Do you want to activate new deployment now?",
    "activated": check + " New deployment activated"
  },
  "status": {
    "no-projects": "You have no projects.",
    "no-projects-hint": "Run `runkod create` to create your first project.",
    "no-project": "No such a project: {{i}}",
    "select-project": "Select a project to set status:",
    "selected-project": check + " Project:",
    "select-status": "Select status:",
    "success": check + " Done"
  }
};

const resources = {
  en: {
    translation: en
  }
};

i18n.init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
}).then();

export const _t = (k, args = {}) => {
  return i18n.t(k, args);
};
