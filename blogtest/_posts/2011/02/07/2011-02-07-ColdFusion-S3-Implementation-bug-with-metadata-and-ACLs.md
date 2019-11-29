---
layout: post
title: "ColdFusion S3 Implementation bug with metadata and ACLs"
date: "2011-02-07T14:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/07/ColdFusion-S3-Implementation-bug-with-metadata-and-ACLs
guid: 4110
---

This find comes to me by J. J. Blodgett. He found the bug, asked me to confirm it, and I've been able to. It is - from what I can tell - pretty serious if you make use of Amazon S3 support in ColdFusion 9.0.1. The gist is this: Any call to storeSetMetadata on a file stored in S3 will <b>remove</b> ACL information about the file. Here is an example that demonstrates the issue. Note that I've removed my security tokens.
<!--more-->
<p>

<code>
&lt;cfset dir = "s3://s:f@s3.coldfusionjedi.com"&gt;
&lt;cfset files = directoryList(dir)&gt;
&lt;cfdump var="#files#"&gt;

&lt;cfset acl = storegetacl(files[3])&gt;
&lt;cfdump var="#acl#"&gt;

&lt;cfset perm = structnew()&gt;
&lt;cfset perm.group = "all"&gt;
&lt;cfset perm.permission = "read"&gt;

&lt;cfset perms = []&gt;
&lt;cfset perms[1] = acl[1]&gt;
&lt;cfset perms[2] = perm&gt;

&lt;cfset storeSetAcl(files[3], perms)&gt;

&lt;cfset md = {% raw %}{"Price"=99}{% endraw %}&gt;
&lt;cfset storeSetMetadata(files[3], md)&gt;

&lt;hr&gt;
&lt;cfset acl = storegetacl(files[3])&gt;
&lt;cfdump var="#acl#"&gt;
</code>

<p>

As you can see, I get a list of files and then return ACL information about the 3rd one. (There is nothing special about the 3rd one. For the directory of files I was testing with I used that file as my tester.) A new permission for everyone to have read access is added and set to the file. Next, metadata for price is added. When the storeGetAcl call is run again the ACL is back to what it was before the metadata change. 

<p>

This isn't simply a caching bug for the request as I had though. I broke my code up so that on one request it updated the ACL and in another it changed the metadata. Even in that attempt the ACL was reset. 

<p>

Unfortunately there is no real fix for this. Luckily if you reverse your calls (set metadata then set ACL changes) it works fine. Of course, I would be concerned about making <i>any</i> metadata change. For now I'd recommend getting the ACL, doing your metadata change, and then re-setting your existing ACL right back into the file. JJ filed a bug report for the issue that you can find here: <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=86224">http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=86224</a>