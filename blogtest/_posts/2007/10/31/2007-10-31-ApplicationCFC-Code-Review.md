---
layout: post
title: "Application.CFC Code Review"
date: "2007-10-31T14:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/31/ApplicationCFC-Code-Review
guid: 2444
---

Patrick emailed me last night with a some problems he was having with an Application.cfc file. When I saw the file - I saw <i>numerous</i> problems. I asked if he was cool with me <strike>ripping</strike>reviewing it publicly and he said sure. I know that many people are still getting used to the idea of Application.cfc, so I hope this is useful, and as true with all code reviews - please take what I say with a grain of salt. Somethings are just personal opinion.
<!--more-->
So first off - here is the file in question: <a href="http://www.nomorepasting.com/getpaste.php?pasteid=5861">http://www.nomorepasting.com/getpaste.php?pasteid=5861</a>

I'm going to move down the file and point out what I see as wrong, or what could be done better. Let's start first in the constructor area where he has this code:

<code>
&lt;!--- &lt;cftry&gt;

  &lt;cfldap action="QUERY"
      name="ldap"
      attributes="sn"
      start="ou=company,dc=company,dc=com"
      server="localhost"
      username="localdomain\intranet"
      password="pass"&gt;
  &lt;cfcatch type="any"&gt; ---&gt;
  &lt;cfset application.noldap = true&gt;
 &lt;!--- &lt;/cfcatch&gt;

  &lt;/cftry&gt; ---&gt;
</code>

While the try/catch/cfldap is commented out - his intent - a "test" hit to see if his ldap server is up - is good. But he did it in the constructor. Stuff like this should be done in an onApplicationStart method.

Moving down - he specifies a cflogin idletimeout value, but earlier had specified that cflogin should be tied to the session. That should then overrule the idletimeout. (I need to test that actually.) 

<code>
&lt;cfset theusername=trim(form.j_username)&gt;
&lt;cfset thepassword=trim(form.j_password)&gt;
</code>

Don't forget that your Var Scope rules apply to the Application.cfc file as well. Also, cflogin can exist for multiple situations, not just a form post. If I hit your site with j_username and j_password in the query string, your site will error out since the form scope values won't exist. If you want to check for cflogin, then use the cflogin scope. 

<code>
&lt;cfquery name="auth" datasource="intranet"&gt;&lt;!--- MySQL Fieldnames are named like Active Directory Fields for easier sync between both ---&gt;
    SELECT * FROM users WHERE samaccountname='#theusername#' AND password='#thepassword#'
&lt;/cfquery&gt;
</code>

Repeat after me - I will not write dynamic SQL without using cfqueryparam.

Now look down to...

<code>
&lt;cfset onSessionStart()&gt;
</code>

Bad. While you <i>can</i> call methods directly, you shouldn't. ColdFusion is responsible for starting the session. It already ran it when you hit the page and you were shown the login screen. If your intent is to set some session variables only after login, then set them here. But do not set them in onSessionStart.

Now let's look at your onSessionStart, where I saw the worst code. Here is the entire method:

<code>
&lt;cfif application.noldap&gt;
&lt;cfquery name="application.mitarbeiter" datasource="intranet"&gt;
    SELECT * FROM users
    &lt;/cfquery&gt;
&lt;cfelse&gt;
&lt;cfldap action="QUERY"
      name="results"
      attributes="sn,givenname,department,telephoneNumber,mobile,mail,title,samAccountName,initials,displayname,physicalDeliveryOfficeName,description"
      start="ou=company,dc=company,dc=com"
      filter="(&(objectclass=user)(company=Our Company))"
      server="localhost"
      username="localdomain\intranet"
      password="pass"&gt;
 
      &lt;cflock scope="application" type="exclusive" timeout="20"&gt;
&lt;cfset application.mitarbeiter = results&gt;
&lt;/cflock&gt;
&lt;/cfif&gt;
&lt;cfquery name="application.news" datasource="intranet" maxrows="2"&gt;
SELECT * FROM aktuelles ORDER BY id DESC
&lt;/cfquery&gt;
&lt;cfquery name="application.accounts" datasource="intranet"&gt;
SELECT * FROM accounts
&lt;/cfquery&gt;
&lt;cfquery name="application.kontakte" datasource="intranet"&gt;
SELECT * FROM kontakte ORDER BY type, firma, name
&lt;/cfquery&gt;
&lt;cfquery name="application.marken" datasource="intranet"&gt;
SELECT * FROM marken ORDER BY seit DESC
&lt;/cfquery&gt;
</code>

Application variables being created in onSessionStart? This implies you do not understand the methods of Application.cfc and how they are created. These are all queries that should be moved into onApplicationStart.

In a similar vein - consider this line from onSessionEnd:

<code>
&lt;cfset structclear(session)&gt;
</code>

The session is already over. This will actually throw an error, silently, because you can't directly access the session scope here. When ColdFusion runs onSessionEnd, it passes the session data as an argument, and you must work with the data via the argument, not the Session scope.

Lastly - I love the error message:

<blockquote>
<p>
The server made a boo boo! ;)
</p>
</blockquote>