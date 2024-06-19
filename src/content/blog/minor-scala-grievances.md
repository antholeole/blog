---
title: "Minor Scala Grievances"
description: Kinks in the Armor
pubDate: June 19, 2024
---

I have the pleasure of using Scala at $DAYJOB; I believe I landed on the only team at Google that uses Scala, for better or for worse (the "worse" part is without a doubt the poor integration with the broader Google infrastructure - a story for another day). 

I love writing in Scala. The niceties are great and the code is scalable - but that is not without minor problems. 

## Total Functions Are Not Partial Functions (In Scala 2)

I'm starting off with a weak point, since this has been fixed in Scala 3 - which I do not get to use, so I'll keep this point here - but hats off to the Scala team for fixing this.

In mathematical terms, a a function is some mapping from a domain x onto a range y; when you define a function in programming languages, you are mapping the domain of the inputs onto the range of whatever type you are returning (If you happen to be a mathamatician, please don't judge my poor-man's description of functions.). A partial function is a mapping of a _partial_ domain onto a range: the classic example is a `divide` function, where any input is mapped besides when the denominator is equal to zero. 

In Scala, it sometimes is easier to express a function in terms of a partial function. One example is `collect` on an iterator, which is essentially a `map` combined with a `filter`:

```scala
val mySeq: Seq[Option[String]] = Seq(Some("string"), None)

// note that mySeq needs to be massaged into the input type
// if we want to use it here.
def printStrings(s: Seq[String]) = {
    s.foreach(println)
}

// collect here is a partial function; we totally ignore
// the `None` case.
val onlyStrings = mySeq.collect {
    case Some(str) => str
}


printStrings(onlyStrings)
```

A partial domain, of course, is a subset of a total domain; that is, a total domain satisfies the definition of a partial domain - which is where Scala and math deviate. In Scala 2, this is not the case.

```scala
def myFn(s: String, pf: PartialFunction[String, Unit]): Unit = {
    pf(s)
}

myFn("hi", (s) => println(s))
```

This will throw a compile time error in Scala 2, since `(s) => println(s)` is a total function, which does not register to the compiler as a partial function.

Of course, this is the most minor of minor grievances, since the following is a valid partial function that maps over the entire domain:

```scala
{
    case _ => "output"
}
```

equivalent to a total function over any single input mapping to strings, but one that Scala will treat as a partial function.

## Partial Functions Are Not Compile Time Safe

This one works for both Scala 2 and Scala 3, but for good reason. 

One of the reasons to use a functional programming language is the compile time safety: you are reasonably sure, at compile time, that your program space is sound. A classic example of this is exhaustive matches: most functional languages promise us that if we are pattern matching, we've exhausted all the cases so there are no invalid inputs.


```scala
def myFn(s: String, pf: PartialFunction[String, Unit]): String = {
    pf(s)

    "done"
}

val mapHi: PartialFunction[String, Unit] = {
    case "hi" => print("hello")
}

myFn("hi", mapHi)
myFn("bye", mapHi)
```

And the above snippet compiles! It should be good, right? Lets run, and...

```
hello
helloException in thread "main" scala.MatchError: bye (of class java.lang.String)
```

Oh! what happened there? The case that didn't match "bye", threw an exception. Turns out, if you try to call a partial function and you don't get a match, it will throw an exception.  

If you think about it, this actually makes sense: in this example, we're discarding the output of the partial function, but in other examples, you may want to actually use the output of the partial function - and what if you don't get a match? There are sane ways to solve this problem at a language level, but they all involve some sort of opinion. For example, if you have the function return an option, every single partial function call will need some sort of option deconstruction afterwords (this is what the `.lift` operator on partial functions does).

Scala gives you tools to solve it yourself. For example, we have `applyOrElse`, which is the most efficent way to handle this scenario.

Because this is a hard problem to solve at a language level, best-case scenario here for me would be to enable a linter to say "this evaluation of a partial function is unsafe, you should try to perform a safe operation to map it onto a total range" or something of the sort.

## Rust's if let Construct

Is there any programming language article that can be written in 2024 without mentioning Rust? In this case, here's a feature from rust that I love, and would love to have in Scala.

Of course, this article is minor grievances: again, there is a sane solution, that looks just a tad but uglier.

Rust has a "if let" version of unapply; that is, we can unapply something in a procedural-ish way.

```rust
let myOption = Some("string");

if let Some(value) = myOption {
    println!(value);
}
```

we unapply the option using an if statement. There is no real scala equivalent besides pattern matching, but that needs to be exhaustive. If we just want to print the string if it exists, it looks like this:

```scala
val myOption = Some("string")

myOption match {
    case Some(value) => println(value)
    case None => ()
}
```

which is still fine, but reads a little worse. In both languages, I find myself not wanting to nest deeper into a closure, so I do something like this:

```scala

val maybeMyOption = Some("string")

if (maybeMyOption.isNone) {
    return <something>
}

val myValue = maybeMyOption.get

<proceed>
```

that isn't something that can be easily solved without some high level type inference; Typescript can do it, but that's because TS's compiler can "invent" types on the fly - but a programmer can dream!

## Case to Case Inheritance

Here's one that every Scala-writer has at some point. Case classes cannot inherit from case classes.

Say I have a perfectly good `Human` class: `case class Human(name: String)`. and I'd like to extend it:

```scala
case class Human(name: String)
case class EmployedHuman(name: String, job: String) extends Human(name)
```

Oops! this doesn't work. Scala has an error message about case-to-case inheritance being not legal with some workaround. I typically am able to make the base class non-case and abstract, with solves the limitation but fundementally models a different hierarchy (one that tends to be better than the original that I had planned, most of the time!).

```scala
abstract class Human(name: String)
case class EmployedHuman(name: String, job: String) extends Human(name)
```

But what about the suggestion that the Scala compiler gives us? It says: "to overcome this limitation use extractors to pattern match on non-leaf nodes." I'm not really sure what that means, and it seems most of the internet just makes some base class non-case, just as I had above. 

Again, this is probably cooked up by someone smarter than me who had a very good reason to prevent such a model. Likely, allowing case-to-case opens up a can of worms larger than just a minor inconvienence, but I haven't been able to think through the proof-by-contradiction to get to the same conclusion.

## Fin

Scala is fantastic. Most of the complaints here are incredibly minor: they have sensible work-arounds, and are small hiccups in what is an expressive programming model. 

Would I use Scala for a new project? Obviously it depends on the problem, but I do think it is my favorite of the JVM languages. I'm not a garbage collector hater, but it does come with tradeoffs that you must consider prior to making a decision like this.





