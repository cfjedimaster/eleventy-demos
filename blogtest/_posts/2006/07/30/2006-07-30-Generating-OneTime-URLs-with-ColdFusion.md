---
layout: post
title: "Generating One-Time URLs with ColdFusion"
date: "2006-07-30T14:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/30/Generating-OneTime-URLs-with-ColdFusion
guid: 1439
---

Drew asked the following question regarding "one-time" URLs:

<blockquote>
Is there a way to accomplish generating One-Time URLs with Coldfusion? I have found an <a href="http://www.devarticles.com/c/a/PHP/Generating-OneTime-URLs-with-PHP/">article</a> on how to do this with PHP. 
But this would be a handy feature for selling GIS maps for my work place. Any insight on how to do such a thing with CF? 
</blockquote>

Of course! Anything PHP can do ColdFusion can do quicker and easier! (Ok, before the hate mail comes in from the PHP crowd, please note that I'm kidding. Kinda.)
<!--more-->
In the article, the author describes creating a text file to store a set of valid unique tokens. If you pass in a valid token, you get access to the secret file. Let's talk about how this could be done in ColdFusion. Also, let's not limit our code to just one file but to any file you want protected.

First off - in general, I don't like storing information in text files when the information needs to be updated frequently. It is always a pain to deal with the locking when reading and writing, so in general, I tend to avoid it. Let's use a database table for our solution. I have to be a bit generic since obviously this is a made up solution, but hopefully it will give you an idea of how to proceed.

My table will have two fields. The first field is the unique token. I'm going to use ColdFusion's built in UUID support, so I need one 35 character string field. I will call this the token field. The other column will need to either be a filename, or pointer to the resource you want to serve up. To make things simple, I will call this the filename column.  Last but not least, the table itself will be called onetimeurls. (That's really a bad name, but hey, it's Sunday.)

So, I have table. How would I generate the UUID and store the record? Here is one way it could be done:

<code>
&lt;cfset token = createUUID()&gt;
&lt;cfset filename = "somefile"&gt;

&lt;cfquery datasource="somedsn"&gt;
insert into onetimeurls(token,filename)
values(
  &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#token#" maxlength="35"&gt;,
  &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#filename#" maxlength="255"&gt;)
&lt;/cfquery&gt;

&lt;cfset onetimeurl = "http://wwww.yourhost.com/get.cfm?token=#token#"&gt;

&lt;cfoutput&gt;
You may download your file here:&lt;br /&gt;
&lt;a href="#onetimeurl#"&gt;#onetimeurl#&lt;/a&gt;
&lt;/cfoutput&gt;
</code>

(Quick note: I typed this by hand so please forgive any typos.) Nothing too crazy here. I created the token with createUUID(). The filename value was hard coded, but obviously in a real application it would not be. The token/filename pair are then inserted into the database. Lastly, I created a URL pointing at a file named get.cfm. This could be emailed as well.

So, what would get.cfm do? 

<code>
&lt;cfif not structKeyExists(url, "token") or not isValid("uuid", url.token)&gt;
  &lt;cflocation url="/" addToken="false"&gt;
&lt;/cfif&gt;

&lt;cfquery name="validToken" datasource="somedsn"&gt;
select filename
from   onetimeurls
where  token = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#url.token#" maxlength="35"&gt;
&lt;/cfquery&gt;

&lt;cfif validToken.recordCount is 1&gt;

  &lt;cfquery datasource="somedsn"&gt;
  delete from onetimeurls
  where  token = &lt;cfqueryparam cfsqltype="cf_sql_varchar" value="#url.token#" maxlength="35"&gt;
  &lt;/cfquery&gt;

  &lt;cfheader name="Content-disposition" value="attachment;filename=#getFileFromPath(validtoken.filename)#"&gt;	
  &lt;cfcontent file="#validtoken.filename#" type="application/unknown"&gt;	

&lt;cfelse&gt;

  Sorry, but your URL did not work. Please be sure you 
  entered it correctly.	

&lt;/cfif&gt;
</code>

My file starts by doing some simple validation. URL.token must exist, and it must be a valid UUID. I then check to see if a corresponding record exists in the database. I retrieve the filename value since I will need it. If it does exist, I immidiately delete it (remember, this is a one time url feature) and then serve up the file using cfheader/cfcontent. If their token did not exist, I display a message to make sure they used the URL correctly.

Obviously there are different ways of doing this. It need not be a "one time url", but could allow for 5 downloads. In that case, you would just add a new column to store the number of times the file was downloaded. You could also add a "validTo" column with a datetime stamp. This would allow downloads until a certain date. Another option - add a password column. This way the file could be downloaded with the addition of a password. 

Anyone doing something like this? If so, please share.