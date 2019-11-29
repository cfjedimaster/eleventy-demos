---
layout: post
title: "Two iPhone development tips, and jQuery to the rescue"
date: "2008-10-10T00:10:00+06:00"
categories: [development,jquery]
tags: []
banner_image: 
permalink: /2008/10/09/Two-iPhone-development-tips-and-jQuery-to-the-rescue
guid: 3048
---

I've spent the last week or so doing iPhone web development. Let me be clear - that's web development. I'm not actually writing any fancy native applications for the iPhone. While most of my time was spent on just the basic work of the app (and I'll have some server side details on that tomorrow at <a href="http://blog.broadchoice.com">ArgumentCollection</a>), I wanted to look into what - if any - tweaks were available to on the iPhone web browser. I've found two things that I think are pretty interesting.
<!--more-->
The first and simplest tip is working with the <a href="https://developer.apple.com/webapps/docs/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/chapter_4_section_1.html#//apple_ref/doc/uid/TP40006509-SW1">view port</a>. (You may need to register at Apple in order to view that link. Two points off to Apple to requiring a login for simple docs!) The view port is a simple meta tag. Here is an example:

<code>
&lt;meta name="viewport" content="width=320; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"&gt;
</code>

This lets you configure the size of the content on screen when viewed on the iPhone. Read the docs as it takes a bit of play to get it just right, but it can make a major difference in how your web site looks on the iPhone. 

The second tip also involves meta tags. While perusing the docs, I found a section on <a href="https://developer.apple.com/webapps/docs/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/chapter_8_section_3.html#//apple_ref/doc/uid/TP40002051-CH3-SW2">hiding the browser interface</a> components. For web applications saved to the iPhone desktop, this lets you run a page without the normal address bar or status bar at the bottom. This is a great tip! It really does a good job of turning your web page into something closer to a native web app. This can be done with a grand total of two lines of code:

<code>
&lt;meta name="apple-mobile-web-app-capable" content="yes" /&gt;
&lt;meta name="apple-mobile-web-app-status-bar-style" content="black" /&gt;
</code>

In order to test this, you will need to open your page in Safari (on the iPhone), then add it to your desktop and reopen it. <b>However</b> this feature has a major flaw. As soon as you click a link it will 'break' out of your full screen web application and open a whole new Safari window. But get this - if you do a form post, it won't do this! So normal links are bad, form posts are fine. So when I first tested, and the app prompted me to login, I thought it was all fine, until I clicked a link after logging in. This isn't documented as far as I can tell, which kind of sucks. One Google search turned up a comment from a user who thought that maybe Apple was assuming only Ajax-based applications would use this feature - but if so - I don't get why form posts would work ok.

And this is where jQuery came in. The web application was already done (well, done enough) so it was too late to rewrite it to be Ajax based just for a minor (if cool) UI update. But then I remembered something. jQuery has a feature called selectors (Spry has this as well now!) that lets you select items from the document. You can select on various attributes, including simple all tags of a certain type. If I could select all the links, I could possibly add a click handler. 

This is the test script I came up with:

<code>
&lt;meta name="viewport" content="width=320; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"&gt;
&lt;meta name="format-detection" content="telephone=no"&gt;
&lt;meta name="apple-mobile-web-app-capable" content="yes" /&gt;
&lt;meta name="apple-mobile-web-app-status-bar-style" content="black" /&gt;

&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script&gt;

function test() {
	$("#content").load('index3.cfm?log=&lt;cfoutput&gt;#randRange(1,100)#&lt;/cfoutput&gt;');
}

function init() {
	$("a").click(function(e) {% raw %}{ $("#content").load(e.target.href);return false; }{% endraw %});
}

$(document).ready(init);

&lt;/script&gt;
&lt;div id="content"&gt;
&lt;cfoutput&gt;
&lt;p&gt;
&lt;a href="index3.cfm?link=#urlEncodedFormat(createUUID())#"&gt;link to me, bad&lt;/a&gt;
&lt;/p&gt;
&lt;p&gt;
	&lt;a href="" onClick="document.location.href='test.cfm?link=#urlEncodedFormat(createUUID())#'"&gt;link to me, js&lt;/a&gt;
&lt;/p&gt;

&lt;p&gt;
	&lt;a href="test3.cfm?dontrun=1" onClick="test();return false;"&gt;link 3&lt;/a&gt;
&lt;/p&gt;

&lt;p&gt;
	&lt;a href="index.cfm"&gt;Naked Link&lt;/a&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;
&lt;cfdump var="#url#"&gt;
	
&lt;/div&gt;
</code>

So what's going on here? The first link is a vanilla link. If I clicked on it, even though it was linking back to itself, it broke my full screen view. The second link used JavaScript and document.location.href. That also failed. I then tried Ajax. My third link used jQuery to load the contents of a file into a div I wrapped around my main content. Finally I tried one more simpe link, and then added jQuery code to find all the links and edit the click event:

<code>
$("a").click(function(e) {% raw %}{ $("#content").load(e.target.href);return false; }{% endraw %});
</code>

This worked perfectly! In theory I just add this to my main template and all the links I have will now use AJAX to load their content.

I only have one issue left. Spry has a feature that works like the load() function in jQuery. But along with simply loading content, it can also filter to a particular div within the content. If jQuery can do that (I'm a bit tired now but I'm sure about 200 of my readers will chime in), then I can use this to load the page and not reload in the CSS/header/etc.