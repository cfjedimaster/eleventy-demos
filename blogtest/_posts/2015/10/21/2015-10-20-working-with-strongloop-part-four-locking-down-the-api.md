---
layout: post
title: "Working with StrongLoop (Part Four) - Locking down the API"
date: "2015-10-21T10:03:59+06:00"
categories: [development,javascript]
tags: [strongloop]
banner_image: 
permalink: /2015/10/21/working-with-strongloop-part-four-locking-down-the-api
guid: 6972
---

Welcome to the latest in my series of blog posts on the <a href="https://strongloop.com/">StrongLoop</a> platform. The last few blog posts have been focused on the API composer (part of StrongLoop Arc) built on top of <a href="http://loopback.io/">LoopBack</a>. As I've mentioned, there is a lot more to StrongLoop then just the API stuff and I plan on moving to those other topics soon. For today I'm going to discuss how you can lock down your API. Out of the box, all your models (and APIs) are 100{% raw %}% open. That makes it incredibly easy to quickly prototype and test adding, editing, and deleting data. But in a real application, you'll obviously want to lock down how folks can use your API. As before, the StrongLoop folks do a good job documenting this area: <a href="https://docs.strongloop.com/display/public/LB/Authentication%{% endraw %}2C+authorization%2C+and+permissions">Authentication, authorization, and permissions</a>. The focus of this entry is to summarize those docs and discuss some of the things that confused me personally.

<!--more-->

Ok, so let's begin by talking about the security model at a high level. Security rules are defined at the model level (although you can also apply security to <i>all</i> models). You can apply a rule to a model method or property that sets an access value for a particular user. In terms of users, you can specify a specific user, or more likely, a role instead. LoopBack has various roles built in, like $owner, $authenticated, $unauthenticated, and $everyone. These are referred to as ACLs (Access Control Lists) and you can see them within a model definition. 

The StrongLoop Arc Composer does <i>not</i> support visually defining ACLs so you have to either type them by hand, or use the command line. The actual definition is really simple so once you've done it a few times you can probably skip the CLI, but the CLI isn't too hard to use. 

If you remember my previous blog posts, I defined a "Cat" and "Dog" model for my application. To test security I decided to lock down access to Dogs. My thinking was this:

<ul>
<li>Anyone can get dogs, or an individual dog.</li>
<li>Only logged in users can modify dogs.</li>
</ul>

That's a fairly simple design and doesn't support the idea of different types of users. LoopBack definitely supports that but I wanted to keep it as simple as possible. I followed the guide (<a href="https://docs.strongloop.com/display/public/LB/Controlling+data+access">Controlling data access</a>) and began by locking down <strong>all</strong> access to the Dog API:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot17.png" alt="shot1" width="750" height="164" class="aligncenter size-full wp-image-6973" />

Next, I wanted to add anonymous access to get dogs and an individual dog. Here is where things get weird. When using the CLI, the prompt will ask if you want to modify access to a property or method. In my case I wanted to enable the REST API to let me read dogs. However, when you look at the API explorer, this is what you see:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot27.png" alt="shot2" width="750" height="427" class="aligncenter size-full wp-image-6974" />

Getting all dogs corresponds to <code>GET /dogs</code> and getting one dog corresponds to <code>GET /dogs/ID</code>. But that is <strong>not</strong> what LoopBack wants in the ACL. Instead it wants <code>find</code> and <code>findById</code>. Ok, that kinda makes sense, but I was not able to find a good table that maps the REST APIs to various internal LoopBack methods. You'll have to figure these out one by one I suppose (and remember it of course ;). So here I am adding support for running <code>find</code> for anonymous users:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot34.png" alt="shot3" width="750" height="163" class="aligncenter size-full wp-image-6975" />

And I simply did this again for findById. Finally, I added support for making new dogs:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/shot44.png" alt="shot4" width="750" height="158" class="aligncenter size-full wp-image-6976" />

The CLI is easy to use, but check out the Dog model. As you can see, these ACLs aren't too complex. I think after you've used the CLI a few times you won't need to generate them via the CLI.

