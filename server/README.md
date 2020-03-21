# Backend server

# Backlog
- [x] [Do backlog for the following sprint](../docs/architecture/backend/README.md)
- [x] [C4 diagram](../docs/architecture/backend/)
- [x] [Uml diagram](../docs/architecture/backend/Uml Backend.svg)
- [x] [Use case diargam](../docs/architecture/backend)
- [x] \(Optional) Basic server shell

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
