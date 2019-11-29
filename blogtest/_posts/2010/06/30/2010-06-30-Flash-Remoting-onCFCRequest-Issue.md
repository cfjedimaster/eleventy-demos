---
layout: post
title: "Flash Remoting, onCFCRequest Issue"
date: "2010-06-30T14:06:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2010/06/30/Flash-Remoting-onCFCRequest-Issue
guid: 3865
---

This week I exchanged a few emails with Damien Bruyndonckx concerning an interesting bug he found with flash remoting and onCFCRequest, a new feature added to ColdFusion 9. (You can see a quick review of this <a href="http://www.raymondcamden.com/index.cfm/2009/7/13/ColdFusion-9-fixes-onRequest-adds-onCFCRequest">here</a>.) I was able to confirm the issue he found (which he has already logged a bug for) and I thought I'd share with you guys the details. All credit for this goes to Damien - I'm just the messenger.
<!--more-->
<p/>

Damien was making use of a simple Flex project that used Flash Remoting to hit a CFC on his ColdFusion server. As part of his process, he made use of onCFCRequest. If you follow the docs, you will see that the "skeleton" of this method should be like so:

<p/>

<code>
public void function onCFCRequest(string cfcname, string method, struct args) {
}
</code>

<p/>

As you can see - there are three arguments. The name of the CFC. The method being run. And finally - a structure of arguments to pass along to the method. However, as soon as he added this method to his Application.cfc file, he got an error concerning the type of the args argument. Turns out it was being passed as an array, not a struct. Upon further testing, he discovered that whenever he called his services like so:

<p/>

<code>
someRemoteService.someMethod(x,y,z)
</code>

<p/>

The type of args was <i>always</i> an array. (He also saw the same if the method had no arguments at all.) But if he switched to using a basic object:

<p/>

<code>
data = new Object();
data.x = "a";
data.y = "b";
data.z = "c";
someRemoteService.someMethod(data)
</code>

<p/>

Then the args argument was a structure again. Whats interesting though is that when he repeated his tests over HTTP (both with simple HTTP and cfajax), the args argument was always a structure. This appears to only be an issue when using Flash Remoting.

<p/>

Of course the fix is easy enough - switch the method signature to be "any" and it will always work. What's interesting is that if you then pass args along to your CFC using argumentCollection, whether it be an array or struct, it continues to work ok.

<p/>

Has anyone else run into this?