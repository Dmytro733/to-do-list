function createElement(tag, props, ...children){
    const element = document.createElement(tag);

    Object.keys(props).forEach(key => element[key]=props[key]);

    if(children.length > 0){
        children.forEach(child => {
            if(typeof child === 'string'){
                child = document.createTextNode(child);
            }

            element.appendChild(child);
        });
    }

    return element;
}

function createTodoItem(title){
    const label = createElement('lable', {className: 'title'}, title);
    const editInput = createElement('input', {className: 'textfield', type: 'text'});
    const listItem = createElement('li', {className: 'todo-item'}, label, editInput);
    
    todoListUpcoming.appendChild(listItem);

    return listItem;
}

function addTodoItem (event){
    event.preventDefault();
    
    if(addInput.value === '')return alert('Необхідно заповнити поле');
    
    const listItem = createTodoItem(addInput.value);
    addInput.value = '';
    addInput.style.display = 'none';
    closeButton.style.display = 'none';
    addButton.style.display = 'block';
    headerTasks[1].style.display = 'none';
    headerTasks[0].style.display = 'block';
    listItem.onclick = function({target}){
        addItemToFinished (target);
        this.parentNode.removeChild(this);
        if(todoListUpcoming.childElementCount == 0){
            headerTasks[0].style.display = 'none';
        }
    };
}

function addItemToFinished (value){
    const listItem = createTodoItem(value.innerText);
    todoListFinished.appendChild(listItem);
    listItem.className = 'todo-item-finished';
    headerTasks[2].style.display = 'block'; 
    listItem.onclick = function({target}){
        backToUpcoming (target);
        this.parentNode.removeChild(this);
        if(todoListFinished.childElementCount == 0){
            headerTasks[2].style.display = 'none';
        }
    };
}

function backToUpcoming(value){
    createTodoItem(value.innerText);
    headerTasks[0].style.display = 'block';
}

function hideNoTask(){
    if(headerTasks[0].style.display == 'block') {
        noTasks.style.display = 'none';
    }else if(headerTasks[2].style.display == 'block'){
        noTasks.style.display = 'none';
    }else if(headerTasks[1].style.display == 'block'){
        noTasks.style.display = 'none';
    }else{
        noTasks.style.display = 'block';
    }
}

const todoForm = document.querySelector('#todo-form');
const addInput = document.querySelector('#add-input');
const closeButton = document.querySelector('.close-button');
const addButton = document.querySelector('.add-button');
const todoListUpcoming = document.querySelector('.todo-list-Upcoming');
const todoListFinished = document.querySelector('.todo-list-Finished');
const todoItems = document.querySelectorAll('.todo-item');
const headerTasks = document.querySelectorAll('span');
const noTasks = document.querySelector('h1');


todoForm.addEventListener('submit', addTodoItem);

addButton.addEventListener('click', function(){
    this.style.display = 'none';
    closeButton.style.display = 'block';
    addInput.style.display = 'block';
    headerTasks[1].style.display = 'block';
    hideNoTask();
});

closeButton.addEventListener('click', function(){
    this.style.display = 'none';
    addButton.style.display = 'block';
    addInput.style.display = 'none';
    addInput.value = '';
    headerTasks[1].style.display = 'none';
    hideNoTask();
});


