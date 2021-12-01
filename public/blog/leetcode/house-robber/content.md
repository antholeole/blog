I think that the inital recursive case is really quite trivial here: You can test all the possibilities by, for each house, either robbing that house or skipping it:
- If we rob it, we add the house to our total and then recurse on the rest on the house array `nums.slice(2)`, i.e. all the houses after the current and the next one (The next one we cannot rob, since we robbed the current). 
- If we choose not to rob it, then don't add anything to our total, but recurse on the array `nums.slice(1)`, since we chose not to rob the current house.

Here's what that solution looks like:

```typescript
//O(n^2) runtime, O(n^2) stack space
function rob(nums: number[]): number {
    if (nums.length === 0) {
        return 0
    } else if (nums.length === 1) {
        return nums.pop()
    }
    
    return Math.max(
        rob(nums.slice(1)),
        rob(nums.slice(2)) + nums[0],
    )
};
```

essentially, the base case is no houses, or a single house. If there's a single house, there's no reason not to rob, so we rob! If there's no houses, then our total is 0.

This is begging for memoization though, so lets see what else can be done here.

We know that we *either* rob the next house, or skip it and take the house after that: There would be no reason to do otherwise (i.e. triple skip) because we'd be missing a house in the middle.

It's also worth noting that this recursive solution just boils down to solving it backwards: i.e. the problem continues to recurse until it's the last and second to last element; then, the recursion stack begins unwinding. Knowing this, we can just skip the recursion stack and iterate backwards, keeping track of the last best house to rob so far.

We know that in the case of the last house, i.e. it's the only house left, there's no reason not to rob it (holding moral judgements)!

Thus, we can create an `nums` length array of what we know so far: the last element is one that we rob. 

```typescript
    const dp = nums.map(() => 0)
    dp[nums.length - 1] = nums[nums.length - 1]
```

next, we want to iterate backwards. We already know the last element, so no need to iterate on it; hence, our iteration looks like:

```typescript
for (let i = nums.length - 2; i >= 0; i--) {
    ....
}
```

Now, it looks very similar to previous: we either take the current element (i) and skip the next (i + 1) one, or we skip this one. The only reason why we'd skip this one (i) is if taking it means we can't take the next (i + 1) one and the next (i + 1) one is larger than the current. That's handled in the `Math.max`!

The last thing is that on the first iteration, `[i + 2]` actually reaches past the end of the array, and thus, we'll need to handle that case using `??`, since there's no index out of bounds in JS - it just returns undefined.

```typescript
        dp[i] = Math.max(
            dp[i + 1],
            (dp[i + 2] ?? 0) + nums[i]
        )   
```

Putting it all together, we have:

```typescript
function rob(nums: number[]): number {
    const dp = nums.map(() => 0)
    dp[nums.length - 1] = nums[nums.length - 1]
    
    for (let i = nums.length - 2; i >= 0; i--) {
        dp[i] = Math.max(
            dp[i + 1],
            (dp[i + 2] ?? 0) + nums[i]
        )   
    }
    
    return dp[0]
};
```

Which is a valid and working solution! hoorah!