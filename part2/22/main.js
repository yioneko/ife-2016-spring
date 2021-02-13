"use strict";
const root = document.querySelector('.tree-wrapper');
const buttons = document.querySelectorAll("button");
function buildTree(curNode, dep) {
    if (dep === 0) {
        return;
    }
    const lChild = document.createElement('div');
    lChild.className = "lChild";
    const rChild = document.createElement('div');
    rChild.className = "rChild";
    buildTree(lChild, dep - 1);
    buildTree(rChild, dep - 1);
    curNode.appendChild(lChild);
    curNode.appendChild(rChild);
}
buildTree(root, 3);
const frontTraverseOrder = [];
const backTraverseOrder = [];
const middleTraverseOrder = [];
(function frontTraverse(curNode) {
    console.log(curNode);
    if (curNode != null) {
        frontTraverseOrder.push(curNode);
        frontTraverse(curNode.firstChild);
        frontTraverse(curNode.lastChild);
    }
})(root);
(function backTraverse(curNode) {
    if (curNode != null) {
        backTraverse(curNode.firstChild);
        backTraverse(curNode.lastChild);
        backTraverseOrder.push(curNode);
    }
})(root);
(function middleTraverse(curNode) {
    if (curNode != null) {
        middleTraverse(curNode.firstChild);
        middleTraverseOrder.push(curNode);
        middleTraverse(curNode.lastChild);
    }
})(root);
function traverse(traverseOrder) {
    return function () {
        buttons.forEach((value) => {
            value.setAttribute("disabled", "");
        });
        let curNodeIndex = 0, lstTime = 0;
        function traverseAnim(timestamp) {
            if (lstTime === 0 || timestamp - lstTime >= 500) {
                lstTime = timestamp;
                if (curNodeIndex > 0) {
                    traverseOrder[curNodeIndex - 1].style.removeProperty("background-color");
                }
                if (curNodeIndex === traverseOrder.length) {
                    buttons.forEach((value) => {
                        value.removeAttribute('disabled');
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
            value.addEventListener('click', traverse(frontTraverseOrder));
            break;
        case "back-traversal":
            value.addEventListener('click', traverse(backTraverseOrder));
            break;
        case "middle-traversal":
            value.addEventListener('click', traverse(middleTraverseOrder));
            break;
        default:
            break;
    }
});
//# sourceMappingURL=main.js.map