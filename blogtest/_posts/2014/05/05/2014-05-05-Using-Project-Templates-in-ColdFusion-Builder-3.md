---
layout: post
title: "Using Project Templates in ColdFusion Builder 3"
date: "2014-05-05T16:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/05/05/Using-Project-Templates-in-ColdFusion-Builder-3
guid: 5217
---

<p>
One of the interesting new features in ColdFusion Builder is the new project template system. This lets you create a project with files automatically laid out. Unfortunately, the <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/Mobile+Templates">docs</a> only discuss the <i>mobile</i> version of this (i.e., what you see when you make a new mobile project). If you do not plan on building cfclient projects (ahem), then you may think this feature doesn't apply to you. Luckily, that isn't the case at all.
</p>
<!--more-->
<p>
You can easily create templates for "regular" projects as well. To do so, first find your ColdFusion Builder install and open the templates folder. There is a chance you may only see one subdirectory: mobile. That's all I had. But if you go to create a new project, the editor will quickly lay out a new subdirectory, server. I don't think you even have to create the project completely, just start the process. To me, this is a bit of a bug, the folder should be there anyway, but just keep in mind you may or may not see it. If you don't see it, I recommend doing what I did - start the new project creation process. 
</p>

<p>
Under server will be two more folders: system, and user. System will be empty. User is where you will create your templates. Template creation is a bit awkward. You don't just create a template. Rather you create a group of templates. So for example, I may have a group called "HTML Unicorn" for all my different front-end heavy applications. I may have another group just for Frameworks, where I have a template for FW/1, Model-Glue, ColdBox, etc. 
</p>

<p>
To define your group, just create a subdirectory under system/user. I called mine Mine. Yes, I did. You then need to create a text file called config.xml. This will define both the group and enumerate the different templates. Here is the one I built.
</p>

<pre><code class="language-markup">&lt;template name=&quot;Ray's Templates&quot;&gt;
	&lt;description&gt;
		These are my templates. There are many like it, but these are mine.
	&lt;/description&gt;
	&lt;types&gt;
		&lt;type value=&quot;Blank&quot;&gt;
			&lt;description&gt;
				A blank template with no damn index.cfm
			&lt;/description&gt;
		&lt;/type&gt;
		&lt;type value=&quot;Framework One&quot;&gt;
			&lt;description&gt;
				Framework One (v2.2) becuz it is teh awesome.
			&lt;/description&gt;
		&lt;/type&gt;
	&lt;/types&gt;
&lt;/template&gt;
</code></pre>

<p>
As you can see, I've got a top level description for my group. It doesn't really matter what you put here unless you plan on sharing with others. Then I have two types. The first, Blank, is just that, a blank template. CFB uses the value "Blank" as the directory to look into for source code. So in my case, I've got a subdirectory called Blank. I then have a second one for Framework One. I downloaded the bits and copied the skeleton application into it.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s35.png" />
</p>

<p>
That's really all there is to it. Just remember that the value in the XML field has to match the folder name. I originally used "Framework/One" for the value and realized that would probably make CFB have a fit. Here is my template showing up in the new project UI:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s112.png" />
</p>

<p>
And here is the project it laid out - nicely laid out with FW/1 files.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s212.png" />
</p>

<p>
I just realized that the FW/1 skeleton does <strong>not</strong> actually copy the FW/1 CFC. I'm assuming the idea is that it relies on a server-wide mapping for it. I'm going to copy it into my template now so I don't have to worry about it.
</p>

<p>
Finally, I should point out that - technically - this has been possible for some time now. Since CFB2, you could write an extension that tied to the project UI and did the exact same thing this does. Actually a heck of a lot more. You could write custom code to seed a project, initialize values, ring some cowbell, and go crazy. If you want something simpler though this is a real nice option.
</p>