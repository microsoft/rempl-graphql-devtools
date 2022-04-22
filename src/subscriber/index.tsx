import * as React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const link = document.createElement("link");
link.href = "https://unpkg.com/graphiql/graphiql.min.css";
link.rel = "stylesheet";
document.body.appendChild(link);

const rootEl = document.createElement("div");
rootEl.style.height = "100%";
rootEl.style["will-change"] = "transform";

document.body.appendChild(rootEl);

// very bad way to remove opacity from the iframe container
// may not work in TMP 
const iframeParent = parent.window.document.getElementsByTagName('iframe')[0].parentElement?.parentElement;
if (iframeParent) iframeParent.style.opacity = "1"; 

ReactDOM.render(<App />, rootEl);
