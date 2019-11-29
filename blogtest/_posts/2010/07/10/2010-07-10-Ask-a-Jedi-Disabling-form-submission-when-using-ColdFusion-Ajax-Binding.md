---
layout: post
title: "Ask a Jedi: Disabling form submission when using ColdFusion Ajax Binding"
date: "2010-07-10T19:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/10/Ask-a-Jedi-Disabling-form-submission-when-using-ColdFusion-Ajax-Binding
guid: 3874
---

<b>Be sure to read the update at the bottom of the post.</b>
<p>
Art de Noise asked:
<p>
<blockquote>
I have a simple cfdiv bound to text input box that does a search. It works fine if I tab out of the input box (and fails if I hit the return key. I have tried different events on the bind and tried some Javascripts that sought to have the return key emulate the tab key, all to no avail.
Any idea why the tab key succeeds with the bind and the return key aborts?
</blockquote>
</p>
<!--more-->
I definitely have an idea. Let's start with a simple example though so we are on the same page.
<p>
<code>
&lt;form method="post"&gt;
&lt;input name="testvalue"&gt;
&lt;/form&gt;

&lt;cfdiv bind="url:test3.cfm?key={% raw %}{testvalue}{% endraw %}" /&gt;

&lt;cfdump var="#form#" label="Form in main view"&gt;
</code>
<p>

This is my main template. It's got  form that we will use for binding. The div points to a URL and uses the bind pointing to the testvalue field. I won't bother showing the code for test3.cfm. For my demo all it did was a quick cfdump on the URL scope. This helped me test. Notice the dump of the form scope. This is going to help ensure we see the problem Art was talking about. Sometimes when working locally the response of your page can be so quick you don't notice it. This dump will help ensure I don't miss it.

<p>

So given that code, if you type something in the field and hit the tab key, or just plain click, then you will immediately see the div load up the value and the dump will reflect it:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-07-10 at 6.00.06 PM.png" />

<p>

But if I change the value and hit enter, I get:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-07-10 at 6.01.19 PM.png" />

<p>

The enter key submitted the form. Not desirable at all, but the natural behavior. Luckily it is pretty easy to fix. Just kill the form submit action!

<p>

<code>
&lt;form method="post" onSubmit="return false"&gt;
</code>

<p>

This still allows the bind to detect the change but prevents the form from being submitted.

<p>

<b>EDIT JULY 12:</b> Guess what? The code above doesn't work in IE8. The form submission <i>is</i> blocked, but it also appears to block the 'blur' event for the field. I tried the following and it worked everywhere:

<p>

<code>
&lt;form method="post" onSubmit="window.focus();return false;"&gt;
</code>

<p>

Basically I just force focus back to the window.