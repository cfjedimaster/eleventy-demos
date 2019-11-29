---
layout: post
title: "Friday Puzzler - Getting even with Bob"
date: "2007-03-30T08:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/30/Friday-Puzzler-Getting-even-with-Bob
guid: 1932
---

For today's Friday Puzzler (remember those?), I'm going to describe a hypothetical situation that will be - unfortunately - a bit too familiar for most readers. You are a worker at MegaCorp Web, a large web design firm in greater Podunk. One of the banes of your existence is Bob. Bob is your cube mate. Bob loves to point out each and every little mistake on your web application, even in the middle of development. So it's time to get medieval on Bob and teach him a lesson.
<!--more-->
Your task is to write a UDF that will take in a string of HTML. You will then find 10-15 random words that are not inside HTML tags. The words can be wrapped by tags of course, so the words in this block is fine:

<code>
&lt;b&gt;Hendrix is a Cylon&lt;/b&gt;
</code>

For each word, you will then remove 1-3 random letters and replace it into the original HTML string.

What's going to make this so nice is how you would use this UDF in our hypothetical situation. As you know, Application.cfc's onRequest method can actually modify a request before it is returned to the user. What we would do is simply say:

<code>
&lt;cfif session.username is "bob"&gt;
  &lt;cfset newresult = confusinator(result)&gt;
  &lt;cfoutput&gt;#newresult#&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

Then just sit back and grin as Bob is unable to replicate the bugs on your machine. 

Ok guys. Get to it. Let's teach Bob to leave well enough alone. 

p.s. In case it isn't clear, you just need to build the UDF. Don't worry about Application.cfc and all that. If you want to build a simple form to let folks type in a URL and see the results, you get bonus points. 2 trillion bonus points will buy you nothing, but Web 2.0 Nothing.