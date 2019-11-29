---
layout: post
title: "Watch out for overly vague cfcatch statements"
date: "2007-04-20T11:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/04/20/Watch-out-for-overly-vague-cfcatch-statements
guid: 1971
---

I just helped a client with an issue that I've run into my own code as well, so I thought I'd share this tip with others. My client came to me and said that a particular feature wasn't working. Without getting into too much detail, imagine the code was something like so:

<code>
&lt;cftry&gt;
  &lt;cfdosomething cool&gt;
  &lt;cfcatch&gt;
    Sorry, but I can't do X because X isn't available.
  &lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

In general the code was sensible. The tag he was running could fail and it was out of his control, so he used try/catch to handle it gracefully. 

The problem he had though was that inside his cftry, he had a simple syntax error. His cfcatch caught that error but was obviously not meant to. What to do? 

Don't forget that your CFCATCH object, which represents the error, contains a lot of information, including the nature of the error. What his code should have done was to check and see if the error was truly what he was expecting. What is cool is that there is a nice way to handle all the other errors - just rethrow them! The <a href="http://www.cfquickdocs.com/?getDoc=cfrethrow">cfrethrow</a> tag can be used inside of a cfcatch block to simply tell ColdFusion to recreate the error. It is a way of saying, "I didn't really mean to catch this."

Another way to help narrow down your cfcatch is to simply provide a type argument. This will tell ColdFusion to only handle particular types of exceptions. All others will be ignored. You can even have multiple cfcatch blocks to handle different types of exceptions thrown by the code inside your cftry.