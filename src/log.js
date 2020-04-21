import chalk from 'chalk';

export const info = (msg) => {
  console.log(chalk.gray(msg));
};

export const warning = (msg) => {
  console.log(chalk.yellow(msg));
};

export const success = (msg) => {
  console.log(chalk.green(msg));
};

export const error = (msg) => {
  console.log(chalk.red(msg));
};

export const bold = (msg) => {
  console.log(chalk.bold(msg));
};
