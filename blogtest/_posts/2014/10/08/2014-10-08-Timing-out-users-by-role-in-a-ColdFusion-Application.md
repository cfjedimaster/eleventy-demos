---
layout: post
title: "Timing out users by role in a ColdFusion Application"
date: "2014-10-08T12:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/10/08/Timing-out-users-by-role-in-a-ColdFusion-Application
guid: 5328
---

<p>
Late last month a reader asked me if it was possible to override the session timeout so that he could provide different time outs based on a user role. As far as I know there is no direct way of doing this. There may be a way if you get to the underlying Java Session stuff, but I recommended something simpler - if you keep a variable for when the user last hit your site and do a quick time check, you can easily log them out early. To be clear, this is <strong>not</strong> the same as ending the session, but honestly, thats not what he really needed. He simply needed to toggle a flag (loggedin) from true to false if that time limit had expired. I thought I'd whip up a quick set of example code to demonstrate this.
</p>
<!--more-->
<div class="alert alert-success">Two quick notes before I continue. I wrote this using ColdFusion 11. What I'm demonstrating here could easily be done in ColdFusion MX and higher. I'm not going to rewrite it in tags. Ditto for the member functions I used. It should be trivial to port that to ColdFusion 10 as well. Secondly, I didn't use a framework for the two apps I built. I wanted to keep it super simple.</div>

<p>
Ok, let's start off with an incredibly simple application that enforces login. First, the Application.cfc.
</p>


<pre><code class="language-javascript">component {
	
	this.name=&quot;diff_session_v1&quot;;
	this.sessionManagement=&quot;true&quot;;
	
	public boolean function onApplicationStart() {
		application.userService = new model.userservice();
		return true;
	}
		
	public boolean function onRequestStart(string req) {
		
		&#x2F;&#x2F;login attempt
		if(form.keyExists(&quot;login&quot;) &amp;&amp; form.keyExists(&quot;username&quot;) &amp;&amp; form.keyExists(&quot;password&quot;)) {
			if(application.userService.authenticate(form.username,form.password)) {
				session.isLoggedIn=true;	
			}
		}
		
		if(!session.isloggedin &amp;&amp; req.listLast(&quot;&#x2F;&quot;) != &#x27;login.cfm&#x27;) {
			location(url=&quot;login.cfm&quot;,addToken=false);
		}
		
		if(url.keyExists(&quot;init&quot;)) {
			applicationStop();
			location(url=&quot;.&#x2F;&quot;, addToken=false);	
		}
		return true;
	}
	
	public void function onSessionStart() {
		session.isloggedin=false;
	}
	
}</code></pre>

<p>
I'm assuming nothing here is new to folks. This is the same authentication logic you have probably used in a hundred or so applications. My userservice.cfc is literally a method that checks if username and password are "admin". I won't bother sharing that (but you can see it in the attachment). My index.cfm simply says "Hello World" and the login.cfm file is a form, nothing more. Again, this is just the bare minimum. Now let's look at the updated version.
</p>


<pre><code class="language-javascript">component {
	
	this.name=&quot;diff_session_v2a&quot;;
	this.sessionManagement=&quot;true&quot;;
	&#x2F;&#x2F;two minute timeout by default
	this.sessionTimeout = createTimeSpan(0,0,2,0);
	
	public boolean function onApplicationStart() {
		application.userService = new model.userservice();
		return true;
	}
		
	public boolean function onRequestStart(string req) {

		&#x2F;&#x2F;timeout for non admins
		if(session.isloggedin &amp;&amp; session.auth.role == &quot;user&quot; &amp;&amp; dateDiff(&quot;s&quot;,session.lasthit,now()) &gt; 60) {
			session.isLoggedIn=false;
			session.delete(&quot;auth&quot;);	
		}
		
		&#x2F;&#x2F;login attempt
		if(form.keyExists(&quot;login&quot;) &amp;&amp; form.keyExists(&quot;username&quot;) &amp;&amp; form.keyExists(&quot;password&quot;)) {
			var authResult = application.userService.authenticate(form.username,form.password);
			if(authResult.status) {
				session.isLoggedIn=true;	
				session.auth = authResult;
			}
		}
		
		if(!session.isloggedin &amp;&amp; req.listLast(&quot;&#x2F;&quot;) != &#x27;login.cfm&#x27;) {
			location(url=&quot;login.cfm&quot;,addToken=false);
		}
		
		if(url.keyExists(&quot;init&quot;)) {
			applicationStop();
			location(url=&quot;.&#x2F;&quot;, addToken=false);	
		}
		return true;
	}
	
	public void function onRequestEnd(string req) {
		if(session.isLoggedIn) session.lasthit = now();
	}
		
	public void function onSessionStart() {
		session.isloggedin=false;
	}
	
}</code></pre>

<p>
Let's cover the important changes, one by one. 
</p>

<p>
First, I've specified a timeout for the Application. Technically this isn't required, but it makes it a bit easier to test. The biggest change is in onRequestStart. Whereas before we simply had two checks (one for logging in, one to see if authenticated), we've added a new check to see if the user is logged in, has a role of user, and has been idle for more than 60 seconds. I kinda feel bad about this logic being here, it seems like perhaps it should be in the userService, but, I think you get the point. If we determine that "too much" time has passed (and the value is arbitrary), then we mark the user as logged out.
</p>

<p>
I do want to share the userService now as it is a tiny bit more complex. It now returns a structure that includes a status and user information as well.
</p>


<pre><code class="language-javascript">component {

	public struct function authenticate(required string username, required string password) {
		&#x2F;&#x2F;admin:admin
		if(username == &quot;admin&quot; &amp;&amp; password == &quot;admin&quot;) {
			return {% raw %}{ id:1, role:&quot;admin&quot;, status:true}{% endraw %};	
		}
		if(username == &quot;user&quot; &amp;&amp; password == &quot;user&quot;) {
			return {% raw %}{ id:2, role:&quot;user&quot;, status:true}{% endraw %};	
		}
		return {% raw %}{ status:false }{% endraw %};
	}	
}
</code></pre>

<p>
Anyway, I hope this is useful. I've included both versions as an attachment to this blog entry.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fdifferenttimeoutexample%{% endraw %}2Ezip'>Download attached file.</a></p>