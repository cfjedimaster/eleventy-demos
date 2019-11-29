---
layout: post
title: "Latest Mobile app - WTFRU"
date: "2011-11-04T17:11:00+06:00"
categories: [coldfusion,html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2011/11/04/Latest-Mobile-app-WTFRU
guid: 4421
---

Today I held an open meeting over connect to discuss some interesting issues I ran into while building my latest mobile application. Thank you to all who attended. The recording link is at the very end of this blog post. For every one else, here is a quick look at what I built and why I built it.
<!--more-->
<p>

A few weeks back, my wife and I were eating dinner at a restaurant when a patron stood up to call a friend of his. I could hear him try to describe to his friend where he was. Something along the lines of...

<p>

"Ok, you're where?"<br/>
"Yeah, I'm at Burger Smith."
"Let's see - you want to take the road down the way a bit..."<br>
"No, not that road, the other one."<br/>
"Yeah then make a right at the light, come down 3 or 4 blocks, I forget..."<br/>
"Yeah, then I'm on the corner there."

<p>

It occurred to me that while there were apps to share your location with your friends, there wasn't an easy way (not that I knew of) to help get your friend to yourself. What I called a "tractor beam" application. It should be simple. An application can know where you are. It can easily send that information to someone else. That person can then use some other tool to figure out how to get back to you. That's where I ran into a problem though. By what process would the friend get back to you? Most likely they would <i>not</i> have my suber cool application on their device. It's there that I decided upon a hybrid approach.

<p>

My application would run on your phone and send a SMS to the friend.<br/>
The SMS would include a link to a web page where HTML/JS would be used for the other parts.

<p>

Here's an example of the application running on my device. It begins by finding where you are. This happens rather quickly so in the screen shot it's asking you to pick a friend.

<p>

<img src="https://static.raymondcamden.com/images/s13.png" />

<p>

And yes - the name is WTFRU. I figured Tractor Beam was already taken by a game. Credit goes to my boss <a href="http://gregsramblings.com/">Greg Wilson</a> for the name. To handle contact selection, I used the <a href="https://github.com/phonegap/phonegap-plugins/tree/master/Android/ContactView">ContactView</a> plugin instead of PhoneGap's Contact API. While PhoneGap supports a "Find" interface, and in theory you could search for *, I wanted something closer to the native look. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/s24.png" />

<p>

This plugin returns information about the contact, including their email and contact information. This allows me then to offer two choices for contacting them:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/s32.png" />

<p>

At this point, I could send a SMS using a SMS based URL, ala:

<p>

<code>
var body = "Find me by cliking here: "+beaconURL;
var theUrl = "sms:"+contactOb.phone+"?body="+escape(body);
window.location.href=theUrl;
</code>

<p>

But this leaves the user on the SMS page. Instead I used yet another plugin, <a href="https://github.com/phonegap/phonegap-plugins/tree/master/Android/SMSPlugin">SMSPlugin</a>. This brings the act of sending an SMS down to...

<p>

<code>
window.plugins.sms.send(contactOb.phone, 
  body, 
  function () { 
    alert("Message sent!");
    resetUI();
  },
  function (e) {
    alert('Message failed: ' + e);
  }
);
</code>

<p>

So, what happens next? I mentioned that this was a hybrid solution. The back end uses ColdFusion and ORM to record what I call "beacons." On the native side, my application sends my longitude and latitude to the remote server:

<p>

<code>
    x$(window).xhr("http://wtfru.coldfusionjedi.com/service/remote.cfc?method=registerBeacon&returnFormat=plain&longitude="+position.coords.longitude+"&latitude="+position.coords.latitude, {
</code>

<p>

Where ColdFusion records this and returns a URL that can be sent to the friend. The friend gets a URL in the SMS that looks a bit like so...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/s4.png" />

<p>

If you click on it, you end up at a ColdFusion page that does a few cool things:

<p>

<ul>
<li>First, it uses HTML5 geolocation to find your location.
<li>Second, it uses Google Maps to create a new map. Did you know that you can draw a map and <i>not</i> specify a center? By using a "bounds" object, you can add N markers to a map and let Google worry about centering it nicely around your markers. So my code then just becomes a simple matter of adding two markers and being done.
<li>Third, it uses the Directions service to get directions. I've blogged about this before. (See my blog entry <a href="http://www.coldfusionjedi.com/index.cfm/2011/3/9/Adding-driving-directions-to-a-jQuery-Mobile-web-site">here</a> where I demonstrated how a hotel site could tell you how to get to it.) What I didn't know was that their service supported automatic rendering. You can literally get directions and have Google write them out into a div for you. Seriously - that's it.
</ul>

<p>

Here is the top of the page you see on the mobile device.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/s5.png" />

<p>

Scrolling down gives you the driving directions:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/s6.png" />

<p>

All in all, a pretty simple idea, but I think it works well. I've included a zip that has my entire Android project as well as the ColdFusion code. I'm not sure if I'll release this to the market. I think it's useful, but it's not very pretty. Any way, let me know what you think.

<p>

<b>Recording URL: <a href="http://experts.adobeconnect.com/p4axu674iwr/">http://experts.adobeconnect.com/p4axu674iwr/</a></b>

<p>

For folks looking for buzzwords - here is a list of the technologies used:

<p>

<ul>
<li>PhoneGap
<li>xui.js
<li>ColdFusion
<li>jQuery
<li>Hibernate
<li>MySQL
<li>Eclipse
<li>Android SDK
<li>Bootstrap
</ul><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fwtfru%{% endraw %}2Ezip'>Download attached file.</a></p>