---
layout: post
title: "From Actions to Sequences to Services"
date: "2017-04-07T12:56:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: /images/banners/from_actions_to_seq.jpg
permalink: /2017/04/07/from-actions-to-sequences-to-services
---

I've been thinking a lot this week about [OpenWhisk](https://developer.ibm.com/openwhisk/) and sequences, and more precisely, how serverless in general can help development by letting you put various actions together to form new ones. Much like how Legos can be broken apart and put together in new configurations, I'm getting really excited the possibilities of serverless actions when they are chained together.

To be clear, I know I'm mainly talking about code reuse here and that is *absolutely* nothing new. One of the reasons I love Node so much is the ease of use of npm and grabbing various disparate packages to include in my app. But it just feels a bit more different with serverless, more powerful and easier. 

First off - I can combine actions from completely different platforms. One sequence could be made up of Python, Swift, and Node code, and I wouldn't even have to care. 

Secondly - I feel like serverless code is even more tailored to this 'mashup' type approach. By forcing you to write code that only takes input and returns output, it feels even more suited to be used in combination with each other.

I'm probably being a bit overly zealous about this, but as I said, I'm excited about it! In that vein, I've built two pretty cool demos of this in action I wanted to share. 

A little over two weeks ago I [wrote](https://www.raymondcamden.com/2017/03/22/using-ibm-watson-tone-analzyer-in-openwhisk) an OpenWhisk package to work with IBM Watson's [Tone Analyzer](https://www.ibm.com/watson/developercloud/tone-analyzer.html) service. Since then, I've also been working on other various simple actions, including one to [work with Twitter](https://github.com/cfjedimaster/twitter-openwhisk) and another to work with RSS feeds. Here's the first demo I created.

RSS to Tone
---

For my first demo, I created a sequence that combines two actions:

* RSS to Entries - this action simply takes a RSS url and returns an array of entries.
* Tone Analyzer - this takes a string and returns tone analysis on it.

In order to get these together, I created a third action I called flattenRSSEntries. All this action did was massage the data from one action to make it appropriate for another action. (I've got some thoughts on this at the end of the article.) Here is that action.

<pre><code class="language-javascript">function main(args) {

	let string = args.entries.reduce( (cur, val) =&gt; {
		if(val.description) cur+=val.description;
		return cur;
	}, &#x27;\n&#x27;).trim();

	return {
		text:string,
		sentences:false,
		isHTML:true
	}

}

exports.main = main;
</code></pre>

Essentially - take the array - reduce it to the description from the RSS entry, and then spit out the output for the tone analyzer. 

And yeah - that's it. I literally just had to write 10ish lines of code for the glue. I then made a sequence of the three actions:

`wsk action update rssToTone --sequence utils/rssentries,flattenRSSEntries,
mywatson/tone`

And then I can run it at the command line like so: 

`wsk action invoke rssToTone --param rssurl https://www.raymondcamden.com/index.xml -b -r`

Here is the output:

<pre><code class="language-javascript">{
    "document_tone": {
        "tone_categories": [
            {
                "category_id": "emotion_tone",
                "category_name": "Emotion Tone",
                "tones": [
                    {
                        "score": 0.147034,
                        "tone_id": "anger",
                        "tone_name": "Anger"
                    },
                    {
                        "score": 0.093125,
                        "tone_id": "disgust",
                        "tone_name": "Disgust"
                    },
                    {
                        "score": 0.130901,
                        "tone_id": "fear",
                        "tone_name": "Fear"
                    },
                    {
                        "score": 0.575317,
                        "tone_id": "joy",
                        "tone_name": "Joy"
                    },
                    {
                        "score": 0.575186,
                        "tone_id": "sadness",
                        "tone_name": "Sadness"
                    }
                ]
            },
            {
                "category_id": "language_tone",
                "category_name": "Language Tone",
                "tones": [
                    {
                        "score": 0.815472,
                        "tone_id": "analytical",
                        "tone_name": "Analytical"
                    },
                    {
                        "score": 0,
                        "tone_id": "confident",
                        "tone_name": "Confident"
                    },
                    {
                        "score": 0.543053,
                        "tone_id": "tentative",
                        "tone_name": "Tentative"
                    }
                ]
            },
            {
                "category_id": "social_tone",
                "category_name": "Social Tone",
                "tones": [
                    {
                        "score": 0.645549,
                        "tone_id": "openness_big5",
                        "tone_name": "Openness"
                    },
                    {
                        "score": 0.228331,
                        "tone_id": "conscientiousness_big5",
                        "tone_name": "Conscientiousness"
                    },
                    {
                        "score": 0.228709,
                        "tone_id": "extraversion_big5",
                        "tone_name": "Extraversion"
                    },
                    {
                        "score": 0.174568,
                        "tone_id": "agreeableness_big5",
                        "tone_name": "Agreeableness"
                    },
                    {
                        "score": 0.611825,
                        "tone_id": "emotional_range_big5",
                        "tone_name": "Emotional Range"
                    }
                ]
            }
        ]
    }
}
</code></pre>

Apparently my strongest emotions are a mix of sadness and joy. Ok, I can live with that. ;)

Twitter to Tone
---

For my second demo, I created a sequence that combines two actions:

* Get Tweets - this action simply lets you search for a Twitter account or keyword. I used it to get tweets for an account.
* Tone Analyzer - this takes a string and returns tone analysis on it.

To combine these two, once again I made a new action called flattenTweets. This was a bit more complex. I decided to remove retweets from the sample output. I also considered removing replies, but was worried I wouldn't have enough data. As it stands, it still feels like the input may not be deep enough for good analysis, but, I figure I can worry about that later. Here is that action:

<pre><code class="language-javascript">function main(args) {

	&#x2F;*
	only add if no retweeted status
	*&#x2F;
	let string = args.tweets.reduce( (cur, val) =&gt; {
		if(val.text &amp;&amp; !val.retweeted_status) cur+=&#x27; &#x27;+val.text;
		return cur;
	}, &#x27;&#x27;).trim();

	return {
		text:string,
		sentences:false,
		isHTML:true
	}

}

exports.main = main;
</code></pre>

As before, I made my sequence, and then I could call it from the CLI like so:

`wsk action invoke twitterToTone --param account raymondcamden -b -r`

If your curious, this is the result on my Twitter feed.

<pre><code class="language-javascript">{
    "document_tone": {
        "tone_categories": [
            {
                "category_id": "emotion_tone",
                "category_name": "Emotion Tone",
                "tones": [
                    {
                        "score": 0.061874,
                        "tone_id": "anger",
                        "tone_name": "Anger"
                    },
                    {
                        "score": 0.532221,
                        "tone_id": "disgust",
                        "tone_name": "Disgust"
                    },
                    {
                        "score": 0.092915,
                        "tone_id": "fear",
                        "tone_name": "Fear"
                    },
                    {
                        "score": 0.586786,
                        "tone_id": "joy",
                        "tone_name": "Joy"
                    },
                    {
                        "score": 0.539941,
                        "tone_id": "sadness",
                        "tone_name": "Sadness"
                    }
                ]
            },
            {
                "category_id": "language_tone",
                "category_name": "Language Tone",
                "tones": [
                    {
                        "score": 0,
                        "tone_id": "analytical",
                        "tone_name": "Analytical"
                    },
                    {
                        "score": 0,
                        "tone_id": "confident",
                        "tone_name": "Confident"
                    },
                    {
                        "score": 0.63355,
                        "tone_id": "tentative",
                        "tone_name": "Tentative"
                    }
                ]
            },
            {
                "category_id": "social_tone",
                "category_name": "Social Tone",
                "tones": [
                    {
                        "score": 0.040865,
                        "tone_id": "openness_big5",
                        "tone_name": "Openness"
                    },
                    {
                        "score": 0,
                        "tone_id": "conscientiousness_big5",
                        "tone_name": "Conscientiousness"
                    },
                    {
                        "score": 0.00002,
                        "tone_id": "extraversion_big5",
                        "tone_name": "Extraversion"
                    },
                    {
                        "score": 0.011157,
                        "tone_id": "agreeableness_big5",
                        "tone_name": "Agreeableness"
                    },
                    {
                        "score": 0.007357,
                        "tone_id": "emotional_range_big5",
                        "tone_name": "Emotional Range"
                    }
                ]
            }
        ]
    }
}
</code></pre>

The `disgust` was a bit weird, but I was kind of arguing with someone (nice arguing I'd say!) so perhaps it came from that.

Conclusion
---

First, let me share the repo where you can find this code: https://github.com/cfjedimaster/Serverless-Examples. Let me know in the comments below if you have any questions about this.

I just can't get over how... inviting this feels. One of the things I've begun to realize as I grow older as a developer, some platforms are naturally fun to play with. Some naturally invite experimentation and just trying new things. While most platforms allow for the same types of things, I'm just much more eager to use something that encourages my ability to create silly demos (usually involving cats, but today I failed that I suppose). This is why I'm loving serverless and OpenWhisk - I feel like I can do anything.

One More Thing
---

Ok, seriously, you can stop reading now and I won't be offended. So one aspect of this that kinda - I won't say bugged me - but stuck in my craw a bit - was that I had to write my custom 'joiner' code for my sequences to work. For the Twitter one, it kinda made sense as I wasn't just flattening an array into a string, but also applying some conditional logic as a filter. For the RSS one though I was literally just taking one key from an array of objects. 

For that, it would have been cool if I could have used something like [JSONPath](https://github.com/json-path/JsonPath) to manipulate the results. In cases like that, I'd like to be able to skip having a 'combiner' action at all and maybe just apply it as metadata. 

Now - you may say - what about building a JSONPath action? Ok, but here's the problem with that. Right now in OpenWhisk you can't provide a default parameter to an action in a sequence outside of the first action. So assuming I had a JSONPath action, when I made my sequence, I couldn't specify a default parameter for the path and have it applied to the sequence as a whole. It would be passed to the first action, but *not* passed to the second, unless I modify my first action which is not something you want to do anyway. Your actions should be atomic, stand alone, etc, and not have knowledge about outside things like that.

To be clear, both 'joiners' took me about 5 minutes of work to do. I just can't help thinking that *maybe* there is a better, cooler way? Then again - maybe not. I kinda said that this part of the blog entry was a bit off topic from the rest, but I'd love any feedback on this area of concern as well.