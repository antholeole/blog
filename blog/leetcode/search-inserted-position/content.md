I know binary search - I can bang it out in like 10 seconds now:

```typescript
let lo = 0
let hi = nums.length

while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2)

    if (nums[mid] < num) {
        lo = mid + 1
    } else if (nums[mid] > num) {
        hi = mid
    } else {
        return nums[mid]
    }
}
//not in list
```

It's that easy! Very simple stuff here, now that I've been doing it for a while.  But today's LC threw a wrench in my understanding, I must say. In the after section, when it's not in the list, where do the pointers *go*? What do they point to? The index immediately after or before the spot where the value should be?

Well, after drawing up some solutions, I figured it out: The lo pointer ends at either where the element should be *or* before where the element should be. 

You have to handle two cases here. Neither are very difficult, hence the problem being a leetcode easy, but there are cases that you have to work though.

```typescript
//log(n) runtime, O(1) space
function searchInsert(nums: number[], target: number): number {
    let lo = 0
    let hi = nums.length
    while (lo < hi) {
        const mid = lo + Math.floor((hi - lo) / 2)
        
        if (nums[mid] > target) {
            hi = mid
        } else if (nums[mid] < target) {
            lo = mid + 1
        } else {
            return mid
        }
    }
    
    if (nums[lo] < target) {
        return lo + 1
    } else {
        return lo
    }
};
```

Here are the cases handled! 

What I learned today:
- Dive deep into the algorithm: know the process, not just the code.
- lo = mid + 1, not lo = mid, which will cause problems.