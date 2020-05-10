# Runkod CLI 

## Install

Runkod command line interface is available on npmjs package manager. You can easily install CLI globally with following command. Please make sure you have Node and NPM installed on your operating system.

```
> npm install -g @runkod/runkod-cli
```

## Commands

All commands require Runkod API Key to work. Click [here](https://runkod.com/manager) to get yours.

### Login

After obtaining your Runkod API key, you can use `login` command to get started, this command also saves your API Key locally on your machine for future convenience.

```
> runkod login
```

### Deploy

Default command. Deploys a local folder to a project. With one command you can deploy any project/folder directly and easily.

**Args**

```
-p, --project (project id | project name | project address | domain name)
-f, --folder (local path)
-a, --activate (any) - automatically activates the new deployment if any value given
``` 

```
runkod deploy 
```

### List

Once you are logged in and have deployed some projects, you can easily check all your projects. Following command lists all projects of the active account.

```
> runkod list
```

### Create

Creates a new project.

```
> runkod create
```

### Show

Shows a specific project and its details, status.

**Args**

`-p, --project (project id | project name | project address | domain name)`

```
> runkod show
```

### Status

You can change status of the project with following command.

```
> runkod status
```

**Args**

`-p, --project (project id | project name | project address | domain name)`

### Logout

Removes your stored credentials from local machine and logouts.

```
> runkod logout
```

### Whoami

Prints active user information on console.

```
> runkod whoami
```

## Found a bug or have some suggestions

To report a non-critical issue, please file an issue on this [GitHub project](https://github.com/runkod/runkod-cli/issues).

If you find a security issue please report details to: security@runkod.com
