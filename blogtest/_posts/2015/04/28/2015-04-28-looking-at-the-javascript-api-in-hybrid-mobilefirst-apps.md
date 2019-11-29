---
layout: post
title: "Looking at the JavaScript API in Hybrid MobileFirst Apps"
date: "2015-04-28T13:22:39+06:00"
categories: [html5,javascript]
tags: [mobilefirst]
banner_image: 
permalink: /2015/04/28/looking-at-the-javascript-api-in-hybrid-mobilefirst-apps
guid: 6073
---

I've been blogging lately about hybrid apps and <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a>, and today I thought I'd start investigating the <a href="http://www-01.ibm.com/support/knowledgecenter/SSHS8R_7.0.0/com.ibm.worklight.apiref.doc/apiref/r_ibm_worklight_client_side_api_.html">JavaScript client-side API</a> portion of the product. These are API methods you have available to you in your hybrid application. For today, I'm going to focus on the <a href="http://www-01.ibm.com/support/knowledgecenter/api/content/SSHS8R_7.0.0/com.ibm.worklight.apiref.doc/html/refjavascript-client/html/WL.App.html">WL.App</a> namespace.

<!--more-->

Here are the (non-deprecated) methods of WL.App, along with some thoughts and suggestions on how you could possibly use them in your application. 

<h4>getDeviceLanguage/getDeviceLocale</h4>

The first returns the language <i>code</i>, not the name, so for me it would be <code>en</code>, not English. Locale will also be the code, so <code>en_US</code> for example. So how does this compare to the Globalization API? The biggest difference is that these are synchronous, which to me seems to make a bit more sense. 

<h4>getServerUrl/setServerUrl</h4>

These get and set the MobileFirst server url. I don't imagine there are often times when you would want to set the URL, but perhaps for testing purposes you may want to switch the URL being used on the fly. I could see the getter then being used to provide feedback about which server is currently being used. Make note that the API here uses <code>Url</code> in the method names. Later on you will see a method using <code>URL</code>.

<h4>hideSplashscreen/showSplashscreen</h4>

I've already talked a bit about this in regards to <a href="http://www.raymondcamden.com/2015/03/30/working-with-ibm-mobile-first-and-ionic-a-follow-up">bootstrapping an Ionic</a> application under MobileFirst. 

<h4>overrideBackButton/resetBackButton</h4>
Only applicable to Android and Windows Phone 8, this lets you change the behavior of the device back button. Having a reset there is handy to quickly go back to the system default.

<h4>openURL</h4>

So yes - this is <code>URL</code> not <code>Url</code>! This opens up a new browser to a particular URL. There's options you can pass in (see full docs <a href="http://www-01.ibm.com/support/knowledgecenter/api/content/SSHS8R_7.0.0/com.ibm.worklight.apiref.doc/html/refjavascript-client/html/WL.App.html#openURL">here</a>) but they don't apply to Android and iOS. Note that this does <strong>not</strong> work like the InAppBrowser. This opens the system browser as a new activity. On Android you can hit Back to return to the app, but on iOS you would need to return to the app using the double click/select behavior. (That I don't think many users really know about.) I think in most cases you will probably want InAppBrowser instead, but this is another option.

<h4>BackgroundHandler.setOnAppEnteringBackground / BackgroundHandler.setOnAppEnteringForeground</h4>

Note that these methods are on the BackgroundHandler object (so the full API is <code>WL.App.BackgroundHandler.etc</code>). These two methods are iOS only but are really freaking neat. When an app is put in the background, iOS takes a snapshot of the current view. This could be a security issue since sensitive information may be on the screen. By using these events, you can hide/show sensitive information so it doesn't show up when the user is viewing running apps in the background. You can either specify a custom function (to hide specific items) or tell the handler to just blank it out. 

Here is a screenshot. Note that the scratch app is blanked out.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/shot16.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/shot16.png" alt="shot1" width="850" height="669" class="alignnone size-full wp-image-6075" /></a>

<h4>addActionReceiver/removeActionReceiver/sendActionToNative</h4>

Now - this is cool one. Typically when you want to use native code, you have to build a plugin. Plugins are necessarily difficult to write, but you may not necessarily want to go that far for everything you do. MobileFirst's client-side API provides a simpler solution. You can use <code>sendActionToNative</code> to send a message to your native code. Your native code can then do... whatever. There's a reverse to this as well. You can tell your hybrid app to listen in for actions sent from the native side and react appropriately. As an example, imagine this within your JavaScript:

<pre><code class="language-javascript">var data = {% raw %}{someproperty:1234}{% endraw %};
WL.App.sendActionToNative("doSomething", data);</code></pre>

Then on the native side - you can listen for it and do something:

<pre><code class="language-javascript">
-(void) onActionReceived:(NSString *)action withData:(NSDictionary *) data {
    NSLog(@"The action receiver");
    if ([action isEqualToString:@"doSomething"]){
        NSLog(@"Yes, doing it");
        
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Wait" message:@"Are you sure you want to delete this.  This action cannot be undone" delegate:self cancelButtonTitle:@"Delete" otherButtonTitles:@"Cancel", nil];
        [alert show];        
        
    }
}</code></pre>

As you can see, you can listen for the action string and do something with it. You could also handle the args sent to it. In my example I just open an alert (which, to be clear, you do <strong>not</strong> need to do this way, just use the Dialogs plugin) but I could do pretty much anything here. And again - I could broadcast back to the JavaScript code as well. For times when you don't want a full plugin and just need to quickly talk to the native side, this is a pretty cool option.