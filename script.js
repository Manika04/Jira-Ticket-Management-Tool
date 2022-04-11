let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn")
let modelCont = document.querySelector(".model-cont");
let mainCont = document.querySelector('.main-cont');

let colors = ['lightpink', 'lightblue', 'lightgreen', 'black'];
//default color - black
let modelPriorityColor = colors[colors.length - 1];
let allPriorityColors = document.querySelectorAll('.priority-color');

let task = document.querySelector('.textarea-cont');
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let addFlag = false;
let removeFlag = false;

let toolboxColors = document.querySelectorAll('.color');
let ticketArr = [];

//Filter tickets acc to color
for(let i = 0; i < toolboxColors.length; i++){
    toolboxColors[i].addEventListener("click", function(e){
        let currentToolboxColor = toolboxColors[i].classList[1];
        // console.log(currentToolboxColor);

        let filterTickets = ticketArr.filter(function(ticketObj){
            return currentToolboxColor === ticketObj.ticketColorClass;
        });

        //remove previous tickets on the screen
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i = 0; i < allTickets.length; i++){
            allTickets[i].remove();
        }

        //generating the filtered tickets
        filterTickets.forEach(function(filteredObj){
            createTicket(filteredObj.ticketColorClass, filteredObj.ticketVal, filteredObj.ticketId);
            // console.log(ticketArr);
        });
    });

    toolboxColors[i].addEventListener("dblclick", function(e){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i = 0; i < allTickets.length; i++){
            allTickets[i].remove();
        }
        
        ticketArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColorClass, ticketObj.ticketVal, ticketObj.ticketId);
        });
    });
}

//Display a Model
addBtn.addEventListener("click", function(e){
    //addFlag, true - modal display
    //addFlag, false - modal hide

    addFlag = !addFlag; //T F T F T
    if(addFlag == true){
        modelCont.style.display = 'flex';
    }
    else{
        modelCont.style.display = 'none';
    }    
});

//deleting a ticket
removeBtn.addEventListener("click", function(e){
    removeFlag = !removeFlag;
    if(removeFlag == true){
        removeBtn.style.color = 'red';
    }
    else{
        removeBtn.style.color = '';
    }
});

function handleRemoval(ticket, id){
    ticket.addEventListener('click', function(){
        if(!removeFlag) return;

        //idx of particular id
        let idx = getTicketIdx(id); 

        //local storage removal of ticket
        ticketArr.splice(idx, 1);
        let stringTicketArr = JSON.stringify(ticketArr);
        localStorage.setItem('Tickets', stringTicketArr);
        ticket.remove();
    });
}

//Add a Ticket after writing the task
modelCont.addEventListener('keydown', function(e){
    let key = e.key;
    if(key === 'Shift'){
        createTicket(modelPriorityColor, task.value); //this func will generate the ticket
        modelCont.style.display = 'none';
        addFlag = false;
        task.value = "";
    }
});

function createTicket(ticketColorClass, ticketVal, ticketId){
    let id = ticketId || shortid()
    let ticketCont = document.createElement('div'); //div ticket cont is created!
    ticketCont.setAttribute('class', 'ticket-cont');

    ticketCont.innerHTML = `<div class="ticket-color ${ticketColorClass}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketVal}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>`;
    mainCont.appendChild(ticketCont);

    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);

    //Storing the tickets in an arr so that it doesn't get lost when we filter them out acc to color..check if there no ticketid then only push the ticket in arr
    if(!ticketId){
        ticketArr.push({ticketColorClass, ticketVal, ticketId:id});

        //storing data in local storage
        localStorage.setItem("Tickets", JSON.stringify(ticketArr));
    }
    // console.log(ticketArr);
}

//Changing priority colors 
allPriorityColors.forEach(function(colorElem){
    colorElem.addEventListener('click', function(e){
        allPriorityColors.forEach(function(priorityColor){
            //saare class mein se active class remove kardo
            priorityColor.classList.remove('active');
        });
        //jo humara current colorElem hai usme active class lagado
        colorElem.classList.add('active');

        modelPriorityColor = colorElem.classList[1]; //to get the color class i.e on 1st idx in our class(priority-color(0) lightgreen(1))
    });
});


//Implementing lock/unlock functionality
function handleLock(ticket, id){
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketTaskarea = ticket.querySelector(".task-area");

    //We'll get icon i.e <i class="fa-solid fa-lock"></i>
    let ticketLock = ticketLockElem.children[0];

    ticketLock.addEventListener('click', function(e){
        let ticketIdx = getTicketIdx(id);

        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskarea.setAttribute('contenteditable', 'true');
            // handleColor(ticket);
        }

        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskarea.setAttribute('contenteditable', 'false');
        }

        ticketArr[ticketIdx].task = ticketTaskarea.innerText
        localStorage.setItem("Tickets", JSON.stringify(ticketArr));
    });
}


//Changing colors on clicking band above ticket container
function handleColor(ticket, id){
    let ticketColorBand = ticket.querySelector(".ticket-color");

    ticketColorBand.addEventListener("click", function(e){
        //identifying current ticket color
        let currentTicketColor = ticketColorBand.classList[1];
        let ticketIdx = getTicketIdx(id);

        //colors wale arr ko use karke .. current color ka idx increment karte rehnge
        //findIndex loop jaise kaam karega for each color and unka idx return karta hai.. function mein jab humare current color aur color match ho jayega toh idx return kar dega
        let currentTicketColorIdx = colors.findIndex(function(color){
            return currentTicketColor === color;
        });
        // console.log(currentTicketColor, currentTicketColorIdx);
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;

        let newTicketColor = colors[newTicketColorIdx];
        ticketColorBand.classList.remove(currentTicketColor);
        ticketColorBand.classList.add(newTicketColor);

        //modify  new color
        ticketArr[ticketIdx].ticketColorClass = newTicketColor;
        localStorage.setItem("Tickets", JSON.stringify(ticketArr));
    });
}

// Get all tickets from local storage
if(localStorage.getItem("Tickets")){
    ticketArr = JSON.parse(localStorage.getItem("Tickets"));
    ticketArr.forEach(function(ticket){
        createTicket(ticket.ticketColorClass, ticket.ticketVal, ticket.ticketId);
    });
}


//Get ticket id for handleRemove
function getTicketIdx(id){
    let ticketIdx = ticketArr.findIndex(function(ticketObj){
        return ticketObj.ticketId === id;
    });

    return ticketIdx;
}








 


