---
layout: post
title: "A Social Example of Ionic Auth"
date: "2016-11-17T08:38:00-07:00"
categories: [mobile]
tags: [ionic]
banner_image: /images/banners/socialauth.jpg
permalink: /2016/11/17/a-social-example-of-ionic-auth
---

A few days ago I blogged about using the Ionic Auth service with the latest version of Ionic 2 (["An example of the Ionic Auth service with Ionic 2"](https://www.raymondcamden.com/2016/11/04/an-example-of-the-ionic-auth-service-with-ionic-2). One of my readers asked if I could update the example to make use of social login. I worked on that yesterday and have an updated example to share. Please be sure to read that previous post first so you have a bit of context on what we're building!

<!--more-->

As I said, for this iteration of the demo, I'm going to use social login. While one app could support both social and "regular" login/registration, I thought it would make more sense to only support one or the other. So this version of the app completely removes the registration feature and just supports logging on with Facebook or Twitter. And I chose those two rather arbitrarily. The [full list](http://docs.ionic.io/services/auth/#authentication-providers) of supported social logins supported by Ionic also include Google, Instagram, LinkedIn, and GitHub. 

For Facebook, I began by following the directions under ["Native Login"](http://docs.ionic.io/services/auth/facebook-native.html). The docs are a bit confusing at times because they no longer match (precisely) the 'flow' you get at Facebook when adding an application. I was able to work around it, but just remember that you're going to have to click around a bit differently than what the Ionic docs suggest. (I filed a bug report for this, but at the end of the day, external sites like this will change from time to time and I'd expect Ionic's docs to sometimes be a bit behind.) There is one major issue with this page though that I'll bring up in a moment.

Once you've followed these directions and installed the appropriate plugins, you can then start writing your code. I began by modifying the login page. I got rid of the accordion and just added two buttons:

<pre><code class="language-markup">
&lt;!--
  Generated template for the Login page.

  See http:&#x2F;&#x2F;ionicframework.com&#x2F;docs&#x2F;v2&#x2F;components&#x2F;#navigation for more info on
  Ionic pages and navigation.
--&gt;
&lt;ion-header&gt;

  &lt;ion-navbar&gt;
    &lt;ion-title&gt;Login&#x2F;Register&lt;&#x2F;ion-title&gt;
  &lt;&#x2F;ion-navbar&gt;

&lt;&#x2F;ion-header&gt;


&lt;ion-content padding&gt;
    
  &lt;button ion-button color=&quot;primary&quot; full (click)=&quot;doFacebook()&quot;&gt;
    &lt;ion-icon name=&quot;logo-facebook&quot;&gt;&lt;&#x2F;ion-icon&gt;&amp;nbsp;&amp;nbsp;
    Login with Facebook
  &lt;&#x2F;button&gt;
  &lt;button ion-button color=&quot;primary&quot; full (click)=&quot;doTwitter()&quot;&gt;
    &lt;ion-icon name=&quot;logo-twitter&quot;&gt;&lt;&#x2F;ion-icon&gt;&amp;nbsp;&amp;nbsp;
    Login with Twitter
  &lt;&#x2F;button&gt;

&lt;&#x2F;ion-content&gt;
</code></pre>

Note the use of icons in the buttons to make them fancy. Here's the updated UI:

![Example](https://static.raymondcamden.com/images/2016/11/authsocial1.PNG)

Each button is tied to a method to handle it's particular login. For the most part, this is rather simple. For example, here is the Facebook code:

<pre><code class="language-javascript">
  doFacebook() {
    console.log(&#x27;do FB&#x27;);
    this.facebookAuth.login().then(() =&gt; {
      this.navCtrl.setRoot(HomePage);
    });
  }
</code></pre>

At that point the native code takes over. I'm using Genymotion on my laptop to test Android, and I'm not terribly happy with how this looks, but here it is in action. 

![Example](https://static.raymondcamden.com/images/2016/11/authsocial2.PNG)

As I said, I don't think this is the best screen shot, but it does work well. I was able to login and then I was considered logged in by the Auth system. Here is where I ran into a serious doc issue. Once logged in, the app likes to greet you by name. In my previous version, when you registered I asked you for a name. Facebook certainly knows your name, but how do you get it? Turns out the *other* doc for Facebook login (http://docs.ionic.io/services/auth/facebook-auth.html), the one covering InAppBrowser, has a section on this, Social Data. 

Basically you will find the data returned from Facebook under the user object in a social.facebook block. 

<pre><code class="language-javascript">
constructor(public navCtrl: NavController, public user:User, public facebookAuth:FacebookAuth, public auth:Auth) {
  console.log(user);
  &#x2F;*
   find the name based on how they logged in
   *&#x2F;
   if(user.social &amp;&amp; user.social.facebook) {
     this.name = user.social.facebook.data.full_name;
   } else if(user.social &amp;&amp; user.social.twitter) {
     this.name = user.social.twitter.data.full_name;
   } else {
     this.name = &quot;Friend&quot;;
   }
}
</code></pre>

And here it is - correctly recognizing my name:

![I'm Ray](https://static.raymondcamden.com/images/2016/11/authsocial3.png )

The last part to this was handling logout. Facebook requires slightly different code, so I've got a bit of logic to handle this. Notice that I could probably handle the "how did you login part" a bit nicer.

<pre><code class="language-javascript">
logout() {
   &#x2F;&#x2F;switch based on social login, could be better
   if(this.user.social &amp;&amp; this.user.social.facebook) {
     this.facebookAuth.logout();
   } else {
     this.auth.logout();
   }
   this.navCtrl.setRoot(LoginPage);
 }
</code></pre>

So Twitter wasn't much more work. The login routine is simple:

<pre><code class="language-javascript">
doTwitter() {
	console.log(&#x27;do Twitter&#x27;);
	this.auth.login(&#x27;twitter&#x27;).then(() =&gt; {
    	this.navCtrl.setRoot(HomePage);
    });
}
</code></pre>

And here is how it rendered the UI:

![Twitter](https://static.raymondcamden.com/images/2016/11/authsocial4.PNG)

And that's basically it. You saw above how I handled getting the name as well as how I handle logout. Frankly the most difficult part was the stuff *outside* of my Ionic code. In general, it feels like a simpler, easier solution than requiring a unique registration. You can find the complete source code for this version here:

https://github.com/cfjedimaster/Cordova-Examples/tree/master/ionicAuth2Social