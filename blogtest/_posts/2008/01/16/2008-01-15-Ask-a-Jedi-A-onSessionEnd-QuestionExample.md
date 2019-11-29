---
layout: post
title: "Ask a Jedi: A onSessionEnd Question/Example"
date: "2008-01-16T06:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/16/Ask-a-Jedi-A-onSessionEnd-QuestionExample
guid: 2596
---

Pat asks:

<blockquote>
<p>I'm writing a 'shop' which is selling unique items. To stop confusion I'm loading a table in the database with items that are in peoples shopping baskets. If an item is in the database table, it won't get displayed on the website, preventing two people buying the same unique item. The issue arises when a customer adds an item and then fails to buy it. The shopping basket uses session variables so, using a session timeout, their basket is easily emptied. To empty the database table however, I've tried to use OnSessionEnd in the Application.cfc. This will send a simple 'session ended' email, however, when I try to run a DB query, it
just doesn't work.

Here's the code:

&lt;cffunction name="onSessionEnd" returnType="void"&gt;<br>
 &lt;cfargument name="SessionScope" required="True" /&gt;<br>
 &lt;cfargument name="ApplicationScope" required="False" /&gt;<br>

 &lt;cfquery name="emptyBasket" datasource="#Application.DSN#"&gt;<br>
 DELETE FROM basket<br>
 WHERE session = '#Arguments.SessionScope.sessionid#'<br>
 &lt;/cfquery&gt;<br>

&lt;/cffunction&gt;<br>

Is there something fundamentally wrong here ?
Or is there a better way of doing this ?

I'm thinking along the lines of an hourly scheduled task that scans the DB for timed out basket contents (they contain a timestamp).
</p>
</blockquote>

This is a very simple problem. Notice how you have two arguments for onSessionEnd, the session and application scope? I assume you copied this from somewhere, like maybe my <a href="http://www.raymondcamden.com/downloads/application.cfc.txt">reference</a>, but you may not understand exactly why.

When ColdFusion runs the onSessionEnd method, it does <b>not</b> give you <b>direct</b> access to the Application and Session scopes. That's why they are passed in as arguments. If you want to use Application.DSN as you have here, you need to switch to the Argument copy: 

<code>
&lt;cfquery name="emptyBasket" datasource="#arguments.AppScope.DSN#"&gt;
</code>

I'll also use this space to make a few more recommendations. First off - your query isn't using cfqueryparam. You should update to use this tag for the dynamic portion of the query.

Lastly, I think your idea of scanning the table every hour is a good one. Why bother when you fix your code? Well, even though you and I know the onSessionEnd code <i>will</i> work, it makes me feel uneasy that if it does fail, your table isn't updated. Personally I'd use both. In the best of situations, as soon as a session times out, the unique item is back for sale. In the worst of situations, the item is back for sale at most an hour later.