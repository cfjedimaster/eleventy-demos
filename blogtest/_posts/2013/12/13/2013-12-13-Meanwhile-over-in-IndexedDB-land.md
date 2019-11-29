---
layout: post
title: "Meanwhile, over in IndexedDB land..."
date: "2013-12-13T14:12:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/12/13/Meanwhile-over-in-IndexedDB-land
guid: 5101
---

<p>
Ok, this probably won't interest anyone but me, but I thought it was kind of interesting and I thought I'd share. On Wednesday, Firefox 26 was released, and one of the cooler things they did was to document the updates that are of interest to developers. You can read this here: <a href="https://developer.mozilla.org/en-US/Firefox/Releases/26">Firefox 26</a>. In general, this is pretty darn cool of the Mozillians. Obviously FF26 has other user-centric changes that may be interesting, but as a developer, I honestly don't care about anything else.
</p>
<!--more-->
<p>
One of the interesting notes in this release was this:
</p>

<blockquote>
IndexedDB can now be used as a "optimistic" storage area so it doesn't require any prompts and data is stored in a pool with LRU eviction policy, in short temporary storage
</blockquote>

<p>
Cool, right? Essentially it means you can use IndexedDB for storage when LocalStorage doesn't make sense, and have the benefit of being automatically cleaned up in the future. So basically - temporary data of a larger possible size than LocalStorage.
</p>

<p>
If you follow the <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=785884">bugzilla</a> link you will see that the only change is in the open request. Instead of using "name,version" as the arguments you pass in an object instead. Here is an example.
</p>

<pre><code class="language-javascript">window.indexedDB.open({% raw %}{name:"nsa_secrets",version:1,storage:"temporary"}{% endraw %});</code></pre>

<p>
In case you're wondering, no, this is <strong>not</strong> in the <a href="http://www.w3.org/TR/IndexedDB/">official spec</a>, but it will soon be supported by Chrome and I'm sure the Mozillians will submit this to the spec as an update.
</p>

<p>
Speaking of Chrome, you do <strong>not</strong> want to use this on a Chrome system. It will essentially run toString on the object and use [object Object] as the database name.
</p>

<p>
p.s. So hey, how did I find this? The <strong>excellent</strong> <a href="http://webplatformdaily.org/">Open Web Platform Daily Digest</a>.
</p>