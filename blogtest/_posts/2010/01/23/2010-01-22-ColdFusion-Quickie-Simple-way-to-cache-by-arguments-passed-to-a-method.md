---
layout: post
title: "ColdFusion Quickie: Simple way to cache by arguments passed to a method"
date: "2010-01-23T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/23/ColdFusion-Quickie-Simple-way-to-cache-by-arguments-passed-to-a-method
guid: 3694
---

Just a quick tip for folks using ColdFusion 9's new caching system. Whenever you add something to the cache you must use a unique key. For a simple method, that's relatively easy:

<p>

<code>
public any function doItSlow() {
  var cachedData = cacheGet("slowProcess");
  if(isNull(cachedData)) {
    var cachedData = doSomethingSlow();
    cachePut("slowProcess", cachedData);
  }

  return cachedData;
}
</code>

<p>

That's a pretty trivial example, but you get the idea. A problem may arise, though, when your method takes arguments, especially multiple arguments. Imagine a typical "getX" type function that loads data. It may take arguments for the max number of items to return, the starting index, the order, and perhaps a search string. Imagine the following method signature:

<p>

<code>
function getStuff(numeric maxItems=10, numeric start=1, string sort="name asc", string search) {
</code>

<p>

Given that you have multiple arguments and therefore a large number of unique results, how could you cache the results? You could generate a key by examining the arguments scope:

<p>

<code>
var key = "";
key &= "#arguments.maxItems#_";
key &= "#arguments.start#_";
key &= "#arguments.sort#_";
if(structKeyExists(arguments.search)) key &="#arguments.search#";
</code>

<p>

This would create a key looking something like: 10_1_name_asc_foo. While this method works, it can get pretty complex. (Although if you start adding more arguments, you may have an overly complex API in the first place. That's a discussion for another day.) Here is a little trick I've taken to using that makes it even easier:

<p>

<code>
var key = "mymethod_#serializeJSON(arguments)#";
</code>

<p>

That's it. I use a prefix of "mymethod" so that when I examine the entire cache it is clear as to where the data belongs. The rest of the key is simply a serialized form of the arguments. It may be ugly, but it works perfectly well. Obviously you want to use with caution - especially since that search argument could be anything.