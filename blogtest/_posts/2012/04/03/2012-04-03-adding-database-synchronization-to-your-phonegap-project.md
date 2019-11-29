---
layout: post
title: "Adding database synchronization to your PhoneGap project"
date: "2012-04-03T16:04:00+06:00"
categories: [coldfusion,development,html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/04/03/adding-database-synchronization-to-your-phonegap-project
guid: 4579
---

For the past few days I've been working on a proof of concept PhoneGap application that demonstrates an example of database synchronization. This is a fairly complex topic and I'm only going to demonstrate one version of this, but I hope the concepts, code, and example application are useful to people hoping to tackle the same problem.
<!--more-->
<p>

Before we start digging into code, let me explain what the application will demonstrate and the type of synchronization it will use. Our sample application is going to use a built-in database for documentation. Most mobile applications don't really have a lot of documentation. Anything that complex may not make sense on mobile anyway. But for whatever reason you want to use, the application has a large set of documents stored in the database.

<p>

This documentation may or may not ship with the application, but we want the application to sync with a remote server in order to get the latest and greatest documentation. Our synchronization "rules" will be simple:

<p>

<ul>
<li>If the remote server adds new docs, the app needs to get it.
<li>If the remote server updates existing docs, the app needs to update its copy.
<li>If the remote server deletes a doc, the app needs to delete its local copy.
</ul>

<p>

In this scenario, we don't have to worry about user generated content and handling updates bidirectionally. That allows us to simplify things quite a bit. 

<p>

We have two pieces to this proof of concept, the server and the client. I'm going to quickly talk about the server-side code, but as this is mainly a post about PhoneGap, I won't go into deep detail. I built a very simple ColdFusion application using ORM to allow me to add, edit, and delete objects I called "helpdocuments". These documents contained:

<p>

<ul>
<li>A title (short string)
<li>A body (not so short string)
<li>A field representing when the document was last updated
<li>A token (built around a UUID, more on why we need this later)
<li>A deleted flag (to support 'soft deletes')
</ul>

<p>

You can find the code for this simple application attached to this blog entry. But really - it's just simple CRUD and web forms:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip63.png" class="imgborder" />

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip64.png" class="imgborder" />

<p>

Outside of the service component I'll be using to expose this data remotely, you really don't have to worry about the details and forms here. Let's turn our attention to the client side now.

<p>

First off - do not forget that PhoneGap provides a wrapper to WebSQL, an embedded database you can use with JavaScript. You can check out the <a href="http://docs.phonegap.com/en/1.5.0/phonegap_storage_storage.md.html#Storage">API docs</a> as well as the <a href="http://tv.adobe.com/watch/adc-presents-phonegap/phonegap-storage-api/">video demonstration</a> over on Adobe TV. My application will create a mirror version of the remote database to store a copy of the documentation. This involves:

<p>

<ul>
<li>Creating the initial database
<li>Creating the empty table
<li>Asking the server for data, and later on, asking the server for <i>new</i> data
<li>Rendering the data (in our case, I'm just going to list the titles of the help docs)
</ul>

<p>

Since the actual display is rather trivial, I'll show the HTML for the application first:

<p>

<pre><code class="language-markup">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
	&lt;title&gt;PhoneGap SyncDB Test&lt;/title&gt;
	&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" src="cordova-1.5.0.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" src="main.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body onload="init()"&gt;

&lt;div id="docs"&gt;&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

Yeah, that's it. Obviously a real application would have a bit more meat to it. Let's take a look at main.js, the core logic file for the application. This one is a bit more complex so we're going to take it in chunks.

<p>

<pre><code class="language-javascript">
var db;
//var updateurl = "http://localhost/testingzone/dbsyncexample/serverbackend/service.cfc?method=getupdates&returnformat=json";
var updateurl = "http://www.raymondcamden.com/demos/2012/apr/3/serverbackend/service.cfc?method=getupdates&returnformat=json";

function init() {
	document.addEventListener("deviceready",startup);
}
</code></pre>

<p>

In the first block, we've got a few variable definitions. The db variable will contain a reference to my database. The updateurl is simply the remote server. (And by the way, that URL isn't going to work after I publish this article.) Our init function listens for PhoneGap's deviceready event. This is PhoneGap's way of saying, "It's Business Time." 

<p>

<pre><code class="language-javascript">
function startup() {
	console.log("Starting up...");
	db = window.openDatabase("main","1","Main DB",1000000);
	db.transaction(initDB,dbError,dbReady);
}
</code></pre>

<p>

Here we have the startup function. It opens the database and begins a transaction. Note that I could have put the logic inside an anonymous function within the transaction call. You're going to see an example of that later. But in my opinion, the initialization routine would be complex enough to warrant moving it into its own function to keep things better organized. (It really isn't that complex, but I still feel like it was the right decision to make.)

<p>

Here's the error handler. Again - this would typically be more robust in a production environment:

<p>

<pre><code class="language-javascript">
function dbError(e) {
	console.log("SQL ERROR");
	console.dir(e);
}
</code></pre>

<p>

Now let's look at initDB:

<p>

