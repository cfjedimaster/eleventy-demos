---
layout: post
title: "Ask a Jedi: Contact Form questions"
date: "2008-01-15T13:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/15/Ask-a-Jedi-Contact-Form-questions
guid: 2595
---

Today I have another question from Tony:

<blockquote>
<p>
Anyway, a very simple scenario that I'm sure has a very
simple solution:  I'm building many contact forms for the company I work for (there are multiple sites under the parent company) so I'm trying to be as modular as possible with my approach.  

Basically I just wanted to ask where you might recommend I store the cfparams that define the form variables first
and foremost and then where I might also store the validation code that I already have written. I just want to break it away from the contact pages directly. Would these bits of code be candidates for UDFs?  Or would I put them in CFCs? Either way, would they need to be separate (i.e. the cfparam form
variable definitions separated in a different function or file from the validation code)?
</p>
</blockquote>

Actually I don't think form handling is simple at all! I mean not in the way you describe it when you have a large number of forms. A contact form is about as simple a process as you can get - but when you start talking about possibly tying in multiple forms like that, my eyes begin to glaze over.
<!--more-->
But let's try to break this down a bit. Part of your question is simpler: Where to store the cfparams. In general my forms will cfparam right on top. So if I'm asking for a name, email address, and set of comments, my page will start with something like the following:

<code>
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.email" default=""&gt;
&lt;cfparam name="form.comments" default=""&gt;
</code>

You then speak about validation code. Now, for stuff like checking email addresses, I see no point in abstracting that since ColdFusion makes that all of one line of code:

<code>
&lt;cfif not isValid("email", form.email)&gt;
</code>

It seems like any other validation you may use that wouldn't fall into this category would probably be very specific to the form at hand. Maybe one contact form is specifically for jobs and you want to ask for a birthdate. (Yes, I know that is against the law. Work with me.) While ColdFusion has simple logic for checking dates, you would have to write your own logic to handle "18 years or older." If you did need this for multiple forms, then I'd probably just build a simple UDF for it.

Another place you could nicely abstract stuff out would be emailing. While mailing is rather simple in CF (one tag), you probably want to store mail values in the application scope. By mail values I mean who gets emails, mail server values, etc. If you wanted to get really fancy, you could abstract that all into a Mail CFC to allow for something like this:

<code>
&lt;cfsavecontent variable="body"&gt;
Comments from: #form.name# (#form.email#)
Comments:
#form.comments#
&lt;/cfsavecontent&gt;
&lt;cfset application.mailService(application.generalcommentsaddress, body)&gt;
</code>

But that may be overdoing it a bit.

Taking this further - what about making <i>really</i> abstract forms? You could do this. Back many years ago I had a basic form custom tag that let me generate simple forms from custom tags. It handled displaying the form, validating, emailing, and showing a thank you. While this was cool to build, I haven't really felt a need for it for quite some time.

As always - I'm curious as to what others think, as I'm worried I may be reading his intents wrong.