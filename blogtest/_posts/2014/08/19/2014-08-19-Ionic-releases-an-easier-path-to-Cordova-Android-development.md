---
layout: post
title: "Ionic releases an easier path to Cordova / Android development"
date: "2014-08-19T18:08:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/08/19/Ionic-releases-an-easier-path-to-Cordova-Android-development
guid: 5290
---

<p>
I promise - I'm not turning into a <i>complete</i> Ionic fan boy, but if you want to call me an unofficial evangelist for them (especially since I don't do that for Adobe anymore), I certainly won't mind. This weekend I was working on the book I'm writing covering Cordova, and as part of that process I worked through the <i>complete</i> setup for doing Cordova development with Android. Most of the time I use iOS but for the book I wanted a platform anyone could use. In fact, I specifically did my testing in Windows since I know that many people use Windows and Cordova development has been a bit tricky there in the past.
</p>
<!--more-->
<p>
It had been a <i>long</i> time since I went through the complete process. What I discovered is that while it is relatively straightforward, there are more steps than I remembered and you <i>really</i> need to pay attention or it is easy to screw up one of the prerequisites. I think my chapter does a great job of discussing this process, but as I said, it was surprising just how much you have to do to get up and running. 
</p>

<p>
So I find this new post by the Ionic team to be very timely: <a href="http://ionicframework.com/blog/ionic-vagrant-android/">Faster Hybrid Dev with Ionic Vagrant</a>. I had some exposure to <a href="https://www.vagrantup.com/">Vagrant</a> at CFObjective a few weeks back but I had not actually used it for anything. Vagrant allows you to build development environments - think operating systems with applications and configurations - via a scriptable interface. What this means is - in an ideal world - a person can download a Vagrant image - set it up - and have everything ready to go. I've been through enough projects to know that something like this could be a <strong>huge</strong> timesaver.
</p>

<p>
To help with Android/Cordova development, the Ionic folks have released an <a href="http://github.com/driftyco/ionic-cordova-android-vagrant">Ionic Vagrant</a> image. What this means is - after installing Vagrant - you can download their zip, unzip, and type <code>vagrant up</code>. And that's it. The first time you run this be prepared for a long wait. For me it took about 20-25 minutes, and during part of the process I saw some red error messages, but it eventually wrapped up at the end - I had a complete operating system. 
</p>

<p>
With Android.
</p>

<p>
With Cordova.
</p>

<p>
And with Ionic.
</p>

<p>
Hell, screw Ionic (sorry guys!), even if you don't give a rat's mustache about Ionic, this is a <strong>huge</strong> timesaver in terms of getting up and running with Cordova. If you do decide to check it out, here are a few things to watch out for.
</p>

<p>
Number one - the commands to check for a connected device require sudo. This is covered on the <a href="https://github.com/driftyco/ionic-cordova-android-vagrant">GitHub</a> and from what I can tell, you <i>will</i> run into this issue. Just do exactly as described:
</p>

<code>
sudo /home/vagrant/android-sdk-linux/platform-tools/adb kill-server
sudo /home/vagrant/android-sdk-linux/platform-tools/adb start-server
</code>

<p>
And follow up with <code>sudo /home/vagrant/android-sdk-linux/platform-tools/adb devices</code> to ensure your device shows up.
</p>

<p>
Number two - how do you edit files? For my first test I used <code>ed</code>, but I wouldn't recommend that. (Old school MUD coder here - I used to be a wiz with ed.) Vagrant supports the concept of <a href="https://docs.vagrantup.com/v2/synced-folders/index.html">synced folders</a>, which means you can edit using your preferred browser tools while the files are available to the Vagrant image as well. Thanks to Max Lynch for helping me out with this as I found the docs to be a bit weird. Here is how it works in a nutshell.
</p>

<p>
If you expanded the image zip to /Users/ray/Downloads/ionic-cordova-android-vagrant-0.1.1, then that folder is available on the image as /vagrant. So while SSHed into the image, I went to /vagrant and made a new Ionic project called android2. It showed up in Finder right way.
</p>

<p>
<img src="https://static.raymondcamden.com/images/vagrant.png" />
</p>

<p>
I opened this up in Sublime, edited, and went back in Terminal, and sent the project to my Android device. It felt <i>completely</i> the same as normal development. (To be clear, when I SSHed into the image, I did it via Terminal, and you end up ... in Terminal, so this is probably assumed, but I wanted to be clear this wasn't like a VMWare visual type thing.)
</p>