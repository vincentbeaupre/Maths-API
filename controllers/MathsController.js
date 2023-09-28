import Controller from './Controller.js';

export default class MathsController extends Controller {
    constructor(HttpContext, repository = null) {
        super(HttpContext, repository);
    }

    get() { 
        const { op, x, y, n } = this.HttpContext.req.query;

        if (!op || isNaN(x) || isNaN(y)) {
            this.HttpContext.response.badRequest('Invalid operation or operands');
            return;
        }

        let result;
        switch (op) {
            case '+':
                result = parseFloat(x) + parseFloat(y);
                break;
            case '-':
                result = parseFloat(x) - parseFloat(y);
                break;
            // ... other cases
            default:
                this.HttpContext.response.badRequest('Unsupported operation');
                return;
        }

        this.HttpContext.response.JSON({
            operation: op,
            operands: { x, y },
            result,
            status: 'success'
        });
    }
}
