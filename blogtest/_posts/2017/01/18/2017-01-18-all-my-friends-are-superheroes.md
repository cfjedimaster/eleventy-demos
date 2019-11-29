---
layout: post
title: "All My Friends Are Superheroes"
date: "2017-01-18T09:24:00-07:00"
categories: [serverless,mobile]
tags: [openwhisk,ionic]
banner_image: /images/banners/marvelow2.jpg
permalink: /2017/01/18/all-my-friends-are-superheroes
---

A few weeks back I created an [incredibly practical and not silly at all](https://www.raymondcamden.com/2016/12/12/working-with-ionic-native-contact-fixer) application
that went through your device's contact list and "fixed" those contacts that didn't have a proper picture. The "fix"
was to simply give them a random cat picture. That seems totally sensible, right?

<img src="https://static.raymondcamden.com/images/2016/12/ahbig.png" alt="This is practical" class="imgborder">

I was thinking about this during the weekend and it occured to me that there is an even *cooler* way we
could fix our friends - by turning them all into superheros with the [Marvel API](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwj4zLi5gczRAhWCyyYKHftMB1EQFggcMAA&url=https{% raw %}%3A%{% endraw %}2F{% raw %}%2Fdeveloper.marvel.com%{% endraw %}2F&usg=AFQjCNFdznPhIoBwlyArBBv4VUdOlayoaA&sig2=vCy0rkX7mzLTp3bEnEP9Eg). I've built a few apps with this API in the past (I'll link to them at the end) and I knew it
had an API for returning characters. I thought - why not simply select a random character from the API and assign it to each 
of my contacts without a picture?

The Character endpoint of the Marvel API does not allow for random selections so I hacked up my own solution. First, 
I did a generic GET call on the API to get the first page of results. In that test, I was able to see the total number of characters:

