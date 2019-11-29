---
layout: post
title: "Ask a Jedi: Handling a Dead Database"
date: "2005-12-14T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/14/Ask-a-Jedi-Handling-a-Dead-Database
guid: 970
---

A reader asks:

<blockquote>
What is the best way to determine if your CF server can access the datasource defined in app properties?  Basically I want to have and if then clause that continues as usual if the database is available but redirects to a site maintenance page if the db is unavailable.
</blockquote>

Well, I'm not sure if I can say what is the <i>best</i> way, since it will depend on your application, but I can think of a few solutions to this. The first solution is to run a simple query in your application start up. This can be in either onApplicationStart, or wrapped in a old-style Application init setup in Application.cfm. Consider the following:

<code>
&lt;cftry&gt;
	&lt;cfquery name="test" datasource="cflib"&gt;
	select top 1 id
	from tblUDFs
	&lt;/cfquery&gt;
	&lt;cfcatch&gt;
		&lt;cfinclude template="dbdead.cfm"&gt;
		&lt;cfabort&gt;
	&lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

This simply returns a very small query and if anything goes wrong, a file is included and execution aborts. As I said above, you <b>probably</b> want to run this when the application starts up, not on every request.

There is another way to handle this that would work on every request. Simply use the cferror/onerror approach. You can check the error type, and if it is database, load a different message then you would for a normal error. One thing you want to check though - a bad SQL statement will also throw a database exception. If you check the detail, however, you will normally see a message that will tell you if it was a connection problem, or a SQL problem. The following message is what my box said when I tried to connect to SQL Server and it was shut down:

[Macromedia][SQLServer JDBC Driver]Error establishing socket. Connection refused: connect

When I used a bad SQL statement, I got:

[Macromedia][SQLServer JDBC Driver][SQLServer]Invalid object name 'tblUDFsdd'.