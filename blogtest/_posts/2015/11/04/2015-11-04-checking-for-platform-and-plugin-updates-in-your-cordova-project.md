---
layout: post
title: "Checking for platform and plugin updates in your Cordova project"
date: "2015-11-04T14:31:55+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/11/04/checking-for-platform-and-plugin-updates-in-your-cordova-project
guid: 7058
---

Earlier today the Cordova team announced an important update for the iOS platform (<a href="http://cordova.apache.org/announcements/2015/11/02/cordova-ios-3-9-2.html">Apache Cordova iOS 3.9.2</a>). I thought it might be worthwhile to discuss how you can check your platforms and plugins for updates. It isn't a complex process, but it is probably something to make part of your routine management in your organization. As I don't manage one application but build lots of silly demos, I don't necessarily have to worry so much about this. Despite that, I was curious so I did a bit of digging.

<!--more-->

Let's discuss platforms first. In a Cordova project, you can type <code>cordova platforms</code> to get a list of installed and available platforms. Here is an example:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot1.png" alt="shot1" width="750" height="92" class="aligncenter size-full wp-image-7059" />

Notice how at the end of each installed platform the current version is printed. Cool. But given that you aren't following the Cordova blog, how would you know a newer version of the iOS platform existed?

Shaz (from the Cordova team) pointed out that the CLI supports a "check" command - this was something I had missed! According to the CLI docs, running <code>cordova platform check</code> will "list platforms which can be updated by `cordova platform update`". 

Cool. Unfortunately, in my testing, it was pretty broken. I tested against three or four projects and only once did it see an update and it never reported that my iOS platform could be updated. From what I can tell with conversations with Shaz and others, this feature hasn't been properly tested yet so it needs some work. However, if you are reading this in the future, <strong>try this first</strong> as it is the most direct way of reporting on your platforms. If your curious about the bugs I reported, you can find them here: <a href="https://issues.apache.org/jira/browse/CB-9951">CB-9951</a> and <a href="https://issues.apache.org/jira/browse/CB-9953">CB-9953</a>.

The alternative for now is to use npm. The platform code all exists on npm and all you need to do is figure out the package name of the platform itself. This is rather easy to guess for iOS and Android:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot2.png" alt="shot2" width="750" height="128" class="aligncenter size-full wp-image-7060" />

If you choose to update, you can simply <code>cordova platform update ios</code> and if you decide you made a huge mistake, you can install an earlier version by doing <code>cordova platform update ios@X</code> where X is a version. To be honest, in the past I've also remove and re-added a platform. That's silly, but I've done it.

So - what about plugins? Running <code>cordova plugin ls</code> will report on installed plugins and their versions:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot3.png" alt="shot3" width="750" height="252" class="aligncenter size-full wp-image-7063" />

Unfortunately, there is no "check" command like we have with platforms (broken or not), so you'll need to use npm info again to see if new versions exist:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot4.png" alt="shot4" width="750" height="125" class="aligncenter size-full wp-image-7064" />

There is no upgrade command either, but you can rm and add a plugin in a few seconds so just do that and you're set.

But wait! There's more. Don't forget your CLI also has a version. It is easy to check both your version and the latest release:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/11/shot5.png" alt="shot5" width="750" height="103" class="aligncenter size-full wp-image-7065" />

So now that you've chewed on that a bit - let's hear from Steven Gill, also from the Cordova project:

<blockquote>
Btw, the plan is to move towards stop advising users to update platforms independently (except patch releases like this one). Instead we will only tell users to update cli and add a command (cordova update) that would update necessary platforms and plugins based on new pinned versions in cordova-lib. (Plugins will start to be pinned soon). That way we can verify the mix of plugins, platforms and tools have been tested together.
</blockquote>

So my translation is - it's going to get simpler. That's <strike>good</strike>great.