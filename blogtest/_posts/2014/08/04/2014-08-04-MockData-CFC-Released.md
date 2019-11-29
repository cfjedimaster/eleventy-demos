---
layout: post
title: "MockData CFC Released"
date: "2014-08-04T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/08/04/MockData-CFC-Released
guid: 5281
---

<p>
A while ago I wrote a Node.js service called <a href="https://github.com/cfjedimaster/mockdata">MockData</a>. The idea behind it was to create a quick way to generate mock data for client-side applications that were purely driven by URL parameters. So for example, I could get 10 random people by doing an XHR request to http://myserver:myport?num=10&author=name. The service I built supported a few different types of mock data (names, emails, addresses, telephone numbers, etc), and was, I think, pretty flexible. I thought it would be interesting to rewrite the core logic in ColdFusion, specifically ColdFusion 11, to see how much of the JS code had to be re-engineered.
</p>
<!--more-->
<p>
To be fair, this wasn't meant to be a complete rewrite. My Node.js version is its own little server. It runs on a port and could easily be used with anything - ColdFusion, PHP, another Node.js app, or even a static web site. The ColdFusion version doesn't have to worry about firing up a server or taking over a port. It simply has to look at the query string and generate the proper data.
</p>

<p>
So how did it go? All in all it was mostly painless. The biggest annoyance I ran into was... and yes... you can taunt me with these words later... was ColdFusion starting arrays at 0. I will go to my grave convinced that 0-based indexes came about because the original designer was drunk and needed to cover his ass later (cue the outraged comments in 3...2...1...) but at the end of day... I'm just more used to 0 now and I wish ColdFusion had a toggle to use it too.
</p>

<p>
There. I said it.
</p>

<p>
<img src="https://static.raymondcamden.com/images/puke.jpg" />
</p>

<p>
The other big thing I ran into was also array based. I kept typing someArr.length when I needed to do someArr.len(). I'm happy ColdFusion 11 allows me to run methods on variables, but I do wish they had added a simple length property too.
</p>

<p>
Speaking of methods, I did find myself forgetting to make use of them. For example, I had structKeyExists(foo, "goo") where foo.keyExists("goo") works now. If you look over the code you'll probably find other places where I forgot this as well. (In fact, I just checked and found another one I missed: arr.each). The code isn't terribly long so I'll share the entire thing below, but you can download, and fork it, here: <a href="https://github.com/cfjedimaster/MockDataCFC">https://github.com/cfjedimaster/MockDataCFC</a>

