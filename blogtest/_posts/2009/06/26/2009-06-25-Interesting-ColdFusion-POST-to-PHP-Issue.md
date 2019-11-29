---
layout: post
title: "Interesting ColdFusion POST to PHP Issue"
date: "2009-06-26T10:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/06/26/Interesting-ColdFusion-POST-to-PHP-Issue
guid: 3408
---

I shared a few emails with a reader last week that concerned an interesting issue with ColdFusion POSTs (form submissions) to PHP code. I thought I'd share what we found and see if anyone else has seen this behavior as well. PHP developers are welcome to post their comments as well, although I know it's hard times for them with their language dieing and all that. Anyhoo....


The reader, Anthony, created a simple ColdFusion page to perform a POST and return the result:
<!--more-->
<code>
&lt;cfhttp method="POST" url="http://test.local/test.php"&gt;
&lt;cfhttpparam
type="formField" name="msg" value="I \ am"&gt;
&lt;/cfhttp&gt;
&lt;cfoutput&gt;#cfhttp.filecontent#&lt;/cfoutput&gt;
</code>

Note the \ in the string passed to the msg form field.

His PHP page did:

<code>
&lt;?php
echo $_POST['msg'];
?&gt;
</code>

I modified his ColdFusion code to also perform the same POST to a ColdFusion page. That page did:

<code>
&lt;cfoutput&gt;#form.msg#&lt;/cfoutput&gt;
&lt;cfdump var="#getHTTPRequestData()#"&gt;</code>

It isn't exactly the same as the PHP code. I output the form variable as well as the HTTP request structure.

So what happens? PHP outputs:

<blockquote><p>
I \\ am
</p></blockquote>

ColdFusion outputs:

<blockquote><p>
I \ am
</p></blockquote>

So, err, what the heck? According to the docs, all values sent in the POST are URLEncoded. I know that ColdFusion automatically decodes URL parameters, so I assume its doing it for Form vars as well which would explain why it had no problem displaying form.msg, but PHP showed it escaped. 

I tried setting encoding=false on the cfhttpparam tag but it didn't help any in PHP. I then looked up "URLDecode" in PHP. I wasn't too optimistic about this as: I \\ am didn't look like a normal URL encode. PHP does in fact have such a function, but it didn't help.

Finally I tried one more thing. I URLEncoded the value myself:

<code>
&lt;cfhttpparam type="formField" name="msg" value="#urlEncodedFormat('I
\ am')#" encoded="true" &gt;
</code>

and decoded it in PHP:

<code>
&lt;?php
echo urldecode($_POST['msg']);
?&gt;
</code>

And that worked. But then Anthony came back to me with the real answer. Apparently PHP has a feature called Magic Quotes. It automatically escapes this stuff because it assumes you are sending it to a database. ColdFusion will also auto escape strings, but it's smart enough to only do it when actually inserting into a database. Apparently this is something being removed from PHP, and Anthony wrote up on a note on this at his site: <a href="http://imified.tenderapp.com/faqs/building-imified-bots/backslashses-are-inserted-before-certain-characters-when-my-bot-replies">Knowledge Base: Backslashses are inserted before certain characters when my bot replies</a>

So as I said earlier - what the heck?!?! I don't do much work with PHP, and when I have, it wasn't integrated with ColdFusion, but I assume this is expected behavior? Anyone else run into this?