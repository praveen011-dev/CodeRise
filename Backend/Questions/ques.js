// question

// Implement bubble sort algorithm to sort an array in ascending order.

// Implement bubble sort algorithm to sort an array in ascending order.

// Examples:
// Input:
// 5 64 34 25 12 22
// Output:
// 12 22 25 34 64
// Explanation:
// Array sorted using bubble sort.

// Input:
// 4 5 2 8 1
// Output:
// 1 2 5 8
// Explanation:
// Sorted array in ascending order.

// Constraints:
// 1 Γëñ n Γëñ 1000, -10^6 Γëñ arr[i] Γëñ 10^6

// Test Cases
// Input	Expected Output
// 3 3 1 2	1 2 3
// 1 42	    42
// 4 -1 -5 0 3	-5 -1 0 3

//java solution

// import java.util.*;

// public class Main {
//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);
//         int n = sc.nextInt();
//         int[] arr = new int[n];
//         for (int i = 0; i < n; i++) {
//             arr[i] = sc.nextInt();
//         }

//         for (int i = 0; i < n; i++) {
//             for (int j = 0; j < n - i - 1; j++) {
//                 if (arr[j] > arr[j + 1]) {
//                     int temp = arr[j];
//                     arr[j] = arr[j + 1];
//                     arr[j + 1] = temp;
//                 }
//             }
//         }

//         for (int i = 0; i < arr.length; i++) {
//             System.out.print(arr[i]);
//             if (i < arr.length - 1) System.out.print(" ");
//         }
//     }
// }

//python solution

// import sys
// input_lines = sys.stdin.read().strip().split('\n')
// n = int(input_lines[0])
// arr = list(map(int, input_lines[1].split()))

// for i in range(n):
//     for j in range(0, n - i - 1):
//         if arr[j] > arr[j + 1]:
//             arr[j], arr[j + 1] = arr[j + 1], arr[j]

// print(' '.join(map(str, arr)))

//java script solution

// const fs = require('fs');
// const input = fs.readFileSync(0, 'utf-8').trim().split('\n');
// const n = parseInt(input[0]);
// const arr = input[1].split(' ').map(Number);

// for (let i = 0; i < n; i++) {
//     for (let j = 0; j < n - i - 1; j++) {
//         if (arr[j] > arr[j + 1]) {
//             [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//         }
//     }
// }

// console.log(arr.join(' '));
