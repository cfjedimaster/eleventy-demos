---
layout: post
title: "Managing Relationships with Transfer (2)"
date: "2008-11-10T22:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/10/Managing-Relationships-with-Transfer-2
guid: 3094
---

In my <a href="http://www.raymondcamden.com/index.cfm/2008/11/7/Managing-relationships-with-Transfer-or-the-ORM-meets-Dr-Phil">last post</a> on relationships in Transfer, I talked about the ManyToOne relationship. I defined the Department object and associated employees with a department. 

For today's post, I'll be talking about the ManyToMany relationship. This relationship exists when you have multiple connections between two objects. The example the Transfer docs give, and the I think that makes the best sample (especially considering where you are reading this), is the idea of blog entries and categories. A blog entry can have more than one category. On the database side, this is done via a join table with one column pointing to a blog entry and another column pointing to a category.
<!--more-->
For the Employee Directory, I had a hard time thinking of a good way to add an example of a many to many relationship. I then thought of benefits. Typically everyone at a company gets the same set of benefits (dental, vision, medical, etc), but maybe at my fictitious company we let employees decide what benefits they want (perhaps each one takes a different amount of money out of your check). I began by creating a Benefit object:

<code>
&lt;object name="benefit" table="benefits"&gt;
	&lt;id name="id" type="numeric" /&gt;
	&lt;property name="name" type="string" /&gt;
&lt;/object&gt;
</code>

I kept the object rather simple. I could have added a 'deducation' field and a 'requirement' property as well, but since the important thing here is the relationship, I thought I'd keep it simple. I went ahead and added admin files for benefits. Like before though I'm not going to go into that as nothing has changed compared to the department files. (As a quick side note - now that I have multiple files in the Admin, I went ahead and quickly made a simple adminlayout custom tag. I defined the custom tag path in Application.cfc and wrote up a butt-ugly design for the admin. Stand back - I'm designing!)

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 126.png">

When it comes to a ManyToMany relationship, the first choice you have to make is which object will define the relationship. In other words, should I define the relationship in Benefit or Employee? For me, it seems like Employee is the 'primary' or 'most important' object, so I figured that's where I should define the connection. You should note that you will <b>not</b> be able to go in both directions in Transfer. By that I mean, you know I'll be showing you soon how to get related data. Once we do that though we will only be able to get data related to that object, not the other way around. I can see me needing to get benefits for an employee. I can't see me needing to get employees for a benefit.

I added this to my Employee definition:

<code>
&lt;manytomany name="benefits" table="employees_benefits"&gt;
	&lt;link to="employee" column="employeeidfk"/&gt;
	&lt;link to="benefit" column="benefitidfk"/&gt;
	&lt;collection type="array"&gt;
	&lt;order property="name" order="asc"/&gt;
	&lt;/collection&gt;
&lt;/manytomany&gt;
</code>

Let's step through this line by line. We begin with the manytomany tag. I give it a name and a table name. As with other declarations, the table name is optional if it matches the name. 

Next we need to define the links. I have one link that that defines the connection to employee, and another one that links to the benefit. Note how I define both the Transfer name and the particular column.

The collection tag is interesting. As you can imagine, Transfer is going to make it easy to get all the related data. However, Transfer gives us a few options on how the data is returned. We can either get an array or a structure back. I preferred an array, and thats why I used type="array" in the tag. You can also have Transfer sort the result (which only makes in an array if you ask me). 

Ok. So like before, I decided to manually set some data and play with my test file. Transfer provides a set of functions you can use with ManyToMany relationships (see <a href="http://docs.transfer-orm.com/wiki/Managing_Relationships_and_Compositions.cfm#Where_Are_the_relationships%3F">full docs here</a>). We can obviously get the items. We can add a related piece of data. We can remove a related piece of data. We can clear all the related data. Lastly, we can get a related piece of data at a particular index (if it exists). I began with a simple test of getting all the related data.

<code>
&lt;cfset emp = application.transfer.get("employee", 1)&gt;
&lt;cfdump var="#emp.getMemento()#"&gt;
&lt;cfdump var="#emp.getBenefitsArray()#"&gt;
</code>

The getMemento() method is just our debug function, and it correctly gets all the related benefits. The getBenefitsArray is a method automatically created by Transfer. This returns an array of TransferObjects, one for each related piece of data.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 310.png">

Alright - time to get cracking. I jumped back into my Employee edit form and began to add support for assigning benefits. I began by adding a line of code to get all the benefits. I'll use this for my drop down.

<code>
&lt;cfset benefits = application.transfer.list("benefit", "name")&gt;
</code>

Next I needed to create a default value for which benefits are selected. This was a bit more complex than the department example. Check out the code first and then I'll explain it:

<code>
&lt;cfset benes = employee.getBenefitsArray()&gt;
&lt;cfif arrayLen(benes)&gt;
	&lt;cfset oldbenelist = ""&gt;
	&lt;cfloop index="b" array="#benes#"&gt;
		&lt;cfset oldbenelist = listAppend(oldbenelist, b.getID())&gt;
	&lt;/cfloop&gt;
	&lt;cfparam name="form.benefits" default="#oldbenelist#"&gt;
&lt;cfelse&gt;
	&lt;cfparam name="form.benefits" default=""&gt;
&lt;/cfif&gt;
</code>

I began by getting all the related benefits for the employee. If any exist, I loop over each one and get the ID value. After the loop, I use that to param the form value. I could probably write that a bit simpler but it worked for me.

The code for the form is much like the department, except that now we have a multi-select:

<code>
&lt;select name="benefits" multiple="multiple" size="#benefits.recordCount#"&gt;
&lt;cfloop query="benefits"&gt;
	&lt;option value="#id#" &lt;cfif listFind(form.benefits, id)&gt;selected&lt;/cfif&gt;&gt;#name#&lt;/option&gt;
&lt;/cfloop&gt;
&lt;/select&gt;
</code>

So finally, to save this change, I went with a simple nuke and reset policy:

<code>
&lt;!--- nuke old ones ---&gt;
&lt;cfset employee.clearBenefits()&gt;
	
&lt;cfloop index="b" list="#form.benefits#"&gt;
	&lt;cfset benefit = application.transfer.get("benefit", b)&gt;
	&lt;cfset employee.addBenefits(benefit)&gt;
&lt;/cfloop&gt;
</code>

Relatively simple, don't you think? Oh, and get this. If you delete an employee, Transfer will take care of the related data for you. No need to write SQL to delete crap from the join table. 

I went back into my test page and added a nicer formatted version:

<code>
&lt;cfoutput&gt;
#emp.getFirstName()# #emp.getLastName()# has the following benefits:&lt;br/&gt;
&lt;ul&gt;
&lt;cfset benefits = emp.getBenefitsArray()&gt;
&lt;cfloop index="b" array="#benefits#"&gt;
&lt;li&gt;#b.getName()#&lt;/li&gt;
&lt;/cfloop&gt;
&lt;/ul&gt;
&lt;/cfoutput&gt;
</code>

Any questions? In the next post I'll circle back to ManyToOne and talk about that relationship versus OneToMany.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Femployeedirectory%{% endraw %}2Ezip'>Download attached file.</a></p>