---
layout: post
title: "Building a Quiz Manager for jQuery Mobile"
date: "2013-12-05T12:12:00+06:00"
categories: [html5,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2013/12/05/Building-a-Quiz-Manager-for-jQuery-Mobile
guid: 5092
---

<p>
A few weeks ago a reader asked if I had ever designed a quiz for <a href="http://www.jquerymobile.com">jQuery Mobile</a>. While I had not, I spent some time thinking about how a quiz could be designed as well as how a generic library could help automate it. I've built a demo I'd like to share with folks. It is definitely "First Draft" (but hey, it <a href="http://www.raymondcamden.com/index.cfm/2013/12/2/I-wish-I-had-linted-before">lints</a>!) so feel free to tear it apart and suggest improvements.
</p>
<!--more-->
<p>
I began by thinking how quiz data could be represented. I figured either XML or JSON. JSON has the benefit of being <i>really</i> easy to work with in JavaScript. XML has the benefit of being <i>really</i> easy to write, even for non-devs. At the end of the day though I settled on JSON. My library could be updated to handle both though. Here is an example quiz I used for my demo.
</p>

<pre><code class="language-javascript">{
	"introduction":"This quiz tests you about foo and goo", 
	"questions":[
		{"question":"Why is the sky blue?", 
		 "answers":["Unicorns","Fairies","Boring Science","Kittens"],
		 "correct":2},
		{"question":"Why are kittens so cute?", 
		 "answers":["Magic","Fur","Meow","More Kittens!"],
		 "correct":3}
	]
}</code></pre>

<p>
The scheme consists of an optional introduction and an array of questions. Each question has a question value (the actual text), an array of answers, and a correct index. This is 0-based but I'm thinking it may make sense to be 1-based. My design only allows for multiple choice questions with one answer, but you could also do true/false of course.
</p>

<p>
On the jQuery Mobile side, the library is used by running an execute method. The execute method takes the URL of a quiz, a DOM element to render the quiz within, and a success callback. My jQuery Mobile application uses this app.js file to handle that aspect:
</p>

<pre><code class="language-javascript">/* global $,document,console,quizMaster */
$(document).ready(function() {
	
	$(document).on("pageshow", "#quizPage", function() {
		console.log("Page show");
		//initialize the quiz
		quizMaster.execute("q1.json", ".quizdisplay", function(result) {
			console.log("SUCESS CB");
			console.dir(result);	
		});
	});
}); </code></pre>

<p>
I whipped up a quick jQuery Mobile application with two pages. The first simply links over to the quiz page.
</p>

<p>
<img src="https://static.raymondcamden.com/images/iOS Simulator Screen shot Dec 5, 2013, 11.08.38 AM.png" />
</p>

<p>
Once you load the quiz page, the code you see above runs the library. Here is how the quiz displays the introduction:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s12.png" />
</p>

<p>
And this is the first question:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s23.png" />
</p>

<p>
Ok, now let's look at the library.
</p>

<pre><code class="language-javascript">&#x2F;* global $,window *&#x2F;
var quizMaster = (function () {
	var name;
	var data;
	var loaded = false;
	var displayDom;
	var successCbAlias;

	function nextHandler(e) {
		e.preventDefault();

		var status = getUserStatus();

		&#x2F;&#x2F;if we aren&#x27;t on the intro, then we need to ensure you picked something
		if(status.question &gt;= 0) {
			var checked = $(&quot;input[type=radio]:checked&quot;, displayDom);
			if(checked.length === 0) {
				&#x2F;&#x2F;for now, an ugly alert
				window.alert(&quot;Please answer the question!&quot;);
				return;
			} else {
				status.answers[status.question] = checked.val();	
			}
		} 
		status.question++;
		storeUserStatus(status);
		displayQuiz(successCbAlias);
	}

	function displayQuiz(successCb) {

		&#x2F;&#x2F;We copy this out so our event can use it later. This feels wrong
		successCbAlias = successCb;
		var current = getQuiz();
		var html;

		if(current.state === &quot;introduction&quot;) {
			html = &quot;&lt;h2&gt;Introduction&lt;&#x2F;h2&gt;&lt;p&gt;&quot; + current.introduction + &quot;&lt;&#x2F;p&gt;&quot; + nextButton();
			displayDom.html(html).trigger(&#x27;create&#x27;);
		} else if(current.state === &quot;inprogress&quot;) {
			
			html = &quot;&lt;h2&gt;&quot; + current.question.question + &quot;&lt;&#x2F;h2&gt;&lt;form&gt;&lt;div data-role=&#x27;fieldcontain&#x27;&gt;&lt;fieldset data-role=&#x27;controlgroup&#x27;&gt;&quot;;
			for(var i=0; i&lt;current.question.answers.length; i++) {
				html += &quot;&lt;input type=&#x27;radio&#x27; name=&#x27;quizMasterAnswer&#x27; id=&#x27;quizMasterAnswer_&quot;+i+&quot;&#x27; value=&#x27;&quot;+i+&quot;&#x27;&#x2F;&gt;&lt;label for=&#x27;quizMasterAnswer_&quot;+i+&quot;&#x27;&gt;&quot; + current.question.answers[i] + &quot;&lt;&#x2F;label&gt;&quot;;
			}
			html += &quot;&lt;&#x2F;fieldset&gt;&lt;&#x2F;div&gt;&lt;&#x2F;form&gt;&quot; + nextButton();
			displayDom.html(html).trigger(&#x27;create&#x27;);
		} else if(current.state === &quot;complete&quot;) {
			html = &quot;&lt;h2&gt;Complete!&lt;&#x2F;h2&gt;&lt;p&gt;The quiz is now complete. You got &quot;+current.correct+&quot; correct out of &quot;+data.questions.length+&quot;.&lt;&#x2F;p&gt;&quot;;
			displayDom.html(html).trigger(&#x27;create&#x27;);
			removeUserStatus();
			successCb(current);
		}
		
		
		&#x2F;&#x2F;Remove previous if there...
		&#x2F;&#x2F;Note - used click since folks will be demoing in the browser, use touchend instead
		displayDom.off(&quot;click&quot;, &quot;.quizMasterNext&quot;, nextHandler);
		&#x2F;&#x2F;Then restore it
		displayDom.on(&quot;click&quot;, &quot;.quizMasterNext&quot;, nextHandler);
		
	}
	
	function getKey() {
		return &quot;quizMaster_&quot;+name;	
	}
	
	function getQuestion(x) {
		return data.questions[x];	
	}
	
	function getQuiz() {
		&#x2F;&#x2F;Were we taking the quiz already?
		var status = getUserStatus();
		if(!status) {
			status = {% raw %}{question:-1,answers:[]}{% endraw %};
			storeUserStatus(status);
		}
		&#x2F;&#x2F;If a quiz doesn&#x27;t have an intro, just go right to the question
		if(status.question === -1 &amp;&amp; !data.introduction) {
			status.question = 0;
			storeUserStatus(status);
		}

		var result = {
			currentQuestionNumber:status.question
		};
		
		if(status.question == -1) {
			result.state = &quot;introduction&quot;;
			result.introduction = data.introduction;	
		} else if(status.question &lt; data.questions.length) {
			result.state = &quot;inprogress&quot;;
			result.question = getQuestion(status.question);	
		} else {
			result.state = &quot;complete&quot;;
			result.correct = 0;
			for(var i=0; i &lt; data.questions.length; i++) {
				if(data.questions[i].correct == status.answers[i]) {
					result.correct++;	
				}
			}
		}
		return result;
	}
	
	function getUserStatus() {
		var existing = window.sessionStorage.getItem(getKey());
		if(existing) {
			return JSON.parse(existing);
		} else {
			return null;
		}
	}
	
	function nextButton() {
		return &quot;&lt;a href=&#x27;&#x27; class=&#x27;quizMasterNext&#x27; data-role=&#x27;button&#x27;&gt;Next&lt;&#x2F;a&gt;&quot;;	
	}
	
	function removeUserStatus(s) {
		window.sessionStorage.removeItem(getKey());	
	}
	
	function storeUserStatus(s) {
		window.sessionStorage.setItem(getKey(), JSON.stringify(s));
	}
	
	return {
		execute: function( url, dom, cb ) {
			&#x2F;&#x2F;We cache the ajax load so we can do it only once 
			if(!loaded) {
				
				$.get(url, function(res, code) {
					&#x2F;&#x2F;Possibly do validation here to ensure basic stuff is present
					name = url;
					data = res;
					displayDom = $(dom);
					&#x2F;&#x2F;console.dir(res);
					loaded = true;
					displayQuiz(cb);
				});
				
			} else {
				displayQuiz(cb);
			}
		}
	};
}());</code></pre>

<p>
There's a lot here and I'll try to explain it bit by bit. The end of the code is the public API which - for now - has one method, execute. Note how we detect if the quiz is already loaded. This way we can cache the JSON and not load it after we've fetched it once in the request.
</p>

<p>
displayQuiz is the main handler for rendering the quiz. It begins (ignore the copy statement) by calling getQuiz. getQuiz handles interfacing with the quiz data as well as the user data. I'm using sessionStorage to remember where you are in the quiz. This is useful if you leave the quiz before finishing it. getQuiz also does some intelligent handling of state. So for example, if there isn't an introduction it ensures you go right into the first question. It also recognizes when you're done and checks your work.
</p>

<p>
Back in displayQuiz we use the result of getQuiz to render one of three states - the introduction, the quiz itself, or the completion. By the way, the success callback is used to allow your calling code to record the results to your server via AJAX, or do anything really. 
</p>

<p>
All in all this was fun to write, but as I said, feels very much like a first draft. Want to try it yourself? Hit the demo link below.
</p>

<p>
<a href="https://static.raymondcamden.com/demos/2013/dec/5/index.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>  
</p>