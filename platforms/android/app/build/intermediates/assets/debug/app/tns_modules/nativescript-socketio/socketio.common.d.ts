export declare abstract class Common {
    protected abstract socket: any;
    abstract emit(event: string, ...payload: any[]): void;
    abstract on(event: string, callback: (...payload) => void): void;
    abstract once(event: string, callback: (...payload) => void): void;
    abstract off(event: string): void;
    abstract connected: boolean;
    readonly disconnected: boolean;
    readonly instance: any;
    abstract joinNamespace(nsp: String): any;
    abstract leaveNamespace(): void;
    connect(): void;
    disconnect(): void;
}
