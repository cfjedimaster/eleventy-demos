---
layout: post
title: "Setting up my Transfer Application"
date: "2008-11-04T20:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/04/Setting-up-my-Transfer-Application
guid: 3083
---

Following up on my <a href="http://www.raymondcamden.com/index.cfm/2008/11/3/ColdFusion-and-Transfer-And-that-3-letter-O-word">blog entry</a> from yesterday, today I'm going to talk about how to install Transfer and what my simple little application is going to look like.
<!--more-->
Installation, like with most frameworks, consists of simply downloading a zip, extracting, and either placing the files under your application or creating a ColdFusion mapping. You can find download links <a href="http://www.transfer-orm.com/?action=transfer.download">here</a>. This is no different than ColdSpring, Model-Glue, etc, but I really like to make use of ColdFusion 8's new ability to define mappings on the fly. So with that in mind, I placed Transfer in web root in a folder named transer1.1.

My application will be placed in a folder named empdirectory. I'm putting this right under web root as well. I'm not going to use Model-Glue or any other framework for this application as I want things to be as simple as possible. Let's first look at my Application.cfc file, specifically the mappings I'll use:

<code>
&lt;cfset this.mappings["/empdir"] = getDirectoryFromPath(getCurrentTemplatePath())&gt;
&lt;cfset this.mappings["/transfer"] = expandPath("../transfer1.1/")&gt;
</code>

The first line defines a mapping named empdir. I'll use this as my root mapping for the application. This isn't something Transfer needs but is a convenience that will help in other places as well. Since Transfer is also directly below web root, I used ../transfer1.1 to point to the folder where I extracted the files. I don't know about you guys, but I freaking love being able to do mappings on the fly!

So now for the most important part. How do we add Transfer to our application? The <a href="http://docs.transfer-orm.com/wiki/Installation_and_Updating.cfm">installation docs</a> tell us we begin by creating an instance of a CFC named TransferFactory. This CFC takes 3 main arguments when initialized. Let me show you how I created it within my application and then I'll describe each argument.

<code>
&lt;cfset application.transferFactory = 
createObject("component", "transfer.TransferFactory").init(
"/empdir/configs/datasource.xml", 
"/empdir/configs/transfer.xml",
"/empdir/configs/definitions")&gt;
</code>

The first argument tells Transfer where it will find datasource information. As you can imagine, since Transfer is abstracting interactions with your database, it needs to know which ColdFusion datasource to communicate with. I created a <a href="http://docs.transfer-orm.com/wiki/Datasource_Configuration_File.cfm">datasource.xml</a> file and placed it within a config folder under my applications folder. My file has the following XML:

<code>
&lt;datasource&gt;
	&lt;name&gt;employeedirectory&lt;/name&gt;
	&lt;username&gt;&lt;/username&gt;
	&lt;password&gt;&lt;/password&gt;
&lt;/datasource&gt;
</code>

<b>Note!</b> You must use the username and password keys even if you don't need them. I supplied this information in the ColdFusion DSN so I didn't need to supply it here. 

The second argument is my <a href="http://docs.transfer-orm.com/wiki/Transfer_Configuration_File.cfm">Transfer Configuration file</a>. This is a critical file. This file defines <i>everything</i> about how Transfer will abstract your database access and covers other items like caching as well. So basically, when I want Transfer to let me work with Employee objects, this is where I'll help define that relationship between the Employee business object and the database columns in the back end. 

I am <b>not</b> going to cover the entire dialect of this XML file tonight! Tonight we will start simple. Here is the XML file as it stands in the first version of the application.

<code>
&lt;transfer&gt;
	
	&lt;objectDefinitions&gt;
		
		&lt;object name="employee" table="employees"&gt;
			&lt;id name="id" type="numeric" /&gt;
			&lt;property name="firstName" type="string" /&gt;
			&lt;property name="lastName" type="string" /&gt;
			&lt;property name="dob" type="date" /&gt;
			&lt;property name="email" type="string" /&gt;
			&lt;property name="phone" type="string" /&gt;
		&lt;/object&gt;

	&lt;/objectDefinitions&gt;

&lt;/transfer&gt;
</code>

As you can probably guess, the objectDefinitions block defines what objects Transfer will recognize within my application. Right now my application has one object - employee. Because my database uses a different name for the table (employees) I have to tell Transfer what the table name is. My employee is made up of a few properties. I used some fairly generic things like first and last name, dob (date of birth), email and phone. I could have more of course, but again, I'm keeping things simple. Note that for each property I tell Transfer what type of property is being modeled. The only unique item here is the id tag. This tells Transfer what the primary key is for my database table. 

So again - I'm not describing nearly every thing you can do in this file, but tonight, I want to keep it simple. (And I'll have complete zips at the end so you can see everything yourself!)

So finally, the last argument you pass to the factory is a folder name. This is a folder that Transfer will use for cached data and other generated files. I pointed to a definitions folder I created under config. 

From this moment on, when it comes to Transfer, the main file I'll work with is the transfer.xml file. As I add new business object, define relationships, etc., I'll be workin gin there. I really have no need to touch datasource.xml file or worry about the definitions folder.

Ok, so now for the last item that may be confusing to folks. We just made an instance of the TransferFactory. But that isn't actually what you will use for most of your work. Instead, you will make use of a Transfer CFC that comes from the factory. In the Transfer docs you may see many examples that look like this:

<code>
&lt;cfset foo = application.transferFactory.getTransfer().new("foo")&gt;
</code>

This can get pretty tiring pretty quickly, so I simply created an application cached version of this component as well. Here is the entire onApplicationStart:

<code>
&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
	&lt;cfset application.transferFactory = 
		createObject("component", 
"transfer.TransferFactory").init(
"/empdir/configs/datasource.xml", 
"/empdir/configs/transfer.xml",
"/empdir/configs/definitions")&gt;

	&lt;cfset application.transfer = application.transferFactory.getTransfer()&gt;
	&lt;cfreturn true&gt;
&lt;/cffunction&gt;
</code>

While the Factory CFC does have functions we will use (and I'll be showing that in a second), it's the Transfer CFC itself that I'll spend most of my time in.

I'm a big fan of taking baby steps, so before I did anything else, I ran my application (using an empty index.cfm file) just to ensure nothing threw an error. Once that worked, I then used this code:

<code>
&lt;cfoutput&gt;&lt;p/&gt;Transfer version: #application.transferFactory.getVersion()#&lt;/cfoutput&gt;
</code>

This returned: Transfer version: 1.1 

Wow, that was a lot of typing and I really haven't accomplished anything yet. But as I said, I like to go slow and ensure that the framework can even <i>load</i> without me screwing it up, and so far, it has. 

Alright - so everyone with me so far? In the next blog entry I'll actually start using the Employee object with a very simple (and awesomely ugly - yes - I make web sites ugly) CRUD.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fempdirectory%{% endraw %}2Ezip'>Download attached file.</a></p>