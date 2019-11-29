---
layout: post
title: "SVNStalker POC"
date: "2010-04-08T01:04:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2010/04/08/SVNStalker-POC
guid: 3774
---

Earlier today I was talking with a friend and mentioned that I wasn't sure when one of my repositories had last been updated. Obviously I could have opened up my SVN client and checked the history, but it would be nicer if there was a quicker way. He recommended a Windows application that I thought was pretty cool. (And unfortunately, I forgot the name and he is offline.) It monitored SVN repos and when commits were made, a Growl-type window would appear on the desktop. The user could also quickly browse the last set of revisions as well. Seeing that I thought - I bet I could make an AIR application out of it. Here is what I came up with.

<p/>

I began by doing some Googling for how to communicate with Subversion. I discovered <a href="http://dougmccune.com/blog/2009/01/20/accessing-svn-repositories-with-actionscript/">this post</a> by Doug McCune. Turned out he had an ActionScript library that did exactly what I wanted. Check his blog entry for details, but here is a quick example of the type of code you can use to get the latest revisions from a repository:

<p/>

<code>
svnClient = new SVNClient()
svnClient.addEventListener(SVNRevisionListEvent.REVISIONS_LOADED, revisionsLoadedHandler)
svnClient.getLatestRevisions(svnurl, 10, true)	
</code>

<p/>

Pretty darn simple, right? That 3rd argument to getLatestRevisions just tells the code to get detailed information about the revision, specifically details on the files updated in the revision.

<p/>

For the next part, I needed a Growl style display. Now I'm still pretty darn new at Flex and creating styled windows is something I'm not familiar with yet. Luckily <a href="http://www.firemoss.com/">Joe Rinehart</a> has a package for this called Toast. I don't believe he is "officially" offering it, but he gave me permission to share it in this blog post. Here is a quick example of how easy it is:

<p/>

<code>
createHowl("Revision "+revision.revisionNumber,revision.comment + "\nBy "+revision.creatorName+" at " +revision.date)					
</code>

<p/>

Woot. Once again, simple. Most of my work was done already. So I took these packages - and some code I had created for an earlier project, and quickly wrote up a proof of concept I call SVNStalker. Upon running it, it will stay in your OSX Dock or Windows taskbar. It begins by asking you for a SVN URL, username, and password. Currently it does <b>not</b> support the username or password. So um, don't use it.

<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-04-07 at 11.04.20 PM.png" title="Preferences page." />

<p/>

After you enter a SVN url, the application will ping the server every minute. It will download the last 10 revisions and create a Growl message for each. 

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-07 at 11.05.10 PM.png" title="Growl, baby!" />

<p/>

If you miss a Growl, or close it, you can right click in the Dock/Tray and select "View Revisions". This opens a simple window that lets you browse the revisions in memory:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-04-07 at 11.05.34 PM.png" title="Revision View" />

<p/>

All in all, this took me maybe one hour - but again - a large majority of the work was already done. The code (my code, not the code I borrowed from Doug and Joe) is pretty damn messy. I whipped this up <b>quick</b> so please don't laugh too much. This could be  updated to do quite a lot more:

<ul>
<li>Multiple SVN repos.
<li>Different Growl colors based on repo.
<li>Different Growl colors based on keywords or user submitted revision.
</ul>

Anyway, hopefully this is useful/interesting. You can download both the source and the AIR installer below.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FSVNStalker%{% endraw %}2Ezip'>Download attached file.</a></p>