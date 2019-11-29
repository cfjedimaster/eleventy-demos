---
layout: post
title: "Ask a Jedi: Problem with Autosuggest"
date: "2007-07-04T20:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/04/Ask-a-Jedi-Problem-with-Autosuggest
guid: 2171
---

This email came in yesterday and it was pretty obvious to me what the problem was. It was almost so obvious that I didn't bother to blog it, but with the amount of folks who will be introduced to AJAX via ColdFusion 8, I thought it made sense to share. Jason writes:

<blockquote>
Trying to use the new autosuggest in 8. In my application.cfm (yes I know) I do:

<cfset application.plan = createObject("component","cfc.plan")>

Then I use that cfc throughout my application with no problem.  But, when I try to use it with autosuggest: 

autosuggest="cfc:application.plan.GetFoo({% raw %}{cfautosuggestvalue}{% endraw %})"

I get: The specified CFC application.plan could not be found
</blockquote>
<!--more-->
The solution was pretty simple. When using autosuggest, or any other ColdFusion 8 tag that ties to a CFC (like cfajaxproxy), you tell ColdFusion the <b>name</b> of the component, not the name of a ColdFusion variable. You have to remember that all of this AJAX goodness is on the client side, in the browser, and the browser has no idea what Application or Session variables your server may have. So the quick fix would be to just switch from application.fltplan to cfc.fltplan. But it brings up the question - what if you wanted to tie into an Application scoped CFC?

While you would not be able to do it directly from the browser, you could speak to a CFC that acts as a proxy to the Application scoped variable. You could even create a proxy that speaks to a Session scoped CFC. In the past (well, ok, present, I keep forgetting that ColdFusion 8 isn't actually released yet) you would do this to help alleviate the slowness in creating a CFC. Your AJAX requests would still create the proxy CFC on every hit, but your "main" CFC could be cached and only created once. That isn't so much of a big deal anymore in ColdFusion 8, but outside of just performance, you may have configuration information and other bits stored in the Application scoped CFC.