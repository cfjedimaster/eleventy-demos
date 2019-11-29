---
layout: post
title: "Bring the Misery Hammer down on your trolls"
date: "2011-04-26T22:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/04/26/Bring-the-Misery-Hammer-down-on-your-trolls
guid: 4210
---

Earlier today a buddy of mine tweeted about an interesting Drupal plugin he found - <a href="http://drupal.org/project/misery">Misery</a>. I'm not a Drupal user but anything named Misery sounds pretty cool. Turns out the plugin is an interesting way to to fight against trolls. Anyone who runs a site that allows for user content will know what kind of trouble a bad troll can cause. Worse than a spammer, they can slip by undetected from your conventional blocking methods and slowly poison a site. While I'm not sure you can accurately detect a troll automatically, if you did have a way of flagging a troll then a plugin like this could be kind of cool. And if it can be done in PHP, then certainly we can build it in ColdFusion.
<!--more-->
<p>

First, let's look at what the plugin does. Based on some troll marker, it will:

<p>

<ul>
<li>Delay page execution
<li>Return a blank white screen
<li>Return the wrong page
<li>Return a random node (a Drupal term - imagine it was a blog and you ended up on the wrong entry)
<li>Return a 403 or 404
<li>Stop a form from submitting
<li>Crash IE6
</ul>

<p>

For my implementation I decided to recreate all of the above except for the random node and the IE6 crash. As it stands, IE6 has a pretty good chance of crashing by itself anyway so why bother trying to force it. I began by creating a simple component that randomly picked a way to annoy the troll:

<p>

<code>
component {

	variables.randomUrls = "";
	
	public function init() {
		writelog(file="application", text="Misery init");
	}

	public function setRandomUrls(string s) {
		variables.randomUrls = arguments.s;
	}
	
	public function enactMisery() {
		var rnd = randRange(1,100);
		if(rnd &lt; 40) {
			writeLog(file="application",text="Misery: Delay");
			sleep(1000 * randRange(1,4));	
		} else if(rnd &lt; 50) {
			writeLog(file="application",text="Misery: White Screen of Death");
			abort;
		} else if(rnd &lt; 60) {
			writeLog(file="application",text="Misery: Wrong page");	
			if(len(variables.randomUrls)) {
				var newurl = listGetAt(variables.randomUrls, randRange(1, listLen(variables.randomUrls)));
				location(url=newurl,addtoken=false);	
			}	
		} else if(rnd &lt; 65) {
			writeLog(file="application",text="Misery: 403 Header");
			include "403header.cfm";
		} else if(rnd &lt; 70) {
			writeLog(file="application",text="Misery: 404 Header");
			include "404header.cfm";
		} else if(rnd &lt; 80) {
			writeLog(file="application",text="Misery: Kill random form field.");
			var keys = structKeyList(form);
			if(len(keys)) {
				var toKillNum = randRange(1, listLen(keys));
				for(var i=1; i&lt;=toKillNum; i++) {	
					var chosen = randRange(1, listLen(keys));
					var chosenKey = listGetAt(keys, chosen);
					writeLog(file="application",text="Misery: Removing form.#chosenkey#");
					structDelete(form, chosenKey);
					keys = listDeleteAt(keys, chosen);	
				}	
			}
		}

		writelog(file="application", text="Done with Misery");		
	}
	
}
</code>

<p>

Going from top to bottom, you can see I've got a blank init that simply logs to the Application log. I've got a setRandomURLs function that allows me to specify what random URLs should be used when that option is fired. The real core of the component is the enactMisery function. (And yes, I love the method name.) It simply selects a random act of cruelty to apply to the user. The pause is simple enough with sleep. The white page of death is even simpler. The random redirector picks a URL from the list your code provides. If you don't then this option will simply be skipped. My headers have to use an include since there is no built in way to do cfheader in script. You can do it easily enough with a few Java calls but I wrote this quickly and didn't want to bother. I'll include both of those templates below. The real evil method is the last one. If form data exists, this branch will remove random keys from the post. This is truly evil as it will not repeat exactly the same and possibly drive the troll insane. Before I show my demo code, here is the first header file, 403header.cfm:

<p>

<code>
&lt;cfheader statuscode="403" statustext="Forbidden Because"&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;403&lt;/title&gt;&lt;/head&gt;&lt;body&gt;
&lt;h1&gt;403 Forbidden Because&lt;/h1&gt;
of something...
&lt;/body&gt;&lt;/html&gt;
&lt;cfabort&gt;
</code>

<p>

And here is the 404 version:

<p>

<code>
&lt;cfheader statuscode="404" statustext="Missing Page"&gt;
&lt;html&gt;&lt;head&gt;&lt;title&gt;404&lt;/title&gt;&lt;/head&gt;&lt;body&gt;
&lt;h1&gt;404 Missing&lt;/h1&gt;
That important page you wanted is missing.
&lt;/body&gt;&lt;/html&gt;
&lt;cfabort&gt;
</code>

<p>

Ok, now let's look at my demo. First I'll begin with the page the user will actually run, index.cfm:

<p>

<code>
&lt;h2&gt;Welcome&lt;/h2&gt;

&lt;p&gt;
Nothing special is going on - promise.
&lt;/p&gt;

&lt;form action="index.cfm" method="post"&gt;
your name: &lt;input type="text" name="name"&gt;&lt;br/&gt;
your age: &lt;input type="text" name="age"&gt;&lt;br/&gt;
your foo: &lt;input type="text" name="foo"&gt;&lt;br/&gt;
your goo: &lt;input type="text" name="goo"&gt;&lt;br/&gt;
&lt;input type="submit" name="submit" value="Send Important Comments"&gt;
&lt;/form&gt;

&lt;cfif structKeyExists(form, "submit")&gt;
	&lt;cfdump var="#form#" label="Form"&gt;
&lt;/cfif&gt;
</code>

<p>

The index page is just some text and a form. If a form post is detected (by checking the submit button), I dump the results. Now let's look at my Application.cfc:

<p>

<code>
component {
	this.name="misery";
	this.sessionManagement="true";
	
	public boolean function onApplicationStart() {
		application.miseryService = new misery();
		application.miseryService.setRandomUrls("http://www.cnn.com,http://www.yahoo.com");
		return true;
	}
	
	public boolean function onRequestStart(string req) {
		if(structKeyExists(url,"troll")) {
			session.miseryFlag = true;
		}
		
		if(session.miseryFlag) application.miseryService.enactMisery();
		
		return true;
	}
	
	public boolean function onSessionStart() {
		session.miseryFlag = false;	
		return true;
	}
}
</code>

<p>

This is fairly straightforward. My onApplicationStart creates an instance of misery (and yes, I like that code too) and passes in random URLs. For my onRequestStart I use a simple URL hack to enable the troll hack. For those of you testing, just add ?troll=ios to turn yourself into a troll. If the flag is active, then the Misery component's enactMisery method is fired. And that's it. Demo this below - and remember to add ?troll=gruber to turn on cruel mode.

<p>


<a href="http://www.raymondcamden.com/demos/april262011/index.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>


<img src="https://static.raymondcamden.com/images/cfjedi/TROLLING_RE_The_Meme_Team-s600x750-97874.jpg" />