import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import read from 'read';

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


export const select = (title, options) => {
  const cancel = '---Cancel---';

  options.unshift({name: cancel});

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'answer',
        message: title,
        choices: options,
        pageSize: 20
      }
    ])
    .then((value) => {
      // cancelled
      if (value.answer === cancel) {
        return null;
      }

      // return selected item
      return options.find((x) => x.name === value.answer);
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

