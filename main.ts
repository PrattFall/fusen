import { render } from "preact";
import { html } from "htm/preact";

import { ColumnsProvider } from "./contexts/Column";
import { TasksProvider } from "./contexts/Task"

import { Board } from "./components/Board";

const Page = () => html`
  <header role="banner">
    <div class="site-logo h2">
      BBoard
    </div>
  </header>
  <main role="main">
    <${Board} title="New Board" />
  </main>
`;

// Insanity goes here
const App = () => html`
  <${ColumnsProvider}>
    <${TasksProvider}>
      <${Page} />
    </>
  </>
`;

render(html`<${App} />`, document.body);
