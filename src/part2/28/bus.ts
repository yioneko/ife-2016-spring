import {
    msgTryInfo,
    msgCommand,
    spaceships,
    Command,
    operation,
} from "./global";
import Monitor from './monitor';
export default class BUS {
    static failureRate = 0.1;
    static spreadTime = 300;
    static retryInterval = 500;

    static simulateTry(successCallback: () => void): void {
        let tryTimes = 1;
        (function innerTry(): void {
            setTimeout(() => {
                if (Math.random() < BUS.failureRate) {
                    ++tryTimes;
                    setTimeout(innerTry, BUS.retryInterval);
                } else {
                    msgTryInfo.innerHTML = `Tried ${tryTimes} times:`;
                    successCallback();
                }
            }, BUS.spreadTime);
        })();
    }

    static spreadCommand(command: Command): void {
        BUS.simulateTry(() => {
            for (const spaceship of spaceships) {
                if (spaceship) {
                    if (spaceship.receiveCommand(this.commandEncoder(command)))
                        BUS.updateDom(command);
                }
            }
            msgCommand.innerHTML = JSON.stringify(command);
        });
    }

    static updateDom(command: Command): void {
        const commands = document.querySelector(
            `.spaceship${command.id}-commands`
        );
        if (commands) {
            switch (command.operation) {
                case "create":
                    commands.classList.remove("destroyed");
                    break;
                case "destroy":
                    commands.classList.add("destroyed");
                    break;
            }
        }
    }

    static transmitSpaceshipSignal(code: number): void {
        Monitor.processSpaceshipSignal(code);
    }

    private static commandEncoder(command: Command): number {
        return ((command.id - 1) << 2) | operation[command.operation];
    }
}
