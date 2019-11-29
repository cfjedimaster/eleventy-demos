---
layout: post
title: "ColdFusion 101: Config Files A-Go-Go Part 2: XML Files"
date: "2005-09-02T16:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/02/ColdFusion-101-Config-Files-AGoGo-Part-2-XML-Files
guid: 751
---

Welcome to the second in a series concerning configuration files and ColdFusion applications. In the <a href="http://ray.camdenfamily.com/index.cfm/2005/8/26/ColdFusion-101-Config-Files-AGoGo">previous article</a>, I discussed how you could use INI files to supply configuration information for a web application. In this article, I'll talk about how you can use XML files instead. Before we begin, let me state that ColdFusion's XML support is pretty strong, with a good set of <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000372.htm">XML functions</a> available. This post is <i>not</i> intended to teach you about XML. There are whole books on this topic as well as a <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00001505.htm">specific section</a> in the ColdFusion documentation. So, with that in mind, let's take a simple look at how we can use XML to store configuration values.

Let's start by building a simple XML file that mimics the INI  file we had in the previous example. First, here is the INI file:

<div class="code">name=Jacob Camden<br>
age=5<br>
rank=Padawan</div>

Here is how I would write it in XML:

<div class="code">&lt;?xml version=<FONT COLOR=BLUE>"1.0"</FONT>?&gt;<br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;settings&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;name&gt;</FONT>Jacob Camden<FONT COLOR=NAVY>&lt;/name&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=GREEN>&lt;age&gt;</FONT>5<FONT COLOR=GREEN>&lt;/age&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;rank&gt;</FONT>Padawan<FONT COLOR=NAVY>&lt;/rank&gt;</FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/settings&gt;</FONT></FONT></div>

As I said above, I'm not going to make this an introduction to XML. I will assume that the XML above makes sense to you. (One of the strengths of XML is how readable it is, so even if you have never seen XML in your life, I bet you can understand it!) Let's see how we can read this using ColdFusion.

<div class="code"><FONT COLOR=MAROON>&lt;cfxml variable=<FONT COLOR=BLUE>"xml"</FONT>&gt;</FONT><br>
&lt;?xml version=<FONT COLOR=BLUE>"1.0"</FONT>?&gt;<br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;settings&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;name&gt;</FONT>Jacob Camden<FONT COLOR=NAVY>&lt;/name&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=GREEN>&lt;age&gt;</FONT>5<FONT COLOR=GREEN>&lt;/age&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;rank&gt;</FONT>Padawan<FONT COLOR=NAVY>&lt;/rank&gt;</FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/settings&gt;</FONT></FONT><br>
<FONT COLOR=MAROON>&lt;/cfxml&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#xml#"</FONT>&gt;</FONT></div>

The above code does a few neat things. First, we use the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000352.htm">CFXML</a> tag to save a string as an XML object. This is a bit like using CFSAVECONTENT. It takes everything between the beginning and ending CFXML tags and converts it to an XML object. What do we mean by an XML object? ColdFusion allows you to treat XML as type of data structure. This means you can perform certain actions on it - like finding the child tags, counting the children, etcetera. At the same time, you can treat the XML as a simple string. If I add a <cfoutput>#xml#</cfoutput> to the above code, it will display the exact same text that was between the two CFXML tags. (Although you won't see anything. Like HTML, it will be hidden by the browser. Use the htmlEditFormat() or htmlCodeFormat() functions to display the XML in the browser.) 

So - now that we have the XML data, we need to get the settings out of it. ColdFusion allows us to treat the XML data a bit loosely. For example, we can use structKeyExists() on the XML object to see if settings tag lives inside it. 

