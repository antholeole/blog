---
title: "Variable Decay in Unit Tests"
description: Nix modules
pubDate: May 04, 2024
---

[There's a famous tweet that speaks of a fabled Facebook, now Meta, engineer that deletes tests that fail in effort to ship faster.](https://x.com/GergelyOrosz/status/1550485348165230594) I was almost disgusted to read such a thing: a failing test means a feature that isn't working! You've broken some contract with the desired implementation, and you most atone for your sins! Nowhere in the tweet, though, is it implied that the engineer does not _read_ the tests prior to deleting them. A good test explains exactly what is being tested in the name:

```scala
def `should foo when bar`() {
    ...
}
```

So if that test is not a good way of 

