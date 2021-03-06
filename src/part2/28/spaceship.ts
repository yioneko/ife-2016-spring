import { canvas, ctx, operation, spaceships, Command } from "./global";
import BUS from "./bus";
export default class Spaceship {
    readonly id: number;
    readonly dynamicSelectionId: number;
    readonly energySelectionId: number;
    speed: number;
    fuel: number;
    radius: number;
    fuelConsumptionSpeed: number;
    fuelChargeSpeed: number;
    flying: boolean;
    destroying: boolean;
    destroyTime: number;
    totalDistance: number;
    width: number;
    height: number;
    broadcastInterval: number;
    broadcastId: NodeJS.Timeout;

    constructor(
        id: number,
        radius: number,
        speed: number,
        fuelConsumptionSpeed: number,
        fuelChargeSpeed: number,
        dynamicSelectionId: number,
        energySelectionId: number
    ) {
        this.id = id;
        this.fuel = 100;
        this.totalDistance = 0;
        this.speed = speed;
        this.radius = radius;
        this.flying = false;
        this.destroying = false;
        this.destroyTime = 500;
        this.fuelConsumptionSpeed = fuelConsumptionSpeed;
        this.fuelChargeSpeed = fuelChargeSpeed;
        this.width = 65;
        this.height = 30;
        this.dynamicSelectionId = dynamicSelectionId;
        this.energySelectionId = energySelectionId;

        this.broadcastInterval = 200;
        this.broadcastId = setInterval(() => {
            this.broadcast();
        }, this.broadcastInterval);
    }

    receiveCommand(binaryCommand: number): boolean {
        const command = this.commandDecoder(binaryCommand);
        if (this.id === command.id) {
            if (command.operation === "start") {
                this.flying = true;
            } else if (command.operation === "stop") {
                this.flying = false;
            } else if (command.operation === "destroy") {
                this.destroying = true;
                setTimeout(() => {
                    clearTimeout(this.broadcastId);
                    this.broadcast(3); // send destroyed info
                    spaceships[this.id - 1] = null;
                }, this.destroyTime); // 给销毁过程一个时间，使监控板上能明显显示即将销毁的状态
                return true;
            }
        }
        return false;
    }

    updateState(time: number): void {
        time /= 1000;
        const ifValue =
            this.fuel -
            (this.fuelConsumptionSpeed - this.fuelChargeSpeed) * time;
        if (this.flying) {
            if (ifValue <= 0) {
                this.flying = false;
                const flyTime =
                    this.fuel /
                    (this.fuelConsumptionSpeed - this.fuelChargeSpeed);
                this.totalDistance += flyTime * this.speed;
                this.fuel = (time - flyTime) * this.fuelChargeSpeed;
            } else {
                this.fuel = ifValue;
                this.totalDistance += time * this.speed;
            }
        } else {
            this.fuel += this.fuelChargeSpeed * time;
        }
        this.fuel = Math.min(this.fuel, 100);
        this.draw();
    }

    private draw(): void {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.totalDistance / this.radius);
        ctx.translate(0, -this.radius);
        ctx.fillStyle = "#7d8597";
        ctx.beginPath();
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.arc(this.width / 2, 0, this.height / 2, -Math.PI / 2, Math.PI / 2);
        ctx.arc(
            -this.width / 2,
            0,
            this.height / 2,
            -Math.PI / 2,
            Math.PI / 2,
            true
        );
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#0353a4";
        ctx.arc(
            -this.width / 2 + this.height / 2,
            0,
            (this.height / 2) * Math.sqrt(2),
            (Math.PI / 4) * 3,
            (Math.PI / 4) * 5
        );
        ctx.arc(
            -this.width / 2,
            0,
            this.height / 2,
            -Math.PI / 2,
            Math.PI / 2,
            true
        );
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#caf0f8";
        ctx.font = "15px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${this.id}号-${this.fuel.toFixed(0)}%`, 0, 0);
        ctx.restore();
    }

    private commandDecoder(binaryCommand: number): Command {
        return {
            id: (binaryCommand >> 2) + 1,
            operation: operation[binaryCommand & 3] as keyof typeof operation,
        };
    }

    private stateEncoder(state?: number): number {
        if (state === undefined) {
            state = this.destroying ? 2 : this.flying ? 1 : 0;
        }

        return [
            [2, this.dynamicSelectionId],
            [2, this.energySelectionId],
            [2, state],
            [8, this.fuel],
        ].reduce((prev: number, cur) => (prev << cur[0]) + cur[1], this.id - 1);
    }

    private broadcast(state?: number): void {
        const code = this.stateEncoder(state);
        BUS.transmitSpaceshipSignal(code);
    }
}
