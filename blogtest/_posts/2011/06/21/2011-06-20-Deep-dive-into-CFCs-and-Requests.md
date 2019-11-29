---
layout: post
title: "Deep dive into CFCs and Requests"
date: "2011-06-21T07:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/06/21/Deep-dive-into-CFCs-and-Requests
guid: 4276
---

Last week I had an interesting discussion with Jaana G., a ColdFusion developer, who wasn't very clear on how CFCs operate over the wire. She had used CFCs as web services but didn't quite get how to use them in other ways - like for Ajax applications. I did a quick check of the docs and found this page: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec0ac4a-7fd9.html#WSc3ff6d0ea77859461172e0811cbec22c24-7db0">Invoking component methods by using a URL</a>. While this explains some of the feature, it completely skips over the returnFormat portion and therefore wouldn't be too useful for Ajax developers. I thought then it might be a good idea to wrote up a guide that covers exactly what happens when you work with CFCs via HTTP requests. Any comments or corrections would be greatly appreciated.
<!--more-->
<p/>

Let's begin slowly with a simple CFC. The code below will be used for our demonstration.

<p/>

<code>
component {

	public string function helloWorld(string name="Nameless") {
		return "Hello, #arguments.name#";	
	}

}
</code>

<p/>

Nothing too complex here, right? Just one simple helloWorld method with an optional name argument. Given this, when you open your browser and point to the URL, in my case, http://localhost/test.cfc, you get... 

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip118.png" />


<p/>

Unless you have both your CF Admin and RDS passwords turned off, you are prompted to enter one of them. If you do, you then get a description of the CFC and it's methods:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip119.png" />

<p/>

This is a pretty handy service actually. The more you describe your CFC, for example, adding hints to your method and arguments, the more documentation you will get. However, keep in mind that it is only 'safe' on a development server. You won't have the admin unprotected anywhere else (I hope!) so this is really just for developers. (If you want a copy of those nice docs without sharing your CF Admin password, consider the <a href="http://www.cflib.org/udf/cfcToPrinter">cfcToPrinter</a> udf.) <b>So to recap - if you request a CFC just by file name with nothing else then you get either the login prompt or the self-generated documentation.</b>

<p/>

So how do we begin actually using our CFC over the wire? First off - ColdFusion is going to prevent you from remotely executing any method that is not marked "remote". In the code block above we had used "public". So first off, let's change that real quick:

<p/>

<code>
component {

	remote string function helloWorld(string name="Nameless") {
		return "Hello, #arguments.name#";	
	}

}
</code>

<p/>

There are thee main ways you will see people use CFCs remotely:

<p/>

<ol>
<li>Web Services
<li>Flash Remoting
<li>Straight HTTP Calls
</ol>

<p/>

In this guide I'm focusing on the last item above, but let's quickly cover the first two as well. In order for a CFC to be used as a web service, the client calling your CFC simply changes the URL to include ?wsdl as the end. So my previous url of localhost/test.cfc becomes localhost/test.cfc?wsdl. That's it. If you open the CFC with your own browser and enter that URL you will see the response is totally changed:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip120.png" />

<p/>

What you are seeing there is the "WSDL" for the web services. You can think of this as documentation for web service clients. You <i>can</i> read this - much like you <i>can</i> build your own airplane to travel, but frankly, you really don't want to. If you want your CFC to be used as a web service by someone else, you simply tell them the URL. Using the web service is a matter of what their client is. As we know, in ColdFusion it is pretty simple. Once you createObject the web service, you can treat it like a simple library.

<p/>

I'm not going to cover Flash Remoting at all - outside to say that it just plain works. If you are using Flex than you will have a RemoteObject tag and will address the CFC via "dot" notation. So given that my CFC was called test and was in web root, I'd just use "test". If my CFC had been in a remote folder under a subdirectory called tests, I'd use "remote.tests.test." Nothing else is required. There's things you can do to optimize your code more for the Flex/Flash client, but again, I'm not going to spend much time on that now. (And by the way, it works just as easy for Flex/Flash on the mobile devices as well.)

<p/>

So now we are on our third option - straight HTTP calls. The <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec0ac4a-7fd9.html#WSc3ff6d0ea77859461172e0811cbec22c24-7db0">documentation</a> I had linked to earlier discusses both URL and Form based requests. It basically boils down to this - <b>you must tell ColdFusion what method you want to run</b>. In URL form, that's just by adding a method attribute. In form form (oops, form mode let's say), it's just adding a method form field. So for example, I'd change my URL to this to invoke my helloWorld method: localhost/test.cfc?method=helloWorld. In a form, I'd include a field, typically hidden, that used method for a name and helloWorld for a value. <b>Basically, the method name/value pair is special in regards to running CFCs.</b> So what happens when I try that with my CFC?

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip121.png" />

<p/>

Nice and simple, right? If I want to include a name, then I'd just add another argument: localhost/helloWorld.cfc?method=helloWorld&name=Darth

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip122.png" />

<p/>

That's it, right? Nope. View source and you will next see the other crucial change - the encoding:

<p/>