<pre><code class="language-javascript">{
  "name": "dog",
  "base": "PersistedModel",
  "strict": false,
  "idInjection": false,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string",
      "required": true
    },
    "gender": {
      "type": "string",
      "required": true
    },
    "color": {
      "type": "string",
      "required": true
    }
  },
  "validations": [],
  "relations": {},
  "acls": [
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    },
    {
      "accessType": "EXECUTE",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "ALLOW",
      "property": "find"
    },
    {
      "accessType": "EXECUTE",
      "principalType": "ROLE",
      "principalId": "$authenticated",
      "permission": "ALLOW",
      "property": "create"
    },
    {
      "accessType": "EXECUTE",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "ALLOW",
      "property": "findById"
    }
  ],
  "methods": {}
}</code></pre>

Woot! Ok, so how do you test? Again, the docs do a good job of walking you through this. Start here, <a href="https://docs.strongloop.com/display/public/LB/Introduction+to+User+model+authentication">Introduction to User model authentication</a>, and just follow the directions to create a User via the REST API. Here is what confused me though.

When you create your user, you'll specifically want to use the email property and password property. They document this (image stolen from their docs):

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/10/Explorer-credentials.png" alt="Explorer-credentials" width="750" height="415" class="aligncenter size-full wp-image-6977" />

But I was confused since the password field as an argument does not map to a password property (that you can see on the right hand side). Also, I wondered they used email instead of username. In the end, I just used what they demonstrated and it worked.

Once you've made a user, you can login, get an application token, and then run your locked down methods in the API explorer. It just works... until you restart. By default, the User model is stored in the in-memory database. As a reminder, if you go to your server folder and open <code>model-config.json</code>, you can see this for yourself:

<pre><code class="language-javascript">{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "loopback/server/mixins",
      "../common/mixins",
      "./mixins"
    ]
  },
  "User": {
    "dataSource": "db"
  },
  "AccessToken": {
    "dataSource": "db",
    "public": false
  },
  "ACL": {
    "dataSource": "db",
    "public": false
  },
  "RoleMapping": {
    "dataSource": "db",
    "public": false
  },
  "Role": {
    "dataSource": "db",
    "public": false
  },
  "cat": {
    "dataSource": "mysqldb1",
    "public": true,
    "$promise": {},
    "$resolved": true
  },
  "dog": {
    "dataSource": "mysqldb1",
    "public": true,
    "$promise": {},
    "$resolved": true
  },
  "quickmysqltest": {
    "dataSource": "mysqldb1",
    "public": true,
    "$promise": {},
    "$resolved": true
  },
  "appuser": {
    "dataSource": "mysqldb1",
    "public": true,
    "$promise": {},
    "$resolved": true
  }
}</code></pre>

I first attempted to move User to the MySQL datasource I created. In the web-base Arc Composer, they hide the "built in" models so you can't just migrate User. I tried to just set it in the JSON file, but then ran into the issue where the appropriate tables weren't made. You can do migration via JavaScript code, and I was beginning to work on that, until I discovered this nugget in the docs:

<blockquote>The User model represents users of the application or API. Typically, you'll want to extend the built-in User model with your own model, for example, named "customer" or "client".</blockquote>

Oh, that's easy. So back in Arc Composer I made a new model called appuser, told it to extend User, and pointed to the MySQL datasource, and bam, that was it. I had my own user system with persistence. That was freaking cool as heck.

So, that's it. Well, I mean that's it for my look at the API stuff. I'm going to work on a blog post that summarizes all of this and brings in Ionic to demonstrate. Look for that later this week.

<h2>Previous Entries</h2>

<ul>
<li><a href="http://www.raymondcamden.com/2015/10/15/working-with-strongloop-part-three">Working with StrongLoop (Part Three)</a></li>
<li><a href="http://www.raymondcamden.com/2015/10/13/working-with-strongloop-part-two">Working with StrongLoop (Part Two)</a></li>
<li><a href="http://www.raymondcamden.com/2015/10/12/working-with-strongloop-part-one">Working with StrongLoop (Part One)</a></li>
</ul>