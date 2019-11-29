---
layout: post
title: "Generating EML files with ColdFusion"
date: "2011-09-16T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/16/Generating-EML-files-with-ColdFusion
guid: 4367
---

A few weeks back, a reader came to me with an interesting question. He knew how to use ColdFusion to work with email, cfpop and cfmail make that easy enough. But he also wanted the ability to download mail to the user's desktop. That should be easy, right? Take the text and just stream it to the user. But that's not what he meant. He wanted the ability to download a .eml file. This would be supported in the end user's desktop mail client like Outlook or Thunderbird. I did some research into this and found out something interesting. Java itself has the ability to generate dynamic eml files. Here's a quick demo I created. It isn't fully feature (and doesn't support attachments at all), but works well.
<!--more-->
<p>

To begin, let's simply <i>get</i> the email and display a nice list. We will use a download link to provide a way to get a particular message.

<p>

<code>

&lt;cfpop action="getHeaderOnly" name="messages" 
		server="pop.aol.com" username="bob.camden@aol.com"
		password="nope" &gt;

&lt;h2&gt;Mail Test&lt;/h2&gt;

&lt;cfif messages.recordCount gt 0&gt;

	&lt;table width="100%" border="1"&gt;
		&lt;tr&gt;
			&lt;th&gt;From&lt;/th&gt;
			&lt;th&gt;Subject&lt;/th&gt;
			&lt;th&gt;Sent&lt;/th&gt;
			&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;cfoutput query="messages"&gt;
			&lt;tr&gt;
				&lt;td&gt;#from#&lt;/td&gt;
				&lt;td&gt;#subject#&lt;/td&gt;
				&lt;td&gt;#dateFormat(date)# #timeFormat(date)#&lt;/td&gt;
				&lt;td&gt;&lt;a href="?download=#urlEncodedFormat(uid)#"&gt;Download&lt;/a&gt;&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/cfoutput&gt;
	&lt;/table&gt;

&lt;cfelse&gt;

	Sorry - no mail in the account.

&lt;/cfif&gt;
</code>

<p>

