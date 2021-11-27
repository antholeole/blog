Quick solve today - but not without error!

I had began baking an idea for division (I never fully fleshed it out, but it would have looked something like taking the cumulative product, and then iterating through and dividing `nums[i]` - this breaks down with 0, though.) But then I realized something: the product of each element is the product of all elements to the left and the product of all elements to the right.

All that I had to do was create an auxillary array, that iterates from right to left, and then stores the product. Then, do the same exact thing backwards, but this time, multiplying the accumulator with the next value. This means that we have the product of all elements to the left (accumulator) times all elements to the right (`rtl[i + 1]`)!

Here was my finished inital solution:

```typescript
//O(n) runtime, O(n) space
function productExceptSelf(nums: number[]): number[] {
    const rtlProd = []
    let mult = 1
    
    for (let i = nums.length - 1; i >= 0; i--) {
        mult *= nums[i]
        rtlProd.unshift(mult)
    }
    
    const ret = []
    mult = 1
    
    for (let i = 0; i < nums.length; i++) {
        ret.push(mult * (rtlProd[i + 1] ?? 1))
        mult *= nums[i]
    }
    
    return ret
};
```

In the first for loop, I had tried to do some difficult iteration (I tried to initalize the `rtlProd` array to the last element, then unshift each element, but instead of using a `mult` accumulator, I just tried to refrence the previous element. It got difficult when I took into account that the indexing was off as there wasn't `nums.length` elements in the `rtlProd` array!) - but it was a little too much, and I took a step back and reconsidered. I realized I was planning on using an accumulator for the forward iteration - it would *just make sense* to use it for the backward iteration.

The other thing that I fubmled on was inversing the order of multiplying and adding - I was multiplying then adding first in both iterations, which is obviously not correct on the way forward - if you do it that way, you multiply in the current product, which is exactly what we are trying not to do.

The next inutuiton came when I went to the comments and saw someone did it with O(1) space - I had thought I was optimal, but it seems that I was wasting space... somewhere. 

The next optimization came to me when I realized that when I iterated past the `i`th element the second time around, I then never looked at the `i`th element again - thus, I could reuse the `rtlProd` array to store the answer, hence O(1) space. here's what that looked like (very minor change):

```typescript
function productExceptSelf(nums: number[]): number[] {
    let rtlProd = []
    let mult = 1
    
    for (let i = nums.length - 1; i >= 0; i--) {
        mult *= nums[i]
        rtlProd.unshift(mult)
    }
    
    mult = 1
    for (let i = 0; i < nums.length; i++) {
        rtlProd[i] = mult * (rtlProd[i + 1] ?? 1)
        mult *= nums[i]
    }
    
    return rtlProd
};
```

I really liked today's LC. easy-ish solve, and I overcomplicated it for myself at some points. 

Takeways:
- Again, the solution is always elegant. If it starts to look ugly (i.e. the weird backwards iteration indexing), then take a step back and make it elegant.
- Break down the solution before coding, to the point of even pseudocode! It helps a bunch. My fatal flaw is my inability to STOP and THINK. I want to put more effort into doing that, and I need to force myself to stop and think before I start coding. Working fast is often a detriment - spend 20% time upfront to save 80% time down the line.
