---
layout: post
title: "Ask a Jedi: Restricting CFAJAXProxy to certain methods"
date: "2007-10-18T17:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/18/Ask-a-Jedi-Restricting-CFAJAXProxy-to-certain-methods
guid: 2423
---

A user asked this about the cfajaxproxy tag:

<blockquote>
Any way around CFAJAXProxy exposing all remote component functions to JavaScript? To elaborate, I have a component with x remote functions. A particular page call requires only one of these remote functions. I'd like CFAJAXproxy to expose only the required functions. 
</blockquote>

When I first read this - I was a bit confused. Why expose a method as remote if you didn't want it - well - remote? Turns out he was using one CFC for his public facing site as well as his Admin. 

So the short answer is that there is no way to tell cfajaxproxy to just expose certain methods. The long answer is that there are multiple ways around this.

First off - don't forget that when your browser makes an Ajax-based call, it is just like a "normal" call. This means the Ajax call shares your session. So if your CFC methods had session based security of some type, or roles-based security, then you need not worry. 

The other possibly way to handle this is to take all those methods and make them access="public" instead of remote. Then build a public facing CFC that has access to the CFC methods it needs. Another CFC would then handle accessing the other methods. You still need to secure the methods though. Do not assume that someone won't guess at the location of the admin CFC.

But at least with the second method - you have one core CFC with the logic - and your "proxy" cfcs simply handle security and handling off the calls to the core CFC.

By the way, the user said he suggested to Adobe that they extend the cfajaxproxy to support this. Here is what he suggested:

<code>
&lt;cfajaxproxy cfc="cfc.widgets" jsclassname="widgetFactory" exposeTheseMethods="Widget1,Widget2,Widget3" OmitTheseMethods="SecretWidget"&gt; 
</code>

I'm not so sure I like this. It may give you a false sense of security. If secretwidget was method="remote", then you still have a possible security hole if someone can guess at the method name. 

And lastly - I still say cfajaxproxy is the coolest tag in ColdFusion since cfdump. Anyone using it in production yet?