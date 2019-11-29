---
layout: post
title: "Decorating Eye for the Transfer Guy"
date: "2008-11-25T22:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/25/Decorating-Eye-for-the-Transfer-Guy
guid: 3121
---

Today I get to talk about my favorite Transfer topic (although events may supplant it) - Decorators. No, I'm not talking about the people who come in and hang wallpaper or rearrange your furniture. Rather, decorators in Transfer allow you to extend and build upon the TransferObjects automatically created for you when you get data via Transfer.
<!--more-->
If you remember, every time you get a Transfer object, like so:

<code>
&lt;cfset emp = application.transfer.get("employee", 1)&gt;
</code>

Transfer creates a CFC based on the XML definition of the employee type. There are times though when you may want to add a bit of business logic to this CFC. As a simple example, consider the act of getting a name from our employee. We have a first name and a last name, but what if we wanted a simple way to just get a name, perhaps based on: "Lastname, First". 

In order to do this we create a decorator. Begin by modifying the XML to tell Transfer where the decorator will exist:

<code>
&lt;object name="employee" table="employees" decorator="empdir.model.employee"&gt;
</code>

Remember empdir was defined in Application.cfc as a root level mapping for my sample application. I created a new folder named model and dropped a CFC in there named employee. At the simplest level, a decorator CFC can look like this:

<code>
&lt;cfcomponent extends="transfer.com.TransferDecorator" output="false"&gt;
&lt;/cfcomponent&gt;
</code>

Note that I extend transfer.com.TransferDecorator. This is the only requirement. Now if we want to add getName to our decorator, we can do:

<code>
&lt;cffunction name="getName" access="public" returntype="string" output="false"&gt;
	&lt;cfreturn getLastName() &  ", " & getFirstName()&gt;
&lt;/cffunction&gt;
</code>

Pretty simple, right? Here is a slightly more advanced example. Converting the DOB into an age value:

<code>
&lt;cffunction name="getAge" access="public" returntype="numeric" output="false"&gt;
	&lt;cfreturn dateDiff("yyyy", getDOB(), now())&gt;
&lt;/cffunction&gt;
</code>

Using it is just as simple as calling any of the 'normal' methods built into the TransferObject:

<code>
&lt;cfset emp = application.transfer.get("employee", 1)&gt;

&lt;cfoutput&gt;#emp.getName()# is #emp.getAge()# years old.&lt;br/&gt;&lt;/cfoutput&gt;
</code>

This returns:

<blockquote>
<p>
Camden, Raymond is 35 years old.
</p>
</blockquote>

Along with overwriting get methods, you can overwrite set methods as well. In order to actually store the value you are overriding, you need to call getTransferObject() first. Here is a good example I'll steal from the <a href="http://docs.transfer-orm.com/wiki/Writing_Decorators.cfm">docs</a>:

<code>
&lt;cffunction name="setHomePageURL" access="public" returntype="void" output="false"&gt;
	&lt;cfargument name="url" type="string" required="Yes"&gt;
	&lt;cfif not findNoCase("http://", arguments.url)&gt;
		&lt;cfset arguments.url = "http://" & arguments.url&gt;
	&lt;/cfif&gt;
	&lt;cfset getTransferObject().setHomePageURL(arguments.url)&gt;
&lt;/cffunction&gt;
</code>

The setHomePageURL method defined here looks for a missing http://. If it doesn't exist in the passed in value then it will be added to the value. Notice then the last call uses getTransferObject() to "hook" into the real TO and call the real setHomePageURL.

For my employee decorator I decided to try something interesting. I want usernames to be unique. So why not do a security check when a username is set? I will follow these rules:

If no other employee has the same username, we are good.<br/>
If another employee has the same username, and isn't me, then we have an error.

Let's look at how I built this.

<code>
&lt;cffunction name="setUsername" access="public" returntype="void" output="false"&gt;
	&lt;cfargument name="username" type="string" required="true"&gt;
	
	&lt;!--- see if another user with this name exists... ---&gt;
	&lt;cfset var t = getTransfer()&gt;
	&lt;cfset var olduser = t.readByProperty("employee", "username", arguments.username)&gt;
	
	&lt;!--- if it doesn't exist, we are good ---&gt;
	&lt;cfif not olduser.getIsPersisted()&gt;
		&lt;cfset getTransferObject().setUsername(arguments.username)&gt;
	&lt;!--- if it did exist, but was me, then its ok too ---&gt;
	&lt;cfelseif olduser.sameTransfer(getTransferObject())&gt;
		&lt;cfset getTransferObject().setUsername(arguments.username)&gt;
	&lt;!--- ok, throw an error! ---&gt;
	&lt;cfelse&gt;
		&lt;cfthrow message="An employee with this username already exists."&gt;
	&lt;/cfif&gt;
	
&lt;/cffunction&gt;
</code>

There is a lot going on here, so I'll tackle it line by line. I begin by calling getTransfer(). This method exists in decorators and gives me access to the main Transfer factory. I then do a read check using readByProperty. Remember that if readByProperty will return a virgin object if it doesn't exist. One of the special methods we can then use is getIsPersisted(). If this is false, it means olduser didn't actually exist, so we didn't find a match.

If it did exist, we can use another built in method, sameTransfer(), that compares two TransferObjects to see if they match. 

If the above two checks fail, we throw an error. This was just a quick example and probably does <b>not</b> represent the best way to do validation in Transfer. 

A cool example that my coworker <a href="http://www.corfield.org">Sean</a> came up was this:

<code>
&lt;cffunction name="delete" returntype="void" access="public" output="false"&gt;
		&lt;cfset getTransfer().delete(this) /&gt;	
&lt;/cffunction&gt;

&lt;cffunction name="save" access="public" returntype="void" output="false"&gt;
	&lt;cfreturn getTransfer().save(getTransferObject())&gt;
&lt;/cffunction&gt;
</code>

What does this do? Well remember how we use the Transfer Factory to save and delete objects? Well with these two methods in our decorator we can now do:

<code>
&lt;cfset thirdemp = application.transfer.get("employee", 15)&gt;
&lt;cfset thirdemp.setLastName("Random#randRange(1,1000)#")&gt;
&lt;cfset thirdemp.save()&gt;
</code>

This "feels" really natural to me. Sean actually built this into a separate CFC called a BaseDecorator that the other decorator's extended. 

One more cool thing decorators can do - configuring. If you want to run custom code when Transfer creates an instance of as TransferObject, you can simply add a configure method to the decorator. For example:

<code>
&lt;cffunction name="configure" access="private" returntype="void" output="false"&gt;
	&lt;cfset setLastName("anon")&gt;
	&lt;cfset setFirstName("anon")&gt;
&lt;/cffunction&gt;
</code>

This will set the name of a new employee to anon, anon. Not terribly exciting but rather simple to use. 

I'll leave you with another link from the main docs: <a href="http://docs.transfer-orm.com/wiki/How_to_Encrypt_User_Passwords_Using_a_Decorator.cfm">How to Encrypt User Passwords Using a Decorator</a>. This is a good example of using decorators and handling encryption. 

I've updated the download zip to include the new code. As always, comments are welcome!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fempdirectory%{% endraw %}2D2%2Ezip'>Download attached file.</a></p>