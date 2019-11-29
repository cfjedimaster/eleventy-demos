---
layout: post
title: "Watch out for this CFLOGIN Bug"
date: "2009-08-07T18:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/07/Watch-out-for-this-CFLOGIN-Bug
guid: 3478
---

My readers know I'm not a fan of the CFLOGIN feature in ColdFusion. It's one of the few areas where I've had continuous frustration and disappointment. Since just about everything else in ColdFusion is absolutely dreamy and gives me butterflies in the stomach, I don't mind that much. But I had to share this finding that was sent to me by Tony. His problem was this that users were unable to login even though he knew they were using a proper username and password. He did a bit of debugging and noticed something odd.
<!--more-->
Every time a user had a colon in their password, the cflogin scope reported the password as everything <i>before</i> the password. Here is a simple example that demonstrates the issue.

<code>

&lt;cflogin&gt;
you arent in
	&lt;cfif isDefined("cflogin")&gt;
		&lt;cfdump var="#cflogin#"&gt;
		&lt;cfdump var="#url#"&gt;
	&lt;/cfif&gt;
&lt;/cflogin&gt;
</code>

Run this template and add the following to the URL:

?j_username=parishilton&j_password=star:nothing

Remember that the cflogin scope is populated when the security framework senses a login attempt. This can be via HTTP Auth, a Form (or URL), and Flash Remoting. The dump though shows a problem:

<img src="https://static.raymondcamden.com/images/Picture 180.png" />

As you can see, cflogin.password is incorrect. If you tried to pass it to code to do an authentication it would fail. What's odd though is that you can use the value in cfloginuser:

<code>
&lt;cflogin&gt;
you arent in
	&lt;cfif isDefined("cflogin")&gt;
		&lt;cfdump var="#cflogin#"&gt;
		&lt;cfdump var="#url#"&gt;
	&lt;/cfif&gt;
      &lt;cfif structKeyExists(url, "login")&gt;
              &lt;cfloginuser name="ray" password="ray:cf1" roles="foo"&gt;
      &lt;/cfif&gt;
&lt;/cflogin&gt;
</code>

Notice the hard coded cfloginuser. If you set the URL to ?login=youbet, then you get logged in just fine. I did a bit of searching and didn't find anything in Google, but the <a href="http://en.wikipedia.org/wiki/Basic_access_authentication">Wikipedia entry</a> on HTTP auth clearly says:

<blockquote>
Before transmission, the user name is appended with a colon and concatenated with the password. The resulting string is encoded with the Base64 algorithm. For example, given the user name Aladdin and password open sesame, the string Aladdin:open sesame is Base64 encoded, resulting in QWxhZGRpbjpvcGVuIHNlc2FtZQ==. The Base64-encoded string is transmitted and decoded by the receiver, resulting in the colon-separated user name and password string.
</blockquote>

Well, that would be it, wouldn't it? Now - this doesn't mean you can't use cflogin as a security framework. It just means you can't use the cflogin <i>scope</i> as a means to authenticate. You would have to hard code the access (form.password for example) or force users to pick passwords without colons. 

With that said - this is probably not a CFLOGIN bug per se, but probably just a byproduct of the nature of the system as a whole.