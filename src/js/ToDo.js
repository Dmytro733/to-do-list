// let addInputelement = document.querySelector('.add-input');
class TodoList extends HTMLElement {
  constructor(){
    super();
    this.container = this;
    this.init();
  }

  init() {
    this.classes = {
      disabled: 'disabled',
      hide: 'hide',
      show: 'show',
      hideWithTranslate: 'hide-with_translate',
      hideWithScale: 'hide-with_scale',
    };

    this.elements = {
      buttonActionElement: this.container.querySelector('[data-button-action]'),
      cleanTask: this.container.querySelector('[data-action="clean"]'),
      confirmTask: this.container.querySelector('[data-action="confirm"]'),
      editTask: this.container.querySelector('[data-action="edit"]'),
      removeTask: this.container.querySelector('[data-action="remove"]'),
      upcomingListElements: this.container.querySelector('.upcoming-list'),
      finishedListElements: this.container.querySelector('.done-list'),
      newTaskWrapElement: this.container.querySelector('.new_task--wrap'),
      noTasksTitleElement: this.container.querySelector('.titles-no_tasks')
    }

    this.upcomingList = []; 
    this.doneList = [];
      
    this.actions();
    this._checkStorage();
    this.checkTaskLists();
  }

  actions(){
    this.elements.buttonActionElement.addEventListener('click', event => {
      let targetAttr = event.currentTarget.getAttribute('data-action');

      targetAttr == 'add'
      ? this.goToAction('createNewTask')
      : this.goToAction('closeNewTask');
    });
    this.elements.cleanTask.addEventListener('click', () => this.goToAction('cleanTask'));
    this.elements.newTaskWrapElement.querySelector('input').addEventListener('input', () => this.goToAction('checkingInput'));
    
    this.elements.confirmTask.addEventListener('click', () => this.goToAction('addTask'));
    // this.elements.removeTask.addEventListener('click', () => this.goToAction('removeTask'));
    // this.elements.editTask.addEventListener('click', () => this.goToAction('editTask'));
  }

  goToAction(action){
    switch (action) {
      case 'createNewTask':
        this.createNewTask();
        break;

      case 'closeNewTask':
        this.closeNewTask();
        break

      case 'cleanTask':
        this.cleanTask();
        break;

      case 'addTask':
        this.addTask();
        break;

      case 'removeTask':
        this.removeTask();
        break;

      case 'editTask':
        this.editTask();
      
      case 'checkingInput':
        this.checkingInput();
    }

    this.checkTaskLists();
  }

  createNewTask(){
    this.elements.newTaskWrapElement.classList.remove(this.classes.hideWithTranslate);
    this.elements.buttonActionElement.setAttribute('data-action', 'close');
  }

  closeNewTask(){
    this.elements.newTaskWrapElement.classList.add(this.classes.hideWithTranslate);
    this.elements.buttonActionElement.setAttribute('data-action', 'add');

    this.cleanTask();
  }

  addAttrs() {
    for(var key in attrs) {
      return element.setAttribute(key, attrs[key]);
    }
  }

  checkTaskLists(){
    this.doneList.length != 0 || this.upcomingList.length != 0 || !this.elements.newTaskWrapElement.classList.contains(this.classes.hideWithTranslate)
    ? this.elements.noTasksTitleElement.classList.add(this.classes.hideWithScale)
    : this.elements.noTasksTitleElement.classList.remove(this.classes.hideWithScale);
  }

  checkingInput() {
    this.elements.newTaskWrapElement.querySelector('input').value != ''
    ? this.elements.cleanTask.classList.remove(this.classes.hideWithScale)
    : this.elements.cleanTask.classList.add(this.classes.hideWithScale);

    this.elements.newTaskWrapElement.querySelector('input').value != ''
    ? this.elements.confirmTask.classList.remove(this.classes.hideWithScale)
    : this.elements.confirmTask.classList.add(this.classes.hideWithScale);
  }

  cleanTask(){
    this.elements.newTaskWrapElement.querySelector('input').value = '';
    this.checkingInput();
  }

  editTask() {
    
  }

  addTask() {
    let text = this.elements.newTaskWrapElement.querySelector('input').value;

    const listElement = this.createElement('upcoming', text)
    this.elements.upcomingListElements.appendChild(listElement);

    this._saveToStorage(listElement, 'saveUpcoming');
    this.cleanTask();
  }

  removeTask() {
    
  }

  createElement(list, text) {

    const listElement = new DOMParser().parseFromString(
      `<div class="item-content${list == 'upcoming' ? ' item-upcoming' : ' item-done'}">
          ${list == 'upcoming'
          ? '<i class="fas fa-solid fa-pen" data-action="edit" aria-hidden="true"></i><i class="fas fa-solid fa-check" data-action="done" aria-hidden="true"></i><i class="fas fa-solid fa-trash" data-action="remove" aria-hidden="true"></i>'
          : '<i class="fas fa-solid fa-rotate-left" data-action="edit" aria-hidden="true"></i><i class="fas fa-solid fa-trash" data-action="done" aria-hidden="true"></i>'
          }
          ${text}
        </div>
      `, 'text/html').querySelector('.item-content');

    return listElement;
  }

  _saveToStorage(listElement, whatSave) {
    if(whatSave == 'saveUpcoming'){
      this.upcomingList.push(listElement.outerText)

      localStorage.removeItem('upcoming');
      localStorage.setItem('upcoming',JSON.stringify(this.upcomingList));
    }

    if(whatSave == 'saveDone'){
      localStorage.removeItem('done');
      localStorage.setItem('done',JSON.stringify(this.doneList));
    }
  }

  _getData() {
    return [JSON.parse(localStorage.getItem('upcoming')), JSON.parse(localStorage.getItem('done'))];
  }

