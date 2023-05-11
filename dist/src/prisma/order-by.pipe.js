"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
let OrderByPipe = class OrderByPipe {
    transform(value) {
        if (value == null)
            return undefined;
        try {
            const rules = value.split(',').map((val) => val.trim());
            const orderBy = {};
            rules.forEach((rule) => {
                const [key, order] = rule.split(':');
                const orderLowerCase = order.toLocaleLowerCase();
                if (!['asc', 'desc'].includes(orderLowerCase)) {
                    throw new common_1.BadRequestException(`Invalid order: ${orderLowerCase}`);
                }
                orderBy[key] = orderLowerCase;
            });
            return orderBy;
        }
        catch (error) {
            console.error(error);
            throw new common_1.BadRequestException('Invalid orderBy query parameter');
        }
    }
};
OrderByPipe = __decorate([
    (0, common_1.Injectable)()
], OrderByPipe);
exports.default = OrderByPipe;
//# sourceMappingURL=order-by.pipe.js.map