import { render } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import { BoardActions, BoardsContext, BoardsProvider, newBoard } from "./contexts/Board";
import { ColumnsProvider } from "./contexts/Column";
import { TasksProvider } from "./contexts/Task"

import { ActionBar } from "./components/ActionBar";
import { View as BoardView } from "./components/Board";
import { BoardList } from "./components/BoardList";

import { Board } from "./domain";
import { AppActions, AppContext, AppProvider } from "./contexts/App";

const logStorage = () => {
  console.log("app", window.localStorage.getItem("app"));
  console.log("boards", window.localStorage.getItem("boards"));
  console.log("columns", window.localStorage.getItem("columns"));
  console.log("tasks", window.localStorage.getItem("tasks"));
  window.localStorage.clear();
};

type IContainsBoard = { board: Board.T };

const BoardSection = ({ board }: IContainsBoard) =>
  !!board
    ? html`<${BoardView} ...${board} />`
    : html`<h1>No Board Found</h1>`;

const Page = () => {
  const [app, dispatchApp] = useContext(AppContext);
  const [boards, dispatchBoards] = useContext(BoardsContext);

  const selectFirstBoard = () => {
      dispatchApp(AppActions.Init({ board: boards[0].id }));
  };

  useEffect(() => {
    if(!app?.board) {
      if(!!boards && boards.length > 0) {
        return selectFirstBoard();
      }
      else {
        const board = newBoard();
        return dispatchBoards(BoardActions.Init([board]));
      }
    } else if(boards.filter(b => b.id === app.board).length === 0) {
      if(!!boards && boards.length > 0) {
        return selectFirstBoard();
      }
    }
  }, [boards, app]);

  if(!app) {
    return html`<span>Wait for app to load</span>`;
  }

  const board = boards.find((b: Board.T) => b.id === app.board);

  return html`
    <header class="site-header">
      <div class="site-logo h2" onClick=${logStorage}>
        BBoard
      </div>
      <div class="flex-filler"></div>
      <${ActionBar}>
        <${BoardList} />
      </>
    </header>
    <main>
      <${BoardSection} board=${board} />
    </main>
  `;
};

// Insanity goes here
const App = () => html`
  <${AppProvider}>
    <${BoardsProvider}>
      <${ColumnsProvider}>
        <${TasksProvider}>
          <${Page} />
        </>
      </>
    </>
  </>
`;

render(html`<${App} />`, document.body);
