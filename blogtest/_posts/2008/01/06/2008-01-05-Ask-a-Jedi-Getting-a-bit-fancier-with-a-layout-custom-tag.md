---
layout: post
title: "Ask a Jedi: Getting a bit fancier with a layout custom tag"
date: "2008-01-06T08:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/06/Ask-a-Jedi-Getting-a-bit-fancier-with-a-layout-custom-tag
guid: 2575
---

John asks:

<blockquote>
<p>
Somewhere about a year ago, I found an <a href="http://www.raymondcamden.com/index.cfm/2007/9/3/ColdFusion-custom-tag-for-layout-example">article</a> on using a layout.cfm page "custom tag" to layout the template
for the site. I include a header, menu and footer. I wrap this around all my pages and volia we have a fairly robust template engine. Only now with all the power of the cfc and a huge whole in my plan, I need a new way to do this layout. I need to be able to create different layouts in the content area, but make them reusable through out the site.

With the simple cfcase value="start" and end option I do not have a way to specify the or dynamically call a different layout page without having to write an entire new layout page with that code in there. If that is the best way I can do that but, there has to be a way to make it and I can not wrap my brain around that process.
</p>
</blockquote>

So normally I don't worry too much about completely different templates. Most sites I've worked on will use one main layout with perhaps just a few variations. The inner content may move from two columns to one column perhaps. To handle cases like that, I simply add new attributes to my custom tag to let me specify which to use, and I try to gauge which layout is used most often and make that the default.

But how would you handle a case where the layout you want is <i>really</i> varied? As always, there are a few things to consider. One simple way is to just use multiple custom tags. So you may have a productlayout.cfm and a reviewlayout.cfm file. This works ok if your file has a hard coded template. I.e., if you always know foo.cfm is a product page, you wrap it with productlayout.cfm. But again - that's hard coded and won't always be appropriate, especially if you want the layout to be chosen by a non-technical user who doesn't want to edit code.

Another possible way of doing this is demonstrated in <a href="http://galleon.riaforge.org">Galleon</a>. For that project I created a layout custom tag that takes a template attribute. The code for this tag is here:

<code>
&lt;!--- Because "template" is a reserved attribute for cfmodule, we allow templatename as well. ---&gt;
&lt;cfif isDefined("attributes.templatename")&gt;
	&lt;cfset attributes.template = attributes.templatename&gt;
&lt;/cfif&gt;
&lt;cfparam name="attributes.template"&gt;
&lt;cfparam name="attributes.title" default=""&gt;

&lt;cfset base = attributes.template&gt;

&lt;cfif thisTag.executionMode is "start"&gt;
	&lt;cfset myFile = base & "_header.cfm"&gt;
&lt;cfelse&gt;
	&lt;cfset myFile = base & "_footer.cfm"&gt;
&lt;/cfif&gt;

&lt;cfinclude template="../pagetemplates/#myFile#"&gt;
</code>

This layout tag takes a templatename or template attribute (I use both since template is reserved in cfmodule). This points to the base file name inside a pagetemplates folder. So if I request templatename="main", the code will either load main_header.cfm or main_footer.cfm based on the execution mode. This lets me do stuff like this:

<code>
&lt;cf_layout template="main"&gt;
...
&lt;/cf_layout&gt;
</code>

Or...

<code>
&lt;cf_layout template="#session.mylayout#"&gt;
...
&lt;/cf_layout&gt;
</code>

Again - this is just one example of how it could be done.