---
layout: post
title: "Why is my Ajax not working?"
date: "2011-09-26T10:09:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/09/26/Why-is-my-Ajax-not-working
guid: 4375
---

This is a topic I cover pretty often, but as I still get emails about it I figure it doesn't hurt to repeat myself. One of the number one reasons folks have issues with Ajax and ColdFusion is the use of Application.cfc and onRequestStart. If you output <b>anything</b> in onRequestStart, like a header, or a footer (in onRequestEnd obviously), it will <b>always</b> output, even when you make requests to CFCs. Let's look at a quick example of this.
<!--more-->
<p>

I'll begin with my front end fancy Ajax application. It's incredibly complex. It's going to use jQuery to call a CFC method that returns an array. It will take the array and make a nice UL out of it. Here's the code.

<p>

<code>

&lt;html&gt;
	
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {
	$.post("test.cfc?method=getarr&returnformat=json", {}, function(res,code) {
		var s = "&lt;h2&gt;Results&lt;/h2&gt;&lt;ul&gt;";
		for(var i=0; i&lt;res.length; i++) {
			s+= "&lt;li&gt;"+res[i]+"&lt;/li&gt;";
		}
		s+="&lt;/ul&gt;";
		$("#result").html(s);
	},"json");
})
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;div id="result"&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

The CFC is trivial, but for completeness sake, here it is:

<p>

<code>
component {

	remote array function getArr() {% raw %}{ return [1,2,3]; }{% endraw %}
	
}
</code>

<p>

(By the way, to the person who just called ColdFusion "tag soup" on Twitter... suck it.) Ok, if everything works, we should see this:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip190.png" />

<p>

However, when I ran my code I saw this instead:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip191.png" />

<p>

Global Corp? Eh? Turns out I had an Application.cfc file and I used onRequestStart to output a header for all my files:

<p>

<code>
component {

	this.name="root";
	public boolean function onApplicationStart() {  
    		return true;    
	}    
    
	public boolean function onRequestStart(string req) {
		writeOutput("&lt;h1&gt;Global Corp!&lt;/h1&gt;");
    		return true;	
	}
}
</code>

<p>

The problems becomes more apparent when you make use of Chrome Dev Tools or Firebug. <b>And folks, again, please please please please make use of these tools. You cannot, should not, must not, do Ajax development without them.</b> Look at what my CFC returned:

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip192.png" />

<p>

You can see the header being output before the CFC. This is not a bug. You told ColdFusion to output the text on every request. Luckily it is easy enough to fix. 

<p>

<code>
    public boolean function onRequestStart(string req) {
    	if(listLast(arguments.req,".") != "cfc") writeOutput("&lt;h1&gt;Global Corp!&lt;/h1&gt;");
    	return true;	
    }
</code>

<p>

I hope this helps (even if a repeat). As a reminder, I tend to recommend <i>against</i> using onRequestStart/End for templates just for this reason.