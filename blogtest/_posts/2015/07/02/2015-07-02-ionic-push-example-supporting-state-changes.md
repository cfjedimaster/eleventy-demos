---
layout: post
title: "Ionic Push example supporting State Changes"
date: "2015-07-02T14:51:19+06:00"
categories: [development,javascript,mobile]
tags: [cordova,ionic]
banner_image: 
permalink: /2015/07/02/ionic-push-example-supporting-state-changes
guid: 6346
---

<i>Please note that I'm writing this blog post while Ionic Push is still in Alpha. Everything I discuss here may change before 1.0 is released. Use the following code with caution.</i> One of the more interesting features of Ionic's Push feature is the ability to recognize a push message with state data. You can craft a push packet that not only includes a state value but state params as well. This is discussed in the <a href="http://docs.ionic.io/v1.0/docs/push-faq#section-i-want-my-app-to-open-to-a-specific-state-when-i-receive-a-notification-">FAQ</a>:

<!--more-->

<blockquote>
<b>I want my app to open to a specific state when I receive a notification.</b>
In addition to handling this in the onNotification function described here, you can specify which $state a notification should open your app to using the push payload. Below is an example JSON object highlighting this.

<pre><code class="language-javascript">{
  "tokens":["1f0ab62df8b5c672653dea8b01d1bab4dc1b15da93f99216b5ba0f621692a89f"],
  "notification": {
    "alert": "Basic push!",
    "ios":{
      "priority": 10,
      "badge":2,
      "payload":{% raw %}{ "$state": "about", "$stateParams": "{\"id\": 1}{% endraw %}" }
    }
  }
}</code></pre>
</blockquote>

<p>

This works well, but I ran into a few gotchas while playing with it so I thought I'd write up a quick demo of it to help others. For my demo, I created a new Ionic project using the Tabs default. I then followed the directions in the <a href="http://docs.ionic.io/v1.0/docs/push-from-scratch">quick start</a> to get Push setup. One thing that may trip you up right away is that you have to ensure your application <i>always</i> runs the push registration call. The quick start guide has you build a demo where registration is only run when a button is pushed. In some cases, that may make sense. You may not <i>always</i> want to register for push notifications. Most likely though you will. So to start off, here is my modified run() block from app.js that includes push registration. 

<pre><code class="language-javascript">.run(function($ionicPlatform, $ionicPush, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    
    $ionicPush.register({
        canShowAlert: false, //Can pushes show an alert on your screen?
        canSetBadge: true, //Can pushes update app icon badges?
        canPlaySound: true, //Can notifications play a sound?
        canRunActionsOnWake: true, //Can run actions outside the app,
        onNotification: function(notification) {
          // Handle new push notifications here
          console.log(notification);
          
          return true;
        }
      });
         
    
  });
})</code></pre>

I also want to point out two important settings. First, you probably want <code>canShowAlert</code> to be false. If not, then every notification will fire an alert in your app. Most likely your app will respond to notifications in different ways. Sometimes with dialogs, sometimes not, but probably not <i>always</i> one way or the other. Secondly, to actually enable "respond to state so and so", you want to set <code>canRunActionsOnWake</code> to true.

Cool - so almost there. I then create a Push notification via Curl that included the state info. The Tags application includes a state called tags.chat, so I decided to use that as my 'target':

<code>curl -u appkeyThingy: -H "Content-Type: application/json" -H "X-Ionic-Application-Id: 6aef0d7b" https://push.ionic.io/api/v1/push -d '{% raw %}{"tokens": ["a device token"],"notification":{"alert":"ray","ios":{"payload":{"$state":"tab.chats"}}{% endraw %}}}'</code>

You want to be careful when crafting the JSON of your notification. The server is pretty good about noticing mistakes, but on more than one occasion I screwed that part up. Note that you include the state information in the payload section. Also note that I didn't bother sending state params either.

So... this worked! And it was cool! Then I tested again and it failed. Sad kitty. Why? Did you notice the preference back there in register was <code>canRunActionsOnWake</code>? Specifically - "OnWake". So this feature only works automatically if the application is woken up - not if it is active.

If you think about it, that makes sense. As a user, I don't want the app automatically shifting focus when a notification comes in. However, you may be curious as to how you could possibly handle this. I modified my notification handler to add in some new logic - just for this:

<pre><code class="language-javascript">onNotification: function(notification) {
      // Handle new push notifications here
      console.log(notification);
      if(notification["$state"]) {
        //prompt the user to switch
        navigator.notification.confirm("You have a new chat - go to it?", function(btn) {
          if(btn === 1) {
            $state.go(notification["$state"]);
          }
        },"New Chat!")
      }
      return true;
}</code></pre>

The modification is simple. I had added the <a href="https://www.npmjs.com/package/cordova-plugin-dialogs">Dialogs</a> plugin and then made use of it in my handler. If I see a $state parameter I simply ask the user if they want to view the chats. If they say yes, I switch to it.

Now - to be clear - my logic could be a bit tighter. I don't actually look at the $state value. I should see if it exists <i>and</i> if is tabs.chat, but you get the idea. Here it is in action:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot1.png" alt="shot1" width="450" height="600" class="alignnone size-full wp-image-6347" />

You can grab the full source code here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/push2">https://github.com/cfjedimaster/Cordova-Examples/tree/master/push2</a>.