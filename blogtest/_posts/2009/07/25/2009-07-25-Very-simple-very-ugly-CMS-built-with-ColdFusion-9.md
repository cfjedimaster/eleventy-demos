---
layout: post
title: "Very simple, very ugly, CMS built with ColdFusion 9"
date: "2009-07-25T18:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/25/Very-simple-very-ugly-CMS-built-with-ColdFusion-9
guid: 3465
---

Earlier on in the ColdFusion 9 beta, I worked on a simple CMS (Content Management System) that made use of ORM. I've messed with it every now and then over the past few months and spent some time today making it a bit nicer so I could share the code with others. I <i>may</i>, stress <i>may</i> turn this into a real project, but I have no real intention of trying to compete with Mura or Farcry. This was just for fun, and just to get some experience with ORM. Let me also add that as it's been worked on for a few months now, you may see some code that doesn't quite make sense. So for example, earlier on in the ColdFusion 9 alpha, there was no isNull. Today I replaced code like this:

<code>
&lt;cfset section=EntityLoad('section', url.delete, true)&gt;
&lt;cfif isDefined("section")&gt;
</code>

with

<code>
&lt;cfset section=EntityLoad('section', url.delete, true)&gt;
&lt;cfif not isNull(section)&gt;
</code>

You may see stuff like that in the code, so please keep in mind that this isn't "best practice" ColdFusion 9 code. With that out of the way, let me talk a bit about the architecture.
<!--more-->
Simple CMS works with a simple model. The model is so simple I'm going to paste it all here. First is our template object:

<code>
component persistent="true" {

	property name="id" generator="native" sqltype="integer" fieldtype="id";
	property name="name" ormtype="string";
	property name="header" ormtype="text";
	property name="footer" ormtype="text";
	
}
</code>

Templates consist of an ID, a name, and a header and a footer. Next up is the section:

<code>
component persistent="true" {

	property name="id" generator="native" sqltype="integer" fieldtype="id";
	property name="name" ormtype="string";
	property name="sitedefault" ormtype="boolean";
	property name="order" ormtype="integer";
	
}
</code>

Sections consist of a name, a sitedefault property, and an order. The sitedefault property is simply a way to mark a section as the default section of a web site. Like a home page section for example. Order is used for ordering sections for display. More on that later. The last part of our model is the page:

<code>
component persistent="true" {

	property name="id" generator="native" sqltype="integer" fieldtype="id";
	property name="title" ormtype="string";
	property name="body" ormtype="text";
	
	property name="section" fieldType="many-to-one" cfc="section" fkcolumn="sectionidfk";
	property name="template" fieldType="many-to-one" cfc="template" fkcolumn="templateidfk";
	
	property name="isHomePage" datatype="boolean";
	
	public string function renderMe() {
		return template.getHeader() & body & template.getFooter();
	}
		
}
</code>

Finally - a bit of complexity! Pages consist of a title, a body, and a related section and template. Lastly - a isHomePage property works much like the section siteDefault property. It is a way to say "if you request a section without a page, this is the one to load." Oh, and I've got a method to render the page. As you can see, it gets the template and wraps the body. 

So how does the CMS work? There is one more CFC called cms. This component acts as a main controller for all CMS actions. When you come to the application with nothing in the URL (but the path to the application), it tries to find a default section and a page marked as a home page for that section. The application will nicely handle the lack of either of these values by showing a simple message. If you go to the application with a path in the URL: /cmsalpha/products/index.cfm, then it looks for a section named products and a home page object. Lastly, if you go to /cmsalpha/products/foo.cfm, it will look for a page named foo inside the products section. 

The application makes use of onMissingMethod in Application.cfc to handle requests. Unfortunately, this means you can't do: /cmsalpha/products/. You must supply a full path like so: /cmsalpha/products/index.cfm. But that's a small trade off for a simple proof of concept. (You could always use a server side rewriter to handle this too.) Anyway, here is th ecode from Application.cfc:

