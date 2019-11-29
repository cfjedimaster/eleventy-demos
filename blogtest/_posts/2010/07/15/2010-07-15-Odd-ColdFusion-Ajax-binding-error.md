---
layout: post
title: "Odd ColdFusion Ajax binding error?"
date: "2010-07-15T19:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/15/Odd-ColdFusion-Ajax-binding-error
guid: 3879
---

Brett asks:

<blockquote>
Hope all is well, I have a CF8 issue and I was hoping that you might have a work around. I have a cfselect that is bound to another cfselect. In the second cfselect I pass two parameters to the function called in the bind. The second parameter is a comma seperated list and it is causing all kinds of errors that i am passing two many arguments to the cfc.
<br><br>
&lt;cfselect name="market" id="market" class="Normal"<br>
required="YES"<br>                         
bind="cfc:COM.LocalJobs.GetMarkets({% raw %}{specialty}{% endraw %},'#Form.Market#')"<br>
display="Market"<br>
value="Market"<br>
bindonload="Yes"<br>
multiple="yes"&gt;<br>
&lt;/cfselect&gt;
<br/><br/>
The value that is being passed back to the cfc (Form.Market) is a multiple slection from this cfselect. This is what is causing the error. Have you come acrossed anything in your journey that might help resolve this?
</blockquote>
<p>
<!--more-->
The first thing I did was create a simple example so I could test. I began with this file:

<p>

<code>
&lt;cfset x = "alpha"&gt;
&lt;cfform name="mainform"&gt;
	&lt;cfinput name="first"&gt;
&lt;/cfform&gt;
&lt;cfdiv bind="cfc:test.stringconcat({% raw %}{first}{% endraw %},'#x#')"&gt;
</code>

<p>

And then wrote my CFC method to just return the combination of the two arguments sent:

<p>

<code>
remote any function stringconcat(a,b) {
	return a & b;
}
</code>

<p>

I ran the code to make sure it worked as is. When entering "foo" into the form field the div display fooalpha, as expected. I then edited x to be alpha,beta and immediately got:

<p>

<blockquote>
<b>You cannot specify more arguments to a CFC function than it declares.</b>

Error parsing bind cfc:test.stringconcat({% raw %}{first}{% endraw %},'alpha,beta')
</blockquote>

<p>

What the heck? It's clearly passing two arguments. But get this. I modified my CFC to temporarily allow for a third arg. When I did that and viewed source on the CFM, I saw this in the JavaScript:

<p>

'bindExpr':[['a','first','','value'],['b','alpha],['c',beta']]

<p>

For some reason ColdFusion assumes that I am trying to pass additional arguments. If I didn't have single quotes around them I could see that. The result would have been something like {% raw %}{first}{% endraw %},alpha,beta. I tried to "trick" the compiler. I used "'alpha','beta'". I used a space between the words and the comma. Nothing worked. I finally recommended he use another delimiter. Depending on the nature of your data that may or may not be acceptable. He suggested a semicolon and I can confirm it works. 

<p>

So obviously this is a bug - right? Has anyone seen this before and come up with a nicer workaround?