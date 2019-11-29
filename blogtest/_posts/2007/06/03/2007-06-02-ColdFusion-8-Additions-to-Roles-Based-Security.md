---
layout: post
title: "ColdFusion 8: Additions to Roles Based Security"
date: "2007-06-03T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/03/ColdFusion-8-Additions-to-Roles-Based-Security
guid: 2085
---

When roles based security was added to ColdFusion MX, I was a pretty big fan of it. Almost all of my open source applications make use of cflogin. Since that time though my relationship with the feature has soured a bit. There were numerous security issues, and I had wished for more out of the box support for basic security features. ColdFusion 8 improves this feature. Read on to find out what has been added - and why I'm still a bit wary of using it.
<!--more-->
In previous versions of ColdFusion, your security related tags and functions were limited to:

<ul>
<li>cflogin - The primary tag to enable roles based security.
<li>cfloginuser - The tag that marked you as a logged in user.
<li>cflogout - Do I have to explain this one?
<li>GetAuthUser - returned the current user name.
<li>IsUserInRole - Tells you if a user is in a role. If you pass a list of roles, it checks <b>each one</b> and if you are in <b>all</b> of them, returns true.
</ul>

So one of the biggest things missing - and added to ColdFusion 8, is IsUserLoggedIn. As you can probably guess, this tells you if a user is logged in or not. For a site where a user has to be logged in, this is probably not so important. But for sites where users optionally log in, you normally need to know if they are currently authenticated or not. 

Another new function is GetUserRoles. This returns all the roles a user belongs to. It does not return any roles that may have been defined at a servlet level. (If that seems like Greek to you, then you don't have to worry about it.)

A nice addition is IsUserInAnyRole. This is something I had to add as an UDF to my applications. It allows you to check and see if a user is in any particular role in a list. This is great for sites where you may have logic of: Group X, or Admins, can do Y. The idea being that Group X is the main role you want to check for - but admins are allowed to do anything. 

So - I'm happy to see all of this added to feature set. Some of these are direct results of some ERs I filed (or my general complaining). I still have one core problem with this feature. ColdFusion's roles based security system has automatic integration with web server security. What do I mean by that? Imagine you protect a folder on your web server. When the browser requests a page in that folder, you have to authenticate before you can view the page. This is not ColdFusion security. It is security at the web server level. The cflogin tag can integrate with that and automatically pick up the fact that you've authenticated. That is great and all ... but what if you don't <i>want</i> to integrate that level? 

Here is a great example of where this fails. (And a real example at that.) Someone deploys BlogCFC to their intranet, which is completely protected at the web server level. However, BlogCFC still needs you to login to write blog articles. But if I were to test isUserLoggedIn, it would return true since I was authenticated at the web server level. There is no way to ignore that level and just check to see if you are authenticated at the application level.

Of course - this is only really a problem for people shipping applications like I do - things that are placed inside other web sites. If you were building the entire web site, you know if web server security will be used or not. 

I'm still hoping a future release will allow us to "decouple" from the web server!