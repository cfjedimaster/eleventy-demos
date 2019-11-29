---
layout: post
title: "Important note for targeting iOS Emulators in Cordova"
date: "2015-10-13T09:39:16+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/10/13/important-note-for-targeting-ios-emulators-in-cordova
guid: 6914
---

With the recent changes to iOS9, I've had to do more testing in iOS 8.4 versus 9.0 when working on Ionic/Cordova applications. It is relatively easy to switch which emulator you are using if you use the --target argument in the CLI:

<!--more-->

<code>cordova emulate ios --target="something"</code>

Of course, the question is, what value do you use for "something"? My coworker Carlos Santana has an excellent answer over on <a href="http://stackoverflow.com/a/22329264/52160">Stackoverflow</a>. Basically if you run:

<code>./platforms/ios/cordova/lib/list-emulator-images</code>

You will get a list of valid targets for your simulator. As an aside, how many of you ever dig around in your platforms folder? Did you even know this tool existed? Should I write up an exploration of this folder? Ok, stay on target, Raymond.

Running this command will give you output that looks like this:

<pre><code>
iPad-Air, 8.4
iPad-Air, 8.4
iPad-Air, 8.4
iPad-Air, 9.0
iPhone-6, 8.4
iPhone-6, 8.4
iPhone-6, 8.4
iPhone-6, 9.0
iPhone-6-Plus, 8.4
iPhone-6-Plus, 8.4
iPhone-6-Plus, 8.4
iPhone-6-Plus, 9.0
</code></pre>

The list above is about half of my list and your list will be different. Ok, problem solved, right? Not so fast. What happens when you try to target the 8.4 version of the iPhone?

<code>cordova emulate ios --target="iPhone-6, 8.4"</code>

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shotA.png" alt="shotA" width="750" height="193" class="aligncenter size-full wp-image-6915" />

Wtf? Confusing, right? If you keep reading on that StackOverflow page, you come to <a href="http://stackoverflow.com/a/29705666/52160">this answer</a> by Ruslan Soldatenko. He points out that the <code>platforms/ios/cordova/lib/run.js</code> file has a specific list of allowed targets. I'm sure there is a good reason for this. Maybe the Cordova CLI doesn't want to keep asking the system for valid targets. Either way, if you open it up, you will find a line like this:

<pre><code class="language-javascript">var validTargets = ['iPhone-4s', 'iPhone-5', 'iPhone-5s', 'iPhone-6-Plus', 'iPhone-6',
        'iPad-2', 'iPad-Retina', 'iPad-Air', 'Resizable-iPhone', 'Resizable-iPad'];</code></pre>

Add "iPhone-6, 8.4" to the end of the array and you are good to go... for this project only. You'll need to modify this line in every project you work with where you need to target different iOS versions.

As an aside, this (obviously) applies to Ionic and their CLI.