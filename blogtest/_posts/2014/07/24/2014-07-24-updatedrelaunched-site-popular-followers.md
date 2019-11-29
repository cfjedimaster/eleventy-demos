---
layout: post
title: "Updated/Relaunched site - Popular Followers"
date: "2014-07-24T11:07:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2014/07/24/updatedrelaunched-site-popular-followers
guid: 5274
---

<strong>Edit in November 2015: The new URL is <a href="http://popularfollowers.raymondcamden.com">http://popularfollowers.raymondcamden.com</a></strong>

<p>
Almost two years ago I <a href="http://www.raymondcamden.com/2012/8/20/New-site--PopularFollowerscom">announced</a> the launch of a new site. It was built to display a report of your followers sorted by how many followers they had. Now - I completely recognize that this isn't necessarily an <i>important</i> report. But it was something I was curious about and I thought it would be cool. I'm being followed by two stars of Young and the Restless (my secret obsession), one of my favorite authors, and best of all, <a href="https://twitter.com/GameOfThrones">Game of Thrones</a>.
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/Popular_Twitter_Followers.jpg" />
</p>

<p>
Unfortunately, Twitter killed off almost all the public APIs it has and now requires a <i>heck</i> of a lot more work (comparatively so anyway) to use their API. Why? I assume to help keep their servers up. Either that or Twitter hates simple. (And kittens.) A while ago I decided to take a stab at rebuilding it as a server-side application in Node.js. I found an <strong>awesome</strong> article on it (<a href="http://moonlitscript.com/post.cfm/how-to-use-oauth-and-twitter-in-your-node-js-expressjs-app/">How To Use OAuth and Twitter in your Node.js / ExpressJS App</a>) and was quickly able to add OAuth to my application.
</p>

<p>
Unfortunately, even with access to the API now what I wanted to do still wasn't necessarily easy. I begin by getting the IDs of your followers. That's simple enough although it maxes out at 5000 at a time. But then I need to get details about your followers. You are allowed to get 100 at a time. So for someone like me, nearing 8000 followers, that's about 80 calls. It is still within the API limits (since it should be per user using OAuth), but it is approaching the max. For folks curious, here is the code I used just for this process.
</p>

<pre><code class="language-javascript">function getIds(screen_name, sess, cb, data, start) {
	if(!data) data=[];
	if(!start) start = &#x27;-1&#x27;;

	var oa = new OAuth(sess.oa._requestUrl,
	                  sess.oa._accessUrl,
	                  sess.oa._consumerKey,
	                  sess.oa._consumerSecret,
	                  sess.oa._version,
	                  sess.oa._authorize_callback,
	                  sess.oa._signatureMethod);
	
	oa.get(&#x27;https:&#x2F;&#x2F;api.twitter.com&#x2F;1.1&#x2F;followers&#x2F;ids.json?cursor=&#x27;+start+&#x27;&amp;screen_name=&#x27;+screen_name+&#x27;&amp;count=5000&amp;skip_status=1&#x27;, sess.oauth_access_token, sess.oauth_access_token_secret,            
      function (e, retData, ores) {
		if (e) {
			console.log(&#x27;getIds: error result&#x27;);
			console.dir(JSON.parse(e.data));
			&#x2F;*
			var error = JSON.parse(e.data).errors;
			res.send({% raw %}{error:1, message:error[0].message}{% endraw %});
			*&#x2F;
		} else {
			console.log(&#x27;get ids done&#x27;);
			retData = JSON.parse(retData);
			data = data.concat(retData.ids);
			&#x2F;&#x2F;console.dir(data);
			if(retData.next_cursor) {
				getIds(screen_name, sess, cb, data, retData.next_cursor);	
			} else {
				cb(data);
			}
		}
      });
}

function getFollowers(sess, ids, cb, data, start) {
	if(!data) data=[];
	if(!start) start = 0;
	var idSlice = ids.slice(start,start+100);
	var sn = idSlice.join(&#x27;,&#x27;);
	var oa = new OAuth(sess.oa._requestUrl,
	                  sess.oa._accessUrl,
	                  sess.oa._consumerKey,
	                  sess.oa._consumerSecret,
	                  sess.oa._version,
	                  sess.oa._authorize_callback,
	                  sess.oa._signatureMethod);
	
	oa.get(&#x27;https:&#x2F;&#x2F;api.twitter.com&#x2F;1.1&#x2F;users&#x2F;lookup.json?user_id=&#x27;+sn, sess.oauth_access_token, sess.oauth_access_token_secret,             
      function (e, retData, ores) {
		if (e) {
			console.log(&#x27;getFollowers: error result&#x27;);
			console.dir(JSON.parse(e.data));
			
			var error = JSON.parse(e.data).errors;
			cb({% raw %}{error:1, message:error[0].message}{% endraw %});			
		} else {
			retData = JSON.parse(retData);
			console.log(&#x27;got &#x27;+retData.length+ &#x27; items&#x27;);
			
			&#x2F;&#x2F;All we need is username + followercount
			for(var x=0, length=retData.length; x&lt;length; x++) {
				data.push({% raw %}{screen_name:retData[x].screen_name, followers:retData[x].followers_count,profile_image_url:retData[x].profile_image_url}{% endraw %});
			}
			&#x2F;&#x2F;data = data.concat(retData);
			console.log(&#x27;size of data is now &#x27;+data.length + &#x27; and ids len is &#x27;+ids.length);
			&#x2F;&#x2F;console.dir(data);
			if(data.length &lt; ids.length &amp;&amp; data.length &lt; 10000) {
				getFollowers(sess, ids, cb, data,start+retData.length);	
			} else {
				cb(data);
			}
		}
      });
	
};</code></pre>

<p>
Note I use a simple memory-based cache so it doesn't have to refetch the data on reload. Speaking of - there is a bug currently with the site where the request will time out on the client for people (again, like me) with lots of followers. In fact, it <i>always</i> does this for me on my first load, but just on the production server. When I reload, the server returns the data immediately as it apparently kept churning away on the back end. This app is <i>not</i> perfect yet, and probably never will be. I built it for fun.
</p>

<p>
So, want to check it out? Just head over to <a href="http://popularfollowers.raymondcamden.com">popularfollowers.raymondcamden.com</a> and give it a spin.
</p>