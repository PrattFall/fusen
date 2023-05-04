# BBoard

Not a bulletin board, it's a local kanban board for personal projects!

Currently still in progress, and has no local storage yet, but it has most other
features you would expect:

- A board
- Addable columns
- Renameable columns
- Tasks in those columns
    - You can drag tasks _between_ those columns (if you want)
    - You can even **delete** tasks
- A reasonably fancy stylesheet

## Notable Design Decisions

- Using `pnpm` for package management
- Using `parcel` for builds
- Using `preact` for views
- Using only `preact` hooks for state management with `useContext` and `useReducer`
    - Probably a bad idea, but I wanted to try it
- Using lists in the README for brevity

## Getting Started

Clone the repository, then run:

```bash
$ cd bboard
$ pnpm i
$ pnpx parcel index.html
```

You should be able to access the board by going to `localhost:1234`

## Expected Future Features

- Actually being able to save data to local storage
    - maybe a database
- More than 1 board
- Renaming boards
- Tags for tasks
- Images?
- At least a couple changeable styles
