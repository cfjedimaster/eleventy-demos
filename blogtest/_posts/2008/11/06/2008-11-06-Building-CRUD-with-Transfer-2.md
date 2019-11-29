---
layout: post
title: "Building CRUD with Transfer (2)"
date: "2008-11-06T20:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/06/Building-CRUD-with-Transfer-2
guid: 3088
---

I'm a bit late in finishing up the next part of my Transfer series (I blame Fable 2 - it kept me up till 2AM!), but if you remember the <a href="http://www.raymondcamden.com/index.cfm/2008/11/5/Building-CRUD-with-Transfer">last entry</a>, I discussed how to create, update (save), delete, and get data using Transfer. I also showed how Transfer creates a CFC based on the XML definition we created for our Employees. This is really everything we need to build a simple employee editor, except for one piece - getting a list of employees.
<!--more-->
I alluded to the fact that Transfer had many ways of getting data. Yesterday's post showed the simple get() method. Today we will look at <a href="http://docs.transfer-orm.com/wiki/Retrieving_Query_Lists.cfm">list() and it's variants</a>.

The list() method takes a class (the name of our data type) and an optional column to sort by. You can also pass a third argument that specifies if the sort should be an ascending sort or a descending sort. This one tends to trip me up. Instead of passing "asc" or "desc",  you pass a true or false. True implies ascending and false means descending. (There is a four argument as well but we won't worry about that now.)

So all in all, to get a list of employees it takes all of one call.

<code>
&lt;cfset employees = application.transfer.list("employee", "lastname")&gt;
</code>

Simple, right? The list method returns a query of employees, not an array of Employee objects. So by now we easily have enough to build a tool to let us administrate employees. For this demo, I decided to put these files within an admin folder, but didn't bother to add any security. <b>In case it isn't obvious, you wouldn't do that in production.</b> I began with employees.cfm:

<code>
&lt;cfif structKeyExists(url, "delete")&gt;
	&lt;cfset employee = application.transfer.get("employee", url.delete)&gt;
	&lt;cfset application.transfer.delete(employee)&gt;
&lt;/cfif&gt;

&lt;cfset employees = application.transfer.list("employee", "lastname")&gt;


&lt;h2&gt;Employees&lt;/h2&gt;

&lt;cfif employees.recordCount&gt;
	&lt;table border="1"&gt;
		&lt;tr&gt;
			&lt;th&gt;Name&lt;/th&gt;
			&lt;th&gt;Email&lt;/th&gt;
			&lt;th&gt;&nbsp;&lt;/th&gt;
		&lt;/tr&gt;
		&lt;cfoutput query="employees"&gt;
		&lt;tr&gt;
			&lt;td&gt;&lt;a href="employee.cfm?id=#id#"&gt;#lastname#, #firstname#&lt;/a&gt;&lt;/td&gt;
			&lt;td&gt;#email#&lt;/td&gt;
			&lt;td&gt;&lt;a href="employees.cfm?delete=#id#"&gt;Delete&lt;/a&gt;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;/cfoutput&gt;
	&lt;/table&gt;
&lt;cfelse&gt;
	&lt;p&gt;
	There are no employees now.
	&lt;/p&gt;
&lt;/cfif&gt;

&lt;p&gt;
&lt;a href="employee.cfm"&gt;Add Employee&lt;/a&gt;
&lt;/p&gt;
</code>

This follows my typical admin pattern of 'Get the crap, make a table, and link to edit or delete.' You can see the list command and the table that outputs each employee. I link to employee.cfm for editing, and back to myself for deleting. If you remember from yesterday, you have to get the TransferObject before you delete via Transfer. 

Now let's look at employee.cfm, the main editor for employees:

<code>
&lt;cfparam name="url.id" default="0"&gt;

&lt;cfif url.id is 0&gt;
	&lt;cfset employee = application.transfer.new("employee")&gt;
&lt;cfelse&gt;
	&lt;cfset employee = application.transfer.get("employee", url.id)&gt;
&lt;/cfif&gt;

&lt;!--- param values ---&gt;
&lt;cfparam name="form.firstname" default="#employee.getFirstName()#"&gt;
&lt;cfparam name="form.lastname" default="#employee.getLastName()#"&gt;
&lt;cfparam name="form.dob" default="#employee.getDOB()#"&gt;
&lt;cfparam name="form.email" default="#employee.getEmail()#"&gt;
&lt;cfparam name="form.phone" default="#employee.getPhone()#"&gt;

&lt;cfif structKeyExists(form, "save")&gt;
	&lt;cfset employee.setFirstName(form.firstname)&gt;
	&lt;cfset employee.setLastName(form.lastname)&gt;
	&lt;cfset employee.setDOB(form.dob)&gt;
	&lt;cfset employee.setEmail(form.email)&gt;
	&lt;cfset employee.setPhone(form.phone)&gt;
	&lt;cfset application.transfer.save(employee)&gt;
	&lt;cflocation url="employees.cfm" addtoken="false"&gt;
&lt;/cfif&gt;

&lt;h2&gt;Edit Employee&lt;/h2&gt;

&lt;cfoutput&gt;
&lt;form action="employee.cfm?id=#url.id#" method="post"&gt;
&lt;table&gt;
	&lt;tr&gt;
		&lt;td&gt;First Name:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="firstname" value="#form.firstname#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;Last Name:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="lastname" value="#form.lastname#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
		&lt;tr&gt;
		&lt;td&gt;Date of Birth:&lt;/td&gt;
		&lt;cfif isDate(form.dob)&gt;
			&lt;cfset v = dateFormat(form.dob)&gt;
		&lt;cfelse&gt;
			&lt;cfset v = ""&gt;
		&lt;/cfif&gt;
		&lt;td&gt;&lt;input type="text" name="dob" value="#v#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
		&lt;tr&gt;
		&lt;td&gt;Email:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="email" value="#form.email#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
		&lt;tr&gt;
		&lt;td&gt;Phone:&lt;/td&gt;
		&lt;td&gt;&lt;input type="text" name="phone" value="#form.phone#"&gt;&lt;/td&gt;
	&lt;/tr&gt;
	&lt;tr&gt;
		&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;td&gt;&lt;input type="submit" name="save" value="Save"&gt;&lt;/td&gt;
	&lt;/tr&gt;
&lt;/table&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;
</code>

When I'm not using a MVC based framework, I typically create self-posting forms like you see here. Starting at the top, we check to see if we are editing a new record or an existing one. Notice one calls new() and one calls get(). After I have the object I param my form fields based on all the properties of the Employee. Notice that I just check for a form submission, but don't bother validating. Thats a whole other topic and not really Transfer specific. The important line is here:

<code>
&lt;cfset application.transfer.save(employee)&gt;
</code>

I know I mentioned this yesterday, but it's rather cool that I don't have to worry about my object being new or old. I just save. Let Transfer worry about it. The rest of the template is a simple form and not terribly interesting. 

All in all, Transfer looks pretty simple so far, wouldn't you agree? I like how I can easily get a query back without having to write the SQL myself and I certainly like the ease of use of the CRUD methods we discussed more in the previous entry. I never have to write one CFC - no beans or gateways. 

Does this mean a Transfer user would never write CFCs? Of course not. I mentioned in the first entry in this series that I was intentionally avoiding Model-Glue for this application so I could keep it as simple as possible. Normally I <i>would</i> have a CFC in my component for Employees, but where I'd have a set of queries I'd simply use Transfer instead. In my last big Model-Glue application, I created a service CFC, a gateway CFC, a DAO CFC, and bean CFC for each type of data in the application. When I updated <a href="http://www.cflib.org">CFLib</a> to use Model-Glue and Transfer, I pretty much ended up with a service CFC in model and that was it. Transfer took care of everything else! One thing that comes to mind about both Model-Glue and Transfer is - I really appreciate how one makes my life simpler by helping me lay out and organize my application structure and another makes my life simpler by abstracting away some of the more generic SQL and CFC operations I typically have to make. Together - both take care of routine things and let me focus more on the application at a high level. 

Alright so where next? It would be nice if all web applications had only one type of data to deal with, but unfortunately that's not the case in the real world. Our Employee Directory won't just be a simple list of names, but a complex set of employees with relations to each other. In the next entry we will start with a new type of data, the department. I will then show how I can tell Transfer that each employee belongs to a department, and how we can make it easy to display an employee's department.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fempdirectory2%{% endraw %}2Ezip'>Download attached file.</a></p>