---
layout: post
title: "Update on My Random Comic Book Character API"
date: "2017-06-21T12:35:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/06/21/update-on-my-random-comic-book-character-api
---

So today's post isn't necessarily that interesting - but I try to live by the rule of blogging everything that causes me trouble. Earlier this week I [blogged](https://www.raymondcamden.com/2017/06/19/serverless-demo-random-comic-book-character-via-comic-vine-api/) about creating a "Random Comic Book Character" API. In the post, I ended with a simple HTML demo that displayed a random character on page load. Initially my plan had been to send an email every day with the character but I decided against that as I figured it would be too much trouble. Today I obviously decided I must like trouble as I went ahead and did it. And yes, it went as well as you can imagine.

So first, a quick recap. The core API is based one OpenWhisk action. It handles making multiple calls to the [Comic Vine API](https://comicvine.gamespot.com/api/) and massaging them down into one set of data. So in theory, all I needed to do was take some of the "character JSON into HTML" logic from the desktop demo and just use that as an email. Easy!

![Hahahaha, yeah no freaking way](https://static.raymondcamden.com/images/2017/6/lolcat.jpg)

So I know HTML email is a complete and utter shit show but I knew if I kept things simple and used inline styles I'd probably be ok. I had used a Google Font for my desktop demo so I figured I'd try that too and it wouldn't hurt it if failed. So here's the action I built:

<pre><code class="language-javascript">const helper = require(&#x27;sendgrid&#x27;).mail;

function main(args) {
	let SG_KEY = args.SG_KEY;
	let char = args.character;

	let from_email = new helper.Email(&#x27;raymondcamden@gmail.com&#x27;,&#x27;Raymond Camden&#x27;);
	let to_email = new helper.Email(&#x27;raymondcamden@gmail.com&#x27;,&#x27;Raymond Camden&#x27;);
	let subject = &#x27;Your Daily Comic Book Character: &#x27;+char.name;

	&#x2F;*
	Generate the HTML for the email first.
	*&#x2F;
	let friendsTemplate = &#x27;&#x27;;
	let enemiesTemplate = &#x27;&#x27;;
	let powersTemplate = &#x27;&#x27;;
	let teamsTemplate = &#x27;&#x27;;
	let creatorsTemplate = &#x27;&#x27;;

	&#x2F;&#x2F;need to find female (don&#x27;t think a default exists)
	let defaultMaleImage = &#x27;https:&#x2F;&#x2F;comicvine.gamespot.com&#x2F;api&#x2F;image&#x2F;scale_large&#x2F;1-male-good-large.jpg&#x27;;
	let image = &#x27;&#x27;;
	if(!char.image) {
		image = defaultMaleImage;
	} else if(char.image &amp;&amp; !char.image.super_url) {
		image = defaultMaleImage;
	} else {
		image = char.image.super_url;
	}

	return new Promise( (resolve, reject) =&gt; {
	

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
			friendsTemplate = `&lt;h2 style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;Friends&lt;&#x2F;h2&gt;&lt;ul&gt;`;
			char.character_friends.forEach((friend) =&gt; {
				friendsTemplate += `&lt;li style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;&lt;a href=&quot;${% raw %}{friend.site_detail_url}{% endraw %}&quot;&gt;${% raw %}{friend.name}{% endraw %}&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;`;
			});
			friendsTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
		} 

		if(char.character_enemies.length) {
			enemiesTemplate = `&lt;h2 style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;Enemies&lt;&#x2F;h2&gt;&lt;ul&gt;`;
			char.character_enemies.forEach((enemy) =&gt; {
				enemiesTemplate += `&lt;li style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;&lt;a href=&quot;${% raw %}{enemy.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;${% raw %}{enemy.name}{% endraw %}&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;`;
			});
			enemiesTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
		} 

		if(char.powers.length) {
			powersTemplate = `&lt;h2 style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;Powers&lt;&#x2F;h2&gt;&lt;ul&gt;`;
			char.powers.forEach((power) =&gt; {
				powersTemplate += `&lt;li style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;${% raw %}{power.name}{% endraw %}&lt;&#x2F;li&gt;`;
			});
			powersTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
		} 

		if(char.teams.length) {
			teamsTemplate = `&lt;h2 style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;Teams&lt;&#x2F;h2&gt;&lt;ul&gt;`;
			char.teams.forEach((team) =&gt; {
				teamsTemplate += `&lt;li style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;&lt;a href=&quot;${% raw %}{team.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;${% raw %}{team.name}{% endraw %}&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;`;
			});
			teamsTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
		} 

		if(char.creators.length) {
			creatorsTemplate = `&lt;h2 style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;Creators&lt;&#x2F;h2&gt;&lt;ul&gt;`;
			char.creators.forEach((creator) =&gt; {
				creatorsTemplate += `&lt;li style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;&lt;a href=&quot;${% raw %}{creator.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;${% raw %}{creator.name}{% endraw %}&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;`;
			});
			creatorsTemplate += &#x27;&lt;&#x2F;ul&gt;&#x27;;
		} 

		let mainTemplate = `
		&lt;html&gt;
		&lt;head&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;link href=&quot;https:&#x2F;&#x2F;fonts.googleapis.com&#x2F;css?family=Bangers&quot; rel=&quot;stylesheet&quot;&gt;
		&lt;&#x2F;head&gt;
		&lt;body style=&quot;background-color: #ffeb3b;padding: 10px&quot;&gt;

		&lt;h1 style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;${% raw %}{char.name}{% endraw %}&lt;&#x2F;h1&gt;
		&lt;p style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;
			&lt;strong&gt;Publisher:&lt;&#x2F;strong&gt; ${% raw %}{publisher}{% endraw %}&lt;br&#x2F;&gt;
			&lt;strong&gt;First Issue:&lt;&#x2F;strong&gt; &lt;a href=&quot;${% raw %}{char.first_issue.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;${% raw %}{char.first_issue.volume.name}{% endraw %} ${% raw %}{char.first_issue.issue_number}{% endraw %} (${% raw %}{char.first_issue.cover_date}{% endraw %})&lt;&#x2F;a&gt;&lt;br&#x2F;&gt;
		&lt;&#x2F;p&gt;

		&lt;a href=&quot;${% raw %}{char.site_detail_url}{% endraw %}&quot; target=&quot;_new&quot;&gt;&lt;img style=&quot;max-width:500px&quot; title=&quot;Character Image&quot; src=&quot;${% raw %}{image}{% endraw %}&quot;&gt;&lt;&#x2F;a&gt;
		&lt;p style=&quot;font-family: &#x27;Banger&#x27;, cursive;&quot;&gt;${% raw %}{char.description}{% endraw %}&lt;&#x2F;p&gt;

		${% raw %}{creatorsTemplate}{% endraw %}
		${% raw %}{powersTemplate}{% endraw %}
		${% raw %}{teamsTemplate}{% endraw %}
		${% raw %}{friendsTemplate}{% endraw %}
		${% raw %}{enemiesTemplate}{% endraw %}

		&lt;&#x2F;body&gt;
		&lt;&#x2F;html&gt;
		`;

		let mailContent = new helper.Content(&#x27;text&#x2F;html&#x27;, mainTemplate);
		let mail = new helper.Mail(from_email, subject, to_email, mailContent);

		let sg = require(&#x27;sendgrid&#x27;)(SG_KEY);
		
		var request = sg.emptyRequest({
			method: &#x27;POST&#x27;,
			path: &#x27;&#x2F;v3&#x2F;mail&#x2F;send&#x27;,
			body: mail.toJSON()
		});

		sg.API(request, function(error, response) {
			if(error) {
				console.log(&#x27;error in sg&#x27;, error.response.body);
				reject({% raw %}{error:error.message}{% endraw %}) 
			} else {
				console.log(&#x27;it should be well&#x27;);
				resolve({% raw %}{success:1}{% endraw %});
			}
		});

	});

}
</code></pre>

That's a big chunk of code, but honestly, most of it is the same from the desktop demo. I expect a character to be passed in, I render it, and then use SendGrid to email it. I created a sequence that joined my actions together and fired it off and... it worked! Mostly...

![Kinda cool..](https://static.raymondcamden.com/images/2017/6/randomchar1.jpg)

It's not the prettiest email, but outside of the image not loading, it worked. Clicking the "load image" thing worked fine so I thought - ok - let me figure out why the image isn't loading by default.

Everything ended happily ever after.

Ok, no. So GMail has a setting for external images but I already had it on:

![WTF Google](https://static.raymondcamden.com/images/2017/6/randomchar2.jpg)

I clicked the "Learn more" link because I always want to learn more, and discovered this gem:

<blockquote>Note: If Gmail thinks a sender or message is suspicious, you won’t see images automatically. Instead, you'll be asked if you want to see the image.</blockquote>

Err... ok. I did a tiny bit of research into determining if there was something I could do to make GMail think email from me via SendGrid was super duper safe, but it seemed like a lot of work. I then decided - why not try encoding the image via base64 and data URLs. That should be easy, right?

Of course not - it took me a good hour just to get the data right. Mainly because I missed a little tip in the Request docs that say you have to disable encoding if you're working with binary data. That didn't frustrate me at all. 

Eventually I got the base64 text right (verified via a regular HTML file) and I did my test. And nothing. No error, but the image just didn't show up. I went into dev tools and GMail had simply removed it. I have no idea why. From what I saw from Googling (everything comes back to the big G), GMail *does* support data URLs, but it never worked for me. Hell, I even tried the weird CID/attachment thing and that didn't work either. If folks want to see what I tried before I reverted, you can find the ocde here: https://github.com/cfjedimaster/Serverless-Examples/blob/master/comicvine/dailyEmail.fail.js

On a whim, I decided, why not take a look at the email on my phone.

AND OF COURSE, ON THE MOBILE DEVICE, IT LOADED THE EXTERNAL IMAGE AUTOMATICALLY.

sigh

But just for fun, it decided to not support the remote font. 

![Oh for f***'s sake](https://static.raymondcamden.com/images/2017/6/randomchar3.jpg)

I removed the font styles from the text and it ended up ok.

![Good enough for a stupid demo](https://static.raymondcamden.com/images/2017/6/randomchar4.jpg)

The final version of the code is up here - https://github.com/cfjedimaster/Serverless-Examples/blob/master/comicvine/dailyEmail.js. The final bit was to make a cron trigger, a rule, and then see how well I did my cron when, and if, I get the email tomorrow morning.