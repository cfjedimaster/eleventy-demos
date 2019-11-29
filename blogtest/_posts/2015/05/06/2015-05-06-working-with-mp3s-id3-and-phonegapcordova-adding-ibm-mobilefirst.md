---
layout: post
title: "Working with MP3s, ID3, and PhoneGap/Cordova - Adding IBM MobileFirst"
date: "2015-05-06T15:44:15+06:00"
categories: [development,javascript,mobile]
tags: [mobilefirst]
banner_image: 
permalink: /2015/05/06/working-with-mp3s-id3-and-phonegapcordova-adding-ibm-mobilefirst
guid: 6113
---

Welcome to the fourth and final entry in my series on using an ID3 reader for MP3s in a Cordova application. If you missed the initial entries (and I highly recommend reading these in order), they are:

<!--more-->

<ol>
<li><a href="http://www.raymondcamden.com/2015/04/29/working-with-mp3s-id3-and-phonegapcordova">Working with MP3s, ID3, and PhoneGap/Cordova</a></li>
<li><a href="http://www.raymondcamden.com/2015/04/30/working-with-mp3s-id3-and-phonegapcordova-2">Working with MP3s, ID3, and PhoneGap/Cordova (2)</a></li>
<li><a href="http://www.raymondcamden.com/2015/05/01/working-with-mp3s-id3-and-phonegapcordova-3">Working with MP3s, ID3, and PhoneGap/Cordova (3)</a></li>
</ol>

In this series, I described how we could use a JavaScript library and the Cordova File plugin to get ID3 info from MP3 files. In the <a href="http://www.raymondcamden.com/2015/05/01/working-with-mp3s-id3-and-phonegapcordova-3">last entry</a> I made use of the last.fm API to fetch album covers. Their API was simple to use, but you may have noticed something - my API key was embedded in the code:

<code>defs.push($http.get("http://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=" + encodeURI(artist) + "&album=" + encodeURI(album) + "&api_key=5poo53&format=json"));</code>

If my app was out in the world, anyone with two minutes to spare could fire up remote debugging and take a look at the code to find the API key. This is where something like <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a> can save the day. Back on April 8th (which was my birthday by the way, do I look older?) I <a href="http://www.raymondcamden.com/2015/04/08/using-mobilefirst-http-adapters-with-an-ionic-application">blogged</a> about using HTTP Adapters with MobileFirst.

The basic idea is simple:

1. You define your adapter at the command line. For me, I called mine lastfm.

2. You edit the adapter XML as needed. For me, I modified the domain for my service and specified a procedure name:

<pre><code class="language-markup">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;!--
    Licensed Materials - Property of IBM
    5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
    US Government Users Restricted Rights - Use, duplication or
    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
--&gt;
&lt;wl:adapter name=&quot;lastfm&quot;
	xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot; 
	xmlns:wl=&quot;http://www.ibm.com/mfp/integration&quot;
	xmlns:http=&quot;http://www.ibm.com/mfp/integration/http&quot;&gt;

	&lt;displayName&gt;lastfm&lt;/displayName&gt;
	&lt;description&gt;lastfm&lt;/description&gt;
	&lt;connectivity&gt;
		&lt;connectionPolicy xsi:type=&quot;http:HTTPConnectionPolicyType&quot;&gt;
			&lt;protocol&gt;http&lt;/protocol&gt;
			&lt;domain&gt;ws.audioscrobbler.com&lt;/domain&gt;
			&lt;port&gt;80&lt;/port&gt;	
			&lt;connectionTimeoutInMilliseconds&gt;30000&lt;/connectionTimeoutInMilliseconds&gt;
			&lt;socketTimeoutInMilliseconds&gt;30000&lt;/socketTimeoutInMilliseconds&gt;
			&lt;maxConcurrentConnectionsPerNode&gt;50&lt;/maxConcurrentConnectionsPerNode&gt;
			&lt;!-- Following properties used by adapter's key manager for choosing specific certificate from key store  
			&lt;sslCertificateAlias&gt;&lt;/sslCertificateAlias&gt; 
			&lt;sslCertificatePassword&gt;&lt;/sslCertificatePassword&gt;
			--&gt;		
		&lt;/connectionPolicy&gt;
	&lt;/connectivity&gt;

	&lt;procedure name=&quot;getAlbumCover&quot;/&gt;
	
&lt;/wl:adapter&gt;</code></pre>

In the code snippet above, ws.audioscrobbler.com is the last.fm API domain and <code>getAlbumCover</code> is the procedure name.

3. You then write your implementation code. Since the API is simple - pass in an album and artist - my code is simple.

<pre><code class="language-javascript">function getAlbumCover(artist,album) {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : "2.0/?method=album.getinfo&artist="+encodeURI(artist)+"&album="+encodeURI(album)+"&api_key=poo&format=json"
	};

	WL.Logger.info("getDetail, requesting artist "+artist+" and album "+album);
	WL.Logger.info(input.path);
	
	var result = WL.Server.invokeHttp(input);
	
	if(!result.album) {
		return {% raw %}{"error":result.message}{% endraw %};
	}
	WL.Logger.info("got this image "+result.album.image[3]["#text"]);
	return {% raw %}{"img":result.album.image[3]["#text"]}{% endraw %};
	
}</code></pre>

My function takes the arguments and generates a URL pointing to the API. Of special note - notice how we return <strong>only</strong> the image. Not only have we abstracted out the service from the client, allowing us to switch to a new provider if we need to, but we've also <i>dramatically</i> reduced the network packet sent to the client. How much so? Here is the full result of a 'regular' last.fm API call:

