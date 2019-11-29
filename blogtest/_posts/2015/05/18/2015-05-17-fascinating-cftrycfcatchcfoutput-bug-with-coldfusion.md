---
layout: post
title: "Fascinating cftry/cfcatch/cfoutput bug with ColdFusion"
date: "2015-05-18T06:08:50+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/05/18/fascinating-cftrycfcatchcfoutput-bug-with-coldfusion
guid: 6154
---

This was reported to me by Brian Paulson and I have to admit I was pretty surprised when I saw it. Consider the following code block:

<!--more-->

<pre><code class="language-markup">&lt;cfoutput&gt;
	&lt;cftry&gt;
	&lt;cfset cdata =&quot;Test&quot;&gt;
	&lt;cfdump var=&quot;#variables#&quot;&gt;
	#outputTest(&quot;test&quot;,{% raw %}{&quot;cdata&quot;=cdata}{% endraw %})#
	
	&lt;cfcatch type=&quot;any&quot;&gt;
	    &lt;cfdump var=&quot;#cfcatch#&quot;&gt;
	&lt;/cfcatch&gt;
	&lt;/cftry&gt;
&lt;/cfoutput&gt;

&lt;cffunction name=&quot;outputTest&quot; output=&quot;false&quot;&gt;
    &lt;cfargument name=&quot;id&quot; type=&quot;string&quot; default=&quot;&quot;&gt;
    &lt;cfargument name=&quot;options&quot; type=&quot;struct&quot;&gt;
    &lt;!--- dont need to do anything in here ---&gt;
    &lt;cfreturn id&gt;
&lt;/cffunction&gt;</code></pre>

Right away you may think, that cfoutput should be inside the cftry, and you're right, but it doesn't <i>have</i> to be, except for the fact that when you run this code, you get: <strong>Variable CDATA is not defined</strong>. Since CDATA has special meaning in XML, I thought perhaps it was a bug with ColdFusion's parser, but renaming it doesn't help. Note the cfdump of variables there. If I remove the outputTest UDF call I clearly see CDATA as a variable. In the UDF call I tried variables.cdata and it didn't work. Using "variables" by itself though did work. I also tried making a new structure, s, with cdata as a value inside and then passed s to the UDF and that worked fine too. 

The main issue seems to be the placement of the cfoutput. Moving them inside makes it work properly:

<pre><code class="language-markup">&lt;cftry&gt;
&lt;cfoutput&gt;
&lt;cfset cdata =&quot;Test&quot;&gt;
#outputTest(&quot;test&quot;,{% raw %}{&quot;cdata&quot;=cdata}{% endraw %})#
&lt;/cfoutput&gt;
&lt;cfcatch type=&quot;any&quot;&gt;
    &lt;cfdump var=&quot;#cfcatch#&quot;&gt;
&lt;/cfcatch&gt;
&lt;/cftry&gt;</code></pre>

Brian filed a bug report for it you can view here: <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3989302">https://bugbase.adobe.com/index.cfm?event=bug&id=3989302</a>. I tested it in Lucee and it works as expected.