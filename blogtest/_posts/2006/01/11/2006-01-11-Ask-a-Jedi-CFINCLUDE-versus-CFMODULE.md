---
layout: post
title: "Ask a Jedi: CFINCLUDE versus CFMODULE"
date: "2006-01-11T18:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/11/Ask-a-Jedi-CFINCLUDE-versus-CFMODULE
guid: 1024
---

A reader asks:

<blockquote>
Ray, I'm royally confused between CFINCLUDE vs CFMODULE.  When is it best to use one over the other?
</blockquote>
<!--more-->
Simple... neither! I probably need to back a bit and talk about when you would want to use either, and when you would want to use one over the other.

Both &lt;cfinclude&gt; and &lt;cfmodule&gt; allow for code encapsulation. What do we mean by code encapsulation? Imagine this scenario: You are in the business of selling light sabers. When a person shops, you have a page where you display their shopping cart. The total price of their order is the total of all the line items (each unique lightsaber) multiplied by their unit prices. (The double-sided ones cost more ya know.) 

Now let's say your boss wants you to offer a volume discount. Any order with 10 or more lightsabers will have a 10{% raw %}% discount. So now you have a problem. You have code to calculate the price in multiple places - the cart - during checkout - and in the confirmation. This is a perfect example of when encapsulation would be useful. If the business logic for calculating the price for a set of products was in one place - you would only need to update the code once. If your boss changes the 10%{% endraw %} to 9%, it wouldn't be a big deal. 

So obviously this is just one simple example. Many more exist. ColdFusion offers different types of encapsulation. At the last few MAX conferences I spoke on this topic. As a very basic summary - the types of encapsulation in ColdFusion include: Includes, Custom Tags, User Defined Functions (UDFs) and ColdFusion Components (CFCs). All of them have advantages over each other and have their appropriate use - although sometimes it isn't so obvious. However - let's focus on your question of comparing an include to a custom tag.

When you use &lt;cfinclude&gt;, the file that is included acts as if it were in the document itself. You can imagine ColdFusion simply copying the lines into the file when it is executed. This is important. Consider the following code:

<code>
&lt;cfset name="Jacob Camden"&gt;
&lt;cfinclude template="logic.cfm"&gt;
&lt;cfoutput&gt;#name#&lt;/cfoutput&gt;
</code>

Do you know what this code will print? Most likely it will be Jacob Camden. But the code inside of logic.cfm could very easily change the value of the name variable. You may say, "Hey, I wrote logic.cfm, I know what's in there. It's safe." But are you sure you will always be working on the file? Are you sure you will be the only person working on the project in general? 

On the other hand - when you work with custom tags, the code inside the tag is run within it's own scope. You do not have to worry about the tag accidentally overwriting your variables. (Technically it is possible - but will not happen unless the tag is poorly written.) This "black boxing" does come at a cost of speed. I know some of my readers will comment on this. However - in my experience - I have never seen the use of custom tags have any real impact on a site. I've only seen it happen when a) the code itself was bad, not the fact that it was a custom tag, or b) <i>way</i> too many custom tags were used (think Spectra, if anyone remembers it). 

So why use &lt;cfinclude&gt; at all? The &lt;cfinclude&gt; tag is good for including things like static variables. So for example - you may have a configuration file that is simply a set of &lt;cfset&gt; tags. Another example is including a header and footer. (Although I typically use a wrapped custom tag for that.)