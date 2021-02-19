export { };

const root: HTMLDivElement = document.querySelector('.tree-component') as HTMLDivElement;
const textQuery = document.querySelector('.query input') as HTMLInputElement;
const queryButton = document.querySelector('.query button') as HTMLButtonElement;
const textAdd = document.querySelector('.operations input') as HTMLInputElement;
const addButton = document.querySelector('.add-button') as HTMLButtonElement;
const removeButton = document.querySelector('.remove-button') as HTMLButtonElement;

const maxChildNodes = 5, maxTextChars = 5;

let selectedNode: HTMLLIElement | null = null;

function randomText(): string {
    let ret = "";
    const charCount = Math.ceil(Math.random() * maxTextChars);
    for (let i = 0; i < charCount; i++) {
        ret += [String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0)),
        String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))][Math.floor(Math.random() + 0.5)];
    }
    return ret;
}
function processNode(node: HTMLLIElement, text: string): HTMLLIElement {
    const nameElement: HTMLDivElement = document.createElement('div');
    nameElement.className = 'name';
    nameElement.innerHTML = text;
    node.appendChild(nameElement);
    node.addEventListener("click", function(e: Event): void {
        e.stopPropagation();
        if (selectedNode !== null) selectedNode.classList.remove("selected");
        this.classList.add("selected");
        selectedNode = this;
    })
    node.addEventListener("click", function(e: Event): void {
        e.stopPropagation();
        if (this.classList.contains("collapsed")) {
            this.classList.remove("collapsed");
        } else {
            this.classList.add("collapsed");
        }
    })
    return node;
}
function buildTree(depth: number, curNode: HTMLOListElement): HTMLOListElement {
    const childCounts: number = Math.ceil(Math.random() * maxChildNodes);
    for (let i = 0; i < childCounts; i++) {
        const childNode = document.createElement('li');
        processNode(childNode, randomText());
        if (depth > 1 && Math.random() > 0.2) {
            childNode.classList.add("directory");
            childNode.appendChild(buildTree(depth - 1, document.createElement("ol")));
        } else {
            childNode.classList.add("item");
        }
        curNode.appendChild(childNode);
    }
    return curNode;
}
root.appendChild(buildTree(3, document.createElement("ol")));


queryButton.addEventListener("click", () => {
    const text = textQuery.value;
    const nodeIter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node: HTMLElement) => {
            if (node.classList.contains('name')) return NodeFilter.FILTER_ACCEPT;
            else return NodeFilter.FILTER_REJECT;
        }
    });
    let node = nodeIter.nextNode() as HTMLElement | null;
    while (node !== null) {
        const classList = node.classList;
        if (node.innerHTML === text) {
            classList.add("queried");
            let parentDirectory = node.parentElement;
            while (parentDirectory !== null && parentDirectory !== root) {
                if (parentDirectory.classList.contains('collapsed')) {
                    parentDirectory.classList.remove('collapsed');
                }
                parentDirectory = parentDirectory.parentElement;
                if (parentDirectory === null) {
                    console.error('Tree component: exception of structure. Source: ', node);
                } else {
                    parentDirectory = parentDirectory.parentElement;
                }
            }
        } else if (classList.contains("queried")) {
            classList.remove("queried");
        }
        node = nodeIter.nextNode() as HTMLElement | null;
    }
});

addButton.addEventListener("click", () => {
    if (selectedNode !== null) {
        selectedNode.parentElement?.insertBefore(
            processNode(document.createElement("li"), textAdd.value),
            selectedNode.nextElementSibling).classList.add('item');
    }
});

removeButton.addEventListener("click", () => {
    if (selectedNode !== null) {
        selectedNode.parentElement?.removeChild(selectedNode);
        selectedNode = null;
    }
});
