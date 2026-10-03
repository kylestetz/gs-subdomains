window.$ = window.jQuery = require('jquery');
window.Bacon = require('baconjs');
window._ = require('lodash');

const Actions = require('./actions'),
	Model = require('./model'),
	App = require('./components/App');

window.Model = Model;
window.Actions = Actions;
window.dispatch = Actions.dispatch;
window.h = require('virtual-dom/h');
window.Component = require('./components/Component');

const diff = require('virtual-dom/diff');
const patch = require('virtual-dom/patch');
const createElement = require('virtual-dom/create-element');

$(() => {
	// Connect the Actions -> Model
	Model.listen(Actions.dispatch);

	// Create an intial render tree to diff against
	// and put it in the DOM.
	let app = App(Model.get());
	let tree = app.render(Model.get());
	let root = createElement(tree);
	document.body.appendChild(root);

	Model.changes.onValue(data => {
		// collect the markup from the component tree,
		// diff and render.
		let new_tree = app.render(data);
		let patches = diff(tree, new_tree);
		root = patch(root, patches);
		tree = new_tree;
	});

	// dispatch.push(Actions.setCurrentScene(0));
});