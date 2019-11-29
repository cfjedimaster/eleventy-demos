---
layout: post
title: "Handling remote errors in Flex 2"
date: "2006-12-04T21:12:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2006/12/04/Handling-remote-errors-in-Flex-2
guid: 1692
---

After my <a href="http://ray.camdenfamily.com/index.cfm/2006/12/4/Simple-Error-Templates">last post</a> on a simple error handler for ColdFusion, I was asked how I would do the same in Flex 2. Keep in mind I'm still new to all this - so I'm sure (and I'm counting on!) my readers to correct me - but here is my answer to that question.
<!--more-->
First and foremost - and this applies to <i>any</i> software program, you need to decide what should happen when something goes wrong. In general you can divide problems into two categories:

<ul>
<li>"Oh Crap" Errors. These are errors that are severe. They can be things like a bad database connection or the inability to read the file system. In general the reaction to this type of problem is to halt everything, hence the "Oh Crap" term. In this situation you basically stop the entire application from being used until the problem is corrected.
<li>"No Big Deal" Errors. These are errors of a not-so-critical nature. For example, the <a href="http://www.coldfusionportal.org">ColdFusion Portal</a> aggregates a few RSS feeds. If those feeds go down, I display a simple error message, but I certainly don't bring down the entire application. It wouldn't make sense. 
</ul>

So not every error can be put into one of these categories, but you get the general idea. My point here is that nothing Flex specific will change how you decide to deal with errors. 

So with all that behind me - the actual error handling is pretty simple. First I define my remote object:

<code>
&lt;mx:RemoteObject id="core" destination="ColdFusion" source="ErrorTest.test" showBusyCursor="true" &gt;
</code>

Next I define a method and add a fault handler:

<code>
&lt;mx:method name="getData" fault="getDataFault(event.fault)" result="getData(event)" /&gt;
</code>

Notice the fault= part. This tells Flex what to do when something goes wrong with the getData call. If it isn't obvious - you can set a different fault action for each method, and one at the remoteObject level to cover them all. 

Now that you've told Flex what to do with the error, here is some very simple code to do something with it:

<code>
function getDataFault(fault:mx.rpc.Fault):void {
	Alert.show(fault.faultCode,"faultCode");
	Alert.show(fault.faultDetail,"faultDetail");
	Alert.show(fault.faultString,"faultString");
}
</code>

All I did was alert various parts of the <a href="http://livedocs.macromedia.com/flex/2/langref/mx/rpc/Fault.html">Fault</a> object. I could have checked for the various values and actually handled them, but this gives you the idea. 
		
Question: How would you handle the "Oh Crap" version? Seems like it would make sense to either use a ViewStack and switch to a page with the error message. Or perhaps simply push the user to an HTML page with the same message. 

I included a zip of the files I used to test the code above. The CFC it calls tries to use a datasource that doesn't exist so it should throw an error for you.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive4%{% endraw %}2Ezip'>Download attached file.</a></p>