---
layout: post
title: "Thoughts on NativeScript 2.0"
date: "2016-05-16T09:55:00-07:00"
categories: [development,mobile]
tags: [nativescript]
banner_image: 
permalink: /2016/05/16/thoughts-on-nativescript-20
---

When I began working with mobile development, it was with Adobe Flex Mobile. It was pretty interesting, but we all know where that ended up. Fairly shortly after joining Adobe's developer evangelist program (ditto), Adobe acquired PhoneGap and I began to really dig into the hybrid mobile development platform. I think I've been pretty obvious about my love for it (and [Apache Cordova](http://apache.cordova.org) and [Ionic](http://www.ionicframework.com)) but certainly these are not the only way to build mobile apps. 

<!--more-->

I did a bit of research into pure native development with iOS, and I thought it was interesting, but it just didn't quite appeal to me the way hybrid did. I won't deny that native gives you the top level of performance and customization, but being able to use my web skills to create mobile apps was just too damn fun for me to ignore. 

I've been aware of [NativeScript](https://www.nativescript.org) since it's release but I just never had the chance to actually sit down and play with it. With the release of 2.0, and it's Angular2 connection, I figured it was probably time to *make* the time to at least kick the tires a bit and see what it was like. Obviously what follows are my initial impressions and not based on any *real* work. But hopefully this will get people interested enough in the product to check it out themselves. As always, I encourage folks to leave some comments below with their own thoughts (especially if you've actually gone to production with it).

First and foremost, how does NativeScript compare to hybrid solutions like Cordova? Cordova works by creating a mobile app with a web view. That means all of your UI and UX are driven 100% by what is supported by the web browser on the device. Technically that isn't entirely accurate as you can use native APIs via plugins (see the Dialogs plugin) but for the most part, you're going to be using HTML, CSS, and JavaScript for everything. Native functionality is done via a plugin API that lets you use JavaScript to speak to the device using custom native code.   

NativeScript bypasses this and goes straight from code to native UI and UX. It does this via JavaScript, CSS, and XML. Yes, XML, and I know some folks are kinda throwing up at that, but for me, it reminded me a lot of Adobe Flex, and for layout, it works just fine. It does mean that you have something new to learn, but layouts pretty much follow a standard pattern (lay crap out horizontally, lay crap out vertically, etc).

[Installation](http://docs.nativescript.org/angular/start/quick-setup) is a quick npm setup as you would expect, but note that you'll want to have your Android and iOS SDKs downloaded and prepped as well. One thing I ran into right away was that even though I had those SDKs working well with Cordova, something in NativeScript wasn't necessarily happy with how I had them set up. I ran into two issues that the CLI complained about. One was easily solvable (the error itself told me what to do), the other wasn't as easy to get around but I was lucky enough to get some help from the NativeScript team. My engineer contact helped me out and logged a bug about the not-so-helpful error I ran into so it's something that will go away in the future. (And if folks are curious about what I hit I can share in the comments.)

Once you get it installed, you have the option of selecting two different tutorials: [Get Started with JavaScript](http://docs.nativescript.org/tutorial/chapter-0) or [Get Started with TypeScript &amp; Angular](http://docs.nativescript.org/angular/tutorial/ng-chapter-0). Now - as much as I'm really interested in both TypeScript and Angular, I just felt like it would make more sense for me to go with the simpler route.  

<img src="https://static.raymondcamden.com/images/2016/05/ns1.jpg" class="imgborder">

The tutorial took me about 2 hours - although I broke that up over a week so I could take a chunk in at a time. It does a great job of slowly introducing you to the various components and demonstrating multiple different aspects of NativeScript development. 

So what's the code like? Let's start with one of the XML files for the view. I'm presenting this as is and I know it won't make much sense to you, but read it. I'd be willing to be you can grok what's going on. This one represents the view for a list of items you have saved to a back-end system.

<pre><code class="language-markup">
&lt;Page loaded=&quot;loaded&quot;&gt;
	&lt;Page.actionBar&gt;
		&lt;ActionBar title=&quot;Groceries&quot;&gt;
			&lt;ActionBar.actionItems&gt;
				&lt;ActionItem text=&quot;Share&quot; tap=&quot;share&quot; ios.position=&quot;right&quot; /&gt;
			&lt;/ActionBar.actionItems&gt;
		&lt;/ActionBar&gt;
	&lt;/Page.actionBar&gt;
    &lt;GridLayout rows=&quot;auto,*&quot; columns=&quot;2*,*&quot;&gt;
		&lt;TextField id=&quot;grocery&quot; text=&quot;{% raw %}{{ grocery }}{% endraw %}&quot; hint=&quot;Enter a grocery item&quot; row=&quot;0&quot; col=&quot;0&quot; /&gt;
		&lt;Button text=&quot;Add&quot; tap=&quot;add&quot; row=&quot;0&quot; col=&quot;1&quot; /&gt;

        &lt;ListView items=&quot;{% raw %}{{ groceryList }}{% endraw %}&quot; id=&quot;groceryList&quot; row=&quot;1&quot; colspan=&quot;2&quot;&gt;
            &lt;ListView.itemTemplate&gt;
                &lt;Label text=&quot;{% raw %}{{ name }}{% endraw %}&quot; horizontalAlignment=&quot;left&quot; verticalAlignment=&quot;center&quot;/&gt;
            &lt;/ListView.itemTemplate&gt;
        &lt;/ListView&gt;
		&lt;ActivityIndicator busy=&quot;{% raw %}{{ isLoading }}{% endraw %}&quot; rowSpan=&quot;2&quot; colSpan=&quot;2&quot; /&gt;
    &lt;/GridLayout&gt;
&lt;/Page&gt;
</code></pre>

Each view can have customized CSS. Here's the CSS for that view:

<pre><code class="language-css">
ListView {
    margin: 5;
    opacity: 0;
}

Label {
    margin: 10;
    horizontal-align: left;
    vertical-align: center;
}
TextField {
    border-width: 5;
    border-style: solid;
    border-color: #034793;
}
Image {
    margin: 10;
}
</code></pre>

And then finally the logic behind the view, written in trusty-old JavaScript:

<pre><code class="language-javascript">
var GroceryListViewModel = require("../../shared/view-models/grocery-list-view-model");
var dialogsModule = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var viewModule = require("ui/core/view");
var socialShare = require("nativescript-social-share");
var page;

var groceryList = new GroceryListViewModel([]);
var pageData = new Observable({
    groceryList: groceryList,
	grocery: ""
});

exports.loaded = function(args) {
    page = args.object;
    var listView = page.getViewById("groceryList");
    page.bindingContext = pageData;

    groceryList.empty();
    pageData.set("isLoading", true);
    groceryList.load().then(function() {
        pageData.set("isLoading", false);
        listView.animate({
            opacity: 1,
            duration: 1000
        });
    });
};

exports.add = function() {
    // Check for empty submissions
    if (pageData.get("grocery").trim() === "") {
        dialogsModule.alert({
            message: "Enter a grocery item",
            okButtonText: "OK"
        });
        return;
    }

    // Dismiss the keyboard
    page.getViewById("grocery").dismissSoftInput();
    groceryList.add(pageData.get("grocery"))
        .catch(function() {
            dialogsModule.alert({
                message: "An error occurred while adding an item to your list.",
                okButtonText: "OK"
            });
        });

    // Empty the input field
    pageData.set("grocery", "");
};

exports.share = function() {
    var list = [];
    var finalList = "";
    for (var i = 0, size = groceryList.length; i &lt; size ; i++) {
        list.push(groceryList.getItem(i).name);
    }
    var listString = list.join(", ").trim();
    socialShare.shareText(listString);
};
</code></pre>

So this one probably looks a bit confusing but not scary. I know I'm presenting this all with little to no context, but if these code samples look like something you can work with, then you can definitely give NativeScript a shot.

From a developer perspective, it also feels a bit like Cordova. You use the CLI to send it to the emulator or device and can even do a live-reload which is handy during development. (This live-reload feature doesn't cover all cases, specifically changing JavaScript, but there's ways to enable that too.) You can also get an [extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Telerik.nativescript) to add some hooks to the command line from within the editor. 

One of the more fascinating aspects of NativeScript is the ability to talk right to the native layer via JavaScript. Both Cordova and NativeScript support plugins for native access, but I don't mean that. What I mean is you can skip the plugin (for smaller stuff I'd imagine) and directly talk to Java or Objective-C. Here's an example you could use on iOS to see if the hardware camera exists:

<pre><code class="language-javascript">
var cameraSupported = UIImagePickerController.isSourceTypeAvailable(UIImagePickerControllerSourceType.UIImagePickerControllerSourceTypeCamera);
</code></pre>

I could this in Cordova, of course, via a plugin, but I love the direct access in NativeScript for small stuff like this. As you can probably imagine, the communication between both sides has some complexities so I'd check the [docs](https://docs.nativescript.org/core-concepts/accessing-native-apis-with-javascript) for specifics.

How about a semi-real example - the typical camera demo? I built one using a simple view. Here's the layout:

<pre><code class="language-javascript">
&lt;Page loaded=&quot;loaded&quot;&gt;
	&lt;Page.actionBar&gt;
		&lt;ActionBar title=&quot;Camera Demo&quot;&gt;&lt;/ActionBar&gt;
	&lt;/Page.actionBar&gt;

	&lt;StackLayout orientation=&quot;vertical&quot;&gt;
		&lt;Button text=&quot;Select Picture&quot; tap=&quot;getPicture&quot; class=&quot;link&quot; /&gt;
		&lt;Image id=&quot;imgResult&quot; /&gt;
	&lt;/StackLayout&gt;
&lt;/Page&gt;
</code></pre>

Again - even though you may never have seen NativeScript, I bet you can tell what this is doing. And here is the code behind it:

<pre><code class="language-javascript">
var cameraModule = require('camera');
var imageModule = require('ui/image');
var imgResult;

exports.loaded = function(args) {
	var page = args.object;
	imgResult = page.getViewById('imgResult');
};

exports.getPicture = function() {
	cameraModule.takePicture().then(function(picture) {
	    imgResult.imageSource = picture;
	});
};
</code></pre>

One thing you want to remember - this is not Cordova. NativeScript's Camera plugin, for example, is just that - a Camera plugin. It does not let you use the photo gallery by simply passing a configuration value. Oddly (and I don't think I figured out why), on the iOS simulator it was able to fall back to the gallery. 

Here is a screen shot of it running, and to be clear, this really doesn't demonstrate anything really special. You can see a native button of course, but that's all the UI I used. I mainly just wanted to test getting a camera image into the view.

<img src="https://static.raymondcamden.com/images/2016/05/ns2.png" class="imgborder">

So... thoughts? I'd suggest the [Slack channel](http://developer.telerik.com/wp-login.php?action=slack-invitation) as the folks there are pretty friendly and it isn't too noisy. They also have a [showcase](https://www.nativescript.org/showcases) of apps if you want to see some real examples. As I said, I dig it. I'm certainly not going to walk away from Cordova and Ionic any time soon, but I found the process to be enjoyable and cool, and the end result looks pretty darn nice. Check it out!