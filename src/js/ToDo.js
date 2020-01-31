window.onload = function(){
    function createElement(tag, props, ...children){
        var element = document.createElement(tag);
    
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
        var label = createElement('lable', {className: 'title'}, title);
        var editInput = createElement('input', {className: 'textfield', type: 'text'});
        var listItem = createElement('li', {className: 'todo-item'}, label, editInput);
        var timer;
    
        //Edit task when pressed dblclick
        listItem.ondblclick = function (){    
            this.parentNode.removeChild(this);
            dontSaveValue(this);
            headerTasks[1].style.display = 'block';
            closeButton.style.display = 'none';
            addButton.style.display = 'none';
            addInput.style.display = 'block';
            addInput.value = label.innerText;
            clearTimeout(timer);
            if(todoListUpcoming.childElementCount <= 0){
                headerTasks[0].style.display = 'none';
            }
        };
        //Adds task to list finished
        listItem.onclick = function (){
            timer = setTimeout(() => { 
                this.parentNode.removeChild(this);
                addItemToFinished (this);
                if(todoListUpcoming.childElementCount == 0){
                headerTasks[0].style.display = 'none';
                }
            }, 300);
        };
        todoListUpcoming.insertBefore(listItem, todoListUpcoming.childNodes[0]);
        return listItem;
    }

    function dontSaveValue(value){
       var btn = document.querySelector('.close-btn');
       btn.style.display = 'block';
       btn.onclick = ()=>{
        var listItem = createTodoItem(value.innerText);
        listItem.innerText = addInput.value;
        btn.style.display = 'none';
        addButton.style.display = 'block';
        addInput.style.display = 'none';
        headerTasks[1].style.display = 'none';
        headerTasks[0].style.display = 'block';
        addInput.value = '';
       };
    }
    
    
    function addItemToFinished (value){
        headerTasks[2].style.display = 'block';
        var listItem = createTodoItem(value.innerText);
        todoListFinished.appendChild(listItem);
        listItem.className = 'todo-item-finished';

        //Adds back task to list upcoming 
        listItem.onclick = function (){
            backToUpcoming (this);
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
    
    var todoForm = document.querySelector('.todo-form');
    var addInput = document.querySelector('.add-input');
    var closeButton = document.querySelector('.close-button');
    var addButton = document.querySelector('.add-button');
    var todoListUpcoming = document.querySelector('.todo-list-Upcoming');
    var todoListFinished = document.querySelector('.todo-list-Finished');
    var headerTasks = document.querySelectorAll('span');
    var noTasks = document.querySelector('h1');
    var btn = document.querySelector('.close-btn');
    
    todoForm.addEventListener('submit', addTodoItem);

    //Creating new task
    function addTodoItem (event){
        event.preventDefault();
        if(addInput.value === '')return alert('Необхідно заповнити поле');
        createTodoItem(addInput.value);
        addInput.value = '';
        addInput.style.display = 'none';
        closeButton.style.display = 'none';
        addButton.style.display = 'block';
        btn.style.display = 'none';
        headerTasks[1].style.display = 'none';
        headerTasks[0].style.display = 'block';
    }
    
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
    
};



