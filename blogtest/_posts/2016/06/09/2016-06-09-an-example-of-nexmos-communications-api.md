---
layout: post
title: "An example of Nexmo's Communications API"
date: "2016-06-09T13:16:00-07:00"
categories: [development]
tags: [nodejs]
banner_image: /images/banners/nexmo.jpg
permalink: /2016/06/09/an-example-of-nexmos-communications-api
---

Earlier this week I got a pretty interesting request from a client: He wanted to use a service that would make a voice call to a number, ask them to record a message, and then store the result. He had an API already in mind, [Nexmo](https://www.nexmo.com/). 

<!--more-->

Nexmo has a suite of APIs related to communication, of which voice processing is just one of them. Their [Voice API](https://www.nexmo.com/products/voice/) covers a variety of different aspects including the ability to design a complete "phone tree" - you know - the "Dial 1 if you want X, Dial 2 if you want Y" thing we all love. Their docs are good too, but I had some difficulty wrapping my head around the process first. 

So given our need (given a phone number, call me and get a recording), the process works like so:

1) Prompt the user for the phone number.

2) Your server code makes a HTTP request to Nexo saying, "Hey, I want you to call this number, and I want you to execute the script at URL so and so."

This is the part that confused me. Instead of just telling the API want to do, you have to set up a script on your server that includes the directions for the call. This is written in "VoiceXML", which I had never heard of before but anyone can write XML. 

3) Ok, so you have to build that XML, and the XML is essentially the script that Nexmo will use when calling you. This is basic TTS (Text to Speech) stuff so you want to be a bit careful what you type. My client had a web 2.0 name, and you know what those look like, so I spelled it phonetically instead. You also include instructions telling Nexmo where to send the recording. You can also include other information, like a session ID, etc, to help associate the recording with the file.

