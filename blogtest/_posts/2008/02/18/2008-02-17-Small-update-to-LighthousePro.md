---
layout: post
title: "Small update to LighthousePro"
date: "2008-02-18T06:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/18/Small-update-to-LighthousePro
guid: 2655
---

Just a quick note to say I released a minor update to <a href="http://lighthousepro.riaforge.org">Lighthouse Pro</a>. This last update has a few changes, but the main one is that if you are editing an issue and let your session timeout, after you login your changes are preserved. So if you had entered some lengthy notes, timed out, hit Save, when you login, you changes to the issue are preserved and stored. 

There are a few ways you can do this, but here is how I did it. Also note I was only only concerned about people timing out in an issue edit. First off, in login.cfm, I look for a form post from the issue editor:

<code>
&lt;cfif structKeyExists(form, "issuetypeidfk")&gt;
	&lt;cfset session.issueform = duplicate(form)&gt;
&lt;/cfif&gt;
</code>

Then back in view.cfm, the file that handles editing issues, I simply added:

<code>
&lt;cfif structKeyExists(session, "issueform")&gt;
	&lt;cfset structAppend(form, session.issueform)&gt;
	&lt;cfset structDelete(session, "issueform")&gt;
&lt;/cfif&gt;
</code>

Note that I clear out the session data. This is important so as to not keep restoring the edits for future editing.