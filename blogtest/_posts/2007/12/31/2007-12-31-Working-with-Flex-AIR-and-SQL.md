---
layout: post
title: "Working with Flex, AIR, and SQL"
date: "2007-12-31T15:12:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2007/12/31/Working-with-Flex-AIR-and-SQL
guid: 2566
---

I decided to give myself a new AIR/Flex project, one that would specifically use the built-in database. My project was a simple one - a time tracker.
<!--more-->
I currently use <a href="http://www.sidejobtrack.com">Side Job Track</a> to track all of my clients, projects, and hours. While this has the benefit of being a web site and available from multiple locations, it has a few quirks that really bug me. It just doesn't <i>flow</i> right for me. It is also a bit slow. All in all - I'm just tired of using it and figured, why not build something better? Since I'll be the only user, I'll have exactly one person to please, so how hard can that be?

I began by deciding to use Flex. I really like the HTML side of AIR, but I've got to practice my Flex more. I'm not going to show a lot of my Flex code as it - well - sucks - but let's take a look at how easy it is to use databases in AIR.

You begin my creating/opening your database. The cool thing is that this is all one statement. When you connect to a database AIR will simply create it if it doesn't exist. So my Flex app runs the following code:

<code>
public var conn:SQLConnection = new SQLConnection();
public var dbFile:File = File.applicationStorageDirectory.resolvePath("data.db");

public function init():void {
	conn.addEventListener(SQLEvent.OPEN, openDBHandler);
	conn.addEventListener(SQLErrorEvent.ERROR, errorDBHandler);		
	conn.openAsync(dbFile);
}	
</code>

So line by line, let me describe what is going on - and let me remind folks - I'm learning this myself. If I get the details wrong, please correct me.

The first line simply creates a connection object. We are going to use this as our main "pipe" to our database.

The second line simply creates a file pointer. The applicationStorageDirectory is a shortcut to a private area for my application. Basically, it asks AIR to give me a file name in a special place just for my application. I <b>love</b> how AIR does that. The file name I picked, data.db, is nothing special.

Next up is the init() function. I have this running from the creationComplete() of my Flex app. I add two events to my connection. One for an error, one for success. I then simple open it. Again - here is where AIR will create the database if it doesn't exist. 

So at this point - we have a database. How do we seed it with tables? We can run SQL that will create the table if it doesn't exist. If you remember, I had an event run when the database was opened. This function looks like so:

<code>
public function openDBHandler(event:SQLEvent):void {
	trace("db opened, now making new sql");
	//create tables, will do nothing if table already exists
	var sql:String =
	"CREATE TABLE IF NOT EXISTS clients(" +
	" id INTEGER PRIMARY KEY AUTOINCREMENT, " +
	" name TEXT, " +
	" description TEXT " +
	")";
	var createStmt:SQLStatement = new SQLStatement();
	createStmt.sqlConnection = conn;
	createStmt.text = sql;
	createStmt.addEventListener(SQLEvent.RESULT, dbReadyResult);
	createStmt.addEventListener(SQLErrorEvent.ERROR, errorDBHandler);
	createStmt.execute();
}
</code>

I'll skip to the interesting bits. The sql string is just that - a string. Notice the "if not exists" - basically this SQL will create the table if it hasn't already been made yet. My time tracker will be simple, but in a complex application, you may want to introspect the database to see if a table exists instead of running a bunch of create statements. 

I make a SQLStatement object, and tell it what connection to use, what SQL to use, and want events to run.

With me so far? So here is where I had to think a bit. My time tracker application will have 2 buttons to start off with (in my first draft). A clients button will let you add/edit/delete clients, where clients are just a name and a description. The projects button will let me add/edit/delete projects, with a name, client foreign key, and 'active' state. 

My application was going to start on the clients page. (I actually want it to jump into 'hour entry' mode, but I'm building the client portion first.) But I can't load clients until the database is opened, created, setup, you get the picture.

So what I did probably wasn't best. To handle the asynchronous nature of my db calls (note that AIR supports a synchronous version as well) I used a Flex ViewStack. My initial view would be a loading screen. When everything was done loading up, I'd load my clients screen:

<code>
public function dbReadyResult(event:SQLEvent):void {
	mainView.selectedChild = clientsView;
	trace("all done, let's boogie");
}
</code>

Don't worry about mainView/clientsView for now - they are just visual components (and I'm including the full source at the end). 

Ok - so now that I have a database, I wanted to build a datagrid to display the information in the clients table. The SQL was again - fairly simple:

<code>
private function loadData():void {
	selectData = new SQLStatement();
	selectData.sqlConnection = dbconnection;		
	selectData.text = "select id, name, description from clients order by name asc";
	selectData.addEventListener(SQLEvent.RESULT, resultHandler);
	selectData.execute();
}
</code>

The only trouble I ran into was changing the result data into an arrayCollection for my datagrid. I tried to cast it, which would make it super simple to use, but that didn't work. What's odd is that it didn't give an error either. So I did it by hand:

<code>
private function resultHandler(event:SQLEvent):void {
	clientData = new ArrayCollection();
	var result:SQLResult = selectData.getResult();
	trace('num of client rows is '+result.data.length);
	for (var i:int = 0; i &lt; result.data.length; i++) {
		var row:Object = new Object();
		row["name"] = result.data[i]["name"];
		row["description"] = result.data[i]["description"];
		row["id"] = result.data[i]["id"];
		clientData.addItem(row);
	}
}
</code>

I'm surprised there isn't a generic way of doing it. The AIR docs show a generic way to trace() the results, so I may convert that to a generic function I can use to build an arrayCollection from a SQLResult object. (<b>Edit: Please see note below.</b>)

The rest of my code was pretty much grunt work. I added a simple form and a way to add, edit, and delete. I will point out something cool. AIR/SQLLite support parameters, just like the cfqueryparam tag in ColdFusion. They are pretty easy to use as well. First, just use the :XXX syntax:

<code>
insert into clients(name,description) values(:name,:description)
</code>

And then provide values for the parameters. Here is a full example of an insert:

<code>
var insStmt:SQLStatement = new SQLStatement();
insStmt.sqlConnection = dbconnection;
var sql:String = "insert into clients(name,description) values(:name,:description)"; 
insStmt.parameters[":name"] = namefield.text;
insStmt.parameters[":description"] = descriptionfield.text;
		
insStmt.text = sql;
insStmt.addEventListener(SQLEvent.RESULT, refreshHandler);
		
insStmt.execute();
</code>

You can also do positional paramters. You can also tell AIR what the column types are for select statements, as well as retrieve only a set of rows instead of the full result set. 

I'm very impressed with what I see so far. If you want to check out my demo please click the download link below. I included a AIR package as well. Please note that my client form doesn't do validation, so be nice to it. 

Please remember to not take my code as 'best practices'.

My next goal is to get Projects working, and then the data entry form.

The last thing I'll do is play with the Reports area so I can try out charts, and see if I can get an Excel/Numbers export working.

<b>Edit</b> I spoke with Todd Sharp, and he pointed out a simpler way to turn my SQLResult into an ArrayCollection. I changed my code to just this:

<code>
private function resultHandler(event:SQLEvent):void {
	var result:SQLResult = selectData.getResult();
	clientData = new ArrayCollection(result.data);
}
</code>

I don't have the line I tried originally, but it wasn't that. Anyway - that is a lot slimmer. I've updated the zip (although I kept in the old code in a comment) and I rebuilt the AIR.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive15%{% endraw %}2Ezip'>Download attached file.</a></p>