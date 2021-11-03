import * as React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const link = document.createElement("link");
link.href = "https://unpkg.com/graphiql/graphiql.min.css";
link.rel = "stylesheet";
document.body.appendChild(link);

const rootEl = document.createElement("div");
document.body.appendChild(rootEl);

ReactDOM.render(<App />, rootEl);
