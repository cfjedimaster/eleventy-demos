---
layout: post
title: "Ask a Jedi: Remembering a search"
date: "2008-01-24T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/24/Ask-a-Jedi-Remembering-a-search
guid: 2614
---

Alan asks:

<blockquote>
<p>
I have a search that I want to run on various fields, but then I also want to save that search, so that when the
person returns to the page... the old search query is re-run, until they either log off or perofrm a different search.

My dilemma lies in how to do this 'securely'.

I can cfset some variable to the query, perform the query and then save it in my client or session scope... however in cfsetting the query variable outside the cfquery tags, I cannot use cfqueryparam to make it secure. Any ideas?  How would I perform a custom query and save it for reuse... while
being secure?
</p>
</blockquote>

I think you are overthinking this a bit. If you store their last search in a variable like session.lastsearch, then your search form page could do something as simple as this:

<code>
&lt;cfif not structKeyExists(form, "search") and structKeyExists(session, "search")&gt;
  &lt;cfset form.search = session.search&gt;
&lt;/cfif&gt;
</code>

When the user lands on the page and they had searched before, the code above will set the current search equal to the last search. It also correctly notices that you aren't searching for someone new.

At this point, you call whatever code you have that performs the search, which darn well better use cfqueryparam of course.

Now let me address something you said: "cfsetting the query variable outside the cfquery tags, I cannot use cfqueryparam to make it secure"

I'm not quite sure what you mean by this - but just because you create some variable elsewhere, it does not impact your ability to use that variable inside a cfqueryparam tag.