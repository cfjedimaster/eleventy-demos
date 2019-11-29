---
layout: post
title: "Example of PhoneGap's Database Support"
date: "2011-10-20T11:10:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/10/20/example-of-phonegaps-database-support
guid: 4401
---

Folks who have used Adobe AIR before already know (or hopefully know) about it's cool, built-in database support. Any AIR application (whether written in Flex or HTML - you do remember you can do AIR with HTML, right?) can make use of an embedded SQLite database. This is incredibly useful for applications and pretty darn easy to use as well. PhoneGap also has built in support for SQLite via their <a href="http://docs.phonegap.com/en/1.1.0/phonegap_storage_storage.md.html">storage</a> support. In this blog entry I'll walk you through a sample application I've created that makes use of the feature. I'll also point out some of the mistakes I made while writing so that hopefully you can avoid the issues I ran into.
<!--more-->
<p/>

First - it is important to <i>carefully</i> read PhoneGap's <a href="http://docs.phonegap.com/en/1.1.0/phonegap_storage_storage.md.html">storage</a> documentation. I don't know why - but the biggest issue I've had with PhoneGap so far has been around my incorrect assumptions not matching up with reality. I guess I shouldn't be surprised there, but with PhoneGap I've found it <i>really</i> critical to <b>carefully</b> read the docs. It isn't that PhoneGap is brittle per se, but you really need to ensure you know what you're doing. Consider yourself warned. 

<p/>

Along with PhoneGap's docs, you want to read the W3C spec for <a href="http://dev.w3.org/html5/webdatabase/">Web SQL Database</a> support. It definitely helped fill in some things that the PhoneGap docs didn't cover. As an example, the PhoneGap docs enumerate the error codes for the SQLError object, but don't tell you the actual values that go with them. The W3C <a href="http://dev.w3.org/html5/webdatabase/#sqlerror">docs</a> for SQLError though have both the labels and the codes. 

<p/>

For folks who are familiar with SQLite in AIR, there are two main differences I've found between the AIR and PhoneGap platforms.

<p/>

