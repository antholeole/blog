First things first: this is a medium problem even if it's labeled easy. The solution isn't quite an easy one.

The first thing I noticed here is that as we go down the tree, we're building the binary value in most-significant bit order; this means that we can just shift right every time. For example, say we have a tree that looks like this:

```
    1
0       1
```

We have the sum of two binary numbers here: 10, and 11. In base 10, that's 2 + 3, so 5. 

Imagine we start our iteration with some accumulator starting at 0: binary for that is... 0! Start by shifting to the left one (doesn't matter here, but it will in the recursive case) to get 00, and then add our current value: we end up with the binary 01, which is just 1 in the practical sense.

Go down a level, now. Lets handle the left side first: apply the same algorithm. Shift our previous value the left one, and then add our current value: 01 shifted is 010, and adding 0 to that is just 0. If we have no children, then we know we're a leaf, and we should return the value we've been building, 01.

Now time to handle the right leaf. Same algorithm: shift right one (010), add our current value (011). We're a leaf, so return 011. 

And we're done! 011 + 010 is what we want. 

Here's the algorithm so far:

```typescript
//NOT COMPLETE!
function sumRootToLeaf(root: TreeNode | null, currVal = 0): number {  
    currVal = (currVal << 1) + root.val

    //we are a leaf
    if (!root.left && !root.right) {
        return currVal
    }
        
    return sumRootToLeaf(root.left, currVal) + sumRootToLeaf(root.right, currVal) 
};
```

the only other issue to worry about is the case where we're not a leaf, but we're null: i.e. something like:

```
       0
    1
1       x
```

`x` in this scenario is not a node, it's a null. But if we walk through the algorithm, we end up returning the current val, because we "think" it's a leaf and thus trigger the base case, since it has no children. 

How can we fix this? easy! null check time!

```typescript
//O(n) time, O(1) space
function sumRootToLeaf(root: TreeNode | null, currVal = 0): number {  
    //if we're here, this means that we didn't trigger the base case the previous iteration:
    //this means we aren't a leaf, and we don't count. Return 0
    if (!root) {
        return 0
    }
    
    //the algo we talked about above
    currVal = (currVal << 1) + root.val

    //this case means that we are a leaf (we already know we are a node, since we didn't trigger the
    //previous base case) and we have no children.
    if (!root.left && !root.right) {
        return currVal
    }

    //It's okay to call this, since we know that the result will just be 0 if only one child
    //exists. I.e. if I had a left child and no right child, it would just be
    //left + 0. 
    return sumRootToLeaf(root.left, currVal) + sumRootToLeaf(root.right, currVal) 
};
```

We need to make sure that we handle all base cases: the one where we are not a node, and the one where we are a leaf (but still are a node)!

Checklist:
- first submission speed: kind of decent, since I the shifting algo was intutive to me. so N/A today
- walk through: did that! I had to verify my shifting algorithm. Check!
- Don't like: Yes. I did this today. I hate binary problems, but here I am, bit shifting! Check!
- read the problem slower: Eh. I think the problem was intutive, but I can see a curve ball being thrown. X.