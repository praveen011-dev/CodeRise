const sampleObj={
    "JAVASCRIPT": "const readline = require('readline');\n\nconst rl = readline.createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\nlet inputLines = [];\n\nrl.on('line', (line) => {\n    inputLines = line.split(' ');\n    rl.close();\n}).on('close', () => {\n    const a = parseInt(inputLines[0], 10);\n    const b = parseInt(inputLines[1], 10);\n    console.log(a + b);\n});",
    "PYTHON": "import sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(a + b)",
    "JAVA": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
}


// ✅ What is Object.entries()?
// Object.entries(obj) is a JavaScript method that returns an array of key-value pairs from the object.

// For example:

// const obj = { a: 1, b: 2 };
// console.log(Object.entries(obj));

// Output:

// [ ['a', 1], ['b', 2] ]



// what does object.entries do ?

// basiscally convert in the array
console.log(Object.entries(sampleObj));


for (const [language,solutionCode]of Object.entries(sampleObj)){
    console.log(language)
    console.log(solutionCode)

    console.log("-----------------------------");
    
}