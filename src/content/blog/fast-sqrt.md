---
title: "A Squareroot Approximation Faster (?) Than Intrensics"
description: A squareroot forensic
pubDate: August 16, 2024
---

When thinking about a standard operations, such as `sqrt` and `invsqrt`, it might be tempting to reach out to compiler intrensics: after all, most every intrensic is a single instruction. But there are some considerations that should be made; that is, not every intrensic is faster than every software approximation - especially if you don't require a precise answer. Remember: benchmark _everything_!

This is not advice (do not go ripping out your std::sqrt's for homemade sqrt_approximations) and is meant for educational purposes. 

## Tools

My current computer hardware is the following. 

```bash
$ lscpu
Model name:             11th Gen Intel(R) Core(TM) i7-1185G7 @ 3.00GHz
Thread(s) per core:    2       
Caches (sum of all):
  L1d:                    192 KiB (4 instances)
  L1i:                    128 KiB (4 instances)
  L2:                     5 MiB (4 instances)
  L3:                     12 MiB (1 instance)
flags		: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm constant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhanced tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a avx512f avx512dq rdseed adx smap avx512ifma clflushopt clwb intel_pt avx512cd sha_ni avx512bw avx512vl xsaveopt xsavec xgetbv1 xsaves split_lock_detect dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req vnmi avx512vbmi umip pku ospke avx512_vbmi2 gfni vaes vpclmulqdq avx512_vnni avx512_bitalg tme avx512_vpopcntdq rdpid movdiri movdir64b fsrm avx512_vp2intersect md_clear ibt flush_l1d arch_capabilities
cache_alignment : 64
```

This is an intel tigerlake with sse4 and avx instruction sets. I'm using latest stable clang at the time of writing this, 18.1.8 and g++ 13.3.0. I've told clang to use intel style assembly so there is no ambiguity. If you're a nix user, you can simulate my benchmarking environment using [this github repo](TODO LINK) on a branch called `template`, although the code in this article is not on that branch; much of this code was not committed anywhere besides this post (sorry! experimental code often goes this way for me. Write something, discard. Write something, discard. Code is cheap - but for the purpose of this post, I should have cleaned up my commits. You live and you learn!).

## Lets talk about sqrt

Lets write a very simple c++ program:

```cpp
int main() {
    const double v = sqrt(56.0);
    std::cout << v << std::endl;
}
```

take the sqrt of 56, print out the value. Unfortunately, it's not that simple; this is not quite ready for benchmarking. A program like this is easily optimizable by the compiler; even at `-O1`, the compiler inlines the result of the squareroot:

```asm
.LC0:
	.long	292044617
	.long	1075703530
```
Converting these to their corresponding 32 bit integers, concatinating, and then interpreting as an IE 754 mantissa and exponent shows us that these numbers, are in fact... Exactly equal to 7.48331477354788265898832833045162260532379150390625, or the square root of 56! Cheeky compiler hard-coded the answer, and printed it to standard out. We're going to have to trick the compiler into telling the program actually doing math for us.

To get the compiler to reveal how it prefers to do square roots, we need the compiler to not know the value ahead of time. There are many ways to do this, but to avoid blowing up my assembly size, I'm going to mark `v` as volitaile. This is usually a very bad idea, since every access of the variable has to come from memory, but it should suffice in this case; I only want to see what instruction this compiler prefers to use for squarerooting.

Here's program two:

```cpp
volatile const double v = 56.0;
int main() {
    std::cout << sqrt(v) << std::endl;
}
```

Lets take another look at the assembly.

```asm
  # ...prelude, + load the volatile value into xmm0.
	sqrtsd	xmm0, xmm0
  # some printing
```

There we go! My computer reaches out to a special sqrt instruction (This is by no means predicatable - a different version may chose to make the function call directly). That's going to be hard to beat! On [a uops lookup table](https://uops.info/table.html), we can see that the end to end latency is 13-19μops (ofcourse, throughput is much lower, but since we're only fireing a single instruction, it doesn't actually matter) for an `xmm` to `xmm` instruction, like we have here. 

One thing that is a little bit more in our favor is that, since our program is quite simple, we also care about instruction latency: That is, if all we're doing is computing a single square root, we don't actually care about being pipelineable. We just want to pass in our square root and output it to stdout. 

Can we software-emulate squareroot in a way that beats the intrensics (the answer, to those who don't want to wait: yes, if we slash precision)? Lets find out!

## A Not-So-Good Attempt

Lets talk about one approach. I'm going to repeat the comment that these methods to calculate square roots are not mine; I do not study maths, and I'd like to believe that square-rooting is popular enough that it's well understood by now. 

The first implementation we're going to look at is `square root by abacus`, a [digit by digit square rooting approach](https://web.archive.org/web/20120306040058/http://medialab.freaknet.org/martin/src/sqrt/sqrt.c). It claims 9x faster than `std::sqrt`, which may have been true on hardware in 1985, when this code is dated for. You'll often see programmers who have been around for a while call sqrt or division slow; while still true in comparison to simple adds or shifts, these instructions are often hardware supported and sufficently fast for non-total optimization usecases.

This is a perfect example of a squareroot algorithm that lacks hardware empathy: Branching and looping can be hard to optimize: you cannot re-order instructions across branch boundries, and branch misses are their own beast. Further, it drops drops precision of the square root to _a 32 bit integer_. This is to show that just because you choose to slash your desired precision, you don't always end with a faster result. To repeat my advice at the top: _benchmark!_

I won't go too into detail about the implementation; if you're interested, it just exploits the fact that [this](https://www.youtube.com/watch?v=x4D5bPqONAE) method is easier in binary.

```cpp
// I'll talk about this later, but inlining gives significant speedups in my benchmarks.
inline 
int32_t isqrt(int32_t n) {
    int32_t x = n;
    int32_t c = 0;
    int32_t d = 1 << 30;

    while (d > n) {
        d >>= 2;
    }

    while (d != 0) {
        if (x >= c + d) {      
            x -= c + d;        
            c = (c >> 1) + d;  
        }
        else {
            c >>= 1;           
        }
        d >>= 2;               
    }
    return c;                  
}
```

It's worth noting that the runtime of this algorithm increases with the size of the input integer, since the inital `while` loop attempts to truncate the buffer zone to only be as large as the input. 

Here's the benchmark line: 

```
Benchmark              Time             CPU   Iterations
--------------------------------------------------------
BM_isqrt            4.48 ns         4.46 ns    157072754
```

Here's the [googlebench](https://github.com/google/benchmark), if you want to (and you should!) check my work. Note I've intentionally made the `std::sqrt` take a float. For some reason, the call to a float does not inline a `fsqrt` instruction, but rather actually calls the `std::sqrt` function. This does _not_ happen with doubles, which calls `sqrtsd`. We'll fix this later; even with the function call overhead, `std::sqrt` blows our home-rolled sqrt out of the water in every metric: speed, maintainability, precision...

```cpp
static void BM_isqrt(benchmark::State &state)
{
  for (auto _ : state) {
    auto sqrtThis = 45.3f;
    benchmark::DoNotOptimize(sqrtThis);

    float sqrtApprox = isqrt(sqrtThis);
    benchmark::DoNotOptimize(sqrtApprox);
    benchmark::ClobberMemory();
  }
}
BENCHMARK(BM_isqrt);
BENCHMARK_MAIN();
```

Lets compare that against `std::sqrt`:

```
Benchmark              Time             CPU   Iterations
--------------------------------------------------------
BM_isqrt            4.48 ns         4.46 ns    157072754
BM_stdsqrt         0.733 ns        0.732 ns    947330457
```

Without even going into too much optimization, we can already tell that it is going to be hard to pull enough performance tricks out of a hat to get a 6x speedup, so I'm not even going to try to bust out the dissassembler here. Counting the theoretical speed is also not worth the effort here, because the core loop quite complex. 

There's an additional callout on the wikipedia article that we can pre-compute a lookup table, perhaps with some nice `constexpr`s, and get a decent starting guess. This would probably be bad idea for a single, imprecise sqrt: having to pull a lookup table into the cache from cold memory, say, L2 cache, can take tens of cycles, which is roughly the entire time it takes to calculate the square root using SSSD. Again, you'd have to benchmark to really tell if this is a bad idea or not, but from a theoretical angle, the odds of improving far enough are unlikely.

It's worth noting that division is awfully for the CPU as well but this algorithm only divides by powers of two, which is equal to a bit shift: which is much easier than dividing. Futher, some CPU's have special paths that make shifting by one much easier; per the same uops table, `SAR` on a 32 bit register with an 8 bit immediate takes 6-11uops, and can be executed on a variety of ports. 

Further, there is almost nothing that is pipelineable here: perhaps the instructions in the `x >= c + d` arm, but everything else has a data dependency. The pipeliner is definately smarter than me, though, and may be able to come up with some fancy pipelining that I wasn't able to. 

## A Working, Bit Twiddly, Algorithm

Finally, I get to a working algorithm. This one is beautiful, and off the same [wikipedia page](https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Approximations_that_depend_on_the_floating_point_representation). It exploits the layout of the manissa and exponent to only do simple math and get a decent approximation:


```cpp
float sqrt_approx(float z)
{
    union
    {
        float f;
        uint32_t i;
    } val = {z};

    val.i -= 1 << 23; /* Subtract 2^m. */
    val.i >>= 1;      /* Divide by 2. */
    val.i += 1 << 29; /* Add ((b + 1) / 2) * 2^m. */
    return val.f;     /* Interpret again as float */
}
```

Does this function work? Lets write a quick test that iterates through the first 1 << 24 integers and get the max delta from reality, where reality is defined as:

```cpp
float variance = abs((sqrt_approx(i) / std::sqrt(i)) - 1);
highestVariance = std::max(variance, highestVariance);
```

My program said the highest variance is 0.0606602 at 8388608 and some other values. I'd consider the reasonable error, especially since most estimates are around 1% off - good enough for a video game. You may bounce into a wall 6% faster than you should sometimes, but thats a price a speedup may be worth.


In the same benchmark as earlier:

```
--------------------------------------------------------
Benchmark              Time             CPU   Iterations
--------------------------------------------------------
BM_sqrtapprox      0.823 ns        0.823 ns    934230631
BM_stdsqrt         0.726 ns        0.726 ns    946598997
```

Ah! This may be able to give the stdsqrt a run for its money! 

What else can we do, that gives us a performance boost? Firstly, lets take a look at the assembly and see exactly whats going on down there.

```asm
	movss	12(%rsp), %xmm0
	call	_Z11sqrt_approxf@PLT
	movd	%xmm0, %eax
```

A function call! There's a bunch of overhead that goes into a function call. Lets beat clang over the head until it has no choice but to inline my function:

```cpp
__attribute__((always_inline)) inline float sqrt_approx(float z)
{
    union
    {
        float f;
        uint32_t i;
    } val = {z};

    val.i -= 1 << 23; /* Subtract 2^m. */
    val.i >>= 1;      /* Divide by 2. */
    val.i += 1 << 29; /* Add ((b + 1) / 2) * 2^m. */
    return val.f;     /* Interpret again as float */
}
```

nets us: 

```
--------------------------------------------------------
Benchmark              Time             CPU   Iterations
--------------------------------------------------------
BM_sqrtapprox      0.336 ns        0.336 ns   1927326498
BM_stdsqrt         0.706 ns        0.706 ns    986339939
```

and that there was! The approximation is almost twice as fast as the std::sqrt... But lets not pat ourselves on the back just yet. We now have given unfair treatment to our squareroot approximation. We should attempt an inline of the std::sqrt call.

Also, we're approximating a float. We should make sure that we use the fastest float calculation on our machine. Enter compiler intrensics! Here's what the benchmark looks like:

```cpp
static void BM_intrensqrt(benchmark::State &state)
{
  for (auto _ : state) {
    __m128 sqrtThis = _mm_set_ss(45.3);
    benchmark::DoNotOptimize(sqrtThis);

    __m128 sqrtApprox = _mm_sqrt_ss(sqrtThis);
    benchmark::DoNotOptimize(sqrtApprox);
    benchmark::ClobberMemory();
  }
}
BENCHMARK(BM_intrensqrt);
```

Double checking the assembly to see that it is an inline-single instruction (minus, of course, loading the value):

```asm
	sqrtss	xmm0, xmm0
```

Drum roll for the results...

```
--------------------------------------------------------
Benchmark              Time             CPU   Iterations
--------------------------------------------------------
BM_sqrtapprox      0.337 ns        0.337 ns   2087950812
BM_stdsqrt         0.729 ns        0.729 ns    943024431
BM_intrensqrt      0.679 ns        0.679 ns   1013773635
```

We've beaten std::sqrt by greater than a factor of two and the compiler intrensic by a little less than two.

Its likely that the intrensic computation is technically faster, but our homerolled implementation has some optimizations that can be done that cause our CPU to be waiting less. 

__but can we go faster?__


Just out of curiosity, lets turn down the opmization level to see what happens. Note that this isn't force inlined.

```asm
_Z11sqrt_approxf:
.LFB4336:
	.cfi_startproc
	push	rbp
	.cfi_def_cfa_offset 16
	.cfi_offset 6, -16
	mov	rbp, rsp
	.cfi_def_cfa_register 6
	movss	DWORD PTR [rbp-4], xmm0
	sub	eax, 8388608
	mov	DWORD PTR [rbp-4], eax
	mov	eax, DWORD PTR [rbp-4]
	shr	eax
	mov	DWORD PTR [rbp-4], eax
	mov	eax, DWORD PTR [rbp-4]
	add	eax, 536870912
	mov	DWORD PTR [rbp-4], eax
	movss	xmm0, DWORD PTR [rbp-4]
	pop	rbp
	.cfi_def_cfa 7, 8
	ret
	.cfi_endproc
```

It seems like somewhere between optimization level 1 and 3, the compiler realizes that the casts are absolutely not required, and that we can do all of this in a regular, 32 bit register, without touching SSD registers.

Just for fun, lets calculate the theoretical uops of this. Its often hard to tell what the compiler was trying to do in some places - at least for me - so in some sections, explainations of what exactly is going on is omitted.

```asm
.L24:
  # move into a 32 put register the value labeled at LC4.
  # roughly free!
  # https://uops.info/html-instr/MOV_EAX_Moffs32.html
	mov	eax, DWORD PTR .LC4[rip]
  # sub into eax a 32 bit immediate: 1 uop, variety of ports. 
  # https://uops.info/html-instr/SUB_EAX_I32.html
	sub	eax, 8388608
  # shift by 1; I beleive this is 7 uops.  
  # https://uops.info/html-instr/SHR_M32_1.html
	shr	eax
  # Add into 32 bit register; 8 uops. I'm going to stop linking,
  # I think the methodology is clear.
	add	eax, 536870912
  # cheap
	jg	.L25
	lea	rcx, .LC0[rip]

  # again, roughly free!
	mov	edx, 1065
```

Take the above with a grain of salt! I've not ran a microbench mark. There's a ton of weeds to untangle, and I am not qualified to do so. But by my rough, and probably wildly off calculations, it take rougly 16 uops, which is faster than the intrensic - there's some other things going on that are affecting our performance. What are they? Again, I'm not smart or qualified enough to answer that question. Perhaps having to truncate the 128 bit xmm value into a single 32 bit float is costly.

## Fin 

And thats it! I'll say it a final time: If you're going to use this, make sure to benchmark it. I would never include this code in my real codebases unless I had a good reason to do so, and a good benchmark is one such reason, but not the entirety of one. 

Its very, very difficult to know the exact reasons why something is performing the way it does. There are an incredibly large amount of variables at play here; I may have misinterpreted something horribly, and it may be the only valuable part of this post is the benchmark itself.

