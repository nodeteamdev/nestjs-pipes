"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function delimetedStringObject(n, v, d) {
    n = n.split(d || '.');
    n.reverse();
    return n.reduce(function (res, it) {
        return { [it]: res };
    }, v);
}
exports.default = delimetedStringObject;
//# sourceMappingURL=delimeted-string-object.js.map