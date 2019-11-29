---
layout: post
title: "An Example of Sessions with Amazon Alexa Skills"
date: "2017-09-01T09:42:00-07:00"
categories: [development]
tags: [alexa]
banner_image: 
permalink: /2017/09/01/an-example-of-sessions-with-amazon-alexa-skills
---

Just a quick post today. I worked on an Alexa skill a few weeks ago for a presentation that involved sessions. I had trouble finding a good example that I could wrap my head around, and while I don't think this code is very well done, I thought I'd at least share it in case others were having issues as well.

So first off, what are sessions in terms of Alexa? I've been working with sessions and server-side code for near twenty years so I just kind of assume everyone gets the idea, but basically it is a set of data associated with the current person and their current use of a system. That later part is crucial. If I have a conversation with an Alexa skill, I'm starting a session. If I stop talking and speak to it again later, it's another session. So this isn't data that persists forever, it's data just for the current conversation.

Session data is passed as part of the request data to your skill. Here is how it looks:

<pre><code class="language-javascript">"session": {
    "new": true,
    "sessionId": "SessionId.edited",
    "application": {
      "applicationId": "amzn1.ask.skill.edited"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.edited"
    }
  },
</code></pre>

The part you probably care about is attributes. Currently it is blank which represents an empty session. To set a value in the session, your response object will contain a sessionAttributes object with key value pairs. This is done at the top level of the response and at the same level as the response text. (I'll show a full example in a bit.) Basically like so:

<pre><code class="language-javascript">"sessionAttributes":{
	"name":"something"
}
</code></pre>

Finally, the other important part is to keep the session open. The response attribute of the response (yes, that sounds complex, but again, I'll show a full packet it in a bit) will simply set `shouldEndSession` to false when it wants to keep things open.

So - how about a demo? This isn't the one I built for my presentation (I'll share that later), but one I just whipped up for the blog post. The idea is to create a basic "number guessing" skill. The skill will generate a random number, let you guess, and also track how many times you tried to figure out the random number. I'll share the complete skill below, then call out various parts I think are important.

I want to stress - I'm still figuring out the best way to work with Alexa. My code feels - awkward. It works, but I'm just not terribly happy with it. Also, I'm not using the verification bits just to keep things a bit slimmer. 

<pre><code class="language-javascript">const MAX = 100;
const MIN = 1;

function main(args) {

	&#x2F;&#x2F;handle exit early
	if(args.request.type === &#x27;IntentRequest&#x27; &amp;&amp; ((args.request.intent.name === &#x27;AMAZON.StopIntent&#x27;) || (args.request.intent.name === &#x27;AMAZON.CancelIntent&#x27;))) {
		let response = {
		&quot;version&quot;: &quot;1.0&quot;,
		&quot;response&quot; :{
			&quot;shouldEndSession&quot;: true,
			&quot;outputSpeech&quot;: {
				&quot;type&quot;: &quot;PlainText&quot;,
				&quot;text&quot;: &quot;Bye!&quot;
				}
			}
		}

		return {% raw %}{response:response}{% endraw %};
	}

	&#x2F;&#x2F;treat launch like help
	let intent;
	if(args.request.type === &#x27;LaunchRequest&#x27;) {
		intent = &#x27;AMAZON.HelpIntent&#x27;;
	} else {
		intent = args.request.intent.name;
	}

	&#x2F;&#x2F;Default response object
	let response = {
		&quot;version&quot;:&quot;1.0&quot;,
		&quot;response&quot;:{
			&quot;outputSpeech&quot;: {
				&quot;type&quot;:&quot;PlainText&quot;
			}
		}
	};

	&#x2F;&#x2F;copy session over
	if(&quot;session&quot; in args &amp;&amp; &quot;attributes&quot; in args.session) {
		response.sessionAttributes = args.session.attributes;
	} else response.sessionAttributes = {};
	
	if(intent === &quot;AMAZON.HelpIntent&quot;) {

		response.response.shouldEndSession = true;
		response.response.outputSpeech.text = &quot;I&#x27;m a number guessing game. Say &#x27;Start a New Game&#x27; to begin.&quot;;

	} else if(intent === &quot;start&quot;) {

		&#x2F;&#x2F;pick a random #
		let chosen = pickNumber();
		console.log(&#x27;random number &#x27;+chosen+&#x27; selected&#x27;);

		&#x2F;&#x2F;store in session
		response.sessionAttributes.chosen = chosen;
		&#x2F;&#x2F;also track # of guesses
		response.sessionAttributes.guesses = 0;
		

		&#x2F;&#x2F;keep session open
		response.response.shouldEndSession = false;

		response.response.outputSpeech.text = &quot;I&#x27;ve selected a random number!&quot;;
		
		&#x2F;&#x2F;now prompt the user
		response.response.reprompt = {
			&quot;outputSpeech&quot;:{
				&quot;type&quot;: &quot;PlainText&quot;,
				&quot;text&quot;: &quot;What number do you guess?&quot;
			}
		};
		
	} else if(intent === &quot;numberguess&quot;) {

		&#x2F;*
		possible the user skipped starting a new game and just guessed a number, 
		if so, default:
		*&#x2F;
		if(!response.sessionAttributes.chosen) {
			response.sessionAttributes.chosen = pickNumber();
			response.sessionAttributes.guesses = 0;
		}

		let guess = args.request.intent.slots.guess.value;
		console.log(&#x27;user guessed &#x27;+guess);

		&#x2F;&#x2F;increment guesses
		++response.sessionAttributes.guesses;
		
		if(guess == response.sessionAttributes.chosen) {
			response.response.shouldEndSession = true;
			&#x2F;&#x2F;reset to a new number
			response.sessionAttributes.chosen = pickNumber();
			response.response.outputSpeech.text = &quot;You guessed right, congratulations! It took you &quot; +
			response.sessionAttributes.guesses + &quot; guesses!&quot;;
		} else {
			response.response.shouldEndSession = false;
			response.response.outputSpeech.text = &quot;Sorry, you guessed wrong. Try again!&quot;;

			&#x2F;&#x2F;now prompt the user
			response.response.reprompt = {
				&quot;outputSpeech&quot;:{
					&quot;type&quot;: &quot;PlainText&quot;,
					&quot;text&quot;: &quot;What number do you guess?&quot;
				}
			};
		}
				
	} 

	console.log(&#x27;returning &#x27;+JSON.stringify(response));
	return response;
}

function pickNumber() {
	return Math.floor(Math.random() * (MAX-MIN+1))+MIN;
}
</code></pre>

Ok, so the first bits of code aren't really too important. Notice I attempt to wrap early if the user is asking the skill to stop or shut up. After that the real work begins. This block just sets some defaults for my response object.

<pre><code class="language-javascript">let response = {
	&quot;version&quot;:&quot;1.0&quot;,
	&quot;response&quot;:{
		&quot;outputSpeech&quot;: {
			&quot;type&quot;:&quot;PlainText&quot;
		}
	}
};
</code></pre>

All of this is pretty well <a href="https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#response-format">documented</a> on the Alexa side. 

Now consider this bit:

<pre><code class="language-javascript">//copy session over
if("session" in args && "attributes" in args.session) {
	response.sessionAttributes = args.session.attributes;
} else response.sessionAttributes = {};
</code></pre>

As the comment says, I'm copying the session data all at once. As I said above, you need to pass the session values back and forth with every request. Amazon doesn't store this for you. You may ask - doesn't this have a security implication for a game? Yes. I'm going to be storing the chosen number in the session and in theory - someone could sniff the bits (although it's over HTTPS so not sure how hackable that is). If you wanted, you could use the `sessionId` value Alexa passes and store the value in Redis or some other persistence system, but that seems like overkill.

Looking at the "start" intent, you can see that setting my values is rather easy:

<pre><code class="language-javascript">//store in session
response.sessionAttributes.chosen = chosen;
//also track # of guesses
response.sessionAttributes.guesses = 0;
</code></pre>

And then I need to flag the session as staying open:

<pre><code class="language-javascript">response.response.shouldEndSession = false;
</code></pre>

Make note of the reprompt part - this is how Alexa "waits" for you to speak again. You won't need to say the skill name to "wake" Alexa, she will just wait.

<pre><code class="language-javascript">response.response.reprompt = {
	"outputSpeech":{
		"type": "PlainText",
		"text": "What number do you guess?"
	}
};
</code></pre>

And then the guess intent is basically - compare what the user said to the store chosen number. Note the use of "double equal" instead of triple:

<pre><code class="language-javascript">if(guess == response.sessionAttributes.chosen) {
</code></pre>

This was intentional as the value sent to the skill is cast to a string. I could have cast it myself, but, this felt ok. 

All in all - not too difficult, and kind of cool that you can have these types of conversations with Alexa. Again, this was my first (ok, second) attempt, so don't take this as the "best", but I hope this helps.

I created a quick video showing it in action:

<iframe width="560" height="315" src="https://www.youtube.com/embed/2McNX2MQbhs?rel=0" frameborder="0" allowfullscreen></iframe>

And yes - I cheated. I looked at the OpenWhisk terminal output to see what my number was. I could have, and should have, added logic to say if you were too high or low. You'll notice I said the same answer at the end twice. When I said 34 the first time, Alexa heard 834. In general, her voice recognition is pretty darn good, but it isn't perfect.