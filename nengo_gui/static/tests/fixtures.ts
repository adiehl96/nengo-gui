import * as fs from "fs";
import * as jsdom from "jsdom";
import { WebSocket } from "mock-socket";
import * as path from "path";
import { Test } from "tape";

abstract class Fixture {
    constructor(assert: Test) {} // tslint:disable-line
    teardown(assert: Test): void {} // tslint:disable-line
}

export function teardown(assert: Test, ...fixtures: Fixture[]) {
    fixtures.forEach(fixture => {
        fixture.teardown(assert);
    });
    // If you don't want the assert.end() behavior, call teardowns manually.
    assert.end();
}

// Have to do this outside of the class so that the global will be
// set for jQuery, d3, etc

/* tslint:disable:no-string-literal */

const page = fs.readFileSync(path.join(
    __dirname, "..", "..", "templates", "page.html"
), "utf-8");

function setDOMGlobals(document) {
    global["WebSocket"] = WebSocket;
    global["document"] = document;
    global["window"] = global["document"].defaultView;
    // The following are needed for interact.js
    ["navigator", "Element", "Event"].forEach(key => {
        global[key] = global["window"][key];
    });
}
setDOMGlobals(jsdom.jsdom(page));

export class DOM extends Fixture {

    document: jsdom.DocumentWithParentWindow;
    window: Window;

    constructor(assert: Test) {
        super(assert);
        this.document = jsdom.jsdom(page);
        this.window = this.document.defaultView;
        setDOMGlobals(this.document);
    }
}