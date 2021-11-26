Happy thanksgiving!

Unfortunatly, leetcode shows you your previous submission, so I saw my previous solution today - obviously I deleted it as quick as possible but I still saw some telling variable names - I will make the effort to fully understand the solution but the problem solving part is wasted today. Shame, because I was excited for today's LC.

The intuition behind this solve is that if a subarray stretch ever dips below 0, we don't want to track it anymore: there's no reason to keep adding after a negative number, because at < 0, we have two disjoint local maximums before and after where the sum trended to below 0 - so, whenever the sum is below 0, just set it to zero and move on.

Also, have that tracking pointer also keep track of a max pointer.

Here's my first solution, (roughly knowing the algorithm before hand):

```typescript
//O(n) time, O(1) space
function maxSubArray(nums: number[]): number {
    let currentSubarray = 0
    let max = Number.NEGATIVE_INFINITY
    
    for (let num of nums) {
        currentSubarray += num

        if (currentSubarray < 0) {
            currentSubarray = 0
        }
        
        max = Math.max(
            max,
            currentSubarray
        )
    
    }
    
    return max
};
```

The issue here is that in a subarray like `[-1]`, we actually have to take the -1, and this will say 0, because we're considering the empty subarray as a subarray - something that the problem does not consider a valid subarray: the solution should be -1. Simple fix, though: set `currentSubarray` to 0 after setting the max. This way, the 0 will only be a counter reset, and not a "valid" maximum value.


```typescript
//O(n) time, O(1) space
function maxSubArray(nums: number[]): number {
    let currentSubarray = 0
    let max = Number.NEGATIVE_INFINITY
    
    for (let num of nums) {
        currentSubarray += num

        max = Math.max(
            max,
            currentSubarray
        )

        if (currentSubarray < 0) {
            currentSubarray = 0
        }
    }
    
    return max
};
```

What I learned: 
- Clear the answer after submitting!
- Seeing the algorithm helps, but knowing how to explain it helps better!
- Write ups are good; keep doing them.