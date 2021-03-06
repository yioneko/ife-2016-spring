import { dynamicSelections, energySelections } from "./global";

export default class Monitor {
    static monitorTableBody = document.querySelector(
        ".monitor tbody"
    ) as HTMLTableSectionElement;
    private static trList: [
        HTMLTableRowElement | null,
        HTMLTableRowElement | null,
        HTMLTableRowElement | null,
        HTMLTableRowElement | null
    ] = [null, null, null, null];

    private static stateDecoder(
        code: number
    ): {
        id: number;
        dynamic: string;
        energy: string;
        state: string | null;
        fuel: number;
    } {
        const fuel = code & 0xff;
        code >>= 8;
        const stateCode = code & 3;
        code >>= 2;
        const energySelectionId = code & 3;
        code >>= 2;
        const dynamicSelectionId = code & 3;
        code >>= 2;
        const spaceshipId = code + 1;

        const stateTable = ["停止", "飞行中", "即将销毁", null];
        return {
            id: spaceshipId,
            dynamic: dynamicSelections[dynamicSelectionId].name,
            energy: energySelections[energySelectionId].name,
            state: stateTable[stateCode],
            fuel: fuel,
        };
    }

    static processSpaceshipSignal(code: number): void {
        const rowInfo = Monitor.stateDecoder(code);
        const targetRowIndex = rowInfo.id - 1;
        let targetRow = Monitor.trList[targetRowIndex];
        if (targetRow && rowInfo.state === null) {
            this.trList[targetRowIndex] = null;
            Monitor.monitorTableBody.removeChild(targetRow);
        } else if (rowInfo.state !== null) {
            if (targetRow === null) {
                targetRow = document.createElement("tr");
                let beforeRowIndex = targetRowIndex;
                for (; beforeRowIndex < this.trList.length; ++beforeRowIndex) {
                    if (this.trList[beforeRowIndex] !== null) {
                        Monitor.monitorTableBody.insertBefore(
                            targetRow,
                            this.trList[beforeRowIndex]
                        );
                        break;
                    }
                }
                if (beforeRowIndex === this.trList.length) {
                    Monitor.monitorTableBody.appendChild(targetRow);
                }
                this.trList[targetRowIndex] = targetRow;
            }
            targetRow.innerHTML = `<td>${rowInfo.id}号</td><td>${rowInfo.dynamic}</td><td>${rowInfo.energy}</td><td>${rowInfo.state}</td><td>${rowInfo.fuel}%</td>`;
        }
    }
}
