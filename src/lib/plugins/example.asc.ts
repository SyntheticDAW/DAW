// allocate size bytes and return pointer
export function alloc(size: usize): usize {
  return __alloc(size); // built-in heap allocator
}