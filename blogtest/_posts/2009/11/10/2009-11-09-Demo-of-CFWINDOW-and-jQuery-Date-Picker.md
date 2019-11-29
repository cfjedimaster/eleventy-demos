---
layout: post
title: "Demo of CFWINDOW and jQuery Date Picker"
date: "2009-11-10T07:11:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/11/10/Demo-of-CFWINDOW-and-jQuery-Date-Picker
guid: 3597
---

A reader Paul wrote me and described an issue he was having with the jQuery UI date picker. It worked in a form embedded on his page but refuses to work within a CFWINDOW. Let's look at an example of what he tried and I'll explain what went wrong and how to fix it.
<!--more-->
To begin with, I'll create a page that uses a date picker within a form on the page. This is just to ensure a simple use case works.

<code>
&lt;html&gt;

&lt;head&gt;
&lt;link rel="stylesheet" href="/jquery/jqueryui/css/smoothness/jquery-ui-1.7.1.custom.css" type="text/css" media="screen" /&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="/jquery/jqueryui/js/jquery-ui-1.7.1.custom.min.js"&gt;&lt;/script&gt;
&lt;script&gt;

$(document).ready(function() {
	$("#dob").datepicker()
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h1&gt;Foo&lt;/h1&gt;
&lt;form&gt;
&lt;input type="text" name="dob" id="dob"&gt;&lt;br/&gt;
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

I've blogged about jQuery UI before (although I don't think I've blogged on just the date picker) so I won't explain each and every line. The basic gist is - load in jQuery, load in the jQuery UI library, and load in the jQuery UI CSS. Next, use the selector for the input field we want to turn into a datepicker and run the .datepicker function on it. I love how simple that is! 

Alright - now let's add a CFWINDOW to the picture:

<code>
&lt;cfajaximport tags="cfwindow" /&gt;
&lt;html&gt;

&lt;head&gt;
&lt;link rel="stylesheet" href="/jquery/jqueryui/css/smoothness/jquery-ui-1.7.1.custom.css" type="text/css" media="screen" /&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="/jquery/jqueryui/js/jquery-ui-1.7.1.custom.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
function showDateWindow() {
	ColdFusion.Window.create('dateWin','Title', '/test5.cfm',{% raw %}{x:100,y:100,height:300,width:350,modal:true,closable:false, draggable:true,resizable:false,center:true,initshow:false,refreshOnShow:true}{% endraw %});
	ColdFusion.Window.show('dateWin')	
}


$(document).ready(function() {
	$("#dob").datepicker()
	console.log('ran')	
	$("#showWin").click(showDateWindow)
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h1&gt;Foo&lt;/h1&gt;
&lt;form&gt;
&lt;input type="text" name="dob" id="dob"&gt;&lt;br/&gt;
&lt;input type="button" id="showWin" title="Show Window" value="Show Window"&gt;
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

Going from top to bottom - the first change I made was to use cfajaximport to let ColdFusion know I'd need JavaScript support for cfwindow. I added a new function, showDateWindow(), which defines the window I'll create. jQuery's document.ready function is told to listen for a click event on the showWin button, and finally, I add that button to the form. 

Now for the interesting part. Let's look at test5.cfm, where my cfwindow content is loaded.

<code>
&lt;h1&gt;Inner Form&lt;/h1&gt;
&lt;form&gt;
&lt;input type="text" name="innerdob" id="innerdob"&gt;&lt;br/&gt;
&lt;/form&gt;
</code>

I've got a super simple form with one field - innerdob. So what happens if I add datepicker support for this to document.ready?

<code>
$(document).ready(function() {
	$("#dob").datepicker()
	$("#innerdob").datepicker()
	console.log('ran')
	
	$("#showWin").click(showDateWindow)
})
</code>

This is exactly what Paul tried first and it failed completely. Why? Remember that $(document).ready is the same as: "Listen for the page to load and then do this..." When the page loaded, our cfwindow didn't actually exist yet. 

The first suggestion I made to Paul was to look at the CFML Reference for the Ajax functions and see if there was a function you could run to add an event listener to the cfwindow loading. There was - ColdFusion.Window.onShow. We modified the code to create the window to the following:

<code>
function showDateWindow() {
	ColdFusion.Window.create('dateWin','Title', '/test5.cfm',{% raw %}{x:100,y:100,height:300,width:350,modal:true,closable:false, draggable:true,resizable:false,center:true,initshow:false,refreshOnShow:true}{% endraw %});
	ColdFusion.Window.onShow('dateWin',doShow)
	ColdFusion.Window.show('dateWin')	
}

function doShow() {
	$("#innerdob").datepicker()
	console.log('doShow()')
}
</code>

Did that work? Nope! And it's kind of obvious if you get picky about the names. I didn't really see why though till I added:

<code>
&lt;cfset sleep(5000)&gt;
</code>

to my page loaded in via cfwindow. What you see when clicking the button to create the window is that as soon as the window is shown, doShow is run, but the content still isn't loaded yet. What we need is something like ColdFusion.Window.onPageLoaded or somesuch. While we don't have that - we have something else - ajaxOnLoad. I modified test5.cfm like so:

<code>
&lt;cfset ajaxOnLoad("winLoaded")&gt;

&lt;h1&gt;Inner Form&lt;/h1&gt;
&lt;form&gt;
&lt;input type="text" name="innerdob" id="innerdob"&gt;&lt;br/&gt;
&lt;/form&gt;
</code>

and in my main window added winLoaded:

<code>
function winLoaded() {
	console.log('winLoaded()')
	$("#innerdob").datepicker()
	console.log('made the date')
}
</code>

By the way, please remove the console.log statements if you make use of my code. I'm a huge believer in using logging everywhere during testing. So this finally worked... kinda. When it ran, the date picker ended up being <b>behind</b> the window. -sigh- So close! A quick Google search turned up posts from other people having the same problem. Not with cfwindow per se, but with the jQuery Dialog UI, which is pretty similar to cfwindow. The solution then is to add CSS to set the date picker UI to be above anything else in the DOM:

<code>
&lt;style&gt;
#ui-datepicker-div {
	z-index:10000;
}
&lt;/style&gt;
</code>

And with that - it worked. The complete template is listed below.

<code>
&lt;cfajaximport tags="cfwindow" /&gt;
&lt;html&gt;

&lt;head&gt;
&lt;link rel="stylesheet" href="/jquery/jqueryui/css/smoothness/jquery-ui-1.7.1.custom.css" type="text/css" media="screen" /&gt;
&lt;style&gt;
#ui-datepicker-div {
	z-index:10000;
}
&lt;/style&gt;
&lt;script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="/jquery/jqueryui/js/jquery-ui-1.7.1.custom.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
function showDateWindow() {
	ColdFusion.Window.create('dateWin','Title', '/test5.cfm',{% raw %}{x:100,y:100,height:300,width:350,modal:true,closable:false, draggable:true,resizable:false,center:true,initshow:false,refreshOnShow:true}{% endraw %});
	ColdFusion.Window.onShow('dateWin',doShow)
	ColdFusion.Window.show('dateWin')	
}

function doShow() {
	console.log('doShow()')
}

function winLoaded() {
	console.log('winLoaded()')
	$("#innerdob").datepicker()
	console.log('made the date')
}

$(document).ready(function() {
	$("#dob").datepicker()
	console.log('ran')
	
	$("#showWin").click(showDateWindow)
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;h1&gt;Foo&lt;/h1&gt;
&lt;form&gt;
&lt;input type="text" name="dob" id="dob"&gt;&lt;br/&gt;
&lt;input type="button" id="showWin" title="Show Window" value="Show Window"&gt;
&lt;/form&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>