import * as React from "react";
import ReactDOM from "react-dom";
import App from "./App";

declare let __GRAPHIQL_CSS__: string;

const style = document.createElement("style");
document.body.appendChild(style);
style.innerHTML = __GRAPHIQL_CSS__;

const rootEl = document.createElement("div");
rootEl.style.height = "100%";
rootEl.style.willChange = "transform";

document.body.appendChild(rootEl);

ReactDOM.render(<App />, rootEl);
