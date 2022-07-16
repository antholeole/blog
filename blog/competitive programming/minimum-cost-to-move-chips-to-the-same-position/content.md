Feeling: Proud! The comments are talking about how this problem is a thinking man's problem. I was able to come up with the optimal solution within 10 minutes and without any external help.

After reading the problem throughly, it becomes very clear that the goal is to maximise the amount double moves, since it's literally free! we can move twice for free. 

The next intution reveals itself shortly after the first: we can move any coin on an odd tile to any odd tile for free, and the same for even coins on even tiles. So this means we don't even need to keep track of the majority parity, just the minority parity. 

The next step was to try to calculate how much it'd take to move any minority parity to a majority parity tile. Well, it costs exactly one to switch parity and then free to move to any tile of that parity, since it is now of that parity.

This means no "simulation" is needed after find the counts of the two parities: since we want to move the minimum amount, we want to move all of the one with minority parity to majority parity slots, and thus, it costs exactly the size of the minority parity.

I feel like I overcomplicated that by trying to fully explain it - but it really isn't that complex:

In short, it costs one to move to a different parity, and free to move along that parity. We want to move all of the elements on minority parities to the majority parity, and then it's free to move them all into the same slots. We don't care what slot it is or anything, because it's free!

thus, here's the solution:

```typescript
// O(n) runtime, O(1) space
function minCostToMoveChips(position: number[]): number {
    let even = 0
    let odd = 0
    
    for (let pos of position) {
        if (pos % 2 === 0) {
            even++
        } else {
            odd++
        }
    }
    
    return Math.min(
        odd,
        even
    )
};
```

a slight "optimization" allows us to code golf even easier if instead of even odd, we just initalized a 2 element array, and then indexed into that array based off of the result of `pos % 2 === 0` - but I wouldn't do this in a real code base because it sacks some readability for very little upside. 


