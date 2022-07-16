problem link: [https://competitive programming.com/problems/iterator-for-combination/]

I think it's important here to remember to do the sub-optimal solution first; I was going for an optimal heap based dynamic creation, but this isn't the solution that competitive programming wants us to take. Instead, we should pre-generate the entire list and then return the index of the list that we're at right then.

It feels not correct, but it's correct!

Key take aways:
- do the sub-optimal solution first; you can iterate off of it much better than if you were starting from scratch and trying to build the most optimal solution from here.