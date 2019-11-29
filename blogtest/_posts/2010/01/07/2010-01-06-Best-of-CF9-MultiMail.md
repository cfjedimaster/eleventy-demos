---
layout: post
title: "Best of CF9: MultiMail"
date: "2010-01-07T08:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/07/Best-of-CF9-MultiMail
guid: 3676
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" a style="float:left;margin-right:5px;margin-bottom:5px"/> Today's Best of ColdFusion 9 entry is MultiMail, created by Guust Nieuwenhuis and reviewed by Daniel Short. MultiMail was created to solve a problem I'm well aware of - multiple browser tabs dedicated to web based mail clients. Guust's solution was to design a web application that allowed you to define multiple mail accounts (both POP and IMAP). Once your accounts are defined you can then browse the inbox for each. The application also allows you to send mail from any account.  The design is simple, but nice:
<br clear="all"/>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/mm_home.png" title="Home Page" />
</p>
<br clear="all"/>
<p>
Adding accounts is pretty straight forward. Once you've added accounts, you can easily edit them later as well. I ran into a bug creating IMAP accounts. If you get an error, try simply backing out and getting to the edit screen. It seems like the application created it fine but threw an error afterwards.
</p>
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/mm_edit.png" title="Edit Accounts" />
</p>
<p>
The mailbox design makes use of CFGRID and uses nice icons within the grid itself:
</p>

<p>
<img src="https://static.raymondcamden.com/images/cfjedi/mm_inbox.png" />
</p>
<p>
All in all, a pretty, and handy, little application. But let's start nit picking. The primary ColdFusion 9 usage here is ORM, CFIMAP, and script enhancements. If you read the install instructions they mention running a MySQL install script, but Daniel discovered that wasn't necessary. He set up a Derby database and simply loaded the application. He did modify Application.cfc a bit. The original ormSettings were:
</p>

<code>
this.ormsettings.dbCreate = "none";
this.ormsettings.dialect = "MySQLwithMyISAM";
</code>

<p>
Daniel change it to  this:
</p>

<code>
this.ormsettings.dbCreate = "update";
this.ormsettings.dialect = "MicrosoftSQLServer";
</code>

<p>
Two things to notice here. The dbCreate change allows ORM to setup the tables for you. Very useful! Also note that dialect. I wasn't aware that the SQL Server dialect would work with Derby. Has anyone else seen that?
</p>

<p>
Another issue I ran into was with error management. His application did handle errors nicely, but unfortunately, it didn't log them or email the errors. This made it difficult when I ran into issues with the IMAP accounts. I modified his onError quickly enough though:
</p>

<code>
writedump(arguments);abort;
</code>

<p>
I'm a bit bugged by his onApplicationStart(). Consider this:
</p>

<code>
function onApplicationStart()
{
	setApplicationScope();
}

function setApplicationScope()
{
	application.name = this.name;

	application.maxRows = "25";

	application.POP3Debug = "yes";
	application.IMAPDebug = "yes";

	application.attachmentPath = "mmAttachments/";

	// instances of service cfc's for the CF interface
	application.userService = new UserService();
	application.mailAccountService = new MailAccountService();
	application.POP3Service = new POP3Service();
	application.IMAPService = new ImapService();

	application.appscopeset = true;
}
</code>

<p>
So what bugs me? First - why bother with setApplicationScope? I'd put all those lines within onApplicationStart. Secondly, why use appscopeset=true? That looks like an old school way to handle the lack of a proper 'onApplicationStart' feature (ie, everything before we got Application.cfc). Thirdly - why set application.name to this.name? ColdFusion automatically copies the application name to the application scope. A bunch of small nits there, but it's something to keep in mind. 
</p>
<p>
His Application.cfc onRequestStart is worth taking a look at as well. It is a small MVC type system. I'm not a big fan of writing my own MVC code (I'd rather use Model-Glue or FW/1) but his is nice and simple:
</p>

<code>
function onRequestStart()
{
	if(!StructKeyExists(APPLICATION, "appscopeset") || StructKeyExists(URL, "resetAppScope"))
	{
		setApplicationScope();
	}

	if(StructKeyExists(URL, "action"))
	{
		local.controller = ListFirst(URL.action, ".");
		local.action = ListLast(URL.action, ".");
	}
	else
	{
		local.controller = this.defaultController;
		local.action = this.defaultAction;
	}

	local.c = CreateObject("component", "controller." & local.controller);
	local.view = evaluate("c." & local.action & "()");

	if(!StructKeyExists(local, "view"))
	{
		local.view = local.action;
	}

	include "view/header.cfm";

	local.view = "view/" & local.controller & "/" & local.view & ".cfm";
	include local.view;

	include "view/footer.cfm";
}
</code>
<p>
I like this - but I'll point out that - normally - it is a bad idea to automatically include a header and a footer within your Application.cfc file. Almost always you run into a situation where you don't want the layout. (Any AJAX request for example.) I will say that the automatic include there - based on URL variables, is nicely locked down. You shouldn't be able to hack that to view files you aren't allowed to. 
</p>
<p>
Random comment - I noticed this in one of the controllers:
</p>
<code>
location("index.cfm");
abort;
</code>

<p>
Don't forget that cflocation (and obviously the script based equivalent) will abort the current request for you.
</p>
<p>
Random question/comment - I noticed he didn't use script based CFCs for ImapService and POP3Service. You can use CFPOP with script now, but not CFIMAP. I wonder though if there is a reason why he didn't make use of the script based POP support added to ColdFusion 9?
</p>
<p>
Anyway - download the code below, play, and post your comments!
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fthebestofcoldfusion9contest%{% endraw %}2Ezip'>Download attached file.</a></p>