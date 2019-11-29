---
layout: post
title: "Managing relationships with Transfer (or the ORM meets Dr. Phil)"
date: "2008-11-07T21:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/07/Managing-relationships-with-Transfer-or-the-ORM-meets-Dr-Phil
guid: 3090
---

As I mentioned in <a href="http://www.raymondcamden.com/index.cfm/2008/11/6/Building-CRUD-with-Transfer-2">yesterday's blog post</a>, our simple application with one table isn't terribly realistic. Easy to build - yes. Real world? Not even close. Today we are going to work with some new data in our Transfer sample application, and talk a bit about how Transfer can help manage relationships between types of data.
<!--more-->
First, let's talk at a high level what we are doing. I've decided that my employees need to be organized into departments. Departments could be complex, with a manager, budget, etc, but for this application I've decided to simply use a name value. I created my table (and don't worry, I'll include a backup in today's zip) and then went into transfer.xml to describe the object to Transfer:

<code>
&lt;object name="department" table="departments"&gt;
	&lt;id name="id" type="numeric" /&gt;
	&lt;property name="name" type="string" /&gt;
&lt;/object&gt;
</code>

If you remember from my CRUD posts, I had created two simple files to manage employees, one to list and link to edit/delete actions, and one with a simple form to let you edit the value. The department version of these files are no different except for minor changes. So for example, to get a list of all my departments, I do:

<code>
&lt;cfset depts = application.transfer.list("department", "name")&gt;
</code>

The form is a lot smaller as well. Because these files aren't that interesting, I won't put them on the blog post (but again, they will be in the zip). I quickly created a few departments just to make sure everything was working.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 125.png">

Ok, so the point of this entry was to talk about relationships, so it's about time we got to it. Transfer defines three types of relationships: ManyToOne, OneToMany, and ManyToMany. We want to link an employee to a department, so which do we choose?

Here is where I run into one of my problems with Transfer. When I think of "Link an employee to a department", I naturally want to look for a OneToOne relationship. One employee belongs in one department, right?

However, that's not how Transfer looks at it. Every single time I use Transfer I have to double check this because it just seems... wrong to me, but Transfer looks at it as a ManyToOne. Ie, many employees are in one department. Again, this <b>just does not click</b> for my brain. 

Ok, so how do we define this relationship? First, assume I went ahead and added a column, departmentidfk, to my employees table. (Again, unlike Hibernate, Transfer can't update your database on the fly.) Now I need to describe this to Transfer. Here was my original XML:

<code>
&lt;object name="employee" table="employees"&gt;
	&lt;id name="id" type="numeric" /&gt;
	&lt;property name="firstName" type="string" /&gt;
	&lt;property name="lastName" type="string" /&gt;
	&lt;property name="dob" type="date" /&gt;
	&lt;property name="email" type="string" /&gt;
	&lt;property name="phone" type="string" /&gt;
&lt;/object&gt;
</code>

And here is the modified version:

<code>
&lt;object name="employee" table="employees"&gt;
	&lt;id name="id" type="numeric" /&gt;
	&lt;property name="firstName" type="string" /&gt;
	&lt;property name="lastName" type="string" /&gt;
	&lt;property name="dob" type="date" /&gt;
	&lt;property name="email" type="string" /&gt;
	&lt;property name="phone" type="string" /&gt;
	&lt;manytoone name="department"&gt;
		&lt;link to="department" column="departmentidfk" /&gt;
	&lt;/manytoone&gt;
&lt;/object&gt;
</code>

Note the new element, manytoone. The name attribute simply tells Transfer: "When you relate to the department, lets call it department." The link sub element says, link "to" the department object (defined in the XML above), and the column attribute tells Transfer that the departmentidfk column in the employees table is what will contain the foreign key. There are more arguments you can provide to the manytoone tag, but for now, that's enough.

So what happens next? I manually edited one of my employee records and set departmentidfk to 1, which points to one of my departments. I then went back to my index page (which for now is my test page), and just used this:

<code>
&lt;cfset e2 = application.transfer.get("employee", 1)&gt;
&lt;cfdump var="#e2.getMemento()#"&gt;
</code>

This dump returned: 

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 211.png">

Wow, check it out! The related department was automatically included in the employee TransferObject. As I mentioned before, you don't normally use getMemento(). Instead, we would probably have something like this:

<code>
&lt;cfset emp = application.transfer.get("employee", 1)&gt;
&lt;cfoutput&gt;
The employee #emp.getFirstName()# #emp.getLastName()# works in the
#emp.getDepartment().getName()# department.
&lt;/cfoutput&gt;
</code>

Notice how I use getDepartment(), which also returns a TransferObject, and then immediately call getName(). This outputs:

<blockquote>
<p>
The employee Raymond Camden works in the Weapons Development department.
</p>
</blockquote>

Obviously your sample data may differ. But the real point is - I didn't have to update my SQL with a join or anything at all like that. I simply updated my XML (and my DB of course), and Transfer took care of the rest. I call that slick!

You may ask yourself, "Self, what if I load a record that doesn't have a department?" Good question. When you get a TransferObject, it isn't just a collection of get/set methods. Transfer also loads in other methods you may need as well. One of those is a "has" method for the manytoone relationship. Consider this example:

<code>
&lt;cfset emp = application.transfer.get("employee", 2)&gt;
&lt;cfoutput&gt;Does this emp have a department yet? #emp.hasDepartment()#&lt;/cfoutput&gt;
</code>

This will return NO since I haven't edited my second employee yet. 

Ok, so let's start using the departments in my employee form. If you remember, the form before was a simple collection of text fields, one for each property. Now we are going to add support for selecting a department. Let's take a look at the complete file, and then I'll walk you through what changed.

<code>
&lt;cfparam name="url.id" default="0"&gt;

&lt;cfif url.id is 0&gt;
	&lt;cfset employee = application.transfer.new("employee")&gt;
&lt;cfelse&gt;
	&lt;cfset employee = application.transfer.get("employee", url.id)&gt;
&lt;/cfif&gt;

&lt;cfset depts = application.transfer.list("department", "name")&gt;

&lt;!--- param values ---&gt;
&lt;cfparam name="form.firstname" default="#employee.getFirstName()#"&gt;
&lt;cfparam name="form.lastname" default="#employee.getLastName()#"&gt;
&lt;cfparam name="form.dob" default="#employee.getDOB()#"&gt;
&lt;cfparam name="form.email" default="#employee.getEmail()#"&gt;
&lt;cfparam name="form.phone" default="#employee.getPhone()#"&gt;
&lt;cfif employee.hasDepartment()&gt;
	&lt;cfparam name="form.department" default="#employee.getDepartment().getID()#"&gt;
&lt;cfelse&gt;
	&lt;cfparam name="form.department" default=""&gt;
&lt;/cfif&gt;

&lt;cfif structKeyExists(form, "save")&gt;
	&lt;cfset employee.setFirstName(form.firstname)&gt;
	&lt;cfset employee.setLastName(form.lastname)&gt;
	&lt;cfset employee.setDOB(form.dob)&gt;
	&lt;cfset employee.setEmail(form.email)&gt;
	&lt;cfset employee.setPhone(form.phone)&gt;
	&lt;cfset dept = application.transfer.get("department", form.department)&gt;
	&lt;cfset employee.setDepartment(dept)&gt;
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
		&lt;td&gt;Department:&lt;/td&gt;
		&lt;td&gt;
		&lt;select name="department"&gt;
		&lt;cfloop query="depts"&gt;
			&lt;option value="#id#" &lt;cfif form.department is id&gt;selected&lt;/cfif&gt;&gt;#name#&lt;/option&gt;
		&lt;/cfloop&gt;
		&lt;/select&gt;
		&lt;/td&gt;
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

So from the top, the first thing you will notice is that I get a complete list of departments. I'll need that for my drop down later on. Next go to the cfparams, and look how I use hasDepartment. If the current record has a department object, I can get the ID. If not, I have to use a blank value. 

Now go ahead and skip past the part where we save. The drop down code is probably much like other forms you've done. I loop over the query, look for a match, and set a selected attribute where there is a related value. Nothing too scary there.

But if we go back up to the save operation, pay special attention to how we store the department selection:

<code>
&lt;cfset dept = application.transfer.get("department", form.department)&gt;
&lt;cfset employee.setDepartment(dept)&gt;
</code>	

I actually grab a complete TransferObject for the department, and pass that object to the employee. I didn't use something like setDepartmentIDFK(). I simply used a real object. To me, this feels a lot better than mucking around with SQL. 

So now for one little problem. What if we want to show the department in the employees list? We know it was real easy to display the department for one employee. Unfortunately, when we use the list() method to get a query of data, the related department data isn't returned. Not even the departmentidfk column. There are a few things we can do:

1) Inside our query, we can simply request a TO for each record. For example:

