---
layout: post
title: "The Complete Guide to Adding Error Handling to Your ColdFusion Application"
date: "2007-12-05T15:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/12/05/the-complete-guide-to-adding-error-handling-to-your-coldfusion-application
guid: 2517
---

I've done more than a few posts recently about error handling and robust exception information, so I thought I'd write up one blog entry that can serve as a nice guide for folks to bookmark. By using "Complete" in the title, I've also virtually assured that I will forget something critical, so please, send suggestions for what I've missed. Let's get started.
<!--more-->
What is the point of this guide? Unless you are a perfect code, there is a chance that your ColdFusion application will have errors in it. The question is - what are you doing with your errors? What was the last error that occurred on your site? If I asked you how many errors your site threw yesterday, could you answer with 100% complete accuracy? I'd be willing to bet most people would say no. Shoot, I know I couldn't answer that. So what do we do to help resolve this issue?

The first thing I want you to do is to create an error. Create a new CFM file named errortest.cfm. Insert one line into it:

<pre><code class="language-markup">
&lt;cfoutput&gt;#xfhdshsdhj#&lt;/cfoutput&gt;
</code></pre>

The point of this template is to create an error. Unless you actually have a variable defined with that ugly name, the template will error out. Upload it to your server and run it with your browser.

One of three things will happen:

1) You will get an error with the full path shown, like below. This shows that you have not added error management to your application, and that you have Enabled Robust Exception information in your ColdFusion Administrator. Stop reading this blog entry, go to your Admin, and disable it. Now. (Please note that this guide is intended for a production machine environment. Obviously you can keep this setting on in development. I do.)

<img src="https://static.raymondcamden.com/images/cfjedi/eshot1.png">

2) You will get an error with no path shown. This is slightly better. It still shows that you haven't added error management to your application though.

<img src="https://static.raymondcamden.com/images/cfjedi/eshow2.png">

3) You get an "error page". By "error page" I mean a page saying that an error occurred, but displayed in your standard site layout, or close to it. That's good. You should still continue to read though as I'm going to discuss things that should normally be in an error handler.

Ok, before going on - delete the page you just uploaded. I'd be willing to bet a good 40-50% of us upload test.cfm type files to our servers and forget to delete them. I've never done that. Really. 

So - lets talk error handling now. You have two high level options. The first is to set an error template in the ColdFusion administrator:

<img src="https://static.raymondcamden.com/images/cfjedi/eshot3.png">

If you specify a template here, than ColdFusion will run the template when an error occurs. In general though I wouldn't recommend setting the template here. 

Your second option - and what I recommend - is to the handle the errors specifically in your application. How? If you are on an older ColdFusion server and only have access to Application.cfm, then you want to the use the CFERROR tag. You <i>can</i> use these tags in Application.cfc as well, but I recommend onError for that. I'm going to cover both though.

A full description of cferror may be found in the <a href="http://www.cfquickdocs.com/cf8/?getDoc=cferror">docs</a>. I'm going to give you the Ray Camden quickie guide to it. The cferror basically lets you specify an template to run when a type of error occurs. There are 3 main types of errors it monitors: Exception, Request, and Validation. Forget about validation. Don't use it. Exception is the type of error we are most familiar with. It is what I call the 'basic' error. Request is the more serious error. It can occur when your error handler itself screws up. I call this the "Oh S***" error (seriously). It has special restrictions on it I'll discuss in a second. First though, let's look at the syntax you would use in your Application.cfm file:

<pre><code class="language-markup">
&lt;cfapplication name="rayrules"&gt;

&lt;cferror type="exception" template="error.cfm"&gt;
&lt;cferror type="request" template="error_request.cfm"&gt;
</code></pre>

As you can see - it's pretty simple stuff. I basically said - for the Exception (again, think 'normal' error), run error.cfm. For the Oh Crap error, run error_request.cfm.

If you run any CFM again - you will immediately get an error stating that these files do not exist. You should create blank ones for the time being.

Now for the details. The error.cfm template is a normal CFM page. But it has access to a special variable: ERROR. This variable is a structure that contains a lot of information about the error. What you get there will also depend on the error. SQL errors for example will have different values in the structure than a simple runtime error. Let's just do a quick dump. 

<pre><code class="language-markup">
&lt;cfdump var="#error#"&gt;
</code></pre>

