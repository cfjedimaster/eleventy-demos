---
layout: post
title: "ColdFusion and Unscoped Variables"
date: "2011-01-26T22:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/01/26/ColdFusion-and-Unscoped-Variables
guid: 4095
---

Chris asked:

<p/>

<blockquote>
Recently I had to outsource some CF work as I was under the gun and buried in deadlines.  I noticed something in the programmer's code that I had never tried before and never new was possible.  What I am looking for is the validity in actually doing it.
<br/><br/>
The page a was a simple search results form.  It took in the search query from either a form using the post method or a url link.  However the programmer used code such as this ..
<br/><br/>
&lt;cfparam name="town" default=""&gt;<br/>
&lt;cfparam name="city" default=""&gt;
<br/><br/>
and then queried using a simple SELECT * WHERE town='#town#' OR city='#city#'
<br/><br/>
My question is this - what are the good bads and uglies of using the variable as is and not going through the usual
<br/><br/>
&lt;cfparam name="url.town" default=""&gt;<br/>
&lt;cfparam name="url.city" default=""&gt;<br/>
&lt;cfparam name="form.town" default=""&gt;<br/>
&lt;cfparam name="form.city" default=""&gt;<br/>
<br/><br/>
blah blah blah.
<br/><br/>
Should I use the seemingly easier way?  I like it for sure.  But will it bring the dark side down upon my site?
</blockquote>
<!--more-->
<p/>

There's a couple of things going on here but I'd like to begin by pointing one thing out. It's a bit off topic from the rest of the conversation but it's probably more important. In your example query you used:

<p/>

<code>
SELECT * WHERE town='#town#' OR city='#city#'
</code>

<p/>

This may have just been Chris writing something quick in an email, but if it really is the code being used then the 'bare' variables need to replaced with cfqueryparam tags as soon as possible. Again - I'm hoping that was just for the email and not the real code - but every time I see SQL like this I speak out. Ok, so let's move on.

<p/>

What you are seeing is 100% documented expected ColdFusion behavior. When ColdFusion encounters a variable and the scope is not defined, it checks a predefined list of scopes in order to find the variable. From the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec09af4-7fdf.html">documentation</a>:

<p/>

<blockquote>
If you use a variable name without a scope prefix, ColdFusion checks the scopes in the following order to find the variable:
<br/><br/>
Local (function-local, UDFs and CFCs only)<br/>
Arguments<br/>
Thread local (inside threads only)<br/>
Query (not a true scope; variables in query loops)<br/>
Thread<br/>
Variables<br/>
CGI<br/>
Cffile<br/>
URL<br/>
Form<br/>
Cookie<br/>
Client<br/>
</blockquote>

<p/>

And then immediately after the docs go on to say:

<p/>

<blockquote>
Because ColdFusion must search for variables when you do not specify the scope, you can improve performance by specifying the scope for all variables.
</blockquote>

<p/>

I think right there you will find the main reason people don't use unscoped variables. However, I'd probably say the performance penalty is not going to matter for 99.99% of us. In fact, I typically leave the scope off of Variables scoped variables. 

<p/>

I'd say the other reason folks avoid non-scoping (is that even a word/phrase?) is for security reasons. Imagine the following example. (Note - I'm writing this off the top of my head so pardon any typos.)

<p/>

<code>
&lt;h2&gt;Search Page&lt;/h2&gt;

&lt;cfif isDefined("search")&gt;
You searched for &lt;cfoutput&gt;#search#&lt;/cfoutput&gt;
&lt;/cfif&gt;

&lt;cfset results = mycfc.search(search)&gt;
&lt;cfoutput query="results"&gt;
etc
&lt;/cfoutput&gt;
</code>

<p/>

So note the search variable. You expect this to be form or URL. ColdFusion checks the URL scope first. I could create a link that includes HTML and possibly script elements and send that link to you so that when you click it, you see my 'bad stuff' within the context of the page itself. Changing the code to a more specific form.search or url.search can help prevent this type of issue. 

<p/>

I hope this helps. By the way, while looking for the docs on the order of scope look up, I noticed these two pages that I thought were darn good examples of ColdFusion scopes. I recommend reviewing these or sharing them with new coders. They do a great job of enumerating and describing <i>all</i> of the scopes.

<p/>

<a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec09af4-7ff1.html">Scope Types</a><br/>
<a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec22c24-7fd0.html">Creating and using variables in scopes</a>