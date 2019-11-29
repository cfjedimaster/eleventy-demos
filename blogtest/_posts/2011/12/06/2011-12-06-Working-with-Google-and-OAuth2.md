---
layout: post
title: "Working with Google and OAuth2"
date: "2011-12-06T14:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/12/06/Working-with-Google-and-OAuth2
guid: 4456
---

<b>Warning: What follows should NOT be considered a guide. What follows is what <i>worked</i> for me after struggling to get things right. I do not understand this 100%. My only hope is that it may help others. Please take with large portion of salt.</b>

<p/>

Last night I began work on an update to my Google Calendar API to make use of the latest version of their <a href="http://code.google.com/apis/calendar/v3/getting_started.html">API</a>. In order to use this version, I had to switch to using OAuth. I've done a <i>tiny</i> bit of OAuth in the past, but never OAuth 2. I did a bit of digging into <a href="http://code.google.com/apis/accounts/docs/OAuth2.html">their docs</a> and was able to get a working version. Here's what I came up with.

<p>
<!--more-->
The first thing you have to do is create an "Application" registered with Google. This is done via their <a href="https://code.google.com/apis/console#access">API Console</a> and for the most part is a painless process. You begin by creating a new application.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip244.png" />

<p>

Notice that - initially - you can't edit the Redirect URI. We're going to fix that in a second. Click "Create Client ID." When the page reloads, click to edit and change the redirect URI to be a real CFM. Note - you can use localhost here and it works fine. Just be sure to change it to http.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip245.png" />

<p>

Close that dialog by hitting update. Back on the application list, make note of your client ID and client secret. Your code is going to need this. I set up a basic Application.cfc to store these in the Application scope:

<p>

<code>
component {
	this.name="googledocs3";
	this.sessionManagement=true;

	public boolean function onApplicationStart() {
		application.clientid="it's my pin, really";
		application.clientsecret="iwritephpatnight";
		application.callback="http://www.coldfusionjedi.com/demos/2012/dec/6/callback.cfm";
		return true;
	}

}
</code>

<p>

Ok, so in order to start the OAuth process, we have to link to Google. The link to Google will include your client id, your redirect or callback url, and a scope. The scope is what you want to use at Google. Each service will have it's own scope. Here's the link I use for my demo:

<p>

<code>
&lt;cfset authurl = "https://accounts.google.com/o/oauth2/auth?" & 
	  "client_id=#urlEncodedFormat(application.clientid)#" & 
	  "&redirect_uri=#urlEncodedFormat(application.callback)#" & 
	  "&scope=https://www.googleapis.com/auth/calendar&response_type=code"&gt;

&lt;cfoutput&gt;
authurl=#authurl#&lt;p&gt;
&lt;a href="#authurl#"&gt;Login&lt;/a&gt;
&lt;/cfoutput&gt;
</code>

<p>

I output it just so I can see what it looks like a bit easier. Note - most sites use a little popup window. That would work fine. The response_type=code is what you use for server side applications. At this point, you can start testing. If you click that link, you end up on a page like this:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip246.png" />

<p>

At this point, if the user clicks "Allow access", Google is going to send you to your callback URL. In the URL will be a variable code. Now here comes the tricky part. Google sent you back a code. That code is like a ticket to ride. You need to give that code <i>back</i> to Google in order to get a token. The token is the <b>real</b> thing you want. I found <a href="http://www.sitekickr.com/blog/http-post-oauth-coldfusion/">this blog entry</a> which nicely wraps up the call in a UDF:

<p>

<code>
&lt;!---
http://www.sitekickr.com/blog/http-post-oauth-coldfusion
---&gt;
&lt;cffunction name="getAccessToken"&gt;
    &lt;cfargument name="code" required="false" default="" type="string"&gt;
    &lt;cfset var postBody = "code=" & UrlEncodedFormat(arguments.code) & "&"&gt;
    &lt;cfset postBody = postBody & "client_id=" & UrlEncodedFormat(application.clientid) & "&"&gt;
    &lt;cfset postBody = postBody & "client_secret=" & UrlEncodedFormat(application.clientsecret) & "&"&gt;
    &lt;cfset postBody = postBody & "redirect_uri=" & UrlEncodedFormat(application.callback) & "&"&gt;
    &lt;cfset postBody = postBody & "grant_type=authorization_code"&gt;
    &lt;cfhttp method="post" url="https://accounts.google.com/o/oauth2/token"&gt;
        &lt;cfhttpparam name="Content-Type" type="header" value="application/x-www-form-urlencoded"&gt;
        &lt;cfhttpparam type="body" value="#postBody#"&gt;
    &lt;/cfhttp&gt;
	&lt;cfreturn deserializeJSON(cfhttp.filecontent.tostring())&gt;
&lt;/cffunction&gt;

&lt;cfset session.token = getAccessToken(code)&gt;
&lt;cfdump var="#session.token#"&gt;

&lt;a href="test.cfm"&gt;TEST&lt;/a&gt;
</code>

<p>

The result is that now you have a session token. That session token gives you access to the scope you requested earlier. Here is what that token looks like:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip247.png" />

<p>

There are three very important things here:

<p>

<ol>
<li>First, the access_token is the key to using the services. You want to remember that in the session scope.
<li>Second, it doesn't last forever. You can see the timeout there.
<li>Third, the refresh_token, however, does last. (Forever, no. I think it lasts until the user blocks your app's access.) This I think you will want to store in a persistent location.
</ol>

<p>

So given the token, you can now start hitting the API. So for example, to get a list of calendars...

<p>

<code>
&lt;cfhttp url="https://www.googleapis.com/calendar/v3/users/me/calendarList"&gt;
	&lt;cfhttpparam type="header" name="Authorization" value="OAuth #session.token.access_token#" &gt; 
&lt;/cfhttp&gt;
</code>

<p>

Google's Calendar API is REST based, so basically, you just formulate the URL right and pass along the token via an Authorization here. You get nice JSON back so it's pretty easy to work with. If you run my demo (link will be below), and if you actually are a Google Calendar user, you should get a list of your calendars. I tested a few other parts of the API and it all works rather nicely.

<p>

Now I mentioned above that the token does not last forever. Remember that 'refresh' token you got? You can request a new access token using a modified form of the earlier blogger's UDF:

<p>

<code>
&lt;cffunction name="getRefreshToken"&gt;
    &lt;cfargument name="refresh" required="false" default="" type="string"&gt;
    &lt;cfset var postBody = "client_id=" & UrlEncodedFormat(application.clientid) & "&"&gt;
    &lt;cfset postBody = postBody & "client_secret=" & UrlEncodedFormat(application.clientsecret) & "&"&gt;
	&lt;cfset postBody = postBody & "refresh_token=#arguments.refresh#&"&gt;
    &lt;cfset postBody = postBody & "grant_type=refresh_token"&gt;
    &lt;cfhttp method="post" url="https://accounts.google.com/o/oauth2/token"&gt;
        &lt;cfhttpparam name="Content-Type" type="header" value="application/x-www-form-urlencoded"&gt;
        &lt;cfhttpparam type="body" value="#postBody#"&gt;
    &lt;/cfhttp&gt;
	&lt;cfreturn deserializeJSON(cfhttp.filecontent.tostring())&gt;
&lt;/cffunction&gt;
</code>

<p>

Notice that this just slightly tweaks the values sent. In my testing, a call to this refresh service worked fine. I was able to get a new access token after the last one expired. You can try this yourself using the button below. I hope this code is helpful to others.

<p>

<a href="http://www.coldfusionjedi.com/demos/2011/dec/6/index1.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>