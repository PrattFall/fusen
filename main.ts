import { render } from "preact";
import { useContext } from "preact/hooks";
import { html } from "htm/preact";

import { ColumnsProvider } from "./contexts/Column";
import { TasksProvider } from "./contexts/Task"

import { Board } from "./components/Board";
import { ActionBar } from "./components/ActionBar";
import { BoardsContext, BoardsProvider } from "./contexts/Board";
import { IBoard } from "./domain";

const clearstorage = () => {
  // window.localStorage.clear();
  console.log("boards", window.localStorage.getItem("boards"));
  console.log("columns", window.localStorage.getItem("columns"));
  console.log("tasks", window.localStorage.getItem("tasks"));
};

type IContainsBoard = { board: IBoard };

const BoardSection = ({ board }: IContainsBoard) =>
  !!board
    ? html`<${Board} ...${board} />`
    : html`<h1>NO BOARD FOUND</h1>`;

const Page = () => {
  const [boards, _] = useContext(BoardsContext);

  const board = !!boards && boards.length > 0 ? boards[0] : null;

  return html`
    <header role="banner" class="site-header">
      <div class="site-logo h2" onClick=${clearstorage}>
        BBoard
      </div>
      <div class="flex-filler"></div>
      <${ActionBar}></>
    </header>
    <main role="main">
      <${BoardSection} board=${board} />
    </main>
  `;
};

// Insanity goes here
const App = () => html`
  <${BoardsProvider}>
    <${ColumnsProvider}>
      <${TasksProvider}>
        <${Page} />
      </>
    </>
  </>
`;

render(html`<${App} />`, document.body);
