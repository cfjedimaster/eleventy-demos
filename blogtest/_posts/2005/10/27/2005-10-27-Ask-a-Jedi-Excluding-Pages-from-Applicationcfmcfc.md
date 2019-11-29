---
layout: post
title: "Ask a Jedi: Excluding Pages from Application.cfm/cfc"
date: "2005-10-27T18:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/27/Ask-a-Jedi-Excluding-Pages-from-Applicationcfmcfc
guid: 876
---

A reader asks:

<blockquote>
Ray, what's a good way to exclude pages from having Application.cfm/.cfc applied to them? Say, for a form that asks the user for an e-mail address if they forgot their password, or a form to register for a site?
</blockquote>

So you can't tell ColdFusion to ignore an Application.cfm/cfc file. You could put your file in a subfolder and then use an empty Application.cfc/cfm. However, I'm guessing you probably don't want to do that. For example - the forgot password functionality will probably require things from your Application.cfc/cfm file. I'm also guessing that you applying security to your site that works something like this pseudo-code:

<code>
onRequestStart {
  if(not logged in) {
     try to log them on if possible
     show login form and abort
  }
}
</code>

This code basically says, if you aren't logged in, force login.cfm to load and stop everything else. This works fine - but if you want a register or "Forgot Password" type page, how do you handle it?

One way around it is to do it all in one file. That's what I do for <a href="http://ray.camdenfamily.com/forums">Galleon</a>. Galleon doesn't force you to login to browse, but you will notice on the <a href="http://ray.camdenfamily.com/forums/login.cfm?ref={% raw %}%2Fforums%{% endraw %}2Findex{% raw %}%2Ecfm%{% endraw %}3F">login page</a> that we support both logging in, registering, and retrieving a lost password. This works for Galleon since the registration is somewhat simple.

Another possibility is to modify your security a bit. Instead of - "Always go to login.cfm if not logged in", your logic could be "Always go to login.cfm if not logged in unless you are at register.cfm". This is a <i>bit</i> of a hack I suppose, but is safe since you are still blocking access to everything except one page. 

To make that a bit more general - let's say you didn't want onRequestStart to do anything for a set of files. You could simply put them in a sub folder - add an Application.cfc that extends the parent, and write a blank onRequestStart. 

As always - I open it up for alternatives. (Although I wish smart people would stop adding comments that are ten times better than mine. What's wrong with you people?? :)