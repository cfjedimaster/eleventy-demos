---
layout: post
title: "Ask a Jedi: Layout in Application.cfc"
date: "2006-07-12T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/12/Ask-a-Jedi-Layout-in-Applicationcfc
guid: 1394
---

Douglas asked the following question this morning:

<blockquote>
Is it possible to use a header file include inside an
onRequestStart function in Application.cfc but prevent the header file from loading into select templates, or to define multiple header files and define the templates which are to use them.  I know I can just include them in each template but I have a site with multiple templates using the same header and a select few using a different header.  How would you approach this?
</blockquote>

So first off - yes, you can include a file on onRequestStart. If you wanted to <i>not</i> load it on certain templates, don't forget that ColdFusion passes in the template name to onRequestStart, so you always have access to the template that is about to load. 

However - you asked how I would approach this. I do not use onRequestStart to handle layout. Instead, I use a custom tag approach and wrap my pages like so:

<code>
&lt;cfmodule template="/mysite/tags/layout.cfm" title="About Me"&gt;
stuff
&lt;/cfmodule&gt;
</code>

While this means more work for me, I like having the finer control. I find this nicer than having logic dictating when and when not to use a header. If I don't need a header, then I simply don't use the custom tag. So for example, a popup may have something like so:

<code>
&lt;cfmodule template="/mysite/tags/popup.cfm" title="About Me"&gt;
stuff
&lt;/cfmodule&gt;
</code>

Another reason I like this is that I immidiately know what layout my pages are doing. If the logic was in onRequestStart, or even in the custom tag itself, when I worked on foo.cfm I wouldn't know what layout was being used for the page.