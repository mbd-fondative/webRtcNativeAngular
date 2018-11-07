"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketio_common_1 = require("./socketio.common");
var SocketIO = (function (_super) {
    __extends(SocketIO, _super);
    function SocketIO() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        switch (args.length) {
            case 2: {
                var opts = new io.socket.client.IO.Options();
                opts.multiplex = true;
                var options = args[1];
                var keys = Object.keys(options);
                for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
                    var key = keys_1[_a];
                    if (key === 'query') {
                        var query = options[key];
                        if (typeof query === 'object') {
                            var queryKeys = Object.keys(query);
                            var uri = android.net.Uri.parse(args[0]);
                            var uriBuilder = uri.buildUpon();
                            for (var _b = 0, queryKeys_1 = queryKeys; _b < queryKeys_1.length; _b++) {
                                var queryKey = queryKeys_1[_b];
                                var value = "" + query[queryKey];
                                uriBuilder.appendQueryParameter(queryKey, value);
                            }
                            opts.query = uriBuilder.build().getQuery();
                        }
                        else if (typeof query === 'string') {
                            opts.query = query;
                        }
                    }
                    else if (key === 'debug' && options[key]) {
                        co.fitcom.fancylogger.FancyLogger.reset(new co.fitcom.fancylogger.FancyLogger());
                        java.util.logging.Logger.getLogger(io.socket.client.Socket.class.getName()).setLevel(java.util.logging.Level.FINEST);
                        java.util.logging.Logger.getLogger(io.socket.engineio.client.Socket.class.getName()).setLevel(java.util.logging.Level.FINEST);
                        java.util.logging.Logger.getLogger(io.socket.client.Manager.class.getName()).setLevel(java.util.logging.Level.FINEST);
                    }
                    else {
                        opts[key] = options[key];
                    }
                }
                _this.socket = io.socket.client.IO.socket(args[0], opts);
                break;
            }
            case 3: {
                _this.socket = args.pop();
                break;
            }
            default: {
                var opts = new io.socket.client.IO.Options();
                opts.multiplex = true;
                _this.socket = io.socket.client.IO.socket(args[0], opts);
                break;
            }
        }
        return _this;
    }
    SocketIO.prototype.connect = function () {
        if (!this.connected) {
            this.socket.connect();
        }
    };
    SocketIO.prototype.disconnect = function () {
        this.socket.disconnect();
    };
    Object.defineProperty(SocketIO.prototype, "connected", {
        get: function () {
            return this.socket && this.socket.connected();
        },
        enumerable: true,
        configurable: true
    });
    SocketIO.prototype.on = function (event, callback) {
        this.socket.on(event, new io.socket.emitter.Emitter.Listener({
            call: function (args) {
                var payload = Array.prototype.slice.call(args);
                var ack = payload.pop();
                if (ack && !(ack.getClass().getName().indexOf('io.socket.client.Socket') === 0 && ack.call)) {
                    payload.push(ack);
                    ack = null;
                }
                payload = payload.map(deserialize);
                if (ack) {
                    var _ack = function () {
                        var _args = Array.prototype.slice.call(arguments);
                        ack.call(_args.map(serialize));
                    };
                    payload.push(_ack);
                }
                callback.apply(null, payload);
            }
        }));
    };
    SocketIO.prototype.once = function (event, callback) {
        this.socket.once(event, new io.socket.emitter.Emitter.Listener({
            call: function (args) {
                var payload = Array.prototype.slice.call(args);
                var ack = payload.pop();
                if (ack && !(ack.getClass().getName().indexOf('io.socket.client.Socket') === 0 && ack.call)) {
                    payload.push(ack);
                    ack = null;
                }
                payload = payload.map(deserialize);
                if (ack) {
                    var _ack = function () {
                        var _args = Array.prototype.slice.call(arguments);
                        ack.call(_args.map(serialize));
                    };
                    payload.push(_ack);
                }
                callback.apply(null, payload);
            }
        }));
    };
    SocketIO.prototype.off = function (event) {
        this.socket.off(event);
    };
    SocketIO.prototype.emit = function (event) {
        var payload = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            payload[_i - 1] = arguments[_i];
        }
        if (!event) {
            throw Error('Emit Failed: No Event argument');
        }
        var ack = payload.pop();
        if (ack && typeof ack !== 'function') {
            payload.push(ack);
            ack = null;
        }
        var final = payload.map(serialize);
        if (ack) {
            final.push(new io.socket.client.Ack({
                call: function (args) {
                    args = Array.prototype.slice.call(args);
                    ack.apply(null, args.map(deserialize));
                },
            }));
        }
        this.socket.emit(event, final);
    };
    SocketIO.prototype.joinNamespace = function (nsp) {
        var manager = this.socket.io();
        var socket = manager.socket(nsp);
        var namespaceSocket = new SocketIO(null, null, socket);
        if (this.socket.connected()) {
            namespaceSocket.connect();
        }
        return namespaceSocket;
    };
    SocketIO.prototype.leaveNamespace = function () {
        if (this.socket) {
            this.socket.disconnect();
        }
    };
    return SocketIO;
}(socketio_common_1.Common));
exports.SocketIO = SocketIO;
function serialize(data) {
    var store;
    switch (typeof data) {
        case 'string':
        case 'boolean':
        case 'number': {
            return data;
        }
        case 'object': {
            if (!data) {
                return null;
            }
            if (data instanceof Date) {
                return data.toJSON();
            }
            if (Array.isArray(data)) {
                store = new org.json.JSONArray();
                data.forEach(function (item) { return store.put(serialize(item)); });
                return store;
            }
            store = new org.json.JSONObject();
            Object.keys(data).forEach(function (key) { return store.put(key, serialize(data[key])); });
            return store;
        }
        default:
            return null;
    }
}
exports.serialize = serialize;
function deserialize(data) {
    if (data === null || typeof data !== 'object') {
        return data;
    }
    var store;
    switch (data.getClass().getName()) {
        case 'java.lang.String': {
            return String(data);
        }
        case 'java.lang.Boolean': {
            return String(data) === 'true';
        }
        case 'java.lang.Integer':
        case 'java.lang.Long':
        case 'java.lang.Double':
        case 'java.lang.Short': {
            return Number(data);
        }
        case 'org.json.JSONArray': {
            store = [];
            for (var j = 0; j < data.length(); j++) {
                store[j] = deserialize(data.get(j));
            }
            break;
        }
        case 'org.json.JSONObject': {
            store = {};
            var i = data.keys();
            while (i.hasNext()) {
                var key = i.next();
                store[key] = deserialize(data.get(key));
            }
            break;
        }
        default:
            store = null;
    }
    return store;
}
exports.deserialize = deserialize;
function connect(uri, options) {
    var socketio = new SocketIO(uri, options || {});
    socketio.connect();
    return socketio;
}
exports.connect = connect;
//# sourceMappingURL=socketio.js.map