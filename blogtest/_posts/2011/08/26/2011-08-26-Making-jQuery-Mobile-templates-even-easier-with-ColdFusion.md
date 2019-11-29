---
layout: post
title: "Making jQuery Mobile templates even easier - with ColdFusion"
date: "2011-08-26T13:08:00+06:00"
categories: [coldfusion,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/08/26/Making-jQuery-Mobile-templates-even-easier-with-ColdFusion
guid: 4342
---

Earlier today I read an interesting blog entry on <a href="http://metaskills.net/2011/08/24/jquery-mobile-and-rails/">jQuery Mobile and Rails</a>. Now - let me start off with saying I'm not a huge fan of Ruby's syntax. I've got nothing against it and Rails. I did notice though that some of the template examples in the post seemed unnecessarily complex and verbose when it came to HTML. A few folks on Twitter informed me that was more his use of HAML than Ruby. Fair enough. That being said, the author did some very interesting things with his templates and I thought I'd work on a ColdFusion version. Credit for the coolness though goes squarely to the original author, Ken Collins. 
<p/>
<!--more-->
So - creating a ColdFusion custom tag to handle layouts is not something new. You've been able to build custom tag wrappers since version 4, approximately 200 years ago.  But if you look at Ken's code, even if you can't read the Ruby/HAML, you will see two very cool things he is doing with his templates. First - he is simplifying the creation of page IDs. jQuery Mobile requires your pages to use unique IDs. His template makes that automatic. I decided for my code I'd make it automatic, but let you supply one if you wanted. Secondly - jQuery Mobile pages loaded <i>after</i> the initial request do not need to return the entire HTML block. Ie the HTML tag, BODY, etc. His code intelligently checks for Ajax requests and minimizes what is returned when it can. That quick little tweak will add just a bit more speed to your pages and is easy enough to add in our code as well. Here's my first custom tag, page.cfm.

<p/>

<code>
&lt;!--- Courtesy Dan Switzer, II: http://blog.pengoworks.com/index.cfm/2009/4/9/ColdFusion-UDF-for-detecting-jQuery-AJAX-operations ---&gt;
&lt;cffunction name="isAjaxRequest" output="false" returntype="boolean" access="public"&gt; 
    &lt;cfset var headers = getHttpRequestData().headers /&gt; 
    &lt;cfreturn structKeyExists(headers, "X-Requested-With") and (headers["X-Requested-With"] eq "XMLHttpRequest") /&gt; 
&lt;/cffunction&gt;

&lt;cfif thisTag.executionMode is "start"&gt;

	&lt;cfparam name="attributes.title" default=""&gt;
	&lt;cfparam name="attributes.customscript" default=""&gt; 
	&lt;cfif not structKeyExists(attributes, "pageid")&gt;
		&lt;!--- Make a page based on request. ---&gt;
		&lt;cfset attributes.pageid = replace(cgi.script_name, "/","_","all")&gt;
	&lt;/cfif&gt;
	&lt;cfparam name="attributes.theme" default=""&gt; 

	&lt;cfif not isAjaxRequest()&gt;
	&lt;!DOCTYPE html&gt; 
	&lt;html&gt; 
	 
	&lt;head&gt; 
		&lt;meta charset="utf-8"&gt; 
		&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt; 
		&lt;cfoutput&gt;
		&lt;title&gt;#attributes.title#&lt;/title&gt; 
		&lt;link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.css" /&gt; 
		&lt;script src="http://code.jquery.com/jquery-1.6.2.min.js"&gt;&lt;/script&gt; 
		&lt;cfif len(attributes.customscript)&gt;
			&lt;srcript src="#attributes.customscript#"&gt;&lt;/script&gt;
		&lt;/cfif&gt;
		&lt;/cfoutput&gt;
		&lt;script src="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.js"&gt;&lt;/script&gt; 
	&lt;/head&gt; 
	 
	&lt;body&gt; 
	 
	&lt;/cfif&gt;
	
	&lt;cfoutput&gt;&lt;div data-role="page" id="#attributes.pageid#" data-title="#attributes.title#" &lt;cfif len(attributes.theme)&gt;data-theme="#attributes.theme#"&lt;/cfif&gt;&gt;&lt;/cfoutput&gt;

&lt;cfelse&gt;

	&lt;/div&gt;

	&lt;cfif not isAjaxRequest()&gt; 
	&lt;/body&gt; 
	&lt;/html&gt; 
	&lt;/cfif&gt;

&lt;/cfif&gt;
</code>

<p/>

For the most part I'm going to assume this is easy enough to read. If you've never seen a custom tag "wrapper" before, check out this <a href="http://www.raymondcamden.com/index.cfm/2007/9/3/ColdFusion-custom-tag-for-layout-example">blog entry</a> I wrote back in 2007. Basically ColdFusion passes to your custom tag whether or not the execution is at the beginning or end of the tag. Notice the check for the pageid value. If it doesn't exist, we create it based on the request path. Again, this is based on Ken's template. The other interesting part is the isAjaxRequest UDF. It's taken from code Dan Switzer wrote (and something I blogged about in the past as well). If we detect an Ajax request, we will suppress everything but the code div. Finally - I added support for passing in the URL to a custom script and a theme selection as well. Here's an example of how you could call this:

<p/>

<code>
&lt;cf_page title="Home Page"&gt;
&lt;/cf_page&gt;
</code>

<p/>

Or you can use cfimport:

<p/>

<code>
&lt;cfimport prefix="jqm" taglib="jqm"&gt;

&lt;jqm:page title="Home Page"&gt;
	
	
&lt;/jqm:page&gt;
</code>

<p/>

Next up - I decided to quickly add support for 3 main jQuery Mobile UI items - header, footer, and content. This allows me to complete a page like so:

<p/>

<code>
&lt;cfimport prefix="jqm" taglib="jqm"&gt;

&lt;jqm:page title="Home Page"&gt;
	
	&lt;jqm:header&gt;Welcome!&lt;/jqm:header&gt;
	
	&lt;jqm:content&gt;
		This is my main page content. Go to &lt;a href="test2.cfm"&gt;next&lt;/a&gt;.
	&lt;/jqm:content&gt;
	
	&lt;jqm:footer&gt;Copyright &copy; 2014&lt;/jqm:footer&gt;
	
&lt;/jqm:page&gt;
</code>

<p/>

Each of these three new tags are the exact same, so I'll share one of them here (content.cfm):

<p/>

<code>
&lt;cfif thisTag.executionMode is "start"&gt;
	&lt;cfparam name="attributes.theme" default=""&gt; 

	&lt;div data-role="content" &lt;cfif len(attributes.theme)&gt;data-theme="#attributes.theme#"&lt;/cfif&gt;&gt;

&lt;cfelse&gt;

	&lt;/div&gt;
 		
&lt;/cfif&gt;
</code>

<p/>

And here is another example:

<p/>

<code>
&lt;cfimport prefix="jqm" taglib="jqm"&gt;

&lt;jqm:page title="Home Page" id="page2" theme="e"&gt;
	
	&lt;jqm:header&gt;Welcome!&lt;/jqm:header&gt;
	
	&lt;jqm:content&gt;
		This is my second page content. Go to &lt;a href="index.cfm"&gt;home&lt;/a&gt;.
	&lt;/jqm:content&gt;
	
	&lt;jqm:footer theme="b"&gt;Copyright &copy; 2014&lt;/jqm:footer&gt;
	
&lt;/jqm:page&gt;
</code>

<p/>

By the way, I'm not normally a cfimport fan myself. I use it every now and then when the mood hits me. If it scares you, here's the above example with just cf_ syntax.

<p/>

<code>
&lt;cf_page title="Home Page" id="page2" theme="e"&gt;
	
	&lt;cf_header&gt;Welcome!&lt;/cf_header&gt;
	
	&lt;cf_content&gt;
		This is my second page content. Go to &lt;a href="index.cfm"&gt;home&lt;/a&gt;.
	&lt;/cf_content&gt;
	
	&lt;cf_footer theme="b"&gt;Copyright &copy; 2014&lt;/cf_footer&gt;
	
&lt;/cf_page&gt;
</code>

<p/>

I did some quick testing with my Chrome Net panel open, and can confirm that when I requested my second page (and clicked the link back home), the template correctly noted it as an Ajax request and suppressed the unnecessary HTML. If you want to play with these custom tags I've included them as a zip to this blog entry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fjquerymobiletagsexample%{% endraw %}2Ezip'>Download attached file.</a></p>