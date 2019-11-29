---
layout: post
title: "Building your first Model-Glue application (part 3)"
date: "2006-03-16T08:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/16/Building-your-first-ModelGlue-application-part-3
guid: 1153
---

In my <a href="http://ray.camdenfamily.com/index.cfm/2006/3/15/Building-your-first-ModelGlue-application-part-2">last entry</a>, I walked us through the basic security setup for the application. We modified the Home event so that it broadcasted an event. This event checked to see if we were logged in, and if not, set a result back to our Home event that would force us to a Logon event. However, I hard coded this so that it always thought we needed to logon. Today we will start building the user system so that you can really logon. You may ask - don't we need the registration system first? Yes - but I find the logon to be simpler so I typically start with that. At the end of this process (in tomorrow's entry) I'll place some temporary data in the database so we can test.
<!--more-->
Let's start by designing our Users table. The following table lists out the fields and types:

<table border="1">
<tr>
<td>username</td>
<td>String (required/50 char max/primary key)</td>
</tr>
<tr>
<td>password</td>
<td>String (required/50 char max)</td>
</tr>
<tr>
<td>name</td>
<td>String (required/50 char max)</td>
</tr>
</table>

These columns and settings should be pretty obvious. A real user table would probably have more information than just the name, but again, we want to keep it simple. I'm going to create this table in a SQL Server database, but you should be able to create it in any type of database. Once you have set up your table (and you can use the install.sql file in the zip file attached to this entry), we then need to create a DSN. For this application, the dsn name will be PhotoGallery. If you remember, we added this setting in the last entry. Now you simply need to hook it up in the ColdFusion Administrator.

So far so good.  Now we finally get to work on the Model. We've worked in the Controller already. We added the getAuthenticated method, but never tied it to our Model. We've worked with the View layer as well. When we added the new Logon event, we had to write a view file to render that event. Now we need to work on the User portion of the Model. 

I'm not going to spend a lot of time talking about how I set up the User model, since that could be a series to itself. I will talk a bit about it at a high level so that hopefully you get what I'm doing, and you can dig a bit deeper later on. The way I design my CFCs now are such that every data type (user, product, etc) has 3 CFCs. The first CFC is the Bean. I tend to think of the Bean as a simple instance of the data. It has methods to set and get properties. It has a simple validation method. But that's it. No logic for inserting into the database or reading all users. It basically just handles one instance. The CFC is below:

<code>
&lt;cfcomponent output="false" displayName="User Bean"&gt;

&lt;cfset variables.instance = structNew() /&gt;
&lt;cfset variables.instance.username = "" /&gt;
&lt;cfset variables.instance.password = "" /&gt;
&lt;cfset variables.instance.name = "" /&gt;

&lt;cffunction name="setUsername" returnType="void" access="public" output="false"&gt;
	&lt;cfargument name="username" type="string" required="true"&gt;
	&lt;cfset variables.instance.username = arguments.username&gt;
&lt;/cffunction&gt;
 
&lt;cffunction name="getUsername" returnType="string" access="public" output="false"&gt;
	&lt;cfreturn variables.instance.username&gt;
&lt;/cffunction&gt;

&lt;cffunction name="setPassword" returnType="void" access="public" output="false"&gt;
	&lt;cfargument name="password" type="string" required="true"&gt;
	&lt;cfset variables.instance.password = arguments.password&gt;
&lt;/cffunction&gt;
  
&lt;cffunction name="getPassword" returnType="string" access="public" output="false"&gt;
	&lt;cfreturn variables.instance.password&gt;
&lt;/cffunction&gt;

&lt;cffunction name="setName" returnType="void" access="public" output="false"&gt;
	&lt;cfargument name="name" type="string" required="true"&gt;
	&lt;cfset variables.instance.name = arguments.name&gt;
&lt;/cffunction&gt;
  
&lt;cffunction name="getName" returnType="string" access="public" output="false"&gt;
	&lt;cfreturn variables.instance.name&gt;
&lt;/cffunction&gt;

