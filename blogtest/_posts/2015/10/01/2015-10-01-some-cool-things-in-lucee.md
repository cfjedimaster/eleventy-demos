---
layout: post
title: "Some cool things in Lucee"
date: "2015-10-01T16:39:39+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2015/10/01/some-cool-things-in-lucee
guid: 6854
---

I really haven't spoken much about <a href="http://lucee.org/">Lucee</a> since the initial announcement a few months back. It seems like a lot of "things" are going on, and frankly, I figured I'd just see where things settle down later this year. It just so happened that I ended up on the <a href="http://docs.lucee.org/reference/tags/application.html">cfapplication doc</a> for Lucee and I was pretty surprised by what I saw. Here are some of the cool things Lucee is doing with Applications versus ColdFusion. This probably isn't everything, but here is what I found and what I thought was cool or interesting.

<!--more-->

By the way, just in case it isn't obvious - this list comes from the documentation for the cfapplication tag and is presented as arguments for the tag. Each of these works as "this" scope values in App.cfc too. That is implied, but it may not be obvious from the docs themselves.

<h2>action</h2>

So this falls into the "interesting but not sure I'd use it" bucket. Lucee provides an <code>action</code> attribute for applications that allow you to update settings for an existing application. Personally, changing application settings on the fly feels like a bad idea, but it <i>feels</i> like something that should exist and it is cool that it is supported. I'm sure folks will tell me plenty of reasons why this makes sense in the wild, and frankly, I don't really care, it jut makes me happy that it is supported. (Ok, I do care, and would love to hear some practical uses for this.)

<h2>sessionStorage</h2>

This one is cool as heck. You can use a database for session storage versus just plain RAM. You can setup the DSN in the admin enable this feature by checking the "Storage" checkbox:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/Lucee_Server_Administrator.png" alt="Lucee_Server_Administrator" width="750" height="44" class="aligncenter size-full wp-image-6855" />

While I was writing this, I was curious how this would be done in App.cfc code instead. I just now discovered that the Lucee admin will actually tell you how to define your DSN in code. THAT IS EPIC.

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot21.png" alt="shot2" width="1382" height="398" class="aligncenter size-full wp-image-6856" />

One cool thing this allows for is ad hoc queries against the database for things like checking the number of active sessions or gathering up session data in general. That's doable now with the Server Monitoring API in ColdFusion, but that's Enterprise only and requires admin-level access. This would require a database query.

<h2>bufferOutput</h2>

I had to ask for help on this one - thanks go to Harry Klein and Gert Franz on the Lucee google group. I'm going to quote Gert here: 

<blockquote>
If there is an error or abort inside the function or the silent tag and the setting bufferoutput is set to true any generated output will bee visible. If set to false it will not generate any output at all.
</blockquote>

Interesting. Apparently this helps in memory consumption. I don't see how - but I trust Gert and Harry.

<h2>requestTimeout</h2>

You know how you can set a request timeout value in the cfsetting tag? From what I see, this is the same thing, but for the application. Nice.

<h2>componentPaths</h2>

It looks as if Lucee supports mappings for cfinclude, custom tag paths for custom tags, and component paths for CFCs. This seems like a nice separation of concerns. I dig it.

<h2>typeChecking</h2>

Nice - you know how you can disable type checking in the ColdFusion Administrator? It can be a good performance boost. I've seen it significantly help out Model-Glue applications. Well this is the same thing - but at the Application level.

<h2>compression</h2>

This allows you to enable GZip compression for the application. I kinda feel like this should be done on the web server and not the app server, but meh, it works well and is incredibly easy to enable. Here is a page with the setting turned off:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot31.png" alt="shot3" width="750" height="359" class="aligncenter size-full wp-image-6857" />

I then added <code>this.compression=true;</code> to my App.cfc:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot4a1.png" alt="shot4a" width="750" height="377" class="aligncenter size-full wp-image-6861" />

That's a pretty big change there.

<h2>suppressRemoteComponentContent</h2>

So yeah, this is a weird one. Imagine bad code like this:

<pre><code class="language-javascript">remote function sayhello() {
	writeoutput("MOO");
	return "hello #now()#";
}</code></pre>

As you can see, I'm both outputting stuff and returning a value. If you set the suppress setting to false, you will actually see "MOO" in the remote output. I see no reason why you would ever desire that.

<h2>localmode</h2>

This one was pretty confusing. @nicholasc on Slack helped me understand it. Given this line in a method <code>x=1;</code>, by default this will write to the variables scope unless local.x was already set. If you use <code>this.localmode="modern"</code> in your App.cfc, it will set to the local scope instead. This seems like a great idea. 

<h2>tag</h2>

My favorite change. You can specify default attribute/value pairs for tags across your application. Here is an example I took from the docs:

<pre><code class="language-javascript">this.tag = {
	"location":{
		"addtoken":true
	}
};</code></pre>

I freaking love this. I kinda remember arguing against this in ColdFusion about 5 or so versions ago. At the time I was concerned about some setting somewhere modifying code and developers getting confused, but having it in app.cfc makes it easy to reference and notice. 

<h2>locale/timezone/webcharset/resourcecharset</h2>

These all apply different language/locale type settings to your application. 

<h2>scopeCascading</h2>

Ok, I lied - this is my favorite feature. If you output a variable without scope, this defines the "look" up process. You have three values. "standard" is your standard lookup table and will hit variables, CFI, URL, Form, and Cookie. "small" will hit just variables, URL, and Form. My favorite though is "strict". If you specify this, it will only look at the Variables scope. My own personal rules are to always scope for everything but Variables so I definitely approve of this change.

<h2>And more...</h2>

There's some cool cache settings you can tweak and CFC property stuff, but they weren't interesting enough for me to actually write up.

But...

Yeah... this is what I like. This is exactly the type of developer-centric language changes I'd like to see in ColdFusion 12. 

At this point, someone may chime in and suggest I file ERs in the Adobe bug tracker. I certainly could - but I assume the Adobe ColdFusion team naturally tracks what Lucee is doing. It just makes sense. Surely they watch Lucee, look at developers who get excited about it, and take note of that. To assume otherwise would be to assume a ColdFusion team that is so disconnected from the developer community that it thinks it doesn't matter what other CFML engines do. And surely that can't be the case.