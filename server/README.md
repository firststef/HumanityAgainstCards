# Backend server

# Backlog
- [x] [Do backlog for the following sprint](../docs/architecture/backend/)
- [x] [C4 diagram](../docs/architecture/backend/)
- [x] [Uml diagram](../docs/architecture/backend/)
- [x] [Use case diargam](../docs/architecture/backend)
- [x] [Definition of done](../docs/architecture/backend)
- [x] \(Optional) Basic server shell

# How to run

Requires [nodejs](https://nodejs.org/en/)

- ```touch config.js``` Create a config.js file
- Copy the contents of config.js.example to it
- Contact a member of the backend team, for the database credentials
- ```npm start```
- Enjoy ! The server is now running on the port defined in the config file ^^

## Definition of done
### Sprint 1

- [x] Create and configurate a basic mongodb database 
- [ ] Create a database schema for all the required objects
- [ ] Create a route (or a socket) that returns a list of all avaiable ongoing games
- [ ] Create a route that allows autentification
- [ ] Prepare for user page

### Auth 
- Using cookie sessions
- md5 password encoding 

#### Auth requirements
- [ ] Login module
- [ ] Logout route
- [ ] Register module
- [ ] Password recovery module trough email
- [ ] Make the module togable

### Ongoing games route
- Returns an object containing an array, of all the ongoing games.
- In order to return 200 it requires the cookie session of the auth module.

#### Ongoing games requirements
- [ ] Allow a set of basic filters to pass trough the request
- [ ] Prepare for pagination (In case a page parameter has been provided as wel, as an elements per page parameter, return only the required numbers of elems)

### Prepare for user page
- Basic routes to return basic info about an user


## How to node
# TODO

## How to express
# TODO

## How to *"git good"* :)

Downlaod git ```https://git-scm.com/downloads```

- Clone the github repository into a local folder
``` git clone "repo url"```
- Somewone pushed work, you curently don't have ? 
```
git pull
```

- After you have made a few desired changes in order to commit them pull first and then commit ^^
```
git pull
git add . #to add all the changes made to the repo. (or instead of "." passs a file with a relative path)
git commit -m "Some commit message"
git push origin master #or instead of the master branch the branch you wich to work on
```

- Did u make any undesired changes to the repo ? 
```
git stash # Moves all the curent changes you made, that arrent commited, on a separated memory stash.
git stash drop # drops the stashed memory
```

- Recover the stashed memory (You can store multiple changes in stashes)
```
git stash apply stash # apply top of stash stack
```

- Don't know if u amde any changes you need to commit  ? 
```
git status # see if there's anything you need to commit
```

- Want to change the branch you are currently working n ? 
```
git checkout "branch name"
```

- Want to see the branches that are being worked on locally ? 
```
git branch
```

- Create a new branch to store any new changes
```
git branch my-branch
```

- switch to that branch (line of development)
```
git checkout my-branch
```

- Merge lines of development together. 
This command is typically used to combine changes made on two distinct branches. 
For example, a developer would merge when they want to combine changes from a feature branch into the master branch for deployment.
```
git merge
```

## For more please check out https://guides.github.com/introduction/git-handbook/
