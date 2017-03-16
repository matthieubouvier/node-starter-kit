/**
 * Winston mock.
 *
 * 03-Aug-16: [MBR] Creation
 *
 */

class LoggerMock {

    // Utilities
    resetCounters() {
        this.infoCalls = 0;
        this.warnCalls = 0;
        this.errorCalls = 0;
        this.debugCalls = 0;
    }

    // Spies
    infoCalls: number = 0;
    warnCalls: number = 0;
    errorCalls: number = 0;
    debugCalls: number = 0;

    // Functions
    info(): void {
        this.infoCalls++;
    }
    warn(): void {
        this.warnCalls++;
    }
    error(): void {
        this.errorCalls++;
    }
    debug(): void {
        this.debugCalls++;
    }

}

export class WinstonMock {

    // Utilities
    resetCounters() {
        this.infoCalls = 0;
        this.warnCalls = 0;
        this.errorCalls = 0;
        this.debugCalls = 0;
    }

    // Spies
    infoCalls: number = 0;
    warnCalls: number = 0;
    errorCalls: number = 0;
    debugCalls: number = 0;

    // Properties
    transports: any = {
        Console: () => {},
        Syslog: () => {},
        File: () => {}
    };
    config: any = {
        syslog: {
            levels: ''
        }
    };

    // Functions
    Logger(): any {
        return new LoggerMock();
    }
    remove(): void {}
    setLevels(): void {}
    add():void {}
    info(): void {
        this.infoCalls++;
    }
    warn(): void {
        this.warnCalls++;
    }
    error(): void {
        this.errorCalls++;
    }
    debug(): void {
        this.debugCalls++;
    }

}