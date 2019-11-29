---
layout: post
title: "Playing with PhoneGap? Try the Mega Demo"
date: "2011-10-04T11:10:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/10/04/Playing-with-PhoneGap-Try-the-Mega-Demo
guid: 4379
---

So yesterday was pretty exciting at MAX. I plan on doing a write up after everything is done, but I wanted to specifically talk a bit about the PhoneGap news. In case you didn't hear it, Adobe acquired Nitobi Software, the guys behind <a href="http://www.phonegap.com">PhoneGap</a>. PhoneGap allows you to take your HTML and JavaScript and deploy natively to the mobile platform. Between PhoneGap and Flex Mobile, you've got two really good options for mobile development. I've got a few blog posts planned for later in the week, but today I wanted to share a little project I've been working on called PhoneGapMega.
<!--more-->
<p>

<p/>
PhoneGapMega is simply a 'one app demo' for all (almost all, details below) of the PhoneGap APIs. I wanted an application I could run so that I could both learn about their APIs as well as <i>see</i> how the APIs work on a real device. It's Android only for now, but in theory should work fine on iOS as well. (I plan to build out an IPA after I get back from MAX.) Many of the code samples come straight from the PhoneGap docs themselves and some are new. 
<p/>
You can download the APK I've got attached to this blog entry, or, even better, hit up the <a href="https://github.com/cfjedimaster/PhoneGapMega">GitHub repo</a> I set up and download/modify the source yourself. (Note - the Github repo contains both the HTML source and files from my Eclipse project itself. In the future I remove that and just commit the HTML resources.)
<p/>
Here's a few quick screen shots:
<p/>
<img src="https://static.raymondcamden.com/images/s11.png" />
<p/>
<img src="https://static.raymondcamden.com/images/cfjedi/s22.png" />
<p/>
<img src="https://static.raymondcamden.com/images/cfjedi/s31.png" />
<p/>
As I mentioned, the mega demo contains examples of <i>almost</i> all the APIs. The main one I'm missing now is a demo for the File APIs. I've got a basic idea of what I'm going to do there so I'll be adding that soon. I've also added a demo showing how you can call remote resources without worrying about the normal browser restrictions on 'out of domain' XHR calls. In this case, I'm calling a ColdFusion Component on my server.
<p/>
I hope this is helpful for folks looking to explore PhoneGap. I'll also point out I'm definitely not the first to do this. You can download <a href="https://market.android.com/details?id=com.gwtmobile.phonegap&feature=search_result">GWT Mobile PhoneGap Showcase</a> for another example as well.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FPhoneGapMega%{% endraw %}2Eapk'>Download attached file.</a></p>