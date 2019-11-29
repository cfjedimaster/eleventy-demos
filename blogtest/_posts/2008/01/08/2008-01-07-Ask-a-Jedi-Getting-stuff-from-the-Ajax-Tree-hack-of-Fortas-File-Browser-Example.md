---
layout: post
title: "Ask a Jedi: Getting stuff from the Ajax Tree, hack of Forta's File Browser Example"
date: "2008-01-08T09:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/08/Ask-a-Jedi-Getting-stuff-from-the-Ajax-Tree-hack-of-Fortas-File-Browser-Example
guid: 2580
---

Forgive the humongous title there. Cyril asks:

<blockquote>
<p>
I am trying to create a simple file in chooser in a cfwindow using cftree using Ben's example of filesystem browser, to populate a form field. I can open the window and the tree works fine, but how do I return the value of the node to the input field? I tried to look up ColdFusion.getElementValue but there is very little information on how to use it even on Livedocs.
</p>
</blockquote>

So first off, here is the demo on Ben's site that Cyril was talking about: <a href="http://www.forta.com/blog/index.cfm/2007/6/5/ColdFusion-Ajax-Tutorial-5-File-System-Browsing-With-The-Tree-Control">ColdFusion Ajax Tutorial 5: File System Browsing With The Tree Control</a> Ben's demos hows a CFC feeding file information to an Ajax based tree. The issue Cyril is having though is in getting the value from the tree. 

This actually is covered in the reference guide for getElementValue, but you may have skimmed over it. The third attribute to getElementValue allows you to specify a particular attribute of the element to retrieve the value. This is necessary for Tree's as they have two main values: PATH and NODE. So Cyril simply needs to do something like so:

<code>
&lt;script&gt;
function test() {
	var myval = ColdFusion.getElementValue('dirtree','myform','path');
 	alert(myval);
}
&lt;/script&gt;
 
&lt;cfform id="myform"&gt;
&lt;cftree name="dirtree" format="html"&gt;
   &lt;cftreeitem bind="cfc:dirtree.getDirEntries({% raw %}{cftreeitempath}{% endraw %},
{% raw %}{cftreeitemvalue}{% endraw %})"&gt;
	&lt;cfinput type="button" onclick="test()" name="testbutton" value="Test"&gt;
&lt;/cftree&gt;
&lt;/cfform&gt;
</code>