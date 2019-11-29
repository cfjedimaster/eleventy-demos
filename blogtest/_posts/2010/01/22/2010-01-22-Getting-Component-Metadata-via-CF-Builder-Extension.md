---
layout: post
title: "Getting Component Metadata via CF Builder Extension"
date: "2010-01-22T12:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/22/Getting-Component-Metadata-via-CF-Builder-Extension
guid: 3693
---

I'm working on a proof of concept ColdFusion Builder Extension for work and it requires that I examine a CFC. That should be easy enough, right? We have the getComponentMetadata function which returns a nice structure of information about the CFC. However, there is one problem with this function. All CFC functions in ColdFusion require a "dot path". Unless the CFC is in the same folder you need to use a "dot path" location to tell ColdFusion how to load the CFC. Since this CFBuilder extension has to work with any CFC on the file system, it isn't really practical to figure out how to get path to that CFC. What follows is one solution to this issue - I'm not terribly happy with it but it seems to work.
<!--more-->
<p>

To begin my CFBuilder extension, I created my ide_config.xml file. I won't go into full details about each line here - check the <a href="http://help.adobe.com/en_US/ColdFusionBuilder/Using/index.html">CFBuilder</a> docs for a full explanation on how to build extensions.

<p>

<code>
&lt;application&gt; 
    &lt;name&gt;CFC Test&lt;/name&gt; 
    &lt;author&gt;Raymond Camden&lt;/author&gt; 
    &lt;version&gt;1.0&lt;/version&gt; 
    &lt;email&gt;ray@camdenfamily.com&lt;/email&gt; 
    &lt;description&gt;Attempts to get metadata for a CFC.&lt;/description&gt; 
    &lt;license&gt;Just Use It.&lt;/license&gt;
	
	&lt;menucontributions&gt;
		&lt;contribution target="projectview"&gt;
			&lt;menu name="Get CFC Metadata"&gt;
				&lt;filters&gt;
					&lt;filter type="file" pattern=".+\.cfc" /&gt;
				&lt;/filters&gt;
				&lt;action name="Do It" handlerid="getcfcmeta" showResponse="no" /&gt;
			&lt;/menu&gt;
		&lt;/contribution&gt;
	&lt;/menucontributions&gt;

	&lt;handlers&gt;
		&lt;handler id="getcfcmeta" type="cfm" filename="getcfcmeta.cfm" /&gt;
	&lt;/handlers&gt; 
&lt;/application&gt;
</code>

<p>

There are two things I want to point out here. First - notice how I used a pattern on the menu. Thanks to Dan Vega for helping me realize that the value for pattern is a regex. I began with *.cfc which didn't work correctly. Secondly make note of getcfcmeta.cfm. That's the file that will contain the main code to handle my solution. Let's take a look at that next.

<p>

<code>
&lt;cfparam name="ideeventinfo"&gt;
&lt;cfset data = xmlParse(ideeventinfo)&gt;
&lt;cfset myFile = data.event.ide.projectview.resource.xmlAttributes.path&gt;
&lt;cflog file="bolt" text="Working with #myFile#"&gt;

&lt;cfset newName = replace(createUUID(), "-", "_", "all")&gt;
&lt;cfset newLocation = getDirectoryFromPath(getCurrentTemplatePath()) & newName & ".cfc"&gt;

&lt;!--- Copy the file ---&gt;
&lt;cffile action="copy" source="#myFile#" destination="#newLocation#"&gt;

&lt;cfset meta = getComponentMetaData("#newName#")&gt;

&lt;cfdump var="#meta#" output="c:\webroot\test.html" format="html"&gt;

&lt;cffile action="delete" file="#newLocation#"&gt;
&lt;cflog file="bolt" text="I'm done. Stored to #newlocation#"&gt;
</code>

<p>

So we begin by parsing out the XML sent to the extension. This is all documented but while I was developing I made copious use of cflog to look at the XML. Just know that the myFile variable will contian the full path to the CFC that was selected in the Navigator.

<p>

Now it's time for the hack. I decided I'd simply copy the CFC to the same folder as the extension. I used a new name based on UUID. Once copied I was able to use getComponentMetaData. Note that newName is just the UUID, it doesn't include the path or the extension. Once I had it I confirmed it by using cfdump. (Don't forget ColdFusion 8 added the ability to dump to a file. It's useful for situations like this where I'm working with extensions.) Finally I delete the file. 

<p>

That's it. So does it work? Yes and no. It does correctly reflect function metadata which for my case is all I need. However some values, specifically fullname, name, and path, reflect the temporary copy of the CFC. Here is an example:

<p>

<img src="https://static.raymondcamden.com/images/shotcfb.jpg" />

<p>