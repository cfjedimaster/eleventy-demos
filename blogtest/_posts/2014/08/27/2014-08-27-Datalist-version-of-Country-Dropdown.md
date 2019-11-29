---
layout: post
title: "Datalist version of Country Dropdown"
date: "2014-08-27T18:08:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2014/08/27/Datalist-version-of-Country-Dropdown
guid: 5297
---

<p>
Earlier this morning I saw the following tweet:
</p>
<!--more-->
<blockquote class="twitter-tweet" lang="en"><p>Dear clueless web devs: don&#39;t put a list of every country in the world in a select drop-down. Try autocomplete or a map.</p>&mdash; Peter Lyons (@focusaurus) <a href="https://twitter.com/focusaurus/statuses/504449378543607808">August 27, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<p>
I thought it made sense and figured - why not build a version using the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist">&lt;datalist&gt;</a> tag? I began by doing a quick Google search for a select drop down of countries. I came across this one: <a href="http://www.freeformatter.com/iso-country-list-html-select.html">ISO Country List - HTML select/dropdown snippet</a>. From that I simply copied and pasted the HTML. Here it is - with a few countries cut out. Like most of the world.
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;title&gt;Select Country&lt;&#x2F;title&gt;
&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

&lt;form&gt;

&lt;!-- credit: http:&#x2F;&#x2F;www.freeformatter.com&#x2F;iso-country-list-html-select.html --&gt;
&lt;select&gt;
	&lt;option value=&quot;AF&quot;&gt;Afghanistan&lt;&#x2F;option&gt;
	&lt;option value=&quot;AX&quot;&gt;Åland Islands&lt;&#x2F;option&gt;
	&lt;option value=&quot;AL&quot;&gt;Albania&lt;&#x2F;option&gt;
	&lt;option value=&quot;YE&quot;&gt;Yemen&lt;&#x2F;option&gt;
	&lt;option value=&quot;ZM&quot;&gt;Zambia&lt;&#x2F;option&gt;
	&lt;option value=&quot;ZW&quot;&gt;Zimbabwe&lt;&#x2F;option&gt;
&lt;&#x2F;select&gt;

&lt;&#x2F;form&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
And yeah - this works - but the UX is not terribly optimal. At minimum the US should really be on top if your audience is principally American. I mean, this is cool, right?
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-08-27 at 4.08.41 PM.png" />
</p>

<p>
Ok, so how to convert this to a datalist? I just need to add a text input and convert the dropdowns. The current code uses both a value and a text field, but datalists support only one value. I went into my console and wrote this code:
</p>

<pre><code class="language-javascript">s = $("select");
html = "";
for(var i=0;i&lt;s.options.length; i++) {% raw %}{ html+= "<option value=\""+s.options[i].text+"\">\n"; }{% endraw %}
copy(html);</code></pre>

<p>
This gave me a copy of the rendered string in my clipboard that I just then copied to a new file:
</p>

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;title&gt;Select Country&lt;&#x2F;title&gt;
&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
&lt;&#x2F;head&gt;
&lt;body&gt;

&lt;form&gt;

&lt;!-- credit: http:&#x2F;&#x2F;www.freeformatter.com&#x2F;iso-country-list-html-select.html --&gt;
&lt;input name=&quot;country&quot; list=&quot;countries&quot;&gt;
&lt;datalist id=&quot;countries&quot;&gt;
&lt;option value=&quot;Afghanistan&quot;&gt;
&lt;option value=&quot;Åland Islands&quot;&gt;
&lt;option value=&quot;Albania&quot;&gt;
&lt;option value=&quot;Algeria&quot;&gt;
&lt;option value=&quot;Zambia&quot;&gt;
&lt;option value=&quot;Zimbabwe&quot;&gt;
&lt;&#x2F;datalist&gt;

&lt;&#x2F;form&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

<p>
The result is a bit nicer I think. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-08-27 at 4.14.39 PM.png" />
</p>

<p>
Of course, there are a few disadvantages to this approach. First, you lose the associated country code. But you could easily do that server side. If for some reason a user enters a made up country, or simply mispells, then you would need to either just accept it or make them enter it again. The other issue is what happens if the user is on a browser that doesn't support datalist. The cool thing is that - guess what - <strong>they can still type</strong> - so nothing is really lost. You <i>could</i> write a few lines of code to detect support for datalist and where it doesn't exist, dynamically replace the tag (you can still get it even if the browser doesn't support it) with a select tag. 
</p>

<p>
On the off chance you want to try this, here is the 
<a href="https://static.raymondcamden.com/demos/2014/aug/27/test2.html">giant dropdown version</a> 
and here is the <a href="https://static.raymondcamden.com/demos/2014/aug/27/test7.html">datalist version</a>.
</p>