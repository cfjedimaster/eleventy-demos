---
layout: post
title: "ColdFusion 8: AJAX UI Pods"
date: "2007-06-11T23:06:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/06/11/ColdFusion-8-AJAX-UI-Pods
guid: 2113
---

Tonight I want to show another new UI control in ColdFusion 8, the Pod. While not the most exciting item in the world, it is a pretty nice and simple to use. The simplest example can be done in three lines:
<!--more-->
<code>
&lt;cfpod&gt;
This is a pod.
&lt;/cfpod&gt;
</code>

Which results in:<br />

<img src="https://static.raymondcamden.com/images/Picture%202.png">

Live demo <a href="http://www.coldfusionjedi.com/demos/layout/pod1.cfm">here</a>.

So obviously that doesn't do too much. Lets add a bit more information to the pod:

<code>
&lt;cfpod title="Cool Advertising Info Here" width="200" height="150"&gt;
This is where I'd put the ad. Or other interesting fine.
&lt;/cfpod&gt;
</code>

Which results in:<br />
<img src="https://static.raymondcamden.com/images/cfjedi/Picture%203.png">

Live demo <a href="http://www.coldfusionjedi.com/demos/layout/pod2.cfm">here</a>.

You can also add some pretty stles to the pod as well:

<code>
&lt;cfpod title="Cool Advertising Info Here" width="200" height="150" 
		headerStyle="background-color: black; color: red;"
		bodyStyle="background-color: ##fff68a"&gt;
This is where I'd put the ad. Or other interesting fine.
&lt;/cfpod&gt;
</code>

Which results in:<br />

<img src="https://static.raymondcamden.com/images/cfjedi/Picture%204.png">

Live demo <a href="http://www.coldfusionjedi.com/demos/layout/pod3.cfm">here</a>. And yes, this is why I'm not alllowed to do web design.

Finally, like the other UI controls, you do not have to provide the content directly inside the control. You can use the source attribute instead:

<code>
&lt;cfpod title="J2EE Powered Clock" source="podsource.cfm" /&gt;
</code>

<code>
&lt;cfoutput&gt;
&lt;p&gt;
The current time is #timeFormat(now(),"h:mm:ss tt")#.
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>

Live demo <a href="http://www.coldfusionjedi.com/demos/layout/pod4.cfm">here</a>.

And in case you are wondering what happens when you do this...

<code>
&lt;!--- I'm pod4.cfm by the way... ---&gt;
&lt;cfpod title="J2EE Powered Clock" source="pod4.cfm" /&gt;
</code>


<img src="https://static.raymondcamden.com/images/cfjedi/Picture%205.png">

I think I literally felt my laptop get 20 degrees warmer when I did this. (And no, there isn't a live demo of this.)

In terms of JavaScript API, the navigate function works on Pod containers:

<code>
&lt;cfpod title="Test" name="mypod"&gt;
&lt;/cfpod&gt;

&lt;a href="javaScript:ColdFusion.navigate('podsource.cfm', 'mypod')"&gt;Load me up some pod goodness&lt;/a&gt;
</code>

Live demo <a href="http://www.coldfusionjedi.com/demos/layout/pod5.cfm">here</a>.

And please - can we skip the comments about the size of the JavaScript libraries? Pretty please? :)