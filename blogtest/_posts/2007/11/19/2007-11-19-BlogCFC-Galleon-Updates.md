---
layout: post
title: "BlogCFC, Galleon Updates"
date: "2007-11-19T21:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/19/BlogCFC-Galleon-Updates
guid: 2484
---

Just a quick note to point out some updates. <a href="http://blogcfc.riaforge.org">BlogCFC 5.9</a> has been updated to include some small fixes. There are some more fixes that will be included - probably this weekend. As I mentioned with the initial release - 5.9 is the end of the line for 5.X version, but I don't want to leave small, easily fixable bugs in the code base while folks wait for 6.

Next - <a href="http://galleon.riaforge.org">Galleon</a> was updated to <i>finally</i> support Access. I'm sorry I didn't ship that out sooner. Frankly I wish Access would just go away, but I know some of my users still want to use Access, so hopefully this release will resolve those issues.

Now let me talk a bit more about the BlogCFC changes as I think the issue will be something my readers may want to think about. First off - thanks to <a href="http://blog.pengoworks.com/blogger/">Dan Switzer</a> for finding these bugs. One of the things I 'preach' when I do my security class is to remember that whatever security applies to page A also needs to apply to page B. BlogCFC's main index page uses a setting, releasedonly, to tell the back end to only fetch released blog entries. This setting is not used in the Admin. I forgot this setting in both the search and RSS page, so it was possible for these files to reveal unreleased entries. So theres two problems here. First - my code should default to released only. Always default to the safer version, Raymond! Second - my rule of always applying the same security should have been applied to every page grabbing entries. So good catch there by Dan!