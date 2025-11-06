#include <stdio.h>
#include <string.h>
#define TERM 10;
typedef struct player{
    int age;
    char grt_partner[15];
    float s_rate;
}PLAYER;
void add(int,int);
int multipy(int,int);

int main(){
    PLAYER p1 = {25, "Rohit Sharma", 150.5};
    PLAYER p2;
     
    int v = 10;
    int *vtr = &v;
    int *ptr = &vtr;
    printf("%p \n" , *ptr);
    printf("%u \n" , *vtr);
    printf("%p \n" , &vtr);
    
    return 0;
}
void add(int a,int b){
    printf("%d \n",a+b);
}
int multiply(int a,int b){
    return a*b;
} 