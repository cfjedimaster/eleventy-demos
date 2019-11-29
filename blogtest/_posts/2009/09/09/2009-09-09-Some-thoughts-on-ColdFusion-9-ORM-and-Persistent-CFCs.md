---
layout: post
title: "Some thoughts on ColdFusion 9 ORM and Persistent CFCs"
date: "2009-09-09T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/09/Some-thoughts-on-ColdFusion-9-ORM-and-Persistent-CFCs
guid: 3519
---

If you follow me on <a href="http://www.twitter.com/cfjedimaster">Twitter</a> you may have recently seen me mention "Project Picard" a few times. While I still can't publicly talk about what it entails, I'm hoping to share what I've learned while working on it. Picard makes use of ColdFusion 9 and ORM. While I've played a bit with ORM (check out my demo content management system <a href="http://www.raymondcamden.com/index.cfm/2009/7/25/Very-simple-very-ugly-CMS-built-with-ColdFusion-9">here</a>) this current project is definitely much larger and more complex than anything I've done with ORM before. I recently ran into a problem that I want to share. <b>Please</b> remember this is new to me and that I might not do the best job explaining it. I do think it is something other people will run into so I wanted to share my findings as soon as possible.
<!--more-->
So what's the problem? This issue came about when I stored an entity (an entity is just another way of saying a persistent CFC, and yes, I'll probably say CFC and entity interchangeably) in the Session scope. Everything with this particular CFC worked fine while testing, but once I actually stored the entity I ran into odd errors. 

The entity was a User component. I'll share the code here just so you can see what it looks like.

<code>
component persistent="true" {

	property name="id" generator="native" ormtype="integer" fieldtype="id";

	property name="usertype" fieldType="many-to-one" cfc="usertype" fkcolumn="typeidfk";
	property name="userstatus" fieldType="many-to-one" cfc="userstatus" fkcolumn="statusidfk";

	property name="guid" ormtype="string";
	property name="email" ormtype="string";
	property name="nickname" ormtype="string";
	property name="firstname" ormtype="string";
	property name="lastname" ormtype="string";
	
}
</code> 

There isn't much to this component yet. But make note of the of the many-to-one fields. Those were a late addition to my code base. After I added them and tried to use on, in this case, usertype, I got an odd error:

Message  could not initialize proxy - no Session<br/>
Detail<br/>
Extended Info<br/>
Tag Context E (-1)<br/>
E (-1)<br/>

I was so confused by the E(-1) that I missed the clue as to what was truly going wrong here: "no Session."

What happened here is rather simple if you understand two basic concepts. First off, Hibernate has a concept of session. Do <b>not</b> confuse this with ColdFusion's Session scope. I think it's best to think of the Hibernate session much like a ColdFusion Request scope instance. The Hibernate session represent the current request and handles all data manipulation. If you - for example, ask for an object and then change it, the session will know this and will handle the updates. As another example, if you ask for the same object twice in one request, Hibernate is smart enough to know it doesn't have to go back to the database. Please read Mark Mandel's excellent blog post on this for more details. (<a href="http://www.compoundtheory.com/?action=displayPost&ID=415">Explaining Hibernate Sessions</a>) 

So why do we care? Hibernate tries its best to be as lazy as possible. As we are all good programmers, we know that laziness is simply a way to be as efficient as possible. In this case - notice the many-to-one relationships? Hibernate said to itself, "Hey, this requires me to get more data and create more objects, and you know what, Ray may not even use them. So I'll wait till he asks for them." 

This efficiency though is exactly what bit me in the rear. On user login I had asked Hibernate for the User entity. I copied this to my Session scope. On a later request I looked at the related property userType, and since Hibernate had never loaded this I got the error. The "no Session" message basically meant that Hibernate no longer knew how to deal with it and simply gave up.

I spoke with Rupesh of Adobe on this and with his help was able to come up with two "rules" you may want to keep in mind.

1) When running a getWhatever on a entity persisted, any property that is lazy loaded will throw an error. I can get around this a few ways.

a) Use entityMerge. This forces the entity back into the current Hibernate session.<br/>
b) Disable the lazy loading. This is what I did for Picard. I just added lazy="false" to the two properties.<br/>
c) My least favorite option - before storing the entity in the Session, simply load the related properties. For example:

<code>
ray = new User();
ray.getUserType();
session.user = ray;
</code>

Notice I run getUserType but don't actually store the result. 

2) If I actually want to change the entity stored in the persistent scope I should entityMerge the component before running entitySave. In theory one could build a method in User.cfc to wrap this for you. That way I could do session.user.save() and it would merge itself and entitySave itself as well. 

I hope this makes sense. If not, please let me know. So many of us are used to storing are CFCs in the persistent scopes, I can definitely see running into this issue if we aren't careful.