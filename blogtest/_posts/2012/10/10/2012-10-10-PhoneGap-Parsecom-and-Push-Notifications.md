---
layout: post
title: "PhoneGap, Parse.com, and Push Notifications"
date: "2012-10-10T17:10:00+06:00"
categories: [javascript,mobile]
tags: []
banner_image: 
permalink: /2012/10/10/PhoneGap-Parsecom-and-Push-Notifications
guid: 4755
---

<b>Edit on March 7, 2013: Please read this <a href="http://www.raymondcamden.com/index.cfm/2013/3/7/Testing-PhoneGap-Parse-and-Push-Read-This">blog entry</a>.</b> 

As I've been working my way through a sample application that makes use of <a href="http://www.parse.com">Parse.com</a> and <a href="http://www.phonegap.com">PhoneGap</a>, I wanted to take a look at how Parse handles Push Notifications. I assumed it would be easy and I'd simply include it into my series, but it turned out to be a more complex than I anticipated. Therefore, I've decided to blog about it on its own so as to keep things as simple and direct as possible.  In the end, the process to get notifications working with PhoneGap and Parse wasn't terribly difficult, but there are a few things you have to orchestrate just right to get the desired results.
<!--more-->
The first thing I need to warn you about is that notifications are going to be slightly different based on each platform. In general, you can do many of the same things between Android and iOS, but there are a few differences. You can take a look at the <a href="https://parse.com/docs/android_guide#push">Android docs</a> and the <a href="https://parse.com/docs/ios_guide#push">iOS docs</a> as well as checking out a  <a href="https://parse.com/tutorials/ios-push-notifications">video</a> the Parse team made just for iOS. You may notice that the JavaScript API has a section on Push Notifications as well, but it only supports <i>creating</i> new notifications. This confused me for a while until I remembered that outside of native applications, it wouldn't make sense for JavaScript to handle receiving notifications. Therefore, you have to use a native solution. Luckily PhoneGap allows us to do that <i>and</i> make use of the JavaScript API as well.

In this blog post I'll be using Android. Only the initial setup aspects though will be Android specific, The PhoneGap code we use later should work fine in iOS as well.

Note though that you will need to get your hands dirty a bit and work with Java. You don't need to actually write any Java, but this does mean that PhoneGap Build will <b>not</b> be an option for apps making use of notifications. I used Eclipse for my application but you can probably get away with just using the command-line tools with PhoneGap. 

<h2>Part One - Eclipse/Java Setup</h2>

Ok, so let's get started. First - create an Android PhoneGap project. I used the <a href="http://www.mobiledevelopersolutions.com/home/start">AppLaud</a> plugin to make it super easy. I tend to be antsy about such things so before I did anything else I confirmed it ran on my mobile device. Also, I assume you have some Parse.com application already created. I'm not talking about a mobile application I mean an application defined at Parse's web site. I made use of my CowTipLine application.

Go to the <a href="https://parse.com/docs/downloads">Parse downloads</a> and get the Android SDK. Note that this SDK is just a jar file (Parse-1.1.6.jar). Copy this jar file to your PhoneGap project's libs folder:

<img src="https://static.raymondcamden.com/images/ScreenClip136.png" />

At this point you probably want to refresh the view in Eclipse so it recognizes a new file. As we all know, Eclipse gets snooty if you dare to actually use your file system.

Now - following along the Android <a href="https://parse.com/docs/android_guide#push">notifications docs</a>, you're asked to modify your AndroidManifest.xml to add the following lines:

<script src="https://gist.github.com/3868226.js?file=gistfile1.xml"></script>

These lines basically act as a listener for Parse.com push notifications. They will enable your application to recognize and respond to the notifications sent out by the server.

The Parse docs then tell you to add three sets of permissions, but by default PhoneGap already has two of them set. You should only need to add the RECEIVE_BOOT_COMPLETED permission from the set below:

<script src="https://gist.github.com/3868234.js?file=gistfile1.xml"></script>

Ok, now you need to get into the Java a bit. When you created your application, you had to give it a package name. I called mine org.camden.test1. I ended up with a Java file called MyPhoneGapActivity.java. You can find this under the src folder.

<img src="https://static.raymondcamden.com/images/ScreenClip137.png" />

<b>Do not worry about the com.borismus.webintent folder. You will not have it yet and we'll come to that later.</b>

You don't normally need to edit this file if you use the AppLaud plugin. If you built the project by hand following the <a href="http://docs.phonegap.com/en/2.1.0/guide_getting-started_android_index.md.html#Getting{% raw %}%20Started%{% endraw %}20with%20Android">PhoneGap Android guide</a> then you have already worked with this file a bit.

Get this file open, and do the following:

