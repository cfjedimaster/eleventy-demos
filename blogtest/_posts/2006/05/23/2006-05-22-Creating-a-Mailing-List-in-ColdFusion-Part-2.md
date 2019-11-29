---
layout: post
title: "Creating a Mailing List in ColdFusion (Part 2)"
date: "2006-05-23T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/23/Creating-a-Mailing-List-in-ColdFusion-Part-2
guid: 1286
---

Welcome to the second part of my series on how to create a simple mailing list in ColdFusion. Be sure to read the <a href="http://ray.camdenfamily.com/index.cfm/2006/5/22/Creating-a-Mailing-List-in-ColdFusion-Part-1">first entry</a> in the series before starting this one. As previously mentioned, the goal of this application is to create a simple way for users to sign up at your web site. An administrator can then use a tool to send an email to folks who have signed up. Today's entry will deal with the administrator a bit. Now I'm going to cheat a bit. I don't want to spend a lot of time on security and all that, so I'm going to write a script and place it in the same folder as my other files. <b>Obviously in a real world application this file would be placed in a protected folder.</b> The specific item to add to our application today is a simple interface to list the subscribers and add/delete folks. Later in the series I'll discuss how folks can delete themselves, but the honest truth is that even if you provide such a method, folks will still email you (or call you) and demand that you remove them. So lets work on a tool that will make that simple.
<!--more-->
The following script will handle listing subscribers, removing subscribers, as well as adding them:
<code>
&lt;cfif structKeyExists(url, "delete")&gt;
	&lt;cfset application.maillist.unsubscribe(url.delete)&gt;
&lt;/cfif&gt;

&lt;cfif structKeyExists(form, "add") and len(trim(form.email)) and isValid("email", form.email)&gt;
	&lt;cfset application.maillist.subscribe(form.email)&gt;
&lt;/cfif&gt;

&lt;cfset members = application.maillist.getMembers()&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Your mail list has 
	&lt;cfif members.recordCount is 0&gt;
		no members
	&lt;cfelseif members.recordCount is 1&gt;
		1 member
	&lt;cfelse&gt;
		#members.recordCount# members
	&lt;/cfif&gt;. You may use the table below to remove any member, or the form to add a new member.
&lt;/p&gt;	
&lt;/cfoutput&gt;

&lt;cfif members.recordCount gte 1&gt;
	
	&lt;p&gt;
	&lt;table border="1"&gt;
		&lt;tr&gt;
			&lt;th&gt;Email Address&lt;/th&gt;
			&lt;td&gt; &lt;/td&gt;
		&lt;/tr&gt;
		&lt;cfloop query="members"&gt;
		&lt;tr &lt;cfif currentRow mod 2&gt;bgcolor="yellow"&lt;/cfif&gt;&gt;
			&lt;cfoutput&gt;
			&lt;td&gt;#email#&lt;/td&gt;
			&lt;td&gt;&lt;a href="listmembers.cfm?delete=#token#"&gt;Delete&lt;/a&gt;&lt;/td&gt;
			&lt;/cfoutput&gt;
		&lt;/tr&gt;
		&lt;/cfloop&gt;
	&lt;/table&gt;
	&lt;/p&gt;
	
&lt;/cfif&gt;

&lt;form action="listmembers.cfm" method="post"&gt;
&lt;input type="text" name="email"&gt; &lt;input type="submit" name="add" value="Add Subscriber"&gt;
&lt;/form&gt;
</code>

There is a lot going on here, so let's handle it line by line. At the top of the script I have two checks. The first is for list removals. I check for the value, url.delete, and if it exists, I call out to my CFC to unsubscribe the user. I'm using the token instead of the email address. (You will see this later in the script.) The reason for this is that the token serves as a good primary key for the table. Sure, I know the email addresses are unique, but I'm also going to use something similar for the front end. Therefore, I just pass the token to the method.

Adding a subscriber is also rather simple. I look for the submit button (named "add") and check to see if the email address is valid. Because this is the admin I do less hand holding. I'm not going to display an error if the email address isn't valid. Obviously you can change this in your own code. I tend to be a bit cruel in my own administrator tools.

The next section of the script gets the members from the mailing list and displays a simple count of members along with a nicely designed table. (Yes, the nicely designed part is a joke.) I had mentioned above that I use the token for deletions. Now you see where this comes from. Each delete link passes it back to the script. 

Last but not least, I added a simple form with one field and a button. This lets the administrator quickly add email address to the mail list. 

Alright, now that I showed you the front end, let's look at the new version of the CFC:

<code>
&lt;cfcomponent displayName="MailList" output="false"&gt;

&lt;cffunction name="init" returnType="maillist" output="false" access="public"&gt;
	&lt;cfargument name="dsn" type="string" required="true"&gt;
	
	&lt;cfset variables.dsn = arguments.dsn&gt;
	
	&lt;cfreturn this&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getMembers" returnType="query" output="false" access="public" 
			hint="Returns a query of everyone subscribed."&gt;
	&lt;cfset var q = ""&gt;
	
	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select		email, token
	from		subscribers
	order by	email asc
	&lt;/cfquery&gt;
	
	&lt;cfreturn q&gt;
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

&lt;cffunction name="unsubscribe" returnType="void" output="false" access="public" 
			hint="Removes a user to the mailinst list."&gt;
	&lt;cfargument name="token" type="uuid" required="true"&gt;
	
	&lt;cfquery datasource="#variables.dsn#"&gt;
	delete from subscribers
	where token = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.token#"&gt;
	&lt;/cfquery&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Let's focus on the changes from last time. There are two new methods, getMembers and unsubscribe. Both are rather simple, so I won't say a lot about them. If you have questions though, please add a comment. 

Thats it for this entry. As a general FYI, I may not be able to write part three till Friday. I've got a presentation tomorrow night (are you coming?) and Thursday is packed. Also, I made a small tweak to the Application.cfc file. I added a small hook to let me reinit the application using a URL variable. It's in there if you want to take a peak, but isn't anything special. As before, I've attached a zip to this entry so you can download the code and look for yourself. The next entry will add the mailer to the application. (The whole point of the series!)<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fmailinglist1%2Ezip'>Download attached file.</a></p>