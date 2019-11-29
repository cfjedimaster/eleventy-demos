---
layout: post
title: "Disabling Forms Disabling Autocomplete"
date: "2016-05-04T14:21:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/05/04/disabling-forms-disabling-autocomplete
---

This isn't going to be the most important tip I've ever shared here, but as it is annoys the you know what out of me, I thought I'd share. I fill out a lot of forms, and one of the first things I do on a form is double click in the first field to give autocomplete a chance to fill in as many fields as possible. Unfortunately, sometimes this isn't possible because the site creator, for whatever reason (maybe even a good one) decided to disable this.

<!--more-->

Autocomplete can be disabled at both the form level and the field level. To disable it for the entire form, you would do:

<pre><code class="language-javascript">
&lt;form action="iwantyoutowastetimeenteringcrap" method="post" autocomplete="off"&gt;
</code></pre>

To disable it on a field by field basis, you would simply use the same attribute in the field itself:

<pre><code class="language-javascript">
&lt;input type="text" name="iwantyoutotype" autocomplete="off"&gt;
</code></pre>

As I said, maybe you have a good reason for this. [Wufoo](http://www.wufoo.com) seems to do this by default for their forms. However, this bothers me. I'm seeing it being used in forms that have nothing necessarily private/secure in them and it just annoys me. So here is a 30-second video showing how to quickly get around it in Chrome's Dev Tools. You can do the exact same thing in your browser of choice.

<iframe width="640" height="360" src="https://www.youtube.com/embed/Hc6NYxAmpjc" frameborder="0" allowfullscreen></iframe>

Now if I could only apply autocomplete to all the various medical forms that require me to enter the same information multiple times my life would be complete.

p.s. As another tip - please don't ask for someone's birthday and their age. You don't need both.