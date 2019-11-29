---
layout: post
title: "Experiment with Mobile Adsense"
date: "2011-10-10T10:10:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2011/10/10/Experiment-with-Mobile-Adsense
guid: 4386
---

I've been a Google Adsense user for a very long time, and while I won't be retiring off my earnings any time soon, it helps pay the hosting bill and covers my fancy beer/comic book addiction well. Before MAX I decided to take a look at Adsense for Mobile. Specifically I wanted to use it with an HTML-based application made with PhoneGap. I've seen a few applications making use of it (or other ad networks), and I was curious how easy it would be to use. Here's my experiences with it. I'd love to hear from others using it, or other ad networks, especially in terms of how easy it was to add to your application and how well the reporting works.
<p/>
<!--more-->
Before working with Adsense for Mobile, you have to actually have an Adsense account. I figured that's assume but it doesn't hurt to ask. You do <i>not</i> have to have any other account though. So for example, you don't have to have an Android or iOS developer account. Once logged into your Adsense account, go into "My Ads", and make note of the 'More Products' section on the left.

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip198.png" />

<p/>

I had mobile here originally, and clicking on it was a two step process to enable mobile. I believe it simply asked me if I wanted to try AdMob as well, but I just ignored that. Once enabled, you get a "Mobile content" section under your ads:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip199.png" />

<p/>

These options mirror the same choices you get for regular desktop ads. Since I only had one ad to create, I didn't bother with custom channels and just created a new ad. Once you do, you get some interesting choices:

<p/>


<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip200.png" />

<p/>

Note the Device type drop down. This has two options: "iPhones and other highend devices" and "All phones". It's nice that Google simplifies this. You can get more details <a href="http://www.google.com/adsense/support/as/bin/answer.py?answer=151667&hl=en">here</a> if you care. The only odd thing about the drop down is the lack of mention for Android. I'd have said "iPhones, Android, and other highend devices". Ad size options are a bit limited, but this is to be expected.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip201.png" />

<p/>

Once done, you get a chunk of JavaScript code, just like you would for any regular ad:

<p/>

<code>
&lt;script type="text/javascript"&gt;&lt;!--
  // XHTML should not attempt to parse these strings, declare them CDATA.
  /* &lt;![CDATA[ */
  window.googleAfmcRequest = {
    client: 'ca-mb-pub-1736437642005360',
    format: '320x50_mb',
    output: 'html',
    slotname: '8053234936',
  };
  /* ]]&gt; */
//--&gt;&lt;/script&gt;
&lt;script type="text/javascript"    src="http://pagead2.googlesyndication.com/pagead/show_afmc_ads.js"&gt;&lt;/script&gt;
</code>

<p/>

That's my own code there but you can feel free to use it with your own sites. ;) I decided to whip up a quick application to see how well this works. Not surprisingly, once I dropped in the code, it just worked. For my application I created a "Misfortune Cookie" generator, which simply picks a random (and sad) fortune to share. I spent all of ten minutes on this, but my son and friends loved it.

<p/>


<img src="https://static.raymondcamden.com/images/cfjedi/device-2011-10-10-081859.png" />

<p/>

The ad choices seem a bit limited. There you can see it is a Google ad. I've seen medical ads as well as financial ones.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/device21.png" />

<p/>

The only part that was semi-difficult was getting the ad to the bottom of the screen. I wrapped the ad code in a div that began like so:

<p/>

<code>
&lt;div style=";position:absolute;bottom:0;left:0;"&gt;
</code>

<p/>

If you want to play with this app, you can download it <a href="https://market.android.com/details?id=com.camden.misfortunecookie&feature=search_result">here</a>. I'm not supposed to ask people to click on ads. So I won't do it. But I'll happily report back on earnings if folks <i>do</i> click on the ads. But I'm not asking you to. M'kay?

<p/>

One thing I want to stress here is that this is an experiment. To be honest, I don't know if I was supposed to even use this ad format on a 'native' application. This may be totally against the rules, and if so, well, it was a fun experiment at least. If anyone wants the complete code, just ask. The Misfortune Generator is simply an array of strings that I pick randomly from.