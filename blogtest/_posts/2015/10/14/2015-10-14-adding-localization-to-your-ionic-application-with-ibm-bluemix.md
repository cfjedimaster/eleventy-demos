---
layout: post
title: "Adding localization to your Ionic application with IBM Bluemix"
date: "2015-10-14T13:16:26+06:00"
categories: [development,javascript,mobile]
tags: [bluemix,cordova,ionic]
banner_image: 
permalink: /2015/10/14/adding-localization-to-your-ionic-application-with-ibm-bluemix
guid: 6931
---

Localization is an important topic for mobile developers and one that is - in my opinion - not discussed enough. It is a difficult and complex topic, but like testing, it isn't something that should be ignored just because it isn't easy. Today I'm going to discuss one aspect of creating an internationalized hybrid application with Ionic - the localization of your UI. In my next post, I'll talk about formatting data values. To create the localized version of a sample application, I'm going to use two services. First, I'll use a beta <a href="https://ibm.biz/IBM-Bluemix">Bluemix</a> service for machine-based translation. Then I'll use an Angular library to employ the results of that service. Ready?

<!--more-->

<h1>Part One - Doing the Translation</h1>

Let's begin by talking about the translation service. The service we'll use is a beta one which means you can only find it in the <a href="https://console.ng.bluemix.net/catalog/labs/">Bluemix Labs Catalog</a> of services. We'll use the <a href="https://ibm.biz/bmglobalize">IBM Globalization</a> service.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/g.png" alt="g" width="372" height="354" class="aligncenter size-full wp-image-6932" />

To be clear, we're talking about <b>machine</b> translation. This will <b>not</b> be perfect. However, this service is more than appropriate for development and testing. You can hire professional translators at a later time to come in and proof-read what <strike>Skynet</strike>Bluemix provided for you. 

Once you sign up for Bluemix (and hey, you know you can do that for free, right?), you can then add this service. You do not need to bind it to any application as it runs "on it's own" just fine. After you've added it, you can then begin working with it. You'll start off by adding a new project.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/db.png" alt="db" width="750" height="405" class="aligncenter size-full wp-image-6933" />

In the next page, simply enter a name for your project, and a source language. For now, this must be English.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/s2.png" alt="s2" width="750" height="403" class="aligncenter size-full wp-image-6934 imgborder" />

You can also select the language you wish to support. You can add more languages later.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/s3.png" alt="s3" width="750" height="388" class="aligncenter size-full wp-image-6935 imgborder" />

Ok, now that the project is created, you get a 'dashboard' view of your languages.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/s4.png" alt="s4" width="750" height="273" class="aligncenter size-full wp-image-6936 imgborder" />

As you can see, my other languages have no data yet, so let's fix that. Clicking the little Upload icon by English prompts you to select a file. Note that they ask you for a format. What's cool is that you can upload as any format and then download as any format.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/s45.png" alt="s45" width="750" height="463" class="aligncenter size-full wp-image-6937 imgborder" />

While my first guess at what the JSON format required was correct, you can see all the formats documented in the <a href="https://www.ng.bluemix.net/docs/services/Globalization/index.html#globalizationOverview">Globalization docs</a>. Here is the one I built for my initial test.

<pre><code class="language-javascript">{
    "age": "Age",
    "email": "Email",
    "firstname": "First Name",
    "lastname": "Last Name",
    "register": "Register",
    "username": "Username"
}</code></pre>

After uploading it, the service parses it and shows you a set of keys and values:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/s5.png" alt="s5" width="750" height="291" class="aligncenter size-full wp-image-6938 imgborder" />

Once back on the project dashboard, you'll get a status message about each language. In my testing this was instantaneous, but I'd assume it won't always be that fast.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/s6.png" alt="s6" width="750" height="182" class="aligncenter size-full wp-image-6939 imgborder" />

You can click on a language and see how it translated, as well as provide your own edits if you know better. My "expert" on Chinese is my 12 year old daughter as I'm not home right now, I'll trust Bluemix.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/s7.png" alt="s7" width="750" height="297" class="aligncenter size-full wp-image-6940 imgborder" />

