---
layout: post
title: "Ask a Jedi: ColdFusion Components and Validation"
date: "2005-08-30T22:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/30/Ask-a-Jedi-ColdFusion-Components-and-Validation
guid: 744
---

Brad asks the following:
<blockquote>
Hi Ray,

I've been switching to a more OO approach to CF.  One thing I'm having a hard time figuring out is data validation in a CFC.  

For example, let's say I have a DAO that handles CRUD functions.  Most of the functions in the DAO get data from passing an object.  What I need to know is where to do the validation.

Do I validate the data when it is passed to the bean or do I validate the data when it is passed to the DAO?  Do I need to validate in both and how?

I've seen quite a few examples of working with beans, DAOs and data gateways, but they were all simple explanations that did not do any type of validation.
</blockquote>

Luckily for me, OO-type questions really only have one simple answer that I'm sure we can all agree upon. Oh, and the moon landing was faked and Al Gore invented the internet. I'm sorry to tell you this, Brad, but there are many, <i>many</i> answers to this. I will attempt to answer it, but expect about 500 or so comments to follow saying that I'm either wrong, or close, or not in the ballpark. Of course I'm joking (kinda), but it does illustrate the point that it when it comes to object oriented programming, and ColdFusion in general, there are always more than one answer.

So before I answer, let me add that I do not consider myself an "OO" expert. I'm <i>beginning</i> to grasp some of the concepts. I'm <i>beginning</i> to get into frameworks (<a href="http://www.model-glue.com">Model-Glue</a>). When it comes to building applications with ColdFusion Components, I've tried many things, and I continue to play around with what I consider to be "Best Practice." 

So, enough messing around. Lets just answer the darn question. The way I work with CFCs now is based on a method I saw in a Sean Corfield presentation a few months ago. I'm not sure who the original author was, so I'll just say Bob. I've used Bob's method for a while now, and I'm mostly happy with it, but I'm considering making changes in future applications.

In my application, I'll typically have three CFCs per type. By type I mean a type of content. So for example, at the <a href="http://mg.cflib.org">Model-Glue version of CFLib</a>, I have 3 CFCs for the "Resource" type, which represents one resource for the site. My 3 CFCs are a Bean, a DAO (Data Access Object), and a Gateway. My DAO handles the CRUD (Create, Read, Update, and Delete) of single instances. It typically takes and returns Bean instances. My Bean CFC will represent one instance of the object. It will have get and set methods for each of the properties of the type. The Gateway CFC handles everything else, like getting all of the instances, utility functions, and other methods. So where do I validate? In the Bean CFC. What I'll typically do, in an edit form for example, is something along the lines of the following <b>pseudo</b>-code:

<div class="code">//get empty Bean<br>
resource = application.ResourceDAO.read(<FONT COLOR=BLUE>0</FONT>)<br>
resource.setName(form.name);<br>
resource.setGoo(form.goo);<br>
<br>
errors = resource.validate();<br>
<br>
if(arrayLen(errors)) {<br>
&nbsp;&nbsp;&nbsp;display the errors;<br>
} else {<br>
&nbsp;&nbsp;&nbsp;application.ResourceDAO.create(resource);<br>
}</div>

What I've done above is simple. First I create an empty instance of the Bean. (The whole read(0) thing is something I don't like.) I then set the values. Lastly I call the validate method. This method does whatever makes since. It may just ensure that name and goo have values. It may ensure name has more than 20 characters. The important thing is that the validation logic is <i>not</i> kept in the form, but inside the CFC. The validation routine will check everything it needs to, and return an array of error messages. If the array is empty, then everything was ok with the bean instance.

Make sense? There is <b>no</b> way in heck I can cover everything about OO or Beans/DAOs/Gateway objects in one blog posting. For some very good posts on the subject, and much more in depth (as well as more intelligent), I recommend a visit to Joe Rinehart's <a href="http://clearsoftware.net/client/index.cfm">blog</a>. Another resource is the <a href="http://www.cfczone.org/listserv.cfm">CFCDev</a> mailing list.