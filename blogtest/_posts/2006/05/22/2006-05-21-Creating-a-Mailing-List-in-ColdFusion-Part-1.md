---
layout: post
title: "Creating a Mailing List in ColdFusion (Part 1)"
date: "2006-05-22T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/22/Creating-a-Mailing-List-in-ColdFusion-Part-1
guid: 1284
---

One of the features you may be asked to add to a web site is a mailing list. A mailing list lets people subscribe to get the latest news and updates from whatever your site may be offering. In this series I'll talk about how to add this feature to your web site. Before going on, let me go over the features of this application and what it will provide.

<ol>
<li>Users will be able to fill out a form to subscribe to the mailing list.
<li>Administrators will be able to see a list of people subscribed. They will also be able to remove or add a user manually.
<li>Administrators will be able to send an email to everyone in the list.
<li>Users will be able to remove themselves from the list.
</ol>

There it is, short and sweet. Of course, I remember saying my <a href="http://ray.camdenfamily.com/index.cfm/2006/4/9/Building-your-first-ModelGlue-application--The-Final-Battle">Model-Glue series</a> would be simple as well, and we all know how that turned out.
<!--more-->
In this entry, I'll cover step one, allowing users to subscribe to the list. A client may ask for many different things from their users, but at minimum, all I need to ask for is an email address. So let's start off with the simplest of forms and validation:

<code>
&lt;cfparam name="form.emailaddress" default=""&gt;
&lt;cfset showForm = true&gt;

&lt;cfif structKeyExists(form, "subscribe")&gt;
	&lt;cfif isValid("email", form.emailAddress)&gt;
		&lt;cfset application.maillist.subscribe(form.emailaddress)&gt;
		&lt;cfset showForm = false&gt;
	&lt;cfelse&gt;
		&lt;cfset error = "Your email address isn't valid."&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;

&lt;h2&gt;Subscribe to Foo&lt;/h2&gt;

&lt;cfif showForm&gt;

	&lt;cfif structKeyExists(variables, "error")&gt;
		&lt;cfoutput&gt;
		&lt;p&gt;
		&lt;b&gt;#error#&lt;/b&gt;
		&lt;/p&gt;
		&lt;/cfoutput&gt;
	&lt;/cfif&gt;
	
	&lt;p&gt;
	&lt;form action="subscribe.cfm" method="post"&gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;td&gt;Your Email Address&lt;/td&gt;
			&lt;cfoutput&gt;&lt;td&gt;&lt;input type="text" name="emailaddress" value="#form.emailaddress#"&gt;&lt;/td&gt;&lt;/cfoutput&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt;&nbsp;&lt;/td&gt;
			&lt;td&gt;&lt;input type="submit" name="subscribe" value="Subscribe"&gt;&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;
	&lt;/form&gt;
	&lt;/p&gt;
	
&lt;cfelse&gt;

	&lt;p&gt;
	Thank you for subscribing!
	&lt;/p&gt;
	
&lt;/cfif&gt;
</code>

So there really isn't anything too special about this form, but let talk about some particulars. First off - the form just checks for an email address. As I said, a client may want a lot more information about the user, however none of that really applies to what the goal is - subscribing to a list. Since the form is somewhat simple, I only needed to validate the email field. Note that I used the isValid function, so this code will only work in ColdFusionMX 7. (Just this one line though.) 

After ensuring the email address is actually valid, I pass off to the main CFC I'm going to be using throughout this series:

<code>
&lt;cfset application.maillist.subscribe(form.emailaddress)&gt;
</code>

In case your curious, I'm loading the CFC via onApplicationStart. (Included in the Application.cfc file that is in the zip.) Now let me show you the CFC. Right now it is pretty short, but I'll be adding to it as the series goes on.

<code>
&lt;cfcomponent displayName="MailList" output="false"&gt;

&lt;cffunction name="init" returnType="maillist" output="false" access="public"&gt;
	&lt;cfargument name="dsn" type="string" required="true"&gt;
	
	&lt;cfset variables.dsn = arguments.dsn&gt;
	
	&lt;cfreturn this&gt;
&lt;/cffunction&gt;

&lt;cffunction name="subscribe" returnType="boolean" output="false" access="public" 
			hint="Adds a user to the mailinst list, if and only if the person wasn't already on the list."&gt;
	&lt;cfargument name="email" type="string" required="true"&gt;
	&lt;cfset var checkIt = ""&gt;
	
	&lt;cfif not isValid("email", arguments.email)&gt;
		&lt;cfthrow message="#arguments.email# is not a valid email address."&gt;
	&lt;/cfif&gt;
	
	&lt;!--- only add if the user doesn't already exist. ---&gt;
	&lt;cflock name="maillist" type="exclusive" timeout="30"&gt;
		&lt;cfquery name="checkIt" datasource="#variables.dsn#"&gt;
		select	email
		from	subscribers
		where	email = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.email#"&gt;
		&lt;/cfquery&gt;
		
		&lt;cfif checkIt.recordCount is 0&gt;
		
			&lt;cfquery datasource="#variables.dsn#"&gt;
			insert into subscribers(email,token)
			values(&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.email#"&gt;,&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#createUUID()#"&gt;)
			&lt;/cfquery&gt;
			
			&lt;cfreturn true&gt;
			
		&lt;cfelse&gt;
		
			&lt;cfreturn false&gt;
				
		&lt;/cfif&gt;
		
	&lt;/cflock&gt;
	
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Outside of the init method, right now the only code here is the subscribe method. The subscribe method does a few basic things. First it checks to ensure the email address sent to it was valid. Why am I doing this again? I mean, I know my form checked, so why bother? Well I think it is important to remember that the CFC is separated from the client enough that the CFC may not what to actually trust the client. The CFC should validate information as much, if not more than, the client is. So once again I use the isValid function for a quick way to validate email addresses. If you plan on using my code on a MX6 machine, this is the one line you will need to change. The rest of the method is rather simple. I see if the email address already exists, and if not, I add one to the subscribers table. Note two things. First off - I use a lock around the code block. This lock ensures that if I have multiple requests coming in with the same email address, I don't accidentally insert the same email address more than once. I could use the database to handle that as well, but I wanted to handle it on the CF side for this demonstration. Secondly, notice I insert a UUID into a column named token. I'll be explaining that in step four.

So - if you want to test this, download the zip attached to this article. Create a database with the included SQL file and make a DSN named maillist. Copy the files to a folder and run subscribe.cfm. In the next session I'll add a subscriber administrator tool. This will let the admin see who is subscribed and quickly add or remove individuals.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fmailinglist%2Ezip'>Download attached file.</a></p>