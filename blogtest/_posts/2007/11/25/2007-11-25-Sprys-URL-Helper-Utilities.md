---
layout: post
title: "Spry's URL Helper Utilities"
date: "2007-11-25T16:11:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/11/25/Sprys-URL-Helper-Utilities
guid: 2494
---

Every time I turn around I run across yet another cool feature of Spry. I'm going to have to force myself to sit down and read the docs cover to cover because I'm sure there is a lot that I'm missing. Today's discover is the URL Utils library. As you can probably guess, this utility library helps you work with URLs.
<!--more-->
There are two main functions you will use to examine URL variables: Spry.Utils.getLocationParamsAsObject and Spry.Utils.getLocationHashParamsAsObject. The first function grabs 'regular' URL parameters. Consider this URL:

http://www.raymondcamden.com/foo.cfm?paris=truediva&lindsey=lush

We can grab the URL parameters like so:

<code>
&lt;script src="/spryjs/SpryURLUtils.js"&gt;&lt;/script&gt;
&lt;script&gt;
var params = Spry.Utils.getLocationParamsAsObject();

alert(params.paris);
alert(params.lindsey);
alert(params.nicole);
&lt;/script&gt;

&lt;p&gt;
This page left intentionally blank.
&lt;/p&gt;
</code>

The first line of code loads the utility library. I then grab the parameters as an object. Once done, it acts just like using the URL scope in ColdFusion. As you can see - I alert each value, including a third one. If you run this code, and supply both URL parameters like I did above, you will get their values in the alerts, and an undefined string for the third test.

The getLocationHashParametersAsObject works with hash parameters in a URL, like so:

http://www.coldfusionjedi.com/index.cfm#ray=1

Using getLocationHasParametersAsObject would let me find the value of ray in the URL above.

Both of these functions work with the current URL. To supply a URL, you would use Spry.Utils.getURLParamsAsObject and Spry.Utils.getURLHashParamsAsObject. 

Lastly, you can work with a partial URL string (like foo=1&goo=2) with the Spry.Utils.urlComponentToObject function.

So - what is a real use case for this? Where things get interesting is when you mix them with Spry Datasets. Because it is easy to introspect the URL, you can do things like presetting a row in the dataset based on URL parameters. (Don't forget Spry lets you run functions before and after a dataset has loaded.) For a good set of examples, see:

<a href="http://labs.adobe.com/technologies/spry/samples/data_region/DataWithURLParams.html">Using URL Parameters to Control Data Regions</a>

The full documentation for this utility may be found here:

<a href="http://labs.adobe.com/technologies/spry/samples/utils/URLUtilsSample.html">URL Utils Sample</a>

Thanks go to the use V1 Fusion and his forum post <a href="http://www.adobe.com/cfusion/webforums/forum/messageview.cfm?forumid=72&catid=602&threadid=1317152&enterthread=y">here</a>.