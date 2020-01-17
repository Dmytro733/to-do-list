window.onload = function(){
    var btnadd = document.querySelector('.btn-add'),
        btnclose = document.querySelector('.btn-close'),
        tasks = document.querySelector('.task'),
        list = document.querySelector('.list'),
        finish = document.querySelector('.finished'),
        span = document.querySelectorAll('span'),
        h1 = document.querySelector('h1');



    btnadd.addEventListener('click', function(){
        this.style.display = 'none';
        btnclose.style.display = 'block';
        span[1].style.display = 'block';
        h1.style.display = 'none';
        var input = document.createElement('input');
        tasks.appendChild(input);
        (function (){
            input.addEventListener('keydown', function(e){
                if(e.keyCode === 13){
                    var li = document.createElement('li');
                    li.innerText = this.value;
                    list.appendChild(li);
                    input.style.display = 'none';
                    btnclose.style.display = 'none';
                    btnadd.style.display = 'block';
                    span[1].style.display = 'none';
                    span[0].style.display = 'block';

                   let clickCount = 0;  
                                   
        
                    li.addEventListener('click', function(e){
                        clickCount++;
                        if (clickCount === 1) {
                            singleClickTimer = setTimeout(() => {
                                clickCount = 0;
                                addToFinish(e.target);
                                this.parentNode.removeChild(this);
                            }, 400);
                        } else if (clickCount === 2) {
                            clearTimeout(singleClickTimer);
                            clickCount = 0;
                            Edit(e.target);
                            this.parentNode.removeChild(this);
                        }
                    });
                }
            });
        })();
    });

    function addToFinish(value){
        var li = document.createElement('li');
        finish.appendChild(li);
        li.style.textDecoration = 'line-through';
        li.innerText = value.innerText;
        span[2].style.display = 'block';
        li.onclick = function (e){
            addToUpcoming(e.target);
            this.parentNode.removeChild(this);      
        };

    }

    function addToUpcoming (value){
        var li = document.createElement('li');
        list.appendChild(li);
        li.style.textDecoration = 'none';
        li.innerText = value.innerText;

        let clickCount = 0;  
                                   
        li.addEventListener('click', function(e){
            clickCount++;
            if (clickCount === 1) {
                singleClickTimer = setTimeout(() => {
                    clickCount = 0;
                    addToFinish(e.target);
                    this.parentNode.removeChild(this);
                }, 400);
            } else if (clickCount === 2) {
                clearTimeout(singleClickTimer);
                clickCount = 0;
                Edit(e.target);
                this.parentNode.removeChild(this);
            }
        });
        
    }

    function Edit(value){
        var input_li = document.createElement('input');
        list.appendChild(input_li);
        input_li.value = value.innerText;
        btnadd.style.display = 'none';
        btnclose.style.display = 'block';
        
        input_li.addEventListener('keydown', function(e){
            if(e.keyCode === 13){
                var li = document.createElement('li');
                li.innerText = this.value;
                list.appendChild(li);
                list.removeChild(input_li);

                let clickCount = 0;                    
        
                li.addEventListener('click', function(e){
                    clickCount++;
                    if (clickCount === 1) {
                     
                        singleClickTimer = setTimeout(() => {
                            clickCount = 0;
                            addToFinish(e.target);
                            this.parentNode.removeChild(this);
                        }, 400);
                    } else if (clickCount === 2) {
                        
                        clearTimeout(singleClickTimer);
                        clickCount = 0;
                        Edit(e.target);
                        this.parentNode.removeChild(this);
                    }
                });  
            }
        });
    }
    
    btnclose.addEventListener('click', function(){
        this.style.display = 'none';
        btnadd.style.display = 'block';
        input = document.querySelector('input');
        tasks.removeChild(input);
        span[1].style.display = 'none';
        h1.style.display = 'block';
        if (span[0].style.display == 'block') {
            h1.style.display = 'none';
        }
    });
};






