---
layout: post
title: "Building a simple Alert system with Adobe AIR and ColdFusion"
date: "2010-09-19T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/19/Building-a-simple-Alert-system-with-Adobe-AIR-and-ColdFusion
guid: 3946
---

Every now and then I get a simple question that leads to loads and loads of code. That may sound bad but sometimes it can be fun as heck. What follows is a proof of concept "Alert" system built with Adobe AIR and ColdFusion. It was all spurred by the following email from Michael.

<p/>
<!--more-->
<blockquote>
Not having stepped off into Flex/Air yet, I have a question.
<br/><br/>
Is it possible to build an air app for the enterprise that when installed can "hibernate" in the system tray (where the clock is in windows) and the Mac equivalent?
<br/><br/>
Now that you have it installed on 10,000 user desktops in your enterprise, from a central console/web page/watched folder/whatever, you can broadcast a message like "do not open the email titled:I am a virus, open me"
<br/><br/>
Every desktop that has this air widget hibernating will then wake up, expand to fill the screen, get focus and display the message?
<br/><br/>
This could be used for things like "Shelter in place, Toxic gas released", "Tornado coming" or "Nuclear Launch Detected"
</blockquote>

<p/>

What's cool about this set of questions is that it covers a couple different topics. Let's tackle these one by one. (And I'll remind folks - I'm learning AIR myself so keep in mind that there are probably multiple better ways to do this.) First - and probably easiest - is the question about an AIR application hibernating. This is not only possible, it is trivial. Every AIR application ships with an application descriptor. This is an XML file that defines lots of startup and metadata information about your application. One of these properties is a boolean that determines if the initial application is visible:

<p/>

<code>
&lt;!-- Whether the window is initially visible. Optional. Default false. --&gt;
&lt;visible&gt;false&lt;/visible&gt;
</code>

<p/>

So yep - that's it. Change visible to false and your application is essentially invisible. Just keep in mind that this makes it a bit difficult to actually <i>stop</i> the application. During testing I recommend keeping the task manager up. If you see adl.exe (or the Mac equivalen) you can kill it manually until you properly setup a way for your application to die. 

<p/>

Now let's tackle the second part - having an application run in the Windows taskbar and the Mac doc. On the Mac, this isn't necessary. Your application, even if invisible, will have a place in the doc:

<p/>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-09-19 at 2.01.46 PM.png" />

<p/>

As you can see, the default icon is a bit bland, but I can always pick a nicer icon. So on the Mac, this is a non-issue. I can also quit via the dock as well, so that's covered. On Windows, it is a bit more complex. For this part, I relied on a very good article by Charles Ward. Unfortunately, it was accidentally nuked in the Adobe Developer Center update (supposedly soon to get fixed), so for now I'll link folks to the cached version: <a href="http://webcache.googleusercontent.com/search?q=cache:RqrdVCAtG0MJ:www.adobe.com/devnet/air/ajax/quickstart/creating_toast-style_windows.html+creating+toast+style+windows+adobe+air&cd=1&hl=en&ct=clnk&gl=us">Creating toast-style windows</a>. In this article Charles talks about a simple application that can create toast-style alerts. These are alerts that pop up in a corner for a few seconds and go away. I'm not so concerned with the toast alerts (which - btw - work pretty cool under AIR 2 with a few updates - I'll share my mod of his code sometime soon), but rather his code on getting into the Windows task bar. 

<p/>

AIR is - for the most part - going to be platform agnostic. That doesn't mean though that it will <i>always</i> be platform agnostic. You can - for example, ask about the local system's capabilities. Sometimes those capabilities directly refer to things that are OS specific. Here is a version of his code that I'm using for the Alert system:

<p/>

