Leetcode easy today. This is clearly a DFS, with some sort of traversal. Initally, I didn't realize that the tilt of a tree was not just the difference of the nodes immediate children, but the difference of all the subtree, so I only implemented it with the difference of the immediate children:

```typescript
function findTilt(root: TreeNode | null): number {
    if (!root) {
        return 0
    }
    
    let leftTilt = findTilt(root.left)
    let rightTilt = findTilt(root.right)
    
    let selfTilt = Math.abs((root.left?.val ?? 0) - (root.right?.val ?? 0))
    
    return leftTilt + rightTilt + selfTilt
};
```

I wasn't sure why it wasn't submitting, so I ran through the problem manually using my solution - it still worked, and thus I realized I read the problem wrong! 

Luckily, all wasn't lost. We can take what we learned from [house robber III](https://ants.place/blog/leetcode/house-robber-iii) and apply this here: we can rewrite the value of the node with some other value, in this case, the sums of the children. This way, whenever a node does `findTilt(root.left)`, we now know the left node contains the value of the entire subtree:

```typescript
function findTilt(root: TreeNode | null): number {
    if (!root) {
        return 0
    }
    
    let leftTilt = findTilt(root.left)
    let rightTilt = findTilt(root.right)
    
    let selfTilt = Math.abs((root.left?.val ?? 0) - (root.right?.val ?? 0))
    
    root.val = (root.left?.val ?? 0) + (root.right?.val ?? 0) + root.val
    
    return leftTilt + rightTilt + selfTilt
};
```

unfortunately, I don't think this is good coding: `findTilt` has adverse side effects, to the point where I don't even think the function is aptly named.

Unfortunatly I don't like the given solution either - it also has side effects, but I do like it better than my solution. 

Here's what I took away today:
- if you have to compromise and do something you wouldn't do in real life, then you should say something to your interviewer. 
- a inner function works kind of like a "class member" would in Java. 
- an inner function is a good way to keep a "second" counter, as opposed to rewriting nodes.