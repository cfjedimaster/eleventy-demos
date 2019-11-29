---
layout: post
title: "Ask a Jedi: Why (cf)throw?"
date: "2006-03-27T17:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/03/27/Ask-a-Jedi-Why-cfthrow
guid: 1172
---

An anonymous user (hey why <i>not</i> share your name?) asked this today:

<blockquote>
I'm working more and more with cftry/cfcatch, but I'm still finding it confusing as to when to use a &lt;cfrethrow&gt; tag and the &lt;cfthrow&gt; tag.  When would I use each?
</blockquote>

This is a good question. I mean, we (developers) spend most of our time browsing blogs... err I mean trying to prevent errors. Why in the heck would you generate an error on purpose? Let me tackle each one and discuss why they would be used.
<!--more-->
First off - why would you use cfthrow? In case you don't know, cfthrow lets you raise an exception. You can specify the exception type, message, detail, and other settings. Why would you do this? There may be cases in your business logic where it makes sense. A classic case is usernames. You normally do not want to allow multiple users with the same username in the same database table. Therefore, your "AddUser" logic may have logic that checks for an existing user with same name. If you find one, what do you do? Well, you could simply raise a flag. I've seen some developers who like to return structs from methods and store all kinds of information in them. They will store a return code, a return message, etc. Personally, I don't care for this. I think if your intent is to show that something has gone wrong, than an exception makes perfect sense. I know my readers will argue back and forth on this, but that's my opinion. 

The typical place I will use cfthrow is inside CFC methods. My calling code will then use try/catch where appropriate. If you want an example, you can download <a href="http://ray.camdenfamily.com/projects/soundings">Soundings</a> and check out survey.cfc. (And other CFCs in the package.) 

So why use rethrow? I think the example livedocs provides is a pretty good one. I'm going to crib their example code. (Adobe, if you mid, just let me know.)

<code>
&lt;h3&gt;cfrethrow Example&lt;/h3&gt;
&lt;!--- Rethrow a DATABASE exception. ---&gt;
&lt;cftry&gt;
   &lt;cftry&gt;
      &lt;cfquery name = "GetMessages" dataSource = "cfdocexamples"&gt;
         SELECT  *
         FROM   Messages
      &lt;/cfquery&gt;
   &lt;cfcatch type = "DATABASE"&gt;
      &lt;!--- If database signalled a 50555 error, ignore; otherwise, rethrow
exception. ---&gt;
      &lt;cfif cfcatch.sqlstate neq 50555&gt;
         &lt;cfrethrow&gt;
      &lt;/cfif&gt;
   &lt;/cfcatch&gt;
   &lt;/cftry&gt;
&lt;cfcatch&gt;
   &lt;h3&gt;Sorry, this request can't be completed&lt;/h3&gt;
   &lt;h4&gt;Catch variables&lt;/h4&gt;
   &lt;cfoutput&gt;
      &lt;cfloop collection = #cfcatch# item = "c"&gt;
         &lt;br&gt;
         &lt;cfif IsSimpleValue(cfcatch[c])&gt;#c# = #cfcatch[c]#
         &lt;/cfif&gt;
      &lt;/cfloop&gt;
   &lt;/cfoutput&gt;
&lt;/cfcatch&gt;
&lt;/cftry&gt;
</code>

Notice that the code uses try and catch to run a database query. There is a cfcatch block which specifically catches exceptions with type="Database". However, they do <b>not</b> want to handle cases where the SQL State is not 50555. (Whatever that is.) By using cfrethrow, they can say, "Oops, you know, we caught this exception, but upon further review we have decided it is really someone else's problem. Thanks. Call again." Basically, the rethrow is a way of "changing your mind" about catching the exception. To be honest, I don't think I've ever used this tag.