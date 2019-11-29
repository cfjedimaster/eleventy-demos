---
layout: post
title: "Important information about Cordova 5"
date: "2015-05-25T08:51:57+06:00"
categories: [development,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/05/25/important-information-about-cordova-5
guid: 6202
---

In the most recent update to <a href="http://cordova.apache.org">Apache Cordova</a>, there was a rather important change that could really confuse you if you aren't paying attention. This is <i>exactly</i> the type of thing that I would have warned my readers about, but I mistakenly thought it would not impact most users. I'll explain later why I screwed that up, but I want to give huge thanks to Nic Raboy and his post, <a href="https://blog.nraboy.com/2015/05/whitelist-external-resources-for-use-in-ionic-framework/">Whitelist External Resources For Use In Ionic Framework</a>. Nic is a great blogger that I recommend following, and it is his post that led me to dig more into the changes in Cordova 5 and do my own research.

<!--more-->

I won't repeat Nic's post here, but the summary is that how you whitelist in Cordova has changed from earlier versions. Previously whitelisting was done via an &lt;access&gt; tag in config.xml. The <strong>default</strong> application created by the CLI would use a * to make everything available. To repeat, by <strong>default</strong> you could use any resource in your Cordova app.

In Cordova 5, this was changed. Specifically, this was changed for Android and iOS. You can begin by looking at the <a href="http://cordova.apache.org/docs/en/5.0.0/guide_appdev_whitelist_index.md.html#Whitelist%20Guide">whitelist</a> guide from the Cordova docs, but this will lead you to the docs for the new <a href="https://github.com/apache/cordova-plugin-whitelist">whitelist</a> plugin.

So let's talk about this plugin. If you create a new project using the default template, then this plugin is automatically added whenever you add a platform. What does this plugin do? For <i>modern</i> Android (KitKat and above) and all iOS versions (all supported) it uses a new security system called Content Security Policy (CSP for short). The best place to read about CSP is at MDN (<a href="https://developer.mozilla.org/en-US/docs/Web/Security/CSP">https://developer.mozilla.org/en-US/docs/Web/Security/CSP</a>). I'll do my best to explain it here though. 

CSP is implemented via a meta tag in your HTML. Again, not your config.xml file but your actual HTML. This is what you'll see in the HTML file from the default template:

<code>&lt;meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *"&gt;</code>

That's pretty weird looking, right? What you are basically seeing is a set of rules that dictate what resources can be loaded and how. You can split the above content by semicolons:

<code>
default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'
style-src 'self' 'unsafe-inline'
media-src *
</code>

The beginning of each part represents a "policy directive", basically "what my security rule applies to". So for example, media-src represents <code>audio</code> and <code>video</code> tags. style-src represents style sheets. There's more policy directives (including script-src) to give you really fine grained control over all aspects of your application. You can find the complete list <a href="https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives#Supported_policy_directives">here</a>. default-src represents a default value but it <strong>only</strong> applies to policy directives that end with -src. If that sounds confusing, wait, I'm going to make it a bit more confusing in a bit.

So that's the policy directive, what about the values after it? These values dictate what locations particular resources may be loaded from. You can use a combination of keywords, like 'self', and URLs. Let's talk keywords first. The keyword 'self' means you can use any resource served from the same location as the current document. I can't imagine a case where you wouldn't want that, but it's possible. You can use 'none' to say nothing at all is allowed. A complete list of keywords may be found <a href="https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives#Keywords">here</a>. 

URLs can be of the form "scheme", ie "http:" or a scheme and domain, like http://www.cnn.com. In my testing, I was not able to use a domain by itself nor was I able to use a wildcard for the scheme. Curious about <code>gap</code>? This is a special scheme for iOS and must be left there. 

<code>unsafe-eval</code> isn't really a location but instead represents being able to use eval() within code. I've seen some JavaScript frameworks that require this so it is probably good that it is there by default. One more that <i>isn't</i> in the default template is <code>unsafe-inline</code>. This is a big one. Without this being in your CSP you can't use JavaScript code in your index.html file.

Now - I know all of us are good JavaScript developers and <strong>always</strong> put your code in JS files, but I know I've used inline JavaScript from time to time. Heck, on this blog I'll do it a lot just to keep the code a bit simpler. Well, this will no longer work unless you specifically modify the CSP to add <code>unsafe-inline</code>. To be honest, I'd skip that and just move your code into a JavaScript file. Note that the default CSP does allow inline style sheets. 

Let's consider a simple example. I created a new application and then added a CDN copy of jQuery:

<code>&lt;script src="http://code.jquery.com/jquery-2.1.4.min.js" /&gt;</code>

<strong>To be clear - I do not recommend this. If you do this and your app is offline than your entire application is screwed.</strong>

I then used this code in my deviceReady block:

<pre><code class="language-javascript">$.get("http://www.cnn.com", function(res) {
    console.log(res);
    $("h1").html("set to cnn");
}</code></pre>

Out the gate, none of this will work. You can see this yourself in your remote inspector:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/shot110.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/shot110.png" alt="shot1" width="800" height="427" class="aligncenter size-full wp-image-6203 imgborder" /></a>

First, I need to update my CSP to allow a script src at code.jquery.com:

<code>
script-src 'self' http://code.jquery.com
</code>

<strong>Notice I added 'self'!</strong> I had thought that default-src including 'self' would cover this, but it does not. As soon as I added script-src, I needed to also add 'self' here to let local scripts work. 

Correcting that lets jQuery load - but guess what - there's more:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/shot23.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/shot23.png" alt="shot2" width="800" height="427" class="aligncenter size-full wp-image-6204 imgborder" /></a>

What's nice is that the error is actually pretty descriptive. In a lot of security things in the browser I've seen things silently fail so this is a big help. It is telling you that you either need to set permission in default-src, or use the policy directive connect-src. connect-src is what you want here and applies to XHR, WebSocket, and EventSource directives. Here is what I added:

<code>connect-src http://www.cnn.com</code>

So... make sense? Let's get a bit more particular. First off, what happens if you screw up your CSP? Imagine the following:

<code>&lt;meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; script-src 'self' http://code.jquery.com connect-src http://www.cnn.com"&gt;</code>

See the error? Maybe you don't - that's the point. When running, you will get an error in the console:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/shot32.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/shot32.png" alt="shot3" width="800" height="427" class="aligncenter size-full wp-image-6205 imgborder" /></a>

I'm shocked - like seriously shocked - how darn helpful that error is. In many cases, I've seen browsers simply "swallow" security issues and say nothing. This one not only noted a syntax issue but pretty much told you exactly how to fix it. In case your curious, Google's Android debug is just as helpful:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/05/shot41.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/05/shot41.png" alt="shot4" width="800" height="464" class="aligncenter size-full wp-image-6206 imgborder" /></a>

Now let me explain why I didn't think this post was necessary. I had read about the changes, but did not think they applied by default. I was confused because I explicitly do not use the default Cordova template. Since my template did not include a CSP tag, it didn't effect me! So I began to check on this and look at the different permutations.

If you do not include the plugin and do not include the CSP, you have no access to anything.

If you do not include the plugin and do include the CSP, you have no access to anything.

If you include the plugin and a CSP, you have access to what CSP gives you access to.

If you include the plugin and do not include a CSP, your access falls back to the access tag in config.xml, which is probably * (i.e. everything allowed).

My recommendation? Use the plugin and use the CSP. It is more work and you will screw it up, trust me, but you want to do the right thing. (And later this week I'll edit my normal default Cordova template so I can practice what I preach.)