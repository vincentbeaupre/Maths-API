export default class MathsController {
    constructor(httpContext) {
        this.httpContext = httpContext;
    }

    get(id) {
        const { op, x, y, n } = this.httpContext.req.query;

        let result;
        switch (op) {
            case '+':
                result = parseFloat(x) + parseFloat(y);
                break;
            case '-':
                result = parseFloat(x) - parseFloat(y);
                break;
            // ... Handle other operations
            default:
                this.httpContext.response.json({
                    status: 'error',
                    message: 'Unsupported operation'
                });
                return;
        }

        this.httpContext.response.json({
            operation: op,
            operands: { x, y },
            result,
            status: 'success'
        });
    }
}
