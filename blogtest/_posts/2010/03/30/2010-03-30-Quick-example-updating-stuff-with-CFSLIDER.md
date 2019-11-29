---
layout: post
title: "Quick example - updating stuff with CFSLIDER"
date: "2010-03-30T13:03:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2010/03/30/Quick-example-updating-stuff-with-CFSLIDER
guid: 3768
---

A reader asked:
<p/>
<blockquote>
I'm a coldfusion newbie, trying to figure out how to properly use the cfslider tag and update a database value when the slider is moved. I really need a good example of this functionality, can't find anything on the web.
</blockquote>
<p/>
I had not touched cfslider since the beta of ColdFusion 9, but I spent a few minutes with it today and came up with a simple demo.
<!--more-->
<p/>
First though - I must point out two disappointing issues with cfslider. First, it doesn't support the range attribute. Apparently that only works with the Flash Form or Applet versions. You must use min and max instead. No big deal of course, just a bit silly. (I filed a bug report for this. "Bug" because the docs do not make it clear it isn't supported, so I assume this is a real bug and not just a documentation issue.) Secondly, there is no way to provide a label with the HTML slider. The docs say you can use a label which will automatically update as you slide, but it too must be Flash/Applet only. This one is actually a bit more sucky since you get no visual cue at all what the value is. Before I even attempted to do a database call, I "fixed" that issue. Here is my example:
<p/>
<code>
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;cfparam name="session.slider" default="50"&gt;

&lt;script&gt;
function sliderChange(ob, value) {
	//console.dir(arguments)
	$("#sliderValue").html(value)
}

&lt;/script&gt;

&lt;b&gt;Your Coolness:&lt;/b&gt;
&lt;cfslider format="html"  min="1" max="100" value="#session.slider#" name="coolness" onchange="sliderChange" tip="false"&gt;
&lt;cfoutput&gt;&lt;b id="sliderValue"&gt;#session.slider#&lt;/b&gt;&lt;/cfoutput&gt;
</code>
<p/>
I've got a few things going on here, so let me address them one by one. I decided I was going to use a session value to persist my slider. The original user wanted to save it to a database but I wanted something folks could try quickly at home. This template doesn't persist the change - that comes next. I used the onChange attribute to specify a JavaScript function to run when the slider changes. Unfortunately, the documentation tells you nothing about the method signature of that call. I used the (commented out now) console.dir command you see above to inspect it and discovered that the function is passed the slider object and the value. I also added a comment to the online CFML Reference for cfslider. Hopefully it will be incorporated in a future version of the docs. So the final step was to just get the label working. I used jQuery for it which may be overkill for this example, but you could translate that to a document.getElementById call. You can see a demo of this <a href="http://www.raymondcamden.com/demos/march302010/test2.cfm">here</a>.
<p/>
Once I had that working I then worked up a quick example of performing an update on change. As I said, I used session variables instead of database updates, but the way I do it would work with either. I modified my sliderChange function like so:
<p/>
<code>
function sliderChange(ob, value) {
	$.get("updateslider.cfm",{% raw %}{newvalue:value}{% endraw %})
	$("#sliderValue").html(value)
}
</code>
<p/>
As you can see, I added a get request. I have no need to wait for the response so there isn't a callback handler. All updateslider.cfm does is:
<p/>
<code>
&lt;cfparam name="url.newvalue" default=""&gt;

&lt;cfif isNumeric(url.newvalue) and round(url.newvalue) is url.newvalue and url.newvalue gte 1 and url.newvalue lte 100&gt;
	&lt;cfset session.slider = url.newvalue&gt;
&lt;/cfif&gt;
</code>
<p/>
Notice all the validation? Repeat after me - AJAX calls are not magically "safe" from URL hacking. Anyway, you can see that it just validates the value sent and stores it in the session. You can test this <a href="http://www.coldfusionjedi.com/demos/march302010/test4a.cfm">here</a>. Change the value and then reload the page. Notice the slider is at the last position you set it.