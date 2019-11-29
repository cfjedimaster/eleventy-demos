---
layout: post
title: "ColdFusion and Form Fields with the Same Name"
date: "2014-02-25T07:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/02/25/ColdFusion-and-Form-Fields-with-the-Same-Name
guid: 5164
---

<p>
Many months ago I <a href="http://www.raymondcamden.com/index.cfm/2012/6/19/ColdFusion-10-Missing-Feature--Form-Fields-and-Arrays">blogged</a> about a great new feature in ColdFusion 10. It allowed you to take form fields with the same name and return them as an array. Why was this important? Consider the following example.
</p>
<!--more-->
<p>
Imagine you've got 2 form fields called "name". You enter "John,Smith" for the first one and "Joe" for the second. When you output form.name you get: "John,Smith,Joe". Ok, so tell me - what value was used for the first name? (Ok, so I just told you, but pretend you don't know.) You can't tell because ColdFusion returns all the value as a list and it just so happens that the first value was <i>also</i> a list. 
</p>

<p>
ColdFusion 10 fixes this by letting you adding <code>this.sameformfieldsasarray=true;</code> to your Application.cfc file. Now when you submit the form you get:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_2_25_14__6_55_AM.png" />
</p>

<p>
Perfect. Until you add another form field. Now imagine we have 3 name fields. Tell me, what do you expect this returns?
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_2_25_14__6_56_AM.png" />
</p>

<p>
If you said, "An array where element 1 is John,Smith and element 3 is Joe", you would be incorrect. Nope, you get this instead:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_2_25_14__6_57_AM.png" />
</p>

<p>
Even though the second name field had a value (an empty string is a value!), the array is "collapsed". This is <i>not</i> what I expected and I'd imagine this is not what most people expect. A bug report has been filed for this - <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3560964">3560964</a>. 
</p>

<p>
Unfortunately, it is the opinion of the engineering team that this makes sense, and matches backwards compatibility in terms of lists. I <strong>strongly</strong> disagree. But I hashed out my arguments in the bug report and I do not believe there is any chance of it changing. So whatever. The work around is to not use this feature and instead use the Java call: getPageContext().getRequest().getParameterMap(). 
</p>

<p>
I suggest <i>not</i> using this.sameFormFieldsAsArray as I think it will mislead you (or your coworkers too cool to read this blog, and others) into thinking that you will get one response when you get another. Just use the Java call and skip the Form scope. (Again, if you are wanting to use form fields with the same name.)
</p>