---
layout: post
title: "Proof of Concept - Remembering preferences in ColdFusion Builder Extensions"
date: "2010-07-06T10:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/07/06/Proof-of-Concept-Remembering-preferences-in-ColdFusion-Builder-Extensions
guid: 3869
---

This weekend I worked on a little proof of concept concerning persistence and ColdFusion Builder Extensions. Persistence in ColdFusion applications normally involves either cookies, client variables, session variables, or databases. I was curious to see how I could achieve something similar for a CFB extension. My use case for this was preferences. So you could imagine a complex extension perhaps remember what your last choices were. This could make using the extension quicker if you don't have to configure your settings on ever use. 
<p>
<!--more-->
I knew that cookies did not work at all. You can't use client variables without cookies as there is no way to match up the old data with your new request. Session variables can be made to work - but again - I wanted something that would persist. So what about databases? We could make use of Derby if we prompted the extension user for his CF Admin password. That would work - but felt like overkill. Instead, I decided on a simpler idea - using a file. 
<p>
I decided that a simple file, storing XML, would probably be best. It wouldn't be great for storing a <i>lot</i> of data, but again, we're just talking preferences here. I began by creating a generic component for any CFB extension. I've been meaning to do this for some time now and I finally got around to it. My CFC is named extensionUtility and will be stored in an org/camden/util folder. I've included the complete code below. Note too that I've got a few methods related to finding the current URL. This is useful for building links in forms, JS files, etc. 
<p>
<code>
component {

	public string function getCurrentDir() {
		var theURL = getCurrentURL();
		theURL = listDeleteAt(theURL, listLen(theURL, "/"), "/");
		return theURL;
	}
	
	public string function getCurrentURL() {
		var theURL = getPageContext().getRequest().GetRequestUrl().toString();
		if(len( CGI.query_string )) theURL = theURL & "?" & CGI.query_string;
		return theURL;
	}
	
	public struct function getSettings(string file="extsettings") {
		var realFile = expandPath("./" & arguments.file & ".xml");
		if(!fileExists(realFile)) return {};
		var settings = {};
		var contents = fileRead(realFile);
		if(!isXML(contents)) return {};
		var settingsXML = xmlParse(contents);
		for(var key in settingsXML.settings) {
			settings[key] = settingsXML.settings[key].xmlText;
		}
		return settings;
	}
	
	public void function setSetting(string name, string value, string file="extsettings") {
		var realFile = expandPath("./" & arguments.file & ".xml");
		var settings = getSettings(arguments.file);
		settings[arguments.name] = arguments.value;
		var contents = "&lt;settings&gt;";
		for(var key in settings) {
			contents &= "&lt;#key#&gt;#xmlFormat(settings[key])#&lt;/#key#&gt;";
		}
		contents &= "&lt;/settings&gt;";
		fileWrite(realFile, contents);
	}
	
}
</code>
<p>

So the two methods I want to focus in on are getSettings and setSetting. getSetting takes an optional argument that allows you to override the name of a file containing your XML. In most cases you shouldn't need to worry about this. It simply reads in the XML and assumes a flat structure within a settings key. Each node should be a name and the value should be simple text. So for example:

<p>

<code>
&lt;settings&gt;&lt;height&gt;99&lt;/height&gt;&lt;color&gt;pink&lt;/color&gt;&lt;width&gt;249&lt;/width&gt;&lt;/settings&gt;
</code>

<p>

The flip side of getting the settings is to set them. In this case, I'm only allowing you to set one setting at a time, and each time you do we recreate the file. If this were a multi-user application, I'd be concerned with locking and performance. I'd definitely create a way to set multiple values at once. But for our extension, it is essentially single threaded and single user. This makes things much simpler.

<p>

So given our utility functions, how do we make use of them? Remember that we can use session variables, but they are a bit of a pain to use. We can make use of the application scope of course, and I do that to load the library in:

<p>

<code>
&lt;cfcomponent&gt;
	&lt;cfsetting showdebugoutput="false"&gt;

	&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
		&lt;cfset application.extensionUtility = createObject("component", "org.camden.util.extensionUtility")&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
		&lt;cfargument name="req" type="string" required="true"&gt;
		&lt;cfif 1&gt;
			&lt;cfset onApplicationStart()&gt;
		&lt;/cfif&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

