---
layout: post
title: "A database utility class for PhoneGap"
date: "2012-01-26T09:01:00+06:00"
categories: [development,mobile]
tags: []
banner_image: 
permalink: /2012/01/26/A-database-utility-class-for-PhoneGap
guid: 4509
---

I've done a few projects now that make use of PhoneGap's <a href="http://docs.phonegap.com/en/1.3.0/phonegap_storage_storage.md.html#Storage">database support</a>. Like most things in PhoneGap, it just plain works. But I've encountered a few things I thought could be done a bit easier, so I've built a simple utility class for my future projects. I thought I'd share it with folks and see if it would be useful for others.
<!--more-->
<p/>

My utility library has the following features:

<p/>

executeBatch: Given a file path (via URL), you can have PhoneGap read in an XML file that contains a set of SQL commands. So for example:

<p/>

<code>
myDbController.executeBatch("sql/createtables.xml",successHandler,errHandler);
</code>

<p/>

Where your XML would look like so:

<p/>

<code>
&lt;sql&gt;
&lt;statement&gt;
create table foo if not exists foo(....)
&lt;/statement&gt;
&lt;statement&gt;
create table moo if not exists foo(....)
&lt;/statement&gt;
&lt;/sql&gt;
</code>

<p/>

This was done to support the fact that unlike Adobe AIR, the SQLite support in PhoneGap doesn't allow you to ship a pre-populated database. (Although it <b>is</b> possible via a workaround: <a href="http://gauravstomar.blogspot.com/2011/08/prepopulate-sqlite-in-phonegap.html?">Prepopulate SQLite DataBase in PhoneGap Application</a>.) The syntax for this was based on work from my fellow evangelist, <a href="http://coenraets.org/blog/">Christope Coenraets</a>. 

<p/>

executeSql: As you can guess, this simply wraps up executing SQL. While PhoneGap doesn't make this necessarily hard, I found the API a bit awkward in terms of all the callbacks you had to use. ("All" sounds like a lot - it's more like two - but you get the idea.) So for example:

<p/>

<code>
dbController.executeSql("select * from notes", gotNote, errHandler);
</code>

<p/>

The other nice thing this will do is automatically take the result set and return it as a simple array of objects. Again, it's not difficult to work with the normal result set, this is just a bit simpler. 

<p/>

Finally, the class has a simple init() handler that sets up your connections for you. What makes it nice is that it can also automatically call your batch scripts for you. So for example:

<p/>

<code>
dbController.init("main","data/seed.xml",dbReady);
</code>

<p/>

The code is below and is free to use by anyone.

<p/>

<code>
var DBController = function() {

	var db,success,failure;
	
	return {

		init:function(name,importscript,successHandler)	{
			//todo - allow for version
			db = window.openDatabase(name,"1.0",name,100000);			
			if(typeof importscript !== "undefined") {
				console.log("being asked to run a script");
				if(typeof successHandler === "undefined") throw "Invalid call - must pass success handler when importing data";
				this.executeBatch(importscript,successHandler);
			}
		},

		executeBatch:function(path,successHandler,errorHandler) {
			success=successHandler;
			failure=errorHandler;
			
			$.get(path, {}, this.gotFile, "xml");
		},

		//sql, successHandler, errorHandler are required
		executeSql:function(sql,args,successHandler,errorHandler) {
			console.log('going to run '+sql+ '    '+arguments.length);
			//Don't like this - but way to make args be optional and in 2nd place
			if(arguments.length == 3) {
				successHandler = arguments[1];
				errorHandler = arguments[2];
				args = [];
			}
			db.transaction(
				function(tx) { tx.executeSql(sql,args,function(tx,res) {
					//todo - figure out fraking scoping rules and why line below didnt work, nor this.X
					//res = translateResultSet(res);
					var result = [];
					for(var i=0; i&lt;res.rows.length; i++) {
						result.push(res.rows.item(i));
					}
					successHandler(result);
				})}
			, errorHandler)	
		},
		
			
		gotFile:function(doc) {
			var statements = [];
			var statementNodes=doc.getElementsByTagName("statement");
			for(var i=0; i&lt;statementNodes.length; i++) {
				statements.push(statementNodes[i].textContent);
			}
			if(statements.length) {
				db.transaction(function(tx) {
					//do nothing
					for(var i=0;i&lt;statements.length;i++) {
						tx.executeSql(statements[i]);
					}
				}, failure,success);
			}
		},
		
		translateResultSet:function(res) {
			var result = [];
			for(var i=0; i&lt;res.rows.length; i++) {
				result.push(res.rows.item(i));
			}
			return result;
			
		}
			
	}
	
};
</code>