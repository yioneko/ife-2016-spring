export {};
const root: HTMLDivElement = document.querySelector(
    ".tree-wrapper"
) as HTMLDivElement;
const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
    "button"
);
function buildTree(curNode: HTMLDivElement, dep: number): void {
    if (dep === 0) {
        return;
    }
    const lChild: HTMLDivElement = document.createElement("div");
    lChild.className = "lChild";
    const rChild: HTMLDivElement = document.createElement("div");
    rChild.className = "rChild";
    buildTree(lChild, dep - 1);
    buildTree(rChild, dep - 1);
    curNode.appendChild(lChild);
    curNode.appendChild(rChild);
}
buildTree(root, 3);
const frontTraverseOrder: HTMLDivElement[] = [];
const backTraverseOrder: HTMLDivElement[] = [];
const middleTraverseOrder: HTMLDivElement[] = [];
(function frontTraverse(curNode: HTMLDivElement | null): void {
    console.log(curNode);
    if (curNode != null) {
        frontTraverseOrder.push(curNode);
        frontTraverse(curNode.firstChild as HTMLDivElement);
        frontTraverse(curNode.lastChild as HTMLDivElement);
    }
})(root);
(function backTraverse(curNode: HTMLDivElement | null): void {
    if (curNode != null) {
        backTraverse(curNode.firstChild as HTMLDivElement);
        backTraverse(curNode.lastChild as HTMLDivElement);
        backTraverseOrder.push(curNode);
    }
})(root);
(function middleTraverse(curNode: HTMLDivElement | null): void {
    if (curNode != null) {
        middleTraverse(curNode.firstChild as HTMLDivElement);
        middleTraverseOrder.push(curNode);
        middleTraverse(curNode.lastChild as HTMLDivElement);
    }
})(root);
function traverse(traverseOrder: HTMLDivElement[]): () => void {
    return function () {
        buttons.forEach((value: HTMLButtonElement) => {
            value.setAttribute("disabled", "");
        });
        let curNodeIndex = 0,
            lstTime = 0;
        function traverseAnim(timestamp: number): void {
            if (lstTime === 0 || timestamp - lstTime >= 500) {
                lstTime = timestamp;
                if (curNodeIndex > 0) {
                    traverseOrder[curNodeIndex - 1].style.removeProperty(
                        "background-color"
                    );
                }
                if (curNodeIndex === traverseOrder.length) {
                    buttons.forEach((value: HTMLButtonElement) => {
                        value.removeAttribute("disabled");
                    });
                    return;
                }
                traverseOrder[curNodeIndex].style.backgroundColor = "blue";
                curNodeIndex++;
            }
            requestAnimationFrame(traverseAnim);
        }
        requestAnimationFrame(traverseAnim);
    };
}

buttons.forEach((value) => {
    switch (value.className) {
        case "front-traversal":
            value.addEventListener("click", traverse(frontTraverseOrder));
            break;

        case "back-traversal":
            value.addEventListener("click", traverse(backTraverseOrder));
            break;

        case "middle-traversal":
            value.addEventListener("click", traverse(middleTraverseOrder));
            break;

        default:
            break;
    }
});
