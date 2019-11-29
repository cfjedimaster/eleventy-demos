---
layout: post
title: "RIAForge Status (looking for help Apache/SVN)"
date: "2011-01-09T11:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2011/01/09/RIAForge-Status-looking-for-help-ApacheSVN
guid: 4077
---

So I've tweeted about this a few times this weekend but just as an FYI, <a href="http://www.riaforge.org">RIAForge</a> has moved to a new server. Basic web pages are running fine. SVN is not working yet. Here is what I'm seeing - and if anyone has an idea, let me know.
<p>
Before the move, a request of svn.riaforge.org/YYY (where YYY was a project using SVN), would return the files in Subversion. This is because read access was always allowed on SVN repos at RIAForge. Now it's returning permission denied. 
<p>
Any clues as to what I should check first? Here is an example config:
<p>
<code>
&lt;Location /blogcfc&gt;
	DAV svn
	SVNPath c:\apath\blogcfc

	# initialize basic http authentication
	AuthType Basic
	AuthName "Subversion repository"
	AuthUserFile c:\apatch\blogcfc\conf\htpasswd

	# require authentication
	&lt;LimitExcept GET PROPFIND OPTIONS REPORT&gt;
		Require valid-user
	&lt;/LimitExcept&gt;	
&lt;/Location&gt;
</code>
<p>
I've confirmed the paths are right (I did obscure it above). I'm sure there is more info I can share - but I'm not sure what.