// definiowanie zmiennych w UI

const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

// funkcja do wywolywania wszystkich evenlistenerow

loadEventListeners();

function loadEventListeners(){
  // DOM Load event
  document.addEventListener('DOMContentLoaded', getTasks);
  // addtask event
  form.addEventListener('submit', addTask);

  // remove task
  taskList.addEventListener('click', removeTask);

  // remove all tasks
  clearBtn.addEventListener('click', clearTasks);

  // filtrowanie taskow
  filter.addEventListener('keyup', filterTasks);
}

// pobieranie taskow z local storage (po wczytaniu strony)
function getTasks(){
  let tasks;
  // sprawdzamy czy w LS jest task
  if(localStorage.getItem('tasks') === null){
    // jezeli jest puste, ustawiamy zmienna z pusta tablica
    tasks = [];
  } else {
    // jezeli nie jest puste, ustawiamy na cokolwiek
    // co jest w LS / LS przechowuje tylko stringi wiec parsujemy
    // JSONem cokolwiek jest w tasks
    tasks = JSON.parse(localStorage.getItem('tasks'));
  };

  tasks.forEach(function(task){
    // deklaracja zmiennej ktora tworzy element listy
    const li = document.createElement('li');
    // dodanie klasy do utworzonego elementu
    li.className = 'collection-item';
    // utworzenie text node i dodanie go do li
    li.appendChild(document.createTextNode(task));
    // utworzenie linku usuwajacego taska w tym samym li
    const link = document.createElement('a');
    // oddanie klasy do linku
    link.className = 'delete-item secondary-content';
    // dodanie htmla dla ikonki zamykania
    link.innerHTML = '<i class="fa fa-remove"></i>';
    // dodanie linku zamykajacego do elementu listy
    li.appendChild(link);
    // dodanie elementu listy do listy
    taskList.appendChild(li);
  });
}

// funkcja addTask
function addTask(e){

  // jezeli input jest pusty, alert
  if(taskInput.value === ''){
    alert('Add task');
    
  }

  // deklaracja zmiennej ktora tworzy element listy
  const li = document.createElement('li');
  // dodanie klasy do utworzonego elementu
  li.className = 'collection-item';
  // utworzenie text node i dodanie go do li
  li.appendChild(document.createTextNode(taskInput.value));
  // utworzenie linku usuwajacego taska w tym samym li
  const link = document.createElement('a');
  // oddanie klasy do linku
  link.className = 'delete-item secondary-content';
  // dodanie htmla dla ikonki zamykania
  link.innerHTML = '<i class="fa fa-remove"></i>';
  // dodanie linku zamykajacego do elementu listy
  li.appendChild(link);
  // dodanie elementu listy do listy
  taskList.appendChild(li);

  // zapisywanie do local storage
  // cokolwiek zostanie przekazane do taskInput.value - zostanie
  // przekazane do storeTaskInLocalStorage
  storeTaskInLocalStorage(taskInput.value);

  // czyszczenie inputa po dodaniu taska do listy
  taskInput.value = '';

  // powstrzymanie przed naturalnym zachowanie eventu (submit form)
  e.preventDefault();
};

// zapisywanie do local storage
function storeTaskInLocalStorage(task){
  let tasks;
  // sprawdzamy czy w LS jest task
  if(localStorage.getItem('tasks') === null){
    // jezeli jest puste, ustawiamy zmienna z pusta tablica
    tasks = [];
  } else {
    // jezeli nie jest puste, ustawiamy na cokolwiek
    // co jest w LS / LS przechowuje tylko stringi wiec parsujemy
    // JSONem cokolwiek jest w tasks
    tasks = JSON.parse(localStorage.getItem('tasks'));
  };

  // pushujemy do tasks cokolwiek zostalo przekazane do task
  tasks.push(task);

  // jezeli jakas wartosc zostala dodana, zapisujemy to spowrotem 
  // do local storage / musi byc zapisane jako string wiec 
  // zamieniamy tablice na stringa
  localStorage.setItem('tasks', JSON.stringify(tasks));

};


//funkcja removeTask
function removeTask(e){
  // funkcja ktora sprawdza czy target eventu podczas
  // klikniecia posiada klase 'delete-item'
  if(e.target.parentElement.classList.contains('delete-item')){
    // zapytanie czy na pewno chcesz wykonac
    if(confirm('Are you sure you want to remove task from list?')){
      // jezeli posiada, usun rodzica - rodzica dla elementu
      e.target.parentElement.parentElement.remove();

      // usuwanie z local storage
      removeTaskFromLocalStorage(e.target.parentElement.parentElement);
    };
  }
};

// funkcja usuwania z local storage
function removeTaskFromLocalStorage(taskItem) {
  let tasks;
  // sprawdzamy czy w LS jest task
  if(localStorage.getItem('tasks') === null){
    // jezeli jest puste, ustawiamy zmienna z pusta tablica
    tasks = [];
  } else {
    // jezeli nie jest puste, ustawiamy na cokolwiek
    // co jest w LS / LS przechowuje tylko stringi wiec parsujemy
    // JSONem cokolwiek jest w tasks
    tasks = JSON.parse(localStorage.getItem('tasks'));
  };

  tasks.forEach(function(task, index){
    if(taskItem.textContent === task){
      tasks.splice(index, 1);
    }
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

//funkcja clearTasks
function clearTasks(e){
  // wolniejsza wersja
  // taskList.innerHTML = '';

  // szybsza wersja
  // sprawdzamy w petli czy wciaz jest pierwsze dziecko taskList
  // do momentu az go nie bedzie, jezeli jest, usuwamy je
  if(confirm('Are you sure to remove all taskt from list?')){
    while(taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
  };

  // czyszczenie local storage
  clearTasksFromLocalStorage();
  
};

// czyszczenie LS
 function clearTasksFromLocalStorage(){
   localStorage.clear();
 }

// funkcja filtrowania taskow
function filterTasks(e){
  // deklarujemy zeminna ktora bedzie przechowywac 
  // wartosc wpisana jako target dla parametru
  const text = e.target.value.toLowerCase();

  // bierzemy wszystkie elementy z klasa .collection-item
  // i petla forEach sprawdzamy czy textContent czy zawiera
  // wprowadzone do inputa / mozemy uzyc forEach poniewaz 
  // querySelectorAll zwraca node-list ktory mozemy potraktowac
  // jako tablice
  document.querySelectorAll('.collection-item').forEach(function(task){
    const item = task.firstChild.textContent;
    // przekazujemy do indexOf parametr text
    // ktory przeszukuje textContent
    // jezeli dla indexOf nic nie pasuje
    // wynikiem jest -1
    if(item.toLowerCase().indexOf(text) != -1){
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    };
  });
};