If you run your error test again (you may have to reupload it if you deleted it like I suggested, just don't forget to remove it later!), you will see something like this:

<img src="https://static.raymondcamden.com/images/cfjedi/eshot4.png">

I'm not going to list every field - again, check the <a href="http://www.cfquickdocs.com/cf8/?getDoc=cferror">cferror syntax doc</a> for that. The item you will most care about normal is cferror.message. This is the simplest representation of the error and will be most useful for logging. The diagnostics value gives more detail including a line number which is handy during development.

So what now? Well first off - you probably don't want your public site showing a dump. Let's begin by outputting a nice message to the user. Here is the new version of error.cfm:

<pre><code class="language-markup">
We are so sorry. Something went wrong. We are working on it now.
</code></pre>

Obviously you can mark that up with nice HTML, use your custom tag layout wrapper, etc. This handles letting the user know something bad happened. At bare minimum, this is better than showing naked errors to the user, but we should do something with the error. I recommend two things.

<b>Log the error.</b> For some odd reason, ColdFusion will nicely log an unhandled error, but will not log a handled error. I believe Blue Dragon logs the error anyway. Since ColdFusion won't log it, we should:

<pre><code class="language-markup">
&lt;cflog file="myapperrorlog" text="#error.message# - #error.diagnostics#"&gt;
</code></pre>

Note that I've specified the message and diagnostics variable. This is a bit of a duplication since diagnostics information will have the same information as message, but I like the shortness of the message value. You could log more than this obviously, but since this is a log file, we don't want to overdue it here. 

The next thing we should do is email the error. This is something I've covered before on the blog, so some of you may know my feelings on this already, but what I typically do is email me the entire error structure. I also include other structures so I can see what else was going on:

<pre><code class="language-markup">
&lt;cfsavecontent variable="errortext"&gt;
&lt;cfoutput&gt;
An error occurred: http://#cgi.server_name##cgi.script_name#?#cgi.query_string#&lt;br /&gt;
Time: #dateFormat(now(), "short")# #timeFormat(now(), "short")#&lt;br /&gt;

&lt;cfdump var="#error#" label="Error"&gt;
&lt;cfdump var="#form#" label="Form"&gt;
&lt;cfdump var="#url#" label="URL"&gt;

&lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;


&lt;cfmail to="bugs@myproject.com" from="root@myproject.com" subject="Error: #error.message#" type="html"&gt;
	#errortext#
&lt;/cfmail&gt;
</code></pre>

I create my message within a cfsavecontent (more on why in a second), and then mail it. Don't forget the type=html. Now as you can guess, this creates a pretty big email. If you get a 1000 of these, you will be suffering, but consider it incentive to fix the darn bug ASAP. You could also add a dump of the session scope if you wanted, or CGI. Basically, it is better to send more information then you need then to be wanting for more. Having all this detail gives you a better idea of what is going on when the error occurred.

So why the cfsavecontent? One trick I'll often do is to skip the email if I'm currently logged in as an admin on the site. I'll do a quick check, and if I'm an admin, I'll display the error on screen. This lets me see the error more quickly than waiting for an email. 

So all together now, here is the error.cfm file:

<pre><code class="language-markup">
We are so sorry. Something went wrong. We are working on it now.

&lt;cflog file="myapperrorlog" text="#error.message# - #error.diagnostics#"&gt;

&lt;cfsavecontent variable="errortext"&gt;
&lt;cfoutput&gt;
An error occurred: http://#cgi.server_name##cgi.script_name#?#cgi.query_string#&lt;br /&gt;
Time: #dateFormat(now(), "short")# #timeFormat(now(), "short")#&lt;br /&gt;

&lt;cfdump var="#error#" label="Error"&gt;
&lt;cfdump var="#form#" label="Form"&gt;
&lt;cfdump var="#url#" label="URL"&gt;

&lt;/cfoutput&gt;
&lt;/cfsavecontent&gt;


&lt;cfmail to="bugs@myproject.com" from="root@myproject.com" subject="Error: #error.message#" type="html"&gt;
	#errortext#
&lt;/cfmail&gt;
</code></pre>

Now for fun, try modifying your error.cfm. Change the first cfdump tag to a cfpoo tag. If you rerun your template, you will see a blank page. Remember that we created a blank error_request.cfm file earlier? This is what is running now. Basically, ColdFusion has noticed that we had an error, and then our error management had an error, and it's thrown it's hands up in the air and given up. We are now in the request template. The request template has special rules - the most important being - no CFML. That's right - you can't cflog. You can't email the error. You can - however - output error variables. You don't use cfoutput, you just include them. Consider this sample:

<pre><code class="language-markup">
This went wrong: #error.diagnostics#
</code></pre>

This will display:

<blockquote>
This went wrong: Unknown tag: cfpoo. ColdFusion cannot determine how to process the tag cfpoo because the tag is unknown and not in any imported tag libraries. The tag name might be misspelled.
The error occurred on line -1. 
</blockquote>

That's all you can do really. But guess what - I wouldn't do that. Remember - we don't want to reveal any sensitive information to our users, including what caused an error. So what do I recommend? 

Go to your site and view source. This will give you the HTML result of one of your pages. Find the content and replace it with a "We're sorry" type message like we used in error.cfm. Then save that HTML. Basically you are creating a static page. This means that if you change your layout, you have to regenerate your error_request.cfm page. Of course, you could just not use any layout at all, but most people want their pages to have a standard look and feel. 

Unfortunately, nothing is logged when this error happens. So what can you do? One thing to consider is checking the web server log files to see when the file is run. If you see it running often, then double check your error.cfm file for possible errors. If worse comes to worse, temporarily wrap your error.cfm itself in a try/catch and see what shows up when you dump cfcatch. I'm open to suggestions here - but there is a reason they (ok, I) call this the "Oh Crap" error.

Ok, so I've covered quite a bit of information here, but it applies to Application.cfm and CFERROR. What if you are using Application.cfc? Well one thing to remember is that you can just as easily put CFERROR tags inside your Application.cfc file. That is allowed, and I've done that before. But what if you want to use the onError method?

In general - a lot of what I said about the Exception type for CFERROR applies here. You want to present a nice message to your user. You want to log the error. You want to email the error to yourself. But there are some subtle differences.

Consider this very simple onError:

<pre><code class="language-markup">
&lt;cffunction name="onError" returnType="void" output="true"&gt;
	&lt;cfargument name="exception" required="true"&gt;
	&lt;cfargument name="eventname" type="string" required="true"&gt;
	&lt;cfdump var="#arguments#"&gt;&lt;cfabort&gt;
&lt;/cffunction&gt;
</code></pre>

All I've done here is dump all the arguments sent in. Now go back to your error file (the one you made to throw errors) and change it to this:

<pre><code class="language-markup">
&lt;h1&gt;Hellow World&lt;/h1&gt;
&lt;cfoutput&gt;#xfhdshsdhj#&lt;/cfoutput&gt;
</code></pre>

Run it in your browser, and you will see this:

<img src="https://static.raymondcamden.com/images/cfjedi/eshot5.png">

Notice that the HTML before the error is displayed in the browser. If we had used a nice error message instead of the dump, the user would see both. This can result in oddly formatted pages. What you can do instead is simply handle the error and cflocate to the a nicer page:

<pre><code class="language-markup">
&lt;cffunction name="onError" returnType="void" output="true"&gt;
	&lt;cfargument name="exception" required="true"&gt;
	&lt;cfargument name="eventname" type="string" required="true"&gt;
	&lt;cfset var errortext = ""&gt;

	&lt;cflog file="myapperrorlog" text="#arguments.exception.message#"&gt;
	
	&lt;cfsavecontent variable="errortext"&gt;
	&lt;cfoutput&gt;
	An error occurred: http://#cgi.server_name##cgi.script_name#?#cgi.query_string#&lt;br /&gt;
	Time: #dateFormat(now(), "short")# #timeFormat(now(), "short")#&lt;br /&gt;
	
	&lt;cfdump var="#arguments.exception#" label="Error"&gt;
	&lt;cfdump var="#form#" label="Form"&gt;
	&lt;cfdump var="#url#" label="URL"&gt;
	
	&lt;/cfoutput&gt;
	&lt;/cfsavecontent&gt;
	
	&lt;cfmail to="bugs@myproject.com" from="root@myproject.com" subject="Error: #arguments.exception.message#" type="html"&gt;
		#errortext#
	&lt;/cfmail&gt;
	
	&lt;cflocation url="error.cfm"&gt;
	
&lt;/cffunction&gt;
</code></pre>

All I did was take the code from my original error.cfm file and place it in here. The Exception argument here looks a bit different. No diagnostics key. So I just logged the message for now. My error.cfm file now only contains the message:

<pre><code class="language-markup">
We are so sorry. Something went wrong. We are working on it now.
</code></pre>

Lets recap:

<ul>
<li>Do a quick test to figure out how your application responds to errors. 
<li>If robust exeception information is displayed, turn it off.
<li>Use CFERROR or onError to handle errors.
<li>Do your own logging, and email yourself a detailed report.
</ul>

I hope you find this guide useful, and please let me know how I can improve it.