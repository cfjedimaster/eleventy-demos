---
layout: post
title: "Quick Tip: Dealing with Freaky Facebook Form Fields"
date: "2009-12-09T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/09/Quick-Tip-Dealing-with-Freaky-Facebook-Form-Fields
guid: 3639
---

A user working on a Facebook application ran into an interesting problem this morning. Form data was being sent to his server with field names that included a bracket. So instead of a simple form.foo variable, he was sent form.foo[]. When he attempted to make use of the field...

<code>
&lt;cfoutput&gt;
#form.foo[]#
&lt;/cfoutput&gt;
</code>

ColdFusion threw an error. No big surprise there. The solution though is to simply treat the form as a structure:

<code>
&lt;cfoutput&gt;
#form["foo[]"]#
&lt;/cfoutput&gt;
</code>

If you wanted to copy the values you can use:

<code>
&lt;cfset saneList = form["foo[]"]&gt;
</code>

You get the idea. 

By the way, I will use this opportunity to remind people of <i>another</i> Facebook issue, and that's with the use of form fields that turn on ColdFusion's ancient automatic form handling. I discuss a workaround <a href="http://www.adobe.com/devnet/coldfusion/articles/coldfusion_facebook_03.html">here</a>, but you should remember that ColdFusion 9 now includes a fix for this behavior. Simply include this.serversideformvalidation=false in your Application.cfc. To be clear, it doesn't turn off any server side validation <b>you</b> write. It simply disables the old automatic validation that no one uses (except when they accidentally run into it).