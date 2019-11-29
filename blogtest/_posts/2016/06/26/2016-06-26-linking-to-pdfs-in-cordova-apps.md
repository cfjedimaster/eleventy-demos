---
layout: post
title: "Linking to PDFs in Cordova apps"
date: "2016-06-26T14:08:00-07:00"
categories: [mobile,javascript]
tags: [cordova]
banner_image: 
permalink: /2016/06/26/linking-to-pdfs-in-cordova-apps
---

In today's "I wonder what happens when..." post, I decided to take a look at what happens when you try to use a PDF with a hybrid mobile application. I know that PDFs, in general, "just work" on both Android and iOS, but I was specifically curious about how you would use PDFs within a Cordova app. As usual, what I thought would be rather simple turned into anything *but* that. 

<!--more-->

First, I whipped up a super quick, super minimal Cordova application. Even though I'm "All Ionic, All the Time", I specifically avoided it in this case to keep my code as simple as possible. I decided on three separate tests:

<ol>
<li>A simple link to a PDF.</li>
<li>Using JavaScript to load the PDF via document.location.href</li>
<li>Using the InAppBrowser Cordova plugin</li>
</ol>

To be clear, I expected both 1 and 2 to act the same, but I figured I might as well be complete and check it out. Here's the HTML:

<pre><code class="language-javascript">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta http-equiv=&quot;Content-Security-Policy&quot; content=&quot;default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *&quot;&gt;
		&lt;meta name=&quot;format-detection&quot; content=&quot;telephone=no&quot;&gt;
		&lt;meta name=&quot;msapplication-tap-highlight&quot; content=&quot;no&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width&quot;&gt;
		&lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;css/index.css&quot;&gt;
		&lt;title&gt;Hello World&lt;/title&gt;
	&lt;/head&gt;
	&lt;body&gt;

		&lt;p&gt;
			&lt;a href=&quot;assets/foo.pdf&quot;&gt;Regular Ole Link&lt;/a&gt;
		&lt;/p&gt;
		&lt;p&gt;
			&lt;button id=&quot;loadPDF1&quot;&gt;document.location.href&lt;/button&gt;
		&lt;/p&gt;
		&lt;p&gt;
			&lt;button id=&quot;loadPDF2&quot;&gt;inappbrowser&lt;/button&gt;
		&lt;/p&gt;

		&lt;script type=&quot;text/javascript&quot; src=&quot;cordova.js&quot;&gt;&lt;/script&gt;
		&lt;script type=&quot;text/javascript&quot; src=&quot;js/index.js&quot;&gt;&lt;/script&gt;
	&lt;/body&gt;
&lt;/html&gt;
</code></pre>

And here's the JavaScript behind it:

<pre><code class="language-javascript">
document.addEventListener('deviceready', init, false);

function init() {
    document.querySelector('#loadPDF1').addEventListener('touchend', loadPDF1,false);
    document.querySelector('#loadPDF2').addEventListener('touchend', loadPDF2,false);
}

function loadPDF1() {
    console.log('loadPDF1');
    document.location.href='assets/foo.pdf';
}

function loadPDF2() {
    console.log('loadPDF2');
    var ref = cordova.InAppBrowser.open('assets/foo.pdf', '_blank', 'location=no');
}
</code></pre>

I assume this is simple enough that it doesn't require explanation, but let me know in the comments if anything seems off. Ok, let's test iOS!

iOS 9.3
---

The first two links "just worked", but not as I expected. Here's the initial page:

<img src="https://static.raymondcamden.com/images/2016/06/pdf1.png" class="imgborder">

And here is what happened when I clicked:

<img src="https://static.raymondcamden.com/images/2016/06/pdf2.png" class="imgborder">

