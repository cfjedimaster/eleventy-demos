---
layout: post
title: "Do you test under cfsetting?"
date: "2009-02-26T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/26/Do-you-test-under-cfsetting
guid: 3253
---

This blog post probably only applies to people building reusable components and UDFs, but I ran into an interesting issue today I thought I'd share with my readers. MrBuzzy (he prefers to go by his nickname) reported an issue with <a href="http://pdfutils.riaforge.org">pdfUtils</a> when used on a site with cfsetting enablecfoutputonly=true turned on. 

This tag is one of the ways in which you can help reduce the amount of whitespace ColdFusion generates. I talk about this in depth here: <a href="http://www.raymondcamden.com/index.cfm/2006/7/26/ColdFusion-Whitespace-Options">ColdFusion Whitespace Options</a>. 

My pdfUtils CFC has a method, getText, that extracts the text from a PDF document. This method uses DDX (XML) to create the instructions necessary to get the text:

<code>
&lt;!--- Create DDX ---&gt;
&lt;cfsavecontent variable="ddx"&gt;
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;DocumentText result="Out1"&gt;
&lt;PDF source="doc1"/&gt;
&lt;/DocumentText&gt;
&lt;/DDX&gt;
&lt;/cfsavecontent&gt;
	
&lt;cfset ddx = trim(ddx)&gt;
</code>

I had output="false" on the CFC method, but that doesn't prevent cfsavecontent from working. It just prevents any output from <i>leaving</i> the method. However, this immediately failed when used in context with cfsetting:

<code>
&lt;cfsetting enablecfoutputonly="true"&gt;
&lt;cfset pdf = createObject("component", "pdfutils")&gt;

&lt;cfset mypdf = expandPath("./testpdf.pdf")&gt;

&lt;cfset results = pdf.getText(mypdf)&gt;
&lt;cfdump var="#results#"&gt;
</code>

Of course, the fix was easy enough, I just wrapped the DDX in cfoutput:

<code>
&lt;!--- Create DDX ---&gt;
&lt;cfsavecontent variable="ddx"&gt;
&lt;cfoutput&gt;		
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;DDX xmlns="http://ns.adobe.com/DDX/1.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://ns.adobe.com/DDX/1.0/ coldfusion_ddx.xsd"&gt;
&lt;DocumentText result="Out1"&gt;
&lt;PDF source="doc1"/&gt;
&lt;/DocumentText&gt;
&lt;/DDX&gt;
&lt;/cfoutput&gt;		
&lt;/cfsavecontent&gt;
</code>

Simple enough of a fix, but I definitely will have to keep this in mind for my other CFCs.