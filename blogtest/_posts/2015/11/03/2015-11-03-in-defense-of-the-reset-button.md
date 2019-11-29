---
layout: post
title: "In defense of the Reset button..."
date: "2015-11-03T16:28:08+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2015/11/03/in-defense-of-the-reset-button
guid: 7052
---

Earlier this morning, in a fit of intense silliness - I tweeted an observation about reset buttons and forms:
<!--more-->

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">Speaking of forms, why are we still adding Reset buttons? When was the last time you *intentionally* reset a form?</p>&mdash; Raymond Camden (@raymondcamden) <a href="https://twitter.com/raymondcamden/status/661550547955150848">November 3, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Now, to be clear, I can't remember the last time I accidentally cleared a form, but it still surprises me when I see the element on a page. I honestly cannot remember ever wanting to reset my form and it just feels like a bit of wasted space. 

But of course - as soon as I tweeted this I got some pretty interesting responses that made me re-examine my thoughts on the feature in general. Here they are in no particular order.

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/raymondcamden">@raymondcamden</a> <a href="https://twitter.com/zeldman">@zeldman</a> for CSS-only drop-down nav controlled by radio inputs, where a reset closes the active menu <a href="https://t.co/qAtmqPDazl">https://t.co/qAtmqPDazl</a></p>&mdash; Radoslav Sharapanov (@radogado) <a href="https://twitter.com/radogado/status/661551413810495488">November 3, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Ok, so that's an interesting demo there. To be honest, whenever I see CSS doing weird stuff with forms, I get a bit concerned. It seems cool to "twist" stuff that way but something about it just seems wrong to me. That being said, I can't CSS my way out of a paper bag so what do I know? In the end though, his demo/usage doesn't really match my initial statement about the "typical" use of the reset button.

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/raymondcamden">@raymondcamden</a> Only on a form used to filter search results (to reset it back to the default filter criteria).</p>&mdash; Dan Skaggs (@dskaggs) <a href="https://twitter.com/dskaggs/status/661553344192708609">November 3, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I replied back to Dan to clarify that he was talking about a form using Ajax and in that respect - I think it makes sense. As long as you change the value of the reset button to something like "Clear Search" and as long as you clear the results too, then I think this is actually a pretty darn valid use of the reset button.

And yes - you <i>can</i> listen for a reset event. I never knew it existed but it makes sense that it does. Here it is in jQuery:

<pre><code class="language-javascript">$("form").on("reset", function(e) {
    console.log("reset event");
    console.dir(e);
});</code></pre>

And yes - if you return false from this event you can <strong>block</strong> a reset event. Why in the world would you do that? I have no idea. But you can.

As an aside - if you listen to the change event on a form field, even though reset technically changes the value (or <i>may</i> change the value), you will <strong>not</strong> get an event fired. I guess this makes sense, but if you are listening for change events and have a reset button, you'll want to listen for the reset event as well.

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/raymondcamden">@raymondcamden</a> I see them more used (and labelled) as &quot;Cancel&quot; which typically takes you back a page vs just clearing.</p>&mdash; Jordan Kasper (@jakerella) <a href="https://twitter.com/jakerella/status/661557901115297792">November 3, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This examples makes sense too - and you would need to listen to the reset event to handle it. But as with my issue with the fancy CSS drop down menu thing, this feels like a small violation of the purpose of the button. Not that the W3C Police will come after you, but it seems wrong.

Don't forget that modern browsers support the formaction attribute. You could literally do this something like this:

<pre><code class="language-markup">
&lt;input type="submit" value="Cancel" formaction="index.html"&gt;
</code></pre>

This only works on submit buttons though. Support is actually pretty good, and an article over on Wufoo documents this: <a href="http://www.wufoo.com/html5/attributes/13-formaction.html">The formaction attribute</a>.

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/raymondcamden">@raymondcamden</a> Password-protected pages. Happens during testing and in daily use cases for our clients (work at a web dev. company)</p>&mdash; Sarah Jedrey (@sejedrey) <a href="https://twitter.com/sejedrey/status/661586179008143362">November 3, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

So my take away from this is that Sarah's customers are asking for this on secured pages. I can't see why a customer would ask for this - but at the same time - I've got intimate knowledge of browsers that a casual user would not have. Seeing a way to remove form data with a single click could be reassuring. And in fact, a bit later Ben S said the same thing:

<blockquote class="twitter-tweet" data-conversation="none" lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/raymondcamden">@raymondcamden</a> <a href="https://twitter.com/zeldman">@zeldman</a> Funnily enough we just added them. Our users felt safer (in testing) knowing they could revert &amp; restart their work.</p>&mdash; Ben S (@beseku) <a href="https://twitter.com/beseku/status/661590252805599233">November 3, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I guess I can see this helping users feel safe. As a reminder though, don't forget that the reset button doesn't "clear" forms, it literally resets it. So if your form is using hard coded values, perhaps on a "Edit Profile" page, the reset button isn't going to clear anything off screen. Rather it will just return the form back to its original values. 

Any comments on this?