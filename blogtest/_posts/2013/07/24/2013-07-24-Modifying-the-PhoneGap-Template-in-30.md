---
layout: post
title: "Modifying the PhoneGap Template in 3.0"
date: "2013-07-24T13:07:00+06:00"
categories: [html5,javascript,mobile]
tags: []
banner_image: 
permalink: /2013/07/24/Modifying-the-PhoneGap-Template-in-30
guid: 4991
---

A few months back I wrote a <a href="http://www.raymondcamden.com/index.cfm/2013/1/24/Tip-for-PhoneGap-Users--Modify-the-WWW-template">quick blog entry</a> on how you can modify the default www template used when creating new PhoneGap projects. While not a problem for most people, I tend to create a crap load of PhoneGap projects so I can test various <i>mission critical important</i> features. So it bugs me when I have to go in and remove the pretty, but useless to me, boilerplate code. Currently there is an <a href="https://issues.apache.org/jira/browse/CB-4153">open bug</a> to allow for something along these lines at the command line, but in the meantime, you may be wondering where the default template exists now.
<!--more-->
Previously the installation instructions for PhoneGap included downloading the zip. In that zip you could find the template directory used by news app.

In the post-3.0 world this is a bit different. After you've done you installation via npm, you can find the bits at:

/Users/ray/.cordova/lib/www/phonegap/3.0.0/www

Obviously this folder would be slightly different for Windows, and obviously the 3.0.0 will be different as time goes on. 

Here is my <strong>much superior</strong> default template that I humbly offer to the PhoneGap team for their consideration.


<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Jul 24, 2013 12.05.27 PM.png" />