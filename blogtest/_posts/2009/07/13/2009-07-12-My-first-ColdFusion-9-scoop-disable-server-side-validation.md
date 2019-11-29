---
layout: post
title: "My first ColdFusion 9 scoop - disable server side validation"
date: "2009-07-13T01:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/13/My-first-ColdFusion-9-scoop-disable-server-side-validation
guid: 3434
---

Ok, this isn't a huge deal - it's no ORM or script based CFCs - however, this is something that has bugged me a for a <b>long</b> time and I'm darn happy to see it fixed. As you know, or hopefully know, ColdFusion has long included a simple way to do server side form validation. This was achieved using form fields with certain names. While this feature was.... ok... it wasn't very graceful and no one I knew actually used the feature in production.

However - many people would get tripped up by it. If you accidentally named your form fields wrong, ColdFusion would validate them whether you wanted to or not. You would see a post on CF-Talk about it, folks would mention the feature, the dev would rename his form fields, and life would go on.

Then came Facebook. It's a small social networking site. Maybe you heard of it? One of the ways Facebook's API can integrate with applications is via HTTP POST... and guess what? Facebook uses one of those 'bad' form field names. I mentioned this in my <a href="http://www.adobe.com/devnet/coldfusion/articles/coldfusion_facebook.html">article</a> on Facebook and ColdFusion integration. There <i>is</i> a workaround, but, wouldn't it be nice if you could <b>just turn the darn feature off</b>? Now you can. 

Simple add this new setting within your Application.cfc:

<code>
this.serverSideFormValidation="false";
</code>

And that's it. I recommend this for all ColdFusion 9 sites. Even if you know to avoid the 'special' form field names, a new developer may not, and this simply makes the problem go away.

p.s. You can set it in the cfapplication tag as well, but we've all migrated to Application.cfc, right?