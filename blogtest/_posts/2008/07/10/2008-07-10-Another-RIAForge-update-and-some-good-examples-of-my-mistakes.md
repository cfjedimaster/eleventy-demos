---
layout: post
title: "Another RIAForge update, and some good examples of my mistakes"
date: "2008-07-10T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/10/Another-RIAForge-update-and-some-good-examples-of-my-mistakes
guid: 2924
---

I had a moment yesterday to take another look at <a href="http://www.riaforge.org">RIAForge</a> and it's ongoing issues. This time I focused on a problem with the project, <a href="http://projecttracker.riaforge.org/">Project Tracker</a>. For some reason this project would take around 60 seconds to render the home page. Other projects were much faster. As far as I could tell, nothing was special about that project, but everything about it was just horribly slow, almost unusable. I did some digging and finally found a slew of things that I had screwed up. Here they are in no particular order.
<!--more-->
The number one issue was a controller method named getProjectView. This method is used on the home page for a project (and other views as well) and is the primary "get the project crap" method. It does multiple operations that the front end will need when rendering the page. One of the operations was a bit unique. It would use the SVN interface to get a list of files. It would get <i>all</i> the files for the entire repository. It would then use a query of query to see if at least one entry was a file, not a directory. 

The whole point of this operation was to just see if any real files existed in the repo. If so, on the front end I'd offer a link to get the latest as a zip. 

Now I knew this was a bit slow, so I used Model-Glue's caching system to cache the result for 10 minutes, and here is where part of the problem lie. My code basically did:

<code>
if in cache, return value
else
  get all files
  check for a file
  set result in cache
end if
</code>

And lastly, everything was wrapped in try/catch. But get this. If an error was thrown, I didn't cache anything. So if the operation timed out (which could happen with a large repo), then I never cached the result. So every time you hit the project it would try again to get the result, and time out again.

Ugh. Dumb. I should have cached a negative result in the cfcatch at least. And I probably should have rethought the whole idea in general. Getting the entire repo must have made sense at the time, but maybe I was on crack.

So for now what I did was simply comment out the <i>entire</i> block, essentially removing the feature. I'm fine with that (and I hope you are too) as I'd rather wait till the new CF/SVN code is put online.

So what else did I do stupid? In caching, the trusted cache was <b>not</b> turned on, even though I thought it was. Just goes to show you - it doesn't hurt to recheck the Admin settings even when you are "sure" you set things right.

Another issue - I use Reactor, although in a minor way, and for some reason I pushed the code up with "development" mode for Reactor instead of production.

There is nothing more humbling then finding a whole slew of issues like this in your own code. Hopefully this blog post will help others avoid the same mistake!