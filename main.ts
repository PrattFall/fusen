import { render } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { html } from "htm/preact";

import { BoardActions, BoardsContext, BoardsProvider, newBoard } from "./contexts/Board";
import { ColumnsProvider } from "./contexts/Column";
import { TasksProvider } from "./contexts/Task"

import { ActionBar } from "./components/ActionBar";
import { Board } from "./components/Board";
import { BoardList } from "./components/BoardList";

import { IBoard } from "./domain";
import { AppActions, AppContext, AppProvider } from "./contexts/App";

const logStorage = () => {
  // window.localStorage.clear();
  console.log("app", window.localStorage.getItem("app"));
  console.log("boards", window.localStorage.getItem("boards"));
  console.log("columns", window.localStorage.getItem("columns"));
  console.log("tasks", window.localStorage.getItem("tasks"));
};

type IContainsBoard = { board: IBoard };

const BoardSection = ({ board }: IContainsBoard) =>
  !!board
    ? html`<${Board} ...${board} />`
    : html`<h1>No Board Found</h1>`;

const Page = () => {
  const [app, dispatchApp] = useContext(AppContext);
  const [boards, dispatchBoards] = useContext(BoardsContext);

  useEffect(() => {
    if(boards.length > 0 && !app?.board) {
      dispatchApp(AppActions.Init({ board: boards[0].id }));
    }
  }, [boards]);

  useEffect(() => {
    if(!boards || boards.length < 1) {
      const board = newBoard();
      dispatchBoards(BoardActions.Init([board]));
    }
  }, [app]);

  if(!app) {
    return html`<span>test</span>`;
  }

  const board = boards.find((b: IBoard) => b.id === app.board);

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
