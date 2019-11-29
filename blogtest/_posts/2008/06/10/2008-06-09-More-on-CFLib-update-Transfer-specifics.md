---
layout: post
title: "More on CFLib update (Transfer specifics)"
date: "2008-06-10T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/10/More-on-CFLib-update-Transfer-specifics
guid: 2871
---

Yesterday in my blog entry on the <a href="http://www.raymondcamden.com/index.cfm/2008/6/9/CFLib-2008">CFLib relaunch</a> I mentioned that I'd talk a bit more about my experience with Transfer. What follows is my experience, and my mistakes, and also what I learned (with a lot of help from Mark Mandel), but please keep in mind that I'm still quite new to this.
<!--more-->
My biggest mistake was in how I organized my Transfer objects. I began by defining a library and udf object.

<code>
&lt;objectDefinitions&gt;

&lt;package name="library"&gt;
	
	&lt;object name="library" table="tblLibraries"&gt;
		&lt;id name="id" type="numeric"/&gt;
		&lt;property name="name" type="string" /&gt;
		&lt;property name="shortdescription" type="string" /&gt;
		&lt;property name="description" type="string" /&gt;
		&lt;property name="lastupdated" type="date" /&gt;
		&lt;property name="owner" type="string" /&gt;
		&lt;property name="owneremail" type="string" /&gt;
		&lt;property name="released" type="string" /&gt;
		&lt;onetomany name="udfs"&gt;
			&lt;link to="udf.udf" column="libraryidfk"/&gt;					
			&lt;collection type="array"&gt;
				&lt;order property="name" order="asc"/&gt;
			&lt;/collection&gt;
		&lt;/onetomany&gt;
	&lt;/object&gt;
	
&lt;/package&gt;

&lt;package name="udf"&gt;
	
	&lt;object name="udf" table="tblUDFs"&gt;
		&lt;id name="id" type="numeric"/&gt;
		&lt;property name="name" type="string" /&gt;
		&lt;property name="shortdescription" type="string" /&gt;
		&lt;property name="description" type="string" /&gt;
		&lt;property name="returnvalue" type="string" /&gt;
		&lt;property name="example" type="string" /&gt;
		&lt;property name="warnings" type="string" /&gt;
		&lt;property name="code" type="string" /&gt;
		&lt;property name="args" type="string" /&gt;
		&lt;property name="released" type="boolean" /&gt;
		&lt;property name="lastupdated" type="date" /&gt;
		&lt;property name="author" type="string" /&gt;
		&lt;property name="authoremail" type="string" /&gt;
		&lt;property name="javadoc" type="string" /&gt;
		&lt;property name="version" type="numeric" /&gt;
		&lt;property name="headercomments" type="string" /&gt;
		&lt;property name="exampleother" type="string" /&gt;
		&lt;property name="rejected" type="boolean" /&gt;
		&lt;property name="rejectionreason" type="string" /&gt;
		&lt;property name="cfversion" type="string" /&gt;
		&lt;property name="tagbased" type="string" /&gt;
		&lt;property name="ratecount" type="numeric" /&gt;
		&lt;property name="ratetotal" type="numeric" /&gt;
	&lt;/object&gt;
	
&lt;/package&gt;

&lt;/objectDefinitions&gt;
</code>

Even if you don't know Transfer, this should make sense. Basically I've created an XML file to reflect my table definitions. But pay special attention to the library block, specifically this area:

<code>
&lt;onetomany name="udfs"&gt;
	&lt;link to="udf.udf" column="libraryidfk"/&gt;					
	&lt;collection type="array"&gt;
		&lt;order property="name" order="asc"/&gt;
	&lt;/collection&gt;
&lt;/onetomany&gt;
</code>

If there is such thing as "hot" xml, this is it. This one block allows me to easily get a Library, and then easily get all the UDFs associated with the library. This works great. Until I tried this with <a href="http://www.cflib.org/library/1">StrLib</a> and it's 319 UDFs. As you can imagine, even with ColdFusion 8 dramatically improving CFC creation, this operation was extremely slow. 

Transfer does let you specify "lazy=true" in the onetomany block. This will only load the related objects when you ask for them, but I needed the UDFs every time the library was viewed. 

Mark made the obvious recommendation - switch to a query. I updated my model to support a new method that would get a set of UDFs based on the library, a starting index, and a max number. This then let me easily handle my pages of UDFs. I felt a bit bad because I thought my model was a bit too closely concerned with the view, but then I had a Coke and got over it. Here is how the controller method looks:

