---
layout: post
title: "Interesting discovery with CasperJS, jQuery, and transitions"
date: "2014-02-28T10:02:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/02/28/Interesting-discovery-with-CasperJS-jQuery-and-transitions
guid: 5168
---

<p>
Earlier this week I got to look at some code using <a href="http://casperjs.org/">CasperJS</a>. CasperJS is a testing utility for <a href="http://phantomjs.org/">PhantomJS</a>, a headless (i.e. virtual) Webkit browser. This is probably unfair, but I like to think of Casper as a super powered Curl. Hopefully you know Curl as a command line tool that lets you perform network requests and work with the result. Unlike Curl, CasperJS (and PhantomJS) can actually interact with the results like a real browser. This allows for some cool testing/utilities. I've only begun to scratch the surface of the tool, but I thought I'd share an interesting little issue my coworker and I ran into with it.
</p>
<!--more-->
<p>
My coworker, Paul Robertson (smart and friendly guy who needs to start up his blog again), created a CasperJS script that crawled a set of URLs and downloaded the HTML to a local directory. That by itself sounds just like Curl. But these pages were special. They used jQuery to perform an XHR request to a JSON file. Once the XHR request was done, the data was turned into HTML and rendered into the DOM. Here is where CasperJS/PhantomJS shines. He was able to tell the headless browser to wait for a particular selector to appear (the one used by the JavaScript code to render HTML) and only then actually save the result. Cool, right?
</p>

<p>
To give you an idea, here is an example file. This one loads in a simple HTML fragment but you get the idea.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;div id=&quot;main&quot;&gt;&lt;&#x2F;div&gt;
		
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.0.3&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script&gt;
		$(document).ready(function() {
			var $main = $(&quot;#main&quot;);
			
			&#x2F;&#x2F;fetch the content and insert it...
			&#x2F;&#x2F;timeout here just to fake some network latency 
			window.setTimeout(function() {
				$.get(&quot;data.html&quot;, function(res) {
					$main.append(res);
				});
			}, 800);
			
		});
		
		&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
Nothing weird there so I won't go over it. Now let's look at the CasperJS script. This is a simplified version of what Paul wrote. Even if this is your first time ever seeing CasperJS in action, you can probably grok what's going on.
</p>

<pre><code class="language-javascript">var casper = require("casper").create();
var fs = require("fs");

var outputFolder = "./output/";
var timeoutLength = 2000;

// TODO: delete contents of output folder
if(fs.exists(outputFolder)) {
  console.log("Removing "+outputFolder);
  fs.removeTree(outputFolder);
}

casper.start();

var url = "http://localhost/testingzone/trash/testtransition2.html";
var selector = "#dynamicContent";

console.log("Getting "+url);

casper.thenOpen(url);
casper.waitForSelector(selector, function then() {
    var htmlToWrite = this.getHTML();
    var outputFile = outputFolder + "testoutput.html";
    fs.write(outputFile, htmlToWrite, "w");
    console.log("Wrote html to " + outputFile);
  }, function timeout() {
    this.echo("Selector not found after " + timeoutLength + " ms");
  }, timeoutLength);

casper.run();</code></pre>

<p>
The result is an HTML file with the contents <strong>including</strong> those loaded via jQuery. Just for completeness sake, here is the html fragment. Note it has the selector my script is waiting for.
</p>

<pre><code class="language-markup">&lt;div id=&quot;dynamicContent&quot;&gt;
This is so cool.
&lt;&#x2F;div&gt;</code></pre>

<p>
Woot! Ok, so like I said - that's <i>really</i> freaking cool. We pushed the content up for testing and someone pointed out something odd. The area where dynamic content was loaded had an odd gray dimness to it. In case you're curious, this is the second Google result for "odd gray dimness":
</p>

<p>
<img src="https://static.raymondcamden.com/images/8_20pirates-thumb-350x230-35049.jpg" />
</p>

<p>
I did some digging and discovered something truly odd. The div that had dynamic content injected within it had this: <code>style="display: block; opacity: 0.04429836168227741; "</code>
</p>

<p>
WTF
</p>

<p>
I did some more clicking around - this time on the original version - and then I saw it. When the dynamic content was loaded, jQuery was doing some fancy fade in/fade out action. Because... fancy. So I modified my original code a bit to try to recreate this:
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

		&lt;div id=&quot;main&quot;&gt;Existing HTML...&lt;&#x2F;div&gt;
		
		&lt;script type=&quot;text&#x2F;javascript&quot; src=&quot;http:&#x2F;&#x2F;ajax.googleapis.com&#x2F;ajax&#x2F;libs&#x2F;jquery&#x2F;2.0.3&#x2F;jquery.min.js&quot;&gt;&lt;&#x2F;script&gt;
		&lt;script&gt;
		$(document).ready(function() {
			var $main = $(&quot;#main&quot;);
			
			&#x2F;&#x2F;fetch the content and insert it...
			&#x2F;&#x2F;timeout here just to fake some network latency 
			window.setTimeout(function() {
				
				$main.fadeOut(function() { 
					$.get(&quot;data.html&quot;, function(res) {
						$main.html(res);
						$main.fadeIn();
					})						  
				})
							  
			}, 20);
			
		});
		
		&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
Note the use of fancy fading action. Fancy! I then reran my CasperJS script and immediately saw the same thing added to my output. It was the fade! CasperJS saw the DOM item because, well it was there, but jQuery wasn't finished fading it back in. I discovered that CasperJS had a simple wait command, so I threw that in:
</p>

<pre><code class="language-javascript">casper.waitForSelector(selector, function then() {
	this.wait(1000);
    var htmlToWrite = this.getHTML();
    var outputFile = outputFolder + "testoutput.html";
    fs.write(outputFile, htmlToWrite, "w");
    console.log("Wrote html to " + outputFile);
  }, function timeout() {
    this.echo("Selector not found after " + timeoutLength + " ms");
  }, timeoutLength);
</code></pre>

<p>
And that did it. Technically I could have used a smaller wait (the default duration for jQuery fade transitions is 400), but this seemed simpler and did the trick.
</p>