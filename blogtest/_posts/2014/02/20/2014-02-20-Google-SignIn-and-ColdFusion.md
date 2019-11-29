---
layout: post
title: "Google+ Sign-In and ColdFusion"
date: "2014-02-20T22:02:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2014/02/20/Google-SignIn-and-ColdFusion
guid: 5158
---

<p>
A while ago I blogged (see related entries) about ColdFusion, OAuth, and Google. I ended up using this on a client's project. They go to his app, click sign-in, are redirected to Google, and upon authenticating, are brought back to the app so that profile information can be retrieved from Google and synced up with a local user record. My client then asked me to take a look at <a href="https://developers.google.com/+/web/signin/">Google+ Sign-In</a>. I spent some time working on some code and I thought I'd share. While this post uses ColdFusion for the back end, I think it could be helpful to folks using other back ends as I found some issues that apply universally. 
</p>
<!--more-->
<p>
The docs describe three different ways to use the API, but one isn't encouraged so really there are only two. The first is a client-side only approach. As you can imagine, this is done via HTML and JavaScript. While limited (and I'll talk about why in a second), Google gets credit for making it real easy to use (mostly). 
</p>

<p>
As with the OAuth examples I shared before, you need to create an app in their developers console. Once you do, you can then create your HTML page and try out their guide. There are a few ways of adding a sign-in button, but the simplest is with just a HTML button as described <a href="https://developers.google.com/+/web/signin/add-button">here</a>. You drop in some JavaScript code and then layout your button with pure HTML.
</p>

<pre><code class="language-markup">
&lt;span id=&quot;signinButton&quot;&gt;
  &lt;span
    class=&quot;g-signin&quot;
    data-callback=&quot;signinCallback&quot;
    data-clientid=&quot;1094453904134.apps.googleusercontent.com&quot;
    data-cookiepolicy=&quot;single_host_origin&quot;
    data-requestvisibleactions=&quot;http:&#x2F;&#x2F;schemas.google.com&#x2F;AddActivity&quot;
    data-scope=&quot;https:&#x2F;&#x2F;www.googleapis.com&#x2F;auth&#x2F;plus.login&quot;&gt;
  &lt;&#x2F;span&gt;
&lt;&#x2F;span&gt;
</code></pre>

<p>
As you can see, data attributes are used to drive how the button behaves, which is a wonderfully <i>simple</i> way of doing things. I dig that. You have to write the code that handles the callback but Google provides an example of what that looks like. You can handle the result any way you wish, but one probable use case will be to grab the user's profile so you know who they are.
</p>

<p>
Loading the profile can be done if you load in the appropriate library. Google demonstrates this with this example: 		    
</p>

<pre><code class="language-javascript">gapi.client.load('plus','v1', callback);</code></pre>

<p>
Unfortunately I was never able to find the docs for the library. You have access to it via gapi.client.plus so I simply dumped that and then used the <a href="https://developers.google.com/+/api/">HTTP</a> guide for reference. Oddly, the <a href="https://developers.google.com/+/web/api/javascript">JavaScript</a> reference focused on the button API (you can create the sign-in button with JavaScript instead of HTML) and didn't talk about the other stuff you would do after sign-in. That seems pretty weird to me, but I was able to get something working. I built a quick demo that logs you in, gets and displays your profile, and gets your posts. I didn't display the posts, but if you open up console you can see it being returned. The code isn't the prettiest, but take a look:
</p>

<p>
<strike>
http://www.raymondcamden.com/demos/2014/feb/20/test1.html</strike> <i>(Demo no longer available.)</i>
</p>

<p>
Ok.... so that works but is missing something. While you could use this to build your own G+ viewer, you can't use it to sign users into your application. Why? The authentication is entirely client-side, how would you tell your server? Well, you could simply ping the server with an XHR call saying, "Hey, I'm Ray", but how would you know that that call was authentic? People like me love to hit your site with devtools open and see what mischief we can get up to. 
</p>

<p>
This is where the second approach comes in - the <a href="https://developers.google.com/+/web/signin/server-side-flow">hybrid server-side flow</a>. This approach basically has your client-side code do an authentication, take a code value, pass it to the server, and have the server hit Google to see if the code is valid. I'm going to, um, "borrow" from their docs and share this image, which demonstrates it.
</p>

<p>
<img src="https://static.raymondcamden.com/images/server_side_code_flow.png" />
</p>

<p>
Unfortunately, the docs kinda break down here. First, they focus on PHP, Java, and Python, which means if you are using something else you're out of luck since in all three cases they are using a library to hide many of the implementation details. Secondly, some of the examples are out of date (like in the PHP area for example) and I didn't realize that until a lucky search turned up a bug report. 
</p>

<p>
This is what I figured out, and I should point out that I'm not entirely confident this is 100% right, but it seems to work. First - the hybrid process asks that after you login via the client-side, you pass a code value to the server. This is an example:
</p>

<pre><code class="language-javascript">
$.post("auth.cfc?method=store&returnformat=json", {% raw %}{code:authResult['code'],state:'#session.state#'}{% endraw %}, function(res, code) {
		    	console.log(res);
},"JSON");
</code></pre>

<p>
authResult was passed in via Google and session.state is simply a state verification token much like what I used in the OAuth demos. On the server side I discovered I could use the same code I had used before to request an access token:
</p>

<pre><code class="language-javascript">//Credit: http://www.sitekickr.com/blog/http-post-oauth-coldfusion
private function getGoogleToken(code) {
	var postBody = "code=" & UrlEncodedFormat(arguments.code) & "&";
		 postBody = postBody & "client_id=" & UrlEncodedFormat("1094453904134.apps.googleusercontent.com") & "&";
		 postBody = postBody & "client_secret=" & UrlEncodedFormat("oops this is secret") & "&";
		 postBody = postBody & "redirect_uri=" & UrlEncodedFormat("postmessage") & "&";
		 postBody = postBody & "grant_type=authorization_code";


	var h = new com.adobe.coldfusion.http();
	h.setURL("https://accounts.google.com/o/oauth2/token");
	h.setMethod("post");
	h.addParam(type="header",name="Content-Type",value="application/x-www-form-urlencoded");
	h.addParam(type="body",value="#postBody#");
	h.setResolveURL(true);
	var result = h.send().getPrefix();
	return deserializeJSON(result.filecontent.toString());

}

remote function store(code, state) {
	if(arguments.state != session.state) {
		throw new exception("Invalid state");
	}
	session.code = arguments.code;

	var auth = getGoogleToken(session.code);
	session.auth = auth;
	return auth;
}

</code></pre>

<p>
Note that my CFC returns the entire auth object, which is probably unnecessary. If this works, I store the authentication info in the session. I confirmed this worked by adding a call (via http in the CFC) to get the profile and it worked fine. So at this point, I've got a client side app with access to the Google+ profile and the server has a temporary token to also access the user's information. I could then say - on the server - that I "know" who the user is. (Oh, one important note: see the redirect_uri is set to postmessage.)
</p>

<p>
You can run this demo here:
<strike>http://www.raymondcamden.com/demos/2014/feb/20/test2.cfm</strike> <i>(Demo no longer available.)</i>
</p>

<p>
I've included a full zip of the demo code below. As I said, the code isn't pretty but hopefully it can help others build something decent with Google+ Sign-In.
</p><p><a href='https://static.raymondcamden.com/enclosures/googleplus1.zip'>Download attached file.</a></p>