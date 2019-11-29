---
layout: post
title: "Quick tip - using cfthrow as a reminder"
date: "2012-01-18T21:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/01/18/Quick-tip-using-cfthrow-as-a-reminder
guid: 4499
---

I just typed this code in and I thought I'd share it to see if I was the only one who did this.

<p/>

I'm working on a process where I need to do one of two things. Tonight I'm working on the first branch, but the second branch may not be worked on for a while. In the past I'd do something like so normally:

<p/>

<code>
&lt;cfif condition&gt;
  what I'm doing
&lt;cfelse&gt;
&lt;/cfif&gt;
</code>

<p/>

If I was half-way awake, I'd maybe even do this:

<p/>


<code>
&lt;cfif condition&gt;
  what I'm doing
&lt;cfelse&gt;
  &lt;!--- do the other thing ---&gt;
&lt;/cfif&gt;
</code>

<p/>

That works, but lately, I've been using cfthrow. The point being that if I forgot to actually code the other block, the second it does being to fire, I can't ignore it. 

<p/>


<code>
&lt;cfif condition&gt;
  what I'm doing
&lt;cfelse&gt;
  &lt;cfthrow message="Implement this block"&gt;
&lt;/cfif&gt;
</code>

<p/>

Anyone else do this?