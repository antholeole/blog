Intuitions: 

1. We can't really scan the whole list for the "next" node; this would be around N^2 time, which is pretty slow.
2. That's the only intution! 

So, this means we need to get the last nodes "in order" so that we can piece together the other list by alternating and taking one from each list. 

Then, the intuition is not too hard: We have to:

1. find the midpoint node
2. reverse everything after the midpoint node
3. stitch the two lists together!

I remember the tortise and hare problem for finding the midpoint node, so I implemented that really quick:

```typescript
function getMidpointNode(head: ListNode): ListNode {
    let trailing = head
    let leading = head
    
    while (leading && leading.next) {
        leading = leading.next.next
        trailing = trailing.next
    }
    
    return trailing
}
```

All this does is say that: "for every iteration, move the leading forward twice and the trailing forward once." Thus, the trailing is always at N / 2 at the end of the iterations.

Then, we need to reverse a linked list! Also not too difficult in isolation... so I coded it in a function: for isolation!

```typescript
function reverseListAfter(head: ListNode): ListNode {
    let currNode = head
    let prevNode = null
    
    while (currNode) {
        const tempNext = currNode.next //only need this so we can move on to the next iteration
        currNode.next = prevNode //point our current node to the previous node (i.e. the reversing)

        //allow us to point the correct pointers: the current node becomes the previous,
        //and we use our stored value.
        prevNode = currNode
        currNode = tempNext
    }

    //return the new head; otherwise, there'd be no way to get
    //to it, as now nothing is pointing to it.
    return prevNode
}
```

finally, the only tricky part is to stitch the two lists together. My idea here was to focus on one list at a time, trying not to "destroy" (i.e. override) any important data, and this is the merge algorithm I came up with:

```typescript
function stitchLists(head1: ListNode, head2: ListNode): void {
    let list1Curr = head1
    let list2Curr = head2
    
    while (list2Curr.next) {
        //focus on each part 1 at a time:

        //store the list1Next 
        const list1Next = list1Curr.next

        //the current element of list1 now points to the current element of list 2
        list1Curr.next = list2Curr

        //iterate list 1
        list1Curr = list1Next
        

        //do the same exact thing for list 2!
        const list2Next = list2Curr.next
        list2Curr.next = list1Curr
        list2Curr = list2Next
    }
}
```

Oh wait... we solved the problem!

```typescript
function reorderList(head: ListNode | null): void {
    if (head === null) {
        return
    }
    
    const midpointNode = getMidpointNode(head)
    const newHead = reverseListAfter(midpointNode)
    stitchLists(head, newHead)
};
```

Amazing how nice and clean we can get it if we use functions. Here's the full code:

```typescript
// O(n) time, O(1) space
function reorderList(head: ListNode | null): void {
    if (head === null) {
        return
    }
    
    const midpointNode = getMidpointNode(head)
    const newHead = reverseListAfter(midpointNode)
    stitchLists(head, newHead)
};

function stitchLists(head1: ListNode, head2: ListNode): void {
    let list1Curr = head1
    let list2Curr = head2
    
    while (list2Curr.next) {
        const list1Next = list1Curr.next
        list1Curr.next = list2Curr
        list1Curr = list1Next
        
        const list2Next = list2Curr.next
        list2Curr.next = list1Curr
        list2Curr = list2Next
    }
}

function getMidpointNode(head: ListNode): ListNode {
    let trailing = head
    let leading = head
    
    while (leading && leading.next) {
        leading = leading.next.next
        trailing = trailing.next
    }
    
    return trailing
}

/// returns new head
function reverseListAfter(head: ListNode): ListNode {
    let currNode = head
    let prevNode = null
    
    while (currNode) {
        const tempNext = currNode.next
        currNode.next = prevNode
        prevNode = currNode
        currNode = tempNext
    }

    return prevNode
}

```
