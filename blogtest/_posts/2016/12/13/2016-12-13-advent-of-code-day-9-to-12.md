---
layout: post
title: "Advent of Code - Day 9 to 12"
date: "2016-12-13T06:26:00-07:00"
categories: [development]
tags: [advent of code,javascript]
banner_image: 
permalink: /2016/12/13/advent-of-code-day-9-to-12
---

I've got a bunch of code to share so let's get started. As before, be sure to check my [repo](https://github.com/cfjedimaster/adventofcode) for the full code of my solutions.

Day 9
---

[Day 9](http://adventofcode.com/2016/day/9) was a doozy. Basically the idea was to work with a compressed string, think a zip file, and decompress it. Part one used this rule: Given the existence of (XxY) in a string, it means that you repeat the next X characters Y times. Your solution needs to decompress the string and output the length.

<pre><code class="language-javascript">
&#x2F;&#x2F;console.log(decompress(&#x27;ADVENT&#x27;));
&#x2F;&#x2F;console.log(&#x27;-------------------------&#x27;);
&#x2F;&#x2F;console.log(decompress(&#x27;A(1x5)BC&#x27;));
&#x2F;&#x2F;console.log(&#x27;-------------------------&#x27;);
&#x2F;&#x2F;console.log(decompress(&#x27;(3x3)XYZ&#x27;));
&#x2F;&#x2F;console.log(&#x27;-------------------------&#x27;);
&#x2F;*
console.log(&#x27;ABCBCDEFEFG&#x27; == decompress(&#x27;A(2x2)BCD(2x2)EFG&#x27;));
console.log(&#x27;-------------------------&#x27;);

console.log(&#x27;(1x3)A&#x27; == decompress(&#x27;(6x1)(1x3)A&#x27;));
console.log(&#x27;-------------------------&#x27;);

console.log(&#x27;X(3x3)ABC(3x3)ABCY&#x27; == decompress(&#x27;X(8x2)(3x3)ABCY&#x27;));
console.log(&#x27;-------------------------&#x27;);
*&#x2F;
const fs = require(&#x27;fs&#x27;);
let input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);
&#x2F;&#x2F;this should be one line
input = input.replace(&#x2F; &#x2F;g, &#x27;&#x27;);
input = input.replace(&#x2F;\n&#x2F;g, &#x27;&#x27;);


&#x2F;&#x2F; 120767 is too high
let result = decompress(input);
console.log(result.length);

function decompress(s) {
    let matches = s.match(&#x2F;\(\d+x\d+\)&#x2F;);
    if(!matches) return s;
    let result = &#x27;&#x27;;

    while(matches) {
&#x2F;&#x2F;        console.log(matches);
        let marker = matches[0].replace(&#x2F;[\(\)]&#x2F;g,&#x27;&#x27;);
        let [numChar, numRep] = marker.split(&#x27;x&#x27;);
&#x2F;&#x2F;        console.log(&#x27;marker=&#x27;+marker, numChar, numRep);
        numChar = Number(numChar); numRep = Number(numRep);

        let stringToRepeat = s.substr(matches.index+matches[0].length, numChar);
        let repeated = stringToRepeat.repeat(numRep);
&#x2F;&#x2F;        console.log(&#x27;stringToRepeat=&#x27;+stringToRepeat, repeated);
        &#x2F;*
        new string is:
        0-Where I found match
        Repeated String
        0 + Where I found match + length of match + length of string to repeat

        TO the end
        *&#x2F;
        result += s.substr(0, matches.index);
&#x2F;&#x2F;        console.log(&#x27;result so far = &#x27;+result);
        result += repeated;
&#x2F;&#x2F;        console.log(&#x27;result so far = &#x27;+result);
        &#x2F;&#x2F;the last part is a bit more complex
        &#x2F;&#x2F;we need to know the number here so we can search past it later
        minMatch = matches.index + matches[0].length + numChar;
&#x2F;&#x2F;        console.log(&#x27;lastPart num is &#x27;,minMatch);
        let lastPart = s.substr(minMatch);
&#x2F;&#x2F;        console.log(&#x27;lastPart&#x27;,lastPart);
        s = lastPart;

        matches = s.match(&#x2F;\(\d+x\d+\)&#x2F;);
        &#x2F;&#x2F;will we continue?
&#x2F;&#x2F;        console.log(matches);
&#x2F;&#x2F;        console.log(&#x27;\n\n&#x27;);
        if(!matches) result += s;
    }
    return result;
}

</code></pre>

Nothing too crazy here, just a bunch of string manipulation. Part 2 did something crazy. Previously, if you found a marker within text that was being repeated, you ignored it. Now you need to decompress that too. What happens now is that the string gets so big, you run out of memory! So along with continuing to decompress, I had to switch my code to not actually create the result string, but just keep track of the length.

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
let input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);
&#x2F;&#x2F;this should be one line
input = input.replace(&#x2F; &#x2F;g, &#x27;&#x27;);
input = input.replace(&#x2F;\n&#x2F;g, &#x27;&#x27;);


let result = decompress(input);
console.log(result);
&#x2F;&#x2F;final answer: 11,658,395,076

function decompress(s) {
    let matches = s.match(&#x2F;\(\d+x\d+\)&#x2F;);
    if(!matches) return s;
    let result = 0;

    while(matches) {
&#x2F;&#x2F;        console.log(matches);
        let marker = matches[0].replace(&#x2F;[\(\)]&#x2F;g,&#x27;&#x27;);
        let [numChar, numRep] = marker.split(&#x27;x&#x27;);
&#x2F;&#x2F;        console.log(&#x27;marker=&#x27;+marker, numChar, numRep);
        numChar = Number(numChar); numRep = Number(numRep);

        let stringToRepeat = s.substr(matches.index+matches[0].length, numChar);
        let repeated = stringToRepeat.repeat(numRep);
&#x2F;&#x2F;        console.log(&#x27;stringToRepeat=&#x27;+stringToRepeat, repeated);
        &#x2F;*
        new string is:
        0-Where I found match
        Repeated String
        *&#x2F;
        result += (s.substr(0, matches.index)).length;
&#x2F;&#x2F;        console.log(&#x27;result so far = &#x27;+result);
        if(result % 500000 === 0) console.log(result);
&#x2F;&#x2F;        result += repeated;
&#x2F;&#x2F;        console.log(&#x27;result so far = &#x27;+result);
        &#x2F;&#x2F;the last part is a bit more complex
        &#x2F;&#x2F;we need to know the number here so we can search past it later
        minMatch = matches.index + matches[0].length + numChar;
&#x2F;&#x2F;        console.log(&#x27;lastPart num is &#x27;,minMatch);
        let lastPart = s.substr(minMatch);
&#x2F;&#x2F;        console.log(&#x27;lastPart&#x27;,lastPart);
        s = repeated += lastPart;

        matches = s.match(&#x2F;\(\d+x\d+\)&#x2F;);
        &#x2F;&#x2F;will we continue?
        if(!matches) result += s.length;
    }
    return result;
}
</code></pre>

Day 10
---

[Day 10](http://adventofcode.com/2016/day/10) was another fun one (two in a row, I should have known what was coming next). Basically your input is a set of instructions to bots that take values from an input bucket and then, eventually, copy them to an output bucket. Bots can hold two values and then have a rule saying, "I give my lower value to bot X and my higher value to bot Y", or instead they can copy a high/low value to the final output bucket. Your goal is to figure out what bot "held" values 61 and 17. 

<pre><code class="language-javascript">
const fs = require(&#x27;fs&#x27;);
let input = fs.readFileSync(&#x27;.&#x2F;input.txt&#x27;,&#x27;utf8&#x27;);

let inputs = input.split(&#x27;\n&#x27;);

let bots = [];
let output = [];

function defineBot() {
    return {
        chips:[],
        logic:{% raw %}{&#x27;low&#x27;:-1, &#x27;high&#x27;:-1}{% endraw %}
    }
}

inputs.forEach(function(cmd) {
&#x2F;&#x2F;    console.log(&#x27;CMD: &#x27;+cmd);

    &#x2F;&#x2F; value X goes to bot Y
    if(cmd.indexOf(&#x27;value &#x27;) == 0) {
        let parts = cmd.split(&#x27; &#x27;);
        let value = parts[1];
        let bot = parts[5];
        if(!bots[bot]) bots[bot] = defineBot();

        bots[bot].chips.push(Number(value));
&#x2F;&#x2F;        console.log(&#x27;The bot is now: &#x27;+JSON.stringify(bots[bot]));
    }

    &#x2F;&#x2F;bot X gives low to bot Y and high to bot Z
    &#x2F;&#x2F;bot x gives low to OUTPUT Y
    if(cmd.indexOf(&#x27;bot &#x27;) == 0) {
        let parts = cmd.split(&#x27; &#x27;);
        let owner = parts[1];

        if(!bots[owner]) bots[owner] = defineBot();

        bots[owner].logic.low = {% raw %}{target:parts[6], type:parts[5]}{% endraw %};
        bots[owner].logic.high = {% raw %}{target:parts[11], type:parts[10]}{% endraw %};
    }

});

&#x2F;&#x2F;console.log(JSON.stringify(bots));
&#x2F;&#x2F;process.exit(1);

&#x2F;&#x2F;ok so in theory, we can process until we can&#x27;t
var zz = 0;
while(hasStuffToDo(bots)) {
    for(let x=0;x&lt;bots.length;x++) {
        let thisBot = bots[x];
        if(thisBot.chips.length == 2) {
&#x2F;&#x2F;            console.log(&#x27;processing bot &#x27;+JSON.stringify(thisBot));
            let sorted = thisBot.chips.sort((function(x,y) {
                if(x &lt; y) return -1;
                if(x &gt; y) return 1;
                return 0;
            }));
            let myLow = sorted[0];
            let myHigh = sorted[1];

            if(sorted[0] == 17 &amp;&amp; sorted[1] == 61) {
                &#x2F;&#x2F;13 is too low
                console.log(&#x27;WINNER? &#x27;+x);
            }
&#x2F;&#x2F;            console.log(&#x27;my low is &#x27;+myLow+ &#x27; and my high is &#x27;+myHigh);
            &#x2F;&#x2F;hand stuf fout
            let lowTarget = thisBot.logic.low.target;
            let lowType = thisBot.logic.low.type;
            let highTarget = thisBot.logic.high.target;
            let highType = thisBot.logic.high.type;
            
            if(lowType === &#x27;bot&#x27;) {
&#x2F;&#x2F;                console.log(&#x27;hand my low chip to &#x27;+lowTarget);
                bots[lowTarget].chips.push(myLow);
            } else {
&#x2F;&#x2F;                console.log(&#x27;hand my low chip to output &#x27;+lowTarget);
                output[lowTarget] = myLow;
            }

            if(highType === &#x27;bot&#x27;) {
&#x2F;&#x2F;                console.log(&#x27;hand my high chip to &#x27;+highTarget);
                bots[highTarget].chips.push(myHigh);
            } else {
&#x2F;&#x2F;                console.log(&#x27;hand my high chip to output &#x27;+highTarget);
                output[highTarget] = myHigh;
            }

            bots[x].chips = [];
        }

    }
    zz++; if(zz &gt; 100) {% raw %}{ console.log(&#x27;ABORT&#x27;); process.exit(); }{% endraw %}
}

console.log(&#x27;OUTPUT&#x27;,output);

&#x2F;&#x2F;I return true as long as one bot has 2 chips
function hasStuffToDo(bots) {
    for(var x=0;x&lt;bots.length;x++) {
        if(bots[x].chips.length === 2) return true;
    }
    return false;
}
</code></pre>

Part 2 simply asked you to output the product of some of the values in the output array, and since I had output them already, I didn't need to write any code at all.

Day 11
---

Well, it happened. [Day 11](http://adventofcode.com/2016/day/11) was the day that finally brought me to a complete stop. Intellectually I understood the problem, but honestly I couldn't see any way I was ever going to solve it. Last year when this happened I typically found a solution in another language and rewrote it in JavaScript, but I was a bit short on time so I *really* cheated. I found a Python solution and simply ran it. As I didn't have Python installed yet, I figured I was at least correcting that problem too. 

Day 12
---

Woot! A fun one again! And one that's based on a puzzle from last year if I'm not mistaken. [Day 12](http://adventofcode.com/2016/day/12) basically has you implementing a little Assembly-like language. So for examlpe, your input may be:

<pre><code class="language-markup">
cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a
</code></pre>

Your code either moves/sets values in registers or has you change the order of code execution. Outside of a few dumb mistakes I made, this one was simple.

<pre><code class="language-javascript">
let input = `cpy 1 a
cpy 1 b
cpy 26 d
jnz c 2
jnz 1 5
cpy 7 c
inc d
dec c
jnz c -2
cpy a c
inc a
dec b
jnz b -2
cpy c b
dec d
jnz d -6
cpy 17 c
cpy 18 d
inc a
dec d
jnz d -2
dec c
jnz c -5`;

let instructions = input.split(&#x27;\n&#x27;);
&#x2F;&#x2F;problem 2 sets c to 1, problem 1 sets it to 0
let registers = {% raw %}{a:0, b:0, c:0, d:0 }{% endraw %};

let sanity = 0;
for(var i=0;i&lt;instructions.length;i++) {
    let instruction = instructions[i];
    &#x2F;&#x2F;console.log(i+&#x27;: &#x27;+instruction);
    
    if(instruction.indexOf(&#x27;cpy&#x27;) === 0) {
        let [,from,target] = instruction.split(&#x27; &#x27;);
    &#x2F;&#x2F;    console.log(&#x27;copy &#x27;+from+&#x27; to &#x27;+target);
        
        if(from === &#x27;a&#x27;) {
            registers[target] = registers[&quot;a&quot;];
        } else if(from === &#x27;b&#x27;) {
            registers[target] = registers[&quot;b&quot;];
        } else if(from === &#x27;c&#x27;) {
            registers[target] = registers[&quot;c&quot;];
        } else if(from === &#x27;d&#x27;) {
            registers[target] = registers[&quot;d&quot;];
        } else {
            registers[target] = Number(from);
        }
        
    }

    if(instruction.indexOf(&#x27;inc&#x27;) === 0) {
        let [,target] = instruction.split(&#x27; &#x27;);
  &#x2F;&#x2F;      console.log(&#x27;inc &#x27;+target);
        registers[target]++;
    }

    if(instruction.indexOf(&#x27;dec&#x27;) === 0) {
        let [,target] = instruction.split(&#x27; &#x27;);
&#x2F;&#x2F;        console.log(&#x27;dec &#x27;+target);
        registers[target]--;
    }

    if(instruction.indexOf(&#x27;jnz&#x27;) === 0) {
        &#x2F;*
        jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero
        *&#x2F;
        let [,x,y] = instruction.split(&#x27; &#x27;);
        if(registers[x]!=0) {
&#x2F;&#x2F;            console.log(&#x27;jump &#x27;+x+&#x27; &#x27;+y+&#x27; away&#x27;);
            y--;
            i+=Number(y);
        }
    }

&#x2F;&#x2F;    sanity++;
&#x2F;&#x2F;    console.log(registers);
&#x2F;&#x2F;    if(sanity &gt; 300000) {% raw %}{ console.log(&#x27;EXIT&#x27;); process.exit(); }{% endraw %}
}

console.log(registers);
</code></pre>

Part two had you simply change an initial value (which is what I ended up committing to GitHub) so I didn't make a new file.