All in all not too terribly complex. So how about a demo? First off - before you use this code you will need to [sign up](https://dashboard.nexmo.com/sign-up) for an account. This will give you your account keys as well as setup a number that is usable for receiving calls. You get 10 English pounds of credit which I think is like 5 million American dollars or so. No idea. In all my testing though I've only used about 25% of my credit so it has been enough so far. I'll skip over the code that is boilerplate Node/Express, but if anyone wants a complete zip, just ask. 

So my first page is just a regular HTML page:

<pre><code class="language-javascript">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;/title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
	&lt;/head&gt;
	&lt;body&gt;

	&lt;h2&gt;Enter Your Phone Number&lt;/h2&gt;

	&lt;form id=&quot;telForm&quot;&gt;
		&lt;input type=&quot;tel&quot; id=&quot;tel&quot; placeholder=&quot;Phone Number&quot; value=&quot;3374128987&quot; required&gt;
		&lt;input type=&quot;submit&quot; value=&quot;Call&quot;&gt;
	&lt;/form&gt;
	&lt;div id=&quot;result&quot;&gt;&lt;/div&gt;
	
	&lt;script type=&quot;text/javascript&quot; src=&quot;http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js&quot;&gt;&lt;/script&gt;
	&lt;script src=&quot;js/app.js&quot;&gt;&lt;/script&gt;
	&lt;/body&gt;
&lt;/html&gt;
</code></pre>

Nothing too scary here. Note that I used both a `placeholder` and a `value` attribute for the code, which doesn't make sense, but whenever I'm working on code that includes a form, I almost always hard code crap into my forms so I don't have to type. The idea being that I'd remove those hard coded values before going into production. The JavaScript is literally nothing but "listen for the form submit, get the phone number, and do an Ajax post to `/ring`. Again, I'll happily share it if folks want to see it. Ok, so let's take a look at the Node side. Here is a snippet of app.js:

<pre><code class="language-javascript">
var nexmoAPI = require('./nexmo');

app.set('domain', 'http://2d518ed0.ngrok.io');

var nexmo = new nexmoAPI('my key','some other value','19418773508');

app.post('/ring', function(req, res) {
	var number = req.body.number;
	console.log('begin ring process to '+number);
	nexmo.call(number,app.get('domain') + '/response', function(result) {
		res.send('Done');
	});
});
</code></pre>

So a few things here. First, I'm getting a copy of my little Nexmo "library", which right now is all of one method that I'll show in a second. I initialize it with my account keys and a "from" number that will be used when dialing. My `/ring` handler looks for a form POST with the number to dial and then runs a method on my library called `call`. I pass in the phone number to call as well as the URL Nexmo should use to get the VoiceXML stuff I mentioned before.

This is where we do a quick digression. For Nexmo to work, it needs to hit your server, which in development can be a problem. But then I remembered the awesome [ngrok](https://ngrok.com/). This is a free service that creates a tunnel on the Internet to your local machine. I even wrote about the service way back in 2014 ([Expose Yourself with ngrok](http://modernweb.com/2014/04/28/expose-yourself-with-ngrok/)). 

At the command line, I simply typed `ngrok http 3000` and I had my tunnel set up:

![ngrok](https://static.raymondcamden.com/images/2016/06/ngrok1.jpg)

Along with a nice 'report' in the terminal, you also get a cool web based admin which lets you inspect the calls to and from and your server. For something like the Nexmo API, this was *crucial* and incredibly helpful. While I don't have it in my demo here, the original demo I did for my client had dynamic aspects to the VoiceXML and ngrok was able to show me the XML I was sending back to Nexmo. In case you're curious, here is how it looked for my testing.

<img src="https://static.raymondcamden.com/images/2016/06/ngrok2.jpg" class="imgborder">

Ok, so once ngrok gave me an 'external' domain, I was able to use it in my code. You see it in use in the code above, now let's look at my `nexmo.call` method.

<pre><code class="language-javascript">
var request = require('request');

var Nexmo = function(key,secret,defaultFrom) {
	this.config = {
		key:key,
		secret:secret,
		defaultFrom:defaultFrom
	};
	return this;
};

Nexmo.prototype.call = function(number,responseUrl,cb) {
	var theUrl = `https://rest.nexmo.com/call/json?api_key=${% raw %}{this.config.key}{% endraw %}&api_secret=${% raw %}{this.config.secret}{% endraw %}&to=${% raw %}{number}{% endraw %}&from=${% raw %}{this.config.defaultFrom}{% endraw %}&answer_url=${% raw %}{encodeURI(responseUrl)}{% endraw %}`;
	console.log('theUrl',theUrl);

	request(theUrl, function(error, response, body) {
		var response = JSON.parse((body));
		console.log(body);
		cb(1);
	});
}

module.exports = Nexmo;
</code></pre>

As I said, I've only built one method, and to be clear, the APIs at Nexmo are quite a bit more involved, but this was sufficient to do what my client needed. As you can see, all of the arguments passed to `call` basically just get appended to a URL. That includes the `responseUrl` thats a route on my local app that ngrok will proxy access for me. Whew. Got all that? And yeah - I'm not doing any error handling in this demo. Ok, so let's look at `/response`:

<pre><code class="language-javascript">
/*
I handle the vxml response. I need to replace a grand total of one variable. I could
use Handlebars/etc, but that seemed silly for a simple replacement.

Using a sync file read since it is read one time.
*/
var responseVXML = fs.readFileSync('./response.vxml').toString();
app.get('/response', function(req, res) {
	var saveURL = app.get('domain') + '/save';
	var toSend = responseVXML.replace('{% raw %}{{saveURL}}{% endraw %}',saveURL);
	res.send(toSend);
});
</code></pre>

The comments in the handler mostly explain what I'm doing. I wrote my VoiceXML response as a file but I needed one small part of it to be dynamic. I could have used a templating language like Handlebars, but since it was literally one value, I just went with a quick string replace. Most likely that's something I'd change later on if this project got more complex. Here is the XML:

<pre><code class="language-javascript">
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;vxml version=&quot;2.1&quot;&gt;
    &lt;form&gt;
	&lt;record name=&quot;recording&quot; beep=&quot;true&quot; dtmfterm=&quot;true&quot; maxtime=&quot;100s&quot;&gt;
        &lt;prompt&gt;Hello from a Node.js app. Leave me a message.&lt;/prompt&gt;
        &lt;prompt&gt;When done, please hit the pound key.&lt;/prompt&gt;
		&lt;filled&gt;
			&lt;prompt&gt;
				Your recording was saved. Thank you.
			&lt;/prompt&gt;
			&lt;submit next=&quot;{% raw %}{{saveURL}}{% endraw %}&quot; method=&quot;post&quot; namelist=&quot;recording&quot; enctype=&quot;multipart/form-data&quot;/&gt;
		&lt;/filled&gt;
	&lt;/record&gt;
    &lt;/form&gt;
&lt;/vxml&gt;
</code></pre>

So, VoiceXML is rather complex (see the docs over on Nexmo for more examples), but what we've got here is a packet that includes two sentences that will be read to the user over the phone. You can tweak the voice if you want. I specify where Nexmo should send the recording, and if I wanted to include additional information, I'd add it to my XML. Most likely you will need to so you can pass along a unique identifier for the request that you can use in the final step, where the recording data is sent back. 

As an aside, the system worked really well in terms of pronunciation. As I said, I had to handle a "weird web name" but outside of that it was fine. Also, in one test I kinda mumbled real soft, and the system prompted again for the recording automatically. All in all it felt very polished and professional. And look - I actually recording a call from my iPhone. Pardon the kids who - even though I asked them to be quiet - decided it wasn't time for that. (The phone call comes in around 10 seconds into the video. Sorry for not trimming.)

<iframe width="480" height="360" src="https://www.youtube.com/embed/kQtBk-LBdpQ" frameborder="0" allowfullscreen></iframe>

Alright - so let's look at the final aspect - saving the recording. Remember, in the previous code, we told Nexmo what to say and where to send it. It can send both regular form fields and the audio all in one post. I used Formidable to make processing this simple.

<pre><code class="language-javascript">
app.post('/save', function(req, res) {
	console.log('about to save like a boss');
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		console.log('fields', fields);
		console.log('files',files);
		if(files.recording) {
			console.log('Yes, we have a recording.');
			fs.createReadStream(files.recording.path).pipe(fs.createWriteStream('./recordings/'+files.recording.name));
		}
	});
	res.send(`
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;vxml version = &quot;2.1&quot; &gt;
   &lt;form&gt;
      &lt;block&gt;
         &lt;exit/&gt;
      &lt;/block&gt;
   &lt;/form&gt;
&lt;/vxml&gt;
		`);
});
</code></pre>

Yeah, that's a big ugly XML packet I'm sending back there in the end. Nexmo seems to work fine withouth a 'formal' XML response, but I believe this is what you should do and so I did it. (Although again, the code here could be cleaner.)

In case your curious, Nexmo sent the recording *very* fast. I saw it show up on my server before the "Your recording was saved." text was spoken to me. You can listen to my last test here:

<a href="https://static.raymondcamden.com/images/2016/06/recording-1465500970679.wav" target="_blank">recording-1465500970679.wav</a>

Hopefully this was helpful. Let me know if you have any questions by leaving a comment below.