<p>

Just to be clear, the code within onRequestStart <b>is only for debugging</b>. There is no need to rerun onApplicationStart on every request. I normally do stuff like this with a "URL hook", but since you can't do that with an extension (well, you could if you requested the extension in your browser), I use a simple "if 1" clause while I test.

<p>

For the next step, I need a way to read in my settings and use them. Unlike a traditional web application, extensions give you a defined way to "enter" the application. What I mean is - I know what the first URL request will always be. In my simple extension, I've got a right click menu added for the editor and it always runs one handler, tester.cfm. Here is how I made use of my settings:

<p>

<code>

&lt;!--- get my setings ---&gt;
&lt;cfset settings = application.extensionUtility.getSettings()&gt;

&lt;cfif structKeyExists(settings, "width")&gt;
	&lt;cfset width = settings.width&gt;
&lt;cfelse&gt;
	&lt;cfset width = 250&gt;
&lt;/cfif&gt;
&lt;cfif structKeyExists(settings, "height")&gt;
	&lt;cfset height = settings.height&gt;
&lt;cfelse&gt;
	&lt;cfset height = 100&gt;
&lt;/cfif&gt;
&lt;cfif structKeyExists(settings, "color")&gt;
	&lt;cfset color = settings.color&gt;
&lt;cfelse&gt;
	&lt;cfset color = "red"&gt;
&lt;/cfif&gt;

&lt;cfheader name="Content-Type" value="text/xml"&gt;
&lt;cfoutput&gt;
&lt;response showresponse="true"&gt;
&lt;ide&gt;
&lt;dialog width="400" height="400" title="Make a Box" /&gt;
&lt;body&gt;
&lt;![CDATA[

&lt;h2&gt;Make a Box&lt;/h2&gt;
&lt;form action="#application.extensionUtility.getCurrentDir()#/test_response.cfm" method="post"&gt;
Width: &lt;input type="text" name="width" value="#width#"&gt;&lt;br/&gt;
Height: &lt;input type="text" name="height" value="#height#"&gt;&lt;br/&gt;
Color: &lt;input type="text" name="color" value="#color#"&gt;&lt;br/&gt;
&lt;input type="submit" value="Do It!"&gt;
&lt;/form&gt;
]]&gt;
&lt;/body&gt;
&lt;/ide&gt;
&lt;/response&gt;&lt;/cfoutput&gt;
</code>

<p>

As you can see, I fetch the settings and see if I have values for width, height, and color. I build up a simple form with these values and post them to the next page. Now let's look at that.

<p>

<code>


&lt;!--- basic validation, could be better ---&gt;
&lt;cfparam name="form.width" default="0"&gt;
&lt;cfparam name="form.height" default="0"&gt;
&lt;cfparam name="form.color" default="red"&gt;

&lt;cfset box = imageNew("", form.width, form.height, "rgb", form.color)&gt;
&lt;cfimage action="writeToBrowser" source="#box#"&gt;

&lt;!--- Store these values ---&gt;
&lt;cfset application.extensionUtility.setSetting("width", form.width)&gt;
&lt;cfset application.extensionUtility.setSetting("height", form.height)&gt;
&lt;cfset application.extensionUtility.setSetting("color", form.color)&gt;
</code>

<p>

As you can see, this extension draws boxes (we aren't talking rocket science here!) but at the very end, we use our API to store our settings back. Pretty simple, right? Here is a quick video showing this in action. Notice the first time through my extension will use default settings. The next time though it will have remembered what I did before.

<p>

<a href="http://www.raymondcamden.com/images/cfbjul6.swf">
<img src="https://static.raymondcamden.com/images/cfjedi/cfbjul6.png" border="0" title="Click for ginormous video" /></a>

<p>

I've attached the entire extension to this blog entry - but obviously the utility CFC is the only thing worthwhile (unless you have some big need to create colored squares!). Obviously this could be tweaked a bit more. Any comments or feedback would be greatly appreciated.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ftestextension%{% endraw %}2Ezip'>Download attached file.</a></p>