<code>
public boolean function onMissingTemplate(string pageRequested) {

	try {
		var page = application.cms.getPage(arguments.pageRequested);
	} catch(any e) {
		//If the error code is 1, it's reflects the lack of a default section, which we handle nicely
		if(e.errorCode == 1) location("#application.cms.getCMSURL()#/notready.cfm");
			//not safe to assume .., will fix later
		if(e.errorCode == 2) location("#application.cms.getCMSURL()#/404.cfm?msg=#urlEncodedFormat(e.message)#");
		writeDump(e);
		abort;
	}

	application.cms.renderContent(page);
		
	return true;
}
</code>

Obviously there is an admin as well. The admin let's you edit pages, sections, and templates. What's cool is - if you try to create a page with no templates or sections in the database, it will notice this and stop you. The admin is currently unprotected. I've added it to my list of things to add later on (see final notes). 

There is one really cool part to this (imho). When the application renders a page, it does it via the VFS:

<code>
public string function renderContent(page) {
	var result = arguments.page.renderMe();
	var vfile = hash(arguments.page.getSection().getName() & "/" & arguments.page.getTitle());
	var vpath = expandPath("/vfs") & "/" & vfile;
	fileWrite(vpath,result);
	//before we run, copy some variables over so we can have dynamic templates
	local.title = page.getTitle();
	local.section = page.getSection().getName();
	local.sectionlist = getSectionList();
	local.cmsurl = getCMSURL();
	writeLog(file="cms",text="local.cmsurl=#local.cmsurl#");
	include "/vfs/#vfile#";
}			
</code>

What this means is that you can include code in your templates. For example, my main template footer has:

<code>
&lt;p align="center"&gt;
&lt;cfoutput&gt;Copyright #year(now())#&lt;/cfoutput&gt;
&lt;/p&gt;
</code>

And it works! Also - do you see all those local.* variables? I pass in a bunch of variables into the local scope so that both templates and pages can make use of the variables. So for example, check out the header:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;cfoutput&gt;&lt;title&gt;#local.section# / #local.title#&lt;/title&gt;&lt;/cfoutput&gt;
&lt;/head&gt;

&lt;body bgcolor="green"&gt;

&lt;table width="80%" bgcolor="white"&gt;
&lt;tr&gt;
&lt;td align="center"&gt;
&lt;cfloop index="l" list="#local.sectionlist#"&gt;
&lt;cfoutput&gt;&lt;a href="#local.cmsurl#/#l#/index.cfm"&gt;#l#&lt;/a&gt; &lt;cfif l is not listLast(local.sectionList)&gt;/&lt;/cfif&gt;&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;/td&gt;
&lt;/tr&gt;
&lt;tr&gt;
&lt;td&gt;
&lt;cfoutput&gt;&lt;h1&gt;#local.section# / #local.title#&lt;/h1&gt;&lt;/cfoutput&gt;
</code>

As you can see, I make use of the section name and page title in the title tag. Also note sectionlist. Remember when I said we had an order for sections? This comes into play here as it lets me spit out a simple ordered menu:

<img src="https://static.raymondcamden.com/images/Picture 250.png" />

Of course, letting users write code like that in the admin is something of a security risk. You could use tokens instead ({% raw %}%title%{% endraw %} would be a page title), but it's kinda cool how well it works. 

Anyway, you can download the demo below. You will want to edit these lines in Application.cfc to meet your system requirements:

<code>
this.datasource="cms1";
this.ormsettings = {
	dialect="MySQL",
	dbcreate="update"
};
</code>

You just need to change datasource and dialect. Oh, and I <b>freaking love the fact that I didn't have to make a table once.</b> Oh, and I <b>freaking love that I added 'order' to section in the CFC, reloaded, and bam, the column was added for me.</b> Me love me some ORM. 

p.s. One more thing I'd like to do with this application later on. Hibernate (and CF9's use of it) allows you to run code on various events. In theory, I should be able to write code that says, "If I save a section and mark it as section default, update all other sections and set that value to false." I haven't played with events yet so that will be my next experiment.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcmsalpha%{% endraw %}2Ezip'>Download attached file.</a></p>