# Fusen

A local kanban board for personal projects! Fusen means 'sticky note' for
non-weebs out there. At least that's what google translate tells me, and that's
never steered anyone wrong before!

Currently still in progress, but it has most other
features you would expect:

- A board
    - No, MANY boards
    - Deleteable and selectable
- Columns
    - Addable and Deleteable
    - Renameable
    - Repositionable
    - very pretty
- Tasks in those columns
    - You can drag tasks _between_ those columns (if you want)
    - You can even **delete** tasks
    - Reordering tasks in and between columns
- A reasonably fancy stylesheet
- Stores tasks locally using localstorage

## Notable Design Decisions

- Using `pnpm` for package management
- Using `parcel` for builds
- Using `preact` for views
- Using only `preact` hooks for state management with `useContext` and `useReducer`
    - Probably a bad idea, but I wanted to try it
    - So far hasn't been _too_ bad. Still easier to manage than Angular, but
    that's a pretty low bar
- Using lists in the README for brevity

## Getting Started

Clone the repository, then run:

```bash
$ cd bboard
$ pnpm i
$ pnpm run start
```

You should be able to access the board by going to `localhost:1234`

To test just run:

```bash
pnpm run test
```

## Expected Future Features

- Tags for tasks
- ~~Actually being able to save data to local storage~~
    - maybe a database
- Images?
- At least a couple changeable styles

## Known Issues

- Local Storage is tiny by default so no images unless I create a hostable
version or something
