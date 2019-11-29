---
layout: post
title: "Ask a Jedi: Flash Forms and PreserveData"
date: "2005-12-07T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/07/Ask-a-Jedi-Flash-Forms-and-PreserveData
guid: 955
---

Jimmy has an interesting problem with Flash Forms:

<blockquote>
&lt;cfform name="myForm" format="flash" height="476" width="700" skin="haloSilver" timeout="60" preservedata="yes"&gt;

I'm using this cfform tag on both the form I'm coming from and the form I'm going to and when I click a submit button to go to the second form and click back the data I entered in the first form is missing. Why isn't it holding the data?
</blockquote>

PreserveData simply means, when I reload the form <u>after a submission</u>, preserve the items that were in the form fields. You are not submitting the form, but rather reloading it by hitting the back button. When you hit back, one of two things happen. Either your browser loads the data from cache or the URL is re-downloaded from the server. In either case, the form data you had typed in won't exist anymore. 

This is what I suggest if you are building a form that covers multiple steps. Actually I have two suggestions. If you are using Flash Forms, why not considering just having one form - but use tabs or accordions to separate the forms? If you can't do that - you can store the form information for "Form1" into the session scope. Then default the form fields to the session variables if they exist. If you do that, however, you need to make sure you don't let the page get cached. You can do that with the right cfheader tags.