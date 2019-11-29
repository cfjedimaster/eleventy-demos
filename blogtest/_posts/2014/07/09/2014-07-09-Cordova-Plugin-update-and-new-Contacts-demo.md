---
layout: post
title: "Cordova Plugins update, and new Contacts demo"
date: "2014-07-09T11:07:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/07/09/Cordova-Plugin-update-and-new-Contacts-demo
guid: 5261
---

<p>
Yesterday the Cordova team released updated plugins. You can read the details here: <a href="http://cordova.apache.org/news/2014/07/08/plugins-release.html">Plugins Release: July 8, 2014</a>. Of particular interest to me was the update to the <a href="https://github.com/apache/cordova-plugin-contacts">Contacts</a> plugin, specifically the addition of a new API, pickContact.
</p>
<!--more-->
<p>
Previously, you could search the device's contact database, but there was no way to provide a list of all the contacts so the user could easily select one. Third-party plugins existed to provide that functionality, but now it is provided directly with the core plugin itself via pickContact. Here is a simple example:
</p>

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);

function init() {	
	document.querySelector(&quot;#pickContact&quot;).addEventListener(&quot;touchend&quot;, doContactPicker, false);
}

function doContactPicker() {
	navigator.contacts.pickContact(function(contact){
		console.log(&#x27;The following contact has been selected:&#x27; + JSON.stringify(contact));
		&#x2F;&#x2F;Build a simple string to display the Contact - would be better in Handlebars
		var s = &quot;&quot;;
		s += &quot;&lt;h2&gt;&quot;+getName(contact)+&quot;&lt;&#x2F;h2&gt;&quot;;

		if(contact.emails &amp;&amp; contact.emails.length) {
			s+= &quot;Email: &quot;+contact.emails[0].value+&quot;&lt;br&#x2F;&gt;&quot;;
		}

		if(contact.phoneNumbers &amp;&amp; contact.phoneNumbers.length) {
			s+= &quot;Phone: &quot;+contact.phoneNumbers[0].value+&quot;&lt;br&#x2F;&gt;&quot;;
		}

		if(contact.photos &amp;&amp; contact.photos.length) {
			s+= &quot;&lt;p&gt;&lt;img src=&#x27;&quot;+contact.photos[0].value+&quot;&#x27;&gt;&lt;&#x2F;p&gt;&quot;;
		}

		document.querySelector(&quot;#selectedContact&quot;).innerHTML=s;
	},function(err){
		console.log(&#x27;Error: &#x27; + err);
	});
}

&#x2F;*
Handles iOS not returning displayName or returning null&#x2F;&quot;&quot;
*&#x2F;
function getName(c) {
	var name = c.displayName;
	if(!name || name === &quot;&quot;) {
		if(c.name.formatted) return c.name.formatted;
		if(c.name.givenName &amp;&amp; c.name.familyName) return c.name.givenName +&quot; &quot;+c.name.familyName;
		return &quot;Nameless&quot;;
	}
	return name;
}</code></pre>

<p>
The actual API is relatively simple, just <code>navigator.contacts.pickContact</code>. The first argument is a success callback while the second is for errors. This fires the <strong>native</strong> contact picker UI for the device. For example, here it is in iOS:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-07-09 at 9.31.03 AM.png" />
</p>

<p>
For the most part, the Contact API is a bit simple, but you do run into a few quirks. I <i>strongly</i> recommend reading the full <a href="https://github.com/apache/cordova-plugin-contacts/blob/master/doc/index.md">docs</a> for the plugin. You can see in my code above where I do a bit of work for iOS to handle how it does names.  
</p>

<p>
Finally, my sample code displays the contact you selected.
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screen Shot 2014-07-09 at 9.32.57 AM.png" />
</p>

<p>
I've added this demo to my <a href="https://github.com/cfjedimaster/Cordova-Examples">Cordova-Examples</a> repository on GitHub.
</p>