---
layout: post
title: "Building CRUD with Transfer"
date: "2008-11-05T13:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/05/Building-CRUD-with-Transfer
guid: 3085
---

I decided to not wait till late night for my next Transfer post and instead write during lunch. Young and the Restless is a good one today so hopefully I won't get distracted!

First off - an important point to make about my last <a href="http://www.raymondcamden.com/index.cfm/2008/11/4/Setting-up-my-Transfer-Application">post</a>. I did <b>not</b> actually walk you through creating a DSN or setting up the database. I did talk about the datasource.xml file, but I didn't actually tell folks to go ahead and make the database. This may have led to bugs when folks tried to run the code. Fred <a href="http://www.coldfusionjedi.com/index.cfm/2008/11/4/Setting-up-my-Transfer-Application#c6D4BB629-19B9-E658-9DDA6F59F701EB51">posted</a> a quick SQL script that would work well and I'll include a script in the this entries zip.
<!--more-->
To be 100% crystal clear: Transfer does <b>not</b> automatically create your tables for you. This is something you will need to do. In my past work with Transfer (for <a href="http://www.broadchoice.com">Broadchoice</a>), I typically began by editing the Transfer.xml file first to define the properties for my object, and then I went to the table. 

One of the real nice things about Hibernate is that it does all of this for you. You can literally drop the entire set of tables and Hibernate will have no problem recreating it for you. Shoot, you can even add a property in your model and Hibernate will handle adding the column.

Transfer doesn't do this - but it certainly does do a lot, so don't take this as "Transfer Sucks!" view. I wouldn't be writing about Transfer if I didn't find it both cool and pretty darn practical. 

So with that said, and with your database setup (again, I've included the SQL file in the zip), you can now begin doing CRUD operations within Transfer. CRUD is a shorthand way of saying Create (make a new thing), Read (get a persisted thing), Update (make changes and persist the thing), and Delete (send the thing to the Forbidden Zone). 

The Transfer component we made yesterday has methods for all of these. Let's start simple and look at how we can make an Employee. The <a href="http://docs.transfer-orm.com/wiki/Persisting_and_Retrieving_Objects.cfm#Transfer.new(class)">new</a> method takes the name of a class (what we defined in Transfer.xml) and creates an object from it. Here is an example:

<code>
&lt;cfset e = application.transfer.new("employee")&gt;
</code>

This creates an object that is a CFML representation of the XML we used to define employees. To prove this, we can output the objects first and last name:

<code>
&lt;cfoutput&gt;#e.getFirstName()# #e.getLastName()#&lt;/cfoutput&gt;
</code>

Of course, since this was a brand new object, there aren't any values for these properties yet. But consider this:

<ul>
<li>No need to write any SQL
<li>No need to worry about the database table. If for some reason a column name changed, we can handle it in the XML
<li>No need to make a 'bean' CFC.
</ul>

Transfer calls these TransferObjects. If you dump it, you will see a whole set of methods. For each property you will see one get and set method. You will also see other methods that Transfer provides as well. Right now the only one I'll specifically point out is getMemento(). This is a method that is useful for debugging. It will return a structure that matches the properties defined in XML. This should <b>not</b> be used for anything real, but is great for debugging. If you dump it, you will see:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 124.png">

The transfer_* properties are obviously specific to Transfer. You can use another debug function, getPropertyMemento(), to return only the properties that relate to your object.

So cool, we got a nice little object. Let's set some data in it, just for the heck of it.

<code>
&lt;cfset e.setFirstName("Victor")&gt;
&lt;cfset e.setLastName("Newman")&gt;
&lt;cfset e.setDOB(createDate(1973,4,8))&gt;
&lt;cfset e.setEmail("vnewman@newmanenterprizes.com")&gt;
&lt;cfset e.setPhone("555-555-5555")&gt;
</code>

Now that we have data in our TransferObject, how can we save it? We use one more method from the Transfer component: <a href="http://docs.transfer-orm.com/wiki/Persisting_and_Retrieving_Objects.cfm#Transfer.save(transferObject{% raw %}%2C_%{% endraw %}5BuseTransaction%5D)">save</a>.

Taking the data from the code above, we can ask Transfer to persist it using this line of code:

<code>
&lt;cfset application.transfer.save(e)&gt;
</code>

Wow, that's pretty difficult. There is also a <a href="http://docs.transfer-orm.com/wiki/Persisting_and_Retrieving_Objects.cfm#Transfer.create(transferObject{% raw %}%2C_%{% endraw %}5BuseTransaction%5D)">create</a> method, but since save can handle both new and old objects, I don't see much point in using it. 

Here is a complete example. I put this in index.cfm, again, thinking baby steps here, and dumped out the memento values both before and after the save.

<code>
&lt;cfset e = application.transfer.new("employee")&gt;
&lt;cfset e.setFirstName("Victor")&gt;
&lt;cfset e.setLastName("Newman")&gt;
&lt;cfset e.setDOB(createDate(1973,4,8))&gt;
&lt;cfset e.setEmail("vnewman@newmanenterprizes.com")&gt;
&lt;cfset e.setPhone("555-555-5555")&gt;
&lt;cfdump var="#e.getMemento()#"&gt;
&lt;cfset application.transfer.save(e)&gt;
&lt;cfdump var="#e.getMemento()#"&gt;
</code>

Notice in this screen shot. Before the save, my TO (TransferObject) had an ID of 0. After the save, it had the ID returned from the database.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 210.png">

Woot! We are halfway through our CRUD. Let's look at read. There are actually multiple ways of getting data via Transfer. You can get lists of objects (as a query) or a single object. This can be done via searches or by getting a particular object by id. For today's blog entry we will focus on simply loading an object based on an ID. As you can probably guess, there is another method in Transfer we will use: <a href="http://docs.transfer-orm.com/wiki/Persisting_and_Retrieving_Objects.cfm#Transfer.get(class%2C_key)">get</a>

The get method takes a class name and a ID value. Here is a simple example. 

<code>
&lt;cfset e2 = application.transfer.get("employee", e.getID())&gt;
&lt;cfdump var="#e2.getMemento()#"&gt;
</code>

Remember that 'e' was my test object. I basically just asked Transfer to get another Transfer object using the same ID from the one I just created. In case your curious, both e2 and e actually point to the same data. If you do e2.setFirstName() and then examine e, you will see the same value.

Alright, the last piece of the puzzle then is deleting. It should come to no surprise that the Transfer component has a <a href="http://docs.transfer-orm.com/wiki/Persisting_and_Retrieving_Objects.cfm#Transfer.delete(transferObject{% raw %}%2C_%{% endraw %}5BuseTransaction%5D)">delete</a> method. Probably the only thing odd (well to me anyway) about delete is that you can't do it by primary key. You have to actually get the object first and then delete it. Here is an example:

<code>
&lt;cfset employee = application.transfer.get("employee", url.delete)&gt;
&lt;cfset application.transfer.delete(employee)&gt;
</code>

So tonight I'll post a followup to this entry showing a simple admin I built using these methods above. To be honest, it's nothing too exciting, but we will get to look at a new method that will be useful for returning all our employees.

(As before, those of you new to Transfer, keep the feedback coming on pacing, or point out anything I was too vague on. Those who know Transfer well, feel free to correct me!)<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fempdirectory1%{% endraw %}2Ezip'>Download attached file.</a></p>