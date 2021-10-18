#include <stdio.h>
#include <stdlib.h>

void loadUi(int id) {
  switch (id) {
    case 0: {
      system("clear");
      printf("\
╔════════════════════════════════════════════════════════════════╗\n\
║ Verbose: TRUE             Loading...                   RUNNING ║\n\
║ AutoAdm: TRUE                                                  ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
╚════════════════════════════════════════════════════════════════╝\n");
    }
    case 1: {
      system("clear");
      printf("\
╔════════════════════════════════════════════════════════════════╗\n\
║ Verbose: TRUE             Loading...                   SUCCESS ║\n\
║ AutoAdm: TRUE            Connecting...                 RUNNING ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
╚════════════════════════════════════════════════════════════════╝\n");
      break;
    }
    case 2: {
      system("clear");
      printf("\
╔════════════════════════════════════════════════════════════════╗\n\
║ Verbose: TRUE             Loading...                   SUCCESS ║\n\
║ AutoAdm: TRUE            Connecting...                 SUCCESS ║\n\
║                          Encrypting...                 RUNNING ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                                                                ║\n\
╚════════════════════════════════════════════════════════════════╝\n");
      break;
    }
    case 3: {
      system("clear");
      printf("\
╔════════════════════════════════════════════════════════════════╗\n\
║ Verbose: TRUE             Loading...                   SUCCESS ║\n\
║ AutoAdm: TRUE            Connecting...                 SUCCESS ║\n\
║                          Encrypting...                 SUCCESS ║\n\
║                                                                ║\n\
║                                                                ║\n\
║                      Welcome Administrator                     ║\n\
║                                                                ║\n\
║                                                                ║\n\
╚════════════════════════════════════════════════════════════════╝\n");
      break;
    }
  }
}