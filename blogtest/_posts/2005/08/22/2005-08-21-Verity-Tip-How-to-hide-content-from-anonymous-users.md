---
layout: post
title: "Verity Tip: How to \"hide\" content from anonymous users..."
date: "2005-08-22T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/22/Verity-Tip-How-to-hide-content-from-anonymous-users
guid: 718
---

Christian sent me a question last week that I thought would be an excellent blog entry. How do you hide certain content from Verity searches? He has a set of content that he wants to hide from users who are not logged in. Or conversely, the total body of content available is limited to anonymous (non-logged in) users. How can you handle this in Verity?

As I discussed in my <a href="http://mmchats.breezecentral.com/p32299758/">presentation</a> last week, Verity supports categories when indexing and searching content. Since we only allow a sub-set of content for anonymous users, you could simply use the category feature to mark content available for them. In other words - content that is <i>not</i> protected will have a category of "Public" (or whatever makes sense to you). When searching, your code can do something like so (and the following is code I'm typing from scratch, so please forgive any typos):

<div class="code"><FONT COLOR=MAROON>&lt;cfif not isAuthenticated()&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cfset category = <FONT COLOR=BLUE>"Public"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cfset category = <FONT COLOR=BLUE>""</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfsearch collection=<FONT COLOR=BLUE>"mystuff"</FONT> criteria=<FONT COLOR=BLUE>"#form.searchTerms#"</FONT> category=<FONT COLOR=BLUE>"#category#"</FONT>&gt;</FONT></div>

Notice how we pass in a blank category if the user is authenticated. This basically means we have no filter for authenticated users. 

So - this leads to an interesting side discussion. Imagine you display your Verity results in a simple list where each link looks like so:

<div class="code"><FONT COLOR=GREEN>&lt;a href=<FONT COLOR=BLUE>"articles.cfm?id=#key#"</FONT>&gt;</FONT>#title#<FONT COLOR=GREEN>&lt;/a&gt;</FONT><FONT COLOR=NAVY>&lt;br /&gt;</FONT></div>

So far so good, right? Now - can someone tell me what code should exist in articles.cfm - assuming the logic we discussed above?