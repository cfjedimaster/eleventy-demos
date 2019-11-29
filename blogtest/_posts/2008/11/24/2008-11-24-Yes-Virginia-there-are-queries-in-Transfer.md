---
layout: post
title: "Yes, Virginia, there are queries in Transfer"
date: "2008-11-24T23:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/24/Yes-Virginia-there-are-queries-in-Transfer
guid: 3119
---

In all my entries on Transfer so far, we have yet to actually write a line of SQL, and believe me, I don't mind that one bit. But as you can probably imagine, there are definitely cases where you do need to break down and write some actual SQL statements. The biggest example is search. My <a href="http://www.raymondcamden.com/index.cfm/2008/11/14/Getting-Some-with-Transfer">last entry</a> talked about how you can get data based on properties, but it only worked for exact matches, i.e., where name was a specific value. Transfer provides a way around this with the feature I'll cover tonight - Transfer Query Language.
<!--more-->
Transfer Query Language, or TQL, is a SQL-like language that lets you perform fuzzy searches or other types of queries not supported in the other methods. The docs do a really good job of covering this feature (<a href="http://docs.transfer-orm.com/wiki/Transfer_Query_Language.cfm">Transfer Query Language</a>) so I won't cover everything, but simply show you an example or two to give some idea of what is possible.

To perform a query using TQL, you first have to make a query object:

<code>
&lt;cfset q = application.transfer.createQuery("...")&gt;
</code>

The string passed to createQuery will be your TQL statement. TQL statements, in general, will look pretty similar to SQL, except that instead of referring to table names and columns, you use the values you specified in the XML. This means if your DBA picked some silly name like "emps" for employees, you would be able to select from employees if you used that name for your definition. You can also leave off the select statement. Not specifying a select statement will simply result in all the columns being returned. This means the shorted TQL you can use will look something like this:

<code>
from employee
</code>

That by itself will return all employees. Here is a full example:

<code>
&lt;cfset q = application.transfer.createQuery("from employee")&gt;
&lt;cfset results = application.transfer.listByQuery(q)&gt;
</code>

Of course, this isn't very dynamic. Let's modify this to actually filter on a last name. 

<code>
&lt;cfset q = application.transfer.createQuery("from employee where employee.lastname = :name")&gt;
&lt;cfset q.setParam("name", form.search, "string")&gt;	
&lt;cfset results = application.transfer.listByQuery(q)&gt;
</code>

Theres a few things going on here so let's look at it bit by bit. First off, note that I used employee.lastname in my where clause, not just lastname. I'm not sure why, but even if you only use one type of data, you must always specify a full name for the column (type.property, not just property). Next notice that I didn't place my value, form.search, directly in the string. If you want to use a dynamic value in TQL, you must use a reference instead, signified by :XXX, where XXX is a name for the reference. I used :name but :lastname would have worked, as would :nicewatch. You want to pick something that makes sense.

In order to translate that reference into a real value, you use the setParam method on the query object. Notice that I use the reference (name), the real vale, and I provide a type. If you use cfqueryparam (you do, don't you?) then this should seem similar. If you had 2 references, you would use 2 setParams. In order to make things truly dynamic though you would switch to a like:

<code>
&lt;cfset q = application.transfer.createQuery("from employee where employee.lastname like :search order by employee.lastname, employee.firstname")&gt;
&lt;cfset q.setParam("search", '{% raw %}%' & form.search & '%{% endraw %}', "string")&gt;
&lt;cfset results = application.transfer.listByQuery(q)&gt;
</code>

Notice I added % around my value to allow for substring matches on the last name. I also threw in an order by there as well so you can see an example. Remember - I'm always referring to the Transfer types and properties, not real table names and columns. (You can disable this though if you want and refer to real tables and columns.) 

Transfer also makes joins easier. Since your XML already defines how one type is related to another, you can do a join as easy as this:

<code>
from employee join position
</code>

There is no need to define what column to join on since Transfer already knows.

So if all this method based query stuff confuses you - guess what? There is a custom tag version as well (full docs <a href="http://docs.transfer-orm.com/wiki/TQL_Custom_Tags.cfm">here</a>). We can rewrite our earlier query using query and queryparam custom tags provided by Transfer:

<code>
&lt;cf_query transfer="#application.transfer#" name="results2"&gt;
from employee 
where employee.lastname like &lt;cf_queryparam value="{% raw %}%#form.search#%{% endraw %}" type="string"&gt;
order by employee.lastname, employee.firstname
&lt;/cf_query&gt;
</code>

Pretty snazzy? So as I said, the docs on TQL go into greater detail about what is and what isn't support. Also - what if you want to write <i>real</i> SQL? Well obviously nothing stops you from writing your own SQL. If you do - make note that the TransferFactory object has a getDataSource method. This returns a CFC wrapper that lets you get to all the configuration information you defined in your datasource.xml file. You would want to use that instead of hard coding DSN information in the tag.

I've made two updates to the Employee directory. First is to add a simple search method. I didn't bother showing the code here as all it does is use the code mentioned above. You can use it though to see the search in action. I also modified Application.cfc to add Transfer's tag directory to the custom tag path:

<code>
&lt;cfset this.mappings["/transfer"] = getDirectoryFromPath(getCurrentTemplatePath()) & "../transfer1.1/"&gt;
&lt;cfset this.customtagpaths = getDirectoryFromPath(getCurrentTemplatePath()) & "customtags"&gt;
&lt;cfset this.customtagpaths = listAppend(this.customtagpaths, this.mappings["/transfer"] & "/tags")&gt;
</code><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fempdirectory6%{% endraw %}2Ezip'>Download attached file.</a></p>