---
layout: post
title: "Managing Relationships with Transfer (3)"
date: "2008-11-12T21:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/12/Managing-Relationships-with-Transfer-3
guid: 3099
---

Welcome to my third post on managing relationships with Transfer. If you want to get caught up on the earlier ones, or any of the other entries in this series on learning Transfer, please see the Related Blog Entries section below. Previously I talked about ManyToOne relationships (multiple employees were linked to single departments) and ManyToMany relationships (multiple employees linked up with multiple benefits). Today I'll cover the final variety - OneToMany.
<!--more-->
I have to admit that I needed to read the <a href="http://docs.transfer-orm.com/wiki/Managing_Relationships_and_Compositions.cfm#OneToMany">docs</a> on OneToMany a few times before it began to click in mind. The documentation talks about why you would choose a OneToMany or a ManyToOne. I don't think Mark Mandel will send a T800 after me if I quote directly from the docs:

<blockquote>
<p>
So, how does one decide whether to model a one-to-many in a database as a OneToMany or a ManyToOne?
</p>
<p>
First it is important to understand the difference between a OneToMany and ManyToOne in Transfer, quoting from another part of the wiki:
</p>
<p>
OneToMany composition is useful when you wish for TransferObjects on both sides of the relationship to see each other, or for the Parent to have a collection of the child objects attached to it.
</p>
<p>
A ManyToOne collection is useful when, either for application design, or performance reasons, you only want an Objects to load one side of the relationship, and not generate a collection of Objects. 
</p>
</blockquote>

I think the last paragraph is what makes the distinction sink home for me. We never had a business need to go from benefits to employees. We only needed to get benefits for an employee. In a OneToMany, we may need to go both ways. 

So let's start by defining our business need. Employees will have a new type of data associated with them: Position. A position is simple a title (although I called it name), and a start and end date. So if you start at Microsoft as a Temp, that would be your first position (with associated dates). You could then get promoted to Vice President of Temps. This employee object then would have two positions related to him. Transfer will also let us go the other way with this relationship. We can look at a position and get the employee associated with it.

I'll define my Position object like so:

<code>
&lt;object name="position" table="positions"&gt;
	&lt;id name="id" type="numeric" /&gt;
	&lt;property name="name" type="string" /&gt;
	&lt;property name="startdate" type="date" /&gt;
	&lt;property name="enddate" type="date" /&gt;
&lt;/object&gt;
</code>

By now I assume most folks are comfortable with the simple object definitions, so I won't go into it too much. Since positions are tied to employees and won't be edited separately, I did not update the admin with a list and edit set of files.

How do we associate positions with employees? As you can probably guess, we use a onetomany tag:

<code>
&lt;onetomany name="positions"&gt;
	&lt;link to="position" column="employeeidfk" /&gt;
	&lt;collection type="array"&gt;
	&lt;order property="startdate" order="desc" /&gt;
	&lt;/collection&gt;
&lt;/onetomany&gt;
</code>

Much like the manytoone tag I worked with two blog entries ago, I begin by giving it a name. This is how I'll reference the related data in the employee object. The link tag tells Transfer what object type to link to, and here is a point that may confuse you - the column here is the foreign key column in the <i>other</i> table (in our case, the positions table) that links back to the employee records. Again, like manytoone, we tell Transfer how to return the data - either in a struct or an array. I told Transfer to use an array and sort it by the start date, descending. This will give me the employees position with his latest position first.

So before I get into code at all, I opened up my database editor and added a few simple position records. For each one, I used an employeeidfk of 1. I then went back to my test script and wrote code to get and dump the first employee:

<code>
&lt;cfset emp = application.transfer.get("employee", 1)&gt;
&lt;cfdump var="#emp.getMemento()#"&gt;
</code>

This results in:

<img src="https://static.raymondcamden.com/images//Picture 44.png">

Sweet - there are my positions. The more formal way to get the positions would be very similar to ManyToMany method: getXArray, where X is the property.

<code>
&lt;cfset emp = application.transfer.get("employee", 1)&gt;
&lt;cfdump var="#emp.getPositionsArray()#"&gt;
</code>

Alright - so how are we going to work with this data in the admin? I decided on a simple interface. When you edit an employee, you will see a list of his positions. For each we will list the name and the date range. I'll put a checkbox next to each to let you delete the position. Below this list I'll have a place to enter a new position. I could certainly allow for editing as well, but again, I wanted to keep it simple. Before I show the code, here is a quick screen shot:

<img src="https://static.raymondcamden.com/images/cfjedi//editemployee.gif">

