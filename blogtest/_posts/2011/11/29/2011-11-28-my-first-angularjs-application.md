---
layout: post
title: "My first AngularJS application"
date: "2011-11-29T11:11:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2011/11/29/my-first-angularjs-application
guid: 4449
---

Earlier this year I <a href="http://www.raymondcamden.com/index.cfm/2011/6/19/Take-a-look-at-Angular">blogged</a> about the <a href="http://angularjs.org">AngularJS</a> framework. I thought the docs and the tutorial were cool and overall it felt like a real cool way to build a JavaScript "Application" - and yes, with the quotes there I'm talking about something more than a simple one page, Ajaxified file. Unfortunately, I never got the time to play more with AngularJS until this week. Yesterday I reviewed the <a href="http://docs.angularjs.org/#!/tutorial">tutorial</a> again and decided to take a stab at building my own application. I ran into a few hiccups, but in general, the process was straight forward, and after actually <i>building</i> something with the framework, <b>I love it</b>, and can't wait to try more with it. Let's take a look at my application. (And of course, please keep in mind that this is my first AngularJS application. It's probably done completely wrong. Keep that in mind....)

<p>
<!--more-->
For my first application, I decided to build a simple Note manager. This is something I've done many times before. I'm a huge fan of <a href="http://evernote.com/">Evernote</a> and I keep hundreds of notes stored in it. My application will allow for adding, editing, deleting, and viewing of simple notes. In this first screen shot you can see the basic UI.

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip239.png" />

<p>

You can click a note to see the details...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip240.png" />

<p>

And of course basic editing is supported...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip241.png" />

<p>

So what does the code look like? First, I've got my core index page:

<p>

<code>

&lt;!DOCTYPE html&gt;
&lt;html xmlns:ng="http://angularjs.org/"&gt;
&lt;head&gt;
	&lt;meta charset="utf-8"&gt;
	&lt;title&gt;Note Application&lt;/title&gt;
	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css"&gt;
	&lt;link rel="stylesheet" href="css/main.css"/&gt;
&lt;/head&gt;

&lt;body ng:controller="NoteCtrl"&gt;

	&lt;div class="container"&gt;

		&lt;ng:view&gt;&lt;/ng:view&gt;

	&lt;/div&gt;
	
	&lt;script src="lib/angular/angular.js" ng:autobind&gt;&lt;/script&gt;
	&lt;script src="js/controllers.js"&gt;&lt;/script&gt;
	&lt;script src="js/services.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

All of the real display will happen within the view, which is managed in my controller. Let's look at that file next.

<p>

<code>
/* App Controllers */

function NoteCtrl($route) {
  var self = this;

  $route.when('/notes',
              {% raw %}{template: 'partials/note-list.html',   controller: NoteListCtrl}{% endraw %});
  $route.when('/notes/add',
              {% raw %}{template: 'partials/note-edit.html', controller: NoteEditCtrl}{% endraw %});
  $route.when('/notes/edit/:noteId',
              {% raw %}{template: 'partials/note-edit.html', controller: NoteEditCtrl}{% endraw %});
  $route.when('/notes/:noteId',
              {% raw %}{template: 'partials/note-detail.html', controller: NoteDetailCtrl}{% endraw %});
  $route.otherwise({% raw %}{redirectTo: '/notes'}{% endraw %});

  $route.onChange(function(){
    self.params = $route.current.params;
  });

  $route.parent(this);
}

function NoteListCtrl(Note_) {
	var self = this;
	self.orderProp = 'title';
	self.notes = Note_.query();
  
	self.delete = function(id) {
		console.log("delete "+id);
		Note_.delete(id);
		self.notes = Note_.query();
		//refreshes the view
		self.$root.$eval();	
	}
	
	self.edit = function(id) {
		window.location = "./index.html#/notes/edit/"+id;
	}
}

function NoteDetailCtrl(Note_) {
  var self = this;
  self.note = Note_.get(self.params.noteId);
  
  if(typeof self.note === "undefined") window.location = "./index.html";
}

function NoteEditCtrl(Note_) {
	console.log('EDIT CTRL');
	var self = this;
		
	if(self.params.hasOwnProperty("noteId")) self.note = Note_.get(self.params.noteId);
	else self.note = {% raw %}{ title:"", body:""}{% endraw %};

	self.cancel = function() {
		window.location = "./index.html";
	}
  
	self.save = function() {
		Note_.store(self.note);
		window.location = "./index.html";
	}
  
}
</code>

<p>

Essentially, this file consists of the main controller which simply handles routing based on the URL. The other three controls handle listing, editing, and the detail view. Now let's look at the note service.

<p>

<code>

/* http://docs.angularjs.org/#!angular.service */

