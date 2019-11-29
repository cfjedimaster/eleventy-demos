---
layout: post
title: "Ask a Jedi: Structure as an Argument"
date: "2007-08-13T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/13/Ask-a-Jedi-Structure-as-an-Argument
guid: 2275
---

Joel asks:

<blockquote>
This is just a quick "best practices" question about CFC's, specifically regarding arguments.

Let's say that I am creating a book entry in my database.  My form has 3 simple fields--title, author, number of pages.  Easy enough.

My question is what a "best practice" for dealing with this scenario would be. Although I am still pretty new to CFC's, I have learned that bundling information as structs to be used in the CFC can be extremely useful, especially
when the contents of said struct are dynamic. 

But what of known values? Obviously, when invoking the component I could bundle title, author and number
of pages into a struct and look for that in the CFC.  However, in doing this, it would seem that the various specifications for individual arguments (i.e.,
'required', 'type', etc.) would be lost as these could only be applied to the expected struct.  Also, it seems that the whole idea of encapsulation is compromised to an extent as the specificity of the arguments being expected is
reduced and made more generic (e.g., the struct).  

On the other hand, when dealing with ridiculously long forms full of known values, loading them all into a struct would potentially save some coding on the CFC side.
</blockquote>

So just in case folks don't quite get what Joel is saying - he is talking about two options to pass data to a CFC. You can either use a set of arguments or have one argument that is a struct. Consider the following two examples:

<code>

&lt;cffunction name="test" access="public" returntype="string" output="false"&gt;
	&lt;cfargument name="name" required="true" type="string" hint="The name of the user."&gt;
	&lt;cfargument name="age" required="true" type="numeric" hint="The age of the user."&gt;
	
	&lt;cfreturn "Hello, #arguments.name#, I'm happy you are #arguments.age# years old."&gt;
&lt;/cffunction&gt;

&lt;cfset res = test("Ray",34)&gt;
&lt;cfoutput&gt;#res#&lt;/cfoutput&gt;
</code>

This is how most people set up their methods and here is the alternate way (struct as arguments) that Joel mentioned:

<code>
&lt;cffunction name="test2" access="public" returntype="string" output="false"&gt;
	&lt;cfargument name="data" type="struct" required="true" hint="Struct of arguments."&gt;
	
	&lt;cfreturn "Hello, #arguments.data.name#, I'm happy you are #arguments.data.age# years old."&gt;
&lt;/cffunction&gt;

&lt;cfset s = {% raw %}{name="Ray", age=34}{% endraw %}&gt;

&lt;cfset res = test2(s)&gt;
&lt;cfoutput&gt;#res#&lt;/cfoutput&gt;
</code>

So as you can see - Joel is right. In the second example, you no longer have any real clues as to what the UDF is using, outside of one structure. You also lose the validation that helpfully double checked name and age. So in my simple example, I definitely think Joel is right - using "real" arguments does make sense. But as he points out - what about a method that takes many more attributes? It would be simpler, for example, to be able to pass the FORM scope as a structure and not use a lot of...

<code>
form.name,form.age,form.foo,form.goo,form.rustillreading
</code>

Luckily there are a few things we can to make this easier.

First off - don't forget that you can use CFINVOKE and CFINVOKEARGUMENT syntax. While this results in <i>more</i> typing (potentially), it does make things readable. And you can use these tags without typing until the cows come home. Consider this example:

<code>
&lt;cfinvoke component="#application.foo#" method="doIt" returnVariable="result"&gt;
&lt;cfloop item="key" collection="#form#"&gt;
  &lt;cfinvokeargument name="#key#" value="#form[key]#"&gt;
&lt;/cfloop&gt;
&lt;/cfinvoke&gt;
</code>

All I've done here is treat the form scope as a structure where each name reflects an argument in my CFC method. You can, if you want, add conditional logic to hide certain form fields, like submit button names, but if your CFC isn't using them, they will simply be ignored. And don't forget the use of attributeCollection:

<code>
&lt;cinvoke component="#application.foo#" method="doIt" returnVariable="result" attributeCollection="#form#"&gt;
</code>

This example is equivalent to the previous form - just more inline and less typing, but again if you did want to skip certain form fields you would not be able to.

So all in all - I agree with Joel here and hopefully the examples above will show ways to mitigate cases where you have to deal with a large number of attributes.