---
layout: post
title: "Ask a Jedi: Strategies for minimizing/customizing resources loaded by a template"
date: "2011-02-15T13:02:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2011/02/15/Ask-a-Jedi-Strategies-for-minimizingcustomizing-resources-loaded-by-a-template
guid: 4123
---

Wow, that's a horribly complex title. Hopefully it makes sense. Anyway, here is the question from reader Doug:

<p/>

<blockquote>
You've covered using custom tags for layout in a couple posts. My struggle is with the head tags.<br/>
<br/>
Say for example, I have 10 different forms in my app, all requiring different jQuery validation scripts. In what manner should I build the head portion of a template to only pull in the specific .js I need?<br/>
<br/>
My current approach just doesn't seem as clean as it could be... I'm cfimporting in a directory of tags, and then including only the ones needed in my head custom tag:<br/>
<br/>
&lt;cf_head&gt;<br/>
&lt;js:jquery&gt;<br/>
&lt;js:validate&gt;<br/>
&lt;js:jqSubmitForm form="verticalForm"&gt;<br/>
&lt;js:jqResetForm&gt;<br/>
&lt;/cf_head&gt;<br/>
<br/><br/>
It works, but each of the 10 form validation scripts is stored separately and then called just for the one form that needs it. I guess since the script truly is unique to that form, there's no way around it.
<br/>
But figured I'd inquire... do you recommend a better approach?
</blockquote>
<!--more-->
<p>

So first off - let me begin by saying that my "custom tag for layout" approach is something I've generally moved away from. Not because I don't like the approach (I think 'wrapping' is one of the few places where custom tags make sense in a modern ColdFusion application), but because I'm generally using a framework that has it's own way of handling layout and page content. (As an aside, I am finding myself using the approach in CFBuilder extensions - but more on that later.) Despite that, there is still a need for this. You could simply include every library your site needs within your main template. But doing so adds unnecessary load and processing to your pages. Does it really matter? Probably not for 99% of our sites, but if we can easily manage what resources (JS frameworks, CSS files) get loaded in a template than there is no reason not too.

<p>

The approach I've taken is actually pretty similar to Doug's. I update my template to allow for flags that indicate which libraries to load. As an example, here is a snippet of code from <a href="http://groups.adobe.com">Adobe Groups</a> (built using ColdFusion 9 and Model-Glue). 

<p>

<code>
&lt;cfset loadmce = event.getValue("loadmce",false)&gt;
&lt;cfset loadrsvp = event.getValue("loadrsvp", false)&gt;
</code>

<p>

For those who don't know Model-Glue, this code allows views to set a value, loadmce, or loadesvp, to indicate JavaScript libraries and code that need to be loaded. In this specific case one is for tinyMCE and one is for RSVP code. I felt that both code blocks were large enough that I did not want to include them in every request. In a custom tag approach, this could simply be:

<p>

<code>
&lt;cfparam name="attributes.loadmce" default="false"&gt;
&lt;cfparam name="attributes.loadrsvp" default="false"&gt;
</code>

<p>

I kept the flags/names a bit generic. I didn't want my views specifying a particular file to load, like tinymce.1.9.js. I felt that by keeping it generic it would both be easier to read and easier to update behind the scenes. 

<p>

On another note - I've also made use of JavaScript in my views as well. As much as I'd like to keep everything with head blocks, I don't always particularly worry about it. If I know that I'm always loading jQuery for example, I've got no qualms about doing this in a view:

<p>

<code>
&lt;script&gt;
$(document).ready(function() {
stuff
});
&lt;/script&gt;
</code>

<p>

JQuery has no issues with multiple blocks like this. I also feel it's better to keep code like this closer to the view. It's worth it to break it out of the head so I can see it closer to the rest of my page layout. (If that doesn't make sense, let me know.)

<p>

So - does this seem like a sensible approach? It's worked for me - but how about others?