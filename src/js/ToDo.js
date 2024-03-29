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
      createNewTask: '[data-action="create"]',
      upcomingList: '.upcoming-list',
      finishedList: '.done-list',
      newTaskWrap: '.new_task--wrap',
      noTasksTitle: '.titles-no_tasks',
      lineItem: '.item-content'
    }

    this.elements = {
      buttonActionEl: this.container.querySelector(this.selectors.buttonAction),
      cleanInputEl: this.container.querySelector(this.selectors.cleanInput),
      createNewTaskEl: this.container.querySelector(this.selectors.createNewTask),
      upcomingListEl: this.container.querySelector(this.selectors.upcomingList),
      finishedListEl: this.container.querySelector(this.selectors.finishedList),
      newTaskWrapEl: this.container.querySelector(this.selectors.newTaskWrap),
      noTasksTitleEl: this.container.querySelector(this.selectors.noTasksTitle)
    }

    this.upcomingList = []; 
    this.doneList = [];
      
    this._checkStorage();
    this.goToAction.checkTaskLists();
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
    
    this.elements.createNewTaskEl.addEventListener('click', () => {
      this.elements.newTaskWrapEl.querySelector('input').hasAttribute('data-item-editing-index')
      ? this.goToAction.createTasksList('task:edited')
      : this.goToAction.createTasksList('task:new')
    });

    document.addEventListener('task:edited', event => {
      this.upcomingList.push(event.detail.value);
      this.upcomingList.splice(event.detail.item_edited_index, 1);
      this.cleanInput();
    })

    window.addEventListener('keyup', event => {
      if(event.keyCode == 13 && this.elements.newTaskWrapEl.querySelector('input').value != ''){
        this.goToAction.createTasksList('create:new')
      }
    })

    this.elements.upcomingListEl.addEventListener('click', event => {
      let targetElement = event.target.nodeName;
      let targetAttr = event.target.getAttribute('data-action');

      if(targetElement == 'I'){
        if(targetAttr == 'confirm') this.goToAction.createTasksList('moveTo:done', event);
        if(targetAttr == 'remove') this.goToAction.removeTask('upcoming', event);
        if(targetAttr == 'edit') this.goToAction.editTask(event);
      }
    });

    this.elements.finishedListEl.addEventListener('click', event => {
      let targetElement = event.target.nodeName;
      let targetAttr = event.target.getAttribute('data-action');

      if(targetElement == 'I'){
        if(targetAttr == 'return') this.goToAction.createTasksList('moveTo:upcoming', event);
        if(targetAttr == 'remove') this.goToAction.removeTask('done', event);
      }
    });

    this.goToAction.checkTaskLists()
  }

  goToAction = {
    createNewTask: this.createNewTask.bind(this),
    closeNewTask: this.closeNewTask.bind(this),
    cleanInput: this.cleanInput.bind(this),
    createTasksList: this.createTasksList.bind(this),
    editTask: this.editTask.bind(this),
    checkingInput: this.checkingInput.bind(this),
    checkTaskLists: this.checkTaskLists.bind(this),
    removeTask: this.removeTask.bind(this)
  }

  createNewTask(){
    this.elements.newTaskWrapEl.classList.remove(this.classes.hideWithTranslate);
    this.elements.buttonActionEl.setAttribute('data-action', 'close');
  }

  closeNewTask(){
    this.elements.newTaskWrapEl.classList.add(this.classes.hideWithTranslate);
    this.elements.buttonActionEl.setAttribute('data-action', 'add');

    this.container.querySelectorAll(`${this.selectors.lineItem}.item-upcoming`).forEach(item => {
      item.classList.remove('editing');
    });

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
    ? this.elements.createNewTaskEl.classList.remove(this.classes.hideWithScale)
    : this.elements.createNewTaskEl.classList.add(this.classes.hideWithScale);
  }

  cleanInput(){
    this.elements.newTaskWrapEl.querySelector('input').value = '';
    this.checkingInput();
  }

  editTask(event) {
    this.container.querySelectorAll(`${this.selectors.lineItem}.item-upcoming`).forEach(item => {
      item.classList.remove('editing');
    });

    let lineItem = event.target.closest('.item-content');
    let lineItemIndex = lineItem.getAttribute('line-item-index');

    lineItem.classList.add('editing');

    if(this.elements.buttonActionEl.getAttribute('data-action') == 'add'){
      this.goToAction.createNewTask();
    }
    
    this.elements.newTaskWrapEl.querySelector('input').setAttribute('data-item-editing-index', lineItemIndex);
    this.elements.newTaskWrapEl.querySelector('input').value = lineItem.innerText;

    this.checkingInput();
  }

  removeTask(removeFrom, event) {
    let lineItem = event.target.closest('.item-content');
    let lineItemIndex = lineItem.getAttribute('line-item-index');

    removeFrom === 'upcoming'
    ? this.upcomingList.splice(lineItemIndex, 1)
    : this.doneList.splice(lineItemIndex, 1);
    
    this._saveToStorage();
  }

  createTasksList(action, event) {
    if(action === 'task:new'){
      let text = this.elements.newTaskWrapEl.querySelector('input').value;
      this.upcomingList.push(text)
      this.cleanInput();
    }

    if(action === 'task:edited'){
      document.dispatchEvent(new CustomEvent('task:edited', {
        detail: {
          value: this.elements.newTaskWrapEl.querySelector('input').value,
          item_edited_index: this.elements.newTaskWrapEl.querySelector('input').getAttribute('data-item-editing-index')
        }
      }));
    }

    if(action === 'moveTo:upcoming') {
      let lineItem = event.target.closest('.item-content');
      let lineItemIndex = lineItem.getAttribute('line-item-index');
      
      this.doneList.splice(lineItemIndex, 1);
      this.upcomingList.push(lineItem.innerText)
    }
    
    if(action === 'moveTo:done'){
      let lineItem = event.target.closest('.item-content');
      let lineItemIndex = lineItem.getAttribute('line-item-index');
      
      this.upcomingList.splice(lineItemIndex, 1);
      this.doneList.push(lineItem.innerText)
    }

    this._saveToStorage();
  }

  createElement(list, text, index) {

    const listElement = new DOMParser().parseFromString(
      `<div class="item-content${list == 'upcoming' ? ' item-upcoming' : ' item-done'}" ${index != 'blank' ? `line-item-index=${index}` : ''}>
          ${list == 'upcoming'
          ? '<i class="fas fa-solid fa-pen" data-action="edit" aria-hidden="true"></i><i class="fas fa-solid fa-check" data-action="confirm" aria-hidden="true"></i><i class="fas fa-solid fa-trash" data-action="remove" aria-hidden="true"></i>'
          : '<i class="fas fa-solid fa-undo" data-action="return" aria-hidden="true"></i><i class="fas fa-solid fa-trash" data-action="remove" aria-hidden="true"></i>'
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


