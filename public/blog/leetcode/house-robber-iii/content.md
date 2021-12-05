I find that house robber problems are actually the best problems to practice DP. 

Today's house robber is essentially House Robber i, but the datastructure is now trees instead of the classic list. I think the best (only?) way to solve tree problems where you necessarily *have* to touch every node is recursion.

The first intuition here for me way that you had two options: Either you rob both the left and the right subtree, or you rob the current node and the left and right's children. If you're following the math, for every recursive step we have to do 6 (six!!!) recursions! 

This is the full "non-memoized" solution I came up with:

```typescript
//quadratic time, quadratic space (for the call stack)
function rob(root: TreeNode | null): number {
    if (!root) {
        return 0
    }
    
    return Math.max(
        rob(root.left) + rob(root.right),
        root.val + rob(root.left?.left) + rob(root.left?.right) + rob(root.right?.left) + rob(root.right?.right)
    )
};
```

It's actually a little crazy, but this works perfectly. essentially, we're trying to take the maximum value from every subtree. 

The memoization was a little difficult, but with some quick thinking, I actually came up with a pretty good way to memoize:

- Once we reach a certain depth, we never need to go to the child nodes again - if we memoize correctly, there's no reason to go down the same tree twice. This means the values in the nodes are **replaceable**!
- when we call `rob(root.left)` and `rob(root.right)`, that's it: we've touched every single node below us. We no longer should be calling `rob`, because we'd be traversing the whole tree again - and if we mutate the values, another call to `rob` would become incorrect.

I decided to replace the node's value with the value of it's subtree: i.e. a tree like this:

```dart
     2
   /   \
 5      5 
```

would become this:

```dart
    10
   /  \
  0     0 
```

and the value would move higher and higher up the tree, until the root node contains the correct value. Then, we return the correct value!

here's how I implemented it:

```typescript
function rob(root: TreeNode | null): number {
    if (!root) {
        return 0
    }
    
    //touch every left and right subtree
    const leftRob = rob(root.left)
    const rightRob = rob(root.right)
    
    const res = Math.max(
        rightRob + leftRob, //either we take the values at the left and right subtree...
        root.val  //or take the current value and every "skip" subtree!
        + (root.right?.right?.val ?? 0)
        + (root.left?.right?.val ?? 0)
        + (root.left?.left?.val ?? 0)
        + (root.right?.left?.val ?? 0)
    )
    
    root.val = res //memoize the value here.
    
    return res
};
```

working problem! We only traverse the tree once, so `O(n)` space. we also only add two calls to the stack for every element, so that's `O(n*2) = O(n)` space.