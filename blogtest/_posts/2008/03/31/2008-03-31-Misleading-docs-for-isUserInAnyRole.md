---
layout: post
title: "Misleading docs for isUserInAnyRole"
date: "2008-03-31T16:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/31/Misleading-docs-for-isUserInAnyRole
guid: 2742
---

I just helped someone out on the BACFUG list concerning a misleading doc page for <a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/functions_in-k_34.html">isUserInAnyRole()</a>. 

The docs mention that you can use the function to test and see if a user is in one of a list of roles, but it also implies you can use it to see if a user has any roles at all:

<code>
&lt;cfif IsUserInAnyRole() &gt; 
    &lt;cfoutput&gt;Authenticated user is in these roles: #GetUserRoles()#&lt;/cfoutput&gt; 
&lt;cfelseif &gt; 
    &lt;cfoutput&gt;Authenticated user is in no roles&lt;/cfoutput&gt; 
&lt;/cfif&gt;
</code>

This code won't run as isUserInAnyRole must have at least one argument, which is a list of roles to check against the user. Here is an example showing correct usage. The output will be YES.

<code>
&lt;cfloginuser name="ray" password="parishilton" roles="a,b"&gt;

&lt;cfoutput&gt;#isuserinanyrole("b,c")#&lt;/cfoutput&gt;
</code>

I posted a comment to Livedocs, but I don't see it online yet.