---
title: "Scala as a Scripting Language"
description: Another hat in the scripting ring
pubDate: April 13 2024
---

Without going into too much detail, I often find the need in $DAYJOB to write one-off scripts - scripts that _mostly_ are write-once, run-once, then discard. There are a couple languages that usually handle this job:

- There's Python, which I'd wager (with no data to back it up) that this is the scripting language that most people lean towards.
- There's shell scripts in whatever flavor (fish, bash, zsh, etc. etc.) you choose. 
- Then there's everything else, which tends to take a much smaller portion of the scripting marketshare than the top 2.

Python has some fanstic features: for one, its installed on just about everyones computer. You can almost certainly assume that you can send a python file to any co-worker, and that python is on $PATH and ready to go for them. The second feature of python is it tends to just... get out of the way? You don't have to think too much about the syntax minus a few quirks I'll get into later. 

And shell scripts? Often times, if you're parsing some massive tab-deleniated text file or some huge json, command line builtins (I use the term "builtins" loosely - essentially, binaries that most computers come out the box installed. `cut`, `tr`, `sed`, `awk`, etc...) are able to do the trick in only a couple of lines.

But Python and shell scripts share some of the same fatal flaws: for one, if you happen to know some dependency that would make your task easier, installing it nukes the portability. Most people have Python installed on their device, but not everyone has python with e.g. Pandas installed. I bet most people who do any degree of json work have `jq` installed; but `yq`, for kubernetes engineers? You're down to a small percentage. You can no longer send that script to a co-worker without a README-like.

Another flaw (perhaps a more human flaw) is that often times,  these scripts are actually _not_ one-offs. You write the script once, and intend to solve the problem one time, but 3 months down the line a similar problem occurs and you dig up your script. Or you send it to a few co-workers who write it to their script directory and end up using it more than you intended, and now everyone is using a neigh-unmaintainable script to do work. These rarely get rewritten or committed, but they float around nonetheless. 

### Scripting Language Metrics

So how do we grade scripting language alternatives? There are some metrics that I find useful. 

- Promotability: the ability for a script to be "promoted" into core codebase. How easily it is to extend, grok, and make happy.
- Mean Time to First Working Script: No one here is superhuman. We often write a script and realize that e.g. we split on spaces, but the file uses tabs for column deliniation. How quickly can we iterate on a script so that its in a working state? We'll call this metric MTFWS.
- Portability: the "send to co-worker" effect. Can I send a send a file to my co-worker and have them be able to run it? 

So where do bash and python lie on these metrics? Python is high in promotability and portability, but lower in MTFWS (mean to first working script, as mentioned prior). Bash has a bimodal distribution in MTFWS: it either works the first time, or you have to go digging into manpages to find the right flag; and if the script requires a function, it's probably game over. 

Where does scala lie? 

### Cut to Scala - or Scala-CLI

Where does scala lie on these metrics? Almost nobody has scala-cli, so portability is out the window. It is on nixpkgs, so anyone using the one true package manager can easily install it, but I bet most people don't have it installed.

But I do think MTTFWS is incredibly high - much higher than bash or python. Python's lack of type safety gets me in holes quite often. Perhaps I'm a bad engineer, but I often use python's `JSON.loads` and then `.` syntax it, realize it didn't work and then have to rewrite the script with indexing - i.e. I do `JSON.loads(some_str).my_property`, not `["my_property"]`.

scala-cli allows importing dependencies from maven using `//> using dep <depedency>`, meaning if you need to plot a graph, you can do so in a single file without having to worry about a `requirements.txt` or similar. It's a functional programming language, so you often catch edge cases before the first run - use of direct index access is discouraged (although in cases where we want to, we can direct index access) and the streaming API (filter, map, foreach, etc.) is a breeze and allows for infintely extensible code.

Lets take it through a showcase.

### The problem

Imagine this: we have a fleet of 100+ VM's. We want to check if we're reporting the memory to our metric server correctly. We've already used `chef` or a similar tool to export the outputs of `free -h` (In reality, we'd probably want to use `-b` instead of `-h`, but that would make the bash script too easy to write and so I use `-h` to make this example a little more fun. For the skeptics amongst us, imagine that this file output was given to us by some customer.) into a file, and the file `free.txt` looks like this:

