---
layout: post
title: "Ask a Jedi: Using HQL versus other ORM Functions"
date: "2009-10-21T22:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/21/Ask-a-Jedi-Using-HQL-versus-other-ORM-Functions
guid: 3573
---

Robert asked a pretty interesting question earlier in the week:

<blockquote>
Currently going through the lynda.com ColdFusion 9 tutorial online, and was introduced to "Hibernate Query Language" usage inside ColdFusion as a substitute for writing SQL queries. This was the first time I was introduced to this alternative query language so I checked out <a href="http://bit.ly/2hKgjo">"Chapter 14. HQL: The Hibernate Query Language"</a> in the Docs on jboss.org site. What I don't know is this: is this important to learn in light of the ORM direction CF9 is taking? Can you comment how how much I should learn/use HQL over SQL when using the ORM capabilities inside CF9?
</blockquote>

My first reply to him was to ask for some clarification. It <i>felt</i> like he was implying that using HQL wasn't working with ORM. His response to this was also interesting:

<blockquote>
I guess I separated (wrongly) the use of generated ORM cfc functions (and calling those getter/setter functions in an app.) away from the "traditional" querying of table data for result pages. I think of SQL as something you do to/with your database directly, and ORM as something you do to/with data objects indirectly touching your database. So, I quess if I drink the CF9 ORM framework "koolaid", then the straw has to be HQL, right? I don't really know how different HQL is from SQL. It could be I'm blowing smoke here.
</blockquote>
<!--more-->
So before I even begin to respond to this, let me just state right away - I am <i>very</i> much the ORM newbie. If your introduction to ORM was with ColdFusion 9, I've only got maybe one year on you. I've been using CFCs for many years and I've only recently begun to feel very comfortable and knowledgeable on them. ORM? Shoot - I might as well be a rank amateur. Maybe in 4-5 years I'll feel like an expert, but for now, what your going to get is my opinion, and what seems right to me now. (I'm also sure my readers won't let me down. I know a few of you have opinions, right?)

I take from this, again, that there is some concern that perhaps using HQL may not be "The Right Way". As we know, there is <b>never one right way</b>, but certainly there are things that are normally recommended. So you may ask - when does it make sense to use entityLoad (or entityLoadByPk, or entityLoadByExample) versus HQL with ormExecuteQuery? 

From what I see - entityLoad is useful for fetching a precise set of entities. All people, or all people where gender=female. This would be my normal way of browsing through the entire set of data, or a specific subset defined by exact property values.

Anything "fuzzy" though, for example, all people with an age less than 30, or all people whose name is like "cam", will require an HQL call. 

As far as I know, these are hard and fast rules. You simply <i>can't</i> get data based on a non-specific filter without resorting to a HQL query (please correct me if I'm wrong). Therefore there are times when the choice is out of your hands.

Don't forget that your result is still an array (or single) set of objects. Your still working with entities versus an old school query result set. Also don't forget that your HQL is working with your aliased data. You still have that layer above the pure tables. If a table changes in the future, once your entity CFC is updated to reflect that the column behind the scenes has changed, your HQL still will work fine. 

I hope this answers your question, and again, I'm definitely open to some discussion here. If I'm completely off base, school me!