<pre><code class="language-javascript">{
  &quot;statusCode&quot;: 200,
  &quot;isSuccessful&quot;: true,
  &quot;album&quot;: {
    &quot;id&quot;: &quot;2634331&quot;,
    &quot;listeners&quot;: &quot;2453&quot;,
    &quot;mbid&quot;: &quot;&quot;,
    &quot;toptags&quot;: {
      &quot;tag&quot;: {
        &quot;name&quot;: &quot;ahmet&quot;,
        &quot;url&quot;: &quot;http://www.last.fm/tag/ahmet&quot;
      }
    },
    &quot;name&quot;: &quot;Wish&quot;,
    &quot;image&quot;: [
      {
        &quot;#text&quot;: &quot;http://images.amazon.com/images/P/B0000263H7.01._SCMZZZZZZZ_.jpg&quot;,
        &quot;size&quot;: &quot;small&quot;
      },
      {
        &quot;#text&quot;: &quot;http://images.amazon.com/images/P/B0000263H7.01._SCMZZZZZZZ_.jpg&quot;,
        &quot;size&quot;: &quot;medium&quot;
      },
      {
        &quot;#text&quot;: &quot;http://images.amazon.com/images/P/B0000263H7.01._SCMZZZZZZZ_.jpg&quot;,
        &quot;size&quot;: &quot;large&quot;
      },
      {
        &quot;#text&quot;: &quot;http://images.amazon.com/images/P/B0000263H7.01._SCMZZZZZZZ_.jpg&quot;,
        &quot;size&quot;: &quot;extralarge&quot;
      },
      {
        &quot;#text&quot;: &quot;http://images.amazon.com/images/P/B0000263H7.01._SCMZZZZZZZ_.jpg&quot;,
        &quot;size&quot;: &quot;mega&quot;
      }
    ],
    &quot;releasedate&quot;: &quot;    &quot;,
    &quot;playcount&quot;: &quot;28392&quot;,
    &quot;artist&quot;: &quot;Cure&quot;,
    &quot;tracks&quot;: &quot;\n            &quot;,
    &quot;url&quot;: &quot;http://www.last.fm/music/+noredirect/Cure/Wish&quot;
  },
  &quot;statusReason&quot;: &quot;OK&quot;,
  &quot;responseHeaders&quot;: {
    &quot;X-Web-Node&quot;: &quot;www173&quot;,
    &quot;Date&quot;: &quot;Wed, 06 May 2015 19:44:37 GMT&quot;,
    &quot;Access-Control-Allow-Origin&quot;: &quot;*&quot;,
    &quot;Vary&quot;: &quot;Accept-Encoding&quot;,
    &quot;Expires&quot;: &quot;Thu, 07 May 2015 19:44:37 GMT&quot;,
    &quot;Access-Control-Max-Age&quot;: &quot;86400&quot;,
    &quot;Access-Control-Allow-Methods&quot;: &quot;POST, GET, OPTIONS&quot;,
    &quot;Connection&quot;: &quot;close&quot;,
    &quot;Content-Type&quot;: &quot;application/json; charset=utf-8;&quot;,
    &quot;Server&quot;: &quot;Apache/2.2.22 (Unix)&quot;,
    &quot;Cache-Control&quot;: &quot;max-age=86400&quot;
  },
  &quot;responseTime&quot;: 590,
  &quot;totalTime&quot;: 591
}</code>></pre>

And here is what is returned now:

<pre><code class="language-javascript">{
  &quot;isSuccessful&quot;: true,
  &quot;image&quot;: &quot;http://images.amazon.com/images/P/B0000263H7.01._SCMZZZZZZZ_.jpg&quot;
}</code></pre>

That's a rather significant reduction.

4. The final piece is to update the client side code. I had to make two changes. First, instead of using $http, I used WLResourceRequest. You can see a good doc on this <a href="https://developer.ibm.com/mobilefirstplatform/documentation/getting-started-7-0/server-side-development/invoking-adapter-procedures-hybrid-client-applications/">here</a>, but this is how my new code looks:

<pre><code class="language-javascript">var request = new WLResourceRequest('/adapters/lastfm/getAlbumCover', WLResourceRequest.GET);
request.setQueryParameter('params',[artist,album]);
defs.push(request.send());</code></pre>

WLResourceRequest returns a promise, so it was pretty much a two second mod. setQueryParameter threw me for a loop though. If you try to use individual parameters, like so:

<pre><code class="language-javascript">request.setQueryParameter('artist', artist);
request.setQueryParameter('album', album);</code></pre>

Then it will <strong>not work</strong>. The doc I linked to above makes this clear, but it was easy to miss. The last thing I tweaked was the result handling code:

<pre><code class="language-javascript">if(result.responseJSON.img) {
    items[i].image = result.responseJSON.img;</code></pre>

As I said above, now my API use is both agnostic, and a bit more secure. I'm not saying it is 100% secure - in my sample app I'm not using login so anyone could sniff the network request and try to hack it, but it's a heck of a lot more locked down then it was before.

p.s. I had to make one more small tweak, and I plan on calling this out in it's own blog post. When using the file system and assets under www, MobileFirst takes your www assets from common and puts them in www/default. I kept getting "File Not Found" errors trying to parse my MP3s and that explained why. I'll discuss this more in a future blog post.