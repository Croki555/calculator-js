const input = document.querySelector('.calc__input');
const output = document.querySelector('.calc__output');
const sign = document.querySelectorAll('.calc__btn-oper');
const numb = document.querySelectorAll('.calc__btn-num');
const reset = document.querySelector('.calc__reset');
const list = document.querySelector('.calc__list');
const btns = document.querySelector('.buttons');
const modal = document.querySelector('.modal');
const title = document.querySelector('.modal__title');
const body = document.querySelector('.body');
let mass = [];

input.readOnly = true;

btns.addEventListener('click', (ev) => {
    //Цифры
    let numbers = 'calc__btn-num';

    if(ev.target.className == numbers) {

        input.value += ev.target.value;
        let lastLi = list.children[list.children.length - 1];
        let str = lastLi.textContent.replace(/\s+/g, '');
        let lastS = str.length -1;
    
        if (str[lastS] == '/') {
            if(ev.target.value == 0 ) {
                input.value = '';
            } 
        } 
    }
    //Знаки( +, -, /, *, =)
    let signs = 'calc__btn-oper';
    if(ev.target.className == signs) {
        const obj = {
            type: ev.target.value,   
            num: input.value,
        }

        if(input.value !== '') {
            obj.type = ev.target.value;
            obj.num = input.value;
            mass.push(obj);
            
            let lastLi = list.children[list.children.length - 1];
            lastLi.innerHTML += ` ${input.value} ${ev.target.value} `;
            input.value = '';
        }

        if(ev.target.value == '=') {
            for(let i = 1; i < mass.length; i++) {
                let a = Number(mass[i].num);
                let b = Number(mass[i-1].num);

                if(mass[i-1].type == '+') {
                    let c = b + a;
                    mass[i].num = c;
                } else if (mass[i-1].type == '-') {
                    let c = b - a;
                    mass[i].num = c;
                } else if (mass[i-1].type == '*') {
                    let c = b * a;
                    mass[i].num = c;
                } else if (mass[i-1].type == '/') {
                    let c = b / a;
                    mass[i].num = c;
                } 
            } 

            let lastLi = list.children[list.children.length - 1];
            if(lastLi.textContent.length) {
                if(ev.target.value == 0) {
                    ev.target.disabled = true;
                }
            }
            
            if(mass.length > 0) {
                let res = mass[mass.length -1].num;
                lastLi.innerHTML += `${res}`
                let item = document.createElement('li');
                item.classList.add('calc__item');
                list.append(item);
            }
            mass = [];                                            
        }
    }
})

// Кнопка сброса
reset.addEventListener('click', () => {
    let modal = document.createElement('div');
    modal.classList.add('modal')
    let div = `
    <h2 class="modal__title">Очистить всю очередь</h2>
    <div class="modal__buttons">
    <button class="modal__btn-ok">ОК</button>
    <button class="modal__btn-no">НЕТ</button>
    </div>`;
    modal.innerHTML = div;
    document.querySelector('body').appendChild(modal);

    const btnNo = document.querySelector('.modal__btn-no');
    const btnOk = document.querySelector('.modal__btn-ok');

    body.style.backgroundColor = `rgba(0,0,0,0.4)`;
    body.style.pointerEvents = 'none';
    btnOk.addEventListener('click', () => {
        input.value = '';
        list.innerHTML = `<li class="calc__item"></li>`;

        modal.style.display = 'none';
        body.style.backgroundColor = `inherit`;
        body.style.pointerEvents = 'all';
        modal.remove();
    })
    btnNo.addEventListener('click', () => {
        modal.style.display = 'none';
        body.style.backgroundColor = `inherit`;
        body.style.pointerEvents = 'all';
        modal.remove();
    })
});

// Удалить одну строку операций
const resetStr = document.querySelector('.calc__reset-str');
resetStr.addEventListener('click', (ev) => {
    let str = list.children[list.children.length - 2];
    if(str) {
        str.remove();
    }
})

// Обработка клавиатуры

// Нажатие кнопки
document.addEventListener('keydown', function(event) {
    // Удалить символ с поля
    if(event.key == 'Backspace') {
        if(input.value.length > 0) {
            let newStr = input.value.slice(0,-1);
            input.value = newStr;
        }
    }
    
    let str = list.children[list.children.length - 2];
    if(str) {
        if(event.key == 'c' || event.key == 'с')  str.remove();
    }
    
    let idxM = document.querySelector('.modal');
    if(!idxM) {
        for (let num of numb) {
            if(event.key == num.value) {
                let btn = document.querySelector(`button[value="${num.value}"]`);
                btn.classList.add('focus');
                input.value += event.key;
            }
        }
    
        for (let s of sign) {
            if(event.key == s.value || event.key == 'Enter') {
                let sign = document.querySelector(`button[value="${event.key == 'Enter' ? '=' : s.value}"]`);
                sign.classList.add('focus');
            }
        }
        
        let lastLi = list.children[list.children.length - 1];
        let str = lastLi.textContent.replace(/\s+/g, '');
        let lastS = str.length -1;
        if(event.key == 0) {
            if(str[lastS] == '/') {
                input.value = '';
            } 
        }
    }
});

// Отпускание кнопки
document.addEventListener('keyup', function(event) {
    let idxM = document.querySelector('.modal');

    if(!idxM) {
        for (let num of numb) {
            if(event.key == num.value) {
                let btn = document.querySelector(`button[value="${num.value}"]`);
                btn.classList.remove('focus');
            }
        }
        for (let s of sign) {
            if(event.key == s.value || event.key == 'Enter') {
                
                let sign = document.querySelector(`button[value="${s.value}"]`);
                sign.classList.remove('focus');
                                        
                if(input.value.length > 0) {               

                    const obj = {
                        type: sign.value,   
                        num: input.value,
                    }
                    
                    if(event.key == 'Enter') {
                        obj.type = '=';
                    } else {
                        obj.type = sign.value
                    }
                    obj.num = input.value;
                    mass.push(obj);
                    let lastLi = list.children[list.children.length - 1];
                    lastLi.innerHTML += ` ${input.value} ${event.key == 'Enter' ? '=' : event.key} `;
                    input.value = '';
                    if(event.key == '=' || event.key == 'Enter') {
                        for(let i = 1; i < mass.length; i++) {
                            let a = Number(mass[i].num);
                            let b = Number(mass[i-1].num);
                            if(mass[i-1].type == '+') {
                                let c = b + a;
                                mass[i].num = c;
                            } else if (mass[i-1].type == '-') {
                                let c = b - a;
                                mass[i].num = c;
                            } else if (mass[i-1].type == '*') {
                                let c = b * a;
                                mass[i].num = c;
                            } else if (mass[i-1].type == '/') {
                                let c = b / a;
                                mass[i].num = c;
                            }      
                        }
                        if(mass.length > 0) {
                            let res = mass[mass.length -1].num;
                            lastLi.innerHTML += `${res}`
                            let item = document.createElement('li');
                            item.classList.add('calc__item');
                            list.append(item);
                        }
                        
                        mass = [];
                    } 
                }
            }
        }
        
    }
});
// ==============================================================


