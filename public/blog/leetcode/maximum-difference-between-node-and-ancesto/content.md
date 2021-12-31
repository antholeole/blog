There are some things that are interesting to notice here: first, I spent a little bit of time reading the problem, and was confused if we wanted the parent node or the child node to be bigger. i.e. is it `parent - child` or `child - parent`? After closer inspection, I realized that this was a moot answer: since we're taking absolute value, it actually deosn't matter! 

Since we don't care about if the max or the min is higher, and only care about the max and the min, this means we're looking for both the max and the min. 

The next thing to notice here is that we only want to locally use the max and the min: if we store the global max and the global min, we're not solving for the child and ancestor, we're solving for the whole tree. This means that we need to locally scope our max and min. 

It's quite easy to create locally scoped and only looking down when we have a recursive function, so lets define one:

```typescript
function maxAncestorDiff(root: TreeNode | null): number {
    const dfs = (root: TreeNode | null, max: number, min: number): number => {
        ....
    }
    
    if (!root) {
        return 0
    }
    
    return dfs(root, root.val, root.val)
};
```

okay, so we already solved most of the problem with a well defined function!

the first thing to worry about in a recursive function is the base case. Here, our base case is handled by passing in `null` to the root node. If we get here, this means we just hit the end of a leaf. all we have to do is return `max - min`. When we get here, we've traversed this leafs whole ancestory, and thus can make an informed decision on the ancestor diff.

So, the base case becomes:

```typescript
    const dfs = (root: TreeNode | null, max: number, min: number): number => {
        if (root === null) {
            return max - min
        }
        
        ...
    }
```

Now that we have this handled, we need to figure out the recursive case. Updating the max and the min is easy: the only new value per iteration is our new root's value, so we just have to set a `currMax` and `CurrMin`:

```typescript
let currMax = Math.max(max, root.val)
let currMin = Math.min(min, root.val)
```

Finally, the recursion:

```typescript
        return Math.max(
            dfs(root.left, currMax, currMin),
            dfs(root.right, currMax, currMin)
        )
```

We made it easy for ourselves by fleshing out a good base case: we don't have to worry about the child not existing, and the base case will handle doing the math for us. All the recursion has to do is recurse!

Finally, putting it all together:

```typescript
function maxAncestorDiff(root: TreeNode | null): number {
    const dfs = (root: TreeNode | null, max: number, min: number): number => {
        if (root === null) {
            return max - min
        }
        
        let currMax = Math.max(max, root.val)
        let currMin = Math.min(min, root.val)
        
        return Math.max(
            dfs(root.left, currMax, currMin),
            dfs(root.right, currMax, currMin)
        )
    }
    
    if (!root) {
        return 0
    }
    
    return dfs(root, root.val, root.val)
}
```

Amazing! it works and is near optimal.

Just for fun, here's the iterative solution:

```typescript
function maxAncestorDiff(root: TreeNode | null): number {
    if (root === null) {
        return 0
    }
    
    
    const subtrees: [TreeNode | null, number, number][] = [[root, root.val, root.val]]
    
    let bestSolution = 0
    while (subtrees.length) {
        const [currentNode, max, min] = subtrees.pop()
        
        if (currentNode === null) {
            bestSolution = Math.max(max - min, bestSolution)
            continue
        }
        
        
        const newMax = Math.max(max, currentNode.val)
        const newMin = Math.min(min, currentNode.val)
        
        
        subtrees.push(
            [currentNode.left, newMax, newMin],
            [currentNode.right, newMax, newMin],
        )
    }
    
    return bestSolution
};
```

which is... a little faster? it looks very similar to recursive. Trees, in general, should be solved recursively.

and finally, here's my codegolf solution:

```typescript
function maxAncestorDiff(
    root: TreeNode | null,
    max = -Infinity,
    min = Infinity
): number {
    if (!root) return max - min
        
    const newMax = Math.max(max, root.val)
    const newMin = Math.min(min, root.val)
        
    return Math.max(
        maxAncestorDiff(root.left, newMax, newMin),
        maxAncestorDiff(root.right, newMax, newMin),
  )
}
```
