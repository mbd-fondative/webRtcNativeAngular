"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var socketio_1 = require("../socketio");
exports.SOCKETIO_URL = new core_1.InjectionToken('SOCKETIO_URL');
exports.SOCKETIO_OPTIONS = new core_1.InjectionToken('SOCKETIO_OPTIONS');
function socketIOFactory(url, options) {
    return new socketio_1.SocketIO(url, options);
}
exports.socketIOFactory = socketIOFactory;
var SocketIOModule = (function () {
    function SocketIOModule() {
    }
    SocketIOModule_1 = SocketIOModule;
    SocketIOModule.forRoot = function (url, options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: SocketIOModule_1,
            providers: [
                {
                    provide: socketio_1.SocketIO,
                    useFactory: socketIOFactory,
                    deps: [exports.SOCKETIO_URL, exports.SOCKETIO_OPTIONS]
                },
                { provide: exports.SOCKETIO_URL, useValue: url },
                { provide: exports.SOCKETIO_OPTIONS, useValue: options },
            ]
        };
    };
    SocketIOModule = SocketIOModule_1 = __decorate([
        core_1.NgModule()
    ], SocketIOModule);
    return SocketIOModule;
    var SocketIOModule_1;
}());
exports.SocketIOModule = SocketIOModule;
//# sourceMappingURL=index.js.map