---
title: "A Week With JJ"
description: JJ, a new experimental vcs
pubDate: July 15, 2024
---

I've heard about [jujutsu](https://github.com/martinvonz/jj) months ago. I've never been _bad_ at git; infact, I've been quite good at getting myself out of git-shaped pickles, and generally know my way around the tool - but I've always been looking for something _more_. Something I don't feel like I have to wrap up with scripts and monkeypatches.

In the recent wave of posts about `jj` (jj, if you weren't sure, is the binary name that jujutsu uses), followed by a sign-from-the-heavens coworker who switched to `jj` for a company hack-week, I ws finally convinced to give it a try. 

Unfortunately, I liked it a lot.

## Why "Unfortunately"?

Tool churn is a real problem for me. Not because I switch tools often: I don't. My tech stack is mostly append-only: for instance, I didn't forget how to use `grep` because I switched to `rg`. But I do build infrastructure around my tooling: a large amount of my shell scripts do git related actions. I think in my git aliases; I don't `git commit -m "something"`, I `gcm "something"`, which will expand to what I need. I'm well integrated! Switching out my VCS is not an easy task. After this week, I will slowly be re-writing all my tools to use `jj`.

In this particular instance of tool change, though, `jj` seems to be putting in the legwork to make such switching vastly easier. `jj` ships with a subcommand, `jj git`, which is `jj`'s solution to "It's called GitHub, not jjhub". The switch to `jj` was about as seamless as you could expect switching off something etched into your brain. A small aside: one thing I've been trying to do lately is to read all the docs if I'm on boarding a new technology. `jj`'s docs are excellent for this, and read like a book: it explains the _philosophy_ behind commands and ideas. This is infinitely more important than explaining the commands, since I can easily tab-complete or manpage my command line to see what all the options are. 

## The Really, Really Good

I will be skipping the discussion on the lack of a staging area: this horse is dead and has been beaten. The short of it for me is that it took a little bit to get used to and then I never wanted to go back: it fits the way my mind works better than `git`. I don't really have a mental "staging area", and I when I go off to do an experiment, I may not even have a good name for it. Many of my branches in `git` are called `oleina/refactor-<thing>`: perhaps I'm telling on myself here, but good API's write themselves from good principles, and often times I pull one one "code smell" thread and a beautiful API emerges. `oleina/refactor-<thing>` comes from the soul, and the soul does not want to wait for me to stash, or branch and commit. the soul wants to `jj new` and get to trying out experiments. 

Oops: perhaps I joined the horse beating.

`git` allows you to brute force the branching model. You do not have to understand a rebase to rebase - you will get in hairy, often impossible to salvage situations, but you can be a software engineer without looking at the `git` docs once. I'm not sure if the same can be said about `jj`, since I have not attempted the aforementioned doc skipping, but I'm sure its possible. After spending some time with `jj`, I feel like I truly understand branches. I understood them previously, but not to the degree that `jj` has taught them. Perhaps it is the delightful API: `jj rebase --from <some ref> --to <another ref>` is the most cleanly expressed rebasing I've ever seen. You can smell the lack of decades of legacy decisions, and it smells wonderful.

Speaking of years of legacy decisions: Here's one that `git` can't ever escape. The lack of an `undo` command. `git` requires you to say exactly what you want to undo: unstage, unadd, uncommit, unsomething. This is sensible! but each of those actions require a different subcommand, which gets quite difficult to track. Even the [git docs](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things) seem to have a hard time explaining the flow-chart of undo. The `jj undo` command is very good, in part or in full because `jj` tracks all operations sequentially. `jj operations list` is just _fun to look at_. I can see my entire day in a `jj operations list`: what I worked on from clock in to clock out. It is excellent; and to be able to undo a accidental branch 

## The Ugly

For my blog and my dotfiles, I push straight to master. This is disallowed in default `jj` - but having a cowboy's soul, I disabled the safety and continued pushing to main for my personal repos. More than once I have pushed commit A from one device, and then pushed from another and override commit A. I have no one to blame but myself: during this process, there were multiple warnings, and the command was blocked with flags. `jj` does not let you commit to a remote if your commit would move that remote back in time (i.e. to an ancestor) but I did it anyway and paid the price.

I also wish, with the caveat that I have yet to explore this domain, that I could limit _things I have to remember_ while using `jj`. I finish my work, and dust off my hands:`jj git push`. But it fails! You forgot to `jj describe` what the commit does (I realize this is entirely incompatible with my previous idea of branching off willy-nilly whenever I feel like it. I will take that and an error message over impeding work any day.)! I `jj describe` and re-attempt the push. But wait! you forgot to set the branch head! `jj branch move oleina/blah-blah`. Finally, the git push works. This is not cumbersome. It is three commands, and it is one week of using `jj`. I can almost guarantee that in 365 days or so, this will be muscle memory as `git add <>`, `git commit -m ".."` and `git push` is. 

## Will I continue to use it?

Without a doubt. I am slowly converting my git repositories to `jj` ones. I've all but ceased to use `git`, besides when my System 1 brain kicks in and types `git` quicker than I can tell it to use `jj`.
