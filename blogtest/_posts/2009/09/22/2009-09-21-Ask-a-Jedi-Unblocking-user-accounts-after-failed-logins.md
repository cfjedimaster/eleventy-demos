---
layout: post
title: "Ask a Jedi: Unblocking user accounts after failed logins"
date: "2009-09-22T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/22/Ask-a-Jedi-Unblocking-user-accounts-after-failed-logins
guid: 3536
---

Omer asks:

<blockquote>
I am trying to create a system where if a user provides wrong credentials for an account 5 times, the account is going to be blocked for 20 minutes. I know how I want to accomplish that but I want to know how can I unblock the account after 20 minutes. If you can suggest ways to accomplish this task, it would be great.
</blockquote>
<!--more-->
Omer stated that he already had a method in place to block the user after so many logins. Not knowing his exact mechanism lets assume that he is basing it on username. He could, for example, store the username in an application variable, along with the number of failed attempts. The following code block could be run on a failed authentication attempt:

<code>
&lt;cfif authenticated is false&gt;
  &lt;cfif not structKeyExists(application.failedAttempts, username)&gt;
    &lt;cfset application.failedAttempts[username] = 0&gt;
  &lt;/cfif&gt;
  &lt;cfset application.failedAttempts[username]++&gt;
&lt;/cfif&gt;
</code>

Once we have knowledge of how many times a particular user has tried to login and failed, we can modify our login routine to check it even before the database is hit for authentication:

<code>
&lt;cfif structKeyExists(application.failedAttempts, username) and application.failedAttempts[username] is 5&gt;
</code>

But as Omer points out - this handles the block, but not the release. We can modify the code a bit to store not only the number of failed attempts, but also the last failed login.

<code>
&lt;cfif authenticated is false&gt;
  &lt;cfif not structKeyExists(application.failedAttempts, username)&gt;
    &lt;cfset application.failedAttempts[username] = {}&gt;
    &lt;cfset application.failedAttempts[username].count = 0&gt;
  &lt;/cfif&gt;
  &lt;cfset application.failedAttempts[username].count++&gt;
  &lt;cfset application.failedAttempts[username].timestamp = now()&gt;
&lt;/cfif&gt;
</code>

All I've done is change the simple value (number of failed logins) to a structure which now stores both the count and the timestamp. On login, I can make my check for failed attempts a bit more verbose so it checks the timestamp:

<code>
&lt;cfif structKeyExists(application.failedAttempts, username) and application.failedAttempts[username].count is 5&gt;
  &lt;!--- don't just auto block, check the time stamp ---&gt;
  &lt;cfif dateDiff("n",application.failedAttempts[username].timestamp) gt 20&gt;
    &lt;cfset structDelete(application.failedAttempts, username)&gt;
  &lt;cfelse&gt;
    &lt;!--- use a flag to tell the user they are blocked ---&gt;
  &lt;/cfif&gt;
&lt;/cfif&gt;
</code>

I mentioned this to Omer, and he followed up with the fact that he wanted the "unblock" to be automatic. Since we've stored the list of users in an application variable, this could be achieved by using a ColdFusion Scheduled task. It would scan the structure completely and structDelete any username whose last attempt was more than 20 minutes ago.

One caveat to the code above - since we are modifying application variables, you may want to consider locking the read and writes to ensure they are single threaded. While the risk exists it may not actually be worth worrying about. If a user accidentally gets 6 tries to login via 5, it may not be a large concern.