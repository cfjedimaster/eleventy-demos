---
layout: post
title: "Creating a Mailing List in ColdFusion (Part 5)"
date: "2006-06-06T17:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/06/Creating-a-Mailing-List-in-ColdFusion-Part-5
guid: 1320
---

Welcome to the final entry in the "Mailing List" series. To be honest, all the previous entries covered what you absolutely need. This entry isn't exactly required, but comes highly recommended. Why? The previous code let anyone subscribe an email address. This is nice and simple, but it also means that I could enter your email address and you would never know it until you began to get email from my site. I did build a simple way to unsubscribe, but that isn't good enough. What I really need to add is a simple verification service. This is how I will do that:
<!--more-->
<ol>
<li>On subscribing, send an email to the person. The email will contain a link that must be clicked to finish the subscription.
<li>When sending email to the subscribers, only send to those that actually clicked the link.
</ol>

Nice and simple, right? Let's start with how the application will know that a person is verified. The first thing I'm going to do is add a simple verified column to my database table. Now that this is done, let's modify the CFC's subscribe method to properly set the verified value to false. I'm not going to paste the entire method, but just the modified query:

<code>
&lt;cfquery datasource="#variables.dsn#"&gt;
insert into subscribers(email,token,verified)
values(&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.email#"&gt;,
&lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#createUUID()#"&gt;,
&lt;cfqueryparam cfsqltype="cf_sql_bit" value="0"&gt;
)
&lt;/cfquery&gt;
</code>

Next I need to send an email to the potential subscriber. I've added a new method that will fetch one subscriber from the mailing list:

<code>
&lt;cffunction name="getSubscriber" returnType="struct" output="false" access="public" 
			hint="Returns a subscrier."&gt;
	&lt;cfargument name="email" type="string" required="true"&gt;
	&lt;cfset var q = ""&gt;
	&lt;cfset var s = structNew()&gt;
	&lt;cfset var col = ""&gt;

	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select		email, token, verified
	from		subscribers
	where		email = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.email#"&gt;
	order by	email asc
	&lt;/cfquery&gt;

	&lt;cfloop index="col" list="#q.columnlist#"&gt;
		&lt;cfset s[col] = q[col]&gt;
	&lt;/cfloop&gt;
	
	&lt;cfreturn s&gt;
&lt;/cffunction&gt;
</code>

There isn't anything particularly interesting about this method, but you may want to pay attention to how I translate the query to a structure. I use an automatic method instead of setting each column manually. I've modified the subscribe file to handle this new logic. Let's take a look at the whole thing, and I'll then discuss what specifically changed since the first version.

<code>
&lt;cfparam name="form.emailaddress" default=""&gt;
&lt;cfset showForm = true&gt;

&lt;cfif structKeyExists(form, "subscribe")&gt;
	&lt;cfif isValid("email", form.emailAddress)&gt;
		&lt;cfif application.maillist.subscribe(form.emailaddress)&gt;
			&lt;cfset token = application.maillist.getsubscriber(form.emailaddress).token&gt;
			&lt;cfmail to="#form.emailaddress#" from="#application.maillistfrom#" subject="Mail List Verification"&gt;
You have requested to join our mailing list. To verify this subscription, please click the link below:

http://192.168.1.113/testingzone/mailinglist/verify.cfm?token=#token#

If you did not want to subcribe, please ignore this email.
			&lt;/cfmail&gt;
		&lt;/cfif&gt;
		&lt;cfset showForm = false&gt;
	&lt;cfelse&gt;
		&lt;cfset error = "Your email address isn't valid."&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;

&lt;h2&gt;Subscribe to Foo&lt;/h2&gt;

