---
layout: post
title: "Another Vue Example - Image Recognition Service Tester"
date: "2017-09-05T15:02:00-07:00"
categories: [development]
tags: [javascript,vuejs]
banner_image: 
permalink: /2017/09/05/another-vue-example-image-recognition-service-tester
---

This weekend, I did some work updating my little Node-based [image recognition service tester](https://github.com/cfjedimaster/recogtester) testing tool. The back-end is built in Node with a front end using vanilla JavaScript and [Handlebars](http://handlebarsjs.com/). I thought it would be interesting to see what it would be like to re-write the code in [Vue](https://vuejs.org/). To be clear, nothing was broken so this was a completely arbitrary decision, but as I wanted an excuse to write some more Vue, I figured it was a good idea. As I've said though - keep in mind I'm still learning how to use Vue so what follows will probably not be "ideal" code.

Old Version
===

Let's start by quickly discussing the "old" version. I've got old in quotes there as this project is only a few months old. As I said, it was vanilla JavaScript and Handlebars, nothing too terribly complex. The front end HTML looked like so - with a *lot* cut out for space:

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;link rel=&quot;stylesheet&quot; href=&quot;css&#x2F;app.css&quot;&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

	&lt;h1&gt;Image Recognition Tester&lt;&#x2F;h1&gt;
	&lt;form id=&quot;imageForm&quot; method=&quot;post&quot; enctype=&quot;multipart&#x2F;form-data&quot;&gt;
	&lt;p&gt;
	Select an image to use for testing: 
	&lt;input type=&quot;file&quot; name=&quot;testImage&quot; id=&quot;testImage&quot;&gt;&lt;br&#x2F;&gt;
	&lt;input type=&quot;submit&quot; value=&quot;Upload&quot;&gt;
	&lt;&#x2F;p&gt;
	&lt;&#x2F;form&gt;
	&lt;img id=&quot;previewImage&quot;&gt;

	&lt;br clear=&quot;all&quot;&#x2F;&gt;

	&lt;div id=&quot;status&quot;&gt;&lt;&#x2F;div&gt;

	&lt;div id=&quot;amazonResults&quot; class=&quot;results&quot; style=&quot;display:none&quot;&gt;&lt;&#x2F;div&gt;
	&lt;div id=&quot;googleResults&quot; class=&quot;results&quot; style=&quot;display:none&quot;&gt;&lt;&#x2F;div&gt;
	&lt;div id=&quot;ibmResults&quot; class=&quot;results&quot; style=&quot;display:none&quot;&gt;&lt;&#x2F;div&gt;
	&lt;div id=&quot;msResults&quot; class=&quot;results&quot; style=&quot;display:none&quot;&gt;&lt;&#x2F;div&gt;

	&lt;script id=&quot;google-template&quot; type=&quot;text&#x2F;x-handlebars-template&quot;&gt;
	&lt;h1&gt;Google Results&lt;&#x2F;h1&gt;
	&lt;p&gt;
		Google attempts to find results across the following types: crops (hints for where to crop), faces, labels, 
		landmarks, logos, properties, safeSearch, similar, and text.
	&lt;&#x2F;p&gt;

	&lt;h3&gt;Crops&lt;&#x2F;h3&gt;
	{% raw %}{{#if crops}}{% endraw %}
		&lt;ol&gt;
		{% raw %}{{#each crops}}{% endraw %}
		&lt;li&gt;
			&lt;ul&gt;
			{% raw %}{{#each this}}{% endraw %}
			&lt;li&gt;{% raw %}{{this.x}}{% endraw %},{% raw %}{{y}}{% endraw %}&lt;&#x2F;li&gt;
			{% raw %}{{&#x2F;each}}{% endraw %}
			&lt;&#x2F;ul&gt;
		&lt;&#x2F;li&gt;
		{% raw %}{{&#x2F;each}}{% endraw %}
		&lt;&#x2F;ol&gt;
	{% raw %}{{else}}{% endraw %}
	&lt;p&gt;No crops.&lt;&#x2F;p&gt;
	{% raw %}{{&#x2F;if}}{% endraw %}

	&lt;h3&gt;Faces&lt;&#x2F;h3&gt;
	{% raw %}{{#if faces}}{% endraw %}
		&lt;p&gt;
			&lt;i&gt;Note, this report is not showing: angles, bounds, and features.&lt;&#x2F;i&gt;
		&lt;&#x2F;p&gt;
		{% raw %}{{#each faces}}{% endraw %}
		&lt;p&gt;
			Basic Details:&lt;br&#x2F;&gt;
			Anger: {% raw %}{{this.anger}}{% endraw %} (likelihood: {% raw %}{{this.angerLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
			Blurred: {% raw %}{{this.blurred}}{% endraw %}&lt;br&#x2F;&gt;
			Confidence: {% raw %}{{this.confidence}}{% endraw %}&lt;br&#x2F;&gt;
			Headware: {% raw %}{{this.headwear}}{% endraw %} (likelihood: {% raw %}{{this.headwearLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
			Joy: {% raw %}{{this.joy}}{% endraw %} (likelihood: {% raw %}{{this.joyLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
			Sorrow: {% raw %}{{this.sorrow}}{% endraw %} (likelihood: {% raw %}{{this.sorrowLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
			Surprise: {% raw %}{{this.surprise}}{% endraw %} (likelihood: {% raw %}{{this.surpriseLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
			Underexposed: {% raw %}{{this.underExposed}}{% endraw %} (likelihood: {% raw %}{{this.underExposedLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
		&lt;&#x2F;p&gt;
		{% raw %}{{&#x2F;each}}{% endraw %}
	{% raw %}{{else}}{% endraw %}
	&lt;p&gt;No faces.&lt;&#x2F;p&gt;
	{% raw %}{{&#x2F;if}}{% endraw %}
	
	&lt;h3&gt;Labels&lt;&#x2F;h3&gt;
	{% raw %}{{#if labels}}{% endraw %}
		&lt;ul&gt;
		{% raw %}{{#each labels}}{% endraw %}
		&lt;li&gt;{% raw %}{{this}}{% endraw %}&lt;&#x2F;li&gt;
		{% raw %}{{&#x2F;each}}{% endraw %}
		&lt;&#x2F;ul&gt;
	{% raw %}{{else}}{% endraw %}
	&lt;p&gt;No labels.&lt;&#x2F;p&gt;
	{% raw %}{{&#x2F;if}}{% endraw %}

	&lt;h3&gt;Landmarks&lt;&#x2F;h3&gt;
	{% raw %}{{#if landmarks}}{% endraw %}
		&lt;p&gt;&lt;i&gt;This is the &lt;b&gt;non&lt;&#x2F;b&gt; verbose response. Verbose version will include location GPS values.&lt;&#x2F;i&gt;&lt;&#x2F;p&gt;
		&lt;ul&gt;
		{% raw %}{{#each landmarks}}{% endraw %}
			&lt;li&gt;{% raw %}{{this}}{% endraw %}&lt;&#x2F;li&gt;
		{% raw %}{{&#x2F;each}}{% endraw %}
		&lt;&#x2F;ul&gt;
	{% raw %}{{else}}{% endraw %}
	&lt;p&gt;No landmarks.&lt;&#x2F;p&gt;
	{% raw %}{{&#x2F;if}}{% endraw %}

	&lt;&#x2F;script&gt;

	&lt;script src=&quot;https:&#x2F;&#x2F;cdnjs.cloudflare.com&#x2F;ajax&#x2F;libs&#x2F;handlebars.js&#x2F;4.0.10&#x2F;handlebars.min.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;script src=&quot;&#x2F;js&#x2F;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

In the above code sample, you can see a "main" body template followed by a script tag used for the Google rendering template. I cut out the three other script blocks to save space as well as some of the Google one as well. But the basic "form" of the page was:

<pre><code class="language-markup">
html for the page with empty divs for each report

a hidden template for Google
a hidden template for IBM
a hidden template for Microsoft
a hidden template for Amazon
</code></pre>

I could have done that better. Handlebars lets you build your templates in their own files and then use the CLI to compile them into functions. This saves space both on the HTML and execution time of JavaScript as well as it can skip "parsing" your template. (You can view the entire version of the template <a href="https://github.com/cfjedimaster/recogtester/blob/b548b969299a20734edb36d6c84f798bc2e0f8e6/public/index.html">here</a>).

On the JavaScript side - it was mainly DOM manipulation. I'd upload the image, call the Node code, and then pass the data to the compiled Handlebars templates. There was a lot of "hide this"/"show this" going on, but Handlebars pretty much took the data as is. I did one small bit of manipulation for something with Microsoft's service, but that was the exception. 

Here's the source code for the original version:

<pre><code class="language-javascript">let $, imageForm, imageField, imagePreview, statusDiv;
&#x2F;&#x2F;hb related
let googleRenderer, googleResults, ibmRenderer, ibmResults, msRenderer, msResults, amazonRenderer, amazonResults;

window.addEventListener(&#x27;DOMContentLoaded&#x27;, () =&gt; {
	&#x2F;&#x2F;alias jquery like a hipster
	$ = document.querySelector.bind(document);
	imageForm = $(&#x27;#imageForm&#x27;);
	imageField = $(&#x27;#testImage&#x27;);
	imagePreview = $(&#x27;#previewImage&#x27;);
	statusDiv = $(&#x27;#status&#x27;);

	imageForm.addEventListener(&#x27;submit&#x27;, doForm, false);
	imageField.addEventListener(&#x27;change&#x27;, doPreview, false);

	googleResults = $(&#x27;#googleResults&#x27;);
	googleRenderer = Handlebars.compile($(&#x27;#google-template&#x27;).innerHTML);

	ibmResults = $(&#x27;#ibmResults&#x27;);
	ibmRenderer = Handlebars.compile($(&#x27;#ibm-template&#x27;).innerHTML);

	msResults = $(&#x27;#msResults&#x27;);
	msRenderer = Handlebars.compile($(&#x27;#ms-template&#x27;).innerHTML);

	amazonResults = $(&#x27;#amazonResults&#x27;);
	amazonRenderer = Handlebars.compile($(&#x27;#amazon-template&#x27;).innerHTML);

}, false);

function doPreview() {
	if(!imageField.files || !imageField.files[0]) return;

	var reader = new FileReader();

	reader.onload = function (e) {
		imagePreview.src = e.target.result;
	}

	reader.readAsDataURL(imageField.files[0]);
	&#x2F;&#x2F;todo - clear results. as soon as you pick a new image, even if you don&#x27;t submit
	clearResults();
	statusDiv.innerHTML = &#x27;Upload image for results.&#x27;;
}

function doForm(e) {
	e.preventDefault();
	let currentImg = imageField.value;
	if(currentImg === &#x27;&#x27;) return;
	console.log(&#x27;Going to process &#x27;+currentImg);

	statusDiv.innerHTML = &#x27;&lt;i&gt;Uploading and processing - stand by...&lt;&#x2F;i&gt;&#x27;;

	let fd = new FormData();
	fd.append(&#x27;testImage&#x27;, imageField.files[0]);

	fetch(&#x27;&#x2F;test&#x27;, {
		method:&#x27;POST&#x27;,
		body:fd
	}).then( 
		response =&gt; response.json()
	).then( (result) =&gt; {
		console.log(&#x27;file result&#x27;, result.result);
		statusDiv.innerHTML = &#x27;&#x27;;
		renderResults(result.result);
	}).catch( (e) =&gt; {
		console.error(e);
	});
}

function clearResults() {
	&#x2F;&#x2F;https:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;6243000&#x2F;52160
	googleResults.style.display = &#x27;none&#x27;;
	ibmResults.style.display = &#x27;none&#x27;;
	msResults.style.display = &#x27;none&#x27;;
	amazonResults.style.display = &#x27;none&#x27;;
	googleResults.innerHTML = &#x27;&#x27;;
	ibmResults.innerHTML = &#x27;&#x27;;
	msResults.innerHTML = &#x27;&#x27;;
	amazonResults.innerHTML = &#x27;&#x27;;

}

function renderResults(data) {
	if(data.google) {
		googleResults.style.display = &#x27;block&#x27;;
		renderGoogle(data.google);
	}
	if(data.ibm) {
	ibmResults.style.display = &#x27;block&#x27;;
		renderIBM(data.ibm);
	}
	if(data.ms) {
		msResults.style.display = &#x27;block&#x27;;
		renderMS(data.ms);
	}
	if(data.amazon) {
	amazonResults.style.display = &#x27;block&#x27;;
		renderAmazon(data.amazon);
	}
}

function renderGoogle(data) {
	googleResults.innerHTML = googleRenderer(data);
}

function renderIBM(data) {

	ibmResults.innerHTML = ibmRenderer(data);

}

function renderMS(data) {
	console.log(data);

	&#x2F;*
	Since handlebars is so anti-logic-in template...
	Non-clipart = 0,
ambiguous = 1,
normal-clipart = 2,
good-clipart = 3.
	*&#x2F;
	let ct = data.main.imageType.clipArtType;
	let ctType = &#x27;Not Clipart&#x27;;
	if(ct === 1) ctType = &#x27;Ambiguous&#x27;;
	if(ct === 2) ctType = &#x27;Normal Clipart&#x27;;
	if(ct === 3) ctType = &#x27;Good Clipart&#x27;; 
	data.main.imageType.ctType = ctType;
	msResults.innerHTML = msRenderer(data);
}

function renderAmazon(data) {
	console.log(data.modlabels);
	console.log(data.celebs);
	amazonResults.innerHTML = amazonRenderer(data);

}</code></pre>

You can see just how much is handling grabbing DOM elements and changing them.

To be clear, I'm not saying this is *bad* per se, and it wasn't difficult without jQuery at all. But let's consider the Vue version.

The New Vue
===

(Can you guess how long I've been waiting to use that phrase?) 

I began by creating a JSON export of my Node code's results so I could test more quicker. I then began working on JavaScript. One of the first things I ran into was handling the form and the image preview. As a reminder - the code lets you select an image with a regular input/file field and then render a preview. Only after you upload does processing begin. I quickly discovered the `v-model` doesn't work with input/file fields as they are read only. This is what I ended up with. 

<pre><code class="language-markup">&lt;form method=&quot;post&quot; enctype=&quot;multipart&#x2F;form-data&quot; @submit.prevent=&quot;doForm&quot;&gt;
	&lt;p&gt;
	Select an image to use for testing: 
	&lt;input type=&quot;file&quot; @change=&quot;doPreview&quot;&gt;&lt;br&#x2F;&gt;
	&lt;input type=&quot;submit&quot; value=&quot;Upload&quot;&gt;
	&lt;&#x2F;p&gt;
&lt;&#x2F;form&gt;
&lt;img :src=&quot;previewImage&quot; class=&quot;previewImage&quot;&gt;
</code></pre>

I've got a change handler on the file field to do the 'auto preview' thing and I've attached a submit handler to the form. The addition of `.prevent` means that Vue will handle preventing the default form submission thing for me. (Yet another reason I'm falling in love with Vue.) Here is the beginning of the JavaScript as well as the two handlers involved with the form.

<pre><code class="language-javascript">
let myApp = new Vue({
	el:'#mainApp',
	data:{
		previewImage:'',
		status:'',
		file:null,
		google:null,
		ibm:null,
		ms:null,
		amazon:null
	},
	methods:{
		doPreview:function(e) {
			var that = this;
			if(!e.target.files || !e.target.files[0]) return;
					
			let reader = new FileReader();
					
			reader.onload = function (e) {
				that.previewImage = e.target.result;
			}
			
			reader.readAsDataURL(e.target.files[0]);
			this.file = e.target.files[0];
			this.google = null; this.ibm = null; this.ms = null; this.amazon = null;
			this.status = &#x27;Upload image for results.&#x27;;
		},
		doForm:function(e) {
			if(this.previewImage === &#x27;&#x27;) return;
			console.log(&#x27;Going to do form&#x27;);
			this.status = &#x27;&lt;i&gt;Uploading and processing - stand by...&lt;&#x2F;i&gt;&#x27;;

			let fd = new FormData();
			fd.append(&#x27;testImage&#x27;, this.file);

			fetch(&#x27;&#x2F;test&#x27;, {
				method:&#x27;POST&#x27;,
				body:fd
			}).then( 
				response =&gt; response.json()
			).then( (result) =&gt; {
				console.log(&#x27;file result&#x27;, result.result);
				this.status=&#x27;&#x27;
				this.renderResults(result.result);
			}).catch( (e) =&gt; {
				console.error(e);
			});
		},
</code></pre>

For the most part, this is the same as before, except that I've attached the handlers to my Vue object. The actual rendering is done in another method, but as I don't call that method anywhere else, it should probably be folded into `doForm`, but I like the seperation a bit so I'm happy with it. Here's that method:

<pre><code class="language-javascript">renderResults:function(data) {
	if(data.google) this.google = data.google;
	if(data.ibm) this.ibm = data.ibm;
	if(data.ms) {
		let ct = data.ms.main.imageType.clipArtType;
		let ctType = &#x27;Not Clipart&#x27;;
		if(ct === 1) ctType = &#x27;Ambiguous&#x27;;
		if(ct === 2) ctType = &#x27;Normal Clipart&#x27;;
		if(ct === 3) ctType = &#x27;Good Clipart&#x27;; 
		data.ms.main.imageType.ctType = ctType;
		this.ms = data.ms;
	}
	if(data.amazon) this.amazon = data.amazon;
}
</code></pre>

So in theory - I could have maybe just did something like - "for x in data, this[x] = data.x" - but the more specific checks felt... I don't know. Not better, but ok for now. If you remember, in my last update I made it easier to disable services so it's definitely possible .amazon or .ibm won't be there. And that's it for the JavaScript code. The entire file (found <a href="https://github.com/cfjedimaster/recogtester/blob/master/public/js/app.js">here</a>) is now 69 lines, roughly half the lines of the previous version (136). Biggest thing missing are all (or most) the calls for DOM manipulation.

The front end HTML now has the templates "inside" the body as Vue is going to mark it up as is. Again I don't want to share the entire template as it is pretty long (although it did get smaller compared to the first version), so here is the same "cut" as before.

<pre><code class="language-markup">&lt;!DOCTYPE html&gt;
&lt;html&gt;
	&lt;head&gt;
		&lt;meta charset=&quot;utf-8&quot;&gt;
		&lt;title&gt;&lt;&#x2F;title&gt;
		&lt;meta name=&quot;description&quot; content=&quot;&quot;&gt;
		&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width&quot;&gt;
		&lt;link rel=&quot;stylesheet&quot; href=&quot;css&#x2F;app.css&quot;&gt;
		&lt;style&gt;
		[v-cloak] {
			display: none;
		}
		&lt;&#x2F;style&gt;
	&lt;&#x2F;head&gt;
	&lt;body&gt;

	&lt;div id=&quot;mainApp&quot; v-cloak&gt;

		&lt;h1&gt;Image Recognition Tester&lt;&#x2F;h1&gt;
		&lt;form method=&quot;post&quot; enctype=&quot;multipart&#x2F;form-data&quot; @submit.prevent=&quot;doForm&quot;&gt;
		&lt;p&gt;
		Select an image to use for testing: 
		&lt;input type=&quot;file&quot; @change=&quot;doPreview&quot;&gt;&lt;br&#x2F;&gt;
		&lt;input type=&quot;submit&quot; value=&quot;Upload&quot;&gt;
		&lt;&#x2F;p&gt;
		&lt;&#x2F;form&gt;
		&lt;img :src=&quot;previewImage&quot; class=&quot;previewImage&quot;&gt;

		&lt;br clear=&quot;all&quot;&#x2F;&gt;

		&lt;div v-html=&quot;status&quot;&gt;&lt;&#x2F;div&gt;

		&lt;div v-if=&quot;google&quot; class=&quot;results&quot;&gt;
			&lt;h1&gt;Google Results&lt;&#x2F;h1&gt;
			&lt;p&gt;
				Google attempts to find results across the following types: crops (hints for where to crop), faces, labels, 
				landmarks, logos, properties, safeSearch, similar, and text.
			&lt;&#x2F;p&gt;
		
			&lt;h3&gt;Crops&lt;&#x2F;h3&gt;

			&lt;div v-if=&quot;google.crops&quot;&gt;
				&lt;ol&gt;
				&lt;li v-for=&quot;cropset in google.crops&quot;&gt;
					&lt;ul&gt;
					&lt;li v-for=&quot;crop in cropset&quot;&gt;{% raw %}{{crop.x}}{% endraw %},{% raw %}{{crop.y}}{% endraw %}&lt;&#x2F;li&gt;
					&lt;&#x2F;ul&gt;
				&lt;&#x2F;li&gt;
				&lt;&#x2F;ol&gt;
			&lt;&#x2F;div&gt;&lt;div v-else&gt;
				&lt;p&gt;No crops.&lt;&#x2F;p&gt;
			&lt;&#x2F;div&gt;

			&lt;h3&gt;Faces&lt;&#x2F;h3&gt;
			&lt;div v-if=&quot;google.faces&quot;&gt;
				&lt;p&gt;
					&lt;i&gt;Note, this report is not showing: angles, bounds, and features.&lt;&#x2F;i&gt;
				&lt;&#x2F;p&gt;

				&lt;p v-for=&quot;face in google.faces&quot;&gt;
					Basic Details:&lt;br&#x2F;&gt;
					Anger: {% raw %}{{face.anger}}{% endraw %} (likelihood: {% raw %}{{face.angerLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
					Blurred: {% raw %}{{face.blurred}}{% endraw %}&lt;br&#x2F;&gt;
					Confidence: {% raw %}{{face.confidence}}{% endraw %}&lt;br&#x2F;&gt;
					Headware: {% raw %}{{face.headwear}}{% endraw %} (likelihood: {% raw %}{{face.headwearLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
					Joy: {% raw %}{{face.joy}}{% endraw %} (likelihood: {% raw %}{{face.joyLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
					Sorrow: {% raw %}{{face.sorrow}}{% endraw %} (likelihood: {% raw %}{{face.sorrowLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
					Surprise: {% raw %}{{face.surprise}}{% endraw %} (likelihood: {% raw %}{{face.surpriseLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
					Underexposed: {% raw %}{{face.underExposed}}{% endraw %} (likelihood: {% raw %}{{face.underExposedLikelihood}}{% endraw %})&lt;br&#x2F;&gt;
				&lt;&#x2F;p&gt;
			&lt;&#x2F;div&gt;&lt;div v-else&gt;
				&lt;p&gt;No faces.&lt;&#x2F;p&gt;
			&lt;&#x2F;div&gt;

			&lt;h3&gt;Labels&lt;&#x2F;h3&gt;
			&lt;div v-if=&quot;google.labels.length&quot;&gt;
				&lt;ul&gt;
				&lt;li v-for=&quot;label in google.labels&quot;&gt;{% raw %}{{label}}{% endraw %}&lt;&#x2F;li&gt;
				&lt;&#x2F;ul&gt;
			&lt;&#x2F;div&gt;&lt;div v-else&gt;
				&lt;p&gt;No labels.&lt;&#x2F;p&gt;
			&lt;&#x2F;div&gt;

			&lt;h3&gt;Landmarks&lt;&#x2F;h3&gt;
			&lt;div v-if=&quot;google.landmarks.length&quot;&gt;
				&lt;p&gt;&lt;i&gt;This is the &lt;b&gt;non&lt;&#x2F;b&gt; verbose response. Verbose version will include location GPS values.&lt;&#x2F;i&gt;&lt;&#x2F;p&gt;
				&lt;ul&gt;
					&lt;li v-for=&quot;landmark in google.landmarks&quot;&gt;{% raw %}{{landmark}}{% endraw %}&lt;&#x2F;li&gt;
				&lt;&#x2F;ul&gt;
			&lt;&#x2F;div&gt;&lt;div v-else&gt;
				&lt;p&gt;No landmarks.&lt;&#x2F;p&gt;
			&lt;&#x2F;div&gt;
	
		&lt;&#x2F;div&gt;
	
	&lt;&#x2F;div&gt;
	
	&lt;script src=&quot;https:&#x2F;&#x2F;unpkg.com&#x2F;vue&quot;&gt;&lt;&#x2F;script&gt;
	&lt;script src=&quot;&#x2F;js&#x2F;app.js&quot;&gt;&lt;&#x2F;script&gt;
	&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;
</code></pre>

The full file may be found <a href="https://github.com/cfjedimaster/recogtester/blob/master/public/index.html">here</a>.

For the most part, the conversion from Handlebars to Vue was straight forward. I screwed up a lot at first, but I was *incredibly* impressed by the error messages Vue spit out. In nearly every single case, it was obvious what I had done wrong and what I had to do to fix it. The only thing that threw me was an inline style:

<pre><code class="language-markup">&lt;ul&gt;
	&lt;li v-for=&quot;color in google.properties.colors&quot; 
	v-bind:style=&quot;{% raw %}{ backgroundColor:&#x27;#&#x27;+color }{% endraw %}&quot;&gt;{% raw %}{{color}}{% endraw %}&lt;&#x2F;li&gt;
&lt;&#x2F;ul&gt;
</code></pre>

It took me a bit to figure out that my CSS property had to go from background-color to backgroundColor. The error message told me I had invalid syntax, but I just couldn't figure out what was wrong with it. 

All in all - I much prefer `v-for` over `{% raw %}{{#each something}}{% endraw %}`. On the other hand, this form really wigs me out a bit:

<pre><code class="language-markup">&lt;div v-if="newMoonOnSunday"&gt;
stuff
&lt;/div&gt;&lt;div v-else&gt;
the else block
&lt;/div&gt;
</code></pre>

It works - and I'll get used to it - but... yeah - wigs me out. 

Anyway - I hope this sample is helpful to others. The entire code base is up on GitHub - https://github.com/cfjedimaster/recogtester. Feel free to suggest improvements to my use of Vue - I'm new so I won't mind. ;)