I'm overall happy with today's solution, but I'm writing this pre looking at the written solution, so we'll see how far this sentiment goes!

My first attempt was to keep two seperate lists, `evenNodes` and `oddNodes`. I attempted to whiteboard it out, but it grew and grew in complexity - we needed to keep an `evenHead`, count indexes and switch back and forth, etc.

Then I realized that if we follow this approach, we will always swap the control to the other (if odd, even, if even, odd). This means that instead, we can just keep a previous pointer, and attach the previous pointer to the next element and so forth.

That's what I ended up doing for my solution, and it took me all the way though a valid submission. The only issue was with the edge cases at the end.

here's the code without handling connecting the two lists at the end:

```typescript
//O(n) runtime, O(1) space
function oddEvenList(head: ListNode | null): ListNode | null {
    if (head === null) {
        return null
    }

    let curr = head.next
    let evenHead = curr
    let prev = head

    while (curr) {
        prev.next = curr.next
        prev = curr
        curr = curr.next
    }

    //some logic handling tails

    return head
};
```

There will be two completely seperate cases at the end here. We need a pointer to the *last odd node* in both cases, because we need to connect it to the first even node.

This means we'll need to know how many iterations - we could do with a boolean, but I did a counter. Either one works for this solution.

Luckly, the case of ending with an odd is easy: if we end with an odd, our current pointer gets iterated off the edge, and the previous pointer is now pointing to the last node in the list, or the odd node that we ended with. All we have to do is `prev.next = evenHead`, and it now works!

The case of ending with an even is a bit more tricky, though. Lets walk through an iteration here:

```dart
//inital
     c
p
1 -> 2

//next iteration
        c
     p
1 -> 2
```

Now, our solution won't work! if we do `prev.next = evenHead`, we end up connecting the last even node to the first even node - which doesn't do what we want.

The best solution I could come up with here is to just reiterate through the odd nodes. This is `O(n/2)` operation, since we only have the odd nodes. It stil falls within `O(n)` guidelines, but it is more work than I'd like.

Here's my finial solution, odd list iteration and all:

```typescript
//O(n) speed, O(1) space
function oddEvenList(head: ListNode | null): ListNode | null {
    if (head === null) {
        return null
    }

    let curr = head.next
    let evenHead = curr
    let prev = head
    let idx = 1

    while (curr) {
        idx++
        prev.next = curr.next
        prev = curr
        curr = curr.next
    }

    //if we're ending on an odd, we can take the simple route.
    if (idx % 2 === 1) {
        prev.next = evenHead
        return head
    }

    //otherwise, we need to find the second to last element - the last odd element. Then, set it's
    //next to the evenHead!
    curr = head
    while (curr.next) {
        curr = curr.next
    }

    curr.next = evenHead
    return head
};
```

That's the solution! Works, and apparently pretty fast compared to other TS users - but other TS users kind of suck at competitive programming, so I think that doesn't mean much.

----

There seems to be no better algorithm, so I went ahead and added an `oddTail` pointer. now we can get rid of a lot of code for a little bit of overhead complexity. here's the new solution, with comments:

```typescript
//O(1) space, O(n) runtime
function oddEvenList(head: ListNode | null): ListNode | null {
    if (head === null) {
        return null
    }

    //5 vars is a lot...
    let curr = head.next
    let evenHead = curr
    let oddTail = head
    let prev = head
    let idx = 1

    while (curr) {
        idx++

        //if we're on an odd node, then move oddTail up!
        if (idx % 2 === 1) {
            oddTail = curr
        }

        prev.next = curr.next
        prev = curr
        curr = curr.next
    }

    //now, in both cases, regardless of ending index, the oddTail now points to
    //the final odd number. Hence, we can just add the oddtail to evenHead!
    oddTail.next = evenHead
    return head
};
```