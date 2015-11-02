Code In The Dark Platform
=========================

Web platform for Code in the Dark competition.

## Requirements

- Node.js and npm

## Setting up

- Clone this repository and cd into it
- `npm i` (installing dependencies, may take a while)
- `npm start` (start the server)

## Routes

- `/`: Login route
- `/code`: Editor route for contestants
- `/admin`: Admin route for previewing

## Workflow

- Use your feature branch for developing (i.e. `server`, `contestant`, or `admin`).
- If there's an update on master, sync with: `git checkout master`, `git pull`, `git checkout <branch>`, `git rebase master`.
- Use descriptive commit messages (No 'commit banyak')
- Make atomic working commits (Work on a single small feature each time. Don't commit unfinished work unless specified as WIP)
- If you finished working on a branch (or want to merge your branch to master), use the 'Merge Request' feature on Gitlab