<div class="code"><FONT COLOR=MAROON>&lt;cfif not structKeyExists(xml,<FONT COLOR=BLUE>"settings"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfthrow message=<FONT COLOR=BLUE>"Invalid settings XML file!"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

Obviously this should never happen on a production server, but you can't be too careful. Now that we are sure we have a settings section, we need to get all the children and copy them into Application variables. Once again we can use structure functions:

<div class="code"><FONT COLOR=MAROON>&lt;cfloop item=<FONT COLOR=BLUE>"key"</FONT> collection=<FONT COLOR=BLUE>"#xml.settings#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset application[key] = xml.settings[key].xmlText&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#application#"</FONT>&gt;</FONT></div>

The variable, xml.settings, is treated like a structure inside the loop. Each item value, which I call key, will refer to an XML node. This node has various keys in it - but the one we are concerned with is "xmlText". This refers to the simple text that exists between each key in the XML packet. This will work fine for our simple settings, which you will see if you run the example code. However, at this point, we really haven't done cool. I mean, sure, we switched to XML, which makes us <b>Buzzword Compliant</b>, but we really haven't gained anything. Let's look at a situation where we can really use the power of XML. 

Imagine your application needs to send email. You need an email address, obviously, but you also need to store information about the mail server. Not only that, you have more than one email address to send out, depending on the form in question. Here is the XML we will use:

<div class="code">&lt;?xml version=<FONT COLOR=BLUE>"1.0"</FONT>?&gt;<br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;settings&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;email&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;emailaddresses&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;jobsform&gt;<A HREF="mailto:hr@foo.com">hr@foo.com</A>&lt;/jobsform&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;contactform&gt;<A HREF="mailto:contact@foo.com">contact@foo.com</A>&lt;/contactform&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;/emailaddresses&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;mailserver&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;server&gt;</FONT></FONT>192.168.1.113<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/server&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;username&gt;</FONT>gbush<FONT COLOR=NAVY>&lt;/username&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;password&gt;</FONT>imdumberthanrock<FONT COLOR=NAVY>&lt;/password&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;/mailserver&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;/email&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;name&gt;</FONT>Jacob Camden<FONT COLOR=NAVY>&lt;/name&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=GREEN>&lt;age&gt;</FONT>5<FONT COLOR=GREEN>&lt;/age&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;rank&gt;</FONT>Padawan<FONT COLOR=NAVY>&lt;/rank&gt;</FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/settings&gt;</FONT></FONT></div>

This is quite a lot more information here now. We have an email section, and under that, an emailaddresses section and a mailserver section. Both of these sections have values under them as well. This could be done in an INI file, but it would have been much more messier. Because I'm using XML, I can nicely organize my settings no matter how complex they get. Now comes the difficult part. How do I translate that XML into a nice set of Application variables? I could write a recursive function to dynamically traverse the XML and load the data. Definitely doable - but maybe a bit of overkill. My application needs to make assumptions. We've already assumed that &lt;settings&gt; will exist. What I'll do next is simply grab my values by hand, and throw an error when one of my required keys doesn't exist.

<div class="code"><FONT COLOR=MAROON>&lt;cfxml variable=<FONT COLOR=BLUE>"xml"</FONT>&gt;</FONT><br>
&lt;?xml version=<FONT COLOR=BLUE>"1.0"</FONT>?&gt;<br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;settings&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;email&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;emailaddresses&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;jobsform&gt;<A HREF="mailto:hr@foo.com">hr@foo.com</A>&lt;/jobsform&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;contactform&gt;<A HREF="mailto:contact@foo.com">contact@foo.com</A>&lt;/contactform&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;/emailaddresses&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;mailserver&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;server&gt;</FONT></FONT>192.168.1.113<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/server&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;username&gt;</FONT>gbush<FONT COLOR=NAVY>&lt;/username&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;password&gt;</FONT>imdumberthanrock<FONT COLOR=NAVY>&lt;/password&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;/mailserver&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;/email&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;name&gt;</FONT>Jacob Camden<FONT COLOR=NAVY>&lt;/name&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=GREEN>&lt;age&gt;</FONT>5<FONT COLOR=GREEN>&lt;/age&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;rank&gt;</FONT>Padawan<FONT COLOR=NAVY>&lt;/rank&gt;</FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/settings&gt;</FONT></FONT><br>
<FONT COLOR=MAROON>&lt;/cfxml&gt;</FONT><br>
<br>
<br>
<FONT COLOR=GRAY><I>&lt;!--- main settings ---&gt;</I></FONT><br>
<FONT COLOR=MAROON>&lt;cfset application.settings = structNew()&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfif not structKeyExists(xml,<FONT COLOR=BLUE>"settings"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfthrow message=<FONT COLOR=BLUE>"Invalid settings XML file!"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfloop item=<FONT COLOR=BLUE>"key"</FONT> collection=<FONT COLOR=BLUE>"#xml.settings#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif len(trim(xml.settings[key].xmlText))&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset application.settings[key] = xml.settings[key].xmlText&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=GRAY><I>&lt;!--- email addresses ---&gt;</I></FONT><br>
<FONT COLOR=MAROON>&lt;cfset application.settings.emailaddresses = structNew()&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfif not structKeyExists(xml.settings,<FONT COLOR=BLUE>"email"</FONT>) or not structKeyExists(xml.settings.email,<FONT COLOR=BLUE>"emailaddresses"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfthrow message=<FONT COLOR=BLUE>"Invalid settings XML file!"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfloop item=<FONT COLOR=BLUE>"key"</FONT> collection=<FONT COLOR=BLUE>"#xml.settings.email.emailaddresses#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif len(trim(xml.settings.email.emailaddresses[key].xmlText))&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset application.settings.emailaddresses[key] = xml.settings.email.emailaddresses[key].xmlText&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=GRAY><I>&lt;!--- mail server ---&gt;</I></FONT><br>
<FONT COLOR=MAROON>&lt;cfset application.settings.mailserver = structNew()&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfif not structKeyExists(xml.settings.email,<FONT COLOR=BLUE>"mailserver"</FONT>)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfthrow message=<FONT COLOR=BLUE>"Invalid settings XML file!"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfloop item=<FONT COLOR=BLUE>"key"</FONT> collection=<FONT COLOR=BLUE>"#xml.settings.email.mailserver#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfif len(trim(xml.settings.email.mailserver[key].xmlText))&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset application.settings.mailserver[key] = xml.settings.email.mailserver[key].xmlText&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfdump var=<FONT COLOR=BLUE>"#application#"</FONT>&gt;</FONT></div>

At this point, our configuration code is getting a bit complex. If you are using ColdFusion MX7, this would be the perfect thing to stuff into a method that is then called by onApplicationStart. The benefit of putting it into another method is that you could also call the method from onRequestStart, perhaps based on the existence of a URL variable (reinit). Plus, if you ever did get around to rewriting the XML parsing, you don't have to change anything outside of the method. You can even go back and forth between INI files and XML files or reading from a database. Abstraction means not having to say your sorry (err, or changing other bits of code).

So - as a homework assignment - write a user-defined function that, given an XML object, will return a CFML structure. Anyone using evaluate() will be flogged with my VB.net book from CFUNITED. I don't have any prizes unfortunately.