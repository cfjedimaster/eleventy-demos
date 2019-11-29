---
layout: post
title: "Ask a Jedi: Caching LDAP Results"
date: "2005-11-14T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/14/Ask-a-Jedi-Caching-LDAP-Results
guid: 914
---

A user asks:

<blockquote>
Is there a way I can cache cfldap query and how? I am running a cfldap query and it is taking too log. Can I use cfcache or there is a drawback to that?
</blockquote>

There are a coulple of answers to this. First off, yes, you could use cfcache, and yes, there are drawbacks. If your LDAP query is session based, cfcache won't work for you since it is URL variable-based. The same applies if your query is form-based. If that isn't a problem for you, than cfcache will work great and will take all of one second to add.

Do not forget that you can also cache the results yourself. All you need to do is stuff the results in a persistent scope like Application, Server, or Session. The following pseudo-code shows an example:

<code>
&lt;cfif not structKeyExists(application, "myldapquery")&gt;
  run the ldap query and name it application.myldapquery
&lt;/cfif&gt;
use application.myldapquery
</code>

Obviously this technique works for <i>any</i> slow process yo may have. If you don't need to run it again, just store the results. What is nice is that you can also remove the cache easily enough by just using structDelete.

Lastly - the number one thing you should do before just caching - check to make sure there isn't something you can do to speed up that LDAP query. To be honest, I've rarely used LDAP, but if it was a normal query, I'd play around a bit with my sql and look into ways I can make it more efficient. Caching should only be used when you have exhausted every other attempt to speed up the code.