import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import read from 'read';
import prompts from 'prompts';
import terminalLink from 'terminal-link';

import * as formatter from './formatter';

export const input = (placeholder, required = '') =>
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'input',
        message: placeholder,
        validate: (a) => {
          if (required && a === '') {
            return required;
          }

          return true;
        }
      }
    ])
    .then(function (value) {
      return value.input;
    });

export const passwordInput = (placeholder, required = '') =>
  inquirer
    .prompt([
      {
        type: 'password',
        name: 'input',
        message: placeholder,
        validate: (a) => {
          if (required && a === '') {
            return required;
          }

          return true;
        }
      }
    ])
    .then(function (value) {
      return value.input;
    });


export const folderInput = (defaultPath) =>
  new Promise((resolve) => {
    read({
      prompt: chalk.bold('Local folder: '),
      default: defaultPath,
      silent: false,
      edit: true
    }, function (err, answer) {
      if (answer) { // can be undefined on ctrl+c
        resolve(answer.trim());
      }
    })
  });


export const select = (title, choices) => {
  const cancel = '---Cancel---';

  choices.unshift({title: cancel, value: null});

  return prompts([
    {
      type: 'select',
      name: 'answer',
      message: title,
      choices,
      initial: 1
    }
  ]).then(r => {
    return choices.find((x) => x.value === r.answer);
  })
};

export const selectProject = (title, projects) => {
  const choices = projects.map((project) => {
    return {
      value: project.id,
      title: formatter.projectName(project)
    }
  });

  return select(title, choices).then((r) => {
    if (r && r.value) {
      return projects.find((x) => x.id === r.value);
    }
    return null;
  });
};

export const confirm = (title) => {
  return inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: title,
        default: false
      }
    ]).then((value) => {
      return value.confirm;
    })
};

export const spinner = (title) => ora(title);