<code>
&lt;cffunction name="getLibrary" output="false"&gt;
	&lt;cfargument name="event" /&gt;
	&lt;cfset var libid = arguments.event.getValue("libraryid")&gt;
	&lt;cfset var library = beans.libraryService.getLibrary(libid)&gt;
	&lt;cfset var perpage = beans.config.getConfigSetting("perpage")&gt;
	&lt;cfset var udfs = ""&gt;
	&lt;cfset var start = arguments.event.getValue("start")&gt;
	
	&lt;cfif not isNumeric(libid) or libid lte 0 or round(libid) neq libid or library.getID() is 0&gt;
		&lt;cfset arguments.event.addResult("BadLibrary")&gt;
	&lt;/cfif&gt;
	
	&lt;cfset arguments.event.setValue("library", library) /&gt;
	
	&lt;cfif not isNumeric(start) or start lte 0 or round(start) neq start&gt;
		&lt;cfset start = 1&gt;
	&lt;/cfif&gt;
	
	&lt;!--- we only load a set of UDFs at a time, based on a page ---&gt;
	&lt;cfset udfs = beans.UDFService.getUDFsForLibrary(libid,start,perpage)&gt;
	&lt;cfset arguments.event.setValue("udfs",udfs)&gt;	
&lt;/cffunction&gt;
</code>

This change created another problem. How do I report the number of UDFs for an individual library. The <a href="http://www.cflib.org">home page</a> for CFLib is using a simple query. But on the individual pages I created a Transfer decorator. Transfer automatically creates bean objects for your data. That rocks. These beans are based on the XML declaration for your data. But sometimes you need to extend the bean a bit. For my library I needed to add a get/setUDFCount. By using a decorator I tell Transfer, "Make your normal bean for this object, but I've extended it a bit in this CFC here..."

I changed my XML for the library object to this:

<code>
&lt;object name="library" table="tblLibraries" decorator="cflib2008.model.library"&gt;
</code>

And then made the CFC:

<code>
&lt;cfcomponent extends="transfer.com.TransferDecorator"&gt;

&lt;cffunction name="setUDFCount" access="public" returnType="void" output="false"&gt;
	&lt;cfargument name="count" type="numeric" required="true"&gt;
	&lt;cfset variables.count = arguments.count&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getUDFCount" access="public" returnType="numeric" output="false"&gt;
	&lt;cfif structKeyExists(variables,"count")&gt;
		&lt;cfreturn variables.count&gt;
	&lt;cfelse&gt;
		&lt;cfreturn 0&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

So nothing too complex here - just a basic get/set. My libraryGateway though handles doing the work for me:

<code>
&lt;cffunction name="getLibrary" access="public" returnType="any" output="false"&gt;
	&lt;cfargument name="id" type="any" required="true"&gt;
	&lt;cfset var library = ""&gt;
	&lt;cfset var count = ""&gt;
	
	&lt;cfif structKeyExists(arguments, "id") and arguments.id neq ""&gt;
		&lt;cfset library = variables.transfer.get("library.library", arguments.id)&gt;
	&lt;cfelse&gt;
		&lt;cfset library = variables.transfer.new("library.library")&gt;
	&lt;/cfif&gt;
	
	&lt;cfquery name="count" datasource="#variables.dsn#"&gt;
	select	count(id) as total
	from	tbludfs
	where	libraryidfk = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#arguments.id#"&gt;
	and		released = 1
	&lt;/cfquery&gt;
	
	&lt;cfset library.setUDFCount(count.total)&gt;
	
	&lt;cfreturn library&gt;
&lt;/cffunction&gt;
</code>

As you can see, up top I handle getting the library. (Again, I love how short and sweet that is.) I then do my custom sql to get the count and set the value in the bean. 

In case folks want to see more of the code, I've zipped up the entire site and have attached it to this blog entry. Please note though that this is the first time I used Transfer from scratch (we use it a lot at <a href="http://www.broadchoice.com">Broadchoice</a>) and the first time I wrote a site in Model-Glue 3. Therefore you should <b>not</b> consider this best practice. (Unless it is - and then I rock.) I didn't include any db scripts either. This is just for folks who want to look at the code behind the site.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcflib2008%{% endraw %}2Ezip'>Download attached file.</a></p>