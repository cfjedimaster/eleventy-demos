---
layout: post
title: "Advent of Code - Day 6 and 7"
date: "2016-12-08T10:06:00-07:00"
categories: [development]
tags: [advent of code,javascript]
banner_image: 
permalink: /2016/12/08/advent-of-code-day-6-and-7
---

And so it begins - the [Advent of Code](http://adventofcode.com/) has begun to royally kick my butt. While these two challenges
weren't necessarily killers, the amount of time I need to solve them is slowly growing. Let's start with day 6.

Day 6
---

The [first challenge](http://adventofcode.com/2016/day/6) asked you to find the most common character in a column of input. So given this:

<pre>
art
boo
aot
</pre>

"a" would be the most common charcter in the first column, "o" in the second, and "t" in the third. My solution creaates an 
array of arrays to store each column of input. I then loop over the columns and create an object containing 
each letter and a count. I can then simply iterate over that and find the letter with the highest count.

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);


let cols = [];
let lines = input.split(&#x27;\n&#x27;);

lines.forEach(function(line) {
    for(let i=0;i&lt;line.length;i++) {
        let char = line.substr(i,1);
        if(!cols[i]) cols[i] = [];
        cols[i].push(char);
    }
});

&#x2F;&#x2F;console.log(cols);

let solution = &#x27;&#x27;;

&#x2F;&#x2F; Now go through each col and count
for(let i=0;i&lt;cols.length;i++) {
    let count = {};
    for(let j=0;j&lt;cols[i].length;j++) {
        let letter = cols[i][j];
        if(!count[letter]) count[letter] = 0;
        count[letter]++;
    }
    var highest = -1;
    var selected = &#x27;&#x27;;
    for(var key in count) {
        if(count[key] &gt; highest) {
            selected = key;
            highest = count[key];
        }
    }
    solution += selected;
}

console.log(solution);
</code></pre>

Not too difficult. The second part simply reversed the target and asked you to find the *least* likely letter:

<pre><code class="language-javascript">
// stuff removed for space...

let solution = &#x27;&#x27;;

&#x2F;&#x2F; Now go through each col and count
for(let i=0;i&lt;cols.length;i++) {
    let count = {};
    for(let j=0;j&lt;cols[i].length;j++) {
        let letter = cols[i][j];
        if(!count[letter]) count[letter] = 0;
        count[letter]++;
    }
    var highest = -1;
    var selected = &#x27;&#x27;;
    for(var key in count) {
        if(count[key] &gt; highest) {
            selected = key;
            highest = count[key];
        }
    }
    solution += selected;
}

console.log(solution);
</code></pre>

I feel kinda bad that I didn't rename `highest`, but I got over it.

Day 7
---

This [puzzle](http://adventofcode.com/2016/day/7) was one of those I felt like could be solved with one regex, 
but I'm just not quite that much of a regex master to figure it out myself. The first part involved looking for
a string of the form ABBA, where you have two matching characters on the 'outside' of a set of 4 and 2 matching
characters on the inside. You needed to see if an ABBA existed in the input string, *but* also see if an ABBA
existing inside any brackets. If it did, that negates it being a good string. So basically, "No ABBA in brackets, 
ABBA outside."

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);

let good = 0;
let lines = input.split(&#x27;\n&#x27;);
lines.forEach(function(line) {
    if(supportsTSL(line)) good++;
});
console.log(&#x27;Answer: &#x27;+good);

function hasABBA(s) {
    &#x2F;&#x2F;prev1 is 3 behind
    let prev1 = &#x27;&#x27;;
    &#x2F;&#x2F;prev2 is 2 behind
    let prev2 = &#x27;&#x27;;
    &#x2F;&#x2F;prev3 is 1 behind
    let prev3 = &#x27;&#x27;;
    let curr = &#x27;&#x27;;
    for(let i=0;i&lt;s.length;i++) {
        curr = s.substr(i,1);
        if(i &gt; 0) prev3 = s.substr(i-1,1);
        if(i &gt; 1) prev2 = s.substr(i-2,1);
        if(i &gt; 2) prev1 = s.substr(i-3,1);
        &#x2F;&#x2F;check for abba if we have gone far enough
        if(i &gt;= 3) {
            &#x2F;&#x2F;console.log(&#x27;abba? &#x27;+prev1+prev2+prev3+curr);
            &#x2F;&#x2F;console.log(&#x27;does prev3 === prev2 &#x27;+(prev3===prev2));
            &#x2F;&#x2F;if(prev3 === prev2) return false;
            &#x2F;&#x2F;console.log(&#x27;does prev1 eq curr? &#x27;+(prev1===curr));
            &#x2F;&#x2F;console.log(&#x27;does prev3 eq prev2? &#x27;+(prev2===prev3));
            if(prev1 === curr &amp;&amp; prev2 === prev3 &amp;&amp; prev1 !== prev2) return true;
        }
    }
    return false;
}

function supportsTSL(s) {

    &#x2F;&#x2F;must have a string of the form xyyx (x cannot be y) (ABBA)
    &#x2F;&#x2F;must NOT have such a thing inside sq brackets
    &#x2F;&#x2F;so first, get all the blocks INSIDE [], and see if they have ABBA, if so, FALSE
    &#x2F;&#x2F;then look at the rest  

    let matches = s.match(&#x2F;\[.*?\]&#x2F;g);
    for(let i=0;i&lt;matches.length;i++) {
        let match = matches[i].replace(&#x2F;[\[\]]&#x2F;g, &#x27;&#x27;);
&#x2F;&#x2F;        console.log(&#x27;check ABBA for &#x27;+match + &#x27;=&#x27;+hasABBA(match));
        if(hasABBA(match)) return false;
        s = s.replace(matches[i], &#x27; &#x27;);
    }
&#x2F;&#x2F;    console.log(&#x27;pass bracket, now we have &#x27;+s);
    return hasABBA(s);
}
</code></pre>

Not elegant at all, but it worked. Part 2 switched to a "ABA", a pair of characters around another character, outside
of any bracket, with a corresponding opposite "BAB" inside brackets. Here is my solution.

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
const input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);

let good = 0;
let lines = input.split(&#x27;\n&#x27;);
lines.forEach(function(line) {
    if(supportsSSL(line)) good++;
});
&#x2F;&#x2F;259 is too high
console.log(&#x27;Answer: &#x27;+good);


function findABA(s) {
    let results = [];
    &#x2F;&#x2F;prev1 is 2 behind
    let prev1 = &#x27;&#x27;;
    &#x2F;&#x2F;prev2 is 1 behind
    let prev2 = &#x27;&#x27;;
    let curr = &#x27;&#x27;;

    for(let i=0;i&lt;s.length;i++) {
        curr = s.substr(i,1);
        if(i &gt; 0) prev2 = s.substr(i-1,1);
        if(i &gt; 1) prev1 = s.substr(i-2,1);

        &#x2F;&#x2F;check for aba if we have gone far enough
        if(i &gt;= 2) {
            &#x2F;&#x2F;console.log(&#x27;does prev3 === prev2 &#x27;+(prev3===prev2));
            &#x2F;&#x2F;if(prev3 === prev2) return false;
            &#x2F;&#x2F;console.log(&#x27;does prev1 eq curr? &#x27;+(prev1===curr));
            &#x2F;&#x2F;console.log(&#x27;does prev3 eq prev2? &#x27;+(prev2===prev3));
            if(curr !== &#x27; &#x27; &amp;&amp; prev1 !== &#x27; &#x27; &amp;&amp; prev2 != &#x27; &#x27; &amp;&amp; curr !== prev2 &amp;&amp; curr === prev1) results.push(prev1+prev2+curr);
        }
    }
    return results;
}

function supportsSSL(s) {

    &#x2F;*
    first, get all the ABAs from s minus brackets
    *&#x2F;
    let matches = s.match(&#x2F;\[.*?\]&#x2F;g);
    for(let i=0;i&lt;matches.length;i++) {
        s = s.replace(matches[i], &#x27; &#x27;);
    }
    &#x2F;&#x2F;now we have a clean string and bracket crap to check later
    let abas = findABA(s);

    &#x2F;&#x2F;leave early
    if(abas.length === 0) return false;
    &#x2F;&#x2F;now we are true if we can match the opposite of aba in brackets
    let bracketText = matches.join(&#x27; &#x27;).replace(&#x2F;[\[\]]&#x2F;g,&#x27;&#x27;);
    for(let i=0;i&lt;abas.length;i++) {
        let aba = abas[i];
        let bab = aba.substr(1,1) + aba.substr(0,1) + aba.substr(1,1);
&#x2F;&#x2F;        console.log(&#x27;bab is &#x27;+bab);
&#x2F;&#x2F;        console.log(&#x27;bracketText is &#x27;+bracketText+ &#x27; idx of &#x27;+bracketText.indexOf(bab));
        if(bracketText.indexOf(bab) &gt;= 0) return true;
    };
    return false;
}
</code></pre>

This one caused me a lot of trouble just because I kept screwing up my findABA logic. My choice of variable names didn't
help either. But - it worked. Again, roughly.

As a warning, my solutions will only get uglier as we go further...

You can find my repo of solutions here: https://github.com/cfjedimaster/adventofcode