Yes - the PDF is rendering beautifully. (And it's easy to read, but to be fair, I use a Keynote slidedeck as my source.) However... notice something missing?

Yep - there's no way to get back to the app. Technically you're still in the app, but the entire webview is the PDF, and since iOS doesn't support a Back button, you're screwed. I had to kill the application to get it back to normal. 

Of course, the InAppBrowser makes this easy enough to handle:

<img src="https://static.raymondcamden.com/images/2016/06/pdf3.png" class="imgborder">

In case you can't see it, there is a bar at the bottom with a "Close" link that will bring you back to the app. 

Ok, so that's easy - Android will probably respond the same. Let's take a look!

Android 6.0.0
---

Alright - so going into my test, I expected the exact same results - except that Android would let me go back from the PDF using the first two tests. I loaded it up in my emulator, and...

Nothing.

Zip. No responses. At first I thought maybe it was a CSP issue, but when I opened up the console I saw this:

<code>Resource interpreted as Document but transferred with MIME type application/pdf: "file:///android_asset/www/assets/foo.pdf".</code>

Weird. I've seen issues with dynamic apps (ColdFusion) outputting binary date without the right content type, but if my memory serves me right, normally the browser just tries to handle it as best it can. In the past (far past) I can remember browsers trying to render the binary data as text, but it seems like I've not seen that in quite some time. 

Correction - I decided to actually test that hypothesis and desktop Chrome barfed on ColdFusion outputting a PDF without the right header. Chrome, Safari, and Firefox all crapped the bed trying to load it.

Anyway - that's with the first two links. The third link, the InAppBrowser one? Returns nothing. I kid you not. The new window opens, and nothing loads. I get zip in the console as well. Or so I thought. Returning back to Chrome's device window shows that it did load as a new web view:

<img src="https://static.raymondcamden.com/images/2016/06/pdf4.jpg" class="imgborder">

But that console has nothing in it. I can't even execute JavaScript in the console. It's like the Phantom Zone of debugging.

Ok - so after a bit of searching, I found someone recommending using the <code>download</code> attribute. This is a newish HTML5 feature that tells the browser that it should download the asset instead of trying to render it. This *also* did nothing. No error, zip. (In case you're curious, iOS ignored the download attribute and just responded like it did with the first link.)

It turns out that the Android web view simply doesn't support PDFs. That seems... crazy - especially considering how many PDFs are out there. One could argue that they probably don't fit the mobile form factor very well, but I'd have assumed that showing *something* would be better than nothing. And heck - I'm sure Google could license a PDF viewer from Adobe. They probably have enough money for that. 

Now what?
---

So - I did some Googling around, and asking on Slack, and <a href="https://medium.com/@simon_prickett/">Simon Prickett</a> shared some things that worked for him. One of them in particular looked interesting, <a href="https://github.com/pwlin/cordova-plugin-file-opener2">cordova-plugin-file-opener2</a>. This plugin tries to open a file in a local viewer. It seemed easy enough so I decided to try iOS again. I added a new button and used this code (after adding the plugin <strong>and</strong> the File plugin):

<pre><code class="language-javascript">
function loadPDF3() {
    console.log('loadPDF3');
    console.log(cordova.file.applicationDirectory);
    cordova.plugins.fileOpener2.open(
        cordova.file.applicationDirectory+'www/assets/foo.pdf',
        'application/pdf', 
        { 
            error : function(e) { 
                console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
            },
            success : function () {
                console.log('file opened successfully'); 				
            }
        }
    );
}
</code></pre>

And it seemed to work fine. I had the Adobe PDF viewer installed on my iPhone and it was suggested:

<img src="https://static.raymondcamden.com/images/2016/06/pdf5.jpg" class="imgborder">

and it viewed just fine - and I absolutely love the new iOS feature that provides links back to previous apps:

<img src="https://static.raymondcamden.com/images/2016/06/pdf6.jpg" class="imgborder">

Ok - let's try Android. It's going to work. I bet.

Except no, of course it doesn't. Android reports this (via the plugin's error handler):

<code> Error status: 9 - Error message: File not found</code>

Sigh. I did some digging on the plugin's GitHub issues though and ran across this report: <a href="https://github.com/pwlin/cordova-plugin-file-opener2/issues/28">Opening local file (pdf) : "not found".</a>

If you read down the thread a bit, you run into a really <a href="https://github.com/pwlin/cordova-plugin-file-opener2/issues/28#issuecomment-218442994">nice solution</a> by japostigo-atsistemas. I modified his code a bit to work with my solution and came up with this:

<pre><code class="language-javascript">
window.resolveLocalFileSystemURL(cordova.file.applicationDirectory +  'www/assets/foo.pdf', function(fileEntry) {
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dirEntry) {
		fileEntry.copyTo(dirEntry, 'file.pdf', function(newFileEntry) {
			cordova.plugins.fileOpener2.open(newFileEntry.nativeURL,'application/pdf',
			{ 
				error : function(e) { 
					console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
				},
				success : function () {
					console.log('file opened successfully'); 				
				}
			}
			);
		});
	});
});
</code></pre> 

As you can see, he is using the FileSystem to copy to an external data directory and then uses the plugin to load it from there. A royal pain in the ass, but it works... I believe. I ended up with:

<code>Error status: 9 - Error message: Activity not found: No Activity found to handle Intent {% raw %}{ act=android.intent.action.VIEW dat=file:///storage/emulated/0/Android/data/io.cordova.hellocordova/files/file.pdf typ=application/pdf flg=0x4000000 }{% endraw %}</code>

Which implies that it simply couldn't find a PDF viewer on my Android simulator. I've got a device, but I'm at an airport currently and the device is back home. Considering *multiple* people up voted the idea, it seems like a good solution. Of course it doesn't work on iOS because, reasons, but at this point I'd simply consider using an IF/ELSE with the device plugin. 

At this point - I consider the issue solved - roughly - and hopefully this will be of help to others. Thanks again to Simon for his help with this plugin!