Ok, so I began my modifications by getting all the positions for the employee:

<code>
&lt;cfset positions = employee.getPositionsArray()&gt;
</code>

I then created a table within my table for the form (ugly, I know, deal):

<code>
&lt;tr valign="top"&gt;
	&lt;td&gt;Positions:&lt;/td&gt;
	&lt;td&gt;
		&lt;table border="1"&gt;
			&lt;tr&gt;
			&lt;th&gt;Title&lt;/th&gt;
			&lt;th&gt;Dates&lt;/th&gt;
				&lt;th&gt;Delete&lt;/th&gt;
			&lt;/tr&gt;
			&lt;cfloop index="p" array="#positions#"&gt;
			&lt;tr&gt;
			&lt;td&gt;#p.getName()#&lt;/td&gt;
&lt;td&gt;#dateFormat(p.getStartDate())# to #dateFormat(p.getEndDate())#&lt;/td&gt;
			&lt;td&gt;&lt;input type="checkbox" name="delete_position" value="#p.getID()#" /&gt;&lt;/td&gt;
			&lt;/tr&gt;
			&lt;/cfloop&gt;
			&lt;tr&gt;
			&lt;td&gt;&lt;input type="textbox" name="new_position_name" /&gt;&lt;/td&gt;
			&lt;td&gt;&lt;input type="textbox" name="new_position_startdate" /&gt; to &lt;input type="textbox" name="new_position_enddate" /&gt;&lt;/td&gt;
			&lt;td&gt;&nbsp;&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/table&gt;
	&lt;/td&gt;
&lt;/tr&gt;
</code>

So theres a lot of HTML there, but in reality all we are doing is displaying the employee's positions. For each position, I created a checkbox named delete_position. Lastly, I added a row of blank fields for you to enter a new position.

The save side is a bit interesting. Let's look at how it works:

<code>
&lt;!--- handle positions ---&gt;
&lt;!--- first, did we delete any? ---&gt;
&lt;cfif structKeyExists(form, "delete_position") and len(form.delete_position)&gt;
	&lt;cfloop index="p" list="#form.delete_position#"&gt;
		&lt;cfset pos = application.transfer.get("position", p)&gt;
		&lt;cfset application.transfer.delete(pos)&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;
	
&lt;!--- did we add a new one? ---&gt;
&lt;cfif len(form.new_position_name) and len(form.new_position_startdate) 
	and isDate(form.new_position_startdate) and len(form.new_position_enddate)
	and isDate(form.new_position_enddate)&gt;
	
	&lt;cfset position = application.transfer.new("position")&gt;
	&lt;cfset position.setName(form.new_position_name)&gt;
	&lt;cfset position.setStartDate(form.new_position_startdate)&gt;
	&lt;cfset position.setEndDate(form.new_position_enddate)&gt;
	
	&lt;cfset position.setParentEmployee(employee)&gt;
	&lt;cfset application.transfer.save(position)&gt;	
&lt;/cfif&gt;
</code>

Deleting isn't too fancy. I just check to see if any of the checkboxes were selected and if so, I call the delete() method on the objects.

For adding positions, I checked to see if all the values were filled out for the position. If you remember, I said earlier that I wasn't doing a lot of validation. In this case I check for valid values, but don't bother recording any kind of error otherwise. I create a new position TransferObject and set the values. The only new thing here is: setParentEmployee. This links the position to the employee. Once I save the position, the conneciton is done.

Easy, right? One small nit. If you call this code on an employee object that isn't saved, you will get an error. I simply moved this line above it:

<code>
&lt;cfset application.transfer.save(employee)&gt;
</code>

So really, thats all there is too it. There are additional methods you can do with this type of relationship that I didn't need for my application. Let's take a quick look at them:

<ul>
<li>If you want to remove the connection from the child object and not delete it, you can call object.removeParentX, where X is the name of the parent object type. I can't see why you would do this. If you do, you end up with a child that has a null foreign key. But if you want to - you can.
<li>A child object, like a position, can see if it has a parent using ob.getParentX.
<li>A child object can get the parent using ob.getParentX.
<li>A parent can get a child object at a particular position. So given that we sorted our positions by start date descending, you could get the most resent position by doing ob.getPosition(1).
</ul>

As before, I've included the zip along with the database schema. Questions/comments are welcome. The next two posts will talk more about getting data via filtering, search, and finally, TQL. I'm going to try to get these two done before MAX. I have 2-3 more posts planned after that, but it may be delayed a while because of the conference.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fempdirectory4%{% endraw %}2Ezip'>Download attached file.</a></p>