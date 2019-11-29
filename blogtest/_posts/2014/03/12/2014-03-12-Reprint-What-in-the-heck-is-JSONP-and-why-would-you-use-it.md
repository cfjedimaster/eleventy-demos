---
layout: post
title: "Reprint: What in the heck is JSONP and why would you use it?"
date: "2014-03-12T11:03:00+06:00"
categories: [javascript,jquery]
tags: []
banner_image: 
permalink: /2014/03/12/Reprint-What-in-the-heck-is-JSONP-and-why-would-you-use-it
guid: 5173
---

<div class="alert alert-success">
Earlier this week I <a href="http://www.raymondcamden.com/index.cfm/2014/3/10/Remember-DevelopRIA">blogged</a> about the demise of DevelopRIA. Last night someone pinged me about one of my articles there so I thought it would be a good idea to republish it. The article is somewhat old (4 years or so) and doesn't mention CORS at all, but hopefully it is still useful to folks. But please keep the age in mind when reading. (My god - I actually preferred XML. What was I thinking?!?!)
</div>

<p>
Have you ever looked at some technology, or framework, and simply didn't understand why someone would use it? For some time now I've never quite gotten what JSONP is, nor why someone would use it over XML. Everything finally cleared up for me last week and since I assume (I hope!) I'm not alone in being confused, I thought I'd share what I learned.
</p>
<!--more-->
<p>
JSONP (JSON with Padding) was created as a workaround to the cross domain problem. The cross domain problem refers to the fact that Ajax code run from website A can't access data from website B. So as a simple example, imagine trying to load Yahoo Search results from your site:
</p>

<pre><code class="language-markup">&lt;html&gt;

