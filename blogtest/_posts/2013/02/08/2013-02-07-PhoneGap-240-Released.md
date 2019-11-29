---
layout: post
title: "PhoneGap 2.4.0 Released"
date: "2013-02-08T09:02:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2013/02/08/PhoneGap-240-Released
guid: 4850
---

The title pretty much says it all. PhoneGap 2.4.0 was released today. You can read the official blog entry on it here: <a href="http://phonegap.com/blog/2013/02/07/phonegap-240/">PhoneGap 2.4.0 Released</a>.

The blog entry only makes mention of the Cordova CLI tools being rolled in. These tools make PhoneGap <i>incredibly</i> easy to use. Holly Schinsky <a href="http://devgirl.org/2012/10/04/cross-platform-phonegap-aka-cordova-project-templates-in-a-jiffy/">blogged</a> about them a few months ago. They kind of act like a "meta" tool for the core PhoneGap command line tools. You can quickly generate projects for multiple operating systems as well as quickly build and deploy them to testing devices. If you haven't checked out these tools yet, please give them a shot. You can find the official docs for them <a href="https://github.com/apache/cordova-cli/blob/master/README.md">here</a>.

The changelist for 2.4.0 may be found <a href="https://github.com/phonegap/phonegap/blob/2.4.0/changelog">here</a> and has a few interesting tidbits. Hopefully we will see further details in the future. Right now these in particular interest me:

Android<br/>
7530c21 Full binary data support.<br/>
a120614 Initial input type=file support<br/>

If "full binary data support" implies we can use binary data from JavaScript (by the way, you know modern desktop browsers support that, right?) it will mean some APIs I've had trouble with in the past should start working again. In particular, you can't push files to Parse.com because of this. (There is a workaround though where you can push to S3 and simply have Parse use a S3 URL for the property.)

If I can dig up more on this, I'll let yall know.

Another new feature (that isn't documented yet) is the ability to use slices in file reading. This means you can read a portion of a file as opposed to the entire thing.