The next step is to simply download the translation:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/s8.png" alt="s8" width="750" height="323" class="aligncenter size-full wp-image-6941 imgborder" />

And that's it! As I said, you should not expect perfect translations, but I was amazed at how easy this was and how quickly it worked. 

<h1>Part Two - Using the Translation</h1>

In my "research" in how to use translation files with Angular (and by research I mean some Googling and Slack conversations), I was pointed to two different libraries: <a href="https://github.com/angular-translate/angular-translate">angular-translate</a> and <a href="https://github.com/doshprompt/angular-localization">angular-localization</a>. (Hat tip to @northmccormick on Slack for the later.) angular-translate seemed powerful, but almost too powerful. All I really wanted (at least for this demo) was the ability to translate UI strings into a language-appropriate format. angular-localization did just that and worked well, however the documentation was pretty poor. I'll detail what I did to use it and point out what wasn't clear in the docs.

To begin with, you need to ensure you both name and store your localization files correctly. angular-translate expects a root folder for the files and beneath that a folder for each locale you support. Finally, and this was the weird part, what you name your file will drive how it is addressed in code. So for example, if you name your file cat.json, then "cat" acts like a grouping of translations. The idea is that you can have multiple different groups of key/value pairs for your translations. That's nice, but it wasn't clearly spelled out. To make it easier for me, I just used app.json. Here's my folder structure. (I didn't bother downloading the German translation. Sorry Germany.)

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/s10.png" alt="s10" width="362" height="264" class="aligncenter size-full wp-image-6942 imgborder" />

Now let's look at the code. After installing the core library, I began by configuring the service. This is done via value objects.

<pre><code class="language-javascript">.value('localeConf', {
    basePath: 'lang',
    defaultLocale: 'en-US',
    sharedDictionary: 'common',
    fileExtension: '.json',
    persistSelection: false,
    cookieName: 'COOKIE_LOCALE_LANG',
    observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
    delimiter: '::'
}).value('localeSupported', [
    'en-US',
    'zh-CHS',
    'fr-FR'
]);</code></pre>

The first portion is just high level configuration stuff. The library requires you to pass everything even if you are only tweaking one value. In my case, it was <code>basePath</code> being set to "lang". The next value, <code>localeSupported</code>, is required, even though it isn't (from what I saw) documented that it is. If you don't tell the service what languages you support, then you can't change languages. (Which, by the way, <i>also</i> isn't documented.)

Ok, so next I set up some simple HTML using the format the service requires:

<pre><code class="language-markup">&lt;p data-i18n=&quot;app.username&quot;&gt;&lt;/p&gt;
&lt;p data-i18n=&quot;app.register&quot;&gt;&lt;/p&gt;
&lt;p data-i18n=&quot;app.firstname&quot;&gt;&lt;/p&gt;
&lt;p data-i18n=&quot;app.lastname&quot;&gt;&lt;/p&gt;

&lt;button class=&quot;button&quot; ng-click=&quot;setChinese()&quot;&gt;Test Chinese&lt;/button&gt;
&lt;button class=&quot;button&quot; ng-click=&quot;setFrench()&quot;&gt;Test French&lt;/button&gt;
&lt;button class=&quot;button&quot; ng-click=&quot;setEnglish()&quot;&gt;Test English&lt;/button&gt;</code></pre>

Note how localiztion is done. You specify the key (and remember, 'app' is the file name of the translation JSON) and the service will automatically provide the right translation. In case your curious, if you provide a key that doesn't exist, you'll get {% raw %}%%KEY_NOT_FOUND%{% endraw %}% as the result. That makes it nice and obvious. Note I've added three buttons to help me test. As I complained about above, angular-translate doesn't actually tell you how to set a language. I had to dig around a while to figure it out (and again, @northmccormick helped me out). Here is the code for my controller:

<pre><code class="language-javascript">.controller('Main', function($scope, locale) {
	
	$scope.setChinese = function() {
		console.log('set chinese');	
		locale.setLocale('zh-CHS');		
	};

	$scope.setFrench = function() {
		console.log('set french');	
		locale.setLocale('fr-FR');		
	};

	$scope.setEnglish = function() {
		console.log('set english');	
		locale.setLocale('en-US');		
	};
	
})</code></pre>