&lt;cfif showForm&gt;

	&lt;cfif structKeyExists(variables, "error")&gt;
		&lt;cfoutput&gt;
		&lt;p&gt;
		&lt;b&gt;#error#&lt;/b&gt;
		&lt;/p&gt;
		&lt;/cfoutput&gt;
	&lt;/cfif&gt;
	
	&lt;p&gt;
	&lt;form action="subscribe.cfm" method="post"&gt;
	&lt;table&gt;
		&lt;tr&gt;
			&lt;td&gt;Your Email Address&lt;/td&gt;
			&lt;cfoutput&gt;&lt;td&gt;&lt;input type="text" name="emailaddress" value="#form.emailaddress#"&gt;&lt;/td&gt;&lt;/cfoutput&gt;
		&lt;/tr&gt;
		&lt;tr&gt;
			&lt;td&gt; &lt;/td&gt;
			&lt;td&gt;&lt;input type="submit" name="subscribe" value="Subscribe"&gt;&lt;/td&gt;
		&lt;/tr&gt;
	&lt;/table&gt;
	&lt;/form&gt;
	&lt;/p&gt;
	
&lt;cfelse&gt;

	&lt;p&gt;
	Thank you for subscribing! A verification email has been sent to your address.
	&lt;/p&gt;
	
&lt;/cfif&gt;
</code>

The first thing you may notice different is that once I've subscribed a person, I check the result of that method. I didn't use to do that before. The method will return true if the email address did not exist in the list. I need to know this otherwise I'll be sending a verification email more than once (potentially). Next I call the new method, getSubscriber. This returns a structure of member information, but all I need is the token. Notice the shorthand method of grabbing the value:

<code>
&lt;cfset token = application.maillist.getsubscriber(form.emailaddress).token&gt;
</code>

I could have written that in two lines, but this is simpler. The last thing I do is send an email to the subscriber. Notice how I include his token in the email. This will be used to verify the user. I don't need to include his email address since the token (as a UUID) is unique enough. I made one more change as well. At the very end of the file where I had previously told the user that he was subscribed, I added a note saying that I have sent a verification email.

Now I need to build the file that will actually handle the verification:

<code>
&lt;!--- Must have url.t ---&gt;
&lt;cfif structKeyExists(url, "token") and isValid("uuid", url.token)&gt;

	&lt;cfset application.maillist.verify(url.token)&gt;
	
	&lt;cfoutput&gt;
	Your subscription has been verified. Thank you and have a nice day.
	&lt;/cfoutput&gt;

&lt;cfelse&gt;

	&lt;cfoutput&gt;
	You have &lt;b&gt;not&lt;/b&gt; been verified. Please ensure that you have copied the URL correctly from your mail program.
	&lt;/cfoutput&gt;
	
&lt;/cfif&gt;
</code>

This is a short file. All it does is check for the url variable "token" and if it both exists and is a valid UUID, I call the verify method of the CFC. Now let's take a look at that method:

<code>
&lt;cffunction name="verify" returnType="void" output="false" access="public"
	    hint="Verifies a user."&gt;
&lt;cfargument name="token" type="uuid" required="true"&gt;
&lt;cfquery datasource="#variables.dsn#"&gt;
	
update	subscribers
	
set	verified = 1 
	
where	token = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#arguments.token#"&gt;

&lt;/cfquery&gt;

&lt;/cffunction&gt;

</code>

All I'm doing here is setting the verified flag to true where the token matches the value passed in. Ok - so I'm almost there. The page I built for the admin, sendmail.cfm, was using getSubscribers to both get a count of how many people to mail, as well as knowing who to mail to. I've modified this template to now call getVerifiedSubscribers. This method is also rather simple as you can imagine:

<code>
&lt;cffunction name="getVerifiedSubscribers" returnType="query" output="false" access="public" 
			hint="Returns a query of everyone subscribed."&gt;
	&lt;cfset var q = ""&gt;
	
	&lt;cfquery name="q" datasource="#variables.dsn#"&gt;
	select		email, token, verified
	from		subscribers
	where		verified = 1
	order by	email asc
	&lt;/cfquery&gt;
	
	&lt;cfreturn q&gt;
&lt;/cffunction&gt;
</code>

That's it. I hope you enjoyed this series and sorry the last part took so long to get out. A note about the files - I used the Make Archive funtion on my Mac, and it made a zip, but I have no idea if it will play well with PCs. So let me know. I also didn't modify the DB script since the change was simple and I'm on the Mac using MySQL. I didn't want folks to get confused as to why the format changed so radically. If folks really need it I can post it later.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2FArchive%2Ezip'>Download attached file.</a></p>