---
layout: post
title: "Ask a Jedi: Sharing variables between different ColdFusion applications"
date: "2006-04-19T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/19/Ask-a-Jedi-Sharing-variables-between-different-ColdFusion-applications
guid: 1221
---

A reader asks:
<blockquote>
Is there anyway to share variables between two different applications within one website?
</blockquote>

Actually there is a very simple, but slightly dangerous way - the Server scope. As you can guess, the Server scope is global to the ColdFusion server. So any application could set a Server variable and any other application could read it. So why is this dangerous?

1) If you are hosting your sites on an ISP, it is very easy for another customer to view and modify the Server scope. While they probably wouldn't, you can't be certain that your data won't be changed by others. If you use this route, I would <i>only</i> suggest it in a case where you have the entire ColdFusion server to yourself. To be anal, even Application variables aren't safe. If someone can guess the name of your application scope, they can just use the &lt;cfapplication&gt; tag to switch to your application and read/modify values. 

2) If you have multiple applications reading and writing to the server scope, then you definitely want to ensure you use &lt;cflock&gt;. If you don't, there is a risk of data getting messed up and corrupted. At least (thank god!) you won't have the memory issues that plagues pre-MX versions of ColdFusion.

I'd <i>highly</i> recommend you build a CFC to make this easier. You can imagine a CFC whose sole purpose is to read and write to the Server scope. This makes your code easier. You can do something like so:

<code>
&lt;cfset theVal = application.serverFacade.read("numberpirates")&gt;
</code>

Inside the CFC the locks would be handled for you. Ditto for a write:

<code>
&lt;cfset application.serverFacade.write("status","Klingons on the starboard bow.")&gt;
</code>

What's nice is that if you change your mind about how the data is persisted, your client code doesn't have to change, just your component.