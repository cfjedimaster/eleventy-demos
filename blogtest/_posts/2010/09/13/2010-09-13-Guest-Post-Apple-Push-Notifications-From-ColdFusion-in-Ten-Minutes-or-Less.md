---
layout: post
title: "Guest Post: Apple Push Notifications From ColdFusion in Ten Minutes or Less"
date: "2010-09-14T00:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/13/Guest-Post-Apple-Push-Notifications-From-ColdFusion-in-Ten-Minutes-or-Less
guid: 3940
---

So I'm not a big fan of guest posts (I'll admit to being something of a blog diva), but after talking about this with Erik Madsen last week I thought it would be great to share. He doesn't have a blog so I offered to post his text here. (I get 1% credit for pointing him towards one URL.) Anyway, enjoy, and thank you Erik for sharing!

<p/>
<!--more-->
Assuming yesterdays news from Apple that third-party development tools for iOS app development are no longer banned, the Adobe developer community will probably be a rapidly growing segment of iOS app developers in the coming months.  If you're a FlashFlex developer who's excited about the opportunity to develop for iOS, you'll probably run into the need to provide push notifications for your app's users.  I assumed that producing these would be an easy process.  I quickly discovered I was somewhat wrong.

<p/>

Now, I consider myself a developer who manages to do pretty well without actually being as big-brained as some of the folks I look up to.  This is what led me to ColdFusion 15 years ago in the first place.  Since then I've learned a lot but I still run into my limits now and then.  When I run into a road-block, I spend a lot of time on the Google, stackoverflow.com and pestering folks like Ray to lend some of that grey matter.

<p/>

Anyway, the reason I say all of this is because I hit one of those brick walls of mine when I was faced with producing push notifications from ColdFusion.  You see, Apple doesn't provide your typical run-of-the-mill type of restful or wsdl service to create these.  Nope: it's a binary, streaming interface that requires TLS or SSL and you have to use present a trusted certificate from their iOS developer program in order to make the connection.  This really left me stumped.  The Google didn't reveal much of anything.  I think one other CF developer was asking around for a wrapper to the service but ended up in the same place as me - empty handed.  Ray, being all big-brained, Googled for a Java library for Apple Push Notification Service (APNs) and found what I was looking for.  About 15 minutes of work later I had my first push notifications being delivered from ColdFusion to my app on my iPhone 4.  Gratifying! 

<p/>

The first thing you need to do is enable APNs (development, production of both) for your app on the iOS Provisioning Portal.  Push notifications will not work in the iPhone Simulator.  They'll only work for on a provisioned device with an app that has been registered with the iOS Developer Program.  Generate a Certificate Signing Request with the Certificate Assistant in Keychain Access, save it to disk and have Apple sign it.  A few seconds later you can download it and install it on your development machine.

<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-09-10 at 3.55.23 PM.png" />

<p/>

Then you'll need to export the certificate (option-click the certificate) as a Personal Information Exchange (.p12) file.  Place this file in a location accessible to ColdFusion.  Remember the password you set as well.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/s21.png" />
<p/>

Enabling push notifications within the iOS app itself is really easy.  You'll need to register the app for push notifications...

<p/>

<code>
[[UIApplication sharedApplication] registerForRemoteNotificationTypes:(UIRemoteNotificationTypeAlert {% raw %}| UIRemoteNotificationTypeBadge |{% endraw %} UIRemoteNotificationTypeSound)];
</code>

<p/>

and have your App Delegate respond to successes or failures for this request...

<p/>

<code>

- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)devToken { 
    //The device token is available from [devToken description]
    //Send this token to your ColdFusion server to track in the database or whatever
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
    //The request failed for whatever reason, tell your ColdFusion server if necessary
}
</code>

<p/>

Next you'll need the Java library for communicating with APNs.   There's actually two libraries to choose from, but this article will only focus on one - notnoop's java-apns available at <a href="http://github.com/notnoop/java-apns">http://github.com/notnoop/java-apns</a>.  I downloaded the jar file with dependencies.  Place this file in a location accessible to ColdFusion and create a Java classpath in the Cold Fusion Administrator to the file, then restart CF.  You're pretty much ready to go now.

<p/>

The first line of CFML will instantiate the APNS object from the library using your APNs certificate and either the production or sandbox destination.  My app is actually already running in production mode and waiting for Apple review, so I'll use production.

<p/>

<code>
&lt;cfset APNSService = createObject( "java", "com.notnoop.apns.APNS" ).newService()
     .withCert("THE-PATH-TO-YOUR-P12-CERT", "YOUR-P12-PASSWORD")
     .withProductionDestination()
     .build() /&gt;
</code>

<p/>

You'll next need to create a payload that defines the push notification to be sent.  The badge, alertBody and sound properties are all optional, but you need to provide at least one.  My app uses all three...

<p/>

<code>
&lt;cfset payload = createObject( "java", "com.notnoop.apns.APNS" ).newPayload()
				.badge(3)
				.alertBody("Hello, world.")
				.sound("PushNotification.caf")
				.build()/&gt;
</code>

<p/>

The third and final line will send the notification to APNs using the device token I saved earlier.

<p/>

<code>
&lt;cfset APNSService.push(token, payload) /&gt;
</code>

<p/>

Voila!  Push notifications!  I had already stubbed out some methods related to push notifications in my ColdFusion app's components, so modifying this code to work with my actual application was quick and painless.  My app's users were all getting push notifications in seconds of my publishing the update.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Voila.PNG" />

<p/>

The Java library also provides the ability to request inactive device tokens, which you will want to occasionally check for and maintain in your database, as Apple doesn't want you trying to notify devices that have opted out of push notifications for your app or altogether.  From stackoverflow : "Apple will silently drop your connection if it receives an invalid device token or a message that's too long. The next couple of messages after that will fail because they're just sent into the ether, essentially - the connection is closed, but the TCP window isn't exhausted."  http://stackoverflow.com/questions/1759101/multiple-iphone-apn-messages-single-connection