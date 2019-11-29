---
layout: post
title: "Delaying an Edge Animate asset until visible - Part 5"
date: "2014-06-09T08:06:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/06/09/Delaying-an-Edge-Animate-asset-until-visible-Part-5
guid: 5240
---

<p>
So, in my <a href="http://www.raymondcamden.com/index.cfm/2013/12/6/Delaying-an-Edge-Animate-asset-until-visible--Part-4">last post</a> on this topic, I mentioned that I was surprised at how many times this "simple" topic kept coming up on my blog. In a way, this has turned into the series that just won't die - no matter how many times I think I've covered every little detail.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Friday_the_13th_part_4.jpg" />
</p>
<!--more-->
<p>
But much like how some movie franchises seem to find a way to just keep chugging along, so is this particular series of tips on Edge Animate. Today's post is more of an addendum though so be sure you've read the earlier articles. (I've linked them all at the bottom.)
</p>

<p>
This weekend I worked with a client who asked me to simply add my "Don't start until visible" code to the page. I thought it was going to be easy but I ran into two issues. The first one was that he was using the minified code in production and needed a way to disable autoplay. He still had the EA project files, but unfortunately they appeared to be a different version. Why do I say that? I opened his project, disabled autoplay, saved, and then did a diff on the generated files. I saw multiple changes, not just one. Maybe I did something wrong, or maybe I was worrying about something I didn't need to, but I began looking at the minified JS file to see if I could correct it there. 
</p>

<p>
I was able to find the code I needed to change, but I urge people to consider carefully before they follow this advice. I'm not confident that <i>how</i> the Edge code is minified in the future won't change. This worked for me this weekend, but I'd suggest against modifying the code this way unless you really have to. With the warning in mind, if you find the foo_edge.js file (where foo is the name of your project), look for "Default Time" in the code. You should see something like this:
</p>

<pre><code class="language-javascript">tl:{% raw %}{"Default Timeline":{fS:a,tS:"",d:3000,a:y,tt:[]}{% endraw %}}</code></pre>

<p>
In the block above, the a key represents autoplay. Setting it to n will disable it. 
</p>

<pre><code class="language-javascript">tl:{% raw %}{"Default Timeline":{fS:a,tS:"",d:3000,a:n,tt:[]}{% endraw %}}</code></pre>

<p>
Ok, so that ended up being the easy issue. What I found next was that my code <i>always</i> thought it was visible, even when it wasn't. Turns out, the client was using an object tag to embed the EA asset. I've seen other people do this as well. It is a way to embed an EA asset into an already designed page. Here's the issue though. My code looks at the value of window to see how far scrolled the user is and how it compares to the position of the asset.
</p>

<p>
In a case where the asset is in an object tag, the window object represents the object tag, not the "real" window. In that case, the asset is positioned on top, which means my code thinks it is immediately visible. The modification to fix this isn't too hard though. Here is the entire block that goes inside the creationComplete handler. (And again, I'm assuming you've read the earlier posts. If you have not, please do so first.)
</p>

<pre><code class="language-javascript">Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {

	// insert code to be run when the symbol is created here
	var wasHidden = true;

	//http://stackoverflow.com/a/488073/52160
	function isScrolledIntoView(elem) {
		var docViewTop = $(window.parent).scrollTop();
		var docViewBottom = docViewTop + $(window.parent).height();

		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + $(elem).height();

		return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
		  && (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) );
	}		  

	var element = sym.element;
	element = $("#EdgeID", window.parent.document);

	if(isScrolledIntoView(element)) {
		console.log('on load vis');
		wasHidden=false;
		sym.play();
	}

	function doStart() {
		if(isScrolledIntoView(element)) {
			if(wasHidden) {
				console.log('Start me up ID5');	
				sym.play();
			}
			wasHidden = false;
		} else {
			sym.stop();
			wasHidden = true;
		}

	}

	$(window.parent).on("scroll", doStart);

});
</code></pre>

<p>
The first change is to redefine element, the asset. Instead of referring to the asset itself, I'm using the ID value of the object tag in the parent document. This is important as I'm changing the entire context of how I check for visibility. Switching from "asset in window" to "thing holding my asset to the top window." 
</p>

<p>
The next change is to the isScrolledIntoView method. I changed the two references of window to window.parent. And that's it. Now - to be clear - this assumes a "two level" DOM. It is possible that someone could do an object tag pointing to an HTML page that used yet another object tag. But that would be overkill and I'm sure no one will. (And because I said that - someone will.)
</p>

<p>
Anyway, I believe I ran into people who were using object tags before and I'm also thinking that my code failed for them. Hopefully this version will work better.
</p>