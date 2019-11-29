---
layout: post
title: "Attribute validation error with CFTEXTAREA"
date: "2008-11-05T06:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/05/Attribute-validation-error-with-CFTEXTAREA
guid: 3084
---

Here is an interesting little issue a reader ran into this week. Can you tell me why the following code throws an error?

<code>
&lt;cfform name="foo"&gt;
&lt;cftextarea name="comments" value="Congrats Obama!"&gt;
&lt;/cftextarea&gt;
&lt;/cfform&gt;
</code>
<!--more-->
The error that is thrown is:

<blockquote>
<p>
Attribute validation error for the CFTEXTAREA tag.
<br/><br/>
The value of the VALUE attribute cannot be defined twice. ''
</p>
</blockquote>

Seems rather odd, doesn't it? There is clearly only one value attribute above. But the reader forgot that <i>normally</i>, the value of a textarea is defined between the beginning and end tag, like so:

<code>
&lt;cftextarea name="comments"&gt;
Congrats Obamas!
&lt;/cftextarea&gt;
</code>

Because his code had a line break between the start and end tag, ColdFusion considered that white space to be a value, and threw an error. Personally I think ColdFusion could just do a quick trim() check if it has an value attribute, but the fix is easy enough. You can move the value between the tags as I have before. Or you can remove the line break:

<code>
&lt;cftextarea name="comments" value="Congrats Obama!"&gt;&lt;/cftextarea&gt;
</code>

And lastly, you can just use a shorthand notation for the closing tag:

<code>
&lt;cftextarea name="comments" value="Congrats Obama!" /&gt;
</code>