&lt;cffunction name="validate" returnType="array" access="public" output="false"&gt;
	&lt;cfset var errors = arrayNew(1)&gt;
	
	&lt;cfif not len(trim(getUsername())) or not isValid("email", getUsername())&gt;
		&lt;cfset arrayAppend(errors,"Username cannot be blank and must be a valid email address.")&gt;
	&lt;/cfif&gt;

	&lt;cfif not len(trim(getPassword()))&gt;
		&lt;cfset arrayAppend(errors,"Password cannot be blank.")&gt;
	&lt;/cfif&gt;

	&lt;cfif not len(trim(getName()))&gt;
		&lt;cfset arrayAppend(errors,"Name cannot be blank.")&gt;
	&lt;/cfif&gt;

	&lt;cfreturn errors&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getInstance" returnType="struct" access="public" output="false"&gt;
	&lt;cfreturn duplicate(variables.instance)&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;	
</code>

As I said, I don't want to spend a lot of time on the particulars of the CFC, but basically the core of the CFC are methods to set and read the three properties we discussed above.

The next CFC I create is the DAO, or Data Access Object. The purpose of this CFC is to handle persistence. It will create, read, update, and delete users. (Also known as CRUD methods.) This CFC is below, and again, as it is mostly just simple SQL, I'm not going to spend a lot of time on it.

<code>
&lt;cfcomponent output="false" displayName="User DAO"&gt;

&lt;cfset variables.dsn = ""&gt;
&lt;cfset variables.LOCK = "photogallery_user"&gt;
	
&lt;cffunction name="init" access="public" returnType="UserDAO" output="false"&gt;
	&lt;cfargument name="dsn" type="string" required="true"&gt;
	
	&lt;cfset variables.dsn = arguments.dsn&gt;
	
	&lt;cfreturn this&gt;
&lt;/cffunction&gt;
	
&lt;cffunction name="create" access="public" returnType="userBean" output="false"&gt;
	&lt;cfargument name="bean" type="userBean" required="true"&gt;
	&lt;cfset var insRec = ""&gt;
	&lt;cfset var checkUsername = ""&gt;
	
	&lt;cflock name="#variables.LOCK#" type="exclusive" timeout="30"&gt;
	
		&lt;cfquery name="checkUsername" datasource="#variables.dsn#"&gt;
			select	username
			from	users
			where	username = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.bean.getUsername()#" maxlength="50"&gt;
		&lt;/cfquery&gt;
	
		&lt;cfif checkUsername.recordCount&gt;
			&lt;cfthrow message="Username already exists."&gt;
		&lt;cfelse&gt;	
			&lt;cfquery name="insRec" datasource="#variables.dsn#"&gt;
			insert into users(username, password, name)
			values(
				&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.bean.getUsername()#" maxlength="50"&gt;,
				&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.bean.getPassword()#" maxlength="50"&gt;,
				&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.bean.getName()#" maxlength="50"&gt;
				)
			&lt;/cfquery&gt;
						
			&lt;cfreturn bean&gt;
		&lt;/cfif&gt;	
	&lt;/cflock&gt;
&lt;/cffunction&gt;
	
&lt;cffunction name="delete" access="public" returnType="void" output="false"&gt;
	&lt;cfargument name="id" type="numeric" required="true"&gt;

	&lt;cfquery datasource="#dsn#"&gt;
	delete from users
	where id = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.id#"&gt;
	&lt;/cfquery&gt;
	
&lt;/cffunction&gt;
	
&lt;cffunction name="read" access="public" returnType="userBean" output="false"&gt;
	&lt;cfargument name="username" type="string" required="true"&gt;
	&lt;cfset var bean = createObject("component","userBean")&gt;
	&lt;cfset var getit = ""&gt;
	
	&lt;cfquery name="getit" datasource="#dsn#"&gt;
		select 	username, password, name
		from	users
		where	username = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.username#" maxlength="50"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfif getit.recordCount&gt;
		&lt;cfloop index="col" list="#getit.columnlist#"&gt;
			&lt;cfinvoke component="#bean#" method="set#col#"&gt;
				&lt;cfinvokeargument name="#col#" value="#getit[col][1]#"&gt;
			&lt;/cfinvoke&gt;
		&lt;/cfloop&gt;
	&lt;/cfif&gt;
	
	&lt;cfreturn bean&gt;
&lt;/cffunction&gt;

