---
layout: post
title: "Ask a Jedi: Remote access blocked by a host?"
date: "2008-02-21T07:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/21/Ask-a-Jedi-Remote-access-blocked-by-a-host
guid: 2663
---

Scott asks:

<blockquote>
<p>
I am having an issue with hosting my CF8 application.  I
know your not in the hosting business but I'm wondering if you could offer some advise.

I have written this nice new applicaton that utilizes alot of the cool new CF8 ajax features, specifically the html CFGRID and CFAJAXPROXY (&lt;--Coolest tag in the world by the way).  The problem I'm having is I'm using a
shared hosting environment. Since I'm on a shared server, I can not use remote functions for what I'm told are security reasons.  I've read alot on these features and what I've found so far is that my functions has to be remote
in order to bind them to a cfgrid or a cfajaxproxy.

Is there any way to get around having to have the functions that bind to cfgrid or cfajaxproxy be remote?  Or is the only way I get to use these cool new features is to fork out
the bucks for my own server?  My own dedicated server is simply not in my budget at the time.
</p>
</blockquote>

I had to reread this a few times. I've got a bad head cold and am still on my first cup of coffee, but this seems crazy. First off - as far as I know, there is no way to block remote access to a CFC at the server level. Just to be anal, you should confirm this. If you have a CFC named foo with remove method goo, open your browser to:

http://www.yoursite.com/foo.cfc?method=goo

You should see a WDDX-encoded response. Again, as far as I know, no setting in the CF Admin lets you prevent remove CFC methods from firing. I'd love to know the name of this host because they obviously don't know what they are talking about. (And if I'm wrong, I'll blame the cold for being dumb. ;)

Now with that being said - one common problem people have with shared hosting and the new tags in CF8 is the availability of the CFIDE javascript files. All of the JavaScript necessary to run the new fancy Ajax crap is located uner /CFIDE. If your web site doesn't have access to /CFIDE, then your page will not work correctly. You can confirm this very quickly using Firebug. If so - just have your host add /CFIDE/scripts as a virtual folder to your web server and you should be fine.

Finally - yes - the Ajax features that integrate with CFCs must hit remote methods. Technically you can also hit CFMs instead, and have the CFMs run the CFC methods. That would let you use non-remote methods for the CFCs. It would also let you use Application-scoped CFCs for your Ajax calls.