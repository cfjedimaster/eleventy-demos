---
layout: post
title: "Creating a Mailing List in ColdFusion (Part 4)"
date: "2006-05-28T17:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/28/Creating-a-Mailing-List-in-ColdFusion-Part-4
guid: 1299
---

In my <a href="http://ray.camdenfamily.com/index.cfm/2006/5/25/Creating-a-Mailing-List-in-ColdFusion-Part-3">last entry</a>, I talked about the code behind sending out an entry to the list subscribers. While in general this was rather simple, I built in a variable replacement system that let the emails be personalized for each list member. Today I'm going to add a critical part of the application - the unsubscribe feature. As part of this feature I will discuss how the variable replacement system is used to help with this feature.

As always, I like to start with code and then describe what I'm doing. Today's code may be a bit confusing at first - but it will make sense:

<code>
&lt;cfif structKeyExists(url, "token") and isValid("uuid", url.token)&gt;
	&lt;cfset application.maillist.unsubscribe(url.token)&gt;
	
	&lt;p&gt;
	You have been unsubscribed from the mail list. 
	We hope you subscribe again in the future!
	&lt;/p&gt;

&lt;cfelse&gt;

	&lt;p&gt;
	Sorry, but you were not unsubscribed. Please ensure that you have copied the URL correctly
	from your mail client.
	&lt;/p&gt;
		
&lt;/cfif&gt;
</code>

Seems a little brief, right? All I'm doing is checking for the existence of a URL variable named token. If it exists and is a valid UUID (who here also loves the isValid() function?), then I call the same unsubscribe I had mentioned in <a href="http://ray.camdenfamily.com/index.cfm/2006/5/23/Creating-a-Mailing-List-in-ColdFusion-Part-2">part two</a> If for some reason the token didn't exist or wasn't valid, I present an error message asking folks to check their mail client. 

So where did this value come from? As you can guess, it came from their email address. Remember that the unsubscribe method uses the token I associated with each user. Also remember that I allow for variable substitution in each email sent to the subscribers. I can put this all together and allow for a custom unsubscribe link by simply adding this to the email:

<code>
http://someurl/unsubscribe.cfm?token={% raw %}%token%{% endraw %}
</code>

When the user gets his or her email, the token value at the end will equal their own token. When clicked, everything will be automatic. They will be automatically removed from the list. Since I'm using UUIDs, this also ensures that no one else can unsubscribe a member since it will be (near) impossible to guess another UUID value. 

That's it for this installment. Luckily this series is actually quite simple and not "exploding" as the Model-Glue series did. I have one more entry planned and that is a verification service. While the code so far should be enough, when it comes to mail services, you typically want to go above and beyond and <i>really</i> be sure the person wants to subscribe. By the way - is anyone reading this series? The first two entries got decent responses, but the last one had no comments.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fmailinglist3%2Ezip'>Download attached file.</a></p>