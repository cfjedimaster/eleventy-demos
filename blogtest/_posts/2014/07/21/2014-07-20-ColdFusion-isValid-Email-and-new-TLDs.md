---
layout: post
title: "ColdFusion, isValid, Email and new TLDs"
date: "2014-07-21T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/07/21/ColdFusion-isValid-Email-and-new-TLDs
guid: 5270
---

<p>
A few days ago a user reported an issue with my blog involving the comment form. Apparently he has an email address using one of the new TLDs (top level domains) that are cropping up, specifically "directory." I decided to do some testing to see how well ColdFusion supports these new TLDs.
</p>
<!--more-->
<p>
First off, it was a bit difficult to find out what has been added recently, but I did find a Wikipedia page with <i>everything</i> listed: <a href="http://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#ICANN-era_generic_top-level_domains">ICANN-era generic top-level domains</a>. I knew new TLDs were coming, but my god, I had no idea how many and how... weird some of them were. I mean, I guess it is kind of cool that "blue" is a TLD. But... ok, whatever. 
</p>

<p>
I decided to write a quick test script that would use isValid against some of these new TLDs. I wasn't going to try to type them, just a sample. Here is the script.
</p>

<pre><code class="language-javascript">&lt;cfscript&gt;
tlds = &quot;com,edu,directory,guru,gift,jobs,international,museum,name,sexy,social,tel,travel,ceo,cheap&quot;;

for(i=1; i&lt;=listLen(tlds); i++) {
	emailToTest = &quot;foo@foo.#listgetAt(tlds, i)#&quot;;
	writeoutput(&quot;Email: #emailToTest# isValid? #isValid('email',emailToTest)#&lt;br&gt;&quot;);
}

&lt;/cfscript&gt;</code></pre>

<p>
As you can see, it just a simple list of TLDs. I iterate over them, create a test email address, and run isValid against it. Here are the results:
</p>

Email: foo@foo.com isValid? YES<br>
Email: foo@foo.edu isValid? YES<br>
Email: foo@foo.directory isValid? NO<br>
Email: foo@foo.guru isValid? YES<br>
Email: foo@foo.gift isValid? YES<br>
Email: foo@foo.jobs isValid? YES<br>
Email: foo@foo.international isValid? NO<br>
Email: foo@foo.museum isValid? YES<br>
Email: foo@foo.name isValid? YES<br>
Email: foo@foo.sexy isValid? YES<br>
Email: foo@foo.social isValid? YES<br>
Email: foo@foo.tel isValid? YES<br>
Email: foo@foo.travel isValid? YES<br>
Email: foo@foo.ceo isValid? YES<br>
Email: foo@foo.cheap isValid? YES<br>

<p/>

<p>
So most of them passed, but a few, like directory and international, did not. I couldn't figure out why until I noticed that both were a bit long. Then I figured it out. ColdFusion was simply checking the <i>length</i> of the TLD. As a test, I tried "abcdefg" as a TLD and it worked. As soon as I tried "abcdefgh", it failed. I'm going to report this as a bug.
</p>

<p>
As it stands, this blog uses a UDF to check for email validity. (The code began back in ColdFusion 6, so I've got a lot of skeletons in my code closet.) The UDF I'm using uses regular expressions and uses a TLD checker of "Either 2-3 characters or in this hard coded list." Here is the code now:
</p>

<pre><code class="language-javascript">function isEmail(str) {
return (REFindNoCase("^['_a-z0-9-]+(\.['_a-z0-9-]+)*(\+['_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*\.(([a-z]{% raw %}{2,3}{% endraw %}){% raw %}|(aero|{% endraw %}asia{% raw %}|biz|{% endraw %}cat{% raw %}|coop|{% endraw %}info{% raw %}|museum|{% endraw %}name{% raw %}|jobs|{% endraw %}post{% raw %}|pro|{% endraw %}tel{% raw %}|travel|{% endraw %}mobi))$",arguments.str) AND len(listGetAt(arguments.str, 1, "@")) LTE 64 AND
len(listGetAt(arguments.str, 2, "@")) LTE 255) IS 1;
}
</code></pre>

<p>
My thinking is that I'll just modify that first clause in the TLD section to allow for 2 to 30 characters, with 30 being pretty arbitrary. I'm open to suggestions!
</p>