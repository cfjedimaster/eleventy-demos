---
layout: post
title: "Model-Glue Tip - Marking an event private"
date: "2007-02-26T06:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/26/ModelGlue-Tip-Marking-an-event-private
guid: 1860
---

Here is a little something I tend to forget that Model-Glue supports. If you mark an event as private, it cannot be accessed via the URL. So consider:

<code>
&lt;event-handler name="revealA51"&gt;
  &lt;broadcasts&gt;
    &lt;message name="getSecrets" /&gt;
  &lt;/broadcasts&gt;
  &lt;views&gt;
    &lt;include name="body" template="page.a51doesntexist.cfm" /&gt;
  &lt;/views&gt;
&lt;/event-handler&gt;
</code>

To load this event via the URL, you would simple go to a URL like so:

<blockquote>http://www.usaf.mil/index.cf?event=revealA51</blockquote>

However, you can block this by simply adding access="private" to the XML:

<code>
&lt;event-handler name="revealA51" access="private"&gt;
  &lt;broadcasts&gt;
    &lt;message name="getSecrets" /&gt;
  &lt;/broadcasts&gt;
  &lt;views&gt;
    &lt;include name="body" template="page.a51doesntexist.cfm" /&gt;
  &lt;/views&gt;
&lt;/event-handler&gt;
</code>