---
layout: post
title: "How ColdFusion can save your business!"
date: "2006-10-20T13:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/10/20/How-ColdFusion-can-save-you-business
guid: 1600
---

Ok, please forgive the overly dramatic title, but I want to talk about something pretty darn important and I wanted to get your attention. Does your site have an e-commerce feature? Is the main purpose of your site e-commerce? If so - let me ask you a question. I'm sure you can tell me right now (I hope!) how many orders your site gets per day, along with other things like the average size of the order, highest order, etc. But can you tell me how many people visit your site, add a few items to their cart, and just give up never to return? Can you tell me if there is a particular part of your checkout process where people tend to abandon their carts? If you can't - then you could (literally) be losing money every day. Money isn't everything - but I've heard good things about it - so why not go the extra mile to ensure you are losing money due to some stupid reason like a hard to navigate checkout process or even a simple typo that makes it difficult for consumers to complete their order. Luckily we can add some monitoring using a simple feature of ColdFusion MX7: Application.cfc.
<!--more-->
For this blog entry I've created a very simple e-commerce application. It is so simple it doesn't even have real forms. It does, however, have a set of files that let you mimic a user moving through the site and the checkout process. Please download the files by clicking the Download link below. Having them in front of you will help you understand this blog entry. You can expand the zip and run as is - no need for a database or anything fancy like that.

The application has the following files:

<ul>
<li>Application.cfc: This is the file that will handle monitoring the check out process. It also initializes the session.
<li>index.cfm: This is the first page you should hit when testing the application. 
<li>addcart.cfm: This page represents a user who has items in her cart.
<li>checkout1.cfm: This page represents someone who is on the first step of the checkout process, the address page typically.
<li>checkout2.cfm: This page represents someone who is on the second step of the checkout process, the billing information page.
<li>checkout3.cfm: This page represents the confirmation page. The user must go past this page to finish the order.
<li>done.cfm: This page represents the end of the e-commerce process and a successful order. (Yeah money!)
<li>stats.cfm: This is a page that would normally be for administrators only. We will use it for reporting.
</ul>

Feel free to play with the checkout process now, but I'd ask that you avoid the stats page until we discuss it. The application has an <b>extremely</b> low timeout value, so you can leave it for 30 seconds and your session will abort. I don't auto-reset you in the checkout process, so you can just keep clicking away. Now that you've played with it a bit. Let's dig into the code. First let's take a look at the Application.cfc file:

<code>
&lt;cfcomponent output="false"&gt;

	&lt;cfset this.name = "ecomtest"&gt;
	&lt;cfset this.applicationTimeout = createTimeSpan(0,2,0,0)&gt;
	&lt;cfset this.clientManagement = true&gt;
	&lt;cfset this.clientStorage = "registry"&gt;
	&lt;cfset this.loginStorage = "session"&gt;
	&lt;cfset this.sessionManagement = true&gt;
	&lt;cfset this.sessionTimeout = createTimeSpan(0,0,0,30)&gt;
	&lt;cfset this.setClientCookies = true&gt;
	&lt;cfset this.setDomainCookies = false&gt;
	&lt;cfset this.scriptProtect = false&gt;

	&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="onApplicationEnd" returnType="void" output="false"&gt;
		&lt;cfargument name="applicationScope" required="true"&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="onRequestStart" returnType="boolean" output="false"&gt;
		&lt;cfargument name="thePage" type="string" required="true"&gt;
		&lt;cfreturn true&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="onRequestEnd" returnType="void" output="false"&gt;
		&lt;cfargument name="thePage" type="string" required="true"&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="onError" returnType="void" output="true"&gt;
		&lt;cfargument name="exception" required="true"&gt;
		&lt;cfargument name="eventname" type="string" required="true"&gt;
		&lt;cfdump var="#arguments#" label="Exception"&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="onSessionStart" returnType="void" output="false"&gt;
		&lt;cfset session.status = ""&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="onSessionEnd" returnType="void" output="false"&gt;
		&lt;cfargument name="sessionScope" type="struct" required="true"&gt;
		&lt;cfargument name="appScope" type="struct" required="false"&gt;
		
		&lt;!--- just in case... ---&gt;
		&lt;cfif not structKeyExists(arguments.sessionScope, "status")&gt;
			&lt;cfset arguments.sessionScope.status = ""&gt;
		&lt;/cfif&gt;
		
		&lt;cflog file="ecomtest" text="Session Status: #arguments.sessionScope.status#"&gt;
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

Let me pick out the parts you want to be concerned with. First off, note the super low session time out:

<code>
&lt;cfset this.sessionTimeout = createTimeSpan(0,0,0,30)&gt;
</code>

You would obviously <i>not</i> have this on a production system. I did this to make my testing easier. Next lets take a look at the onSessionStart code:

<code>
&lt;cffunction name="onSessionStart" returnType="void" output="false"&gt;
	&lt;cfset session.status = ""&gt;
&lt;/cffunction&gt;
</code>

The session variable, status, is what I'm going to use to note where the user was when her session ended. Speaking of the end of a session...