<code>
$(document).ready(function() {
		
	var iconLoad = new air.Loader(); 
	var iconMenu = new air.NativeMenu(); 
	var exitCommand = iconMenu.addItem(new air.NativeMenuItem("Exit")); 
	exitCommand.addEventListener(air.Event.SELECT,function(event){ 
		air.NativeApplication.nativeApplication.icon.bitmaps = []; 
		air.NativeApplication.nativeApplication.exit(); 
	}); 

	var iconLoadComplete = function(event) { 
	       air.NativeApplication.nativeApplication.icon.bitmaps = [event.target.content.bitmapData]; 
	} 
	
	if (air.NativeApplication.supportsSystemTrayIcon) { 
	        air.NativeApplication.nativeApplication.autoExit = false;
		iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE,iconLoadComplete); 
		iconLoad.load(new air.URLRequest("icons/umbrella.png")); 
		air.NativeApplication.nativeApplication.icon.tooltip = "Alert System"; 
		air.NativeApplication.nativeApplication.icon.menu = iconMenu; 
	} 
		
});
</code>

<p/>

Ok, we've got a few things going on here. Let's begin in the lower third. Notice the supporsSystemTrayIcon. This is the windows task bar (is it tray? I always forget the real name of that darn thing) that Michael wants to use in Windows. We can check to see if it is supported by just checking the boolean. This is much easier than checking some operating system string and making it work with Vista, Windows 7, etc. If it is supported, we are going to load in an icon for that area and attach a menu to it (look at the code on top). This will let us right click on the icon in Windows and kill the application. All in all it is pretty simple and gives us the desired result:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen2.png" />

<p/>

The little red umbrella is my icon. I figured umbrellas were good for an alert system because uh... all my years in User Experience said it made sense. There ya go. 

<p/>

Ok - so let's see where we are now. We've got an hibernating (invisible) application with a custom icon for the Windows tray (and again, the Mac coulda used a nicer icon as well). Now we just need the actual alert system. Why not make use of the kick butt BlazeDS system that ships - for free - with ColdFusion. Setting this up is a bit much for this blog. Instead I relied on a series of blog posts by Stephen Moretti: <a href="http://nil.checksite.co.uk/index.cfm/2010/1/28/CF-BlazeDS-AJAX-LongPolling-Part1">AJAX Longpolling with ColdFusion and BlazeDS - Getting set up</a>. His series talks about how you can set up the Flex-Ajax bridge. This gives you a few JS files and a SWF file you can include in your HTML-based AIR application to give you BlazeDS/LCDS support. I can say I ended up switching from LongPolling to regular polling in my own code so what you see here will be slightly different than what you see in his blog entries. All in all - it took me maybe 20 minutes to follow the steps and get the JS/SWF files for my application. I also created the ColdFusion Event Gateway on my server. This is what my ColdFusion code will use to broadcast messages out.

<p/>

Let's take a look at the code on the client side. I began by initializing the bridge:

<p/>

<code>
&lt;script type="text/javascript"&gt;
// load the blazeds bridge
FDMSLibrary.load("./lib/FDMSBridge.swf",initPolling);
&lt;/script&gt;
</code>

<p/>

And then wrote the initPolling function. THis is called automatically when the bridge is ready:

<p/>

<code>
function initPolling() {
	air.trace('running');

	consumer = new Consumer(); 
	consumer.setDestination('ColdFusionGateway'); 
	consumer.addEventListener("message", messageHandler); 
	consumer.addEventListener("channelDisconnect", disconnectHandler);
	consumer.addEventListener("channelFault", faultHandler);

	var cs = new ChannelSet();
	cs.addChannel(new AMFChannel("cf-polling-amf","http://"+server+"/flex2gateway/cfamfpolling"));
						
	consumer.setChannelSet(cs); 
	consumer.subscribe();
	air.trace('finished init');
}
</code>

<p/>

So - line by line - the code here is listening to a destination setup on the server called ColdFusionGateway. This should exist by default. Normally you would want to work with a custom destination but I wanted this as simple as possible. I set up a few events - one for incoming messages, one for a disconnect event (which can happen for a variety of reasons), and a fault handler. Finally I hook up to my server (the variable, server, was palpatine, my Windows box). At this point, when I run the application, it should connect to the BlazeDS system on my ColdFusion server and listen in for messages. Before we go look at the message handler, let's go over to ColdFusion and look at the application I created.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-09-19 at 2.32.21 PM.png" />

<p/>

I've got a simple form with two fields. The first item asks for a severity of the alert. This would probably be better as a fancy jQuery-based slider, but for now, I kept it as just a field. The second field is the actual alert. So the idea is - you decide how important the message is and then write the message. The code to work with this is pretty trivial:

