---
layout: post
title: "Using Angular and a Content Security Policy? Watch out for this..."
date: "2015-07-03T08:57:16+06:00"
categories: [development,html5,javascript]
tags: [cordova]
banner_image: 
permalink: /2015/07/03/using-angular-and-a-content-security-policy-watch-out-for-this
guid: 6351
---

<div style="background-color:#ececec">Edit on July 6, 2015: Kevin H, in the comments below, pointed out that the docs for ngShow actually talk about this! I missed this completely. The solution the docs recommend, including an additional CSS file, worked fine for me, and feels like a "better" solution than mine, so I recommend following the docs lead.</div>

I've been working on a Cordova app that uses AngularJS. It has been working fine for a while now but I needed to do a bit of cleanup. After I pushed up my changes, my client noticed something odd. We have a button that only shows up under certain situations. Basically, if some scope variable is true, we display it.

<!--more-->

<pre><code class="language-markup">&lt;button ng-show="featureEnabled"&gt;Feature&lt;/button&gt;</code></pre>

All of a sudden, the button began showing up in all cases, even when the variable was false. I began to debug. I double checked to ensure my variable wasn't being set true when it shouldn't be. That wasn't the problem. I then added some simple tests to my view. 

<pre><code class="language-markup">
first test, &lt;span ng-show=&quot;!barcodeAllowed.status&quot;&gt;DONT SHOW&lt;/span&gt;&lt;br/&gt;
second test, &lt;span ng-show=&quot;barcodeAllowed.status == false&quot;&gt;DONT SHOW&lt;/span&gt;&lt;br/&gt;
test -{% raw %}{{barcodeAllowed.status}}-end -{{!barcodeAllowed.status}}- -{{barcodeAllowed | json}}{% endraw %}-&lt;br/&gt;
test if &lt;span ng-if=&quot;barcodeAllowed.status&quot;&gt; if was true&lt;/span&gt;&lt;br/&gt;
test opp if &lt;span ng-if=&quot;!barcodeAllowed.status&quot;&gt; will see it&lt;/span&gt;
</code></pre>

As you can see, I checked both the negation of the variable an the variable itself. I also output it, and the negation, as well as the JSON version of the variable. Finally I did two tests using ng-if.

Here is where things got freaky. <strong>Both</strong> of the first two ng-show tests showed up! Even though the value in the third line was exactly what I expected - false. 

And to make things even more weird - the ng-if's worked perfectly! At this point, I was just considering switching to ng-if, but then I punted and asked over on <a href="http://stackoverflow.com/questions/31194526/odd-issue-with-ng-show-always-evaluating-to-true/">StackOverflow</a>. I had a long "conversation" with user <a href="http://stackoverflow.com/users/3530970/thsorens">thsorens</a> and he reminded me that ng-show/ng-hide will add/remove CSS classes based on the condition.

Then I paused and thought a bit. When I did my 'cleanup' of the app, I made a few different changes. For example, I had been using a remote Angular JS library and I switched it to a local one. I double checked to ensure it wasn't a version issue. I also made use of a Content Security Policy. I talked about this <a href="http://www.raymondcamden.com/2015/05/25/important-information-about-cordova-5">on my blog</a> a few months ago. As a reminder, it is a way to lock down the resources your Cordova app, or any web app, can make use of. On a whim, I renamed the meta tag that defined the CSP and bammo - things worked!

I didn't want to just remove the CSP, so I dug a bit deeper. It occurred to me that JavaScript was being used to create and manipulate CSS, so I looked at the script-src I had defined:

<code>script-src 'self'</code>

I then though... I bet Angular is using eval. So I added this:

<code>script-src 'self' 'unsafe-eval'</code>

And that did it. Here is a code sample that demonstrates the issue. First, the HTML:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html ng-app=&quot;plunker&quot;&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge,chrome=1&quot;&gt;
        &lt;meta http-equiv=&quot;Content-Security-Policy&quot; 
			content=&quot;default-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline' 'unsafe-eval';&quot;&gt;

		&lt;title&gt;App&lt;/title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;

		&lt;script src=&quot;https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.1/angular.js&quot;&gt;&lt;/script&gt;

		&lt;script src=&quot;test.js&quot;&gt;&lt;/script&gt;
	&lt;/head&gt;
	&lt;body ng-controller=&quot;MainCtrl&quot;&gt;

	    barcodeAllowed=&lt;span ng-show=&quot;barcodeAllowed&quot;&gt;barcode Allowed&lt;/span&gt;&lt;br/&gt;
	    true=&lt;span ng-show=&quot;true&quot;&gt;true&lt;/span&gt;&lt;br/&gt;
	    false=&lt;span ng-show=&quot;false&quot;&gt;false&lt;/span&gt;

	&lt;/body&gt;
&lt;/html&gt;</code></pre>

And here is the JavaScript:

<pre><code class="language-javascript">var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope) {
  $scope.barcodeAllowed = false;
});</code></pre>

If you remove 'unsafe-eval' from the meta tag, it stops working. If you would rather just run a live demo of this, view this Plunker I created: <a href="http://plnkr.co/edit/Hqo4G2NqwwAQU3Tu001J?p=preview">http://plnkr.co/edit/Hqo4G2NqwwAQU3Tu001J?p=preview</a>. You can <i>only</i> see this in Chrome as it appears Firefox doesn't support CSP yet. The issue shows up in Safari as well. 

Upon running the Plunker, you will see the ng-show's failing to correctly work. Just go into the meta tag and add 'unsafe-eval' to the script-src area and it will work correctly.

At the end, a very understandable issue I suppose. The lesson here is that while CSPs are a powerful tool to lock down your web app, you're going to need to look out for side effects like this.