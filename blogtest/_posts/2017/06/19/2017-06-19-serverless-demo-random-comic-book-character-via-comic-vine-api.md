---
layout: post
title: "Serverless Demo - Random Comic Book Character via Comic Vine API"
date: "2017-06-19T11:39:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/comic_vine_api.jpg
permalink: /2017/06/19/serverless-demo-random-comic-book-character-via-comic-vine-api
---

For today's demo, I'm going to be using the [Comic Vine API](https://comicvine.gamespot.com/api/), but let me warn folks that I think it is bad idea to use this API in production. I started looking at it over the weekend and while I was "successful", I found numerous documentation issues and lots of forum posts that have gone unanswered. My gut tells me that this is not something I'd ever use for a "real" app, but since I don't build real apps it doesn't matter, right?

On the flip side, I do want to call out something I think the Comic Vine API does very well. I love the status report of your usage:

![Screen shot](https://static.raymondcamden.com/images/2017/6/cv1.jpg)

Specifically (and I called it out with the arrow) - I love the "Your request rate is fine" comment. It's a small thing, but it's a plain English summary of my status that doesn't make me look at raw numbers and figure out how much I'm abusing the rate limits. 

Alright, so with that out of the way - what did I build? I've previously shown how to get a random comic book character from the Marvel API (<a href="https://www.raymondcamden.com/2017/01/18/all-my-friends-are-superheroes">All My Friends are Superheros</a>) as well as random comic book covers (<a href="https://www.raymondcamden.com/2016/02/22/building-a-twitter-bot-to-display-random-comic-book-covers/">Building a Twitter bot to display random comic book covers</a>). In both cases, my thinking was that Marvel's history was so rich, I wanted to be surprised by what data existed out there and by how deep the history went. I was a comic book reader growing up, gave up in college, and started reading again about ten years ago.

This was also about the time of Marvel's cinema rise to power and DC's... well, DC's trying for sure. "Wonder Woman" was incredible and I'm a big fan of all their TV shows. The net result of all this new video media is that I've gotten more interested in reading comics. After I caught up with the Flash for example, I picked up a few TPBs. I then did the same for Green Arrow. My appreciation for comic books as a whole is growing and I think that's a great thing.

I thought it would be interesting to recreate what I built with the Marvel API using the Comic Vine API instead. Specifically I was looking at getting a random comic book character. As much as I complained about the API above, once you have an API key it's pretty easy to figure out how to get a random one.

Here is the root URL to fetch all characters, I say "all", but it is paged:

https://www.comicvine.com/api/characters?api_key={% raw %}{{key}}{% endraw %}&format=json

The {% raw %}{{key}}{% endraw %} part is dynamic of course. Calling this gives you one page of results in no particular order, but the important part is the metadata:

<pre><code class="language-javascript">{
    "error": "OK",
    "limit": 1,
    "offset": 0,
    "number_of_page_results": 1,
    "number_of_total_results": 116711,
    "status_code": 1,
    "results": [
		// N characters here
    ],
    "version": "1.0"
}
</code></pre>

See the `number_of_total_results` there? Because I know how many characters exist in their database and because I can both offset and limit my results, getting a random character is actually fairly simple:

<pre><code class="language-javascript">const rp = require(&#x27;request-promise&#x27;);

let apiUrl = `https:&#x2F;&#x2F;www.comicvine.com&#x2F;api&#x2F;characters?api_key=${% raw %}{key}{% endraw %}&amp;format=json&amp;field_list=aliases,deck,description,first_appeared_in_issue,image,real_name,name,id,publisher&amp;limit=1&amp;offset=`;

&#x2F;*
Hard coded but changes on the fly
*&#x2F;
let totalChars = 100000;

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main(args) {

    return new Promise( (resolve, reject) =&gt; {
        
        console.log(&#x27;current max is &#x27;+totalChars);

        var options = {
            uri: &#x27;https:&#x2F;&#x2F;www.comicvine.com&#x2F;api&#x2F;characters&#x27;,
            qs: {
                api_key: key,
                format:&#x27;json&#x27;,
                field_list:&#x27;aliases,deck,description,first_appeared_in_issue,image,real_name,name,id,publisher&#x27;,
                limit:1,
                offset:getRandomInt(0,totalChars)
            },
            headers: {
                &#x27;User-Agent&#x27;: &#x27;Request-Promise&#x27;
            },
            json: true 
        };

        rp(options)
        .then(function(json) {
            &#x2F;&#x2F;update totalChars
            totalChars = json.number_of_total_results;
            resolve({% raw %}{result:json.results[0]}{% endraw %});
        })
        .catch(function(err) {
            console.log(&#x27;error in rp&#x27;);
            reject({% raw %}{error:err}{% endraw %});
        });
            
    });
}
</code></pre>

Let's start in the `main` function. I begin by making a note of `totalChars`. You'll notice I've hard coded it to 100k. Even though I know Comic Vine has over that number, I made my system just use that as an upper hit on the first call to the action. When I get my result back, I store that "real" number. There's multiple issues with this.

First - the number will only persist as long as my action does, and if no one is using it, it won't persist at all. Second, it is possible that the total number of characters in the Comic Vine database could shrink dramatically.

The "best" solution would be to make one call and ignore the character results but make note of the total and then make my random call again. That would double the HTTP calls and make my code more complex. So I made what I thought was a good compromise. 

I get a random number, use that as the offset, and then just make my call. I use `field_list` to reduce the amount of data a bit which was a somewhat arbitrary decision. I then just resolve the result when done.

This worked well! So of course I decided to kick it up a notch. As I started looking at my data, I noticed a few things. There is another API for the detail for the character that returns a bit more information. I thought - why not return that data as well. I decided to add that second call like so:

<pre><code class="language-javascript">var options = {
	uri: &#x27;https:&#x2F;&#x2F;www.comicvine.com&#x2F;api&#x2F;characters&#x27;,
	qs: {
		api_key: key,
		format:&#x27;json&#x27;,
		field_list:&#x27;aliases,deck,description,first_appeared_in_issue,image,real_name,name,id,publisher,api_detail_url&#x27;,
		limit:1,
		offset:getRandomInt(0,totalChars)
	},
	headers: {
		&#x27;User-Agent&#x27;: &#x27;Request-Promise&#x27;
	},
	json: true 
};

let character;

rp(options)
.then(function(json) {
	&#x2F;&#x2F;update totalChars
	totalChars = json.number_of_total_results;
	&#x2F;&#x2F;look up details now
	character = json.results[0];
	return rp({
		uri:character.api_detail_url,
		qs:{
			api_key:key,
			format:&#x27;json&#x27;,
			field_list:&#x27;birth,character_enemies,character_friends,creators,powers,teams&#x27;
		},
		headers: {
			&#x27;User-Agent&#x27;: &#x27;Request-Promise&#x27;
		},
		json: true
	});
})
.then(function(json) {
	character.detail = json.results;
	resolve({% raw %}{character:character}{% endraw %});
})
.catch(function(err) {
	console.log(&#x27;error in rp&#x27;);
	reject({% raw %}{error:err}{% endraw %});
});
</code></pre>

Notice I'm returning a promise in my `then` block so I can use yet another `then` to chain it. You can also see in the field list the kinds of interesting data you get in the result. I just append this data to a `detail` key in the result and resolve it.

The next thing I wanted was the name of the first comic book that this character appeared in. Here's where the API failed me. The initial character result contains an API URL that should point to that end point, but it didn't work for me. So instead I use the `issues` API to fetch it. This was yet another promise chained in resulting in a grand total of 3 HTTP calls to get one random character. Here's the entirety of the action now:

<pre><code class="language-javascript">const rp = require(&#x27;request-promise&#x27;);

&#x2F;*
Hard coded but changes on the fly
*&#x2F;
let totalChars = 100000;

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main(args) {

    return new Promise( (resolve, reject) =&gt; {
        
        let character;

        var options = {
            uri: &#x27;https:&#x2F;&#x2F;www.comicvine.com&#x2F;api&#x2F;characters&#x27;,
            qs: {
                api_key: args.key,
                format:&#x27;json&#x27;,
                field_list:&#x27;aliases,deck,description,first_appeared_in_issue,image,real_name,name,id,publisher,api_detail_url,site_detail_url,gender&#x27;,
                limit:1,
                offset:getRandomInt(0,totalChars)
            },
            headers: {
                &#x27;User-Agent&#x27;: &#x27;Request-Promise&#x27;
            },
            json: true 
        };

        rp(options)
        .then(function(json) {
            &#x2F;&#x2F;update totalChars
            totalChars = json.number_of_total_results;
            &#x2F;&#x2F;look up details now
            character = json.results[0];
            return rp({
                uri:character.api_detail_url,
                qs:{
                    api_key:args.key,
                    format:&#x27;json&#x27;,
                    field_list:&#x27;birth,character_enemies,character_friends,creators,powers,teams&#x27;
                },
                headers: {
                    &#x27;User-Agent&#x27;: &#x27;Request-Promise&#x27;
                },
                json: true
            });
        })
        .then(function(json) {
            let detail = json.results;
            for(let key in detail) {
                character[key] = detail[key];
            }
            &#x2F;*
            craft a url for the issue based on first_appeared_in_issue.
            note it includes an api_detail_url but it doesn&#x27;t work
            *&#x2F;
            return rp({
                uri:&#x27;https:&#x2F;&#x2F;www.comicvine.com&#x2F;api&#x2F;issues&#x27;,
                qs:{
                    api_key:args.key,
                    format:&#x27;json&#x27;,
                    filter:&#x27;id:&#x27;+character.first_appeared_in_issue.id
                },
                headers: {
                    &#x27;User-Agent&#x27;: &#x27;Request-Promise&#x27;
                },
                json: true
            });
        })
        .then(function(json) {
            character.first_issue = json.results[0];
            resolve({% raw %}{character:character}{% endraw %});
        })
        .catch(function(err) {
            console.log(&#x27;error in rp&#x27;,err);
            reject({% raw %}{error:err}{% endraw %});
        });
            
    });
}</code></pre>

By the way, while I'm pretty comfortable with Promises now, I want to share a [Gist snippet](https://gist.github.com/iotashan/e0f46cb1d8ff84f444ef169ee034fabc) that my friend Shannon Hicks shared with me. It's based on an earlier version of the code, but it uses the new `await` functionality from ES6 and frankly - it's freaking awesome. I decided against using it for now because - as I said - I'm not really familiar with it yet, but *damn*, I think I will the next time I build a sample.

Alright - so far so good. Here's a sample of calling the action from the CLI:

https://gist.github.com/cfjedimaster/a8544fb2897ebc35bf5ddf8239bf6d53

I used a Gist since the JSON was rather large. If you don't want to read a large blob of data, just know the result was [Sunset Shimmer](https://comicvine.gamespot.com/sunset-shimmer/4005-91466/). 

<img src="https://static.comicvine.com/uploads/scale_small/5/55582/3228748-sunset_shimmer_id_eg.png">

Yep - cool.

Alright, so how do I want to actually use this? I decided to build a simple web page that would render the results. Now - unfortunately - I can't share this web page publicly since it will blow away my key usage pretty quickly if folks actually used the demo, but I'll share some screenshots of the results.

First is [General Tuzik](https://comicvine.gamespot.com/general-tuzik/4005-87864/) from DC:

![Result](https://static.raymondcamden.com/images/2017/6/cv2.jpg)

His "power" is "Leadership", awesome. Next up is [Szothstromael](https://comicvine.gamespot.com/szothstromael/4005-72102/) from Dark Horse Comics:

![Result](https://static.raymondcamden.com/images/2017/6/cv3.jpg)

Ah, good old Szothstromael. A name that just rolls off the tongue. No powers are listed but obviously his power is to never actually be called by his name. (Ok, now to nerd out a bit - apparently this is a demon, and if demons can be controlled by their name, having a name that's near impossible to say would come in handy.) 

One more for good measure - here is the anthropomorphic badger [Inspector LeBrock](https://comicvine.gamespot.com/inspector-lebrock/4005-82225/):

![Result](https://static.raymondcamden.com/images/2017/6/cv4.jpg)

Nothing says "comic book" like anthropomorphic badger. So the code behind this is 99% rendering into the DOM. I spent 2 seconds turning my action into an anonymous API using OpenWhisk and Bluemix Native API Management (more on that later this week), and then I was able to call it via a simple URL. I decided against removing the URL below - if you want to hit it and see results, be my guest, just know I'll probably hit the rate limit.

<pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;link href=&quot;https:&#x2F;&#x2F;fonts.googleapis.com&#x2F;css?family=Bangers&quot; rel=&quot;stylesheet&quot;&gt;
		&lt;style&gt;
		body {
			font-family: &#x27;Banger&#x27;, cursive;
			background-color: #ffeb3b;
		}

		a {
			color: black;	
		}

		img.heroImage {
			float: right;
			max-width: 500px;
		}
		&lt;&#x2F;style&gt;

	&lt;&#x2F;head&gt;
	&lt;body&gt;

	&lt;div id=&quot;result&quot;&gt;&lt;&#x2F;div&gt;

	&lt;p&gt;
		All data from &lt;a href=&quot;https:&#x2F;&#x2F;comicvine.gamespot.com&quot; target=&quot;_new&quot;&gt;ComicVine&lt;&#x2F;a&gt;.
	&lt;&#x2F;p&gt;

	&lt;script src=&quot;https:&#x2F;&#x2F;code.jquery.com&#x2F;jquery-3.1.1.min.js&quot;   integrity=&quot;sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=&quot; crossorigin=&quot;anonymous&quot;&gt;&lt;&#x2F;script&gt;
	&lt;script&gt;
	let api = &#x27;https:&#x2F;&#x2F;service.us.apiconnect.ibmcloud.com&#x2F;gws&#x2F;apigateway&#x2F;api&#x2F;37871051d18d0b2115da90f292458913e22e5d182c8a965fadcfbf6b5fcc96c6&#x2F;comicvine&#x2F;randomCharacter&#x27;;


	$(document).ready(() =&gt; {

		$(&quot;#result&quot;).html(&#x27;&lt;i&gt;Loading Random Character...&lt;&#x2F;i&gt;&#x27;);

		$.get(api).then((res) =&gt; {
			console.log(res);
			if(res.error) {
				alert(&#x27;Error! (check console)&#x27;);
				return;
			}
			let char = res.character;
			let friendsTemplate = &#x27;&#x27;;
			let enemiesTemplate = &#x27;&#x27;;
			let powersTemplate = &#x27;&#x27;;
			let teamsTemplate = &#x27;&#x27;;
			let creatorsTemplate = &#x27;&#x27;;

			&#x2F;&#x2F;need to find female
			let defaultMaleImage = &#x27;https:&#x2F;&#x2F;comicvine.gamespot.com&#x2F;api&#x2F;image&#x2F;scale_large&#x2F;1-male-good-large.jpg&#x27;;
			let image = &#x27;&#x27;;
			if(!char.image) {
				image = defaultMaleImage;
			} else if(char.image &amp;&amp; !char.image.super_url) {
				image = defaultMaleImage;
			} else {
				image = char.image.super_url;
			}

			let publisher = &#x27;None&#x27;;
			if(char.publisher &amp;&amp; char.publisher.name) publisher = char.publisher.name;

			&#x2F;*
			If no description, copy deck over. deck can be blank too though
			also sometimes its &lt;br&#x2F;&gt;, sometimes &lt;p&gt;.&lt;&#x2F;p&gt;
			*&#x2F;
			if(char.description &amp;&amp; (char.description === &#x27;&lt;br&#x2F;&gt;&#x27; || char.description === &#x27;&lt;p&gt;.&lt;&#x2F;p&gt;&#x27;)) delete char.description;

			if(!char.description &amp;&amp; !char.deck) {
				char.description = &#x27;No description.&#x27;;
			} else if(!char.description) {
				char.description = char.deck;
			}

			if(char.character_friends.length) {
				friendsTemplate = &#x27;&lt;h2&gt;Friends&lt;&#x2F;h2&gt;&lt;ul&gt;&#x27;;
				char.character_friends.forEach((friend) =&gt; {
					friendsTemplate += `&lt;li&gt;&lt;a href=&quot;${% raw %}{friend.site_detail_url}{% endraw %}&quot;&gt;${% raw %}{friend.name}{% endraw %}&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;`;
				});
				friendsTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
			} 

			if(char.character_enemies.length) {
				enemiesTemplate = &#x27;&lt;h2&gt;Enemies&lt;&#x2F;h2&gt;&lt;ul&gt;&#x27;;
				char.character_enemies.forEach((enemy) =&gt; {
					enemiesTemplate += `&lt;li&gt;&lt;a href=&quot;${% raw %}{enemy.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;${% raw %}{enemy.name}{% endraw %}&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;`;
				});
				enemiesTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
			} 

			if(char.powers.length) {
				powersTemplate = &#x27;&lt;h2&gt;Powers&lt;&#x2F;h2&gt;&lt;ul&gt;&#x27;;
				char.powers.forEach((power) =&gt; {
					powersTemplate += `&lt;li&gt;${% raw %}{power.name}{% endraw %}&lt;&#x2F;li&gt;`;
				});
				powersTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
			} 

			if(char.teams.length) {
				teamsTemplate = &#x27;&lt;h2&gt;Teams&lt;&#x2F;h2&gt;&lt;ul&gt;&#x27;;
				char.teams.forEach((team) =&gt; {
					teamsTemplate += `&lt;li&gt;&lt;a href=&quot;${% raw %}{team.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;${% raw %}{team.name}{% endraw %}&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;`;
				});
				teamsTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
			} 

			if(char.creators.length) {
				creatorsTemplate = &#x27;&lt;h2&gt;Creators&lt;&#x2F;h2&gt;&lt;ul&gt;&#x27;;
				char.creators.forEach((creator) =&gt; {
					creatorsTemplate += `&lt;li&gt;&lt;a href=&quot;${% raw %}{creator.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;${% raw %}{creator.name}{% endraw %}&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;`;
				});
				creatorsTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
			} 

			let mainTemplate = `
			&lt;h1&gt;${% raw %}{char.name}{% endraw %}&lt;&#x2F;h1&gt;
			&lt;p&gt;
				&lt;strong&gt;Publisher:&lt;&#x2F;strong&gt; ${% raw %}{publisher}{% endraw %}&lt;br&#x2F;&gt;
				&lt;strong&gt;First Issue:&lt;&#x2F;strong&gt; &lt;a href=&quot;${% raw %}{char.first_issue.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;${% raw %}{char.first_issue.volume.name}{% endraw %} ${% raw %}{char.first_issue.issue_number}{% endraw %} (${% raw %}{char.first_issue.cover_date}{% endraw %})&lt;&#x2F;a&gt;&lt;br&#x2F;&gt;
			&lt;&#x2F;p&gt;

			&lt;a href=&quot;${% raw %}{char.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;&lt;img class=&quot;heroImage&quot; src=&quot;${% raw %}{image}{% endraw %}&quot;&gt;&lt;&#x2F;a&gt;
			&lt;p&gt;${% raw %}{char.description}{% endraw %}&lt;&#x2F;p&gt;

			${% raw %}{creatorsTemplate}{% endraw %}
			${% raw %}{powersTemplate}{% endraw %}
			${% raw %}{teamsTemplate}{% endraw %}
			${% raw %}{friendsTemplate}{% endraw %}
			${% raw %}{enemiesTemplate}{% endraw %}
			`;

			$(&#x27;#result&#x27;).html(mainTemplate);
		});

	});

	&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

There isn't anything particularly special about any of this. You can see a few hacks in there for when the data returned was a bit sub-optimal (or just plain broken). Finally, you can find the source code for the action and the demo here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/comicvine

What do you think?