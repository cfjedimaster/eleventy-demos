---
layout: post
title: "Sending Data with Spry"
date: "2006-07-12T21:07:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/07/12/Sending-Data-with-Spry
guid: 1397
---

So I've showed a few Spry examples that are great examples of displaying XML data using AJAX. But so far, these have all been "Read Only" type demonstrations. By that I mean, I simply used Spry as a nicer front end to my applications. One question you may have is - how do I use Spry to communicate <i>back</i> to the server? There are two answers to this question based on what you actually have in mind.
<!--more-->
If your intent is to load XML data based on some setting/value on the client, you can actually do this very easily in Spry if the data you want to load is based on another data set already loaded. So that's pretty complicated, but take a look at the <a href="http://www.cflib.org/spry/">CFLib Spry</a> demo. Notice how the list of UDFs is based on the library selected. The libraries themselves are also driven by Spry. The libraries are loaded via this Spry call:

<code>
var dsLibraries = new Spry.Data.XMLDataSet("cflibspry.cfc?method=getlibraries", "libraries/library");
</code>

So how do I call back to the server to load the right UDFs? I simply bind the URL for the dataset to the libraries dataset like so:

<code>
var dsUDFs = new Spry.Data.XMLDataSet("cflibspry.cfc?method=getudfs&library={% raw %}{dsLibraries::ID}{% endraw %}", "udfs/udf");
</code>

Notice the {% raw %}{dsLibraries::ID}{% endraw %} token. This simply says to make the call and pass in the current value for the dataset, dsLibraries, column ID. So technically, this is an example of Spry letting you talk back to the server and passing along client information. It's also extremely simple and one of the reasons I've fallen in love with Spry. 

However - at a more general level, you may ask how Spry would let me call an arbitrary URL on the server. Sure, the dataset stuff makes it simple, but is specifically built for loading data, not just calling random URLs. Spry let's you do this with the loadURL. I want to thank Kin Blas of the Spry team for the following example:

<code>
function myCallback(request) {% raw %}{/* Do whatever you want with results */}{% endraw %}

Spry.Utils.loadURL("GET",
"http://www.cflib.org/foo.cfc?method=updatename&name=" +
encodeURIComponent(value), true, myCallback);
</code>

Obviously you have a choice between GET and POST calls. The "true" argument (third one) specifies if the call is asynchronous or not. Lastly, you can specify a function to fire when done. Obviously if you don't need the result you can leave that off.