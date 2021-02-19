const root = document.querySelector('.tree-component');
const textQuery = document.querySelector('.query input');
const queryButton = document.querySelector('.query button');
const textAdd = document.querySelector('.operations input');
const addButton = document.querySelector('.add-button');
const removeButton = document.querySelector('.remove-button');
const maxChildNodes = 5, maxTextChars = 5;
let selectedNode = null;
function randomText() {
    let ret = "";
    const charCount = Math.ceil(Math.random() * maxTextChars);
    for (let i = 0; i < charCount; i++) {
        ret += [String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0)),
            String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))][Math.floor(Math.random() + 0.5)];
    }
    return ret;
}
function processNode(node, text) {
    const nameElement = document.createElement('div');
    nameElement.className = 'name';
    nameElement.innerHTML = text;
    node.appendChild(nameElement);
    node.addEventListener("click", function (e) {
        e.stopPropagation();
        if (selectedNode !== null)
            selectedNode.classList.remove("selected");
        this.classList.add("selected");
        selectedNode = this;
    });
    node.addEventListener("click", function (e) {
        e.stopPropagation();
        if (this.classList.contains("collapsed")) {
            this.classList.remove("collapsed");
        }
        else {
            this.classList.add("collapsed");
        }
    });
    return node;
}
function buildTree(depth, curNode) {
    const childCounts = Math.ceil(Math.random() * maxChildNodes);
    for (let i = 0; i < childCounts; i++) {
        const childNode = document.createElement('li');
        processNode(childNode, randomText());
        if (depth > 1 && Math.random() > 0.2) {
            childNode.classList.add("directory");
            childNode.appendChild(buildTree(depth - 1, document.createElement("ol")));
        }
        else {
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
        acceptNode: (node) => {
            if (node.classList.contains('name'))
                return NodeFilter.FILTER_ACCEPT;
            else
                return NodeFilter.FILTER_REJECT;
        }
    });
    let node = nodeIter.nextNode();
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
                }
                else {
                    parentDirectory = parentDirectory.parentElement;
                }
            }
        }
        else if (classList.contains("queried")) {
            classList.remove("queried");
        }
        node = nodeIter.nextNode();
    }
});
addButton.addEventListener("click", () => {
    var _a;
    if (selectedNode !== null) {
        (_a = selectedNode.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(processNode(document.createElement("li"), textAdd.value), selectedNode.nextElementSibling).classList.add('item');
    }
});
removeButton.addEventListener("click", () => {
    var _a;
    if (selectedNode !== null) {
        (_a = selectedNode.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(selectedNode);
        selectedNode = null;
    }
});
export {};
//# sourceMappingURL=main.js.map