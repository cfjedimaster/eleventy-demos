---
layout: post
title: "ColdFusion 8: AJAX UI Windows"
date: "2007-06-20T09:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/20/ColdFusion-8-AJAX-UI-Windows
guid: 2134
---

I've been blogging about new ColdFusion UI controls in ColdFusion 8 and today I'm discussing CFWINDOW. First - CFWINDOW does not - as you might guess - create a popup window. Which is probably a good thing. The last thing this world needs is another popup window. Instead the tag creates a "virtual" window that appears on top of your page. Let's take a look at a few examples.
<!--more-->
At the simplest level, all you need to for a window is:

<code>
&lt;cfwindow&gt;
This is a window.
&lt;/cfwindow&gt;
</code>

But if you run this, nothing shows up! Turns out that by default, windows are hidden. To make a window show up right away, you would do:

<code>
&lt;cfwindow initShow="true"&gt;
This is a window.
&lt;/cfwindow&gt;
</code>

You can see an example of this <a href="http://www.raymondcamden.com/demos/layout/window1.cfm">here</a>.

So this isn't terribly exciting so far, so let's add a bit of meat to it:

<code>
&lt;cfimage action="info" source="lolcat1.jpg" structName="cat"&gt;

&lt;cfwindow initShow="true" title="Welcome to &lt;CFWINDOW&gt;" 
		  center="true" modal="true" resizable="true" 
		  draggable="false" height="#cat.height#"&gt;
&lt;img src="lolcat1.jpg" align="left"&gt;
This is a cat.
&lt;/cfwindow&gt;
</code>

So this example begins by using cfimage to get information about an image. I use that information to supply a height to  my window. I'm also using a few more attributes:

<ul>
<li>Title - This sets the title of the window.
<li>Center - This centers a window.
<li>Modal - This makes the window have focus - it also does a cool "gray" effect on the rest of the page.
<li>Resizable - This lets you resize the window.
<li>Draggable - This lets you enable window moving (I turned it off)
<li>Height (and Width) - This lets you size the window.
</ul>

You can see an example of this <a href="http://www.coldfusionjedi.com/demos/layout/window2.cfm">here</a>.

As with other UI controls, you have some options for changing the look of the window as well:

<code>
&lt;cfwindow initShow="true" title="Styling Window" center="true" height="400" width="400"
		  bodyStyle="font-family: verdana; color: ##ff0000;"
		  headerStyle="font-family: verdana; background-color: black; color: white"&gt;
&lt;p&gt;
This is a window with a bit more text in it. It is fairly
interesting in a not-so-interesting way. A bit like Paris Hilton
&lt;/p&gt;
&lt;/cfwindow&gt;
</code>

You can see an example of this <a href="http://www.coldfusionjedi.com/demos/layout/window3.cfm">here</a>.

You can also supply a source as well:

<code>
&lt;cfwindow initShow="true" title="My Cat" center="true" source="cat2.html" height="360" /&gt;
</code>

You can see an example of this <a href="http://www.coldfusionjedi.com/demos/layout/window4.cfm">here</a>.

Again - like the other controls, there is a nice JavaScript API to work with the windows. For example, you an show and hide a window:

<code>
&lt;cfwindow initShow="false" title="Welcome to &lt;CFWINDOW&gt;" 
		  center="true" resizable="true" 
		  draggable="false" name="mywin"&gt;

Hi, I'm a window.		  

&lt;form&gt;
&lt;input type="button" value="Close Me!" onClick="ColdFusion.Window.hide('mywin')"&gt;
&lt;/form&gt;

&lt;/cfwindow&gt;

&lt;p&gt;
&lt;a href="javaScript:ColdFusion.Window.show('mywin')"&gt;Show Window&lt;/a&gt;&lt;br /&gt;
&lt;a href="javaScript:ColdFusion.Window.hide('mywin')"&gt;Hide Window&lt;/a&gt;&lt;br /&gt;
&lt;/p&gt;
</code>

This example uses the ColdFusion.Window.show/hide API to, well, show and hide my window. Also note I added a button inside the window itself. This gives the user 3 ways to close the window. The X button in the upper right hand corner of the window. The button in the form. Lastly - the link.

You can see an example of this <a href="http://www.coldfusionjedi.com/demos/layout/window5.cfm">here</a>.

You may also register handlers for the show/hide event using ColdFusion.Window.onShow/onHide:

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script&gt;
function showWindow(name) {
	alert('You just showed ' + name);
}

function hideWindow(name) {
	alert('You just hid ' + name);
}

setup = function() {
	ColdFusion.Window.onShow('mywin1', showWindow);
	ColdFusion.Window.onShow('mywin2', showWindow);
	ColdFusion.Window.onHide('mywin1', hideWindow);
	ColdFusion.Window.onHide('mywin2', hideWindow);
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;cfwindow initShow="false" title="Window 1" name="mywin1"&gt;
Window 1
&lt;/cfwindow&gt;

&lt;cfwindow initShow="true" title="Window 2" name="mywin2"&gt;
Window 2
&lt;/cfwindow&gt;

&lt;p&gt;
&lt;a href="javaScript:ColdFusion.Window.show('mywin1')"&gt;Show Window 1&lt;/a&gt;&lt;br /&gt;
&lt;a href="javaScript:ColdFusion.Window.hide('mywin1')"&gt;Hide Window 1&lt;/a&gt;&lt;br /&gt;
&lt;a href="javaScript:ColdFusion.Window.show('mywin2')"&gt;Show Window 2&lt;/a&gt;&lt;br /&gt;
&lt;a href="javaScript:ColdFusion.Window.hide('mywin2')"&gt;Hide Window 2&lt;/a&gt;&lt;br /&gt;
&lt;/p&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

In this example, I simply register handlers for the show/hide event for my two windows. Only one argument is passed to the window, the name of the element. Note this is <b>not</b> the same as the name you provide. I'm assuming it is a random/unique ID that is used by ColdFusion. 

You can see an example of this <a href="http://www.coldfusionjedi.com/demos/layout/window6.cfm">here</a>.

Lasstly - this is the only UI control that can be completely created from within JavaScript. (The tab control lets you add a tab, but you can't create the entire control.) By using ColdFusion.Window.create, you can create a window with any option you choose. For my last example, I create a form and use the following JavaScript to create a window:

<code>
&lt;script&gt;
function makeWindow() {
	
	var title = document.getElementById("title").value;
	var width = document.getElementById("width").value;
	var height = document.getElementById("height").value;
	var cbCentered = document.getElementById("centered");
	if(cbCentered.checked) centered = true;
	else centered = false;
	
	var config = new Object();
	config.width = width;
	config.height = height;
	config.centered = centered;
	ColdFusion.Window.create('main'+Math.random(),title,'cat2.html',config);
}
&lt;/script&gt;
</code>

Note the use of a random number on the window name. Right now there is no (as far as I can tell) way to destroy a window. I was able to hide a window in the beginning of a function, but hiding it didn't destroy it. So if you changed settings and hit the button, you always got the first window back. I'm not doing any type of real validation, so be gentle on this 
You can see an example of this <a href="http://www.coldfusionjedi.com/demos/layout/window7.cfm">demo</a>.

One JavaScript API I didn't cover is ColdFusion.Window.getWindowObject. This gives you access to the underlying JavaScript object.