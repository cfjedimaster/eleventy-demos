---
layout: post
title: "HTML/Adobe AIR Application Diversion Three - Add ActionScript to your HTML"
date: "2010-08-17T18:08:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/08/17/HTMLAdobe-AIR-Application-Diversion-Three-Add-ActionScript-to-your-HTML
guid: 3915
---

So time for another diversion, once again care of Hatem who suggested it to me today. This is a feature I talked about briefly during my last presentation but didn't have a chance to actually play with. Today at lunch I did so and I'm completely blown away. The feature I'm talking about is the ability for your HTML application to include ActionScript libraries via the SCRIPT tag. This is discussed in the documentation <a href="http://help.adobe.com/en_US/air/html/dev/WS5b3ccc516d4fbf351e63e3d118666ade46-7ed9.html">here</a>, but let me demonstrate two examples that I think really bring home the power of this feature. It's got to be one of the coolest things yet I've seen for HTML/AIR applications.
<!--more-->
<p>

So - for my first test I needed to create an ActionScript class. I wrote the following class which was about as simple as I could 
do.

<p>

<code>
package
{
	
	public class TestASInHTML
	{
		public function TestASInHTML()
		{
		}
	
		public function multiplyBy2(x:int):int {
			return x*2;
		}

	}
}
</code>

<p>

This simple class has one function, multipleBy2, which, wait for it - does simple multiplication. Crazy, I know. JavaScript will never support this. Anyway - I need to take this class and create a SWF out of it. The docs recommend making using of acompc. This is a command line compiler of Flex/AS code into SWFs. I'm assuming this is also what Flash Builder calls in the background when you do builds. I've never used it before so I had a bit of trouble figuring out the exact syntax. Luckily I ran into this: <a href="http://help.adobe.com/en_US/AIR/1.5/devappshtml/WS5b3ccc516d4fbf351e63e3d118666ade46-7e74.html">Defining browser-like user interfaces for HTML content</a>

<p>

In this article you can see the following example:

<p>

<code>
acompc -source-path . -include-classes HTMLHostImplementation -output Host.zip
</code>

<p>

This looked like it could possibly work, so I gave it a shot. In the folder that had my AS class, I typed:

<p>

<code>
acompc -source-path . -include-classes TestASInHTML -output Test.zip
</code>

<p>

I extracted the zip and found library.swf. Woot. So now I've got a SWF of my fancy ActionScript code. The next step was to create a very basic HTML/AIR project within Aptana. I created the following demo using the syntax provided by Adobe as a guide.

<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        &lt;script src="lib/library.swf" type="application/x-shockwave-flash"&gt;&lt;/script&gt;
		&lt;script src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		
		$(document).ready(function() {
			/* My first test
			air.trace('loaded');
			var lib = new window.runtime.TestASInHTML();
			var x = lib.multiplyBy2(9);
			air.trace(x); 
			*/
			
			var lib = new window.runtime.TestASInHTML();

			$("#source").change(function() {
				$("#result").html( lib.mutliplyBy2($(this).val()));
			});
		});
		&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
	&lt;input id="source"&gt; &lt;span id="result"&gt;
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

So - a few things going on here. First off - I don't typically leave in my text code when doing blog entries. I find commented out code to be very distracting for blogs. But - in this case I wanted to show you what I tried first as a basic test.  The most critical line is the script source on line 5. Notice the type. This is <b>required</b>. Once I've added this in, it extends my window.runtime object. As you can see later on - I end up having access to TestASInHTML natively. I can create a pointer to that class and then run my multiplyBy2 value on it. I use a bit of jQuery to bind to an input field and print out the result.

<p>

Ok, so right now you may be saying - that's cool - but so what? Well, not being a big Flex/Flash guy, I wasn't really tuned into the ActionScript open source market. I first looked at RIAForge and found a bunch of projects there. One of them was Mike Potter's <a href="http://actionscript3libraries.riaforge.org/">ActionScript 3 Libraries</a>. There is a <i>lot</i> of crap in here including an RSS parser. He wrote a handler that can take in a random RSS feed, parse it, and return a normalized set of data. (Which, by the way, ColdFusion's CFFEED doesn't do. If you want something like that, check out my <a href="http://paragator.riaforge.org/">Paragator</a> project.) Ok, would it be cool to use his code? Sure it would. I downloaded his code, extracted the SWF out of his SWC file, and created the following demo:

<p>

<code>

&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;New Adobe AIR Project&lt;/title&gt;
        &lt;script type="text/javascript" src="lib/air/AIRAliases.js"&gt;&lt;/script&gt;
        &lt;script src="lib/libraryxml.swf" type="application/x-shockwave-flash"&gt;&lt;/script&gt;
		&lt;script src="lib/jquery/jquery-1.4.2.js"&gt;&lt;/script&gt;
		&lt;script&gt;
		
		$(document).ready(function() {
			var lib = new window.runtime.com.adobe.xml.syndication.rss.RSS20();
			$.get("http://feeds.feedburner.com/ColdfusionbloggersorgFeed", {}, function(res,content) {
				//jQuery automatically made it an XML object, I want just the string.
				var string = (new XMLSerializer()).serializeToString(res);
				lib.parse(string);
				var s = "";
				$.each(lib.items, function(idx,val) {
					s += "&lt;a href='" + val.link + "'&gt;" + val.title + "&lt;/a&gt;&lt;br/&gt;";
				});
				$("#result").html(s);
			});
		});
		&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
	&lt;span id="result" /&gt;
    &lt;/body&gt;
&lt;/html&gt;
</code>

<p>

What we have here is a RSS parser, written in ActionScript, being used in an HTML Adobe AIR application. I create an instance of the lib and call parse on the RSS. That's it. I wish it was harder. I wish I could say I had to check the RSS type or do other crap like that - but nope, I didn't. 

<p>

<img src="https://static.raymondcamden.com/images/Capture12.PNG" title="Smell the awesomeness." />

<p>

So maybe I'm getting overly excited about this - but consider it. There is a lot of open source ActionScript out there. You can find a bunch on the <a href="http://www.riaforge.org/index.cfm?event=page.category&id=6">Flash</a> category at RIAForge. You can find a bunch on this blog entry that Hatem shared with me: <a href="http://www.adrianparr.com/?p=83">AS3 Code Libraries (APIs)</a>. All of these bad boys could be included now in your HTML/AIR apps. Just looking over the list got me excited. Stuff like native zip support could be killer. Anyway, I hope you get the idea. Is this killer or what?