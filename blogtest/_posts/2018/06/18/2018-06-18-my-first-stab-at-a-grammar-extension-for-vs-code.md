---
layout: post
title: "My First Stab at a Grammar Extension for VS Code"
date: "2018-06-18"
categories: ["development"]
tags: ["visual studio code"]
banner_image: /images/banners/proofread.jpg
permalink: /2018/06/18/my-first-stab-at-a-grammar-extension-for-vs-code
---

Let me start off by saying that this isn't necessarily the *best* Visual Studio Code extension out there and - frankly - it's probably near the bottom. But it's a beginning and probably the easiest experience I had building an extension yet. So what did I build? 

I've been using spell checking extensions in VS Code for sometime. (My current favorite is [Spell Right](https://marketplace.visualstudio.com/items?itemName=ban.spellright)). While the extension is good for catching spelling mistakes, it doesn't handle grammar. [Grammarly](https://www.grammarly.com/) has a pretty cool tool for checking grammar but doesn't have an API. When I asked about this on Twitter, the folks at [LanguageTool](https://languagetool.org/) chimed in to share that they *did* have an API and it was free to use. Their service is free (with a [premium upgrade](https://languagetool.org/#Price) option) so I decided to give it a whirl.

The [public API](http://wiki.languagetool.org/public-http-api) has a fairly simple endpoint. You pass in text, a language (or tell it to guess), and you get results. You can customize the results by turning on and off various rules though. Here's the entire extension, code-wise anyway:

```js
'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as rp from 'request-promise';
import * as showdown from 'showdown';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.runLanguageTool', async () => {
        // The code you place here will be executed every time your command is executed

        // get current document text

        let editor = vscode.window.activeTextEditor;
        if(!editor) {
            vscode.window.showErrorMessage('No active editor to check.');
            return;
        }
        console.log('lang',editor.document.languageId);

        let text = editor.document.getText();
        let type = editor.document.languageId;

        // now lets try to remove common MD front matter stuff (and maybe do more later)
        text = prepareText(text, type);

        if(text.length === 0) {
            vscode.window.showErrorMessage('No text to check.');
            return;
        }

        let results = await checkText(text);

        console.log(results);

        // now id make some good html
        let html = generateHTML(results as Array<any>);

        // now render it
        const panel = vscode.window.createWebviewPanel(
            'languageToolResults', // Identifies the type of the webview. Used internally
            "LanguageTool Results", // Title of the panel displayed to the user
            vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
            { } // Webview options. More on these later.
        );
        panel.webview.html = html;

    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function prepareText(s:string,type:string):string {
    /*
    lets first remove ---X---
    */
    s = s.replace(/---[\s\S]*---/m,'').trim();
    // todo - more ;)

    //if type is markdown, lets render it to html and then remove it
    if(type === 'markdown') {
        let converter = new showdown.Converter();
        s = converter.makeHtml(s);
        // remove code blocks
        s = s.replace(/<pre><code[\s\S]*?<\/code><\/pre>/mg, '');
        // now remove html
        s = s.replace(/<.*?>/g, '');
    }
    return s;
}

async function checkText(s:string) {
    return new Promise((resolve, reject) => {
        rp({
            uri:'https://languagetool.org/api/v2/check',
            method:'POST',
            form:{
                text:s,
                language:'auto',
                disabledRules:'EN_QUOTES'
            }
        })
        .then(res => {
            resolve(JSON.parse(res).matches);
        })
        .catch(e => {
            console.log('error calling api', e);
            reject(e);
        });

    });

}

function generateHTML(data:Array<any>):string {

    /*
    So before release, I decided to simply render all the rules the same. I'm keeping some old bits in
    for review later though...

    let replacementRules = ['MORFOLOGIK_RULE_EN_US','COMMA_COMPOUND_SENTENCE','COMMA_PARENTHESIS_WHITESPACE'];
    */
    let results = '';
    let counter = 0;

    data.forEach(d => {
        counter++;
        let s = '<p><b>'+counter+') '+d.message+'</b><br/>';
        //if(replacementRules.indexOf(d.rule.id) >= 0) {

        // generate highlighted context
        let badword = d.context.text.substr(d.context.offset,d.context.length);
        let sentence = d.context.text.replace(badword, '<b><i>'+badword+'</i></b>');
        s += sentence+'<br/>';
        let replacements:string[] = [];
        d.replacements.forEach((r: any) => {
            replacements.push(r.value);
        });
        s += 'Suggestions: '+replacements.join(',');

        //}
        s += '</p>';
        results += s;
    });

    let content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>LanguageTool Results</h1>
    <p>
    The following results are provided by <a href="https://languagetool.org/">LanguageTool</a>.
    </p>

    <p>
    There were ${data.length} result(s) found:
    </p>

    ${results}

</body>
</html>   
`;

    return content;
}
```

From top to bottom:

* I register a command, `runLanguageTool`, that the end user will run via F1.
* I attempt to get the text in the current document.
* I then do a bit of manipulation on the text with the assumption that it's probably Markdown and has front matter. I also render it to HTML and then remove that HTML in an attempt to get to the "pure" text. This has the side effect of not being able to report an issue and line it up with a line number, but I think that is ok.
* Finally, I render it using one of the newer VS Code extension APIs, the web view. This is a pretty powerful feature that supports communication back and forth, but for my usage I just render to HTML.
* And yeah, it's not terribly pretty.

![Sample Output](https://static.raymondcamden.com/images/2018/05/lt1.jpg)

That's probably a bit hard to read, so here is a copy and paste:

<blockquote>
<p>
1) Possible spelling mistake found<br/>
...y I discovered the awesomeness of Slash Webtasks, an incredibly easy way to build your o...<br/>
Suggestions: Web tasks
</p>
<p>
2) Possible spelling mistake found<br/>
...edibly easy way to build your own Slack integrations using Webtask. And while it truly is an...<br/>
Suggestions: integration,integration s<br/>
</p>
<p>
3) Possible spelling mistake found<br/>
...build your own Slack integrations using Webtask. And while it truly is an awesome tool,...<br/>
Suggestions: Web task<br/>
</p>
<p>
4) Possible spelling mistake found<br/>
...egration, especially when paired with a webtask, and I'd like to share a simple demo I ...<br/>
Suggestions: web task<br/>
</p>
<p>
5) Possible spelling mistake found<br/>
...ining in a channel. We can use Slack's APIs to accomplish this with the following s...<br/>
Suggestions: Axis,Apes,Apia,Avis,Apps,Apish,AIs,API,Pis,API s,ABIS,AFIS,AIS,AMIS,APII,APRS,APS,GPIS,PIS<br/>
</p>
<p>
6) Possible spelling mistake found<br/>
...llowing steps: Send every message to a serverless endpoint Take the text and analyze the ...<br/>
Suggestions: server less<br/>
</p>
</blockquote>

It could definitely use some improvement so I'd love folks to take a look at it. You can find the repo here: [https://github.com/cfjedimaster/vscode-languagetool](https://github.com/cfjedimaster/vscode-languagetool). And you can install it here: [https://marketplace.visualstudio.com/items?itemName=raymondcamden.languagetool](https://marketplace.visualstudio.com/items?itemName=raymondcamden.languagetool). Let me know what you think. As I said, this was - generally - a good experience working on the extension. I have not had the best experience with VS Code extension development. There isn't anything necessarily wrong with it, I just don't find it quite as simple as [Brackets](http://brackets.io/).

Oh - and I'm still trying out the whole async/await thing and I still freaking love it. 

<i>Header photo by <a href="https://unsplash.com/photos/zssAC1KCzNs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Markus Spiske</a> on Unsplash</i>