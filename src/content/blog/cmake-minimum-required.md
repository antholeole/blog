---
title: "A Night Spent On 'cmake_minimum_required'"
description: A False Assumption of CMake Behavior causes compiler error
pubDate: October 10, 2024
---

Getting some points on the board for todays brawl with CMake. 

In an attempt to assess the ergonomics of `c++20` modules, I tried to convert an old project to `c++20` modules. After some research, I felt well equipped to convert the leaf-most modules: It _should_ have been pretty straight forward. [This godbolt](https://gcc.godbolt.org/z/Wobrb87Es) does a good job reproducing an MVP, and it compiled fine with my clang++, ninja and cmake versions.

When I began converting modules, though, I quickly discovered that _something_ was causing my project to not compile a single module; or, rather, it would not _link_. The module compiled fine, but at linktime, cmake could no longer find the imported module.

After a very long drill down of every setting, I finally deleted almost the entire project and _still_ could not get my project to compile, only one directory away from the working, compiling example project - the same one that was working and compiling on godbolt. 

Finally, the least-likely culprit in my head turned out to be the culprit of interest:

`cmake_minimum_required`. 

I assumed (my mistake!) that `cmake_minimum_required` was the minimum required CMake version to compile the project. That is, if the user has CMake, say, `cmake_minimum_required(VERSION 3.25)`, as I did, I was operating under the assumption that CMake would instantly reject any CMake version below 3.25; that is, "the minimum required version to compile this project is 3.25".

But no - that is telling CMake that it needs to support version 3.25 and up; that is, any default, breaking changes that happened between 3.25 and the CMake version the user is running is toggled off. One of those features is _required_ for CMake to compile C++20 modules - the mental shift is to read it as "The minimum version that someone working on this project uses" - which is not surprising when you consider the heaps of legacy projects CMake needs to support.

The fix, then, was to bump the minimum required version to 3.28, just as in the aforementioned godbolt.

You live and you learn!

### Blockers For Modules

It's yet to be seen if switching to modules is actually possible for my workflow - [clangd](https://github.com/llvm/llvm-project/pull/66462) has merged module support, but much IDE niceties are still missing.

