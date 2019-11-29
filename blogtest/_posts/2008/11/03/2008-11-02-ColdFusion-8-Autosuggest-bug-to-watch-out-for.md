---
layout: post
title: "ColdFusion 8 Autosuggest bug to watch out for"
date: "2008-11-03T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/03/ColdFusion-8-Autosuggest-bug-to-watch-out-for
guid: 3078
---

Here is an odd bug a reader ran into this weekend involving ColdFusion 8's new autosuggest feature. It was difficult to debug but ended up being quite trivial. 

The reader was not using an Ajax call to load the data for the suggestion list. Instead he performed a query, used valueList twice, and supplied those lists to two autosuggest cfinput fields. 

One worked fine, but the other threw a JavaScript error. The problem ended up being his data. His list included a record that had double quotes in it. Here is a simple example:

<code>
&lt;cfset list = "apple,orange,peaches ""and"" cream,klingon birds of prey"&gt;
</code>

In this list, the 3rd item, peaches "and" cream, includes quotes. Notice that I've escaped the quotes for ColdFusion to parse it correctly. When you run a page that makes use of this...

<code>
&lt;cfform name="foo"&gt;
&lt;cfinput name="test" autosuggest="#list#"&gt;
&lt;/cfform&gt;
</code>

You end up with this generated in the browser:

<code>
_cf_autosuggestarray="apple,orange,peaches "and" cream,klingon birds of prey".split(",");
</code>

What's sad about this is that ColdFusion could easily handle this for you. In fact, it provides multiple options. One, toScript, handles the quotes just fine:

<code>
&lt;cfset list = "apple,orange,peaches ""and"" cream,klingon birds of prey"&gt;
&lt;cfoutput&gt;
&lt;script&gt;
var #toScript(list,"mylist")#;
&lt;/script&gt;
&lt;/cfoutput&gt;
</code>


This returns:

<code>
&lt;script&gt;
var mylist = "apple,orange,peaches \"and\" cream,klingon birds of prey";
;
&lt;/script&gt;
</code>

See how it is escaped? This bug doesn't exist if yo use Ajax to load the data. If I change my input field to this:

<code>
&lt;cfinput name="test" autosuggest="url:test3.cfm?v={% raw %}{cfautosuggestvalue}{% endraw %}"&gt;
</code>

And then simply do:

<code>
&lt;cfset list = "apple,orange,peaches ""and"" cream,klingon birds of prey"&gt;
&lt;cfoutput&gt;#serializeJSON(list)#&lt;/cfoutput&gt;
</code>

It works fine. Something to watch out for folks! (And I'm going to file a quick bug report now.)