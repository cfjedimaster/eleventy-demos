---
layout: post
title: "When is it proper to try/catch versus global exception handling?"
date: "2011-05-26T19:05:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2011/05/26/When-is-it-proper-to-trycatch-versus-global-exception-handling
guid: 4250
---

Earlier today Seth (@CapedCoder) mentioned something on Twitter that I thought was a bit odd. He was looking for a way to disable try/catch functionality for dev versus production. Basically, "Don't try/catch in dev." This led to a few emails back and forth where I made the assertion that I thought he was using try/catch wrong. Not being the end all of things - and knowing I have smart people here - <b><i>and</i></b> knowing that this question was bigger than ColdFusion, I thought it would be a great topic of conversation for the blog. So - let's get to it.
<!--more-->
<p>

First off - technically - there is no real way to just disable try/catch. You could, though, do something like this:

<p>

<code>
&lt;cftry&gt;
  &lt;cfset makeLemonadeOutofCrap()&gt;
  &lt;cfcatch&gt;
     &lt;cfif application.isDev&gt;
        &lt;cfrethrow&gt;
     &lt;/cfif&gt;
     Sorry - unable to perform this action.
   &lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

<p>

It requires more work than simply "disabling" cftry, but it does fit the bill for the request. However, I think this is bad approach and I think it comes down to the cases where we need global exception handling (via cferror, onError, etc) versus try/catch. In my mind, they are two very different things:

<p>

<ul>
<li>Try/Catch should be used in cases where you expect an error and have no possible way to work around it. Your code basically says, "There is no way I can possibly know this is going to run safe, and I expect it mail fail, so please be ready for an error."
<li>On the flip side, Global Error handling is for the <i>unexpected</i> error. It's the side cases you didn't test for. (You did test, right?) It's the guy messing with URL parameters trying to force an error. 
</ul>

<p>

In the try/catch scenario, you expect an error and should/could handle the error in a nice way. But as it is expected, why would you do anything different for development versus production? You certainly wouldn't want to force a new exception as that's not how your application runs in production, and in general, you want things to be as similar as possible. 

<p>

I really thought I had a bit more to say here - but I think I'm out of ideas. Mainly his approach just "felt" wrong, but I'd love to hear what others think. And again - I don't see this as a ColdFusion question at all. I'd assume you could apply the same thinking to PHP, Ruby, etc.