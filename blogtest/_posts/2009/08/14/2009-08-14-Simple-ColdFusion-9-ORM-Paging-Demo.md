---
layout: post
title: "Simple ColdFusion 9 ORM Paging Demo"
date: "2009-08-14T16:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/14/Simple-ColdFusion-9-ORM-Paging-Demo
guid: 3487
---

I whipped up a quick demo today of how you can do simple paging with ColdFusion 9 ORM code. It isn't incredibly pretty, but hopefully it will be useful for folks to see an example. Let me begin with my model. Yesterday I was doing some speed test on CFC creation time with ORM entities. I made a slightly 'fat' CFC for the model. It isn't really related to this demo itself so I'm going to chop some of the lines out, but when you download the zip, don't be too surprised if it doesn't match exactly with the CFC you see here. Ok, so with that out of the day, here is a simple Person CFC I created for my model.

<code>
component persistent="true" {
	property name="id" generator="native" sqltype="integer" fieldtype="id";
	property name="firstname" ormtype="string";
	property name="lastname" ormtype="string";
	property name="email" ormtype="string";
	property name="salary" ormtype="float";	
}
</code>

People are defined as having an ID, first and lastname, email, and salary. I whipped up a quick demo to insert a few (60,000+) records so I had some data to play with. I opened up my MySQL Query tool and confirmed I had a database full of people. 

Now let's look at the paging code itself. When I write these up I typically begin with some simple parameters to handle the current start row, the sort, sort direction, and page size:

<code>
&lt;cfparam name="url.start" default="1"&gt;
&lt;cfparam name="url.sort" default="lastname"&gt;
&lt;cfparam name="url.sortdir" default="asc"&gt;

&lt;cfset pageSize = 10&gt;
</code>

The sort and pageSize was totally arbitrary. Next up let's actually get our entities. ColdFusion 9's entityLoad function allows you to specify both a starting row and a max number of rows. Note though that entityLoad wants you to specify an offset. In other words - a 0 based index. Given that url.start=1 represents a 1 based index, I used simple subtraction to handle setting the offset:

<code>
&lt;cfset items = entityLoad("person", {% raw %}{},url.sort & " " & url.sortdir, {maxresults=pageSize,offset=url.start-1}{% endraw %})&gt;
</code>

Two things to note here. The second argument, the empty struct, is my filter. As I'm not filtering, I left it blank. Next - the CFML9 reference guide does <b>not</b> refer to the offset and has a type for maxresults. The CFML9 developer guide has the proper values and they are shown above.

The next problem is a bit more tricky. How do we get the <i>total</i> number of records? Without that we won't know how often to present a "Next" link in our pagination. This ended up being pretty obvious - using count. In MySQL I could do a simple select count(id), and the exact same SQL worked fine via HQL as well. HQL is Hibernate Query Language, and is perfect for things like this when there isn't a native function to get what you need:

<code>
&lt;cfset total = ormExecuteQuery("select count(id) from person", true)&gt;
</code>

By the way, the true at the end tells the function to treat the result as a single entity. Normally I'd get an array of values, but when I pass true, then I just get a number. 

And um... that's it. The rest is fairly standard (i.e. boring) HTML. I did do something a bit kind of fun in the header:

<code>
&lt;cfoutput&gt;
&lt;table border="1"&gt;
	&lt;tr&gt;
		&lt;th&gt;
			&lt;cfif url.sort neq "lastname"&gt;
				&lt;a href="list.cfm?start=1&sort=lastname"&gt;Name&lt;/a&gt;
			&lt;cfelse&gt;
				&lt;a href="list.cfm?start=1&sort=lastname&sortdir=#url.sortdir eq 'asc'?'desc':'asc'#"&gt;Name&lt;/a&gt;
			&lt;/cfif&gt;
		&lt;/th&gt;
		&lt;th&gt;
			&lt;cfif url.sort neq "email"&gt;
				&lt;a href="list.cfm?start=1&sort=email"&gt;Email&lt;/a&gt;
			&lt;cfelse&gt;
				&lt;a href="list.cfm?start=1&sort=email&sortdir=#url.sortdir eq 'asc'?'desc':'asc'#"&gt;Email&lt;/a&gt;
			&lt;/cfif&gt;
		&lt;/th&gt;
		&lt;th&gt;
			&lt;cfif url.sort neq "salary"&gt;
				&lt;a href="list.cfm?start=1&sort=salary"&gt;Salary&lt;/a&gt;
			&lt;cfelse&gt;
				&lt;a href="list.cfm?start=1&sort=salary&sortdir=#url.sortdir eq 'asc'?'desc':'asc'#"&gt;Salary&lt;/a&gt;
			&lt;/cfif&gt;
		&lt;/th&gt;
	&lt;/tr&gt;
&lt;/cfoutput&gt;
</code>

Notice the use of a ternary operator to handle "flipping" the sort direction. I used to write a simple UDF for that but ColdFusion 9 lets me do it a bit slicker. 

Now that I've output my header, here is the display of the actual data itself:

<code>
&lt;cfloop index="person" array="#items#"&gt;
	&lt;cfoutput&gt;
		&lt;tr&gt;
			&lt;td&gt;#person.getLastName()#, #person.getFirstName()#&lt;/td&gt;
			&lt;td&gt;#person.getEmail()#&lt;/td&gt;
			&lt;td&gt;#numberFormat(person.getSalary())#&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

I wish that was a bit more complex (joking), but I'll have to live with it as is. The rest of the file is no different than any other pagination code you have seen before. If we are past the first index, show a previous link, and then show a next link if we aren't on the last page:

<code>
&lt;cfoutput&gt;
&lt;cfif url.start gt 1&gt;
	&lt;a href="list.cfm?sort=#url.sort#&sortdir=#url.sortdir#&start=#url.start-pageSize#"&gt;Previous&lt;/a&gt;
&lt;cfelse&gt;
	Previous
&lt;/cfif&gt;
/
&lt;cfif url.start+pagesize lt total&gt;
	&lt;a href="list.cfm?sort=#url.sort#&sortdir=#url.sortdir#&start=#url.start+pageSize#"&gt;Next&lt;/a&gt;
&lt;cfelse&gt;
	Next
&lt;/cfif&gt;
</code>
</cfoutput>

I've attached the code to the zip for folks to play around with. I used a MySQL datasource but - obviously - it should work in any database supported by ColdFusion 9.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Farchive24%{% endraw %}2Ezip'>Download attached file.</a></p>