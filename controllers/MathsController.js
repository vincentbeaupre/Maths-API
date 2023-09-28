import Controller from './Controller.js';

function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function findNthPrime(n) {
    let count = 0;
    let num = 1;
    while (count < n) {
        num++;
        if (isPrime(num)) count++;
    }
    return num;
}

function factorial(n) {
    return (n === 0 || n === 1) ? 1 : n * factorial(n - 1);
}

export default class MathsController extends Controller {
    constructor(HttpContext, repository = null) {
        super(HttpContext, repository);
    }

    get(id = null) {
        if (id) {
            this.HttpContext.response.badRequest({
                error: "The 'id' parameter is not required for maths operations."
            });
        } else {
            this.calculate();
        }
    }

    calculate() {

        if (!this.HttpContext.path.params) {
            this.HttpContext.response.HTML(this.getDocumentationHTML());
            return;
        }

        const { op, x, y, n } = this.HttpContext.payload;

        let responsePayload = { op: op === ' ' ? '+' : op };

        switch (op) {
            case ' ':
            case '-':
            case '*':
            case '/':
            case '%':
                if (x === undefined || y === undefined) {
                    responsePayload.error = "Both 'x' and 'y' parameters are required for this operation";
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                }
                break;
            case '!':
            case 'p':
            case 'np':
                if (n === undefined) {
                    responsePayload.error = "The 'n' parameter is required for this operation";
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                }
                break;
            default:
                responsePayload.error = "Unsupported operation";
                this.HttpContext.response.badRequest(responsePayload);
                return;
        }

        switch (op) {
            case ' ':
            case '-':
            case '*':
            case '/':
            case '%':

                responsePayload.x = x;
                responsePayload.y = y;

                if (isNaN(x)) {
                    responsePayload.error = "'x' parameter is not a number";
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                } else if (isNaN(y)) {
                    responsePayload.error = "'y' parameter is not a number";
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                }

                responsePayload.x = parseFloat(x);
                responsePayload.y = parseFloat(y);

                switch (op) {
                    case ' ':
                        responsePayload.result = responsePayload.x + responsePayload.y;
                        break;
                    case '-':
                        responsePayload.result = responsePayload.x - responsePayload.y;
                        break;
                    case '*':
                        responsePayload.result = responsePayload.x * responsePayload.y;
                        break;
                    case '/':
                        if (responsePayload.y !== 0) {
                            responsePayload.result = responsePayload.x / responsePayload.y;
                        } else {
                            responsePayload.error = 'Division by zero is not allowed';
                            this.HttpContext.response.badRequest(responsePayload);
                            return;
                        }
                        break;
                    case '%':
                        responsePayload.result = responsePayload.x % responsePayload.y;
                        break;
                }
                break;

            case '!':
                if (isNaN(n) || n < 0) {
                    responsePayload.error = "'n' parameter must be a non-negative integer";
                    responsePayload.n = n;
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                }

                responsePayload.n = parseInt(n);
                responsePayload.result = factorial(responsePayload.n);
                break;

            case 'p':
                if (isNaN(n) || n < 0) {
                    responsePayload.error = "'n' parameter must be a non-negative integer";
                    responsePayload.n = n;
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                }

                responsePayload.n = parseInt(n);
                responsePayload.isPrime = isPrime(responsePayload.n);
                break;

            case 'np':
                if (isNaN(n) || n <= 0) {
                    responsePayload.error = "'n' parameter must be a positive integer";
                    responsePayload.n = n;
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                }

                responsePayload.n = parseInt(n);
                responsePayload.result = findNthPrime(responsePayload.n);
                break;

            default:
                this.HttpContext.response.badRequest('Unsupported operation');
                return;
        }

        this.HttpContext.response.JSON(responsePayload);
    }

    getDocumentationHTML() {
        return `
        <html>
        <head>
            <title>Math API Documentation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
        
                li {
                    margin-bottom: 20px;
                }
        
                code {
                    background-color: #f0f0f0;
                    padding: 5px;
                    border-radius: 5px;
                    display: inline-block;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <h1>GET: Maths Endpoint</h1>
            <p>List of possible query strings:</p>
            <hr>
            <ul>
                <li>
                    <strong>Addition:</strong> 
                    <code>?op=+&x=[value]&y=[value]</code><br>
                    Returns: <code>{"op":"+", "x":[value], "y":[value], "result":[x + y]}</code>
                </li>
        
                <li>
                    <strong>Subtraction:</strong> 
                    <code>?op=-&x=[value]&y=[value]</code><br>
                    Returns: <code>{"op":"-", "x":[value], "y":[value], "result":[x - y]}</code>
                </li>
        
                <li>
                    <strong>Multiplication:</strong> 
                    <code>?op=*&x=[value]&y=[value]</code><br>
                    Returns: <code>{"op":"*", "x":[value], "y":[value], "result":[x * y]}</code>
                </li>
        
                <li>
                    <strong>Division:</strong> 
                    <code>?op=/&x=[value]&y=[value]</code><br>
                    Returns: <code>{"op":"/", "x":[value], "y":[value], "result":[x / y]}</code><br>
                    Note: <em>y</em> must not be 0 to avoid division by zero error.
                </li>
        
                <li>
                    <strong>Modulo:</strong> 
                    <code>?op=%&x=[value]&y=[value]</code><br>
                    Returns: <code>{"op":"%", "x":[value], "y":[value], "result":[x % y]}</code>
                </li>
        
                <li>
                    <strong>Factorial:</strong> 
                    <code>?op=!&n=[value]</code><br>
                    Returns: <code>{"op":"!", "n":[value], "result":[n!]}</code><br>
                    Note: <em>n</em> must be a non-negative integer.
                </li>
        
                <li>
                    <strong>Prime Check:</strong> 
                    <code>?op=p&n=[value]</code><br>
                    Returns: <code>{"op":"p", "n":[value], "isPrime":[true/false]}</code><br>
                    Note: <em>n</em> must be a positive integer.
                </li>
        
                <li>
                    <strong>Find nth Prime:</strong> 
                    <code>?op=np&n=[value]</code><br>
                    Returns: <code>{"op":"np", "n":[value], "result":[nth prime number]}</code><br>
                    Note: <em>n</em> must be a positive integer.
                </li>
            </ul>
        </body>
        </html>
        
        `;
    }
}
