---
layout: post
title: "Transfer Caching and Performance Features"
date: "2008-12-27T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/27/Transfer-Caching-and-Performance-Features
guid: 3163
---

It's been a while since I blogged about Transfer, but I finally got time to look into caching and performance issues with Transfer. I'm pretty impressed by what I've found. If I had known about some of this back when I was working on <a href="http://www.cflib.org">CFLib 2008</a>, I probably would have done things quite a bit differently. (In fact, I may take a look at re-building things a bit and blogging about the changes.) Here is a quick summary of some of the things you can do to improve performance issues with Transfer.
<!--more-->
First, let me quickly address caching in Transfer. Out of the box, Transfer is pretty smart. Imagine this scenario based on the Employee Directory sample I've used for my other entries. You have some employee that has a benefit. The benefit has an id of 5. If you fetch benefits later and grab the benefit with the primary key of 5, Transfer knows that it loaded it already when it fetched the employee. It will grab the data from it's own cache instead of requerying the database. 

Transfer will, by default, cache within itself. By that I mean it will cache everything within it's own factory object. This is called the "instance" caching. You have multiple other options for how Transfer will store it's cache:

<ul>
<li>instance: Stores the data in the Transfer object. This is the default.
<li>application: Stores data in the application scope. 
<li>session: Stores data in the session scope.
<li>transaction: Stores the data in the session scope, but notices changes made to objects across the board and will clear the object from the cache.
<li>request: Stores data in the request scope.
<li>server: Stores data in the server scope. This is useful for sharing a cache amongst multiple applications. I had a reader ping me about this just this past week.
<li>none: No caching. Were you able to guess that?
</ul>

To configure caching, you edit your transfer.xml and define the cache you want to use. For example:

<code>
&lt;objectCache&gt;
      &lt;defaultcache&gt;
         &lt;scope type="none" /&gt;
      &lt;/defaultcache&gt;
&lt;/objectCache&gt;
</code>

Transfer can get really sexy here though. Along with specifying a default cache for the entire library, you can also specify caches for different classes of data.

<code>
&lt;objectCache&gt;
      &lt;defaultcache&gt;
            &lt;scope type="none" /&gt;
      &lt;/defaultcache&gt;
      &lt;cache class="employee"&gt;
            &lt;scope type="session" /&gt;
      &lt;/cache&gt;
&lt;/objectCache&gt;
</code>

This says: Turn off caching by default, but session objects will be stored in the session scope. Note that mixing caching types for objects that are related (like benefits to mployees) could cause, according to the <a href="http://docs.transfer-orm.com/wiki/Managing_the_Cache.cfm">docs</a>, "indeterminate behaviour". (That sounds like a euphemism for 'your code will take a crap and die.')

Now let's take a look at another feature - lazy loading. If you remember the Employee object used in the earlier blog posts, there were relations defined to benefits, departments, and positions. That means each time you grab an Employee object, Transfer has to load all that related data. That could, over time, slow down Transfer's retrieval of data. Benefits is a perfect example of something that - due it's very nature, is probably something you won't need to display very often. You certainly don't want the whole company to know that Bob is using his hair replacement benefit. It takes all of two seconds to modify the XML and tell Transfer to be lazy with benefits:

<code>
&lt;manytomany name="benefits" table="employees_benefits" lazy="true"&gt;
	&lt;link to="employee" column="employeeidfk"/&gt;
	&lt;link to="benefit" column="benefitidfk"/&gt;
	&lt;collection type="array"&gt;
	&lt;order property="name" order="asc"/&gt;
	&lt;/collection&gt;
&lt;/manytomany&gt;
</code>

Compare the memento dump and how it changes. With lazy not enabled, benefits is returned automatically:

<img src="https://static.raymondcamden.com/images//Picture 217.png">

With lazy=true, the object is now slimmer:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 314.png">

What's awesome though is that as soon as you need the data, Transfer has no trouble getting it. Consider:

<code>
&lt;cfset emp = application.transfer.get("employee", 1)&gt;
&lt;cfdump var="#emp.getMemento()#" label="Employee Memento"&gt;

&lt;cfif structKeyExists(url, "showbenefits")&gt;
	&lt;cfdump var="#emp.getBenefitsArray()#" label="Benefits"&gt;
&lt;/cfif&gt;
&lt;cfabort/&gt;
</code>

Running this template, if I simply add showbenefits=paris to the URL, Transfer will fetch the benefits data. A more real world example would be code that checks the current user's security level. If they were an administrator, it could show the employee's benefits, otherwise the data is hidden. 

Ok, so this works well and is fairly easy to add to an application. There is one small problem though. As soon as you decide to get benefit data, Transfer is going to load <b>all</b> the data. In a scenario with users and orders where one user could have thousands of orders, lazy loading alone wont cut it. (And this is exactly the issue I ran into with CFLib.) For users under ColdFusion 8, Transfer adds a feature called <a href="http://docs.transfer-orm.com/wiki/Using_TransferObject_Proxies.cfm">object proxies</a>. 

What are object proxies? Taking out Employee object, we can turn the positions data into proxies by simply adding proxied=true to the XML:

<code>
&lt;onetomany name="positions" lazy="true" proxied="true"&gt;
	&lt;link to="position" column="employeeidfk" /&gt;
	&lt;collection type="array"&gt;
	&lt;order property="startdate" order="desc" /&gt;
	&lt;/collection&gt;
&lt;/onetomany&gt;
</code>

Now something interesting happens. When we get positions (getPositionsArray) from an Employee object, Transfer returns an array of TransferProxy objects. These objects contain the ID of each position, but nothing else. The object will remain "shallow" until we actually use it. A good example of this is pagination. Imagine getting 2000 Order objects back. We could page through these orders using normal pagination code and only fetching information for objects in the current "slice" of data that we care about. Here is a simpler example. While an employee may have a long history of positions, we will keep things simpler by just displaying his last position. The following code sample shows this in action, along with some debug information about the other positions:

<code>
&lt;cfset emp = application.transfer.get("employee", 1)&gt;
&lt;cfdump var="#emp.getMemento()#" label="Employee Memento"&gt;

&lt;cfset positions = emp.getPositionsArray()&gt;
&lt;cfoutput&gt;Total positions: #arrayLen(positions)#&lt;br/&gt;&lt;/cfoutput&gt;
&lt;cfloop index="x" from="1" to="#arrayLen(positions)#"&gt;
	&lt;cfif x is 1&gt;
		&lt;cfoutput&gt;Current Job: #positions[x].getName()#&lt;br/&gt;&lt;/cfoutput&gt;
	&lt;/cfif&gt;
	&lt;cfoutput&gt;position id = #positions[x].getID()#, isLoaded? #positions[x].getIsLoaded()#&lt;br/&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

Notice that we only run getName() on the first position returned. For every position we show the ID and report if it is loaded. This outputs:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 45.png">

Notice how the first object is reported as loaded while the second is not. Again, this is <b>exactly</b> the problem I ran into at CFLib.