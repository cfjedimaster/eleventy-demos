---
layout: post
title: "Model-Glue Short URLs on the Cheap"
date: "2006-11-07T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/07/ModelGlue-Short-URLs-on-the-Cheap
guid: 1638
---

I've blogged before about short, SES style URLs and what I use. (To summarize - I'd either recommend URL Rewriting in Apache or <a href="http://cheeso.members.winisp.net/IIRF.aspx">IIRF</a> for IIS.) What if you can't use a web server side solution? You're left with using a solution I used for BlogCFC, namely appending values after the file name and using CGI.PATH_INFO to parse it. Here is a simple example.
<!--more-->
CGI.PATH_INFO is a CGI variable that will represent any information found after the filename in the URL. Look at the URL in the browser. Notice the index.cfm is followed by a / and then various bit of information. What I did for BlogCFC was create a specific pattern, and then wrote some code to parse that pattern and load various groups of blog entries (or A blog entry) based on the value. I could have also done something a bit more generic of the form:

/name1/var1/name2/var2

In this pattern, I've changed name1=var1&name2=var2 to a simpler list of name/value pairs. We can use the same pattern with Model-Glue, but since Model-Glue uses an event value, we need to preface it with the event to run. So the pattern I will use is:

/event/name1/var1/name2/var2

I opened up my Application.cfm file and added the following code:

<code>
&lt;!--- get the info ---&gt;
&lt;cfif len(trim(cgi.path_info))&gt;
	&lt;!--- From Michael Dinowitz ---&gt;
	&lt;cfset urlVars=reReplaceNoCase(trim(cgi.path_info), '.+\.cfm/? *', '')&gt;
	&lt;cfif urlVars is not "" and urlVars is not "/"&gt;
		&lt;!--- remove first / ---&gt;
		&lt;cfif left(urlVars, 1) is "/"&gt;
			&lt;cfset urlVars = right(urlVars, len(urlVars)-1)&gt;
		&lt;/cfif&gt;
		&lt;!--- Event is first item ---&gt;
		&lt;cfset url.event = listFirst(urlVars, "/")&gt;
		&lt;!--- strip it off ---&gt;
		&lt;cfset urlVars = listRest(urlVars, "/")&gt;
		&lt;!--- now build name/val pairs ---&gt;
		&lt;cfloop index="x" from="1" to="#listlen(urlVars,"/")#" step="2"&gt;
			&lt;cfset name = listGetAt(urlVars, x, "/")&gt;
			&lt;cfif listLen(urlVars, "/") gte x+1&gt;
				&lt;cfset value = listGetAt(urlVars, x+1, "/")&gt;
			&lt;cfelse&gt;
				&lt;cfset value = ""&gt;
			&lt;/cfif&gt;
			&lt;cfset url[name] = value&gt;
		&lt;/cfloop&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;
</code>

I'm not going to pick over this too much as you can see it is just string parsing. Basically I get the information after the /, grab the event as the first item, and if anything else is left than it is treated as name/value pairs. Also note that I support a name without a value. This would be useful for passing a "flag" type setting. 

As a practical example, instead of using this URL:

/index.cfm?event=loadArticle&id=5

I can use this:

/index.cfm/loadArticle/id/5

For print format, I could use this:

/index.cfm/loadArticle/id/5/print

And to make it even nicer, I could include the title of the article in the URL. This would be used to help search engines, but have zero uses in the controllers:

/index.cfm/loadArticle/id/5/Dharma-Controls-All-Feed-The-Swan

Again - let me be clear - your <i>best</i> solution would be to use URL Rewriting, but this is an alternative you can use if that is not an option.