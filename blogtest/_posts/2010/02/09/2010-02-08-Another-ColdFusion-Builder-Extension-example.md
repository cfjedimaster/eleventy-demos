---
layout: post
title: "Another ColdFusion Builder Extension example"
date: "2010-02-09T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/09/Another-ColdFusion-Builder-Extension-example
guid: 3713
---

Every day I use ColdFusion Builder I like it a bit more. Last night I built out a new extension. Before I describe how it works, let me demonstrate with a video (and once again I apologize for the size - my 30 inch monitor spoils me):

<p>
<!--more-->
<a href="http://www.raymondcamden.com/demos/fw1.swf"><img src="https://static.raymondcamden.com/images/cfjedi/fw1s.png" title="Go ahead and click, you know you want to..." /></a>

<p>

This extension demonstrates how you can hook into the "New Project" action of CFB. In this case I added support for generating a "skeleton" application for <a href="http://fw1.riaforge.org">Framework One</a>. FW/1 doesn't ship with a skeleton application in the zip. I've logged a request for it - but honestly, with FW/1 having such a small amount of absolutely necessary files, it may not make sense. However - there are some things that I think a <i>typical</i> FW/1 application will need - hence the need for the extension. So what does the code look like? First, here is the XML for my ide_config.xml:

<p>

<code>
&lt;application&gt;
 &lt;name&gt;FW/1 Assistant&lt;/name&gt;
 &lt;author&gt;Raymond Camden&lt;/author&gt;
 &lt;version&gt;0&lt;/version&gt;
 &lt;email&gt;ray@camdenfamily.com&lt;/email&gt;	
 &lt;description&gt;intro.html&lt;/description&gt;  
 &lt;license&gt;license.html&lt;/license&gt;
  
&lt;menucontributions&gt;
	
&lt;/menucontributions&gt;


&lt;events&gt;
	&lt;event type="onprojectcreate" handlerid="projectcreate" /&gt;
&lt;/events&gt;	

&lt;handlers&gt;
	&lt;handler id="projectcreate" type="CFM" filename="projectcreate.cfm" /&gt;
&lt;/handlers&gt;

&lt;/application&gt;
</code>

<p>

As you can see it has one event defined - projectcreate - that then links to my handler. The handler is pretty simple as well:

<p>

<code>
&lt;cfparam name="ideeventinfo"&gt;

&lt;cfset xmldoc = XMLParse(ideeventinfo)&gt;

&lt;cfset project=xmldoc.event.ide.eventinfo.xmlattributes["projectname"]&gt;
&lt;cfset projectloc=xmldoc.event.ide.eventinfo.xmlattributes["projectlocation"]&gt;

&lt;!---
Create the following folders
/controllers
/layouts
/services
/views
/views/main

Create the following files:
/Application.cfc
/index.cfm
/views/main/default.cfm
---&gt;

&lt;cfdirectory action="create" directory="#projectloc#/controllers"&gt;
&lt;cfdirectory action="create" directory="#projectloc#/layouts"&gt;
&lt;cfdirectory action="create" directory="#projectloc#/services"&gt;
&lt;cfdirectory action="create" directory="#projectloc#/views"&gt;
&lt;cfdirectory action="create" directory="#projectloc#/views/main"&gt;

&lt;!--- copy my _App.cfc (named so as to not be a real app.cfc) ---&gt;
&lt;cffile action="copy" source="#expandPath('./files/_App.cfc')#" destination="#projectloc#/Application.cfc"&gt;

&lt;!--- copy my index.cfm ---&gt;
&lt;!--- FYI, yes, index.cfm is blank, so why bother using a file at _all_? Well, if in the future stuff goes in there, this will be a bit more future proof. That's my logic for now. ---&gt;
&lt;cffile action="copy" source="#expandPath('./files/index.cfm')#" destination="#projectloc#/index.cfm"&gt;

&lt;cffile action="copy" source="#expandPath('./files/default.cfm')#" destination="#projectloc#/views/main/default.cfm"&gt;
</code>

<p>

Basically the extension simply makes a few folders and copies three 'template' files over into the new project. 

<p>

I'm not sure if I'll release this as a proper RIAForge project. I'd like to hear what other FW/1 users think and see if they have ideas on how to expand it. (And yes, I'm also supposed to be working on the Model-Glue CFB extension - sorry - I get distracted easily by shiny objects.) I've included a zip to this entry. Enjoy.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ffw1ext%{% endraw %}2Ezip'>Download attached file.</a></p>