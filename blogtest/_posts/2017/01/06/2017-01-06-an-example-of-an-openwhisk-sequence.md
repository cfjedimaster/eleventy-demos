---
layout: post
title: "An Example of an OpenWhisk Sequence"
date: "2017-01-06T12:50:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/01/06/an-example-of-an-openwhisk-sequence
---

This isn't going to be terribly complicated, but as I thought it was kinda cool, I thought I'd share it.
I'm currently working through the [OpenWhisk workshop](https://github.com/openwhisk/openwhisk-workshop), a Node School-ish set of
problems/tasks to help you learn the basics of OpenWhisk. One of the problems has you build a sequence, and 
while I recommend folks try to solve the problem for themselves, I thought I'd share my solution and what I discovered
while working on it.

[Sequences](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_actions.html#openwhisk_create_action_sequence) are what you would imagine, two 
or more actions that are linked together. You define them by listing the actions you want executed, and when run, 
OpenWhisk will execute each in order and pass the output from one to the input of the other. (And this brings up an important detail I'll cover in a moment.)

Before I talk about the problem from the workshop, let's build a simple example. First we'll build an action that takes a string input and returns
the size of the string. To be clear, this is trivial to the point of stupidity, but let's keep it nice and simple.

<pre><code class="language-javascript">
function main(params) {

	return {
		length:params.text.length
	};

}
</code></pre>

I called this action strlen. Now let's create an action that, given a numeric input, finds the prime numbers. I'm going to use the solution
from this [Stack Overflow answer](http://stackoverflow.com/a/12287599):

<pre><code class="language-javascript">
&#x2F;&#x2F;http:&#x2F;&#x2F;stackoverflow.com&#x2F;a&#x2F;12287599
function getPrimes(max) {
    var sieve = [], i, j, primes = [];
    for (i = 2; i &lt;= max; ++i) {
        if (!sieve[i]) {
            &#x2F;&#x2F; i has not been marked -- it is prime
            primes.push(i);
            for (j = i &lt;&lt; 1; j &lt;= max; j += i) {
                sieve[j] = true;
            }
        }
    }
    return primes;
}

function main(params) {
	return {
		primes:getPrimes(params.number)
	}

}
</code></pre>

It takes a parameter of number and returns an array in a key called primes. 

As a quick aside, I used the [OpenWhisk extension](https://github.com/openwhisk/openwhisk-vscode) for Visual Studio Code to create
and test these actions. While the extension is still in development, it works darn well so far.

Ok, so how do we make a sequence?

First off, you create a sequence very much like you do an action, in fact, the command begins the same way:

	wsk action create name

But this is where things differ - instead of passing a filename of a local file for your action, you pass the <code>--sequence</code> argument and a list
of actions:

	wsk action create name --sequence a,b,c

Ok, so for our code above, I'd do this:

	wsk action create strToPrimes --sequence strlen,primes

Once done, you invoke it just like a normal action:

	wsk action invoke strToPrimes -b -r -p text "Raymond"

Notice I'm passing in my argument <code>text</code> that is expected by my first action. And it works perfectly! (Not!)

![Oops](https://static.raymondcamden.com/images/2017/1/owseq1.png)

What went wrong? Did you notice the output of strlen was an object with the key "length"? Did you notice the input for primes was expecting
a param called "number"? When building sequences, you have to ensure that your output/inputs match up. In general, this shouldn't be a big
deal. I'm ok with changing strlen to output "number" instead, but I do wish that OpenWhisk would let me define sequences along with a way to 'map' the output/input values from action to action.

Now it works just fine:

![Woot!](https://static.raymondcamden.com/images/2017/1/owseq2.png)

Ok, so lets look at the workshop problem:

* Create an Action which takes a string parameter (text) containing a sentence. Return an array containing the individual words within the sentence.

    "Hello my name is James" --> ["Hello", "my", "name", "is", "James"]

* Create an Action which takes an array of words and returns an array with those words reversed.

    ["Hello", "my", "name", "is", "James"] --> ["James", "is", "name", "my", "Hello"]

* Create an Action which takes an array of words and returns the string createdby joining the words together into a sentence.

    ["James", "is", "name", "my", "Hello"]  --> "James is name my Hello"

* Create a new Action (reverse-sentence-words) using a sequence that joins together these three Actions.

* This new Action should take a parameter (text) and return a sentence (text) which contains the words in the string reversed.

All in all, fairly trivial. My first action is just this:

<pre><code class="language-javascript">
function main(params) {

	var words = params.text.split(' ');
	return {% raw %}{array:words}{% endraw %};

}
</code></pre>

My second one is just this:

<pre><code class="language-javascript">
function main(params) {

	return {% raw %}{ array:params.array.reverse()}{% endraw %};
	
}
</code></pre>

And my final one is:

<pre><code class="language-javascript">
function main(params) {

	var result = params.array.join(' ');
	return {% raw %}{text:result}{% endraw %};

}
</code></pre>

Here is my sequence in action. By the way, that <code>-r</code> argument means just return the result - I like that.

![My sequence is better than yours...](https://static.raymondcamden.com/images/2017/1/owseq3.png)