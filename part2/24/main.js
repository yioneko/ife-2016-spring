const root = document.querySelector('.tree-wrapper');
const frontTraverseButton = document.querySelector('.front-traversal');
const backTraverseButton = document.querySelector('.back-traversal');
const textQuery = document.querySelector('.query input');
const queryButton = document.querySelector('.query button');
const textAdd = document.querySelector('.add-remove input');
const addButton = document.querySelector('.add-button');
const removeButton = document.querySelector('.remove-button');
const buttons = document.querySelectorAll('.operations button');
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
    node.innerHTML = text;
    node.addEventListener("click", function (e) {
        e.stopPropagation();
        if (selectedNode !== null)
            selectedNode.classList.remove("selected");
        this.classList.add("selected");
        selectedNode = this;
    });
    return node;
}
function buildTree(depth, curNode) {
    if (depth === 0) {
        return;
    }
    const childCounts = Math.ceil(Math.random() * maxChildNodes);
    for (let i = 0; i < childCounts; i++) {
        const childNode = document.createElement('div');
        processNode(childNode, randomText());
        buildTree(depth - 1, childNode);
        curNode.appendChild(childNode);
    }
}
buildTree(3, root);
const frontTraverseOrder = [];
const backTraverseOrder = [];
function frontTraverse(curNode) {
    frontTraverseOrder.push(curNode);
    for (const childNode of curNode.children) {
        frontTraverse(childNode);
    }
}
function backTraverse(curNode) {
    for (const childNode of curNode.children) {
        backTraverse(childNode);
    }
    backTraverseOrder.push(curNode);
}
function traverse(traverseOrder) {
    return () => {
        let lstTime = 0, curTraverseIndex = 0;
        if (traverseOrder === frontTraverseOrder) {
            frontTraverse(root);
        }
        else {
            backTraverse(root);
        }
        for (const button of buttons) {
            button.setAttribute("disabled", "");
        }
        function traverseAnim(timestamp) {
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
    };
}
frontTraverseButton.addEventListener("click", traverse(frontTraverseOrder));
backTraverseButton.addEventListener("click", traverse(backTraverseOrder));
queryButton.addEventListener("click", () => {
    const text = textQuery.value;
    const nodeIter = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);
    let node = nodeIter.nextNode();
    while (node !== null) {
        const classList = node.classList;
        if (node.innerHTML === text) {
            classList.add("queried");
        }
        else if (classList.contains("queried")) {
            classList.remove("queried");
        }
        node = nodeIter.nextNode();
    }
});
addButton.addEventListener("click", () => {
    if (selectedNode !== null) {
        selectedNode.parentElement.insertBefore(processNode(document.createElement("div"), textAdd.value), selectedNode.nextElementSibling);
    }
});
removeButton.addEventListener("click", () => {
    if (selectedNode !== null) {
        selectedNode.parentElement.removeChild(selectedNode);
        selectedNode = null;
    }
});
export {};
//# sourceMappingURL=main.js.map