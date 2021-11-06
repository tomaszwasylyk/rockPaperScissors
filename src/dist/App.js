"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./App.css");
function App() {
    return (react_1["default"].createElement("div", { className: "App" },
        react_1["default"].createElement("header", { className: "App-header" },
            react_1["default"].createElement("video", { src: "example_video.mkv", id: "video", controls: true }),
            react_1["default"].createElement("canvas", { id: "output" }))));
}
exports["default"] = App;
