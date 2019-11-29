---
layout: post
title: "Creating a Mailing List in ColdFusion (Part 3)"
date: "2006-05-25T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/25/Creating-a-Mailing-List-in-ColdFusion-Part-3
guid: 1295
---

Welcome to the third entry on my series about creating a mailing list application in ColdFusion. The previous entries are linked to at the bottom of this article. In this entry I'm going to talk about the actual mail tool (and it's about time). In general, this is a pretty simple tool, but I do have one neat trick in it I think you will like. As with the <a href="http://ray.camdenfamily.com/index.cfm/2006/5/23/Creating-a-Mailing-List-in-ColdFusion-Part-2">previous entry</a>, this script should be considered an "Admin Only" tool and should be placed behind a protected folder. Here is the script:
<!--more-->
<code>
&lt;!--- Just used to tell admin how many people will get the email ---&gt;
&lt;cfset members = application.maillist.getMembers()&gt;

&lt;cfif members.recordCount is 0&gt;
	&lt;p&gt;
	Sorry, but your mailing list does not have any subscribers. It is sad to be lonely.
	&lt;/p&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;

&lt;cfparam name="form.subject" default=""&gt;
&lt;cfparam name="form.body" default=""&gt;
&lt;cfset errors = ""&gt;

&lt;cfif structKeyExists(form, "send")&gt;

	&lt;cfif not len(trim(form.subject))&gt;
		&lt;cfset errors = errors & "You must include a subject.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;

	&lt;cfif not len(trim(form.body))&gt;
		&lt;cfset errors = errors & "You must include a body.&lt;br /&gt;"&gt;
	&lt;/cfif&gt;
	
	&lt;cfif errors is ""&gt;
		&lt;cfloop query="members"&gt;
			&lt;cfset theBody = form.body&gt;
			&lt;!--- replace columns ---&gt;
			&lt;cfloop index="col" list="#members.columnList#"&gt;
				&lt;cfset theBody = replaceNoCase(theBody, "{% raw %}%" & col & "%{% endraw %}", members[col][currentRow], "all")&gt;
			&lt;/cfloop&gt;
			&lt;cfmail to="#email#" from="#application.maillistfrom#" subject="#form.subject#"&gt;#theBody#&lt;/cfmail&gt;
		&lt;/cfloop&gt;

		&lt;!--- remove values ---&gt;
		&lt;cfset form.subject = ""&gt;
		&lt;cfset form.body = ""&gt;
		&lt;!--- show confirmation ---&gt;
		&lt;p&gt;
		&lt;b&gt;Your email has been sent.&lt;/b&gt;
		&lt;/p&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
&lt;p&gt;
Please enter your mail in the form below. It will be mailed to #members.recordCount# member(s).
&lt;/p&gt;

&lt;cfif errors is not ""&gt;
&lt;p&gt;
&lt;b&gt;#errors#&lt;/b&gt;
&lt;/p&gt;
&lt;/cfif&gt;

&lt;form action="sendmail.cfm" method="post"&gt;
&lt;b&gt;Subject:&lt;/b&gt; &lt;input type="text" name="subject" value="#form.subject#"&gt; &lt;br /&gt;
&lt;textarea name="body" cols="40" rows="10"&gt;#form.body#&lt;/textarea&gt;&lt;br /&gt;
&lt;input type="submit" name="send" value="Send Message"&gt;
&lt;/form&gt;
&lt;/cfoutput&gt;
</code>

A majority of this page is a simple form, so let me focus on the parts that are interesting. First off - it makes sense to add a simple sanity check before allowing the administrator to send the mail. This is done here:

<code>
&lt;cfset members = application.maillist.getMembers()&gt;

&lt;cfif members.recordCount is 0&gt;
	&lt;p&gt;
	Sorry, but your mailing list does not have any subscribers. It is sad to be lonely.
	&lt;/p&gt;
	&lt;cfabort&gt;
&lt;/cfif&gt;
</code>

You can't always rely on the common sense of your users, even your administrator users. 

So outside of this, everything else is a simple form. But pay attention to how I send the email. Here is the relevant code portion:

<code>
&lt;cfloop query="members"&gt;
	&lt;cfset theBody = form.body&gt;
	&lt;!--- replace columns ---&gt;
	&lt;cfloop index="col" list="#members.columnList#"&gt;
		&lt;cfset theBody = replaceNoCase(theBody, "{% raw %}%" & col & "%{% endraw %}", members[col][currentRow], "all")&gt;
	&lt;/cfloop&gt;
	&lt;cfmail to="#email#" from="#application.maillistfrom#" subject="#form.subject#"&gt;#theBody#&lt;/cfmail&gt;
&lt;/cfloop&gt;
</code>

So what is going on here? I'm looping over every record from the members query. If you remember, this is the record set containing all my subscribers. This is a query that contains, right now, an email and token field. As I mentioned back in the <a href="http://ray.camdenfamily.com/index.cfm/2006/5/22/Creating-a-Mailing-List-in-ColdFusion-Part-1">first entry</a>, a "real" site may have more fields, like name, age, etc. What I've done is built code to let the admin use "tokens" in the email. If the admin enters something like this:

<blockquote>
Hi, {% raw %}%name%{% endraw %}
</blockquote>

And name exists as a column in the query, it will automatically be replaced with the value from the members query. This lets the administrator write a more personalized email. It will also let us set up the unsusbscribe functionality that I'll be talking about in the next entry. As before, you can find the code attached to the entry.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fmailinglist2%2Ezip'>Download attached file.</a></p>