&lt;head&gt;
&lt;script src=&quot;/jquery/jquery.js&quot;&gt;&lt;/script&gt;
&lt;script&gt;
$(function() {
    var req = 'http://search.yahooapis.com/WebSearchService/V1/webSearch?appid=YahooDemo&amp;query=finances&amp;format=pdf&amp;output=json'
    $.getJSON(req,{}, function(data) {
        console.dir(data)
    });
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>
This simple example will fail immediately with this error: Access to restricted URI denied. None of this should be new to us (although I do get asked about this every few weeks). The normal way around this is to build a proxy on your own server. So the Ajax code would hit some URL on your own domain. Server side code (like ColdFusion) handles making the remote call and then returns the results to the front end Ajax code. This works well, although it does end taking a bit longer due to the extra stops along the way. I intentionally chose Yahoo's search api for my example above since Yahoo was the first provider I noticed supporting JSON/P. At the time I had assumed it simply helped support their JSON format results. I didn't quite get what else it would provide. I figured Yahoo was simply providing JSON as an alternative to XML for data size reasons (JSON can be a lot slimmer) and that people were using it along with the "proxy" setup I just described.
</p>

<p>
Last week I came across this excellent article at IBM: <a href="http://www.ibm.com/developerworks/library/wa-aj-jsonp1/?ca=dgr-jw64JSONP-jQuery&S_TACT=105AGY46&S_CMP=grsitejw64">Cross-domain communications with JSONP, Part 1: Combine JSONP and jQuery to quickly build powerful mashups</a>. Finally, everything clicked. Turns out, there is a back door to the whole cross domain issue. If you dynamically create a new script block, you are allowed to point this new script block at any domain you want. So for example, I could dynamically create a script block that acts as if I had done:
</p>

<pre><code class="language-markup">&lt;script src="http://search.yahooapis.com/someJSLibrary.js"&gt;&lt;/script&gt;</code></pre>

<p>
So with that being possible (and with the way browsers are updated this little backdoor probably won't ever be shut) you can now dynamically request dat from another server. But how do you actually work with the data? Normally script tags like the one above load a library of code into your browser. They aren't just used to load data by itself. Another problem is handling the data. If my intent was to request Yahoo search data and present it within my own UI, I'd need to be able to make the request as well as handle the result manually. This is where the whole 'with Padding' thing comes to play. An API that supports JSONP will return not only the pure JSON data you want, but will also wrap it in a function call. So in English, I can tell Yahoo: "Please return search results for 'finances'. I want the data in JSON format and I want you to wrap it in a call to a function called handleIt that I've defined below."
</p>

<p>
To see an example of this, open the following URL in your browser:
</p>

<p>
<a href="http://search.yahooapis.com/WebSearchService/V1/webSearch?appid=YahooDemo&query=finances&format=pdf&output=json
">http://search.yahooapis.com/WebSearchService/V1/webSearch?appid=YahooDemo&query=finances&format=pdf&output=json</a>
</p>

<p>
Notice the result is simple JSON. Now modify the URL a bit to request a callback:
</p>

<p>
<a href="http://search.yahooapis.com/WebSearchService/V1/webSearch?appid=YahooDemo&query=finances&format=pdf&output=json&callback=loadit
">http://search.yahooapis.com/WebSearchService/V1/webSearch?appid=YahooDemo&query=finances&format=pdf&output=json&callback=loadit</a>
</p>

<p>
Now the JSON code is wrapped in a function call to something called loadit. If I had a function named loadit on my page, it would have been run and the search result data passed to it. To bring this together into a real working example, I'll demonstrate using jQuery. jQuery provides builtin support for JSONP. You don't have to worry about writing any of the code to inject a new SCRIPT tag into the DOM. All you end up doing is modifying the URL to tip off jQuery that a JSONP call is being made. From the <a href="http://docs.jquery.com/Ajax/jQuery.getJSON#urldatacallback">docs</a> for getJSON, we see that by ending your URL with a ?, jQuery will treat the request like a JSONP call. You don't have to specify a function name yourself. jQuery will take care of that. Here is a full example:
</p>

<pre><code class="language-markup">&lt;html&gt;

&lt;head&gt;
&lt;script src=&quot;/jquery/jquery.js&quot;&gt;&lt;/script&gt;
&lt;script&gt;
var baseurl = 'http://search.yahooapis.com/ImageSearchService/V1/imageSearch?appid=YahooDemo&amp;output=json&amp;query='

function search() {
    var search = $(&quot;#search&quot;).val()
    console.log(search)
    var surl = baseurl + escape(search) + '&amp;callback=?'
    $.getJSON(surl, function(data) {
        var res = '&lt;h1&gt;Search for '+search+'&lt;/h1&gt;'
        res += '&lt;p&gt;There were '+data.ResultSet.totalResultsAvailable+' results.&lt;/p&gt;'
        for(var i=0; i&lt;data.ResultSet.Result.length; i++) {
            var result = data.ResultSet.Result[i]
            var resultStr = '&lt;img src=&quot;'+result['Thumbnail']['Url']+'&quot; align=&quot;left&quot;&gt;';
            resultStr += '&lt;a href=&quot;'+result['ClickUrl']+'&quot;&gt;'+result['Title']+'&lt;/a&gt;&lt;br clear=&quot;left&quot;/&gt;'
            res+=resultStr
        }
        $(&quot;#result&quot;).html(res)
    })
}

$(document).ready(function() {
    $(&quot;#searchBtn&quot;).click(search)
});

&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;
    &lt;input type=&quot;text&quot; name=&quot;search&quot; id=&quot;search&quot;&gt; &lt;input type=&quot;button&quot; value=&quot;Search&quot; id=&quot;searchBtn&quot;&gt;
    &lt;div id=&quot;result&quot;&gt;&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<p>
I built a simple form and tied it my search function. I had created a base URL for Yahoo so that all I need to do is append the current search term from the from. After that I added callback=?. Again - this tips off jQuery that it needs to treat the request like JSONP. I can then supply an inline function to handle the results. I won't go into detail about the code there as it is mostly HTML handling, but I think you get the idea.
</p>

<p>
Interesting technique - but would I use it? First, you can only use it with APIs that support JSONP (anyone have a good list of them?). Secondly, even if an API does support JSONP, you may still prefer the proxy support for a few reasons. First, it may be easier to massage the results on the server side. You may want to filter, for example, the search results to items that match with certain products in your database. That could be done with further Ajax calls, but it may be simpler to just do one call to your server and let it do all the handiwork. Using a proxy also makes it a bit easier to handle errors. Again, you could do that client side, but you may want to revert to server side cached results in the case where Yahoo fails to respond.
</p>

<p>
I'd love to hear from people using this in production!
</p>