angular.service('Note', function(){
	return {
		query:function() { 
			var notes = [];
			for(var key in localStorage) {
				if(key.indexOf("note_") == 0) {
					notes.push(JSON.parse(localStorage[key]));
				}
			}
			console.dir(notes);
			return notes; 
		},
		delete:function(i) {
			localStorage.removeItem("note_"+i);
		},
		get:function(i) { 
			if(localStorage["note_"+i]) return JSON.parse(localStorage["note_"+i]);
			console.log("no note for "+i);
		},
		store:function(note) {
			if(!note.hasOwnProperty('id')) {
				//yep, hack, get all notes and find highest id
				var notes = this.query();
				var highest = 0;
				for(var i=0; i&lt;notes.length; i++) {
					if(notes[i].id &gt; highest) highest=notes[i].id;
				}
				note.id = ++highest;
			}
			note.updated = new Date();
			localStorage["note_"+note.id] = JSON.stringify(note);
		}
	}
	
});
</code>

<p>

As you can see, my note service is simply a collection of methods. My application makes use of HTML5's Local Storage feature. It looks for any key that begins with note_ and considers that application data. It stores notes as JSON strings and the service handles both deserializing and serializing the information. What's cool is that I could - in theory - replace this with a SQL version and nothing else would change. 

<p>

All that's really left are the views. Here is the first view - and keep in mind - this is the entire file for the display of notes on the first screen.

<p>

<code>

    Search: &lt;input type="text" name="query"/&gt;
    Sort by:
    &lt;select name="orderProp"&gt;
      &lt;option value="title"&gt;Title&lt;/option&gt;
      &lt;option value="-updated"&gt;Newest&lt;/option&gt;
    &lt;/select&gt;


&lt;h2&gt;Notes&lt;/h2&gt;

&lt;table class="bordered-table"&gt;
	&lt;tr&gt;
		&lt;th&gt;Title&lt;/th&gt;
		&lt;th&gt;Updated&lt;/th&gt;
		&lt;th&gt;&nbsp;&lt;/th&gt;
	&lt;/tr&gt;
	&lt;tr ng:repeat="note in notes.$filter(query).$orderBy(orderProp)"&gt;
		&lt;td&gt;&lt;a href="#/notes/{% raw %}{{note.id}}{% endraw %}"&gt;{% raw %}{{note.title}}{% endraw %}&lt;/a&gt;&lt;/td&gt;
		&lt;td&gt;{% raw %}{{note.updated |{% endraw %} date:'MM/dd/yyyy @ h:mma'}}&lt;/td&gt;
		&lt;td&gt;&lt;a href="" ng:click="edit(note.id)" title="Edit"&gt;&lt;img src="images/page_edit.png"&gt;&lt;/a&gt; &lt;a href="" ng:click="delete(note.id)" title="Delete"&gt;&lt;img src="images/page_delete.png"&gt;&lt;/a&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;

&lt;p ng:show="notes.length==0"&gt;
	Sorry, there are no notes yet.
&lt;/p&gt;

&lt;a href="#/notes/add" class="btn primary"&gt;Add Note&lt;/a&gt;
</code>

<p>

Take note of the ng:repeat and the embedded tokens wrapped in {}. Also note how easy it is to format the date. The detail view is incredibly boring.

<p>

<code>
&lt;h1&gt;{% raw %}{{note.title}}{% endraw %}&lt;/h1&gt;
&lt;p&gt;
&lt;b&gt;Last Updated:&lt;/b&gt; {% raw %}{{note.updated |{% endraw %} date:'MM/dd/yyyy @ h:mma'}}
&lt;/p&gt;

{% raw %}{{note.body}}{% endraw %}
</code>

<p>

And the edit one is also pretty trivial:

<p>

<code>

&lt;h1&gt;Edit Note&lt;/h1&gt;

&lt;form class="form-stacked" onSubmit="return false" id="editForm"&gt;
	&lt;div class="clearfix"&gt;
		&lt;label for="title"&gt;Title:&lt;/label&gt;
		&lt;div class="input"&gt;
			&lt;input type="text" id="title"  name="note.title" class="xlarge"&gt;
		&lt;/div&gt;
	&lt;/div&gt;

	&lt;div class="clearfix"&gt;
		&lt;label for="body"&gt;Body&lt;/label&gt;
		&lt;div class="input"&gt;
			&lt;textarea class="xxlarge" id="body" name="note.body" rows="3"&gt;&lt;/textarea&gt;
		&lt;/div&gt;
	&lt;/div&gt;

	&lt;div&gt;
		&lt;button ng:click="save()" class="btn primary"&gt;Save&lt;/button&gt; &lt;button ng:click="cancel()" class="btn"&gt;Cancel&lt;/button&gt;
	&lt;/div&gt;

&lt;/form&gt;
</code>

<p>

Pretty simple, right? For the heck of it, I ported this over into a PhoneGap application, and it worked well. The UI is a bit small, but I was able to add, edit, delete notes just fine on my Xoom table. I've included a zip file of the core code for the application and the APK as well if you want to try it. You may demo the app yourself below, and note, it makes use of console for debugging, so don't run it unless you've got a proper browser.

<p>

<a href="http://www.raymondcamden.com/demos/2011/nov/29/index.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a><p><a href='/enclosures/angular%2Dnotes.zip'>Download attached file.</a></p>