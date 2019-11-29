---
layout: post
title: "Updated ColdFusion OAuth Code"
date: "2014-01-28T11:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/01/28/updated-coldfusion-oauth-code
guid: 5138
---

<p>
A few months ago I wrote a few blog entries (see the links below) demonstrating how to use OAuth with Google, LinkedIn, and Facebook. I recently had a chance to work on those libraries again and I thought I'd share the updated code. I made some... questionable design decisions on those demos that I'd like to pretend were made by the Mirror Universe Ray instead. 
</p>
<!--more-->
<p>
The primary thing I've fixed in this update is to refactor the code to <i>not</i> be stored in the Session scope. I'm not sure what I was thinking. Now the code can persist in the Application scope. I also moved the logic to create the initial authorization URL into a method as well. In general, that's all that has changed, but I think this makes for a better set of code to use in future projects. 
</p>

<p>
The components are still tag based (the user of this code is on ColdFusion 8), but that won't hurt. Honest. I hope these are helpful to you. For folks curious, these CFCs were used in an application that allowed login from each of the three providers. We then fetched the profile from the service and tried to aggregate as much data as possible into a single object that could be stored locally. Here is that code in question. This is from the file used as the redirection URL.
</p>

<pre><code class="language-markup">
&lt;cfif structkeyExists(url, &quot;code&quot;) and structKeyExists(url, &quot;state&quot;) and structKeyExists(session, &quot;state&quot;) and url.state is session.state and structKeyExists(url, &quot;type&quot;)&gt;

	&lt;cfset user = structNew()&gt;

	&lt;!--- switch based on type ---&gt;
	&lt;cfif url.type is &quot;fb&quot;&gt;

		&lt;cfset accesstoken = application.oauthApps.facebookAPI.getAccessToken(url.code)&gt;

		&lt;!---
		Now the idea is to get our data that we will use for userhookup&#x2F;creation
		---&gt;
		&lt;cfset me = application.oauthApps.facebookAPI.getMe(accesstoken)&gt;

		&lt;cfif structKeyExists(me, &quot;first_name&quot;)&gt;
			&lt;cfset user.firstname = me.first_name&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(me, &quot;last_name&quot;)&gt;
			&lt;cfset user.lastname = me.last_name&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(me, &quot;gender&quot;)&gt;
			&lt;cfset user.gender = me.gender&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(me, &quot;email&quot;)&gt;
			&lt;cfset user.email = me.email&gt;
		&lt;&#x2F;cfif&gt;

		&lt;!--- fb for pic is https:&#x2F;&#x2F;graph.facebook.com&#x2F;ID&#x2F;picture, not 100% sure this is kosher ---&gt;
		&lt;cfset user.picture = &quot;https:&#x2F;&#x2F;graph.facebook.com&#x2F;#me.id#&#x2F;picture&quot;&gt;

		&lt;cfif structKeyExists(me, &quot;location&quot;) and isStruct(me.location)&gt;
			&lt;cfset user.location = me.location.name&gt;
		&lt;&#x2F;cfif&gt;

	&lt;cfelseif url.type is &quot;li&quot;&gt;

		&lt;cfset accesstoken = application.oauthApps.linkedinAPI.getAccessToken(url.code)&gt;

		&lt;!---
		Now the idea is to get our data that we will use for userhookup&#x2F;creation
		---&gt;
		&lt;cfset me = application.oauthApps.linkedinAPI.getMe(accesstoken)&gt;
		&lt;cfif structKeyExists(me, &quot;firstName&quot;)&gt;
			&lt;cfset user.firstname = me.firstName&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(me, &quot;lastName&quot;)&gt;
			&lt;cfset user.lastname = me.lastName&gt;
		&lt;&#x2F;cfif&gt;

		&lt;cfset email = application.oauthApps.linkedinAPI.getEmail(accesstoken)&gt;
		&lt;cfif len(email)&gt;
			&lt;cfset user.email = email&gt;
		&lt;&#x2F;cfif&gt;

	&lt;cfelseif url.type is &quot;g&quot;&gt;

		&lt;cfset accesstoken = application.oauthApps.googleAPI.getAccessToken(url.code)&gt;
		&lt;cfset me = application.oauthApps.googleAPI.getProfile(accesstoken)&gt;

		&lt;cfif structKeyExists(me, &quot;email&quot;)&gt;
			&lt;cfset user.email = me.email&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(me, &quot;given_name&quot;)&gt;
			&lt;cfset user.firstname = me.given_name&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(me, &quot;family_name&quot;)&gt;
			&lt;cfset user.lastname = me.family_name&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(me, &quot;gender&quot;)&gt;
			&lt;cfset user.gender = me.gender&gt;
		&lt;&#x2F;cfif&gt;
		&lt;cfif structKeyExists(me, &quot;picture&quot;)&gt;
			&lt;cfset user.picture = me.picture&gt;
		&lt;&#x2F;cfif&gt;

	&lt;&#x2F;cfif&gt;

	&lt;!--- Now do userhookup, sync ---&gt;
	&lt;cfdump var=&quot;#user#&quot;&gt;

&lt;cfelse&gt;

	oh poop
	&lt;cfabort&gt;

&lt;&#x2F;cfif&gt;
</code></pre>

<p>
Note that the actual "insert profile into db" portion wasn't done in this template - the client handled that part. But I thought the process was interesting and that others may find it useful.
</p><p><a href='/enclosures/Archive34.zip'>Download attached file.</a></p>