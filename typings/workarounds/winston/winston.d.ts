// Issue with syslog winston imports (pull request not updated https://github.com/DefinitelyTyped/DefinitelyTyped/pull/7543)
declare module "winston" {
    export interface SyslogConfig {
        levels: {
            emerg: number;
            alert: number;
            crit: number;
            error: number;
            warning: number;
            notice: number;
            info: number;
            debug: number;
        };
        colors: {
            emerg: string;
            alert: string;
            crit: string;
            error: string;
            warning: string;
            notice: string;
            info: string;
            debug: string;
        };
    }
    export interface Config {
        syslog: SyslogConfig;
    }
    export type SyslogTransportOptions = ConsoleTransportOptions;
    export interface SyslogTransportInstance extends TransportInstance {
        new (options?: SyslogTransportOptions): SyslogTransportInstance;
    }
    export interface Transports {
        Syslog: SyslogTransportInstance;
    }
    export var config: Config;
}