Not too complex, and yes, I could have used one function, but this was just my first test. The result is pretty much what you expect. Here are are two examples:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/Screen-Shot-2015-10-14-at-11.56.57.png" alt="Screen Shot 2015-10-14 at 11.56.57" width="596" height="491" class="aligncenter size-full wp-image-6943 imgborder" />

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/Screen-Shot-2015-10-14-at-11.57.07.png" alt="Screen Shot 2015-10-14 at 11.57.07" width="596" height="491" class="aligncenter size-full wp-image-6944 imgborder" />

Woot! So the next question is - how do we automate the locale? angular-translate does <i>not</i> do this for you. They do document this, but I wish they had bolded and underlined this point. In order to handle this, I added the <a href="https://www.npmjs.com/package/cordova-plugin-globalization">Cordova Globalization</a> plugin. As it stands, I'm going to use that for the second part anyway so that works out just fine. The modification was pretty simple:

<pre><code class="language-javascript">.run(function($ionicPlatform, locale) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
		
		navigator.globalization.getLocaleName(function(l) {
			console.log(l);
			locale.setLocale(l.value);
		}, function(err) {
			console.log('get local err', err);
		});
		
  });
})</code></pre>

On the front end, I changed my demo code to a simple form:

<pre><code class="language-markup">&lt;div class=&quot;list&quot;&gt;
	&lt;label class=&quot;item item-input item-stacked-label&quot;&gt;
		&lt;span class=&quot;input-label&quot; data-i18n=&quot;app.username&quot;&gt;&lt;/span&gt;
		&lt;input type=&quot;text&quot;&gt;
	&lt;/label&gt;
	&lt;label class=&quot;item item-input item-stacked-label&quot;&gt;
		&lt;span class=&quot;input-label&quot; data-i18n=&quot;app.firstname&quot;&gt;&lt;/span&gt;
		&lt;input type=&quot;text&quot;&gt;
	&lt;/label&gt;
	&lt;label class=&quot;item item-input item-stacked-label&quot;&gt;
		&lt;span class=&quot;input-label&quot; data-i18n=&quot;app.lastname&quot;&gt;&lt;/span&gt;
		&lt;input type=&quot;text&quot;&gt;
	&lt;/label&gt;
	&lt;label class=&quot;item item-input item-stacked-label&quot;&gt;
		&lt;span class=&quot;input-label&quot; data-i18n=&quot;app.email&quot;&gt;&lt;/span&gt;
		&lt;input type=&quot;text&quot;&gt;
	&lt;/label&gt;
	&lt;label class=&quot;item item-input item-stacked-label&quot;&gt;
		&lt;span class=&quot;input-label&quot; data-i18n=&quot;app.age&quot;&gt;&lt;/span&gt;
		&lt;input type=&quot;text&quot;&gt;
	&lt;/label&gt;
	&lt;button class=&quot;button button-block button-positive&quot; data-i18n=&quot;app.register&quot;&gt;&lt;/button&gt;
&lt;/div&gt;</code></pre>

Here it is in action in the iOS Simulator - after I set my locale to French.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/Simulator-Screen-Shot-Oct-14-2015-12.12.15-PM.png" alt="Simulator Screen Shot Oct 14, 2015, 12.12.15 PM" width="750" height="1015" class="aligncenter size-full wp-image-6945 imgborder" />

As a completely random aside, if you change the locale of your iOS Simulator and all of a sudden remember that your high school French has been blown away by Star Wars trivia and raising six kids, you can reset your simulator by doing: Simulator/Reset Content and Settings. Not that that happened to me. Honest.

So that's it. I've put up the source code here: <a href="https://github.com/cfjedimaster/Cordova-Examples/tree/master/globalex">https://github.com/cfjedimaster/Cordova-Examples/tree/master/globalex</a>. The simpler first version is under <code>www v1</code>. Let me know what you think below. As I said, tomorrow we'll look at globalizing numeric/date values.