---
layout: post
title: "Ask a Jedi: Using ColdFusion Ajax to set Client Variables"
date: "2009-02-12T21:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/12/Ask-a-Jedi-Using-ColdFusion-Ajax-to-set-Session-Variables
guid: 3236
---

James Brown (yes, him) asks:

<blockquote>
<p>
Is there a way to assign a value to a client variable using JavaScript?  I know JavaScript runs on the client side and ColdFusion on the server, but with AJAX allowing remote calls to ColdFusion I wonder if it might be possible.  Thank you
for your help.
</p>
</blockquote>

Yep, and it's so easy, it's rather trivial. As long as you can make a HTTP request with Ajax, then you can run any code you would imagine.
<!--more-->
I've been blogging about jQuery pretty extensively lately so let's do this one just using what ships in ColdFusion 8. First, I'll create a simple form:

<code>
&lt;form&gt;
Set Name: &lt;input type="text" name="name" /&gt; &lt;input type="button" value="Set" id="btn" /&gt;
&lt;/form&gt;
</code>

Next I'll use the cfajaxproxy to bind to the name form field.

<code>
&lt;cfajaxproxy bind="url:setname.cfm?name={% raw %}{name}{% endraw %}"&gt;
</code>

This simply says: Generate JavaScript that watches for a change to the name value and pass it to the url: setname.cfm?name={% raw %}{name}{% endraw %}, where {% raw %}{name}{% endraw %} will be the value of the form field. The tag also allows you to run CFC methods or JavaScript functions. setname.cfm is simply:

<code>
&lt;cfparam name="url.name" default=""&gt;
&lt;cfset client.name = url.name&gt;
</code>

And that's it. You may want to change <i>when</i> the Ajax call is made. By default it is fired with the onBlur event. So if you click the set button, or anything else on the page, the Ajax call is made. You could modify things a bit and tell it to fire just on the button click:

<code>
&lt;cfajaxproxy bind="url:setname.cfm?name={% raw %}{name@none}{% endraw %}&{% raw %}{btn@click}{% endraw %}"&gt;
</code>

This bind expression means: Pass name, but don't monitor it (none), and monitor the btn button's click event. Why is there a & between the two binds? I needed a valid URL for the request and the bind has to actually be in the URL itself. Not quite as obvious and simple as the first example, but it gives you a bit more control by running just when the button is clicked.