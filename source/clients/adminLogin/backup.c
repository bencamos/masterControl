#include "./functions/strrep.h"
#include <netdb.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <openssl/rsa.h>
#include <openssl/err.h>
#include <stdbool.h>
#include <arpa/inet.h>
#define PADDING RSA_PKCS1_OAEP_PADDING
#define MAXBUF 65536
#define BACKLOG 1

typedef struct args{
    int src;
    int dest;
} args;

void *Thread(void *arg);
int CreateClientSocket(char *address, char *port, int *type, int *family);
void Client(char *address, char *port, int *type, int *family);
void Help(char *name);

int main(int argc, char **argv){
    //initAni();
    loadUi(0);
    int c, protocol = SOCK_STREAM, listen = 0, family = AF_UNSPEC;
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

char *socketRead(sockfd, rsa) {
  while (1) {
    fork();
    char buffer[MAXBUF];
    int n;
    while ((n = read(sockfd, buffer, MAXBUF)) > 0){
        // Checks if the proccess is a child and only proccessing if such allowing the parent to read uninterrupted.
        if (fork() == 0) {
          char decrypted[MAXBUF];
          char *decoded = b_decode(buffer);
          RSA_private_decrypt(RSA_size(rsa), decoded, decrypted, rsa, PADDING);
          printf("%s", decrypted);
          free(decoded);
          exit(1);
        }
    }
    exit(1);
  }
}

char *inputRead(sockfd, rsa2) {
  if (fork() == 0) {
    while (1){
        clock_t begin = clock();
        char *encrypted[MAXBUF]={0};
        char *buffer[MAXBUF]={0};

        scanf("%s", buffer);
        if (!RSA_public_encrypt(strlen(buffer), buffer, encrypted, rsa2, RSA_PKCS1_OAEP_PADDING)) {
          log_ssl_err("EncryptInit for cipher failed");
        }
        char* data = b_encode(encrypted, strlen(encrypted));
        write(sockfd, data, strlen(data));
        clock_t end = clock();
        double time_spent = (double)(end - begin) / CLOCKS_PER_SEC;
        printf("%f\n", time_spent);
        free(data);
    }
    exit(1);
  }
}

char *encryptionInit(sockfd) {
  RSA* rsa = RSA_new();
  BIGNUM* bne = BN_new();
  char temp[MAXBUF];
  EVP_PKEY* pkey;
  int rc, rc1;
  BIO* pem1;

  pem1 = BIO_new_fp(stdout, BIO_NOCLOSE);
  char *string = (char*)malloc(600*sizeof(char));
  char *decrypt = (char*)malloc(600*sizeof(char));
  rc = BN_set_word(bne,RSA_F4);
  rc = RSA_generate_key_ex(rsa, 4096, bne, NULL);
  pkey = EVP_PKEY_new();
  rc = EVP_PKEY_set1_RSA(pkey,rsa);

  setbuf(stdout, string);
  rc = PEM_write_bio_PUBKEY(pem1,pkey);
  setbuf(stdout, NULL);
  write(sockfd, string, strlen(string));
  setbuf(stdout, temp);
  rc1 = PEM_write_bio_PrivateKey(pem1, pkey, NULL, NULL, 0, 0, NULL);
  setbuf(stdout, NULL);
  free(string);

  return rsa;
}

void Client(char *address, char *port, int *type, int *family){
    loadUi(1);

    int sockfd = CreateClientSocket(address, port, type, family);
    char pubKey[MAXBUF];
    pthread_t printer;
    char *err;

    loadUi(2);
    read(sockfd, pubKey, MAXBUF);// Reading the public key sent from the server for encryption.
    int n;
    char buffer[MAXBUF];
    RSA *rsa2 = NULL;
    BIO *key_bio2;
    key_bio2 = BIO_new_mem_buf(pubKey, strlen(pubKey));
    rsa2 = PEM_read_bio_RSAPublicKey(key_bio2, &rsa2, 0, NULL);
    RSA* rsa = encryptionInit(sockfd);
    if (fork() == 0) {
      while (1){
          clock_t begin = clock();
          char *encrypted[MAXBUF]={0};
          char *buffer[MAXBUF]={0};

          scanf("%s", buffer);
          if (!RSA_public_encrypt(strlen(buffer), buffer, encrypted, rsa2, RSA_PKCS1_OAEP_PADDING)) {
            log_ssl_err("EncryptInit for cipher failed");
          }
          char* data = b_encode(encrypted, strlen(encrypted));
          write(sockfd, data, strlen(data));
          clock_t end = clock();
          double time_spent = (double)(end - begin) / CLOCKS_PER_SEC;
          printf("%f\n", time_spent);
          free(data);
      }
      //exit(1);
    }
    //inputRead(sockfd, rsa2);
    loadUi(3);
    socketRead(sockfd, rsa);
    pthread_cancel(printer);
    pthread_join(printer, NULL);
    close(sockfd); //Closing the socket connection.
}