<pre><code class="language-javascript">component {

	cfheader(name=&quot;Access-Control-Allow-Origin&quot;, value=&quot;*&quot;);
	
	&#x2F;&#x2F;So you can skip passing it...
	url.method=&quot;mock&quot;;

	&#x2F;&#x2F;Defaults used for data, may move to a file later
	fNames = [&quot;Andy&quot;,&quot;Alice&quot;,&quot;Amy&quot;,&quot;Barry&quot;,&quot;Bob&quot;,&quot;Charlie&quot;,&quot;Clarence&quot;,&quot;Clara&quot;,&quot;Danny&quot;,&quot;Delores&quot;,&quot;Erin&quot;,&quot;Frank&quot;,&quot;Gary&quot;,&quot;Gene&quot;,&quot;George&quot;,&quot;Heather&quot;,&quot;Jacob&quot;,&quot;Leah&quot;,&quot;Lisa&quot;,&quot;Lynn&quot;,&quot;Nick&quot;,&quot;Noah&quot;,&quot;Ray&quot;,&quot;Roger&quot;,&quot;Scott&quot;,&quot;Todd&quot;];
	lNames = [&quot;Anderson&quot;,&quot;Bearenstein&quot;,&quot;Boudreaux&quot;,&quot;Camden&quot;,&quot;Clapton&quot;,&quot;Degeneres&quot;,&quot;Hill&quot;,&quot;Moneymaker&quot;,&quot;Padgett&quot;,&quot;Rogers&quot;,&quot;Smith&quot;,&quot;Sharp&quot;,&quot;Stroz&quot;,&quot;Zelda&quot;];
	emailDomains = [&quot;gmail.com&quot;,&quot;aol.com&quot;,&quot;microsoft.com&quot;,&quot;apple.com&quot;,&quot;adobe.com&quot;];
	lorem = &quot;Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.&quot;;

	defaults = [&quot;name&quot;,&quot;fname&quot;,&quot;lname&quot;,&quot;age&quot;,&quot;all_age&quot;,&quot;email&quot;,&quot;ssn&quot;,&quot;tel&quot;,&quot;gps&quot;,&quot;num&quot;];
	function isDefault(s) {
		return defaults.findNoCase(s) &gt;= 0; 
	}

	function generateFirstName() {
		return fNames[randRange(1, fNames.len())];
	}

	function generateLastName() {
		return lNames[randRange(1, lNames.len())];
	}

	function generateFakeData(type) {
		if(type == &quot;string&quot;) return &quot;string&quot;;
		if(type == &quot;name&quot;) return generateFirstName() &amp; &quot; &quot; &amp; generateLastName();
		if(type == &quot;fname&quot;) return generateFirstName();
		if(type == &quot;lname&quot;) return generateLastName();
		if(type == &quot;age&quot;) return randRange(18,75);
		if(type == &quot;all_age&quot;) return randRange(1,100);
		if(type == &quot;email&quot;) {
			var fname = generateFirstName().toLowerCase();
			var lname = generateLastName().toLowerCase();
			var emailPrefix = fname.charAt(1) &amp; lname;
			return emailPrefix &amp; &quot;@&quot; &amp; emailDomains[randRange(1, emailDomains.len())];
		}
		if(type == &quot;ssn&quot;) {
			return randRange(1,9) &amp; randRange(1,9) &amp; randRange(1,9) &amp; &quot;-&quot; &amp;
				    randRange(1,9) &amp; randRange(1,9) &amp; &quot;-&quot; &amp; 
				    randRange(1,9) &amp; randRange(1,9) &amp; randRange(1,9) &amp; randRange(1,9);
		}
		if(type == &quot;tel&quot;) {
			return &quot;(&quot; &amp; randRange(1,9) &amp; randRange(1,9) &amp; randRange(1,9) &amp; &quot;) &quot; &amp;
				    randRange(1,9) &amp; randRange(1,9) &amp; randRange(1,9) &amp; &quot;-&quot; &amp; 
				    randRange(1,9) &amp; randRange(1,9) &amp; randRange(1,9) &amp; randRange(1,9);
	
		}
		if(type.find(&quot;num&quot;) == 1) {
			&#x2F;&#x2F;Support num, num:10, num:1:10
			if(type == &quot;num&quot;) return randRange(1,10);
			if(type.find(&quot;:&quot;) &gt; 1) {
				var parts = type.listToArray(&quot;:&quot;);
				if(parts.len() == 2) return randRange(1,parts[2]);
				else return randRange(parts[2],parts[3]);
			}
		}
		if(type.find(&quot;oneof&quot;) == 1) {
			&#x2F;&#x2F;Support oneof:male:female, ie, pick a random one
			var items = type.listToArray(&quot;:&quot;);
			items.deleteAt(1);
			return items[randRange(1,items.len())];
		}
		if(type.find(&quot;lorem&quot;) == 1) {
			if(type == &quot;lorem&quot;) return lorem;
			if(type.find(&quot;:&quot;) &gt; 1) {
				var parts = type.listToArray(&quot;:&quot;);
				var result = &quot;&quot;;
				var count = &quot;&quot;;
				if(parts.len() == 2) count = parts[2];
				else count = randRange(parts[2],parts[3]);
				for(var i=0; i&lt;count; i++) result &amp;= lorem &amp; &quot;\n\n&quot;;
				return result;
			}
		}
		return &quot;&quot;;
	}

	function generateNewItem(model) {
		var result = {};

		model.each(function(field) {
			if(!field.keyExists(&quot;name&quot;)) {
				field.name = &quot;field&quot;&amp;i;
			}
	
			if(!field.keyExists(&quot;type&quot;)) {
				&#x2F;&#x2F;if we are a default, that is our type, otherwise string
				if(isDefault(field.name)) field.type = field.name;
			}
			result[field.name] = generateFakeData(field.type);
			
		});
		
		return result;
	}
	
	remote function mock() returnformat=&quot;json&quot; {
		
		&#x2F;&#x2F;Did they specify how many they want?
		if(!arguments.keyExists(&quot;num&quot;)) arguments.num = 10;

		if(!isNumeric(arguments.num) &amp;&amp; arguments.num.find(&quot;:&quot;) &gt; 0) {
			var parts = arguments.num.listToArray(&quot;:&quot;);
			if(parts[1] != &quot;rnd&quot;) {
				throw(&quot;Invalid num prefix sent. Must be &#x27;rnd&#x27;&quot;);
			}
			&#x2F;&#x2F; format is rnd:10 which means, from 1 to 10
			if(parts.len() == 2) {
				arguments.num = randRange(1,parts[2]);
			} else {
				arguments.num = randRange(parts[2],parts[3]);
			}
		}

		var fieldModel = [];
		for(var key in arguments) {
			if(key != &quot;num&quot;) {
				fieldModel.append({% raw %}{name:key,type:arguments[key]}{% endraw %});
			}
		}
	
		var result = [];
		for(var i=1; i&lt;=arguments.num; i++) {
			result.append(generateNewItem(fieldModel));
		}
			
		cfheader(name=&quot;Content-Type&quot;, value=&quot;application&#x2F;json&quot;);

		return result;
	}

}</code></pre>