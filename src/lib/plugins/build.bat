@asc -o example.wasm example.asc.ts --enable simd --importMemory && move /Y .\example.wasm ..\..\..\public/example.wasm
@asc -o fullFeatured.wasm fullFeatured.asc.ts --enable simd --importMemory && move /Y .\fullFeatured.wasm ..\..\..\public/fullFeatured.wasm
