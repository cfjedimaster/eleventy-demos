---
layout: post
title: "Is it time to stop using ColdFusion for remote APIs?"
date: "2015-09-04T16:55:13+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/09/04/is-it-time-to-stop-using-coldfusion-for-remote-apis
guid: 6734
---

So, let me begin by saying I'm a bit frustrated, and so this blog post may be one I regret later on, but, I try to be as honest as possible here and right now, I'm kinda ticked off about something and I want to get it off my chest. For a long time now I've had an incredible amount of respect for how ColdFusion makes it easy to access data from client-side code (or remote servers). As much as I'm digging Node.js these days, the fact that I can write up a CFC and get an API that can be used by JavaScript is pretty darn powerful. This feature has come a long way. When it first came out, the only option for output was WDDX. You can now output anything, from WDDX, to SOAP, to XML, plain strings, and of course, JSON.

<!--more-->

In fact, I like this feature so much that I proposed a topic for it at this years <a href="https://cfsummit.adobeevents.com/">ColdFusion Summit</a>. My session will be an overview of how to generate output for remote consumption and cover everything from the beginning (ColdFusion MX and earlier) to the upcoming release (12). 

However...

Since the beginning of <i>native</i> JSON support in ColdFusion (ColdFusion 8), there have been consistent issues with serialization. This all drives from the fact that ColdFusion variables are typeless and therefore the server has to (or does it?) make guesses as to how to convert values into JSON. Over the past three releases, I've seen multiple bugs, and multiple fixes, and while I had no real proof (more on that in a minute), my gut told me that things had simmered down a bit and that ColdFusion 11 had this problem licked.

Or so I thought.

Turns out <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3337394">bug 3337394</a>, created nearly <i>three</i> years ago, oh one marked closed and fixed, is still very much an issue for serialization. If you have data in a struct, and it has the string value "No", ColdFusion will convert it to false. Here is a sample:

<pre><code class="language-javascript">x = {% raw %}{"name":"No"}{% endraw %};
y = queryNew("id,name", "integer,varchar", [{% raw %}{"id":1, "name":"ray"}{% endraw %},{% raw %}{"id":2, "name":"No"}{% endraw %}]); 
writeoutput(serializeJSON(x));
writeoutput("<p/>");
writeoutput(serializeJSON(y,"struct"));
</code></pre>

Which gives you:

<pre><code>
{% raw %}{"name":false}{% endraw %}

[{% raw %}{"ID":1,"NAME":"ray"}{% endraw %},{% raw %}{"ID":2,"NAME":"No"}{% endraw %}]
</code></pre>

As you can see, the struct is broken, the query works fine. (As reported in the bug itself.) 

Another issue involves strings that contain numbers. Consider these two examples:

<pre><code class="language-javascript">z = {% raw %}{"productkey":"89900909130939081290830983019819023"}{% endraw %};
z2 = queryNew("id,name", "integer,varchar", [{% raw %}{"id":1, "name":"ray"}{% endraw %},{% raw %}{"id":2, "name":"89900909130939081290830983019819023"}{% endraw %}]);

writeoutput("<p/>");
writeoutput(serializeJSON(z));
writeoutput("<p/>");
writeoutput(serializeJSON(z2));
</code></pre>

This returns:

<pre><code>
{% raw %}{"productkey":89900909130939081290830983019819023}{% endraw %}

{% raw %}{"COLUMNS":["ID","NAME"],"DATA":[[1,"ray"],[2,"89900909130939081290830983019819023"]]}{% endraw %}
</code></pre>

As you can see, productkey is now a number, and one that will be converted to 8.990090913093909e+34 in JavaScript. 

So.... yeah. In all cases, there are workarounds. But let me ask you this. Would you use a database that randomly changed values on you? 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/09/aw_hell_no.png" alt="aw_hell_no" width="380" height="285" class="aligncenter size-full wp-image-6735" />

It seems ridiculous that this is still a problem now. It may be <i>incredibly</i> difficult. Heck, I won't pretend to be able to solve it. But here are some suggestions:

<ul>
<li>Obviously the ColdFusion team has a unit test for this. They must. So when the unit test is updated for the items found in the bug, share it with us. I know there are <i>multiple</i> people in the community who would give their time to help flesh out the unit test, or heck, just have it locally and test when new versions come up. So that's my first request - let us see the tests for JSON serialization. Speaking of unit tests, the last time this bug was fixed, why not share the test immediately? I mean, we won't see it working, but I <i>promise</i> you people who have asked why a bug involving data serialization had a test that only tested queries (and CFCs I believe). I don't want to harp on the engineer who fixed this - we all make mistakes - but why not post the test when you write it and share it with us? 

Of course, one could write essays on the lack of communication that goes on sometimes on the bug tracker, which is a real shame. You know, I get that some people don't like to engage or are basically shy. But there's no excuse for it anymore. I'm very shy too. When someone speaks to me, I have to work hard to respond to their questions with questions of my own. I recognize my lack of engagement in basic human communication and force myself to hack around my lack of social skills. Make a list and put it on a PostIt next to your monitor. "When I fix a bug, respond with details about how I fixed it, how I tested it, and what I may be concerned about. The reporter may have good input!"</li>
<li>Given that the "glue" aspect of ColdFusion is one of its greatest selling points, make JSON serialization a priority for ColdFusion 12. Obviously the issue isn't licked yet, which, ok, fine, it's been years but fine. The ColdFusion 12 road map says this: "Ability to manage, monitor, regulate, secure REST and SOAP web services – API management". Before I manage my APIs, I want 100% certainty that they actually process data correctly.</li>
<li>And hey - how about the nuclear option? If the very nature of ColdFusion variables means the problem is not 100% solvable, then remove the feature. Seriously.  Ok, maybe that's overkill, but there are things in ColdFusion now that haven't been updated in a while, look abandoned, and maybe should be dropped. So if they can't fix it, remove it.
</ul>

So I started this blog entry with a somewhat bold title - is it time to stop using ColdFusion for remote APIs? Many of us in the community have already argued against using <a href="http://www.raymondcamden.com/2014/01/23/Im-not-going-to-tell-you-to-stop-using-ColdFusion-UI-tags-anymore">ColdFusion UI features</a>. If we can't trust the data coming out of CF's built-in JSON serialization than is it time to stop using it completely? What do you think?

p.s. Don't forget you can switch to Nadel's excellent <a href="http://www.bennadel.com/blog/2505-jsonserializer-cfc---a-data-serialization-utility-for-coldfusion.htm">JSONSerializer.cfc</a>.

p.s. On top I made the point that ColdFusion has to guess at the data type. Adam Cameron makes a great comment in the bug about this: "You speak good sense Peter: it's inconvenient but understood that CF can't infer data types in situations like this, so - on that basis - *don't try*. If you know you can't do something... don't then go ahead and try do it anyhow." Given that "No" is a string, don't convert it. If someone is using No for false in their data, then why not punish <i>them</i> instead of everyone else?

p.s. As I was writing this, it occurred to me that we have other places where things get a bit fuzzy with data. Math, for example, breaks down in large numbers. I get that that's an issue across other languages, and certainly we shouldn't remove arithmetic from ColdFusion because of it, but it just <i>feels</i> like a different domain than what I'm seeing in JSON serialization.