---
layout: post
title: "Flex/ColdFusion Mystery with a very simple answer"
date: "2007-01-19T10:01:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2007/01/19/FlexColdFusion-Mystery-with-a-very-simple-answer
guid: 1781
---

Yesterday I was working on a Flex project when I hit a brick wall. I had a very simple form. Flex was using remoting to send the form information to ColdFusion. ColdFusion was doing <i>nothing</i> with the data. It was just an empty method. However, every time I'd try to send the data I'd get an error.

Here is where things got weird. The first thing I tried was launching ServiceCapture so I could see the response from ColdFusion. However - when I would send the form data, ServiceCapture would actually hang. I had to force it down. 

So then I went to my ColdFusion logs. Nothing was reported in the error log but an empty string. At this point I'm really confused. I go into my Application.cfc file's onError and added this:

<code>
&lt;cfsavecontent variable="temp"&gt;
&lt;cfdump var="#arguments#"&gt;
&lt;/cfsavecontent&gt;
&lt;cffile action="write" file="c:\foo.html" output="#temp#"&gt;
</code>

Now I get somewhere. When I look at the file, I see no message, no detail, but I do see a type for the error:

java.lang.StackOverflowError

What the heck? (Ok, I didn't say heck.) So now I start trying random crap. First I change the method names. Doesn't help. Finally I change my Flex code to send nothing to ColdFusion. And it works.

Um. Ok.

I restored my code and noticed something....

<code>
core.addAdminUser(username,password);
</code>

username and password were the <b>form elements</b>, not the <b>values</b> of the form elements. Somehow Flex thought this was ok. Can you really send a <i>component</i> over the wire? Flex could. And while it didn't die, it was enough to freak out ServiceCapture and ColdFusion. Changing my Flex to:

<code>
core.addAdminUser(username.text,password.text);
</code>

made everything kosher. Whew!

Coming later today - the second silly mistake I made...