<code>
&lt;wddxPacket version='1.0'&gt;&lt;header/&gt;&lt;data&gt;&lt;string&gt;Hello, Darth&lt;/string&gt;&lt;/data&gt;&lt;/wddxPacket&gt;
</code>

<p/>

Woah, what the heck is that? Well what you are seeing is ColdFusion encoding the result. For a string it seems a bit pointless, but imagine for a minute you were returning an array of values. HTTP responses have to text or binary. Binary wouldn't work (most of the time). How would you represent then - in text - an array? XML encoding allows for that. This string version of the data an more easily be parsed remotely and converted back into real data. But WDDX? Most likely this is not what you want. Luckily ColdFusion 9 (and I'll talk a bit about earlier versions below) provides more control via the returnFormat attribute. There are three ways data can be returned over the wire:

<p/>

<ol>
<li>WDDX - This is the default and is a XML version of your data
<li>Plain - This is a "Don't touch anything" version. <b>It only works for simple values, like strings, dates, numbers.</b>
<li>JSON - This is the most preferred format. JSON is slimmer than XML and understood by more clients, including libraries like jQuery.
</ol>

<p/>

To control this behavior, you have two choices (technically 3 but we're going to ignore one for now). You either specify returnFormat in your CFC function as an argument or you pass it over the URL. For the most part, I recommend specifying it in the URL, like so: localhost/test.cfc?method=helloWorld&returnFormat=plain&name=Darth. If you run that using my test code, you will see a plain text result. (But be sure to View Source!) Let's add another method though so we can see an example of something a bit more complex:

<p/>

<code>
component {

	remote string function helloWorld(string name="Nameless") {
		return "Hello, #arguments.name#";	
	}

	remote array function getNames() {
		return ["Ray","Scott","Todd","Jason","Booger"];
	}
	
}
</code>

<p/>

I've added a new function to my CFC called getNames. It returns an array of 5 names. Watch what happens when we return it using the 3 different return types:

<p/>

<b>localhost/test.cfc?method=getNames&returnformat=wddx</b><br/>
<code>
&lt;wddxPacket version='1.0'&gt;&lt;header/&gt;&lt;data&gt;&lt;array length='5'&gt;&lt;string&gt;Ray&lt;/string&gt;&lt;string&gt;Scott&lt;/string&gt; &lt;string&gt;Todd&lt;/string&gt;&lt;string&gt;Jason&lt;/string&gt; &lt;string&gt;Booger&lt;/string&gt;&lt;/array&gt;&lt;/data&gt;&lt;/wddxPacket&gt;
</code>

<p/>

<i>Note - I added a space or two to make it wrap.</i>

<p/>

<b>localhost/test.cfc?method=getNames&returnFormat=json</b><br/>
<code>
["Ray","Scott","Todd","Jason","Booger"]
</code>

</p>


<b>localhost/test.cfc?method=getNames&returnFormat=plain</b><br/>
<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip123.png" />

<p/>

As you can see, trying to return a complex value "plainly" is not possible. 

<p/>

So I hope this helps. I want to leave you guys with a few other things to consider as well. Consider this extra reading material and if your mind is swimming already, stop for now.

<p/>

<ul>
<li>So what about versions of ColdFusion earlier then 9 and return types? In ColdFusion MX, the result was always WDDX. Period. If you wanted anything like, like JSON for your jQuery, you pointed to a CFM instead. The CFM would run the CFC and create a JSON response. ColdFusion 7 added a modification where if returnType (not format, type) was XML, then it would NOT WDDX-ize the result. This was useful for returning XML but not JSON obviously. In ColdFusion 8 then we finally got returnFormat to make it more explicit.
<li>There is another special argument - queryFormat - that modifies how queries are encoded. It's discussed <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec10e40-7fe3.html">here</a> and in earlier blog posts. 
<li>Did you know that ColdFusion 901 made it possible to use CFCs outside of web root? This feature is limited to binding and AjaxProxy - you can't use it with your jQuery code - but it is a new feature. Check the 901 release notes for more information. (Here is the link I have for the release notes - it isn't loading for me right now so good luck: <a href="http://www.adobe.com/support/documentation/en/coldfusion/releasenotes.html">http://www.adobe.com/support/documentation/en/coldfusion/releasenotes.html</a>)
<li>What about Application.cfc? A request to load a CFC is like any other request. If this is the very first hit, onApplicationStart is run. Ditto for onSessionStart. In earlier versions of ColdFusion onRequest would fire and could possibly break your request. ColdFusion now has an onCFCRequest method instead that can handle these requests. This isn't a feature most people use though.
<li>A common question I get is - what about CFCs I set up in onApplicationStart? CFCs that are initialized with variables like for my DSN? There's a few ways to handle them, but the simplest is to create another CFC that just runs as a proxy. So if you have a CFC called blog, for example, defined with a DSN and other variables, and it's stored in the Application scope, you can make a new CFC that works with that CFC. Maybe doing something as simple as:  return application.blog.getComments(). But wait - isn't addressing outside scopes in a CFC bad? Sure - but like most tips - there's always exceptions, and this is a good one. In this case,  your remote CFC is acting as a proxy to your application-scoped code and that's a great use I think.
</ul>