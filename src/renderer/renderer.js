import React from "react"
import ReactDOM from "react-dom/client"
import "./style/style.scss"

const root = ReactDOM.createRoot(document.getElementById('app'));
const element = <div style={{ margin: "20px 20px" }}>
    hello
</div>;
root.render(element);