<code>
&lt;cffunction name="onSessionEnd" returnType="void" output="false"&gt;
	&lt;cfargument name="sessionScope" type="struct" required="true"&gt;
	&lt;cfargument name="appScope" type="struct" required="false"&gt;
		
	&lt;!--- just in case... ---&gt;
	&lt;cfif not structKeyExists(arguments.sessionScope, "status")&gt;
		&lt;cfset arguments.sessionScope.status = ""&gt;
	&lt;/cfif&gt;
		
	&lt;cflog file="ecomtest" text="Session Status: #arguments.sessionScope.status#"&gt;
&lt;/cffunction&gt;
</code>

First - a reminder. When ColdFusion fires the onSessionEnd method, you can't use "session.foo" to refer to the session scope. Why? Because it's dead. There is no more session. However - ColdFusion passes in the data from the session scope as a structure. (It also passed in the Application scope.) I wrote a bit of code to ensure my session variable, status, still existed. It should never fire - but I like to be extra careful. Finally I use the cflog command to report the session status. I could have inserted into a database as well, but I wanted to keep this demo simple. The important thing to note is - I record the value so I know exactly what was going on when the user's session ended.

Now let's look at the checkout process. I described the files above. If you took the time to actually do the checkout process, then you know that each page simply has a text description and a button. Therefore I'm not going to show you all the pages, but just two so you can get the idea. Let's look at the very first page, index.cfm:
<code>
&lt;!--- Record Status ---&gt;
&lt;cfset session.status = "No Cart"&gt;

&lt;cf_layout title="Intro Page"&gt;

&lt;p&gt;
This page represents the introduction, or home page, for the simulation.
If you end your session here, it means you didn't purchase a darn thing.
&lt;/p&gt;

&lt;p&gt;
&lt;form action="addcart.cfm" method="post"&gt;
&lt;input type="submit" value="Add Stuff to Your Cart"&gt;
&lt;/form&gt;
&lt;/p&gt;

&lt;/cf_layout&gt;
</code>

There is one line you want to care about - the first line. This is where I set the status for the user's session. I'm using a simple string to describe where she is in the e-commerce process. Let's compare this to addcart.cfm:

<code>
&lt;!--- Record Status ---&gt;
&lt;cfset session.status = "Cart with Items"&gt;

&lt;cf_layout title="Added to Cart"&gt;

&lt;p&gt;
You have now added stuff to your cart. If you leave here, it means you never even tried
to check out.
&lt;/p&gt;

&lt;p&gt;
&lt;form action="checkout1.cfm" method="post"&gt;
&lt;input type="submit" value="Start Checkout Process"&gt;
&lt;/form&gt;
&lt;/p&gt;

&lt;/cf_layout&gt;
</code>

Again - the only line here of import is the first line. Note how I've changed the status. Now obviously these files would have a lot more to them. Like - oh - actual form fields. But I think you get the idea of what I'm doing here. So - take a look at stats.cfm. If everything is working fine, you should see a report like so:

<blockquote>
Your site has had 22 total sessions.<br>
Of those sessions, 10 (45.45 %) sessions didn't order anything.<br>
Of those sessions, 1 (4.55 %) sessions ordered items, but didn't start the checkout process.<br>
Of those sessions, 1 (4.55 %) stopped at the first step in the check out process (Entering Address).<br>
Of those sessions, 2 (9.09 %) stopped at the second step in the check out process (Entering Billing Information).<br>
Of those sessions, 3 (13.64 %) stopped at the third step in the check out process (Confirmation).<br>
Of those sessions, 3 (13.64 %) finished their order. <br>
</blockquote>

This report shows exactly where folks are ending in their process. (In case you are curious - the reason why the lines below the total don't add up to the session total represents the fact that some people don't hit the initial page.) For an e-tailer (I really hate all those "e-" words), the lines you would care most about are the lines involved in the process itself. If you saw a spike in step two for example, you would inspect that form and see if anything stands out as being particularly difficult. You could also email a few users and simply ask them why they gave up. (You don't want to email all of them though, just pick a few select random folks.)  In my sample code I just logged the status, but you could store a lot more information if you wanted to. Although a log file probably wouldn't be a good idea - you could store their cart - their IP - anything you can think of. 

In case you are curious - what exactly is stats.cfm doing? Honestly I don't want to waste space here. Because I used a log file, I had to do some string parsing and query of queries. Since that really isn't relevant to the discussion, I won't post the code - but you can peruse it via the Download link below. 

Here are some other ideas to consider:

<ul>
<li>Keep a count (in the application scope perhaps) of the people who don't finalize the e-commerce process. If the count goes over a threshold, fire off an email to the powers that be to let them know that something may be up.
<li>When a user doesn't complete their order, consider storing their cart so they can retrieve it when she returns. I can give you a great example of this. My wife, for the past few days, has been trying to order from a retailer I won't name. As far as she knew - her cart was stored, yet every day she returned to be told her cart had been emptied. This is with a site she had to logon and register for - so there is <b>no</b> reason for this. She was <b>very</b> frustrated and probably will switch to another store.
<li>When a user doesn't complete their order, maybe send them a coupon code to encourage them to complete an order.
<li>Examine the contents of abandoned carts. Do some products seems to be abandoned most often? Perhaps they have higher taxes, or shipping fees, that discourage users from actually purchasing the items. Maybe you should be more up front with the users about these fees?
<li>Can you think of some other good uses here?
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fecomtest%{% endraw %}2Ezip'>Download attached file.</a></p>