<code>
&lt;cfoutput query="employees"&gt;
&lt;cfset emp = application.transfer.get("employee", id)&gt;
&lt;tr&gt;
	&lt;td&gt;&lt;a href="employee.cfm?id=#id#"&gt;#lastname#, #firstname#&lt;/a&gt;&lt;/td&gt;
	&lt;td&gt;#email#&lt;/td&gt;
	&lt;td&gt;&lt;cfif emp.hasDepartment()&gt;#emp.getDepartment().getName()#&lt;cfelse&gt;&nbsp;&lt;/cfif&gt;&lt;/td&gt;
	&lt;td&gt;&lt;a href="employees.cfm?delete=#id#"&gt;Delete&lt;/a&gt;&lt;/td&gt;
&lt;/tr&gt;
&lt;/cfoutput&gt;
</code>

This may seem a bit inefficient. But consider this. As we know, CFC creation can be a bit slow. The fact that Transfer lets us get a simpler query is a nice thing. If we decide to do pagination of data (ie, get 100 rows but shows rows 1-5), we can get the TOs only for the items we show on the page. 

For today's blog post, this is the solution I used.

2) Another solution is to use TQL. This is something I'll be discussing later on, and to me is the preferred way. TQL, as you will see, is a way to write SQL-like code that interacts with the Transfer object definitions much like SQL interacts with databases. You can use that to do more regular, old school type joins. I can ask for employee.lastname, employee.firstname, and department.name, and join them on the FK. Again though, let's worry about that later. 

Ok, so that's all for tonight. The next entry will go into the other relationship types. I also want to point out a bug I found in my code. This bug may explain issues other people had with my sample code. The bug involved my use of this.mappings for /transfer. When a file under admin was requested, the pathing wasn't resolving right. I changed it to this:

<code>
&lt;cfset this.mappings["/transfer"] = getDirectoryFromPath(getCurrentTemplatePath()) & "../transfer1.1/"&gt;
</code>

This is kinda funny looking, but gives you a path like so:  /Users/ray/Documents/webroot/empdirectory/../transfer1.1. The embedded .. simply crawls back up from the directory containing Application.cfc and then back down into transfer1.1. I probably could have hard coded it and made it simpler, but you get the idea. This is included in the zip of course.

As always, fire away with the questions!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fempdirectory3%{% endraw %}2Ezip'>Download attached file.</a></p>