---
layout: post
title: "Transfer 1.1 is Out"
date: "2008-10-17T08:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/17/Transfer-11-is-Out
guid: 3057
---

Just a quick note to let people know that Mark Mandel has released Transfer 1.1. You can get full details on his <a href="http://www.transfer-orm.com/?action=displayPost&ID=372">blog entry</a>. There is a list of new features, but what impresses me most are the new TQL custom tags. I'm stealing from his blog post, but you can now do queries like so:

<code>
&lt;cfimport prefix="report" taglib="/transfer/tags"&gt;

&lt;---  Do list operations ---&gt;
&lt;t:query name="result" transfer="#getTransfer()#"&gt;
        select
                u.firstName, u.lastName
        from
                user.User as u
        where
                u.email like &lt;t:queryparam value="%example.com" type="string"&gt;
&lt;/t:query&gt;
</code>

Pretty snazzy I say. Anyway, if you still haven't given a Transfer a try, <a href="http://www.transfer-orm.com/?action=transfer.download">download</a> it now.