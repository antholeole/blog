cmake_minimum_required(VERSION 3.5)
project("fastsqrt")

# if running fastsqrt.hpp's main
add_executable(fastsqrt "./src/fastsqrt.hpp")
target_compile_definitions(fastsqrt PUBLIC -DFASTSQRT_MAIN)
set_target_properties(fastsqrt PROPERTIES LINKER_LANGUAGE CXX)

# the benchmark
add_executable(fastsqrt_bench "./src/fastsqrt.hpp" "./src/benches.cc")
set_target_properties(fastsqrt_bench PROPERTIES CXX_STANDARD 20)

set(BENCHMARK_ENABLE_TESTING OFF CACHE BOOL "Suppressing benchmark's tests" FORCE)

target_include_directories(fastsqrt_bench PRIVATE src/)
set_target_properties(fastsqrt_bench PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(fastsqrt_bench PRIVATE benchmark m)
