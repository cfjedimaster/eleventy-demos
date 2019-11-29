---
layout: post
title: "Targeting a device type with Cordova Emulate"
date: "2014-07-21T17:07:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/07/21/Targetting-a-device-type-with-Cordova-Emulate
guid: 5271
---

<p>
Today I've got yet another Cordova tip that was probably known to most people. I'm working on a sample application that needs to run on an iPad, not an iPhone, but the problem was that every time I ran <code>cordova emulate ios</code>, it would fire up the application in an iPhone. If I switched the hardware in the iOS simulator settings it would work, but when I recompiled and reran, it reverted to an iPhone. Turns out, there is a simple solution for this.
</p>
<!--more-->
<p>
I had never noticed this, but <code>cordova emulate</code> is simply an alias for <code>cordova run --emulator</code>. If you run cordova at the command line with no arguments, you will see a few options for the run command. These options include device and target. If you check the <a href="http://cordova.apache.org/docs/en/3.5.0/guide_cli_index.md.html#The{% raw %}%20Command-Line%{% endraw %}20Interface">docs</a> for the CLI, it doesn't specify what these do. To be honest, I was a bit confused at first. 
</p>

<p>
The --device flag is simply a way to say that you want to run the code on a device. Which is what <code>cordova run</code> means anyway, but the flag is there (as far as I can tell) for completeness sake to be the corollary to the --emulator flag.
</p>

<p>
The --target flag is the interesting one. This too isn't documented, but if you open up projectroot/platforms/ios/cordova/run, it is documented in the shell script. 
</p>

<pre><code class="language-markup">
# Valid values for "--target" (case insensitive):
#     "iPhone (Retina 3.5-inch)" (default)
#     "iPhone (Retina 4-inch)"
#     "iPhone"
#     "iPad"
#     "iPad (Retina)"
</code></pre>

<p>
Pretty simple, right? So for my testing, the solution was simple: <code>cordova emulate ios --target="iPad"</code>. Worked like a charm. I also looked into the Android folder and while there wasn't a simple list, from what I can see you can pass the name of an AVD. So for example, I've got an AVD called KitKat, so I was able to do: <code>cordova emulate android --target=KitKat</code> and it fired up the bits in that particular emulator. (Although I'm sure as hell trying to avoid the emulator now that I've got <a href="http://www.genymotion.com/">Genymotion</a> working well.)
</p>

<p>
p.s. Thanks to devgeeks and shazron in IRC for helping me with this post!
</p>