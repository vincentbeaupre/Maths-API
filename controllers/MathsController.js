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
            this.httpContext.response.badRequest({
                error: "The 'id' parameter is not required for maths operations."
            });
        } else {
            this.calculate();
        }
    }

    calculate() {
        const { op, x, y, n } = this.HttpContext.req.query;

        let responsePayload = { op };

        switch (op) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
                if (isNaN(x) || isNaN(y)) {
                    responsePayload.error = "'x' or 'y' parameter is not a number";
                    responsePayload.x = x;
                    responsePayload.y = y;
                    this.HttpContext.response.badRequest(responsePayload);
                    return;
                }

                responsePayload.x = parseFloat(x);
                responsePayload.y = parseFloat(y);

                switch (op) {
                    case '+':
                        responsePayload.value = responsePayload.x + responsePayload.y;
                        break;
                    case '-':
                        responsePayload.value = responsePayload.x - responsePayload.y;
                        break;
                    case '*':
                        responsePayload.value = responsePayload.x * responsePayload.y;
                        break;
                    case '/':
                        if (responsePayload.y !== 0) {
                            responsePayload.value = responsePayload.x / responsePayload.y;
                        } else {
                            responsePayload.error = 'Division by zero is not allowed';
                            this.HttpContext.response.badRequest(responsePayload);
                            return;
                        }
                        break;
                    case '%':
                        responsePayload.value = responsePayload.x % responsePayload.y;
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
}
