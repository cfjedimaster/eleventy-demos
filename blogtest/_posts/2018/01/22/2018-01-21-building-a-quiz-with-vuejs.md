---
layout: post
title: "Building a Quiz with Vue.js"
date: "2018-01-22"
categories: [javascript]
tags: [vuejs]
banner_image: /images/banners/vuequiz.jpg
permalink: /2018/01/22/building-a-quiz-with-vuejs
---

For today's "Can I build *that* with Vue.js?" blog post, I'm sharing a simple quiz system I've built with Vue.js. The idea was to see if I could write Vue code that would handle a dynamic set of questions, present them to the user one at a time, and then report a grade at the end. I had fun building this, and it went through a few iterations, so let's get started!

Version One
===

In my initial design, I wanted to support the following:

* First, the quiz needed to have three different stages. An initial "you are about to take a quiz" view, a "answer this question" view that will cycle through all the questions, and a final "you finished and here is your score" view.
* For the questions, I decided to just support two types: true/false and multiple choice with one answer. Of course, this could get much more complex. I built a dynamic survey system in ColdFusion a few years back ([Soundings](https://github.com/cfjedimaster/Soundings)), and supporting every type of question took quite a bit of work. 
* Finally, I wanted the actual quiz data to be loaded via JSON, so that any set of questions could be used. (Again though, as long as they matched the criteria defined above.)

Before getting into the code, let's take a look at the JSON structure of the quiz data first. 

```js
{
  "title": "Quiz about Foo",
  "questions": [
    {
      "text": "Is true true?",
      "type": "tf",
      "answer": "t"
    },
    {
      "text": "Is false true?",
      "type": "tf",
      "answer": "f"
    },
    {
      "text": "What is the best beer?",
      "type": "mc",
      "answers": [
        "Coors",
        "Miller",
        "Bud",
        "Anchor Steam"
      ],
      "answer": "Anchor Steam"
    },
    {
      "text": "What is the best cookie?",
      "type": "mc",
      "answers": [
        "Chocolate Chip",
        "Sugar",
        "Beer"
      ],
      "answer": "Sugar"
    }
  ]
}
```

My JSON structure has 2 top level keys, title and questions. The title property simply gives the quiz a name. The questions property is an array of questions. Each question has a text value (the actual question text), a type (either "tf" for true/false or "mc" for multiple choice), and an answer property indicating the right answer. Questions of type mc also have an answers property which is an array of options for the multiple choices. 

To host my quiz, I used [myjson.com](http://myjson.com/), which is a cool little service that acts like a pastebin for JSON. It also turns on CORS which makes it easy to use the JSON packets in client-side applications. 

Ok, so how did I solve this with Vue? First, let's look at the HTML.

```markup
<div id="quiz">
  
  <div v-if="introStage">
    <h1>Welcome to the Quiz: {% raw %}{{title}}{% endraw %}</h1>
    <p>
      Some kind of text here. Blah blah.
    </p>
    
    <button @click="startQuiz">START!</button>
  </div>
  
  <div v-if="questionStage">
    <question 
              :question="questions[currentQuestion]"
              v-on:answer="handleAnswer"
              :question-number="currentQuestion+1"
    ></question>
  </div>
  
  <div v-if="resultsStage">
    You got {% raw %}{{correct}}{% endraw %} right out of {% raw %}{{questions.length}}{% endraw %} questions. Your percentage is {% raw %}{{perc}}{% endraw %}%.
  </div>
  
</div>
```

I've got three main parts. Each of the three divs represent one "stage" of the quiz, either before, during, or after. I could have use if/else statements here, but I like the use of a simple if to toggle on each part. The second div is using a `question` component to render the current question. Now let's look at the code.

First - the main Vue app:

```js
const quizData = 'https://api.myjson.com/bins/ahn1p';

const app = new Vue({
  el:'#quiz',
  data() {
    return {
      introStage:false,
      questionStage:false,
      resultsStage:false,
      title:'',
      questions:[],
      currentQuestion:0,
      answers:[],
      correct:0,
      perc:null
    }
  },
  created() {
    fetch(quizData)
    .then(res => res.json())
    .then(res => {
      this.title = res.title;
      this.questions = res.questions;
      this.introStage = true;
    })

  },
  methods:{
    startQuiz() {
      this.introStage = false;
      this.questionStage = true;
      console.log('test'+JSON.stringify(this.questions[this.currentQuestion]));
    },
    handleAnswer(e) {
      console.log('answer event ftw',e);
      this.answers[this.currentQuestion]=e.answer;
      if((this.currentQuestion+1) === this.questions.length) {
        this.handleResults();
        this.questionStage = false;
        this.resultsStage = true;
      } else {
        this.currentQuestion++;
      }
    },
    handleResults() {
      console.log('handle results');
      this.questions.forEach((a, index) => {
        if(this.answers[index] === a.answer) this.correct++;        
      });
      this.perc = ((this.correct / this.questions.length)*100).toFixed(2);
      console.log(this.correct+' '+this.perc);
    }
  }
})
```

So from the beginning, my `data` block handles created flags for each of the three stages as well as storing questions, answer data, and other parts of the quiz. The `created` block loads the JSON package of my quiz data and then begins the quiz by showing the initial view. Note we use the proper title of the quiz in the first view. 

After the user clicks the button to start the quiz, they can begin answering questions. This is where things get a bit complex. Let's look at the question component.

```js
Vue.component('question', {
	template:`
<div>
  <strong>Question {% raw %}{{ questionNumber }}{% endraw %}:</strong><br/>
  <strong>{% raw %}{{ question.text }}{% endraw %} </strong>

  <div v-if="question.type === 'tf'">
    <input type="radio" name="currentQuestion" id="trueAnswer" v-model="answer" value="t"><label for="trueAnswer">True</label><br/>
    <input type="radio" name="currentQuestion" id="falseAnswer" v-model="answer" value="f"><label for="falseAnswer">False</label><br/>
  </div>

  <div v-if="question.type === 'mc'">
    <div v-for="(mcanswer,index) in question.answers">
    <input type="radio" :id="'answer'+index" name="currentQuestion" v-model="answer" :value="mcanswer"><label :for="'answer'+index">{% raw %}{{mcanswer}}{% endraw %}</label><br/>
    </div>
  </div>

  <button @click="submitAnswer">Answer</button>
</div>
`,
  data() {
     return {
       answer:''
     }
  },
	props:['question','question-number'],
	methods:{
		submitAnswer:function() {
			this.$emit('answer', {% raw %}{answer:this.answer}{% endraw %});
      this.answer = null;
		}
	}
});
```

I've got a template that handles rendering the question (both the question number and text) and then uses simple branching to handle the two types of questions. In theory, this is where you could start adding support for additional question types if you wanted. Make note of how the button fires an event handled by the component, but also then "emitted" out to the parent component. The parent component can then store the answer and update the current question number. This is how you advance throughout the quiz. Note that it also detects when you've answered the last question and fires `handleResults` to - well - handle the results. The code calculates how many questions you got correct, creates a percentage, and then sets the flag to render the final view.

You can take the quiz (and see all the code) below:

<p data-height="400" data-theme-id="dark" data-slug-hash="rpoboy" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Vue Quiz (v1)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/rpoboy/">Vue Quiz (v1)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Round Two
===

After getting my initial version working, I started to think about some improvements I could make to the code. The first one I thought of was simply moving the quiz itself into a component. This would better abstract out the logic and make it more usable. So one of the coolest parts of this update was how my front end code changed. Now it's this:

```markup
<div id="quiz">
  
  <quiz url="https://api.myjson.com/bins/ahn1p"></quiz>
 
</div>
```

That's freaking cool. Here is the JavaScript. The main changes here is the creation of the `quiz` component. 

<pre><code class="language-javascript">Vue.component('quiz', {
  template:`
&lt;div&gt;
  &lt;div v-if=&quot;introStage&quot;&gt;
    &lt;h1&gt;Welcome to the Quiz: {% raw %}{{title}}{% endraw %}&lt;/h1&gt;
    &lt;p&gt;
      Some kind of text here. Blah blah.
    &lt;/p&gt;
    
    &lt;button @click=&quot;startQuiz&quot;&gt;START!&lt;/button&gt;
  &lt;/div&gt;
  
  &lt;div v-if=&quot;questionStage&quot;&gt;
    &lt;question 
              :question=&quot;questions[currentQuestion]&quot;
              v-on:answer=&quot;handleAnswer&quot;
              :question-number=&quot;currentQuestion+1&quot;
    &gt;&lt;/question&gt;
  &lt;/div&gt;
  
  &lt;div v-if=&quot;resultsStage&quot;&gt;
    You got {% raw %}{{correct}}{% endraw %} right out of {% raw %}{{questions.length}}{% endraw %} questions. Your percentage is {% raw %}{{perc}}{% endraw %}%.
  &lt;/div&gt;
&lt;/div&gt;
`,
  props:['url'],
  data() {
    return {
      introStage:false,
      questionStage:false,
      resultsStage:false,
      title:'',
      questions:[],
      currentQuestion:0,
      answers:[],
      correct:0,
      perc:null
    }
  },
  created() {    
    fetch(this.url)
    .then(res =&gt; res.json())
    .then(res =&gt; {
      this.title = res.title;
      this.questions = res.questions;
      this.introStage = true;
    })
  
  },
  methods:{
    startQuiz() {
      this.introStage = false;
      this.questionStage = true;
      console.log('test'+JSON.stringify(this.questions[this.currentQuestion]));
    },
    handleAnswer(e) {
      console.log('answer event ftw',e);
      this.answers[this.currentQuestion]=e.answer;
      if((this.currentQuestion+1) === this.questions.length) {
        this.handleResults();
        this.questionStage = false;
        this.resultsStage = true;
      } else {
        this.currentQuestion++;
      }
    },
    handleResults() {
      console.log('handle results');
      this.questions.forEach((a, index) =&gt; {
        if(this.answers[index] === a.answer) this.correct++;        
      });
      this.perc = ((this.correct / this.questions.length)*100).toFixed(2);
      console.log(this.correct+' '+this.perc);
    }
  }
  
});

Vue.component('question', {
	template:`
&lt;div&gt;
  &lt;strong&gt;Question {% raw %}{{ questionNumber }}{% endraw %}:&lt;/strong&gt;&lt;br/&gt;
  &lt;strong&gt;{% raw %}{{ question.text }}{% endraw %} &lt;/strong&gt;

  &lt;div v-if=&quot;question.type === 'tf'&quot;&gt;
    &lt;input type=&quot;radio&quot; name=&quot;currentQuestion&quot; id=&quot;trueAnswer&quot; v-model=&quot;answer&quot; value=&quot;t&quot;&gt;&lt;label for=&quot;trueAnswer&quot;&gt;True&lt;/label&gt;&lt;br/&gt;
    &lt;input type=&quot;radio&quot; name=&quot;currentQuestion&quot; id=&quot;falseAnswer&quot; v-model=&quot;answer&quot; value=&quot;f&quot;&gt;&lt;label for=&quot;falseAnswer&quot;&gt;False&lt;/label&gt;&lt;br/&gt;
  &lt;/div&gt;

  &lt;div v-if=&quot;question.type === 'mc'&quot;&gt;
    &lt;div v-for=&quot;(mcanswer,index) in question.answers&quot;&gt;
    &lt;input type=&quot;radio&quot; :id=&quot;'answer'+index&quot; name=&quot;currentQuestion&quot; v-model=&quot;answer&quot; :value=&quot;mcanswer&quot;&gt;&lt;label :for=&quot;'answer'+index&quot;&gt;{% raw %}{{mcanswer}}{% endraw %}&lt;/label&gt;&lt;br/&gt;
    &lt;/div&gt;
  &lt;/div&gt;

  &lt;button @click=&quot;submitAnswer&quot;&gt;Answer&lt;/button&gt;
&lt;/div&gt;
`,
  data() {
     return {
       answer:''
     }
  },
	props:['question','question-number'],
	methods:{
		submitAnswer:function() {
			this.$emit('answer', {% raw %}{answer:this.answer}{% endraw %});
      this.answer = null;
		}
	}
});

const app = new Vue({
  el:'#quiz',
  data() {
    return {
    }
  }
})
</code></pre>

And while it doesn't look any different, you can see the complete app here:

<p data-height="400" data-theme-id="dark" data-slug-hash="opmBzg" data-default-tab="html" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Vue Quiz (v2)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/opmBzg/">Vue Quiz (v2)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Version the Third
===

For the third version, I decided to add something that I think is *really* cool. Vue has a feature for components called [slots](https://vuejs.org/v2/guide/components.html#Content-Distribution-with-Slots). They allow you to pass markup to a component while actually *inside* a component. It's a bit complex, but imagine this. You've got a component that allows you to pass in a property for a "thank you" message. Ie, a simple string to use to thank the user. One option would be to pass it to the component:

```markup
<mything thankyou="Hey buddy, thank you for doing that thing. I appreciate it. Here's a kitten."></mything>
```

While that works, if the string gets large, as has markup in it, it can become unwieldy within a property. So Vue allows us to pass in the value inside the component like so:

```markup
<mything>

   <div slot="thankyou">
   Hey, I want to <i>really</i> thank you for taking
   the time to do whatever. We here at Mega Corp truly
   care that you took the time. Oh, and here, please
   take a kitten!
   </div>

</mything>
```

Your Vue component can map the content of that div by using the slot attribute. Your component can even provide it's own default text. It's a pretty cool feature so be sure to [read the docs](https://vuejs.org/v2/guide/components.html#Content-Distribution-with-Slots) to get it, but how did I use it for my quiz? I used it as a way to let you customize the beginning and end states of the quiz. So check out this version:

```markup
<div id="quiz">
  
  <quiz url="https://api.myjson.com/bins/ahn1p">

    <div slot="intro" slot-scope="props">
      This is my custom quiz header for {% raw %}{{props.title}}{% endraw %}.
    </div>
  
    <div slot="results" slot-scope="props">
      <h1>WOWOWOW!</h1> 
        You got {% raw %}{{props.correct}}{% endraw %} right out of 
        {% raw %}{{props.length}}{% endraw %} questions. 
      Your percentage is {% raw %}{{props.perc}}{% endraw %}%.
    </div>
  
  </quiz>
 
  
</div>
```

I've got two slots inside my quiz component now. Note the use of `slot-scope`. This allows me to access values set in the component itself. A "good" component that is shared with the public will document all of this so developers can easily make use of it. Here is the updated quiz component with this new support added in (I'm just sharing the template portion below):

```markup
<div>
  <div v-if="introStage">
    <slot name="intro" :title="title">
    <h1>Welcome to the Quiz: {% raw %}{{title}}{% endraw %}</h1>
    <p>
      Some kind of text here. Blah blah.
    </p>    
    </slot>
    <button @click="startQuiz">START!</button>
  </div>
  
  <div v-if="questionStage">
    <question 
              :question="questions[currentQuestion]"
              v-on:answer="handleAnswer"
              :question-number="currentQuestion+1"
    ></question>
  </div>
  
  <div v-if="resultsStage">
    <slot name="results" :length="questions.length" :perc="perc" :correct="correct">
    You got {% raw %}{{correct}}{% endraw %} right out of {% raw %}{{questions.length}}{% endraw %} questions. Your percentage is {% raw %}{{perc}}{% endraw %}%.
    </slot>
  </div>
</div>
```

Note that I've got text defined for both slots. This will be used as a default so the front end code can choose to customize one or the other, or both, or none. You can find a demo of this, and the complete code, below:

<p data-height="400" data-theme-id="dark" data-slug-hash="zpeNwX" data-default-tab="result" data-user="cfjedimaster" data-embed-version="2" data-pen-title="Vue Quiz (v3)" class="codepen">See the Pen <a href="https://codepen.io/cfjedimaster/pen/zpeNwX/">Vue Quiz (v3)</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

So in theory - I could copy question and quiz into a file by itself and anyone could make use of it in their Vue apps. I want to research that a bit more as I assume that I'd probably want to minify it too. Any Vue experts want to chime in on how they would do that? Leave me a comment below!