<pre><code class="language-javascript">
function initDB(tx) {
	tx.executeSql("create table if not exists docs(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, lastupdated DATE, token TEXT)");
}
</code></pre>

<p>

You can see my table creation scheme uses columns that match up with my server. The only column missing is the "soft delete" one. My thinking here was that while my server wants to keep deleted documents around so that they can (possibly) be restored later, my mobile application should try to stay as thin as possible. 

<p>

This is a great time now to talk about the token column. Both my server and client side have it. Why? In order to keep documents in sync from one database server to my mobile applications, I need a way to uniquely identify records. I'm not even sure if the WebSQL client (SQLite) supports inserts with assigned primary keys, but in my mind, the easiest way to handle this was to simply let each "side" handle the primary keys their own way and use the UUID as a way to connect them. This could possibly be done better.

<p>

After our table creation script runs, we finally get to dbReady:

<p>

<pre><code class="language-javascript">
function dbReady() {
	console.log("DB initialization done.");
	//begin sync process
	if(navigator.network && navigator.network.connection.type != Connection.NONE) syncDB();
	else displayDocs();
}
</code></pre>

<p>

As the comment says, this is where we begin our sync process. However, we only do this if the client is actually online. If it isn't, we immediately display our docs. On first run we won't have any, but after that we'll have something. This ensures that offline or online, we're going to support the user reading and interacting with the database.

<p>

Ok - now for the complex portion. Let's look at our synchronization function.

<p>

<pre><code class="language-javascript">
function syncDB() {
	$("#docs").html("Refreshing documentation...");
</code></pre>

<p>

I begin with a simple message letting the user know that important things are going on. Really important things. 

<p>

<pre><code class="language-javascript">
	var date = localStorage["lastdate"]?localStorage["lastdate"]:'';
	console.log("Will get items after "+date);
</code></pre>

Local storage? I thought we were using a database? We are! But there's no reason we can't use both. While working on this proof of concept I had an interesting problem. I want to minimize the amount of data going back and forth between the application and the server. To do that, my application needs to tell the server what its most recent update was. One way of doing that would be run SQL against itself and get the date on the last updated document. That works fine... except for deletes. If the most recent update on the server was to delete something, then the client's most recent date wouldn't match. As I said above, we aren't keeping those deleted records. So as a compromise, I simply used a value in localStorage. Later on you will see where this gets updated.

<p>

<pre><code class="language-javascript">
	$.get(updateurl, {% raw %}{date:date}{% endraw %}, function(resp,code) {
		console.log("back from getting updates with "+resp.length + " items to process.");
</code></pre>

<p>

Here's our server call. It basically pings the remote code and passes in a date. The server asks for all records modified since that date. The result is an array of objects.

<p>

<pre><code class="language-javascript">
resp.forEach(function(ob) {
	db.transaction(function(ctx) {
		ctx.executeSql("select id from docs where token = ?", [ob.token], function(tx,checkres) {
			if(checkres.rows.length) {
				console.log("possible update/delete");
				if(!ob.deleted) {
					console.log("updating "+ob.title+ " "+ob.lastupdated);
					tx.executeSql("update docs set title=?,body=?,lastupdated=? where token=?", [ob.title,ob.body,ob.lastupdated,ob.token]);
				} else {
					console.log("deleting "+ob.title+ " "+ob.lastupdated);
					tx.executeSql("delete from docs where token = ?", [ob.token]);
				}
			} else {
				//only insert if not deleted
				console.log("possible insert");
				if(!ob.deleted) {
					console.log("inserting "+ob.title+ " "+ob.lastupdated);
					tx.executeSql("insert into docs(title,body,lastupdated,token) values(?,?,?,?)", [ob.title,ob.body,ob.lastupdated,ob.token]);
				}
			}

		});
	});
});
</code></pre>

<p>

Holy smokes that's a lot! Let's take it piece by piece. We begin with a simple forEach iterator over the array. For each item, we need to see if already exists. That's done in the SQL that checks for the token.

<p>

If a record exists, then we either need to update it, or delete it. Remember that our server keeps deleted documents and simply flags them. You can see my check for that flag here:

<p>

<pre><code class="language-javascript">
if(!ob.deleted)
</code></pre>

<p>

If the object wasn't deleted, we perform an update. If it was deleted, we perform a delete.

<p>

On the other side of the conditional, we only need to do an insert if the object isn't a delete. 

<p>

Finally - we update our localStorage flag and call displayDocs too. Here's the display function - and again - this was built to be simple.

<p>

<pre><code class="language-javascript">
function displayDocs() {
    db.transaction(function(tx) {
        tx.executeSql("select title from docs order by title asc", [], function(tx, results) {
            var s = "&lt;h2&gt;Docs&lt;/h2&gt;";
            for(var i=0; i&lt;results.rows.length; i++) {
                s += results.rows.item(i).title + "&lt;br/&gt;";
            }
            $("#docs").html(s);
        });
    });
}
</code></pre>

<p>

The end result is an application that updates its data when online and continues to work fine offline. You can download the entire code base below. Any questions?
<p>
<a href='https://static.raymondcamden.com/enclosures/dbsyncexample.zip'>Download attached file.</a></p>