<ul>
<li>Add an import com.parse.*; below your other imports.
<li>Add a Parse.initailize(this, a, b) line in your onCreate method. "a" is your application key and "b" is your client key. 
<li>Finally, add PushService.subscribe(this, "", MyPhoneGapActivity.class). Your "So and So.class" will differ depending on the name of your file. This line handles telling the application to listen in for messages from Parse. Parse supports multiple channels for filtered notifications, but the empty string represents the "broadcast" channel.
</ul>

Here is my entire Java file.

<script src="https://gist.github.com/3868272.js?file=gistfile1.java"></script>

Ok, at this point you want to ensure the application still compiles. Hit the nice little green arrow Eclipse button to rerun the application. In theory, you will see nothing different, but you want to ensure it at least runs ok on your device. Also, by running the application once, your application "subscribes" to push notifications from your application on Parse. That will be crucial for the next step.

<h2>Testing Notifications at Parse</h2>

I know I sound like a Parse fanboy (even though they don't seem to want to ever tweet about my blog posts ;) but I cannot stress how nice the developer tools are at Parse. Creating messages can be done with Android, iOS, REST, and the <a href="https://parse.com/docs/js_guide#push">JavaScript API</a>. But they went ahead and built in a push notifications panel on their application dashboard:

<img src="https://static.raymondcamden.com/images/ScreenClip138.png" />

I recognize that screen shot has a lot of information on it, so let me quickly review it. You can see a list of all previously sent messages on top. Beneath it is a form to let you send messages. I mentioned above that applications can choose to subscribe to a particular channel. What channels you use are entirely dependent on your application. For now you will just ignore this and use the default <b>Broadcast</b> channel. In the Push Data box, keep the radio button at the default (Message) and enter something wise.

<img src="https://static.raymondcamden.com/images/ScreenClip139.png" />

Hit the Send button and you should see - pretty darn immediately - the alert arrive on your device:

<img src="https://static.raymondcamden.com/images/device-2012-10-10-155033.png" />

You can even close the application. If you send a new notification and select it in your Android... err.... whatever they call it (notification tray?) your application should open up. 

Congratulations. You can now send notifications to your device.

<h2>Responding Intelligently to Notifications</h2>

So all of the above took me less than an hour. It was pretty cut and dry. But then I hit a pretty big roadblock. How could I make my application recognize when it was loaded via a notification and actually tell me what the notification was? 

From what I read in the Android docs, it seemed to imply that you had to write a custom Java class. I wasn't opposed to this, but I really wanted a solution that would let me use JavaScript to respond to the notification. 

I went back to the article I wrote back in May about <a href="http://www.raymondcamden.com/index.cfm/2012/5/1/Example-of-Intents-with-PhoneGap">Intents and PhoneGap</a>. In that article I discussed how the <a href="http://smus.com/android-phonegap-plugins/">WebIntents</a> PhoneGap plugin would give us access to both creating and responding to intents with JavaScript. 

I won't repeat the instructions from that article, but the basics are - you copy the jar from that plugin (remember in that first screen shot when I said you wouldn't have that particular folder?) as well as the JavaScript file and then add a script tag reference in your index.html to load it.

The WebIntents plugin has a few APIs, but the ones we care about are hasExtra and getExtra. hasExtra is used to see if extra "stuff" was passed in from the intent that loaded us and getExtra is what actually gets the data. This is where I got stuck though. The WebIntents docs show using a few constants (EXTRA_TEXT, EXTRA_SUBJECT, EXTRA_STREAM, and EXTRA_EMAIL) and I assumed I had to use one of those four. I built quick blocks of code to check for all four, updated my application on the device, sent a message, clicked on the notification, and waited to see which JavaScript block would pass the getExtra test. Unfortunately none of them did.

At this point I figured I was pretty much toast. I Googled a bit. Scratched my head. Pouted a bit too. Finally, I tried something new. In my getExtra call, I tried using what I had seen as a class related to Push Notifications:

window.plugins.webintent.hasExtra("com.parse.Data"

To my surprise, this worked! So it turns out the WebIntent plugin's JavaScript API can work with any form of intent data as long as you know the proper identifier. I quickly whipped up the following:

<script src="https://gist.github.com/3868387.js?file=gistfile1.js"></script>

All I do is run the has test followed by a get call. I take the data, JSON stringify it, and log it to my console. 

<img src="https://static.raymondcamden.com/images/ScreenClip140.png" />

And that's it. Obviously real code would parse this data and do, well, whatever you want with it. As should be clear from the Parse.com form, you can send more than simple messages. Complex structures of data can be sent to your listening devices. Again, the whole Push Notification feature as a whole is <i>very</i> powerful. I definitely encourage you to look at it yourself, and knowing that you can use it within PhoneGap as well just makes it even better.

If you have any questions, or suggestions for improvement, just leave a comment below.