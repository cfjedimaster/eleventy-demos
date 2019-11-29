---
layout: post
title: "Cool feature in CFPRESENTATION"
date: "2007-08-29T07:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/29/Cool-feature-in-CFPRESENTATION
guid: 2310
---

CFPRESENTATION is one of those tags that are pretty good - but I'm not sure how often I'll use it. While working on WACK though I discovered that the tag has a feature that is pretty darn interesting. As you may (or may not know), the CFPRESENTATION tag creates Connect presentations on the fly. This could be useful for multiple purposes. You could use it to create dynamic portfolios for a company. You could use it for tutorials. Etc. This example creates a basic 2 slide static example:

<code>
&lt;cfpresentation title="First Presentation" 
				autoPlay="false"&gt;

	&lt;cfpresentationslide title="Welcome to CFPRESENTATION" 
						 notes="These are some notes."&gt;
&lt;h1&gt;Welcome to CFPRESENTATION&lt;/h1&gt;

&lt;p&gt;
This is content for the first slide. I can include HTML
and it will be rendered by the presentation.
&lt;/p&gt;
	&lt;/cfpresentationslide&gt;

	&lt;cfpresentationslide title="Sales Figures" 
			 notes="These are some notes for slide two."&gt;
&lt;h1&gt;Sales Figures&lt;/h1&gt;

&lt;p&gt;
Some fake data.
&lt;/p&gt;

&lt;p&gt;
&lt;table width="100%" border="1"&gt;
&lt;tr&gt;
	&lt;th&gt;Product&lt;/th&gt;
	&lt;th&gt;Price&lt;/th&gt;
&lt;/tr&gt;
&lt;tr&gt;
	&lt;td&gt;Apples&lt;/td&gt;&lt;td&gt;$0.99&lt;/td&gt;
&lt;/tr&gt;
&lt;tr&gt;
	&lt;td&gt;Bananas&lt;/td&gt;&lt;td&gt;$1.99&lt;/td&gt;
&lt;/tr&gt;
&lt;tr&gt;
	&lt;td&gt;Nukes&lt;/td&gt;&lt;td&gt;$2.99&lt;/td&gt;
&lt;/tr&gt;
&lt;/table&gt;
&lt;/p&gt;
	&lt;/cfpresentationslide&gt;
&lt;/cfpresentation&gt;
</code>

You can see this output <a href="http://www.raymondcamden.com/demos/cfp.cfm">here</a>.

What I discovered (and the reason for the post is), you can also use CFPRESENTATION to create <i>offline</i> presentations as well. If you supply the directory attribute, the generated Connect presentation will be stored to the file system. This code will have <b>no</b> need for ColdFusion and could be zipped up (using CFZIP) and mailed to someone. The end user could then unzip the files onto their desktop and open the presentation there. Here is a short snippet showing this in action:

<code>
&lt;cfset directory = expandPath("./stored")&gt;
&lt;cfif not directoryExists(directory)&gt;
	&lt;cfdirectory action="create" directory="#directory#"&gt;
&lt;/cfif&gt;

&lt;cfpresentation title="First Presentation" 
				autoPlay="false" directory="./stored"&gt;
More slides here...
</code>

I've included a simple presentation at the end of this blog post. Just use the download link. For more about CFPRESENTATION, be sure to pick up the WACK!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fstored%{% endraw %}2Ezip'>Download attached file.</a></p>