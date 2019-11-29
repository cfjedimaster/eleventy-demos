---
layout: post
title: "Ask a Jedi: Variable Scopes in CFCs"
date: "2006-02-08T17:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/08/Ask-a-Jedi-Variable-Scopes-in-CFCs
guid: 1086
---

A reader just sent this in:

<blockquote>
I'm getting a bit confused as the difference in variables used in components.  This, Variable, Var, Caller, etc....Can you clear the fog in my head for me?
</blockquote>

I talked a bit about scopes in CFCs before, specifically an <a href="http://ray.camdenfamily.com/index.cfm/2005/11/25/Ask-a-Jedi-Variables-versus-Var-in-a-CFC">entry</a> on November 25th about Variables versus Var in a CFC. But now is probably a good time to write out a good list:

<h2>Scopes in a CFC</h2>

<table border="1">
<tr>
<th>Scope</th>
<th>Purpose/How it Works/Etc</th>
</tr>
<tr valign="top">
<td>Variables</td>
<td>The variables scope is available to the entire CFC. A value set in the variables scope in one method, or in the constructor, will be available to any other method, or the constructor, in the CFC. I typically use variables in much the same way I use Application variables in an site.</td>
</tr>
<tr valign="top">
<td>This</td>
<td>The This scope acts like the Variables scope in that it is "global" to the CFC. However, it is also accessible <i>outside</i> the CFC. So if foo is an instance of the CFC, and you do: foo.name = "Rabid" outside of the CFC, then you have just creating a key called "name" in the This scope with the value of "Rabid." You can also cfoutput the value of foo.name. Because of this accessibility, many folks recommend against using the This scope, and instead suggest relying on methods to set data (or get data) inside the CFC. These methods then write to the Variables scope.

To repeat:<br>
&lt;cfset foo.name = "Rabid"&gt; (where foo is an <b>instance</b> of the CFC) is the same as &lt;cfset this.name = "Rabid"&gt; <b>inside</b> the CFC.
</td>
</tr>
<tr valign="top">
<td>Var</td>
<td>Var scoped variables exist only for the duration of the method. <b>You must use the var scope for any variable that should exist only inside the method, like query names, loop iterators, etc.</b> Sorry to "shout" but the lack of var scoping is one of the trickiest things to debug when things go wrong. Unlike other scope, you do not prefix the scope name in front of the variable.</td>
</tr>
<tr valign="top">
<td>Arguments</td>
<td>The arguments scope consists of every argument passed to the method. So if the calling code did foo(name="King Camden"), then the foo method will have a variable called arguments.name.</td>
</tr>
<tr valign="top">
<td>Form, URL, Application, Session, Server, CGI, Client, Request, Cookie</td>
<td>These scopes act exactly as they do anywhere else. <i>In general</i> you should not use these scopes inside a CFC. When you do you are making your CFCs less portable between applications.</td>
</tr>
<tr valign="top">
<td>Caller, Attributes</td>
<td>Caller and Attributes do not exist inside a CFC. They should only be used inside custom tags.</td>
</tr>
</table>

I think I covered everything here. Anyone think we need a CFC "Cheat Sheet" PDF?

<b>Editors Note:</b> I'm getting some good feedback on this entry. I'll be editing the entry from time to time instead of just posting comments, so revisit the entry.