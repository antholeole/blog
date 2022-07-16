I didn't like the previous two competitive programmings - that's on me, I need to start learning my binary search trees! As of writing this post, I resolve to not skip BST questions or similar because that's not how I will learn.

But for today, I'm happy with my solve :)

There's a couple intuitons and one connection in today's problem that allowed me to solve pretty optimally my first go:

1. You can never remove an element from the queue, so it actually doesn't matter if the element is in the queue or not
2. because the elements are unique, they lend themselves to sets / maps very nicely!
3. And the connection: Temporality matters here, very similar to LRU Cache, with the linked list.

So, based off of these three points, I crafted my solution using a linked list.

Using the first intution, we'll maintain a set `nonUniques` that have all the elements that aren't considered unique anymore in it. This way, we can `O(1)` lookup if an element is non-unique. This allows us to start our add method in a way that knocks out a lot of complexity right away:

```typescript
        if (this.nonUniques.has(value)) {
            return null
        }
```

We literally don't have to do anything! very nice.

Now, it's important to note that we should maintain a dummy and tail node - the tail node is so that we can quickly (`O(1)`) add a new node if we get a new unique, and the dummy node is to bypass all the weirdness that a linked list gives us at the start.

so, our private members look like this:

```typescript
class FirstUnique {
    private nonUniques = new Set()
    private uniques: Map<number, BiListNode> = new Map()

    private dummy = new BiListNode()
    private tail = this.dummy
}
```

Where `BiListNode` is a quickly coded solution:

```typescript
class BiListNode {
    public val
    public prev: BiListNode
    public next: BiListNode

    constructor(value?: number) {
        this.val = value
    }
}
```

The first case we have to handle is in `uniques` has the value. This means that it's no longer a unique value, so we need to remove it from the list and add it to nonUniques. Removing it from the list is a little tricky, because we need to worry about if this is the tail element, but besides that, it's pretty straight forward:

```typescript
        if (this.uniques.has(value)) {
            this.nonUniques.add(value)

            const node = this.uniques.get(value)

            if (this.tail.val === value) {
                this.tail = node.prev
            } else {
                node.next.prev = node.prev
            }

            node.prev.next = node.next
        }
```

Finally, the case where it's is a unique element is very straight forward: just add it to the end of the linked list, and set the new tail to itself, fixing links as we move along:

```typescript
        } else {
            const newListNode = new BiListNode(value)
            newListNode.prev = this.tail
            this.tail.next = newListNode
            this.tail = newListNode
            this.uniques.set(value, newListNode)
        }
```

Awesome! We're almost done, besides some housekeeping:

```typescript
    constructor(nums: number[]) {
        for (let num of nums) {
            this.add(num)
        }
    }

    showFirstUnique(): number {
        return this.dummy.next?.val ?? -1
    }
```

meaning that the dummy's next element is the first one, so we can return it if it exists; if it doesn't, return -1.

The final solution, with runtimes / space complexity marked:

```typescript
class BiListNode {
    public val
    public prev: BiListNode
    public next: BiListNode

    constructor(value?: number) {
        this.val = value
    }
}

//N/A time, O(n) space
class FirstUnique {
    private nonUniques = new Set()
    private uniques: Map<number, BiListNode> = new Map()

    private dummy = new BiListNode()
    private tail = this.dummy

    //O(1) time, N/A space
    constructor(nums: number[]) {
        for (let num of nums) {
            this.add(num)
        }
    }

    //O(1) time, N/A space
    showFirstUnique(): number {
        return this.dummy.next?.val ?? -1
    }

    //O(1) time, N/A space
    add(value: number): void {
        if (this.nonUniques.has(value)) {
            return null
        }

        if (this.uniques.has(value)) {
            this.nonUniques.add(value)

            const node = this.uniques.get(value)

            if (this.tail.val === value) {
                this.tail = node.prev
            } else {
                node.next.prev = node.prev
            }

            node.prev.next = node.next
        } else {
            const newListNode = new BiListNode(value)
            newListNode.prev = this.tail
            this.tail.next = newListNode
            this.tail = newListNode
            this.uniques.set(value, newListNode)
        }
    }
}

```

Space is `O(n)` because a value is either in `nonUniques` set, or in the `uniques` map - although an input like `[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]` would only have one element in the set, the worst case like `[1, 2, 3, 4, 5, 6, 7, 8]` would have O(n).

NOTE: It's trivial to solve this if you're in real life: JS maps are ordered, and thus the linked list to preserve order is redundant, as order is already preserved. But most of the time, this is a implementation detail and can't be relied upon.