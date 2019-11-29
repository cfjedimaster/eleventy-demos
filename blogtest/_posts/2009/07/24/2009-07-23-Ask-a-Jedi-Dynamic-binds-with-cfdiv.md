---
layout: post
title: "Ask a Jedi: Dynamic binds with cfdiv?"
date: "2009-07-24T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/24/Ask-a-Jedi-Dynamic-binds-with-cfdiv
guid: 3462
---

This was one of those perfect questions - and by perfect I mean that the reader sent the question in, and then figured it out before I even had a chance to reply. I cannot tell you how often that happens to me. It's like magic. You search for an answer - give up - ask a public group (or person) and immediately the answer becomes apparent. Anyway - here was Brian's question:

<blockquote>
Quick question:  Can the bind value in the CFDIV tag bedynamic (or variable-ized), or does it have to be hard-coded?

Looking at the ease of update between development and production for something like:

cfdiv bind="cfc:development.controller.function({% raw %}{kevvalue}{% endraw %})

versus

cfdiv bind="cfc:production.controller.function({% raw %}{kevvalue}{% endraw %})

</blockquote>
<!--more-->
As you can see, he just wants to make it easy to swap between two paths to a component. Now looking at that, I'd probably consider using one mapping, but simply making the physical path different. With dynamic mappings in ColdFusion 8, that becomes fairly trivial. But outside of that - as Brian found - yes, you certainly plugin a variable:

<code>
&lt;cfdiv bind="cfc:#root#.controller.function{% raw %}{keyval}{% endraw %})"&gt;
</code>

This is probably obvious, but it's not something I had tried myself, so I'm happy Brian shared this with me.