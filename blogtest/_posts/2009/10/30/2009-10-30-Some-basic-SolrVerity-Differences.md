---
layout: post
title: "Some basic Solr/Verity Differences"
date: "2009-10-30T14:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/30/Some-basic-SolrVerity-Differences
guid: 3582
---

<img src="https://static.raymondcamden.com/images/cfjedi/solr.jpg" align="left" title="Solr" style="margin-right:10px"/> For the past week or so I've been working on the updated full-text searching chapter of the ColdFusion Web Application Construction Kit. We are totally removing all mention of Verity (outside of that fact that it used to be the only engine supported) and focusing entirely on Solr. While working through the chapter I ran across a couple of "gotchas" that I thought I'd share for anyone considering migrating to ColdFusion 9 and taking the initiative to also update to Solr. This is by no means a complete list - it's just what I encountered. Comments, corrections, and additions are welcome.

<b>Edited:</b> Let me stress - Solr and Verity are very different products. The point of this article is to focus on the differences at the ColdFusion level only.
<!--more-->
<ul>
<li><b>Speed:</b> Ok so this isn't something to <i>worry</i> about per se, but it bears repeating. Solr in CF9 is four times faster than Verity. Sweet.
<li><b>NO LIMIT!</b> Ditto the above statement about not being something to worry about, but just in case you didn't like the index limits in Verity, you will be happy to know that there are <b>no limits</b> to the size of your Solr based collections. Thank you Henry Ho for reminding me of this.
<li>When creating a Solr collection, you do not need to specify a language. But you can specify it for cfindex and cfsearch.
<li>When creating a Solr collection, categories are automatically supported. In the admin UI it is disabled even. It just plain works out of the box.
<li>In Verity, a search for an uppercase or lowercase term resulted in a case insensitive search. If you supplied a mixcase term though the search was case sensitive. Solr is case insensitive no matter what the case. 
<li><b>Edited October 31, 2009.</b> Solr <b>does</b> support AND and OR. The docs, however, seem to imply it only supports + and - (for not). This is not the case. Both formats are supported. <strike>Solr doesn't support AND or OR, instead, you have to use the + operator to require words. So to require A and B, you would use: +A +B. To support A or B you would use: A B. I will say that one example in the docs (url linked below) shows OR. That may be a typo.</strike> 
<li>To support NOT (ie, include something but preclude any result that has something else) you use the - operator. Example: A -B.  
<li>Solr supports wildcards like Verity (* and ?) but it cannot be used as the first character in a search. You want to consider writing a UDF to handle "fixing" search terms for users in case they make a mistake like this. <a href="http://www.cflib.org">CFLib</a> has one for Verity already.
<li>For more details on operators and search examples, see this documentation page: <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WS2B335964-A0DA-4add-B9FE-4041464EC9E1.html">Solr search examples</a>
<li>Solr does <b>not</b> support previousCriteria. This is a feature where you can search within the result set of another search. While it may not be the same, you could mimic this with query of query.
<li>Verity scores range from 0 to 1, with 0 meaning it sucks and 1 meaning it rules. In Solr it's a bit different. There is no (as far as I can tell) upper range. The higher the number though the better the result. Basically you probably don't want to bother displaying the score. 
<li>With Verity, you can ask for suggestions. This was used along with the status attribute. It would return a structure of which one key was named suggestedquery. Solr still returns this, but the value is <i>just</i> the corrected spelling of one search term. So if you searched for nmber one, it may tell you "number" as the correct spelling. But - if you want to provide a better search term - use collatedResult. This key would have both the fixed spelling and the rest of the query. So it would show something like "number one" as the value.
<li>With Verity, to use a field during a search, you would do cf_custom1 <MATCHES> something. In Solr, all these fields drop the cf_ in front. 
<li>The cfcollection docs state that if you leave engine off when using the list operation, you will get all collections. Under OSX at least this is not the case. You must specify engine="solr" to get Solr collections.
</ul>

That's all I have for now. I plan on updating my Verity CF Admin to work with Solr. This tool allows you to perform ad-hoc searches against collections via the CF Admin. I'm then going to follow up with an index of the ColdFusion HTML documentation and compare some searches in Verity via Solr.