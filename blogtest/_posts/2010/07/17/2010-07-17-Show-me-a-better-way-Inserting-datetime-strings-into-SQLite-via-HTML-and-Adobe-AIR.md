---
layout: post
title: "Show me a better way: Inserting date/time strings into SQLite via HTML and Adobe AIR"
date: "2010-07-17T15:07:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2010/07/17/Show-me-a-better-way-Inserting-datetime-strings-into-SQLite-via-HTML-and-Adobe-AIR
guid: 3881
---

I'm working on my presentation for CFUN which involves jQuery and HTML based AIR applications. (Oh, and ColdFusion too. :) I was working on a sample application that made use of SQLite to create a simple Note application. (If this sounds familiar, it is based on the Flex application I did for my <a href="http://www.raymondcamden.com/index.cfm/2010/6/11/Recording-and-Slides-from-SQLite-presentation">cfObjective SQLite presentation</a>.) Here is the code I tried to insert a new note record into my database.

<p>

<code>
var sqlstatement = new air.SQLStatement()
sqlstatement.sqlConnection = connection
var sql = 
	"insert into notes(title, body,created)"+
	"values(:title,:body,:created)";
		
sqlstatement.text = sql
sqlstatement.parameters[":title"] = title;
sqlstatement.parameters[":body"] = body;
sqlstatement.parameters[":created"] = new Date();
			
sqlstatement.addEventListener(air.SQLEvent.RESULT,contentChange);
sqlstatement.execute(); 
</code>

<p>

There isn't anything too crazy here. I have three columns. The first two are just strings. The third is a date. When I run this, something odd happens. When I displayed the results in a table, I got [object Object] for my created values. I thought at first that AIR was being slick and recognizing a valid JavaScript date object. I tried running .getMonths() on it and got an error that it wasn't a support method. What the heck? So I switched to Lita, an application (also AIR based!) that let's you run ad hoc queries against SQLite databases. Surprisingly, even there, the values were [object Object]! 

<p>

For the heck of it, I then tried using toString() on the JavaScript date object. Here's where things got weird. I got an immediate SQL error saying that my value wasn't a date. So SQLite/AIR recognized Date() as a valid date value, but stored it (from what I could see) incorrectly. Yet when I tried a string representation, it failed. I ended up figuring out the format SQLite wanted. It's pretty pick. If your month or date has one digit you have to prepend it with 0. I wrote this little function to do it for me:

<p>

<code>

//given a date, return it so I can insert it
function dbDateTimeFormat(dt) {
	//i had fancy trenarys here - went for simple
	var month = dt.getMonth()+1;
	if(month &lt; 10) month = "0" + month;
	var day = dt.getDate();
	if(day &lt; 10) day = "0" + day;
	var dStr = dt.getFullYear() + "-" + month + "-" + day;
	var hour = dt.getHours();
	if(hour &lt; 10) hour = "0" + hour;
	var minute = dt.getMinutes();
	if(minute &lt; 10) minute = "0" + minute;
	var second = dt.getSeconds();
	if(second &lt; 10) second = "0" + second;
	dStr += ' ' + hour + ':' + minute + ':' + second
	air.trace(dStr);
	return dStr;
}
</code>

<p>

Obviously this would be a lot slimmer if I used some ternary functions for my month/day parsing, but when I write code, I try to start off as simple as possible. 

<p>

So... someone please tell me I'm wrong. I've got to believe that there is a simple way to do this. Anyone?