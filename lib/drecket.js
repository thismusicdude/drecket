'use babel';
import DrecketView from './drecket-view';
//import DrecketView from './log';
import { CompositeDisposable } from 'atom';
//import java.io.BufferedReader;
//import java.io.InputStreamReader;
//package com.mkyong.shell;

var MessagePanelView = requir Console for Rackete('atom-message-panel').MessagePanelView, PlainMessageView = require('atom-message-panel').PlainMessageView;

export default {

  drecketView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.drecketView = new DrecketView(state.drecketViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.drecketView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
				atom.commands.add('atom-workspace', {
      		'drecket:debug': () => this.toggle()
					}
				)
		);

  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.drecketView.destroy();
  },

  serialize() {
    return {
      drecketViewState: this.drecketView.serialize()
    };
  },

	toggle() {
		var editor = atom.workspace.getActivePaneItem()
		var file = editor.buffer.file
		var filename = file.getPath()
		var substring = ".rkt"
		var messages = new MessagePanelView({title: 'Drecket - DebugConsole'});
		messages.attach();
		if(filename.indexOf(substring)!==-1){

			var exec = require('child_process').exec, child;

			child = exec('racket Studium/1.Semester/FOP/FOP-Aufgaben/ü01/HAs/U1_MaxSchmitt.rkt',
	    	function (error, stdout, stderr) {
					var c = 0;
					if (stdout !== null || stdout != " " || stdout != ""){
						messages.add(new PlainMessageView({message: "OUTPUT:", className: 'text-muted'}));
						messages.add(new PlainMessageView({message: stdout, className: 'text-success'}));
						messages.add(new PlainMessageView({message: "======", className: 'text-muted'}));
						c = 1;
					}
					if (stderr!==null){
						messages.add(new PlainMessageView({message: "ERROR:", className: 'text-muted'}));
						messages.add(new PlainMessageView({message: stderr, className: 'text-error'}));
						messages.add(new PlainMessageView({message: "======", className: 'text-muted'}));
						c = 2;
					}
	        if (error !== null) {
						messages.add(new PlainMessageView({message: "ERROR:", className: 'text-muted'}));
						messages.add(new PlainMessageView({message: stderr, className: 'text-error'}));
						messages.add(new PlainMessageView({message: "======", className: 'text-muted'}));
						c = 3;
	      	}
					if (c!=3){
						messages.add(new PlainMessageView({message: "<< EVERYTHING IS FINE in " + filename + " >>", className: 'text-success'}));
					}
					else{
						messages.add(new PlainMessageView({message: "<< There are some errors in " +filename+ " >>", className: 'text-warning'}));
					}
	    	}
			);
		}else{
			messages.add(new PlainMessageView({message: filename + " is no racketfile!", className: 'text-error'}));
		}
	}
};
