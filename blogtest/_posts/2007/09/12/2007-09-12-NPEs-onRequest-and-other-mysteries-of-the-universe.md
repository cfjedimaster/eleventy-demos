---
layout: post
title: "NPEs, onRequest, and other mysteries of the universe..."
date: "2007-09-12T12:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/12/NPEs-onRequest-and-other-mysteries-of-the-universe
guid: 2341
---

A friend wrote to me this morning with an interesting problem. He recently moved his site (hosted at CrystalTech) from ColdFusion 7 to ColdFusion 8. Then he began to get NPEs (Null Pointer Exceptions) in regards to cfquery tags. He would get these about once per 1-2k hits.

But get this - CystalTech recommended adding a blank onRequest:

<code>

 &lt;cffunction
   name = "onRequest"
   access = "public"
   returnType = "boolean"
   output="true"&gt;

   &lt;cfargument
     name = "thePage"
     type = "string"
     required = "true"&gt;

   &lt;cfinclude
     template="#arguments.thePage#"&gt;

   &lt;cfreturn true /&gt;

 &lt;/cffunction&gt; 
</code>

And it worked! He no longer got the NPE error. Now I don't know about you - but I can't imagine any reason why this change would make his error go away. Can anyone else think of a reason why it would help?

As for the NPE in general - one thing I've asked him if is the cfquery was in a CFC and he possibly forgot to var scope. Not that I think it would make a NPE, but the lack of var scoping is something that could lead to random errors like he observed.