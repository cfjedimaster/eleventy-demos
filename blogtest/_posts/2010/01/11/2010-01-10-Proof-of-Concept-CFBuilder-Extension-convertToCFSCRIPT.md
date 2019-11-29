---
layout: post
title: "Proof of Concept CFBuilder Extension: convertToCFSCRIPT"
date: "2010-01-11T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/11/Proof-of-Concept-CFBuilder-Extension-convertToCFSCRIPT
guid: 3680
---

I'm working on a project now that involves quite a bit of cut and paste from an old site into a new one. While doing so, I'm also moving some code from tag based CFCs into script based ones. Obviously you can't just paste tag based code into a script based tag. I wondered if it would be possible to build something to help me with some of the grunt work conversion. Specifically, I wanted something that would change:
<p>
<code>
&lt;cfset x = 1&gt;
</code>
<p>
Into:
<p>
<code>
x = 1;
</code>

<p>

Turns out it wasn't difficult at all - once I figured out how to work with CFBuilder's selection/editor support for extensions.
<!--more-->
<p>

First - before going any further, if you haven't read about how to build extensions with CFBuilder, I'd suggest taking a look at the <a href="http://help.adobe.com/en_US/ColdFusionBuilder/Using/WSf01dbd23413dda0ea6b27fe1213a53315f-8000.html">docs</a> first. I'd also check out <a href="http://www.adobe.com/devnet/coldfusion/articles/cfbuilder_extensions.html">Simon Free's article</a> on DevNet. I'm not going to cover the entire process, just the portions that handle working with text selection. 

<p>

So the first thing we need is our ide_config.xml file. I've pasted it below:

<code>
&lt;application&gt;
	&lt;name&gt;convertToCFScript&lt;/name&gt;
	&lt;author&gt;Raymond Camden&lt;/author&gt;
	&lt;version&gt;1&lt;/version&gt;
	&lt;email&gt;ray@camdenfamily.com&lt;/email&gt;     
	&lt;description&gt;intro.html&lt;/description&gt;   
	&lt;license&gt;license.html&lt;/license&gt;

	&lt;menucontributions&gt;
		&lt;contribution target="editor"&gt;
			&lt;menu name="Convert to CFSCRIPT"&gt;
				&lt;action name="Do It" handlerid="convert" showResponse="false"&gt;&lt;/action&gt;
			&lt;/menu&gt;
		&lt;/contribution&gt;
	&lt;/menucontributions&gt;        

	&lt;handlers&gt;              
	&lt;handler id="convert" type="CFM" filename="convert.cfm" /&gt;
	&lt;/handlers&gt;

&lt;/application&gt;
</code>

<p>

My extension will have one menu contribution, and note that it has a target of editor. This tells CFB that my extension works within an opened file, and not the Navigator or RDS section. In this case, I'll have a new menu, Convert to CFScript, with one item, Do It. (FYI, why "Do It"? Currently you can't add an action to the root menu. You can also add a 'folder' with an action underneath it. Obviously thats a bit silly here. I've filed an ER to make this unnecessary.) The action runs my convert handler. Let's look at that now:

<p>

<code>
&lt;cfsetting showdebugoutput="false"&gt;
&lt;cfset ideData=form.ideEventInfo&gt;
&lt;cfset data = xmlParse(ideData)&gt;

&lt;cfset fileName = data.event.ide.editor.file.xmlAttributes.location&gt;
&lt;cfset selectionStartLine = data.event.ide.editor.selection.xmlAttributes.startline&gt;
&lt;cfset selectionStartCol = data.event.ide.editor.selection.xmlAttributes.startcolumn&gt;
&lt;cfset selectionEndLine = data.event.ide.editor.selection.xmlAttributes.endline&gt;
&lt;cfset selectionEndCol = data.event.ide.editor.selection.xmlAttributes.startline&gt;
&lt;cfset selectionText = data.event.ide.editor.selection.text.xmlText&gt;


&lt;!--- handle cfsets ---&gt;
&lt;cfset newText = rereplaceNoCase(selectionText, "&lt;cfset[[:space:]]+(.*?)[[:space:]]*&gt;", "\1;", "all")&gt;

&lt;cfsavecontent variable="test"&gt;
&lt;cfoutput&gt;
&lt;response&gt;
&lt;ide&gt;
&lt;commands&gt;
&lt;command type="inserttext"&gt;
	&lt;params&gt;
		&lt;param key="text"&gt;&lt;![CDATA[#newText#]]&gt;&lt;/param&gt;
	&lt;/params&gt;
&lt;/command&gt;
&lt;/commands&gt;
&lt;/ide&gt;
&lt;/response&gt;
&lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;

&lt;cfheader name="Content-Type" value="text/xml"&gt;&lt;cfoutput&gt;#test#&lt;/cfoutput&gt;
</code>

<p>

So first off - when I began development on this little utility, I wasn't sure what the editor was going to send me. I did a bunch of cflogging and after looking at the XML, I saw that I was given:

<ul>
<li>The filename (this includes the full path).
<li>The starting line and column of the selection. I've filed an ER to also include the starting numeric character position.
<li>The ending line and column of the selection.
<li>The actual selected text.
</ul>

I didn't actually need all of these values, but I've kept them in the code for purely educational purposes. 

<p>

The actual meat of my logic is one regex. As you can see, I look for cfsets and simply replace them with a script equivalent. If I decide to keep working on this extension, I could look at supporting loops and other items, but for now I wanted to keep things simple. I'll also recommend doing what I did - testing my regex in another file. That kept CFBuilder out of the picture and let me fine tune my regex until it works like I wanted.

<p>

Finally - we need to tell the editor to replace the selection with my new text. I was stuck here for a while until I got help from Evelin Varghese of Adobe. Turns out there is a bug in the documentation. The docs say to use <command name="inserttext"> but what you really want is <command <b>type</b>="inserttext">. Once I got the XML set right, everything worked perfectly. Here is a small video example:

<p>

<script>
AC_FL_RunContent("movie","http://www.raymondcamden.com/images/converttoscript","width","455","height","654","align","center","wmode","transparent");
</script><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FconvertToCFScript%{% endraw %}2Ezip'>Download attached file.</a></p>