![Interactive tester](https://static.raymondcamden.com/images/2017/1/marvelow1.jpg)

Given that I assume, but certainly can't verify, that they have IDs from 1 to 1485, I decided to simply select a random number between them. (I ended up going a bit
below 1485 just to feel a bit safer.) I figured this would be an excellent use of [OpenWhisk](https://developer.ibm.com/openwhisk/), so I wrote up a quick, and simple, action:

<pre><code class="language-javascript">
var request = require(&#x27;request&#x27;);
var crypto = require(&#x27;crypto&#x27;);

const publicKey = &#x27;my api brings all the boys to the yard&#x27;;
const privateKey = &#x27;damn right its better than yours&#x27;;

&#x2F;*
This number came from searching for characters and doing no filter. The
API said there was 1485 total results. I dropped it down to 1400 to allow
for possible deletes in the future.
*&#x2F;
const total = 1400;

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main() {

    return new Promise(function(resolve, reject) {

        let url = &#x27;https:&#x2F;&#x2F;gateway.marvel.com:443&#x2F;v1&#x2F;public&#x2F;characters?limit=1&amp;apikey=&#x27;
        +publicKey+&#x27;&amp;offset=&#x27;;
        
        let selected = getRandomInt(0, total);
        url += selected;

        &#x2F;&#x2F; add hash
        let ts = new Date().getTime();
        let hash = crypto.createHash(&#x27;md5&#x27;).update(ts + privateKey + publicKey).digest(&#x27;hex&#x27;);

        url += &#x27;&amp;hash=&#x27;+encodeURIComponent(hash)+&#x27;&amp;ts=&#x27;+ts;

        request.get(url, function(error, response, body) {
            if(error) return reject(error);
            let result = JSON.parse(body).data.results[0];

            let character = {
                name:result.name,
                description:result.description,
                picture:result.thumbnail.path + &#x27;.&#x27; + result.thumbnail.extension,
                url:&#x27;&#x27;
            };
            if(result.urls &amp;&amp; result.urls.length) {
                result.urls.forEach(function(e) {
                    if(e.type === &#x27;detail&#x27;) character.url = e.url;
                });
            }
            resolve(character);
        });

    });
}

exports.main = main;
</code></pre>

I deployed this to OpenWhisk as a [zipped action](https://www.raymondcamden.com/2017/01/10/creating-packaged-actions-in-openwhisk) since
crypo wasn't supported out of the box. (As an aside, that's wrong, but it's a long story, so don't worry about it now.) I then used one more
<code>wsk</code> code to create the GET API, and I was done. And literally, that's it. 55 lines of code or so
and the only real complex aspect is the hash. I do remove quite a bit of the Character record just because I didn't think
it was necessary. I'm returning just the name, description, picture, and possibly a URL.

You can see this in action here: https://3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net/api/getRandom

So yeah, I'm building something totally stupid and impractical here, but I freaking love how easy it was to deploy the API to Bluemix. As I said, I've got 50ish lines of code
and I'm done, and as a developer, I think that royally kicks ass.

Ok, so what about the app? I'm not going to go through all the code since I shared it in the [earlier post](https://www.raymondcamden.com/2016/12/12/working-with-ionic-native-contact-fixer). The basics were - get all 
contacts, loop over each, and if they don't have a picture, "fix it", so let's focus on that code block.

<pre><code class="language-javascript">
Contacts.find([&quot;name&quot;]).then((res) =&gt; {

	res.forEach( (contact:Contact) =&gt; {

	if(!contact.photos) {
		console.log(&#x27;FIXING &#x27;+contact.name.formatted);
		&#x2F;&#x2F;console.log(contact);

		proms.push(new Promise( (resolve, reject) =&gt; {

		this.superHero.getSuperHero().subscribe((res)=&gt;{
			console.log(&#x27;super hero is &#x27;+JSON.stringify(res));              
			this.toDataUrl(res.picture, function(s) {

			var f = new ContactField(&#x27;base64&#x27;,s,true);

			contact.photos = [];
			contact.photos.push(f);
			contact.nickname = res.name;

			if(!contact.urls) contact.urls = [];
			contact.urls.push({% raw %}{type:&quot;other&quot;,value:res.url}{% endraw %});

			console.log(&#x27;FIXED &#x27;+contact.name.formatted);
			contact.save();
			fixed++;
			resolve();
			
			});

		});
		

		}));
	}

	});

	Promise.all(proms).then( (res) =&gt; {
	
		loader.dismissAll();

		console.log(&#x27;all done, fixed is  &#x27;+fixed);
		let subTitle, button;

		if(fixed === 0) {
			subTitle = &quot;Sorry, but every single one of your contacts had a picture. I did nothing.&quot;;
			button = &quot;Sad Face&quot;;
		} else {
			subTitle = `I&#x27;ve updated ${% raw %}{fixed}{% endraw %} contact(s). Enjoy!`;
			button = &quot;Awesome&quot;;      
		}

		this.alertCtrl.create({
			title:&#x27;Contacts Updated&#x27;,
			subTitle:subTitle,
			buttons:[button]
		}).present();

	});

});
</code></pre>

Previously the logic to handle finding a random cat was synchronous, but now we've got an asynch call out to my 
service so I had to properly handle that in my loop. Everything is still wrapped in a Promise though because I'm still
converting the image to base64 for storage on the phone. (And that's probably a violation of the API, but I'm not releasing this to the market, so, yeah.) Outside of that, the code is the
same. I call the API in this simple provider:

<pre><code class="language-javascript">
import {% raw %}{ Injectable }{% endraw %} from &#x27;@angular&#x2F;core&#x27;;
import {% raw %}{ Http }{% endraw %} from &#x27;@angular&#x2F;http&#x27;;
import &#x27;rxjs&#x2F;add&#x2F;operator&#x2F;map&#x27;;
import &#x27;rxjs&#x2F;add&#x2F;operator&#x2F;toPromise&#x27;;

@Injectable()
export class SuperHero {

  apiUrl:string = &#x27;https:&#x2F;&#x2F;3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net&#x2F;api&#x2F;getRandom&#x27;;

  constructor(public http: Http) {
  }

  getSuperHero() {
    return this.http.get(this.apiUrl + &#x27;?safaricanbiteme=&#x27;+Math.random()).map(res =&gt; res.json());
  }

}
</code></pre>

So what's with the random code at the end? See this [post](https://www.raymondcamden.com/2015/07/16/safari-and-http-caching) about a stupid Safari caching bug that impacts it. If you want
to see the rest of the Ionic code, you can find it here: https://github.com/cfjedimaster/Cordova-Examples/tree/master/fixcontacts2a

And the result?

![Awesome](https://static.raymondcamden.com/images/2017/1/marvelow2.png)

Pure awesomeness. (Ok, maybe just to me.) If your curious about my other uses of the Marvel API, here are a few links:

* [Examples of the Marvel API](https://www.raymondcamden.com/2014/02/02/Examples-of-the-Marvel-API/)
* [Using the Marvel API with IBM Watson](https://www.raymondcamden.com/2015/05/26/using-the-marvel-api-with-ibm-watson)
* [Building a Twitter bot to display random comic book covers](https://www.raymondcamden.com/2016/02/22/building-a-twitter-bot-to-display-random-comic-book-covers/)