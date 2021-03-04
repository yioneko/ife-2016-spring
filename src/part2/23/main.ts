export {};
const root: HTMLDivElement = document.querySelector(
    ".tree-wrapper"
) as HTMLDivElement;
const frontTraverseButton = document.querySelector(
    ".front-traversal"
) as HTMLButtonElement;
const backTraverseButton = document.querySelector(
    ".back-traversal"
) as HTMLButtonElement;
const textQuery = document.querySelector("input") as HTMLInputElement;
const queryButton = document.querySelector(".query") as HTMLButtonElement;
const leafNodes: HTMLDivElement[] = [];
const maxChildNodes = 5,
    maxTextChars = 5;
function randomText(): string {
    let ret = "";
    const charCount = Math.ceil(Math.random() * maxTextChars);
    for (let i = 0; i < charCount; i++) {
        ret += [
            String.fromCharCode(
                Math.floor(Math.random() * 26) + "a".charCodeAt(0)
            ),
            String.fromCharCode(
                Math.floor(Math.random() * 26) + "A".charCodeAt(0)
            ),
        ][Math.floor(Math.random() + 0.5)];
    }
    return ret;
}
function buildTree(depth: number, curNode: HTMLDivElement): void {
    if (depth === 0) {
        curNode.innerHTML = randomText();
        leafNodes.push(curNode);
        return;
    }
    const childCounts: number = Math.ceil(Math.random() * maxChildNodes);
    for (let i = 0; i < childCounts; i++) {
        const childNode = document.createElement("div");
        buildTree(depth - 1, childNode);
        curNode.appendChild(childNode);
    }
}
buildTree(3, root);
const frontTraverseOrder: HTMLDivElement[] = [];
const backTraverseOrder: HTMLDivElement[] = [];
(function frontTraverse(curNode: HTMLDivElement): void {
    frontTraverseOrder.push(curNode);
    for (const childNode of curNode.children) {
        frontTraverse(childNode as HTMLDivElement);
    }
})(root);
(function backTraverse(curNode: HTMLDivElement): void {
    for (const childNode of curNode.children) {
        backTraverse(childNode as HTMLDivElement);
    }
    backTraverseOrder.push(curNode);
})(root);
function traverse(traverseOrder: HTMLDivElement[]): () => void {
    const buttons: HTMLButtonElement[] = [
        frontTraverseButton,
        backTraverseButton,
    ];
    return () => {
        let lstTime = 0,
            curTraverseIndex = 0;
        for (const button of buttons) {
            button.setAttribute("disabled", "");
        }
        function traverseAnim(timestamp: number): void {
            if (lstTime === 0 || timestamp - lstTime >= 500) {
                lstTime = timestamp;
                if (curTraverseIndex > 0) {
                    traverseOrder[curTraverseIndex - 1].style.removeProperty(
                        "background-color"
                    );
                }
                if (curTraverseIndex === traverseOrder.length) {
                    for (const button of buttons) {
                        button.removeAttribute("disabled");
                    }
                    return;
                }
                traverseOrder[curTraverseIndex].style.backgroundColor = "blue";
                ++curTraverseIndex;
            }
            requestAnimationFrame(traverseAnim);
        }
        requestAnimationFrame(traverseAnim);
    };
}
frontTraverseButton.addEventListener("click", traverse(frontTraverseOrder));
backTraverseButton.addEventListener("click", traverse(backTraverseOrder));
queryButton.addEventListener("click", () => {
    const text = textQuery.value;
    for (const leafNode of leafNodes) {
        const classList = leafNode.classList;
        if (leafNode.innerHTML === text) {
            classList.add("queried");
        } else if (classList.contains("queried")) {
            classList.remove("queried");
        }
    }
});
