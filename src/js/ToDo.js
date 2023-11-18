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

    this.selectors = {
      removeTask: '[data-action="remove"]',
      editTask: '[data-action="edit"]',
      buttonAction: '[data-button-action]',
      cleanInput: '[data-action="clean"]',
      confirmTask: '[data-action="confirm"]',
      upcomingList: '.upcoming-list',
      finishedList: '.done-list',
      newTaskWrap: '.new_task--wrap',
      noTasksTitle: '.titles-no_tasks'
    }

    this.elements = {
      buttonActionEl: this.container.querySelector(this.selectors.buttonAction),
      cleanInputEl: this.container.querySelector(this.selectors.cleanInput),
      confirmTaskEl: this.container.querySelector(this.selectors.confirmTask),
      upcomingListEl: this.container.querySelector(this.selectors.upcomingList),
      finishedListEl: this.container.querySelector(this.selectors.finishedList),
      newTaskWrapEl: this.container.querySelector(this.selectors.newTaskWrap),
      noTasksTitleEl: this.container.querySelector(this.selectors.noTasksTitle)
    }

    this.upcomingList = []; 
    this.doneList = [];
      
    this._checkStorage();
    this.checkTaskLists();
    this.actions();
  }

  actions(){
    this.elements.buttonActionEl.addEventListener('click', event => {
      let targetAttr = event.currentTarget.getAttribute('data-action');
      targetAttr == 'add'
      ? this.goToAction.createNewTask()
      : this.goToAction.closeNewTask();
    });
    this.elements.cleanInputEl.addEventListener('click', () => this.goToAction.cleanInput());
    this.elements.newTaskWrapEl.querySelector('input').addEventListener('input', () => this.goToAction.checkingInput());
    
    this.elements.confirmTaskEl.addEventListener('click', () => this.goToAction.createTasksList('upcoming'));
    this.elements.upcomingListEl.addEventListener('click', event => {
      let targetElement = event.target.nodeName;
      let targetAttr = event.target.getAttribute('data-action');

      if(targetElement == 'I'){
        if(targetAttr == 'done') this.goToAction.createTasksList('done', event)
      }
    });
    // this.elements.editTask.addEventListener('click', () => this.goToAction('editTask'));

    this.goToAction.checkTaskLists()
  }

  goToAction = {
    createNewTask: this.createNewTask.bind(this),
    closeNewTask: this.closeNewTask.bind(this),
    cleanInput: this.cleanInput.bind(this),
    createTasksList: this.createTasksList.bind(this),
    editTask: this.editTask.bind(this),
    checkingInput: this.checkingInput.bind(this),
    checkTaskLists: this.checkTaskLists.bind(this)
  }

  createNewTask(){
    this.elements.newTaskWrapEl.classList.remove(this.classes.hideWithTranslate);
    this.elements.buttonActionEl.setAttribute('data-action', 'close');
  }

  closeNewTask(){
    this.elements.newTaskWrapEl.classList.add(this.classes.hideWithTranslate);
    this.elements.buttonActionEl.setAttribute('data-action', 'add');

    this.cleanInput();
  }

  addAttrs() {
    for(var key in attrs) {
      return element.setAttribute(key, attrs[key]);
    }
  }

  checkTaskLists(){
    this.doneList.length != 0 || this.upcomingList.length != 0 || !this.elements.newTaskWrapEl.classList.contains(this.classes.hideWithTranslate)
    ? this.elements.noTasksTitleEl.classList.add(this.classes.hideWithScale)
    : this.elements.noTasksTitleEl.classList.remove(this.classes.hideWithScale);
  }

  checkingInput() {
    this.elements.newTaskWrapEl.querySelector('input').value != ''
    ? this.elements.cleanInputEl.classList.remove(this.classes.hideWithScale)
    : this.elements.cleanInputEl.classList.add(this.classes.hideWithScale);

    this.elements.newTaskWrapEl.querySelector('input').value != ''
    ? this.elements.confirmTaskEl.classList.remove(this.classes.hideWithScale)
    : this.elements.confirmTaskEl.classList.add(this.classes.hideWithScale);
  }

  cleanInput(){
    this.elements.newTaskWrapEl.querySelector('input').value = '';
    this.checkingInput();
  }

  editTask() {
    
  }

  removeTask() {

  }

  createTasksList(list, event) {
    if(list === 'upcoming') {
      let text = this.elements.newTaskWrapEl.querySelector('input').value;
      this.upcomingList.push(text)
      this.cleanInput();
    }
    
    if(list === 'done'){
      let lineItem = event.target.closest('.item-content');
      let lineItemIndex = lineItem.getAttribute('line-item-index');
      let text = lineItem.innerText;
      
      this.upcomingList.splice(lineItemIndex, 1);
      this.doneList.push(text)
    }

    this._saveToStorage();
  }

  createElement(list, text, index) {

    const listElement = new DOMParser().parseFromString(
      `<div class="item-content${list == 'upcoming' ? ' item-upcoming' : ' item-done'}" ${index != 'blank' ? `line-item-index=${index}` : ''}>
          ${list == 'upcoming'
          ? '<i class="fas fa-solid fa-pen" data-action="edit" aria-hidden="true"></i><i class="fas fa-solid fa-check" data-action="done" aria-hidden="true"></i><i class="fas fa-solid fa-trash" data-action="remove" aria-hidden="true"></i>'
          : '<i class="fas fa-solid fa-rotate-left" data-action="edit" aria-hidden="true"></i><i class="fas fa-solid fa-trash" data-action="done" aria-hidden="true"></i>'
          }
          ${text}
        </div>
      `, 'text/html').querySelector('.item-content');

    return listElement;
  }

  _saveToStorage() {
    localStorage.removeItem('upcoming');
    localStorage.removeItem('done');

    if(this.upcomingList.length != 0){
      localStorage.setItem('upcoming', JSON.stringify(this.upcomingList));
    }
    
    if(this.doneList.length != 0){
      localStorage.setItem('done', JSON.stringify(this.doneList));
    }

    this._renderHTML();
  }

  _getData() {
    return [JSON.parse(localStorage.getItem('upcoming')), JSON.parse(localStorage.getItem('done'))];
  }

  _getTaskValue() {
    
  }

  _renderHTML() {
    let [upcomingList, doneList] = this._getData();
    this.elements.upcomingListEl.innerHTML = '';
    this.elements.finishedListEl.innerHTML = '';

    if(upcomingList && upcomingList.length != 0){
      for(let index = 0; index < upcomingList.length; index++){
        let element = this.createElement('upcoming', upcomingList[index], index)
        this.elements.upcomingListEl.appendChild(element);
      }
    }

    if(doneList && doneList.length != 0){
      for(let index = 0; index < doneList.length; index++){
        let element = this.createElement('done', doneList[index], index)
        this.elements.finishedListEl.appendChild(element);
      }
    }
  }

  _checkStorage() {
    let [upcomingList, doneList] = this._getData();

    if(upcomingList && upcomingList.length != 0){
      for(let index = 0; index < upcomingList.length; index++){
        let element = this.createElement('upcoming', upcomingList[index], index)
        this.elements.upcomingListEl.appendChild(element);
        this.upcomingList.push(element.outerText)
      }
    }

    if(doneList && doneList.length != 0){
      for(let index = 0; index < doneList.length; index++){
        let element = this.createElement('done', doneList[index], index)
        this.elements.finishedListEl.appendChild(element);
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


