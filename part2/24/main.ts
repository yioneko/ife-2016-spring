export { };

const root: HTMLDivElement = document.querySelector('.tree-wrapper') as HTMLDivElement;
const frontTraverseButton = document.querySelector('.front-traversal') as HTMLButtonElement;
const backTraverseButton = document.querySelector('.back-traversal') as HTMLButtonElement;
const textQuery = document.querySelector('.query input') as HTMLInputElement;
const queryButton = document.querySelector('.query button') as HTMLButtonElement;
const textAdd = document.querySelector('.add-remove input') as HTMLInputElement;
const addButton = document.querySelector('.add-button') as HTMLButtonElement;
const removeButton = document.querySelector('.remove-button') as HTMLButtonElement;
const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.operations button')

const maxChildNodes = 5, maxTextChars = 5;

let selectedNode: HTMLDivElement | null = null;

function randomText(): string {
    let ret = "";
    const charCount = Math.ceil(Math.random() * maxTextChars);
    for (let i = 0; i < charCount; i++) {
        ret += [String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0)),
        String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))][Math.floor(Math.random() + 0.5)];
    }
    return ret;
}
function processNode(node: HTMLDivElement, text: string): HTMLDivElement {
    node.innerHTML = text;
    node.addEventListener("click", function(e: Event): void {
        e.stopPropagation();
        if (selectedNode !== null) selectedNode.classList.remove("selected");
        this.classList.add("selected");
        selectedNode = this;
    })
    return node;
}
function buildTree(depth: number, curNode: HTMLDivElement): void {
    if (depth === 0) {
        return;
    }
    const childCounts: number = Math.ceil(Math.random() * maxChildNodes);
    for (let i = 0; i < childCounts; i++) {
        const childNode = document.createElement('div');
        processNode(childNode, randomText());
        buildTree(depth - 1, childNode);
        curNode.appendChild(childNode);
    }
}
buildTree(3, root);

const frontTraverseOrder: HTMLDivElement[] = [];
const backTraverseOrder: HTMLDivElement[] = [];
function frontTraverse(curNode: HTMLDivElement): void {
    frontTraverseOrder.push(curNode);
    for (const childNode of curNode.children) {
        frontTraverse(childNode as HTMLDivElement);
    }
}
function backTraverse(curNode: HTMLDivElement): void {
    for (const childNode of curNode.children) {
        backTraverse(childNode as HTMLDivElement);
    }
    backTraverseOrder.push(curNode);
}
function traverse(traverseOrder: HTMLDivElement[]): () => void {
    return () => {
        let lstTime = 0, curTraverseIndex = 0;
        if (traverseOrder === frontTraverseOrder) {
            frontTraverse(root);
        } else {
            backTraverse(root);
        }
        for (const button of buttons) {
            button.setAttribute("disabled", "");
        }
        function traverseAnim(timestamp: number): void {
            if (lstTime === 0 || timestamp - lstTime >= 500) {
                lstTime = timestamp;
                if (curTraverseIndex > 0) {
                    traverseOrder[curTraverseIndex - 1].style.removeProperty("background-color");
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
    }
}
frontTraverseButton.addEventListener("click", traverse(frontTraverseOrder));
backTraverseButton.addEventListener("click", traverse(backTraverseOrder));

queryButton.addEventListener("click", () => {
    const text = textQuery.value;
    const nodeIter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);
    let node = nodeIter.nextNode() as HTMLElement | null;
    while (node !== null) {
        const classList = node.classList;
        if (node.innerHTML === text) {
            classList.add("queried");
        } else if (classList.contains("queried")) {
            classList.remove("queried");
        }
        node = nodeIter.nextNode() as HTMLElement | null;
    }
});

addButton.addEventListener("click", () => {
    if (selectedNode !== null) {
        (selectedNode.parentElement as HTMLDivElement).insertBefore(
            processNode(document.createElement("div"), textAdd.value),
            selectedNode.nextElementSibling);
    }
});

removeButton.addEventListener("click", () => {
    if (selectedNode !== null) {
        (selectedNode.parentElement as HTMLDivElement).removeChild(selectedNode);
        selectedNode = null;
    }
});
