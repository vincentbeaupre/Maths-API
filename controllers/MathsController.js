import Controller from './Controller.js';
import fs from 'fs';
import path from 'path';
const wwwroot = 'wwwroot';


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

        if (Object.keys(this.HttpContext.path.params).length === 0) {
            this.help();
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
                    this.HttpContext.response.JSON({
                        op: op,
                        x: x,
                        y: y,
                        error: 'Both x and y parameters are required for this operation'
                    });
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
                    this.HttpContext.response.JSON(responsePayload);
                    return;
                } else if (isNaN(y)) {
                    responsePayload.error = "'y' parameter is not a number";
                    this.HttpContext.response.JSON(responsePayload);
                    return;
                }

                responsePayload.x = parseFloat(x);
                responsePayload.y = parseFloat(y);

                switch (op) {
                    case ' ':
                        responsePayload.value = responsePayload.x + responsePayload.y;
                        break;
                    case '-':
                        responsePayload.value = responsePayload.x - responsePayload.y;
                        break;
                    case '*':
                        responsePayload.value = responsePayload.x * responsePayload.y;
                        break;
                    case '/':
                        if (responsePayload.y === 0) {
                            responsePayload.error = 'Division by zero is not allowed';
                            this.HttpContext.response.JSON(responsePayload);
                            return;
                        } else {
                            responsePayload.value = responsePayload.x / responsePayload.y;
                        }
                        break;
                    case '%':
                        if (responsePayload.y === 0) {
                            responsePayload.error = 'Modulo by zero is not allowed';
                            this.HttpContext.response.JSON(responsePayload);
                            return;
                        } else {
                            responsePayload.value = responsePayload.x % responsePayload.y;
                        }
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
                responsePayload.value = factorial(responsePayload.n);
                break;

            case 'p':
                if (isNaN(n) || n < 0) {
                    responsePayload.error = "'n' parameter must be a non-negative integer";
                    responsePayload.n = n;
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                }

                responsePayload.n = parseInt(n);
                responsePayload.value = isPrime(responsePayload.n);
                break;

            case 'np':
                if (isNaN(n) || n <= 0) {
                    responsePayload.error = "'n' parameter must be a positive integer";
                    responsePayload.n = n;
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                }

                responsePayload.n = parseInt(n);
                responsePayload.value = findNthPrime(responsePayload.n);
                break;

            default:
                this.HttpContext.response.badRequest('Unsupported operation');
                return;
        }

        this.HttpContext.response.JSON(responsePayload);
    }

    help() {
        let helpPagePath = path.join(process.cwd(), wwwroot, 'help.html')
        this.HttpContext.response.HTML(fs.readFileSync(helpPagePath));
    }
}
