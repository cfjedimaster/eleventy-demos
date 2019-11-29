---
layout: post
title: "Ask a Jedi: Embedding ColdFusion-based code on another server"
date: "2008-09-05T16:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/05/Ask-a-Jedi-Embedding-ColdFusionbased-code-on-another-server
guid: 3001
---

Wayne asks:

<blockquote>
<p>
I want to give users of one of my sites code (HTML? JS?) that they can embed on their HTML pages to call a ColdFusion form on my server. The object is to begin a registration process on there web pages that will then take the end user to my CF site after they have entered some starting information (name, birthdate, email address).

I created a CFC that outputs the form to do this and I can invoke it from a ColdFusion page and it works fine. However I cannot figure out how to embed this on another servers HTML page. I also need to pass a variable along with the form information (right  now I'm just passing the URL of the client's server to figure out which client is using the form).
</p>
</blockquote>
<!--more-->
This is a pretty cool question. Quite a few services these days let you embed some code on your page to get some form of functionality. Google Adsense and Analytics are two examples from the big G. <a href="http://www.wufoo.com">WuFoo</a> has a very slick form embed service. My own <a href="http://harlan.riaforge.org">Harlan Ad Server</a> does this as well. So how can we do this with a ColdFusion service?

First off - you asked, how would the user embed the code - HTML or JS. For Google's Analytics and Adsense services, and my Harlan product, the solution is JavaScript. You embed a script tag that points to JavaScript on the external server. You can easily point to a CF file (as I did with Harlan) and then use document.writes, or other methods, to output stuff back to the screen.

WuFoo however uses an iframe. The benefit of this is that you can then point directly to a page that outputs simple HTML (or HTML and JS) and have an easier time displaying content. I kind of like this approach so I thought I'd whip up a quick demo for Wayne using it. Let's begin though with the component that will be our main service. I've created a method, displayForm, that will output an extremely simple form.

<code>
&lt;cffunction name="displayForm" access="remote" returnType="string" returnFormat="plain" output="false"&gt;
	&lt;cfset var s = ""&gt;
	&lt;!--- borrowed from http://www.cflib.org/udf/getCurrentURL ---&gt;
	&lt;cfset var thisURL = getPageContext().getRequest().GetRequestUrl().toString()&gt;
	&lt;cfsavecontent variable="s"&gt;
&lt;cfoutput&gt;
&lt;form action="#thisURL#?method=processForm" method="post"&gt;
&lt;/cfoutput&gt;
Your Name: &lt;input type="text" name="name"&gt;&lt;br /&gt;
Your Email: &lt;input type="text" name="email"&gt;&lt;br /&gt;
&lt;input type="submit" value="Send It!"&gt;
&lt;/form&gt;
	&lt;/cfsavecontent&gt;
	
	&lt;cfreturn s&gt;
&lt;/cffunction&gt;
</code>

Nothing too complex about this. The meat of it is simple HTML. Do note I used returnFormat in the cffunction tag. This means if the URL doesn't specify a returnFormat, the default of plain will be used. I only did this to make the calling code a bit simpler. (Sure, most folks will just cut and paste your embed code, but the smaller we make it the less chance they have of accidentally screwing it up. Users being what they are. Did I say that out loud?)

The action of the form is the URL itself. I did this by borrowing the code for <a href="http://www.cflib.org/udf/getcurrenturl">getCurrentURL()</a> from CFLib. 

So to embed this, I, um, "innovated" the code WuFoo used, stripped it down a bit, and came up with this:

<code>
&lt;h2&gt;Welcome to My Site&lt;/h2&gt;

&lt;p&gt;
Please fill out this form below so we can learn about you and spy on your spending habits, etc.
&lt;/p&gt;

&lt;iframe allowTransparency="true" frameborder="0" 
		scrolling="no" style="width:100%;border:none" 
		src="http://www.raymondcamden.com/demos/embedform/form.cfc?method=displayform"&gt;
Sorry, you don't support iframes.&lt;/iframe&gt;
&lt;small&gt;&lt;a href="http://coldfusionjedi.com/"&gt;Powered by Camden Technology&lt;/a&gt;&lt;/small&gt;

&lt;p&gt;
My Footer.
&lt;/p&gt;
</code>

Ignore the HTML on top and bottom of the iframe. I just wanted a realistic page wrapper around the iframe. Note that the URL for the iframe actually works. You should be able to put this code on your own server and run it. The code in the small block is just an example of attributing the embedded code. This is what WuFoo uses. It doesn't serve any real purpose here though.

So at this point we have a CFC that will output HTML for a form. We have our own page, which could be a static HTML page, a JSP page, or even, lord forbid, a PHP page. Doesn't matter. Once run, it will render the iframe and call out to my CFC.

If you remember, the action of the form was the CFC itself, but we had used an action of processForm. Now at this point, what you do is really up to your business needs. Wayne had said he wanted to take the initial data and start the user answering other questions. So I figured I'd just take the form fields, add them to the session scope, and then push the user to the new page on my server. Here is how I did that.

<code>
&lt;cffunction name="processForm" access="remote" returnType="string" returnFormat="plain" output="false"&gt;
	&lt;!--- borrowed from http://www.cflib.org/udf/getCurrentURL ---&gt;
	&lt;cfset var thisURL = getPageContext().getRequest().GetRequestUrl().toString()&gt;
	&lt;!--- remove the file name from thisurl ---&gt;
	&lt;cfset thisURL = listDeleteAt(thisURL, listLen(thisURL,"/"), "/") & "/form2.cfm"&gt;
	&lt;!--- process form fields ---&gt;
	&lt;cfset session.name = form.name&gt;
	&lt;cfreturn "&lt;script&gt;top.location = '#thisURL#'&lt;/script&gt;"&gt;
&lt;/cffunction&gt;
</code>

Once again I grab the current URL, but this time I strip out the file name and use form2.cfm. I copy one form field to the session scope. I didn't bother copying the email form field. Two notes on this. I obviously have an Application.cfc file with sessionManagement enabled. I won't bother showing that code. Secondly - I used a session variable in a CFC. Isn't that a big No-No? Am I going to incur the Neverending Wrath of the OO Lords? Maybe. But I think that this is an ok use of the session scope within the CFC. I only need to store the value so that the next set of pages can work with it, and since this gets the job done, I'm happy with it. 

The last step is to send them to the next page in the process (whatever that process may be). To handle that, I simply return some javaScript that will reload the current browser to the form2.cfm page on my server.

Now let me answer Wayne's second question - figuring out which client the data comes from. There are a few ways of handling this. Wayne checks the URL of the calling server. What you could do instead is generate embed code for the user that passes a client ID in the iframe code. So if I was client id 42, my embed code would look like so:

<code>
&lt;iframe allowTransparency="true" frameborder="0" 
		scrolling="no" style="width:100%;border:none" 
		src="http://www.coldfusionjedi.com/demos/embedform/form.cfc?method=displayform&clientid=42"&gt;
Sorry, you don't support iframes.&lt;/iframe&gt;
&lt;small&gt;&lt;a href="http://coldfusionjedi.com/"&gt;Powered by Camden Technology&lt;/a&gt;&lt;/small&gt;
</code>

Note the clientid at the end of the URL. I would then modify the CFC to notice the argument, and use the clientID in the form action post, or simply add a hidden form field with the value. (Just be aware that this is something that could be modified on the other server.)

I hope this helps. Another example of this in action may be found at <a href="http://www.slidesix.com">SlideSix.com</a>. Any one building ColdFusion-based services like this?