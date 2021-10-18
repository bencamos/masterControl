#include <stdio.h>
#include <openssl/ssl.h>
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>
#include <openssl/err.h>

void log_ssl_err(const char *mes){
    unsigned long err, found;
    char errstr[1000];

    found = 0;
    while ((err = ERR_get_error())) {
        ERR_error_string(err, errstr);
        printf("%s: %s", mes, errstr);
        found = 1;
    }
    if (!found) {
        printf("%s", mes);
    }
}