---
layout: post
title: "Ask a Jedi: Children custom tags reading data from their parents"
date: "2010-09-15T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/15/Ask-a-Jedi-Children-custom-tags-reading-data-from-their-parents
guid: 3942
---

<a href="http://www.cfcode.net">Chris Peterson</a> hit me up on IM today with the following question. (I've simplified it a bit for the blog post.)

<p />

<blockquote>
I've got a set of custom tags where I'm passing data to the 'wrapper' and I'd like the custom tags inside the wrapper to have access to it. I can make this work by using the Request scope, but that feels wrong. Is there a better way?
</blockquote>

<p/>
<!--more-->
Sure! Let's look at a simple example first. Imagine I've got two custom tags, parent and child, and I can call them like so:

<p/>

<code>
&lt;cf_parent lastname="Camden"&gt;
	&lt;cf_child firstname="Jacob"&gt;
	&lt;cf_child firstname="Lynn"&gt;
	&lt;cf_child firstname="Noah"&gt;
&lt;/cf_parent&gt;
</code>

<p/>

Within the child custom tag, I want to output the name of the child like so:

<p/>

<code>
&lt;cfparam name="attributes.firstname" default="Nameless"&gt;

&lt;cfoutput&gt;
My name is #attributes.firstname#.
&lt;p/&gt;
&lt;/cfoutput&gt;
</code>

<p/>

This works fine and returns the first name of each of the child tags, but how would we get the <i>full</i> name? As Chris says, the Request scope could definitely be used to solve this problem, but there is a much simpler way to do it: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7d72.html">GetBaseTagData()</a>.

<p/>

This function allows you to call any parent custom tag (and not just necessarily the immediate parent) and fetch <b>all</b> of the data in the parent tag. So for example, by adding this one line to child.cfm:

<p/>

<code>
&lt;cfset parentData = getBaseTagData("cf_parent")&gt;
</code>

<p/>

I get a structure that contains any variable or attributes that were created in parent.cfm. If I include this simple line in parent.cfm:

<p/>

<code>
&lt;cfparam name="attributes.lastname" default="Nameless"&gt;
</code>

<p/>

I can then use this modified version of child.cfm:

<p/>

<code>
&lt;cfparam name="attributes.firstname" default="Nameless"&gt;
&lt;cfset parentData = getBaseTagData("cf_parent")&gt;

&lt;cfoutput&gt;
My name is #attributes.firstname# #parentData.attributes.lastname#.
&lt;p/&gt;
&lt;/cfoutput&gt;
</code>

<p/>

I should point out that it is also possible for children tag to share their data with parents. In the past I've done that when the parent tag is the "main" logic for whatever I'm doing and the children tag simply provide metadata. In that form, the children tag simply pass up their info to the parent and the parent makes use of it. If you have even seen me use a custom tag called datatable in my applications, that is an example of it.