Nothing crazy there. Do note though that my download link makes use of the UID value. We will be fetching an individual email later and while cfpop allows us to get a message by number too, a UID is normally prefered. If you fetch by number, and the mailbox changed, then your results will not be correct. (Note: In my testing I ran across an issue where a UID failed to get a message but a number did not. I'll be doing more testing to see if I can get a precise bug to report.) Here's the result in my usual, lovely, design:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip185.png" />

<p>

Ok, so what happens when you click? I begin by getting just the one message.

<p>

<code>
&lt;cfpop action="getAll" name="message" 
	server="pop.aol.com" username="bob.camden@aol.com"
	password="foo"
	uid="#url.download#"
	 &gt;
</code>

<p>

Obviously, the server/username/password values would be dynamic. Now, let's get into the Java.

<p>

<code>
&lt;cfscript&gt;
p = createObject("java", "java.util.Properties").init();
s = createObject("java", "javax.mail.Session").getInstance(p);
	
m = createObject("java", "javax.mail.internet.MimeMessage").init(s);

m.setFrom(createObject("java", "javax.mail.internet.InternetAddress").init(message.from));
m.setSubject(message.subject);

if(len(message.htmlBody)) m.setText(message.htmlBody, "UTF-8", "html");
else m.setText(message.body);

toField = createObject("java", "javax.mail.Message$RecipientType").TO;

m.setRecipients(toField, [createObject("java", "javax.mail.internet.InternetAddress").init(message.to)]);

tempFile = getTempFile(getTempDirectory(), "msg");
fis = createObject("java", "java.io.FileOutputStream").init(tempFile);
m.writeTo(fis);
fis.close();
&lt;/cfscript&gt;
</code>

<p>

Even if you've never seen these classes before, you can take a good guess as to what is happening. I create a blank message and then populate the various values. Note that I do only HTML or Plaintext, whereas a real message could contain both. I also don't handle CC or BCC. That should be trivial to add to the picture. Finally, let's download this beast:

<p>

<code>
&lt;cfheader name="Content-disposition" value="attachment;filename=#message.subject#.eml"&gt;
&lt;cfcontent type="image/jpeg" file="#tempFile#"&gt;
</code>

<p>

And here is the file opened in Windows Mail:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip186.png" />

<p>

And the same in Thunderbird:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip187.png" />

<p>

Pretty interesting, eh? My thanks to Lawtrac and Jim Harris for spurring all of this. Here is the complete code template. You will need to change the server information.

<p>

<code>
&lt;!--- I really, really, REALLY hope we fix this for Zeus ---&gt;
&lt;cfset javaSystem = createObject("java", "java.lang.System") /&gt;
&lt;cfset jProps = javaSystem.getProperties() /&gt;
&lt;cfset jProps.setProperty("mail.pop3.socketFactory.class", "javax.net.ssl.SSLSocketFactory") /&gt;
&lt;cfset jProps.setproperty("mail.pop3.port",995) /&gt;
&lt;cfset jProps.setProperty("mail.pop3.socketFactory.port", 995) /&gt;

&lt;cfif structKeyExists(url, "download")&gt;
	&lt;cfpop action="getAll" name="message" 
		server="pop.aol.com" username="bob.camden@aol.com"
		password="foo"
		uid="#url.download#"
		 &gt;

	&lt;cfscript&gt;
	p = createObject("java", "java.util.Properties").init();
	s = createObject("java", "javax.mail.Session").getInstance(p);
	
	m = createObject("java", "javax.mail.internet.MimeMessage").init(s);

	m.setFrom(createObject("java", "javax.mail.internet.InternetAddress").init(message.from));
	m.setSubject(message.subject);

	if(len(message.htmlBody)) m.setText(message.htmlBody, "UTF-8", "html");
	else m.setText(message.body);

	toField = createObject("java", "javax.mail.Message$RecipientType").TO;

	m.setRecipients(toField, [createObject("java", "javax.mail.internet.InternetAddress").init(message.to)]);

	tempFile = getTempFile(getTempDirectory(), "msg");
	fis = createObject("java", "java.io.FileOutputStream").init(tempFile);
	m.writeTo(fis);
	fis.close();
	&lt;/cfscript&gt;

	&lt;cfheader name="Content-disposition" value="attachment;filename=#message.subject#.eml"&gt;
	&lt;cfcontent type="image/jpeg" file="#tempFile#"&gt;

	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfpop action="getHeaderOnly" name="messages" 
		server="pop.aol.com" username="bob.camden@aol.com"
		password="foo" &gt;

&lt;h2&gt;Mail Test&lt;/h2&gt;

&lt;cfif messages.recordCount gt 0&gt;

	&lt;table width="100%" border="1"&gt;
		&lt;tr&gt;
			&lt;th&gt;From&lt;/th&gt;
			&lt;th&gt;Subject&lt;/th&gt;
			&lt;th&gt;Sent&lt;/th&gt;
			&lt;td&gt;&nbsp;&lt;/td&gt;
		&lt;/tr&gt;
		&lt;cfoutput query="messages"&gt;
			&lt;tr&gt;
				&lt;td&gt;#from#&lt;/td&gt;
				&lt;td&gt;#subject#&lt;/td&gt;
				&lt;td&gt;#dateFormat(date)# #timeFormat(date)#&lt;/td&gt;
				&lt;td&gt;&lt;a href="?download=#urlEncodedFormat(uid)#"&gt;Download&lt;/a&gt;&lt;/td&gt;
			&lt;/tr&gt;
		&lt;/cfoutput&gt;
	&lt;/table&gt;

&lt;cfelse&gt;

	Sorry - no mail in the account.

&lt;/cfif&gt;
</code>