  _getTaskValue() {
    
  }

  _checkStorage() {
    let [upcomingList, doneList] = this._getData();

    if(upcomingList){
      for(let value = 0; value < upcomingList.length; value++){
        let element = this.createElement('upcoming', upcomingList[value])
        this.elements.upcomingListElements.appendChild(element);
        this.upcomingList.push(element.outerText)
      }
    }

    if(doneList){
      for(let value = 0; value < doneList.length; value++){
        let element = this.createElement('done', doneList[value])
        this.elements.finishedListElements.appendChild(element);
        this.doneList.push(element.outerText)
      }
    }
  }
}

customElements.define('todo-list', TodoList);


// function addAttributeToElement(element, attrs) {
//     for(var key in attrs) {
//        return element.setAttribute(key, attrs[key]);
//     }
// }

// function createList() {

// }

// function action() {

// }

// function createListItem(title){
//     var label = createElement('lable', {className: 'title'}, title);
//     var editInput = createElement('input', {className: 'textfield', type: 'text'});
//     var listItem = createElement('li', {className: 'todo-item'}, {"": "http://example.com/something.jpeg", "height": "100%"}, label);
//     var timer;

//     //Edit task when pressed dblclick
//     listItem.ondblclick = function (){    
//         this.parentNode.removeChild(this);
//         dontSaveValue(this);
//         headerTasks[1].style.display = 'block';
//         closeButton.style.display = 'none';
//         addButton.style.display = 'none';
//         addInput.style.display = 'block';
//         addInput.value = label.innerText;
//         clearTimeout(timer);
//         if(todoListUpcoming.childElementCount <= 0){
//             headerTasks[0].style.display = 'none';
//         }
//     };
//     //Adds task to list finished
//     listItem.onclick = function (){
//         timer = setTimeout(() => { 
//             this.parentNode.removeChild(this);
//             addItemToFinished(this);
//             save();
//             if(todoListUpcoming.childElementCount == 0){
//             headerTasks[0].style.display = 'none';
//             }
//         }, 300);
//     };
//     todoListUpcoming.appendChild(listItem);

//     return listItem;
// }

// function dontSaveValue(value){
//     var btn = document.querySelector('.close-btn');
//     btn.style.display = 'block';
//     btn.onclick = ()=>{
//     var listItem = createListItem(value.innerText);
//     listItem.innerText = addInput.value;
//     btn.style.display = 'none';
//     addButton.style.display = 'block';
//     addInput.style.display = 'none';
//     headerTasks[1].style.display = 'none';
//     headerTasks[0].style.display = 'block';
//     addInput.value = '';
//    };
// }


// function addItemToFinished (value){
//     headerTasks[2].style.display = 'block';
//     var listItem = createListItem(value.innerText);
//     todoListFinished.appendChild(listItem);
//     listItem.className = 'todo-item-finished';

//     //Adds back task to list upcoming 
//     listItem.onclick = function() {
//         backToUpcoming (this);
//         this.parentNode.removeChild(this);
//         save();
//         if(todoListFinished.childElementCount == 0){
//             headerTasks[2].style.display = 'none';
//         }
//     };
// }
// function backToUpcoming(value){
//     createListItem(value.innerText);
//     headerTasks[0].style.display = 'block';
// }

// function hideNoTask(){
//     if(headerTasks){
//         noTasks.style.display = 'none';
//     }else{
//         noTasks.style.display = 'block';
//     }
// }

// function addTodoItem (event){
//     event.preventDefault();
//     if(addInput.value === '')return alert('Необхідно заповнити поле');
//     createListItem(addInput.value);
//     addInput.value = '';
//     addInput.style.display = 'none';
//     closeButton.style.display = 'none';
//     addButton.style.display = 'block';
//     btn.style.display = 'none';
//     headerTasks[1].style.display = 'none';
//     headerTasks[0].style.display = 'block';
//     save();
// }

// addButton.addEventListener('click', function(){
//     this.style.display = 'none';
//     closeButton.style.display = 'block';
//     addInput.style.display = 'block';
//     headerTasks[1].style.display = 'block';
//     hideNoTask();
// });

// closeButton.addEventListener('click', function(){
//     this.style.display = 'none';
//     addButton.style.display = 'block';
//     addInput.style.display = 'none';
//     addInput.value = '';
//     headerTasks[1].style.display = 'none';
//     hideNoTask();
// });


// function save(){
    
//     var todoListUpcomingArr = [];
//     for(var i = 0; i < todoListUpcoming.children.length; i++){
//         todoListUpcomingArr.push(todoListUpcoming.children[i].innerText);
//     }
    
//     var todoListFinishedArr = [];
//     for(var i = 0; i < todoListFinished.children.length; i++){
//         todoListFinishedArr.push(todoListFinished.children[i].innerText);
//     }
//     localStorage.removeItem('todo');
//     localStorage.setItem('todo',JSON.stringify({todoListUpcoming: todoListUpcomingArr, 
//     todoListFinished: todoListFinishedArr}));
// }
// function load (){
//     hideNoTask();
//     return JSON.parse(localStorage.getItem('todo'));
// }
// var date = load();

// for(var i = 0; i < date.todoListUpcoming.length; i++){
//     let listItem = createListItem(date.todoListUpcoming[i]);
//     todoListUpcoming.appendChild(listItem);
//     headerTasks[0].style.display = 'block';
//     hideNoTask(); 
// }

// for(var i = 0; i < date.todoListFinished.length; i++){
//     let listItem = createListItem(date.todoListFinished[i]);
//     todoListFinished.appendChild(listItem);
//     listItem.className = 'todo-item-finished';
//     headerTasks[2].style.display = 'block';
//     hideNoTask(); 
//     backToUpcoming();
// }


