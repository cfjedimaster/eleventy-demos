---
layout: post
title: "Ask a Jedi: Sharing a shopping cart between multiple (related) sites"
date: "2011-11-10T16:11:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2011/11/10/Ask-a-Jedi-Sharing-a-shopping-cart-between-multiple-related-sites
guid: 4428
---

Brian asked:

<blockquote>
We are attempting to have a shopping cart that is shared over multiple domains(www.site1.com,www.site2.com,www.site3.com)

So far I haven't been able to share variables.

Not sure what there is to do and was looking to see if you have something that can at least give me a nudge in the right direction.

Thanks in advance.
</blockquote>
<!--more-->
I can think of a few ways to work around this, but let me propose one and see how badly the idea gets torn apart by my readers (and yes, that's an invitation, please share your ideas!). I spoke with Brian and confirmed that even though the sites are unique, they are all one machine. (Technically multiple machines in a cluster, but for all intents and purposes, one machine.) Given that they all share the same network, I think you can look at a solution that uses one database as the primary holder of the cart. So let's assume we have three sites:

<ul>
<li>alpha.org
<li>beta.org
<li>gamma.org
</ul>

(Note - I have no idea what those sites may actually be in real life. If you visit them and discover some new level of perversity heretofore unknown to you... sorry.) 

Now let's assume we have one unique way of identifying you on all three sites. Most likely this would be an email address. Given that I'm foo@foo.com no matter where I'm at on the Internet, we could use my email address on all three sites as a way to uniquely identify me.

Given the assumptions so far, all three sites could query one database to fetch cart records for the email address. This would allow adding, editing, viewing, etc all to occur and "just" work across all three sites, again assuming that you are logged in. Even if not logged in, if you shop on alpha.org, pop over to beta and <i>then</i> log in, it should be able to restore your cart.

I think this will work fine. There are some caveats of course. I can go to beta.org and register as someone else's email address. If you don't do a followup email verification, then you will never know that foo@foo.com on alpha is not the same as in beta. It's also possible that folks may simply stop using an address. foo@apple.com may be let go. The new foo@apple.com may then go register on beta.org. I think though in that case you would want to use the same login system across all sites. That way you could also use the existing email address if you had the password. It would be annoying to the new guy, but at worse he can use an alternate email address.

Any thoughts on this technique?