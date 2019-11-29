---
layout: post
title: "getSafeHTML and ColdFusion 11"
date: "2014-04-09T23:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/04/09/getSafeHTML-and-ColdFusion-11
guid: 5196
---

<p>
One of the cooler new features in the next version of ColdFusion is <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/getsafehtml">getSafeHTML</a>. I had seen this mentioned a few times already but it never really clicked in my brain what it was doing. getSafeHTML makes use of the AntiSamy project. It takes user-generated content and replaces unsafe HTML. What is safe and what isn't? It is totally up to you. The functionality is driven by an XML file (a very complex XML file) that lets you get as granular as you want. Want to support the bold tag but not italics? Fine. Want to support colors for CSS but only some? You can do that. Let's look at a simple example - and one that happens to point out a little issue.
</p>
<!--more-->
<pre><code class="language-markup">&lt;cfsavecontent variable=&quot;test&quot;&gt;
This is some &lt;b&gt;html&lt;/b&gt;. Even &lt;i&gt;more&lt;/i&gt; html!&lt;br/&gt;
&lt;iframe src=&quot;http://www.cnn.com&quot;&gt;&lt;/iframe&gt;
&lt;/cfsavecontent&gt;

&lt;cfoutput&gt;
&lt;pre&gt;
#getSafeHTML(test)#
&lt;/pre&gt;
&lt;/cfoutput&gt;
</code></pre>

<p>
In my sample input, I've got a B tag, an I tag, and an iframe. getSafeContent will strip out <strong>just</strong> the iframe, leaving the bold and italics there. This is rather cool I think. But in my test I discovered a little bug. The <i>actual</i> result of the above code is this:
</p>

<pre><code class="language-markup">This is some &lt;b&gt;html&lt;/b&gt;
. Even &lt;i&gt;more&lt;/i&gt;
 html!&lt;br /&gt;</code></pre>

<p>
See the line break after the closing B tag? That moves the period to a new line, which renders as a space in the browser. I did some research and discovered that there is a particular setting in AntiSamy that modifies the result with a bit of formatting. In this case, the formatting breaks my HTML. So how to fix?
</p>

<p>
As I mentioned, AntiSamy is configured by an XML file. There is a default one for the server. You can override the XML file at the Application.cfc level or in your call to getSafeHTML itself. I did some Googling, found a sample file, and then did the modification to the setting in question:
</p>

<pre><code class="language-markup">&lt;directive name="formatOutput" value="false"/&gt;</code></pre>

<p>
This goes within the directives block. I'm going to file an ER to add this to the default XML for ColdFusion 11.
</p>