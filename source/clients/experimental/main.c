#include <stdio.h>
#include <string.h>  // for strlen
#include <assert.h>
#include "zlib.h"

int decompress() {
    // original string len = 36
    char a[999999999] = "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";

    // placeholder for the compressed (deflated) version of "a"
    char b[999999999];

    // placeholder for the UNcompressed (inflated) version of "b"
    char c[999999999];


    printf("Uncompressed size is: %lu\n", strlen(a));
    printf("Uncompressed string is: %s\n", a);


    printf("\n----------\n\n");

    // STEP 1.
    // deflate a into b. (that is, compress a into b)

    // zlib struct
    z_stream defstream;
    defstream.zalloc = Z_NULL;
    defstream.zfree = Z_NULL;
    defstream.opaque = Z_NULL;
    // setup "a" as the input and "b" as the compressed output
    defstream.avail_in = (uInt)strlen(a)+1; // size of input, string + terminator
    defstream.next_in = (Bytef *)a; // input char array
    defstream.avail_out = (uInt)sizeof(b); // size of output
    defstream.next_out = (Bytef *)b; // output char array

    // the actual compression work.
    deflateInit(&defstream, Z_BEST_COMPRESSION);
    deflate(&defstream, Z_FINISH);
    deflateEnd(&defstream);

    // This is one way of getting the size of the output
    printf("Compressed size is: %lu\n", strlen(b));
    printf("Compressed string is: %s\n", b);


    printf("\n----------\n\n");


    // STEP 2.
    // inflate b into c
    // zlib struct
    z_stream infstream;
    infstream.zalloc = Z_NULL;
    infstream.zfree = Z_NULL;
    infstream.opaque = Z_NULL;
    // setup "b" as the input and "c" as the compressed output
    infstream.avail_in = (uInt)((char*)defstream.next_out - b); // size of input
    infstream.next_in = (Bytef *)b; // input char array
    infstream.avail_out = (uInt)sizeof(c); // size of output
    infstream.next_out = (Bytef *)c; // output char array

    // the actual DE-compression work.
    inflateInit(&infstream);
    inflate(&infstream, Z_NO_FLUSH);
    inflateEnd(&infstream);

    printf("Uncompressed size is: %lu\n", strlen(c));
    printf("Uncompressed string is: %s\n", c);


    // make sure uncompressed is exactly equal to original.
    assert(strcmp(a,c)==0);

    return 0;
}

int main() {
   char program[] = "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";
   printf("%s\n", program);
   decompress();
   char* data = b_decode(program);
   printf("Hello, world!\n");
   return 0;
}
