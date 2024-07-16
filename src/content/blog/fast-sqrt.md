## INTRO

We've all heard of the fast inverse square root; a wonderful approximation. 

## DISCLAIMERS

- as always: with performance, there are too many considerations. cpu architecture? what other work is the box doing?
- hard to maintain
- performance doesn't matter
- trading cpu for runtime speed
- approximiation too high

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

we have: 
- hyperthreading, two threads per core
- 32K in the L1 cache
- access to a SIMD instruction set, under `sse4_2`
- a bunch of other flags that do not mean much to me

## Goals / what makes this interesting: 
- maximum precision

## Design

- burn as much CPU as we can to calc as fast as we can
- I don't actually think we can save much time by using multiple CPUs, can we?
- lookup table of some nice examples. (talk about how theoretically, we can calc it all at constexpr but thats no fun)
- "increasing the number of bits devoted to the mantissa will improve the accuracy of a floating point number."

## path along:
- first, bench std::sqrt
- then bench first pass approach
- then bench simd
- then bench more cores with guessing

## Benchmark against...
- std sqrt (caveat bounded precision)
- one core?
- p

## Algorithm

Given our constraints

Lets first design a algorithm that 

