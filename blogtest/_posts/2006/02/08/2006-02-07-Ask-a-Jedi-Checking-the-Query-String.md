---
layout: post
title: "Ask a Jedi: Checking the Query String"
date: "2006-02-08T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/02/08/Ask-a-Jedi-Checking-the-Query-String
guid: 1083
---

I just got this email this morning and had to share it:

<blockquote>
I am converting from ASP to coldfusion but having troubles with code dealing with querystrings. 

I have the code: 

&lt;cfif parameterexists(URL.edit) AND URL.edit NEQ ""&gt;<br>
&lt;cfquery name="accountrecord" datasource="datasource"&gt;<br>
SELECT * <br>
FROM Admin<br>
WHERE adID = #URL.edit#<br>
&lt;/cfquery&gt;

Now I think coldfusion still tries to see if URL.Edit is defined for the sql statement although the if statement says only execute code if URL.edit value is present. 

How do I fix this problem? 
</blockquote>

First off - welcome to the Light Side! I have some bad news for you. Now that you are leaving ASP you are going to need to find something else to do with your time once you start finishing your projects in a good tenth of the time it took you in ASP. (As you can see, I'm more than just a little bit biased towards ColdFusion. ;)

So - I had a hard time understanding the exact nature of your question. It sounds like you are saying the query is executing even when the url variable does not exist. While I have problems with your code (which I'll explain in a second), the logic at least seems right. Are you sure you aren't having some other problem? 

That being said - let me pick apart your code a bit and point out some problems. First - forget about parameterExists(). You may have missed this in the docs, or seen it in use in other people's code, but it is deprecated. That just means you shouldn't use it. Instead, you want to use isDefined()*. Note that isDefined works a bit differently. Instead of:

parameterExists(name)

You use:

isDefined("name")

Notice the quotes? I'd rewrite your cfif like so:

<code>
&lt;cfif isDefined("url.edit") and url.edit neq ""&gt;
</code>

Now another problem. I see you are using the value as a number in your query. You need to check and ensure that the value is a number. ColdFusion provides a function for that, isNumeric(). However, even that isn't enough. Don't forget the 3.14159 is also a number, but your database will be desiring a whole number. You can either check for that or simply round the number. That way if the number is changed by some unscrupulous user, it will still be ok for the query. ColdFusion provides a few functions that can get rid of anything after the decimal: round, fix, int, and ceiling. Any of these are fine. 

Still with me? Notice how you use the variable inside your query? There is one more step you can do and that is to use cfqueryparam. This tag does a few things: One, it makes the query run a bit faster. Speed is always good. The best thing it does, however, is add one more layer of validation. It will double check to make sure your value really is the correct type. I'd check the docs for more information on the tag. Here is one more rewrite of your code. 

Before I post the code though - please remember that there are <i>many</i> ways to skin the cat in ColdFusion. Consider this a suggestion. You don't have to write the code exactly as I have it. 

<code>
&lt;cfif isDefined("url.edit") and isNumeric(url.edit)&gt;
&lt;cfquery name="accountrecord" datasource="datasource"&gt;
SELECT * 
FROM Admin
WHERE adID = &lt;cfqueryparam cfsqltype="cf_sql_integer" value="#int(url.edit)#"&gt;
&lt;/cfquery&gt;
</code>

* So just a quick note. As I said - there are multiple ways of doing things in ColdFusion. While isDefined certainly works well enough to check for the existence of a variable, some people use structKeyExists instead. Now - I don't want to confuse you, so feel free to stop reading now. The basic idea is that all variable scopes in ColdFusion are structures. I'm not sure what the equivalent is in ASP, but I'm sure it has something similar. (Basically an array indexed by strings, not numbers.) Because all  the scopes can be treated as a struct, you can change an isDefined("url.edit") to structKeyExists(url, "edit"). You will see some of my readers suggesting that instead of isDefined(). Myself - I'm slowly moving to that form as well, so now my code will sometimes use both methods.