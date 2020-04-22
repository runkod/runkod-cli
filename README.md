# Runkod CLI 

## Install

```
> npm install -g @runkod/runkod-cli
```

## Commands

All commands require Runkod API Key. Click [here]() to get yours.

### Login

Logs you in and saves your API Key locally.

```
> runkod login
```

### Deploy

Default command. Deploys a local folder to a project.

#### Args

```
-p, --project (project id | project name | project address | domain name)
-f, --folder (local path)
-a, --activate (any) - automatically activates the new deployment if any value given
``` 

```
runkod deploy 
```

### List

Lists all projects of the active account.

```
> runkod list
```

### Create

Creates a new project.

```
> runkod create
```

### Show

Shows a particular project

#### Args

`-p, --project (project id | project name | project address | domain name)`

```
> runkod show
```

### Status

Updates status of a project

```
> runkod status
```

#### Args

`-p, --project (project id | project name | project address | domain name)`

### Logout

Removes your stored credentials.

```
> runkod logout
```

### Whoami

Prints active user information

```
> runkod whoami
```

