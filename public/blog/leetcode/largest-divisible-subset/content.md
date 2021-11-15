This one is taking me quite a while. I have a sneaking suspision it's DP, but I want to figure out the non-dp solution first and work up from here. I have something like this going:

```typescript
const memoMap: Map<string, number[]> = new Map()
const serialize = (nums: number[]) => nums.join(',')

function largestDivisibleSubset(nums: number[]): number[] {         
    if (nums.length <= 1) {
        return nums
    }
    
    const sorted = nums.sort((a, b) => a - b)

    return largestDivisibleSubsetRecursive(sorted)
};

function largestDivisibleSubsetRecursive(nums: number[]) {
    const serialized = serialize(nums)
    
    if (memoMap.has(serialized)) {
        return memoMap[serialized]
    }
    
    let withFirst = []
    
    for (let num of nums.slice(1)) {
        if (num % nums[0] === 0){
            withFirst.push(num)
        }
    }
    
    withFirst = [nums[0], ...largestDivisibleSubset(withFirst)]
    const withoutFirst = largestDivisibleSubset(nums.slice(1))
    
    if (withFirst.length > withoutFirst.length) {
        memoMap[serialized] = withFirst
        return withFirst
    } else {
        memoMap[serialized] = withoutFirst
        return withoutFirst
    }
}


```

Which I think works, but leetcode won't take it because it's nowhere near efficent enough! Shame. I know that I have an issue when I'm serializing strings though, so I know I was going the wrong way: I just wanted to come across a brute force solution.

Unfortunatly, after another hour of struggling, I couldn't come up with the DP solution. I used plenty of sources over the course of 3 hours, but I think I figured out the intuiton I was missing: (**Lemma 1**) if a number `a` is divisible by another number `b`, then a is also divisible by all divisors of `a`. Generally, when I spend so much time on a problem, it becomes clear that I'm missing some fundemental piece of knowledge required to solve the problem optimally.

knowing this, it's not too difficult to come up with a solution now:

it's already obvious that sorting will allow us to solve the problem better, because instead of needing a two way check (`nums[i] % nums[j] === 0 || nums[j] % nums[i] === 0`) we only need to solve one way (`nums[i] % nums[j] === 0`, given `i > j` and we sort ascending).

Lemma 1 also helps in that we can now solve the problem ascending, and if the bigger number is divisible by a smaller number, then it's also divisible by all the smaller numbers divisors. For instance take the following example:

`[4, 8, 16]`.

The solution array begins with `[[4], [8], [16]]` because it's trivial that every `n` is divisible by 1 and itself.

begin our iteration at 8 (we actually begin at 4, but because there's nothing less than it, there's nothing to check):

check `8 % 4 === 0`: this is true, so we can add 4 to 8's array. Now, our solution looks like `[[4], [8, 4], [16]]`. 

Next up is 16: first, we check if 16 is divisible by 4: `16 % 4 === 0` is true, so our solution array looks like this: `[[4], [8, 4], [16, 4]]`. Now, we iterate to the next value, 8: `16 % 8 === 0` is true, but here's the curveball:

we can't simply add 8 to our array: in this case we can, but it's not a solid foundation, because we aren't certain that all of the other elements in 16's solution array are divisible by 8 (in this case it's only 4 and it is, but this isn't always the case if a higher factor is a prime). Instead of just aappending 8, we take 8's solution array, dump it into our own and add ourselves, completely replacing what is prior: `solution[i] = [...solution[j], sorted[i]]`.

This is okay, because we know that what we're replacing is either findable in the future (i.e. it's the dump of some of it's factors), or small enough to not be part of the solution at this point. 

The issue that arises with this is the case where we're actually dumping a smaller array into the solution for 16: that wouldn't be helpful, because we just overrode a better solution. Hence, we need to add a check to make sure we're not overriding a bigger solution: `subproblems[i].length < subproblems[j].length + 1` in this case, if j's solution array + 1 (the one being `nums[i]`) is greater than the current solution array. The final breakdown looks like this:

```typescript
//O(n^2) space, O(n^2) runtime 
function largestDivisibleSubset(nums: number[]) {
  //sort the array
  const sorted = nums.sort((a, b) => a - b)
  
  //prepare the solution array with the base cases
  const solution = nums.map((v) => [v])
  
    //OPTIONAL: hold a refrence to the current max index, so that 
    //we don't have to iterate through solution array to find
    //the greatest length
    let currMaxIndex = 0

      //iterate through nums in ascending order, the intuition being that at successive i
      //we find the greatest factor array for sorted[i]
      for (let i = 0; i < sorted.length; i++) {

          //iterate through all the possible factors of sorted[i], knowing 
          //that j already has it's maximum factors set in place in solution[j]
          for (let j = 0; j < i; j++) {
              //if j is factor of i, AND replacing what we have in the solution array for i 
              //would leave us with more factors, then replace it
              if (sorted[i] % sorted[j] === 0 && 
                  solution[i].length < solution[j].length + 1) {
                    solution[i] = [...solution[j], sorted[i]]

                    //OPTIONAL: set currMaxIndex if we need to
                  if (solution[currMaxIndex].length < solution[i].length) {
                      currMaxIndex = i
                  }
                  
                } 
          }
      }
    
    return solution[currMaxIndex]
}
```