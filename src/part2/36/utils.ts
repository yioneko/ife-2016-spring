import { useCallback, useRef, useState } from "react";
import { AsyncDispatch, Coordinate, DirectionsType } from "./types";

export function floatLessCompare(a: number, b: number): boolean {
    return b - a > 1e-9;
}

export function isCoordinateEqual(a: Coordinate, b: Coordinate): boolean {
    return a.x === b.x && a.y === b.y;
}

export function isCoordinateInRange(
    coordinate: Coordinate,
    gridCount: number
): boolean {
    const singleInRange = (value: number) => value >= 1 && value <= gridCount;
    return singleInRange(coordinate.x) && singleInRange(coordinate.y);
}

export function fillTowDimensionArray<T>(
    value: T,
    dimensions: [number, number]
): Array<Array<T>> {
    return Array.from(Array(dimensions[0]), () =>
        Array(dimensions[1]).fill(value)
    );
}

function useAsyncState<S>(
    initialState: S
): [
    React.MutableRefObject<S>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    (newState: S, callBack?: Function) => Promise<void>
] {
    const state = useRef(initialState);
    // eslint-disable-next-line @typescript-eslint/ban-types
    const setState = useCallback(async (newState: S, callBack?: Function) => {
        state.current = newState;
        if (callBack) callBack();
    }, []);
    return [state, setState];
}

export function useAsyncReducer<S, A>(
    reducer: (prevState: S, action: A) => Promise<S>,
    initialState: S
): [S, AsyncDispatch<A>] {
    const [state, setState] = useAsyncState(initialState);
    const dispatch = useCallback(
        async (action: A) =>
            await setState(await reducer(state.current, action)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [reducer, state.current]
    );
    return [state.current, dispatch];
}

export const directions: Record<DirectionsType, Coordinate> = Object.freeze({
    left: {
        x: -1,
        y: 0,
    },
    right: {
        x: 1,
        y: 0,
    },
    up: {
        x: 0,
        y: -1,
    },
    down: {
        x: 0,
        y: 1,
    },
});

export const directionUtils: {
    angles: Record<DirectionsType, number>;
    getRotateAngle: (
        src: DirectionsType,
        target: DirectionsType,
        counterClockWise: boolean
    ) => number;
    getDirection: (src: DirectionsType, angle: number) => DirectionsType;
} = {
    angles: Object.freeze({
        left: Math.PI,
        right: 0,
        up: (Math.PI * 3) / 2,
        down: Math.PI / 2,
    }),
    getRotateAngle: function (src, target, counterClockWise = false) {
        const diff = this.angles[target] - this.angles[src];
        const cycle = Math.PI * 2;
        return (counterClockWise ? diff - cycle : diff + cycle) % cycle;
    },
    getDirection: function (src, angle) {
        const cycle = Math.PI * 2;
        // -3 % 2 = -1, etc. As we need handle negative angle less than -2Pi.
        const normalizedAngle =
            (((this.angles[src] + angle) % cycle) + cycle) % cycle;
        // casting applied here for extra keys may be added to this.angles
        // see https://github.com/Microsoft/TypeScript/pull/12253#issuecomment-263132208
        for (const key of Object.keys(this.angles) as DirectionsType[]) {
            if (this.angles[key] === normalizedAngle) {
                return key;
            }
        }
        throw new Error("Wrong rotation angle!");
    },
};

export function validateColor(color: string): boolean {
    const style = new Option().style;
    style.color = color;
    return style.color !== "";
}

export function useReset(): [number, () => void] {
    const [resetCounter, setResetCounter] = useState(0);
    const handleReset = useCallback(() => {
        setResetCounter((prevCounter) => prevCounter + 1);
    }, []);
    return [resetCounter, handleReset];
}

export function swapElementInArray<T>(
    arr: Array<T>,
    a: number,
    b: number
): void {
    const temp = arr[b];
    arr[b] = arr[a];
    arr[a] = temp;
}

export class PriorityQueue<T> {
    #arr: Array<T> = [undefined as never];
    #compare: (a: T, b: T) => number;

    // compare: less: negative, equal: 0, greater: positive
    constructor(compare: (a: T, b: T) => number) {
        this.#compare = compare;
    }

    empty(): boolean {
        return this.#arr.length <= 1;
    }

    push(node: T): void {
        const arr = this.#arr;
        arr.push(node);
        let cur = arr.length - 1;
        while (cur > 1 && this.#compare(arr[cur], arr[cur >> 1])) {
            swapElementInArray(arr, cur, cur >> 1);
            cur >>= 1;
        }
    }

    pop(): T | undefined {
        const arr = this.#arr;
        swapElementInArray(arr, 1, arr.length - 1);
        let cur = 1;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const lower = arr[cur * 2]
                ? arr[cur * 2 + 1]
                    ? arr[cur * 2] < arr[cur * 2 + 1]
                        ? cur * 2
                        : cur * 2 + 1
                    : cur * 2
                : -1;
            if (lower !== -1 && arr[cur] > arr[lower]) {
                swapElementInArray(arr, cur, lower);
                cur = lower;
            } else {
                break;
            }
        }
        if (!this.empty()) {
            return arr.pop();
        } else {
            return undefined;
        }
    }
}
