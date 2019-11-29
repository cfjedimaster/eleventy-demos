---
layout: post
title: "First draft of a ColdFusion Spider"
date: "2010-11-04T18:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/04/First-draft-of-a-ColdFusion-Spider
guid: 4001
---

From time to time folks ask about spidering a web site in order to search it with Solr. The most common recommendation is to use a tool like <a href="http://nutch.apache.org/">Nutch</a>. This is another Apache open source project (like Solr) and is something I plan on playing with soon. However, I thought it would be kind of interesting to try to build a web site spider in ColdFusion. I had a few ideas of how the <i>final</i> product would look, but I decided to start simple. What follows is my initial implementation. This is a <b>bad</b> implementation. It's got more issues than a meeting of Lindsey Lohan and Mel Gibson. That being said I figured I'd share this version and then begin work on the next revision. So - got your sunglasses on? The suckness of what follows will be epic.
<!--more-->
<p>

My initial implementation is a CFC called spider. Let's first look at the header and the init function.

<p>

<code>
component {

	variables.urlcache = {};
	variables.queue = [];
	//used to keep spidering to a max
	variables.sanity = 1;
	variables.maxhits = 100;
	
	public spider function init(string url, string alturl="",numeric max=100) {
		variables.url = arguments.url;
		variables.alturl = arguments.alturl;
		var first = replaceList(variables.url, variables.url & "," & variables.alturl, "");
		arrayAppend(variables.queue, first);
		variables.maxhits = arguments.max;
		return this;
	}
</code>

<p>

I've got a few variables in place that will be used to store important data while I spider the site. The urlcache is the monster. It's going to store a set of keys (urls) and data (the HTML of the page). My queue is simply an array of URLs. As I scan one page ,and find N links, I add them to my queue to process <b>if and only if</b> I haven't spidered them before. Finally I've got a sanity/maxhit counter. I'm going to allow you to set a max limit of how many URLs to spider. The sanity variable simply keeps track of how many items have been recorded. (And that should probably be 0.) 

<p>

My init allows you to pass both a url and an alturl. The url would probably be: http://www.something.com and the alt url would be http://something.com. I could probably automate that but for now it works well enough. Now let's look at the crawl() method, the main worker for the component.

<p>

<code>
	public function crawl() {

		while(arrayLen(variables.queue) && variables.sanity &lt; variables.maxhits) {
			//pop the next one
			var current = variables.queue[1];
			arrayDeleteAt(variables.queue, 1);

			var h = new com.adobe.coldfusion.http();
			h.setURL(variables.url & current);
			h.setMethod("get");
			h.setResolveURL(true);
			var result = h.send().getPrefix();
			var content = result.filecontent;
			//writeoutput("tried to load " & variables.url & current & " #len(content)# #result.statuscode#&lt;br/&gt;");
			//add to urlcache
			if(current == "") current = "/";
			variables.urlcache[current] = content;

			var links = reMatchNoCase("&lt;a.*?&gt;.*?&lt;/a&gt;",content);

			//for each link, we only add to queue if within our core url or alt
			for(var i=1; i&lt;arrayLen(links); i++) {
				var realLink = reReplaceNoCase(links[i],".*href=""(.*?)"".*", "\1");
				realLink = trim(realLink);
				//writeOutput(htmlEditFormat(links[i]) & " ==== " & htmlEditFormat(realLink) & "&lt;br&gt;");
				if(len(realLink) && (findNoCase(variables.url, realLink) || findNoCase(variables.alturl, realLink))) {
					//ok, add if we don't have it in the cache, but first turn into a path
					var path = replaceList(realLink, variables.url & "," & variables.alturl, "");
					if(path!= "/##" && !structKeyExists(variables.urlcache, path)) {
						arrayAppend(queue, path);
					}
						
				}
			}			
			sanity++;
		}		
		
		return variables.urlcache;
	}
</code>

<p>

The method basically loops until the queue is empty and we've not hit our "maxhits" value. I get the current url from the queue and do a http get to suck down the data. I then store the path and data in my structure. (Note that the code currently assumes all the data is text based. Obviously that isn't the case and in my test I immediately ran into a PDF. I'll worry about that later though. The fun part is the simple regex for links. I grab them all - parse them out - and ensure each one is "in" site, and not external. 

<p>

That's it - I've included a zip of the CFC and test below if you want to see the entire CFC. So there's a lot wrong here. First off - why in the heck am I using variable scoped variables in the crawl method? Hopefully you guys saw red flags there. If this CFC were stored in a shared scope (as most CFCs are), then this would cause issues if two requests ran crawl at the same time. The next issue is that this code would - probably - time out on any decent sized site. My blog has around 4k blog entries so there is no way in heck this is going to wrap up before CF chokes off the request. My thinking was two fold. One - I need to use threading. For that to work I'd need some central data store the threads could write to. Hence the use of the Variables scope. Secondly - I'd probably need a way to really store the data - to disk perhaps. So that multiple runs could be done over a few hours perhaps. In this scenario, disk space could be used to store the text and a basic index while the code worked. When everything was completely done, we could then use cfsearch to index the files as plain HTML. Anyway, here is an example of me running it against my blog - with the ginormous HTML hidden.

<p>



<img src="https://static.raymondcamden.com/images/screen38.png" /><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ftest2%{% endraw %}2Ezip'>Download attached file.</a></p>