const hasIntersection = (a: [number, number], b: [number, number]): bool => {
    const [min, max] = (a[0] < b[0]  ? [a, b] : [b, a])

    return !(max[0] >= min[1])
}

function maxProfit(prices: number[]): number {
    const totalprofitTable: number[][] = Array.from({
        length: prices.length,
    }, () => Array.from({
        length: prices.length
    }), () => 0)
    
    
    const nightsHeldTable: ([number, number] | null)[][] = Array.from({
        length: prices.length,
    }, () => Array.from({
        length: prices.length
    }), () => [-1, -1])
    
    
    for (let i = 0; i < prices.length; i++) {
        for (let j = i; j >= 0; j--) {
            const thisHold = prices[j] - prices[i]
            
            const topIntersection = !hasIntersection(nightsHeldTable[i - 1][j] ?? [-1, -1], [i, j])
            const rightIntersection = !hasIntersection(nightsHeldTable[i][j + 1] ?? [-1, -1], [i, j])                                            
            //take top
            if (!topIntersection && !rightIntersection) {
                const sum = totalprofitTable[i - 1][j] + totalprofitTable[i][j + 1]

                 if (thisHold > sum) {
                     totalprofitTable[i][j] = thisHold
                 }
            }
            
            
            //take right
            //take top and right
            //take neither
        }
    }
    
    return 0
};