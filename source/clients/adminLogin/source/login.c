#include "./functions/strrep.h"
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>
#include <openssl/ssl.h>
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>
#include <openssl/err.h>
#include <stdbool.h>
#include <arpa/inet.h>

#define _GNU_SOURCE
#define PADDING RSA_PKCS1_OAEP_PADDING
#define MAXBUF 999999
#define BACKLOG 1

typedef struct args{
    int src;
    int dest;
} args;

// Declarations to prevent compiler warnings.
int CreateClientSocket(char *address, char *port, int *type, int *family);
void Client(char *address, char *port, int *type, int *family);
void log_ssl_err(const char *mes);
void *Thread(void *arg);
void Help(char *name);
void loadUi(int id);
char *b_encode();
char *b_decode();

int main(int argc, char **argv){
    loadUi(0);
    int protocol = SOCK_STREAM, family = AF_UNSPEC;
    opterr = 0;
    Client("0.0.0.0", "1905", &protocol, &family);
    return 0;
}

int CreateClientSocket(char *address, char *port, int *type, int *family){
    int sockfd, gai_error;
    struct addrinfo hints, *servinfo, *p;
    memset(&hints, 0, sizeof(hints));
    hints.ai_family = *family;
    hints.ai_socktype = *type;
    if ((gai_error = getaddrinfo(address, port, &hints, &servinfo)) != 0)  {
        exit(0);
    }
    for (p = servinfo; p != NULL; p = p->ai_next){
        sockfd = socket(p->ai_family, p->ai_socktype, p->ai_protocol);
        if (sockfd == -1){
            continue;
        }
        if (connect(sockfd, p->ai_addr, p->ai_addrlen) == -1){
            close(sockfd);
            continue;
        }
        break;
    }
    if (p == NULL){
        exit(0);
    }
    freeaddrinfo(servinfo);
    return sockfd;
}

void socketRead(int sockfd, RSA* rsa) {
  while (1) {
    //fork();
    char buffer[MAXBUF];
    int n;
    while ((n = read(sockfd, buffer, MAXBUF)) > 0){
        // Checks if the proccess is a child and only proccessing if such allowing the parent to read uninterrupted.
        if (fork() == 0) {
          char decrypted[MAXBUF];
          char *decoded = b_decode(buffer);
          RSA_private_decrypt(RSA_size(rsa), (unsigned char*) decoded, (unsigned char*) decrypted, rsa, PADDING);
          printf("%s", decrypted);
          free(decoded);
          exit(1);
        }
    }
    exit(1);
  }
}

void inputRead(int sockfd) {
  //if (fork() == 0) {
    char pubKey[MAXBUF];
    read(sockfd, pubKey, MAXBUF);// Reading the public key sent from the server
    RSA *rsa2 = NULL;
    BIO *key_bio2 = BIO_new_mem_buf(pubKey, -1);
    PEM_read_bio_RSAPublicKey(key_bio2, &rsa2, 0, NULL);
    printf("%s\n", pubKey);
    while (1){
        char encrypted[MAXBUF];
        char buffer[MAXBUF];

        scanf("%s", buffer);
        printf("Input: %s\n", buffer);
        RSA_print_fp(stdout, rsa2, 0);
        if (!RSA_public_encrypt(strlen(buffer), (unsigned char *) buffer, (unsigned char *) encrypted, rsa2, RSA_PKCS1_OAEP_PADDING)) {
          log_ssl_err("EncryptInit for cipher failed");
        }
        char* data = b_encode(encrypted, strlen((char*) encrypted));
        write(sockfd, data, strlen(data));
        free(data);
    }
    exit(1);
  //}
}

RSA *encryptionInit(int sockfd) {
  RSA* rsa = RSA_new();
  BIGNUM* bne = BN_new();
  char temp[MAXBUF];
  EVP_PKEY* pkey;
  BIO* pem1;

  pem1 = BIO_new_fp(stdout, BIO_NOCLOSE);
  char *string = (char*)malloc(600*sizeof(char));
  BN_set_word(bne,RSA_F4);
  RSA_generate_key_ex(rsa, 4096, bne, NULL);
  pkey = EVP_PKEY_new();
  EVP_PKEY_set1_RSA(pkey,rsa);

  setbuf(stdout, string);
  PEM_write_bio_PUBKEY(pem1,pkey);
  setbuf(stdout, NULL);
  write(sockfd, string, strlen(string));
  setbuf(stdout, temp);
  PEM_write_bio_PrivateKey(pem1, pkey, NULL, NULL, 0, 0, NULL);
  setbuf(stdout, NULL);
  free(string);

  return rsa;
}

void Client(char *address, char *port, int *type, int *family){
    loadUi(1);
    int sockfd = CreateClientSocket(address, port, type, family);
    loadUi(2);
    RSA* rsa = encryptionInit(sockfd);
    inputRead(sockfd);
    loadUi(3);
    socketRead(sockfd, rsa);
    close(sockfd); //Closing the socket connection.
}