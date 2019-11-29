---
layout: post
title: "Null Pointer Error with HQL? Check for this..."
date: "2010-09-24T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/24/Null-Pointer-Error-with-HQL-Check-for-this
guid: 3952
---

Yesterday I was writing what I thought to be some pretty simple HQL:

<p/>

<code>
var res = ormExecuteQuery("from user where email = :email", {% raw %}{email=arguments.email}{% endraw %});
</code>

<p/>

Unfortunately I kept getting the Java Lazy Cop Out error (sorry, I mean the Null Pointer Error):

<p/>

<blockquote>
java.lang.NullPointerException at org.hibernate.param.NamedParameterSpecification.bind(NamedParameterSpecification.java:67) at org.hibernate.loader.hql.QueryLoader.bindParameterValues(QueryLoader.java:567) at org.hibernate.loader.Loader.prepareQueryStatement(Loader.java:1612) at org.hibernate.loader.Loader.doQuery(Loader.java:717) at org.hibernate.loader.Loader.doQueryAndInitializeNonLazyCollections(Loader.java:270) at you get the idea.
</blockquote>

<p/>

The error seemed to imply something wrong with my named parameter, email. I did a dump on the arguments scope to ensure email existed and it did. So what was it? Turns out I had not defined email as a property of my entity! Surely the error could have recognized that. Once I actually added email (and ran an ormReload - don't forget ColdFusion caches such definitions), it worked. I tweeted this last night and Joe Rinehart pointed you get the same issue if your case in the HQL statement does not match the case defined in your entity. That's correct too. Changing my code like so:

<p/>

<code>
var res = ormExecuteQuery("from user where eMail = :email", {% raw %}{email=arguments.email}{% endraw %});
</code>

<p/>

Also threw an NPE as well. *sigh* So - is this a ColdFusion or Hibernate bug? I'm not sure. If this is how Hibernate throws the error, than ColdFusion can't do much about it. I'm filing a bug anyway just to be sure. I know that Adobe did a lot of work in ColdFusion 9.0.1 to improve the error messages from ORM issues so if this can be updated as well, it would help.