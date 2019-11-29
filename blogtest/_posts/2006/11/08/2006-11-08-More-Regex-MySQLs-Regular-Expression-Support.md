---
layout: post
title: "More Regex - MySQL's Regular Expression Support"
date: "2006-11-08T12:11:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2006/11/08/More-Regex-MySQLs-Regular-Expression-Support
guid: 1640
---

Many months ago I reviewed Ben's <a href="http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=raymondcamden-20&camp=1789&creative=9325&path=http{% raw %}%3A%{% endraw %}2F{% raw %}%2Fwww.amazon.com%{% endraw %}2Fgp{% raw %}%2Fproduct%{% endraw %}2F0672327120{% raw %}%2Fsr%{% endraw %}3D1-1{% raw %}%2Fqid%{% endraw %}3D1138027461{% raw %}%2Fref%{% endraw %}3Dpd_bbs_1{% raw %}%3F%{% endraw %}255Fencoding%3DUTF8">MySQL Crash Course</a><img src="http://www.assoc-amazon.com/e/ir?t=raymondcamden-20&amp;l=ur2&amp;o=1" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />, an excellent book that discusses MySQL at a very high, quick to read level. One of the cool things I discovered was that MySQL supports regex in SQL queries. How about some examples....
<!--more-->
Consider a typical OR style search like the query below:

<code>
select id
from products
where name like '{% raw %}%alpha%{% endraw %}' 
or name like '{% raw %}%beta%{% endraw %}'
</code>

By using the regex support in MySQL, you can rewrite it as:

<code>
select id
from products
where name regexp '(alpha|beta)'
</code>

MySQL doesn't support the full set of regular expressions you use in ColdFusion or Perl, but it does support most of what you would use normally. That includes beginning and end of line matches, character classes, ranges, and matching certain numbers of items. 

A few more quick notes: The MySQL Regex escape character is two back slashes. So for example, \\. will escape the . character. Secondly - to do case sensitive regular expressions, you use the binary keyword:

<code>
select id
from products
where name regexp binary 'Camden'
</code>

Lastly - do know that when you use regex in MySQL, the engine has to check each and every line to see if your regex matches. This may lead to slower performance.