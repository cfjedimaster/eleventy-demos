---
layout: post
title: "Ask a Jedi: When do you catch errors?"
date: "2010-05-03T17:05:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2010/05/03/Ask-a-Jedi-When-do-you-catch-errors
guid: 3801
---

Grant asks:

<blockquote>
Hey Ray, I'd like to see you do an article sometime on "When to catch an error". I've been working on my own sorta ORM for ColdFusion and I've definitely seen that there can be benefits to throwing errors and/or not catching them. It seems to me there should be a practice for this because if you caught every error, a broken piece of code would just fail silently, but still fail to do whatever it was programmed to do. I'm thinking that you probably want to let your "backend" throw as many errors as it wants and write all the error catching at the application or request level, but I digress. :)
</blockquote>
<!--more-->
I told Grant that I didn't have a good answer to this, but that I'd try and throw (heh, get it?) it out there for folks to discuss. I want to start this discussion by doing two things. First, lets try to clarify the question a bit. Secondly, be sure to notice he isn't talking about not caching bugs at all. He ends with mentioning error catching at the end. I think we can agree (or probably agree) that a naked error should <i>never</i> be shown to the general public. 

So with that being kind of a base level assumption, how can we more narrowly define the problem? Given that we probably have multiple layers to an application (even if you don't use MVC, you are hopefully encapsulating business logic in CFCs, custom tags, UDFs), and given that an error can occur at any level, where is it appropriate to handle and "accept" that the error is Ok?

Let's consider an example of what an "Ok" error is. If your site makes use of an external RSS feed to display news items, I think you can agree that the failure of the RSS feed to parse, or respond, or whatever, should not be something that constitutes an error that should abort all processing. 

Now let's consider an opposite example. He mentioned ORM so I'll use that. If your service layer was taked with using ORM to do some business process like authentication, most likely you would not want to catch that error. (By the way, as I'm writing this I can already think of reasons why you <i>should</i> - so keep in mind I'm just trying to come up with samples here. :) If it completely failed (like a bad table for example) then I think it makes sense to let the top level error management catch the error and present the user with the dreaded "Oh Snap!" error page. (Favorite feature of Chrome by far.) 

I think it's also reason to expect that certain things should always work. For example, I expect my database to be up. It may not be, but under normal operating procedures, it will be up and if it isn't, I really do want my site to come to a screaming halt. However, I should <i>not</i> expect someones remote site (and RSS feed) to always be available. Therefore I'll add additional levels of error handling above and beyond my "final" catch all at the Application level.

Any one care to share thoughts on this? I'll use this opportunity to remind folks about my <a href="http://www.raymondcamden.com/index.cfm/2007/12/5/The-Complete-Guide-to-Adding-Error-Handling-to-Your-ColdFusion-Application">error handling guide</a>, but it does <i>not</i> go into detail at this level. I would also love to hear non-ColdFusion thoughts as well. I've not yet done enough Flex/AIR work to get this deep into error handling, but if any of my readers have, please share as it would be an interesting perspective.