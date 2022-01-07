I have two solutions I came up with in today's problem, that both show benefits.

The first one is a highly space - optimized solution, with just `O(1)` space. The tradeoff we make is `O(n)` runtime, though:

```typescript
class Solution {
    private length = 0
    private head: ListNode
    
    constructor(head: ListNode) {
        this.head = head
        
        while (head) {
            this.length++
            head = head.next
        }
    }

    getRandom(): number {
        let idx = Math.floor(Math.random() * this.length)
        
        let currNode = this.head
        while (idx > 0) {
            currNode = currNode.next
            idx--
        }
        
        return currNode.val
    }
}
```

we run through the whole linked list, getting it's length, and then every call to `getRandom` picks a random node index and returns it!

We can also store the whole linked list in a list, and then we have `O(1)` get random, but we now sacraficed space complexity, and have `O(n)` space:

```typescript
class Solution {
    private nodes: ListNode[] = []
    
    constructor(head: ListNode) {        
        while (head) {
            this.nodes.push(head)
            head = head.next
        }
    }

    getRandom(): number {
        let idx = Math.floor(Math.random() * this.nodes.length)
        return this.nodes[idx].val
    }
}
```

The reservoir sampling is interesting... I don't think it's best applied in this situation, i.e. I think it would be better applied if we're taking any `c` elements, but nontheless, it's interesting to learn.

As we iterate through the array, gradually decrease the probability that we pick that element. for instance, if there's one element, we start with a 100% chance of picking that element; in this case, we return that one element, as it does have a 100% chance of being picked. 

Now if we have two elements? Still allow the first element to have a 100% chance. But now iterate to element two - split the first chance in half, i.e. now we have a 50% chance of picking this element. If we pick it, we take element 2. If we don't pick it, we take element 1. 50/50!

This law continues for the remainder of the list, and each element has an equal chance of being picked.

```typescript
class Solution {
    private head: ListNode
    
    constructor(head: ListNode) {        
        this.head = head
    }

    getRandom(): number {
        let currIdx = 1
        let chosenNode = null
        let currNode = this.head
        
        while (currNode != null) {
            //this is the only interesting line - as currIdx grows, the possibility of 
            //picking the currNode goes down. i.e. currIdx = 1? there's a 100% chance that
            //a random number is less than 1, since it picks from [0 - 1). 
            //idx = 2? 50% chance we pick the node. This continues to infinity.
            if (Math.random() < 1 / currIdx) {
                chosenNode = currNode
            }
            currIdx++
            currNode = currNode.next
        }
        
        return chosenNode.val
    }
}
```