<p/>

<code>
&lt;form method="post"&gt;
Enter a severity (0-100): &lt;input type="text" name="severity"&gt;&lt;br/&gt;
Enter a message: &lt;input type="text" name="text" size="200"&gt;&lt;br/&gt;
&lt;input type="submit" name="send" value="Send Alert"&gt;
&lt;/form&gt;

&lt;cfif structKeyExists(form, "send") and len(trim(form.severity)) and len(trim(form.text))&gt;

	&lt;cfset clientMsg = {% raw %}{destination="ColdFusionGateway", body = {severity=form.severity, text=form.text}}{% endraw %}&gt;
	&lt;cfset ret = sendGatewayMessage('Alert System', clientMsg)&gt;
	&lt;p/&gt;Message sent. &lt;cfoutput&gt;#ret#&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

<p/>

Ignoring the HTML, the logic to broadcast the message comes down to 2 lines. One to create a structure of data, the body, which comprises my severity and text, and one to actually send it. That's it. And yeah - I'm skipping a bit of work that Stephen covers in his blog entries, but  how much easier could that ColdFusion code be? 

<p/>

Now let's get back to our client. The message handler I used was this:

<p/>

<code>
function messageHandler(event){ 
	air.trace('ran messageHandler');
	var msgBody = event.getMessage().getBody();
	var severity = msgBody.SEVERITY;
	var text = msgBody.TEXT;
	//display the message, abstracted out since it is a bit complex
	displayMessage(text, severity);
}
</code>

<p/>

The function here simply gets the body of the message and breaks out the two pieces of data I know will exist - SEVERITY and TEXT. For the actual display of the message, I broke it out into another function:

<p/>

<code>
function displayMessage(text,sev) {
	//Ranges are: 0-33 (Low)
	//			  34-66 (Medium)
	//			  67+ (High)
	if(sev &lt;= 33) {
		alert("[INFORMATION MESSAGE] " + text);
	} else if(sev &lt;= 66) {
		alert("[WARNING MESSAGE] " + text) 
	} else {
		alert("[CRTICAL ALERT!] " + text);
	}
}
</code>

<p/>

So - I decided to cheap out and just make use of alerts. I had options of course - HTML windows, native Windows, but an alert was quick and simple. I looked at the severity and based on the value I preprended it with a label. All that's let then is a few tests.

<p/>

Here is a low level warning message as seen on the Windows machine:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen3.png" />

<p/>

Now here is a slightly more important message as seen on the Mac:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen31.png" />

<p/>

And finally - a critical message:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen4.png" />

<p/>

And in case it wasn't obvious - when I tested I had both clients running and both saw the messages within a few seconds of each other. I didn't test it with 10,000 clients, but I'd imagine it would work. (2 to 10K - how different can it be??) One final note - let's look at the two other event handlers - the fault and disconnect handlers:

<p/>

<code>
function disconnectHandler(event) {
	air.trace('DISCON');
			
	var cs = new ChannelSet();
	cs.addChannel(new AMFChannel("cf-polling-amf","http://"+server+"/flex2gateway/cfamfpolling"));
	consumer.setChannelSet(cs); 
	consumer.subscribe();
			
}

function faultHandler(event) {
	air.trace('FAULT!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	air.trace(event.getFaultString());
	air.trace(event.getFaultDetail());			
}
</code>

<p/>

So the faultHandler is kinda pointless - mainly for debugging - but I could have made it actually report something nice to the user. The disconnect handler is a bit more interesting. I've got João Fernandes to thank for this. I noticed that when ColdFusion restarted, my active clients would get a disconnect event, try to reconnect, but couldn't get data. It was João who suggested recreating the channel set (and I shouldn't be duplicating the code like that - I should have a method for it). This worked perfectly.

<p/>

I've attached the entire Aptana project to this blog entry. I hope it helps give people ideas on how useful this stuff is. So many BlazeDS/LCDS examples focus on chat that it is easy to forget how many other ways it can be used as well.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FAlertSystem%{% endraw %}2Ezip'>Download attached file.</a></p>