---
layout: post
title: "Model-Glue CFlib Update"
date: "2005-08-11T11:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/11/ModelGlue-CFlib-Update
guid: 689
---

I've updated the Model-Glue version of CFLib. You can find it here: <a href="http://mg.cflib.org">http://mg.cflib.org</a>

What's new in this release? Not much. A few more of the static pages are done. The main "feature" is that you can now submit a resource. Woohoo! Actually, this was a bit difficult. It was the first time I did form validation in Model-Glue. To be honest, it felt a bit akward. I had a form view in one file, form validation in a controller, data validation in a bean, and the use of a Data Access Object (DAO) to save the data. It was more than a little  bit difficult to grok the process with all these balls in the air.

Now that I'm done with it though, it makes more sense. I also like how my form is a lot slimmer. It's basically just the text.  I know this is a reoccuring theme in my posts, but the seperation of all the pieces simply gives me the warm fuzzies. If for some reason I I decide I hate Model-Glue, I would be able to re-use almost every line of code most likely. That's a "Good Thing(tm)".

<b>Just to be clear...</b> Feel free to test out the <a href="http://mg.cflib.org/submit">submit</a> form on the new version of CFLib, but be aware that your data will <b>not</b> be preserved when I do my next update.