First - it seems (although I've not confirmed this) that PhoneGap only supports asynchronous connections. That's not a bad thing typically, but I tend to prefer synchronous connections since they are a lot simpler to work with. They can lock your application up if you need to perform a particularly long operation, but I like having the option at least. I'll typically use two connections in an AIR app. I'll have a synchronous one for setup and then an asynchronous one to handle post-launch operations. Again - with PhoneGap you only have the asynchronous option.

<p/>

Second - while both AIR and PhoneGap support transactions through SQLite, PhoneGap requires <b>all</b> SQL transactions to go through a transaction. This adds a level of complexity to your code that may be a bit confusing at first, but once you've worked through a couple of examples it really isn't that big of a deal. It tended to bite me in the rear because I made the mistake of running "executeSQL" on my transaction object instead of "executeSql". The application reported it as a database error because the transaction callback was executing. This was confusing and hard to debug.

<p/>

Ok - so let's talk about the application. My demo application is called SimpleNotes. It's a very poor, very limited note taking application. It's got a grand total of two screens. The first is a list of your current notes.

<p/>


<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-10-20-091716.png" />

<p/>

You can click a note to edit it, or simply click Add Note.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/device-2.png" />

<p/>

So how does it work? I've got an event handler that listens in for the <a href="http://docs.phonegap.com/en/1.1.0/phonegap_events_events.md.html#deviceready">deviceready</a> event. This event is fired by PhoneGap when the hardware is ready for business time. I began by having it call a function named phoneReady:

<p/>

<code>
function phoneReady() {
    //First, open our db    
    dbShell = window.openDatabase("SimpleNotes", 2, "SimpleNotes", 1000000);
    //run transaction to create initial tables
    dbShell.transaction(setupTable,dbErrorHandler,getEntries);
}
</code>

<p/>

In case your curious why I named the database twice - the first string is the database name while the second one is the <i>display</i> name. Much like my name is Raymond but I write it as G-Megabyte. (Now you know...) The second argument is the version. This can be used to shift the application from one database version to another. Normally you would update a database with SQL though so I'm not sure that folks would change this often in production. The last argument is the size. I picked 1000000 because I thought it looked nice on paper. Notice then we have a transaction to run setupTable. This is where I'll do my initial definitions.

<p/>

<code>
//I just create our initial table - all one of em
function setupTable(tx){
    tx.executeSql("CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY,title,body,updated)");
}   
</code>

<p/>

As you can see, I use "IF NOT EXISTS" in my creation script. That makes it safe to run more than once. For information on valid SQL syntax for SQLite, check their <a href="http://www.sqlite.org/docs.html">docs</a>. Ok, now if you remember the original transaction call, it had 2 more arguments. The second was a generic error handler, and the third was getEntries. First let's look at the error handler:

<p/>

<code>
function dbErrorHandler(err){
    alert("DB Error: "+err.message + "\nCode="+err.code);
}
</code>

<p/>

Most likely, and especially for an application like this, any error should be logged, possibly emailed, and also result in the termination of the app itself. My application is pretty useless if it can't do what it needs to with the database. But how you handle your errors will be up to the individual application. Let's more on then to getEntries.

<p/>

<code>
//I handle getting entries from the db
function getEntries() {
    dbShell.transaction(function(tx) {
        tx.executeSql("select id, title, body, updated from notes order by updated desc",[],renderEntries,dbErrorHandler);
    }, dbErrorHandler);
}
</code>

<p/>

So compared to the earlier transaction call I got a bit fancier here. I've embedded the function within the transaction call itself. It may be a bit hard to read there so let me rewrite this in pseudo-code so it is clear:

<p/>

<code>
Start a transaction:
  execute my sql, and on a good result, run renderEntries, and on a bad result, run dbErrorHandler
If the transaction fails: run dbErrorHandler
</code>

<p/>

I sometimes tried to put the result handler in the transaction call, but if you do that, you don't get passed the result of the SQL execution. So... don't do that. The second argument to executeSql (the empty array) is how bound parameters are handled. Since I have none I just pass it as an empty array. Now let's look at renderEntries.

<p/>

<code>
function renderEntries(tx,results){
    doLog("render entries");
    if (results.rows.length == 0) {
        $("#mainContent").html("&lt;p&gt;You currently do not have any notes.&lt;/p&gt;");
    } else {
       var s = "";
       for(var i=0; i&lt;results.rows.length; i++) {
         s += "&lt;li&gt;&lt;a href='edit.html?id="+results.rows.item(i).id + "'&gt;" + results.rows.item(i).title + "&lt;/a&gt;&lt;/li&gt;";   
       }
       $("#noteTitleList").html(s);
       $("#noteTitleList").listview("refresh");
    }
}
</code>

<p/>

So a good portion of this is generic DOM manipulation and jQuery Mobile related, but focus on how I use the results attribute. I can easily check the length and handle an empty database. I can also easily loop over them and access the data. Pretty simple, right? Let's look at one more function. When saving a note, I'm either saving an existing note or editing a new one. I've got code in there to handle that, but let's focus on the actual save operation.

<p/>

<code>
function saveNote(note, cb) {
    //Sometimes you may want to jot down something quickly....
    if(note.title == "") note.title = "[No Title]";
    dbShell.transaction(function(tx) {
        if(note.id == "") tx.executeSql("insert into notes(title,body,updated) values(?,?,?)",[note.title,note.body, new Date()]);
        else tx.executeSql("update notes set title=?, body=?, updated=? where id=?",[note.title,note.body, new Date(), note.id]);
    }, dbErrorHandler,cb);
}
</code>

<p/>

So before we start - I'll say that the note argument is a simple JavaScript object. It's got values for title, body, and possibly the ID. The cb argument is simply a call back to execute. Notice how I handle insert versus update logic. Also note how i handle the bound parameters. Very much like AIR. It looks like you can't do named parameters like you can in Adobe AIR, so make your get your positions right.

<p/>

And that's pretty much it. There's a lot more logic around to handle my form editing and the like, but you can see that yourself in the attached zip. The zip contains an unsigned APK as well as a copy of the code. Note - when saving a note I've got a weird page display issue going on. Anyone who fixes that gets mega bonus points from the pool.

<b>Edit:</b> For folks downloading the code, please see Anne's comment <a href="http://www.raymondcamden.com/2011/10/20/Example-of-PhoneGaps-Database-Support#cA435E0AE-B9F8-5539-415C9E70E6806AEA">here</a>.

<p><a href='/enclosures/SimpleNote.zip'>Download attached file.</a></p>