```
some-computer-1:                 total      used       free        shared      buff/cache   available
some-computer-1: Mem:            31Gi       9.1Gi       8.1Gi       1.6Gi        15Gi            21Gi
some-computer-1: Swap:           26Gi          0B        26Gi                                    
some-computer-2:                 total      used       free        shared      buff/cache   available
some-computer-2: Mem:            31Gi       9.1Gi       8.1Gi       1.6Gi        15Gi            21Gi
some-computer-2: Swap:           26Gi          0B        26Gi                                    
...
```

So we have another file called `graphana-stats.json` that looks like this: 

```json
{
    "some-computer-1": {
        "memory": 31000000000,
        "cpu": 0.63
    },
    "some-computer-2": {
        "memory": 31000000000,
        "cpu": 0.43
    }
}
```

its a sample of the memory a the same time. The catch is we expect the entire VM to have higher memory use by some threshold, but not more than one gigabyte since our process is by far the most intense user of memory on that VM.

The problem, in short: for each VM, make sure that the used memory is within what is reported in that json + 1GB, and we want to make sure we didn't miss any VMs - if a VM is in one file but not the other, we should report it.

Without `jq`, this script wouldn't be very easy to write in shell. Python has a built in json processor, so we don't need to install anything for python.

### Writing the Scala

The goal here is not to write maintainable code. The goal here is to write a script, fast, and show the features of `scala-cli`. I'm taking some shortcuts, like using variable names I would never use in the real world - but bad variable names are better than pipe-hell of bash :).

Start off with a blank `run.sc`, or whatever `.sc` you want. `.sc` tells our IDE that this is a `scala-script` file, and we can do some magic. For instance, we don't need a main method. We can just get to hacking like an interpreted language: 

```scala
println("hi")
```

Is perfectly valid scala-cli code!

Lets define a constant for the threshold:  

```scala
val gbThreshold = 1
```

Now we need to open the files. How do we do that? we first need to import [scala toolkit](https://docs.scala-lang.org/toolkit/introduction.html), a swiss-army knife package for scala.

```scala
//> using toolkit default

val gbThreshold = 1
```

now lets open those files:

```scala
//> using toolkit default

val gbThreshold = 1

val json = os.pwd / "graphana-stats.json"
val text = os.pwd / "free.txt"
```

Lets parse the json as a json:

```scala
val json = ujson.read(os.read(os.pwd / "graphana-stats.json"))
```

Now lets run through the top level attributes and complete step one of the task: make sure that we actually have all of the VMs accounted for. We'll just make two sets and print out the differences:

```scala
val inGraphana = json.obj.map(_._1).toSet

// This uses direct indexing, (0). Hopefully this doesn't bite us later!
val inChef = text.split("\n").map(_.split(":")(0)).toSet

println(s"in graphana but not in chef: ${inGraphana -- inChef}")
println(s"in chef but not in inGraphana: ${inChef -- inGraphana}")
```

that `_1` syntax is my least favorite part of scala; if you have a tuple, you can access the Nth element using `_N`, 1 indexed. If abused, it can make a mess. If you're finding you're making too heavy use of tuples, you could swap to a [case class](https://docs.scala-lang.org/tour/case-classes.html). 

--- 
**BONUS TIP**: in `scala-cli`, you can put tests in the same file as you have your source code, almost like in rust. [This may be the byproduct of some other refactor](https://github.com/VirtusLab/scala-cli/issues/1093#issuecomment-2053817880), but it works so lets not look a gift horse in the mouth. Lets write a quick test to make sure our diffing logic works:

extract `diffKeys` into a function:

```scala
def diffKeys(graphanaJson: ujson.Value, chefTxt: String): (Set[String], Set[String]) = {
    val inGraphana = json.obj.map(_._1).toSet
    val inChef = text.split("\n").map(_.split(":")(0)).toSet

    (
        inGraphana -- inChef,
        inChef -- inGraphana
    )
}
```

and write some tests, in literally the same file at the bottom:

```scala

```

---





