---
layout: post
title: "cfObjective - Mark Mandel and Transfer ORM (Object Relational Mapping)"
date: "2007-05-04T13:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/04/cfObjective-Mark-Mandel-and-Transfer-ORM-Object-Relational-Mapping
guid: 2002
---

(As before please pardon the writing.)

The problem that we need to solve is writing all the objects that model your database. This is a long and painful process. The basic creation by itself is bad - but it gets
worse when you make updates to your database.

ORM (Object Relational Mapping) can help us solve this problem. An ORM can generate your INSERT, UPDATE, DELETE, and SELECTS for your objects. It can create objects for
you to work with.

So obviously this saves you time (and money!).

Transfer is an ORM for ColdFusion. It creates generic 'TransferObjects' defined by an XML configuration file.
 It generates transfer files which are basically a library of UDFs. 

Transfer runs on MSSQL 2k, MySQL 4, Postgres 8, Oracle 9. Needs CF 7. 

Transfer can generate business objects on the fly (no need for code, but you can write code if you need to). Generates all your SQL for you. Handles object composition. Generates list queries. Proides caching. 

Installing is simple - copy transfer folder to application root. 2 XML files. One defines datasource. One is a configuration file.

configuration.xml:

package elements define organization of objects (just for org, nothing more)

object elements map Objects to table

id defines primary key

property defines columns

Transfer supports multiple composition types: many to one (each blog post has a single user), one to many (each blog post has multiple comments), many to many (multiple blog posts have multiple categories)

Transfer supports lazy load. This means it won't get child elements unless you really want it. Didn't hear if this was default. I believe it is NOT the default. Good feature though to have.

Transfer Decorators allows for customization (he will be covering this more in the advanced topic). 

You start off creating a TransferFactory. CFC takes 3 args - path to datasource config, path to config file, and where to save files. Factory has an API to get the datasource (useful for other CFCs), and a getTransfer that returns our main API.

When you save an object, API supports create, update, and save (where save is smart enough to know if it needs to create/upate).

Transfer can handle creating PKs for you. (Or you can write your own code to handle it.)

To get an object, it is very simple: getTransfer().get(class, key)

You can get by PK, or by a property or set of properties. You can also pass a SQL where clause (although Mark doesn't like this).

Deleting is simple as well. getTransfer().delete(). It does not yet handle cascading deletes. 

Getting a list is pretty trivial: getTransfer().list(class). With optional ordering. 

Many more features. 

His demo is pretty nice. All written using Transfer and no sql.

Summary: So I had not had a chance to look at Transfer yet and from what I see it looks -very- nice. Folks can find out more at <a href="http://transfer.riaforge.org/">http://transfer.riaforge.org/</a> and <a href="http://www.transfer-orm.com">http://www.transfer-orm.com</a>