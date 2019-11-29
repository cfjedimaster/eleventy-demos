---
layout: post
title: "Ask a Jedi: cfdiv, cfform, cflayout and selecting tabs - also a new bug?"
date: "2009-01-09T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/09/Ask-a-Jedi-cfdiv-cfform-cflayout-and-selecting-tabs-also-a-new-bug
guid: 3186
---

Patrick asks:

<blockquote>
Quick question (i think). I have this CFDIV with a form on it. When I submit this form I want it to go to another page (within the cfdiv) that has a cf tab layout on it, and based on whatever they select on the form I would like that tab to be selected when hitting the cf tab layout on the new page after they submit the form. Any ideas on how I could accomplish this, my attempts have failed. Thanks.
</blockquote>

Let's break this down a bit.
<!--more-->
First off, when inside a cfdiv (or pod, window, layoutarea), you can automatically keep the form post inside the container by using cfform. So consider these two simple files. First, my root test file:

<code>
&lt;cfajaximport tags="cfform,cflayout-tab"&gt;

&lt;h2&gt;Headers for the Win&lt;/h2&gt;

&lt;cfdiv bind="url:test3.cfm" /&gt;

&lt;h2&gt;Footers for the Win&lt;/h2&gt;
</code>

And then test3.cfm:

<code>
&lt;cfform action="test2.cfm" method="post"&gt;
	&lt;cfinput type="submit" name="doit1" value="Do One"&gt;
	&lt;cfinput type="submit" name="doit2" value="Do Two"&gt;
	&lt;cfinput type="submit" name="doit3" value="Do Three"&gt;
&lt;/cfform&gt;
</code>

Nothing too complex here. (I'll explain the button names in a sec.) This will load a page with a div where CF's Ajax code will automatically load in test2.cfm. Because I used cfform, the post will stay within the div context. Now I need to build a page that creates tabs and automatically selects the right one. This too is rather trivial.

<code>
&lt;cfset t1Selected = false&gt;
&lt;cfset t2Selected = false&gt;
&lt;cfset t3Selected = false&gt;

&lt;cfif structKeyExists(form, "doit1")&gt;
	&lt;cfset t1Selected = true&gt; 
&lt;cfelseif structKeyExists(form, "doit2")&gt;
	&lt;cfset t2Selected = true&gt;
&lt;cfelse&gt;
	&lt;cfset t3Selected = true&gt;
&lt;/cfif&gt;

&lt;cflayout type="tab"&gt;
	&lt;cflayoutarea title="Tab1" selected="#t1Selected#" /&gt;
	&lt;cflayoutarea title="Tab2" selected="#t2Selected#" /&gt;
	&lt;cflayoutarea title="Tab3" selected="#t3Selected#" /&gt;
&lt;/cflayout&gt;
</code>

As you can see, I simply set state values for each tab to false and then check my form scope to see which value was passed. I say trivial, but when working on this I ran into two odd bugs.

First off, my form initially had buttons with a name of action. When I did that, the form post failed due to some odd JavaScript error. It seems as if you cannot use a form field named ACTION within a form that will be 'ajax posted' within cfform. So I changed all 3 buttons to "doit". Since the value was different, I should get form.doit equal to whatever button you push, right? Wrong. No matter what I pushed, the value was equal to all three values appended together in a list. Hence the switch to doit1, doit2, doit3. I assume again that this is just a quirk of CF's automatic "keep it inside" logic for cfform within containers.