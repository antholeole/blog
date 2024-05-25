---
title: "The Quest to MinMax Programmer Productivity"
description: Journey of a man who will never switch to Vim
pubDate: May 04, 2024
---

Terminal productivity is amongst my favorite time sinks. It's often joked amongst the community of people who try to optimize their every keystroke that if they had just spent the time they spent tinkering with their config files actually doing money-producing work, they would have turned up pound for pound more productive, for some common sense of the word.

At first, I was apprehensive to uber-customizing my setup. If I spent too much time customizing, switching hardware would become a major pain. When I discovered nix and [home-manager](https://github.com/nix-community/home-manager), all earthly tethers were broken: I no longer worried about switching devices. I was now coddled with infinite reproduceability at the hands of the immutable gods.

Here's what we're currently working with:

![A starry night sky.](/images/setup.png)

Everything, of course, is binded to keybinds. I have neurons in my brain who's sole task is to react to me touching my mouse with thoughts of"What keybind could I have created to avoid that?" perhaps it is producitive - I imagine my fingers spend rougly 30% more time on the keys than someone who hasn't maximized their setup, although what that 30% is worth is oft questionable.

One example of a small rabbit hole I found myself going down very recently was screenshots - I often show my co-workers screenshots of what I see on my screen (sometimes because my screenshare is broken - cursed be wayland!) and opening up a terminal and typing `sleep 3; grimshot` was probably not the best way to be taking screenshots.

So I [wrote a small script](https://github.com/antholeole/nixconfig/blob/main/shared/screenshot.nix) that allowed me to bind a keybind to taking an area selection screenshot on my screen (this is perhaps the one and only time I have totally accepted using they mouse.). Soon, I realized that screenshots were not enough: screenshots could be enchanced with annotations! Back at the lab, I implemented a second keybind that opened up the most recently taken screenshot in [koulorpaint](https://apps.kde.org/kolourpaint/), so I could edit it immediately.

Each mouse touch was painful: I have plenty of keys at my disposal. Why would I need to use a whole hand for two keys? Thus, my mortal enemy, Google Chrome, and I were locked in what was supposed to be eternal combat, for many websites had not implemented efficent keyboard nagivation. Fortunately, I found my exalibur for even this foe: [vimium](https://github.com/philc/vimium). With a wonderful tagline "The Hacker's Browser" it turned out to be exactly what I needed to even further cut down my journey to my mouse. My favorite keybind is to click `s` to enter a `jump.nvim` like menu: each button on the screen is annotated with two letters. Type those two letters and the button is automatically clicked for you - and just like that, I no longer even click buttons with my mouse. 

The astute amongst you may have noticed that I use VSCode in my previous screenshot. This, unfortunately, is a story of switching costs. VSCode was my first editor, as well as many of my peers first editors. Slowly, I begain to customize it to be more and more to my liking. Soon, I was too far down the rabbit hole to be able to switch to a terminal editor. Realistically, I have no compliants: contrary to many vim users, I actually edit code other than my editor configuration; the JSON based config language is a little bit of a pain, but nothing some trial and error can't fix. Points to Microsofts leadership: by writing this bespoke, almost cryptic configuration language, they made it very hard to leave. I do have over [1000 lines of configuration](https://github.com/antholeole/nixconfig/tree/main/confs/code), so just by sheer gravitational force of configuration I am unable to leave.

But how do I get around using my mouse with VSCode, you ask? Enter Kakoune - or more specifically, [Dance](https://github.com/71/dance). Dance enters VSCode in a kakoune-like emulation mode. it is highly scriptable (or as close to scripting you can call JSON configuration). For example, I've built myself a [git menu in VSCode](https://github.com/antholeole/nixconfig/blob/4ef8b461493e7e558d332de977bf099a2f99906d/confs/code/keybindings.json#L661-L695): 

- Graph opens a graph view, a keybinding I literally have never used in practice. 
- "previous diff" opens the current file in the previous commit in a split view, so I can see what changed. Painstakingly, I made is so that if I hit the same key again, it goes back another commit ad infinium.
- "history", which opens the file history. 
- "revert" reverts the current section of code that I have highlighted to what is currently staged: this is actually incredibly useful, becuase I often write code and immediately realize it is garbage, so being able to rid it from this earth in one keybind is a favor to us all.
- Some other stuff I will not explain here, although I can explain at request.

Dance packages in a version of [leap.nvim](https://github.com/ggandor/leap.nvim) - which, for the first half of my Dance usage, I did not understand - then almost overnight, I learned of the power of it and now cannot live without it. I use VSCode Harpoon, apparently originally created by someone named Primeagen and ported over to VSCode. I use [errorlens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens), so I can roleplay that I am using Vim. If you're interested in all the VSCode extensions I use, [look no further](https://github.com/antholeole/nixconfig/blob/4ef8b461493e7e558d332de977bf099a2f99906d/hmModules/code.nix#L47-L73).

As for keyboard, I am currently using a [Kenesis Advantage 360](https://kinesis-ergo.com/keyboards/advantage360/) at Work and a [Kenesis Advantage 2](https://kinesis-ergo.com/shop/advantage2/) at home. I found I was far too productive on these keyboards, so I am currently assembling a [Charybdis Nano](https://bastardkb.com/product/charybdis-nano-prebuilt-preorder-2/) - I will probably also switch keyboard layouts when I complete that build (This was my first time souldering, and I melted off part of the audio socket - although the right half of the keyboard is excellent!). I will be making a build log blog post on the keyboard assembly at some point, so I won't get too much into detail here. 

I haven't even begun to explain what I did to my terminal: it is probably closer to AGI than chatGPT itself. Fish shell is very powerful and autocompletes many, many things - I also use [Atuin](https://atuin.sh/) for my shell history so that I can take my mistakes from computer to computer. I can attribute perhaps may hours of my life saved from typing git commands to the wonderful [jhillyerd](https://github.com/jhillyerd/plugin-git) on github - expansions on the classic git commands make it so that I can `git commit -m "WIP"` many times a day without ever spelling it out. I use [zellij](https://zellij.dev/) instead of tmux (I don't have a good reason - I literally think it was because I ran into zellij and thought working in a multiplexer would be nice).

## Was it all worth it? 

First of all: this post does not scratch the surface. I have 353 commits in my dotfiles, most of them adding some totally new category of goodies. 

I still have a very long career ahead of me. One thing that has always stuck out to me in economics class is that if you intend to invest in skills, it is best to do it early in your career so it has a longer runway to pay out. I refuse to count the hours I spent tinkering with window managers, or setting up aliases I ended up never using. I like to think it was a learning process - this journey took me all the way from learning nix to learning how to use a multimeter - but has also costed me a non-negligible amount. I'll report back to this blog post in 20 years (or tell my Rabbit R1 to do it for me) and update it with if I think this was a good investment of my time or not. 

Did I have fun? absolutely.
