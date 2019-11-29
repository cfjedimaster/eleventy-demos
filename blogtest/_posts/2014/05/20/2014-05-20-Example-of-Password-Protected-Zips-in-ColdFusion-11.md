---
layout: post
title: "Example of Password Protected Zips in ColdFusion 11"
date: "2014-05-20T18:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/05/20/Example-of-Password-Protected-Zips-in-ColdFusion-11
guid: 5227
---

<p>
For a demo that didn't happen, I wrote a quick example of using passwords with <a href="https://wikidocs.adobe.com/wiki/display/coldfusionen/cfzip">cfzip</a> in ColdFusion 11. The idea behind the demo was that the user had asked for a set of files (in this case, a hard coded folder of kitten pictures - because - kittens). The password will be randomly selected, used in the zip operation, and then given to the user. The code is rather simple, so let's look at the complete template and then I'll break it down a bit.
</p>
<!--more-->
<pre><code class="language-markup">&lt;!---
Demo:
Generate a zip file from our assets folder and password protect it.
---&gt;

&lt;cfinclude template=&quot;udfs.cfm&quot;&gt;

&lt;!---
First, a temp file/loc
---&gt;
&lt;cfset tmpFile = expandPath(&quot;./temp&quot;) &amp; &quot;/&quot; &amp; createUUID() &amp; &quot;.zip&quot;&gt;

&lt;!---
Our source directory...
---&gt;
&lt;cfset sourceDir = expandPath(&quot;./assets&quot;)&gt;

&lt;!--- 
Now generate a random password.
---&gt;
&lt;cfset password = generatePassword(7)&gt;

&lt;!---
Now ZIP THIS LIKE A ROCK STAR!
---&gt;
&lt;cfzip action=&quot;zip&quot; file=&quot;#tmpFile#&quot; source=&quot;#sourceDir#&quot; 
	   password=&quot;#password#&quot; encryptionAlgorithm=&quot;AES-256&quot;&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Your zip file of kitten pictures has been created. Download via
the link below. To unzip your archive, use this password: #password#
&lt;/p&gt;

&lt;p&gt;
&lt;a href=&quot;temp/#listLast(tmpFile, &quot;/&quot;)#&quot;&gt;Zip File&lt;/a&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;
</code></pre>

<p>
Before I continue, let me just get the expected comments about frameworks and stuff out of the way. Normally I would <strong>not</strong> have everything in one CFM. Hopefully folks understand that. Ok, carrying on...
</p>

<p>
The first set of code includes a UDFs file. The UDFs file will be present in the attachment. It contains <a href="http://cflib.org/udf/generatepassword">GeneratePassword</a> from CFLib, which just - as you can probably guess - generates a random password. 
</p>

<p>
Next we generate a random file name based on a UUID. While we <i>can</i> stream binary data to the user, in this case I need to tell the user their password too so I need to have HTML in my response instead. You could actually email the password instead, but this seemed more direct. Note that if I were truly creating files like this I'd want to have a scheduled task that cleaned up the files.
</p>

<p>
The next line is simply a pointer to the folder we're zipping. This is the folder of kitten pictures. I sourced this from a folder of 88 pictures of kittens. I'm not kidding. The attachment will only have a couple of them. 
</p>

<p>
The next step is to generate the password. I selected seven for the number of characters because it seemed reasonable enough.
</p>

<p>
Finally we get to the hot zipping action. For the most part this is no different than using cfzip in the past, but notice now we pass both the password and an encryption algorithm to the tag. That's it really. We end up outputting a message to the user that includes their password and provide a link to the download.
</p>

<p>
That's it! One word of caution if you try this on OS X. The default Finder ability to unzip files does <strong>not</strong> work with password protected zips. I installed <a href="https://itunes.apple.com/us/app/the-unarchiver/id425424353?mt=12">The Unarchiver</a> and it worked great.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fzip%{% endraw %}2Ezip'>Download attached file.</a></p>