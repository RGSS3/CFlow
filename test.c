#include <stdio.h>

int model = 0;

void update_model(void) {
    printf("<div id='p'>%d</div>\n", model); 
    fflush(stdout);
}

int main(void) {
    fprintf(stderr, "Hello world\n");
    fflush(stderr);
    puts("<button data-notify=1>Up</button><br>");
    fflush(stdout);
    puts("<button data-notify=2>Down</button><br>");
    fflush(stdout);
    update_model();
    while (1) {
       int action;
       if (scanf("%d", &action) == 1) {
         fprintf(stderr, "%d\n", action);
         if (action == 1) {
           ++model;
           update_model();
         } else if (action == 2) {
           --model;
           update_model();
         }
       }
    }
}



