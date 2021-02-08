const queue1 = document.querySelector('.tag-1 .queue');
const queue2 = document.querySelector('.tag-2 .queue');

function addTag(queue, tag) {
    function checkDuplicate() {
        for (const child of queue.childNodes) {
            if (child.textContent === tag) {
                return true;
            }
        }
        return false;
    }
    if (tag === "" || checkDuplicate()) return;
    const item = document.createElement('li');
    item.textContent = tag;
    item.addEventListener('click', function() {
        queue.removeChild(item);
    })
    if (queue.childElementCount >= 10) {
        queue.removeChild(queue.firstChild);
    }
    queue.appendChild(item);
}

document.querySelector('.tag-1 input').addEventListener('keyup', function(e) {
    let text = this.value;
    let f = text[text.length - 1].match(/[\s,，\r]/);
    if (e.keyCode === 13 || f) {
        this.value = null;
        if (f) text = text.substring(0, text.length - 1);
        addTag(queue1, text);
    }
})

document.querySelector('.tag-2 button').addEventListener('click', function() {
    const tagInput = document.querySelector('.tag-2 textarea');
    tagInput.value.split(/[\s,，、\r]+/).forEach((value) => {
        addTag(queue2, value);
    })
})