&lt;cffunction name="update" returnType="userBean" access="public" output="false"&gt;
	&lt;cfargument name="bean" type="userBean" required="true"&gt;

	&lt;cfquery datasource="#dsn#"&gt;
	update	users
	set username = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.bean.getUsername()#" maxlength="50"&gt;,
	    password = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.bean.getPassword()#" maxlength="50"&gt;,
	    name = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.bean.getName()#" maxlength="50"&gt;
	where 	id = &lt;cfqueryparam cfsqltype="cf_sql_int" value="#arguments.bean.getID()#"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfreturn arguments.bean&gt;
&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

There are only a few "interesting" things going on here, and they don't have anything to do with Model-Glue. First off - notice that I use a lock when creating users. This will handle checking to see that a duplicate user isn't accidentally created. (I don't do the same check on Update, but my View will prevent it. That's something I need to return to later.) Next - notice my read method. I like how I use cfinvoke and the query columns to dynamically set the bean values. This is handy for larger beans, but a bit of overkill here. Again - this isn't Model-Glue stuff, just the way I do things.

Our final CFC is the Gateway. Now the previous two CFCs (the bean and the DAO) are things that I've seen other, smarter, folks do. I've learned this setup from Joe Reinhart (creator of Model-Glue) and Sean Corfield. I credit them both because I'm not sure which of them I saw use code like this. I'm not saying they do the exact thing I've done here, but I want to be sure folks don't think I "invented" this stuff out of the blue. As it stands, I'm still learning how best to set up my CFCs, as I bet most of my readers are. You will see that I don't use this format for all my open source applications, only my most recent ones. The Gateway CFC typically will do one thing for me - return a query of all users. I also use the Gateway for "misc" type methods. So for example, if my stats page needs to tell me the last 10 users logged on, I'll use the Gateway CFC to build a method for that. If my application has a search page, I'll build a search method in the Gateway CFC. In our application, the authenticate method will reside in the Gateway. Here is our code:

<code>
&lt;cfcomponent&gt;

&lt;cfset variables.dsn = ""&gt;

&lt;cffunction name="init" access="public" returnType="userGateway" output="false"&gt;
	&lt;cfargument name="dsn" type="string" required="true"&gt;
	
	&lt;cfset variables.dsn = arguments.dsn&gt;
	
	&lt;cfreturn this&gt;
&lt;/cffunction&gt;

&lt;cffunction name="authenticate" access="public" returnType="boolean" output="false"&gt;
	&lt;cfargument name="username" type="string" required="true"&gt;
	&lt;cfargument name="password" type="string" required="true"&gt;
	&lt;cfset var q = ""&gt;
	
	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select	username
	from	users
	where	username = &lt;cfqueryparam cfsqltype="cf_sql_varchar" maxlength="50" value="#arguments.username#"&gt;
	and		password = &lt;cfqueryparam cfsqltype="cf_sql_varchar" maxlength="50" value="#arguments.password#"&gt;
	&lt;/cfquery&gt;
	
	&lt;cfreturn q.recordCount is 1&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getUsers" access="public" returnType="query" output="false"&gt;
	&lt;cfset var q = ""&gt;
	
	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select		username, password, name
	from		users
	order by 	name asc
	&lt;/cfquery&gt;
	
	&lt;cfreturn q&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

Again, nothing terribly surprising here so I won't spend a lot of time on it. The important thing to remember is - <b>nothing I talked about above has anything to do with Model-Glue</b>. What do I mean by that? Model-Glue handles the communication between the Controller, the View, and the Model. But the Model can be anything. You do <b>not</b> need to set your CFCs that way I have. The awesome thing about Model-Glue is - you could create one CFC, for example, to handle all user interaction, hook it up to the Controller, and then change the Model later on. At most you will need to modify your Controller and how it talks to the Model, but your View need not change at all.

So we just spent a lot of time on this model, and now we need to actually hook it up to Model-Glue so we can actually logon. Since this entry is pretty darn long already though I hope you don't mind if I make you wait to the next entry. (I actually began the process of modifying the Controller, so you will see that in the zip, but I'll not be talking about it till tomorrow.) 

<b>Summary</b>

What did we do here?

<ul>
<li>This entry focused on the Model, specifically, the code to handle User data.
<li>We started by building the database table in the back end.
<li>We then created three CFCs to manage our Model.
</ul>

I've included an updated zip attached to this entry. Since there was zero change to the front end, I didn't update the online example.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fwwwroot2%2Ezip'>Download attached file.</a></p>