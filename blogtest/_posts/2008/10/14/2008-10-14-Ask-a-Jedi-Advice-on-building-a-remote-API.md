---
layout: post
title: "Ask a Jedi: Advice on building a remote API?"
date: "2008-10-14T14:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/14/Ask-a-Jedi-Advice-on-building-a-remote-API
guid: 3053
---

Joshua asks:

<blockquote>
<p>
I have a hosted web app that I developed and am selling  accounts to and am to the point where I would like to build an API to the data. What would be the basic structure behind an API?

Would it be making a top level CFC that is for authentication and all the others are like "children" of that main cfc so that it gets the authentication status and things trickling down to the others?
</p>
</blockquote>

APIs are a subject that are near and dear to my heart. For some reason, I've always enjoyed writing ColdFusion wrappers to APIs. Maybe because I love turning some remote complex service into a simple CFC call. Maybe it's the idea of creating a link between two completely separate systems. Whatever it is, it's something I've had a lot of experience with (especially on the consumer side) so I think I can give some good advice here.

I know you are looking specifically at the code setup in regards to authentication, but I'm going to take the opportunity to preach about API design in general as well.
<!--more-->
So from a code perspective, what is the best way to design an API that handles performing some arbitrary action while also handling authentication and authorization? Joshua mentioned a top level CFC with children under it. By that I assume he means inheritance. Now I do not profess to be an OO expert in any way whatsoever. I do know that one of the <i>guidelines</i> (not rules, guidelines, since nothing is really black and white) is that you should use inheritance only for a IsA relationship. To me, this scenario does not satisfy a IsA relationship. Instead you would probably have an instance of the authentication code injected into the CFC. This is a bit trickier though over the wire as you don't have a persistent CFC in place. You could - however - simply make use of the Application scope from within the CFC. I know that I've often said you shouldn't use outside scopes in a CFC, but a remote service like this certainly is a special example. Another option is to use <a href="http://www.raymondcamden.com/index.cfm/2008/8/22/Ask-a-Jedi-Making-use-of-ColdSpringModelGlue-and-Remote-Proxies">ColdSpring to generate your remote CFCs</a>. This will give you full remote access to your CFCs with everything necessary injected into them. But the flip side to that is - if your remote authentication/authorization system has nothing to do with the rest of your application, would you even be injecting that into the service anyway?

And this is where I'd probably suggest building one CFC for the entire API. You probably already have a set of CFCs designed for your application, but if your API is going to have it's own authentication system it probably makes sense to have one CFC work as the gateway to the rest of the system. That leaves the rest of the CFCs alone and lets you focus on one main set of code as your core gateway. Generally this code would do:

<ul>
<li>Authenticate the request. This can be done by checking a username and password, a secret key, or maybe all three. 
<li>Authorize the request. This wouldn't apply to all APIs, but perhaps some users can run a limited amount of calls per day, while users (who pay more of course) can run more.
<li>Direct the request. Depending on what data is requested (latestWeather, latestStocks), your main CFC would handle calling the proper service to fetch the result.
<li>Return the request. Return the data obviously. Tips on return format below.
<li>And somewhere in there you probably also want logging as well. Who called me at what time and for what data.
</ul>

Now that I've talked a bout about the security aspect of the API, let's take it a step higher and talk about the API in general. The following doesn't apply to ColdFusion alone, but to anyone creating a service that would be used by others. Here are some things to consider in no particular order.

<b>KISS (Keep It Simple, Stupid)</b><br/>
I've long said that working with Yahoo and their services is a dream while Google tends to be a chore. I don't think it's because Google is necessary 'better' or 'worse' than Yahoo, but their APIs are not as friendly. In all things I cannot recommend enough that a simpler approach will make life easier for your developers and actually encourage them to use your API. As a good example of unnecessary complexity, Google likes to make you set up multiple requests. They also like to respond with requests that make you request new requests. I'm sure they have a good reason for this as - well - they are Google and are all brainiacs, but I can't help but wonder if they actually <i>use</i> the APIs they build.

<b>Consistency</b><br>
This is obvious, but try to use similar method names, argument names, and result formats. So for example, take a getWeather and getStockInfo API call. While they return pretty different data, if both calls supported a date filter, you would want to use the same arguments for both. Perhaps beginDate and endDate. You wouldn't want one call using those names and another call using fromDate/toDate. Ditto for results. If you return results in XML, consider a common package type.

<b>Return Type</b><br />
What format of data should you return? JSON? XML? SOAP? I say return them all. ColdFusion makes this ridiculously easy so there isn't any real excuse to not offer a variety of return formats to the end user. As an example, Yahoo supports JSON, RSS, and SerializedPHP.

<b>Documentation, both technical and legal</b><br/>
Obviously you want to document your API. Good documentation should show both examples of constructing requests as well as response examples. Also be <b>very</b> clear about the legal/usage rules for your API. If your API restricts folks to 1K hits per day, then be obvious. <i>Many</i> of the APIs out there have limits, but a lot of them are vague and seem to be a bit unclear on what they will do when you go over the limit. Even worse, many don't provide a way to go over the limit. I can certainly understand throttling the use of your API, but to not provide a way to give you money and get more use of your API is simply dumb. There should be a clear statement like so:

<blockquote>
<p>
You may use API Foo 1000 times in a 24 hour period. Each request made from your host is considered one unique request. If you request more than your limit, we will respond with an XML packet that contains the following error code. Contact sales@foo.com if you wish to buy a license for more API calls.
</p>
</blockquote>

Nothing bothers me more than an API that is vague about what it will do under heavy usage. 

<b>Backwards Compatibility</b><br/>
Another big one to watch out for is backwards compatibility. If you update your API, you generally never want to break any old code out there that is assuming a particular format. The flip side to this is - I do think it's fair to warn developers and give them a good amount of time to update. YouTube did this with their API updates. I've seen some services actually provide a whole new entry point (URL) to support a new version of their service. That's something to consider as well.

I hope this is helpful Joshua, and I'm definitely open to suggestions/critiques of the above.