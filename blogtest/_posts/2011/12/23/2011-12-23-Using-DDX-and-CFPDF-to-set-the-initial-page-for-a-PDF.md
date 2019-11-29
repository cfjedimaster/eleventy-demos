---
layout: post
title: "Using DDX and CFPDF to set the initial page for a PDF"
date: "2011-12-23T12:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/12/23/Using-DDX-and-CFPDF-to-set-the-initial-page-for-a-PDF
guid: 4471
---

Earlier this morning a reader asked about how to send a user a PDF that opened at a particular page. Apparently it is possible to <i>link</i> to a PDF and pass a URL parameter for the page you want to open to, but in his case, he was serving up the PDF via cfcontent. I thought it might be possible to do via DDX, and after searching, I found that this use case is actually documented in the ColdFusion docs, but unfortunately, the XML isn't complete and I had to struggle a bit to get it work. Here's how our docs show it:
<!--more-->
<p>

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;PDF result="Out1" initialView="firstView"&gt;
...
&lt;InitialViewProfile name="firstView" show="BookmarksPanel" magnification="FitPage"
openToPage="2"/&gt;
...
&lt;/DDX&gt;
</code>

<p>

Not only is that DDX not complete, it isn't right either. Here's the proper DDX:

<p>

<code>
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;InitialViewProfile name="firstView" openToPage="2"/&gt;
&lt;PDF result="Out1" initialView="firstView"&gt;
	&lt;PDF source="In1" /&gt;
&lt;/PDF&gt;
&lt;/DDX&gt;
</code>

<p>

Note that the InitialViewProfile tag is outside of the PDF tag block. Also note we have to specify an input field. So let's put it together in a full example:

<p>

<code>
&lt;cfset pdfFile = "C:\Users\Raymond\Documents\My Dropbox\Misc Docs\rc120-010d-solr.pdf"&gt;

&lt;cfsavecontent variable="ddxString"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;InitialViewProfile name="firstView" openToPage="2"/&gt;
&lt;PDF result="Out1" initialView="firstView"&gt;
	&lt;PDF source="In1" /&gt;
&lt;/PDF&gt;
&lt;/DDX&gt;
&lt;/cfsavecontent&gt;

&lt;cfset input = {% raw %}{"In1"=pdfFile}{% endraw %}&gt;
&lt;cfset output = {% raw %}{"Out1" = "c:\temp.pdf"}{% endraw %}&gt;
&lt;cfpdf ddxfile="#ddxString#" action="processddx" name="result" 
	   inputfiles="#input#" outputfiles="#output#"&gt;
&lt;cfdump var="#result#"&gt;
</code>

<p>

If you've never seen CFPDF/DDX before, then this may be seem a bit weird, but basically, ColdFusion passes the XML as instructions to an embedded Livecycle Doohicky within ColdFusion. These instructions expect inputs and outputs (exactly what depends on the DDX being run), so we pass in an input struct and output struct. I've got hard coded values here but normally it would be dynamic. 

<p>

And that's it. As I told the person in the other thread, DDX operations are binary and going to be slower than normal. You may want to consider caching this PDF so you can use it next time instead of generating it every time. (In general, <i>any</i> time you do file operations you probably want to store and cache the result. Disk space is cheap. S3 even cheaper.)