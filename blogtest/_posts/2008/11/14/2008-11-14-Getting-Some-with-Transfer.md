---
layout: post
title: "Getting Some with Transfer"
date: "2008-11-14T21:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/14/Getting-Some-with-Transfer
guid: 3103
---

In today's Transfer entry I'm going to talk about getting objects in Transfer. I had previously talked about the get method and how it can load an object via a primary key, but what about other methods of finding objects?
<!--more-->
This blog entry will look at three main ways of getting data. The first will be using the readBy methods. The second method will look at listBy. Lastly, I will talk about TQL and how it can be used for powerful searches.

Our first topic then is the set of readBy methods. This includes:

<ul>
<li>readByProperty: Allows you to specify a property and value to search by.
<li>readByPropertyMap: Allows you to specify a struct of key/values where they key is a property and the value is what you filter by. 
<li>readByQuery: Uses TQL to get an object. I won't discuss this very much now as I'm not covering TQL till the third section of this blog entry.
</ul>

Now the number one thing you need to remember about these functions is that they <b>must return one TransferObject only</b>. So you would not use them to filter by employees who are girls for example. If any of these methods end up with two or more results, you will get an error. In some ways this kind of limits their usefulness. You would need to ensure that you only search on the kinds of things that are guaranteed to return one row. Note - you can do filters that return no rows. If you do, you get a blank TransferObject for the object type you are searching. 

One example that comes to mind is a user system where you've defined usernames as being unique. I've written plenty of applications where I do a "username to id" translator. 

Let's give this a try. Imagine our employee directory also stored their system login username:

<code>
&lt;property name="username" type="string" /&gt;
</code>

I quickly updated the edit form to support this and updated a few of my employees to have usernames. Now let's run a test to get me (I saved this in a new file, test_get.cfm, for those who download the code):

<code>
&lt;cfset ray = application.transfer.readByProperty("employee", "username", "cfjedimaster")&gt;
&lt;cfdump var="#ray.getMemento()#"&gt;
</code>

The API is simple enough. Tell Transfer the class, the property, and the value. readByPropertyMap isn't that much different. Instead of passing one property and value you pass a structure. To be honest, I can't think of a business case for this in my current application. For testing I'm going to just use username and last name. Since username is already unique this will work. But note that I don't think this is a great example:

<code>
&lt;cfset s = {% raw %}{lastname="Camden",username="cfjedimaster"}{% endraw %}&gt;
&lt;cfset ray = application.transfer.readByPropertyMap("employee", s)&gt;
&lt;cfdump var="#ray.getMemento()#"&gt;
</code>

Nothing too complex here. I made a quick struct and passed it to readByPropertyMap. You can have any number of keys and all must match in order for an object to be returned. Before we move on to the listBy methods, don't forget Transfer also has a readByQuery that will perform a TQL based seach. More on that later.

So while the readBy methods were useful for finding one particular object, the listBy methods can return a list of objects (in query form of course). These methods share a similar API with the readBy set:

<ul>
<li>listByProperty: Let's you list all entries that match a property value.
<li>listByPropertyMap: Let's you list all entries that match a set of values defined in a structure.
<li>listByQuery: Again, this is a TQL version that we will look at later.
</ul>

So let's start with a simple example. I'm going to add yet another property to my Employee object:

<code>
&lt;property name="gender" type="string" /&gt;
</code>

I added the column to my database and again edited my form to allow for specifying a gender value of M or F. Now lets grab the boys and girls:

<code>
&lt;cfset girls = application.transfer.listByProperty("employee", "gender", "F")&gt;
&lt;cfdump var="#girls#"&gt;

&lt;cfset boys = application.transfer.listByProperty("employee", "gender", "M")&gt;
&lt;cfdump var="#boys#"&gt;
</code>

You can futher enhance the result by sorting:

<code>
&lt;cfset girls = application.transfer.listByProperty("employee", "gender", "F", "lastname")&gt;
&lt;cfdump var="#girls#"&gt;
</code>

Or...

<code>
&lt;cfset girls = application.transfer.listByProperty("employee", "gender", "F", "lastname","false")&gt;
&lt;cfdump var="#girls#"&gt;
</code>

This will sort by last name, descending. The listByPropertyMap works pretty much the exact same way as readByPropertyMap but with the option to also specify a sort column. 

Alright - so if you played around with the code a bit you may have noticed something. All of these methods expect <b>exact</b> matches. You can't use them to search but rather to perform exact matches on properties. How would you do random, fuzzy (ie, partial matches) in Transfer? TQL (Transfer Query Language) is your solution. Until next time...<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fempdirectory5%{% endraw %}2Ezip'>Download attached file.</a></p>