---
layout: post
title: "Open Discussion - Mobile Application Security"
date: "2010-11-18T09:11:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2010/11/18/Open-Discussion-Mobile-Application-Security
guid: 4018
---

<img src="https://static.raymondcamden.com/images/cfjedi/mobile-phone-security-software.jpg" style="float:left;margin-right:5px" />This question came in via my <a href="http://www.raymondcamden.com/forums">forums</a> but I thought it would be great to bring it up here and reach a bigger audience. wolfee asked:
<br clear="left">

<blockquote>
I've been curious lately as to how the security coding differs when comparing mobile apps to standard server-to-client computer apps. For instance, if I wanted to design a mobile app capable purchasing products or performing banking transactions from a cell phone, aren't there levels of security considerations which would not be present otherwise? Or is the "security code best practices check list" exactly the same for either type of app? Thank you for reading and for any tips/help.
</blockquote>

So - considering the fact that I'm about as new to mobile development as you can get, I'm definitely not qualified to answer this question. (Although it won't stop me from offering up a bit of advice anyway. ;) This is definitely a critical topic as there is a tremendous shift towards the mobile space and - obviously - <b>security always matters</b>. Here is just a tiny bit of advice I can offer now. I hope my readers can help flesh this out (especially with any good URLs they may have).

1) Don't assume the traffic between your mobile app and the server is secure. If the traffic goes over wifi, anyone with a sniffer can pick up the communication. 

2) Don't assume your code is secured. I know that for an AIR/Android app I had the option to add copy protection to the application when I uploaded. I've got no idea what that does - but I assume it encrypted the binary data a bit. However - I'd assume folks can get to the file system of your mobile device and at least inspect the bits. A good example of that would be a SQLite database. On the desktop, you can easily create a database and store it in the application directory. I don't know what that directory would be on an Android (I plan on testing it today now that it occurs to me), but I'd assume it wouldn't be hard to copy the database off the phone and onto the desktop. SQLite within AIR allows for easy encryption so it isn't a big deal - but I guess my point here is to not assume the phone is "locked" so that a user can't get to the bits. 

3) In some regards I'd say your comment about the checklist being the same is partially correct. I wouldn't say that the checklist is the exact same - but I'd say at minimum the things you do in a desktop/web app <i>also</i> apply at minimum in the mobile space. A good example (I think) would be to ensure that if a user requests resource X that they have permission to so. For example, imagine you let people edit blog content they own. This is done via some URL like so:

www.mysite.com/remoteapi.cfc?method=editblog&entry=1

Previous to this call, you got a list of valid IDs for the current user, and 1 was in that list. You should not assume that when they perform the edit and ask for id N that it is actually one they have access to.

So again - that's not mobile specific - but if I were building an Ajax app, Web 1.0 app, or a desktop AIR app, I'd have to keep it in mind. Ditto for mobile. 

What about you guys? Those of you doing mobile development - what tips do you have? What resources do you use? Are there automated testing tools available?

Those of you <i>not</i> doing mobile development - is worrying about security one of the reasons you haven't jumped yet?