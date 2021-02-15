const root = document.querySelector('.tree-wrapper');
const frontTraverseButton = document.querySelector('.front-traversal');
const backTraverseButton = document.querySelector('.back-traversal');
const textQuery = document.querySelector('input');
const queryButton = document.querySelector('.query');
const leafNodes = [];
const maxChildNodes = 5, maxTextChars = 5;
function randomText() {
    let ret = "";
    const charCount = Math.ceil(Math.random() * maxTextChars);
    for (let i = 0; i < charCount; i++) {
        ret += [String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0)),
            String.fromCharCode(Math.floor(Math.random() * 26) + "A".charCodeAt(0))][Math.floor(Math.random() + 0.5)];
    }
    return ret;
}
function buildTree(depth, curNode) {
    if (depth === 0) {
        curNode.innerHTML = randomText();
        leafNodes.push(curNode);
        return;
    }
    const childCounts = Math.ceil(Math.random() * maxChildNodes);
    for (let i = 0; i < childCounts; i++) {
        const childNode = document.createElement('div');
        buildTree(depth - 1, childNode);
        curNode.appendChild(childNode);
    }
}
buildTree(3, root);
const frontTraverseOrder = [];
const backTraverseOrder = [];
(function frontTraverse(curNode) {
    frontTraverseOrder.push(curNode);
    for (const childNode of curNode.children) {
        frontTraverse(childNode);
    }
})(root);
(function backTraverse(curNode) {
    for (const childNode of curNode.children) {
        backTraverse(childNode);
    }
    backTraverseOrder.push(curNode);
})(root);
function traverse(traverseOrder) {
    const buttons = [frontTraverseButton, backTraverseButton];
    return () => {
        let lstTime = 0, curTraverseIndex = 0;
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
    for (const leafNode of leafNodes) {
        const classList = leafNode.classList;
        if (leafNode.innerHTML === text) {
            classList.add("queried");
        }
        else if (classList.contains("queried")) {
            classList.remove("queried");
        }
    }
});
export {};
//# sourceMappingURL=main.js.map