// appelation
const todoList = document.querySelector("#todo-list");
const form = document.querySelector("#add-todo-form");
const title1 = document.querySelector("#title");
const btnAdd = document.querySelector("#add_edit");
const errorAlerte = document.querySelector(".errorAlerte");

// form.style.backgroundColor = "#f3e309";

title1.focus();
const updateBtn = document.querySelector("#update");

let updateId = null;
let contenuIn = "true";

function renderList(doc) {
  // <li class="collection-item">
  //             <div>
  //                 <span>Buying food</span>
  //                 <i class="material-icons secondary-content">delete</i>
  //                 <a href="#modal1" class="modal-trigger secondary-content">
  //                     <i class="material-icons">edit</i>

  //                 </a>
  //             </div>
  //         </li>
  let li = document.createElement("li");
  li.className = "collection-item";
  li.setAttribute("data-id", doc.id);
  let div = document.createElement("div");
  let title = document.createElement("span");
  title.textContent = doc.data().title;
  let anchor = document.createElement("a");
  // anchor.href = "#modal1";
  anchor.className = "modal-trigger secondary-content";
  let editBtn = document.createElement("i");
  editBtn.className = "material-icons editBtn";
  editBtn.innerText = "edit";
  let deleteBtn = document.createElement("i");
  deleteBtn.className = "material-icons secondary-content  deleteBtn";
  deleteBtn.innerText = "delete";
  anchor.appendChild(editBtn);
  div.appendChild(title);
  div.appendChild(deleteBtn);
  div.appendChild(anchor);
  li.appendChild(div);
  deleteBtn.addEventListener("click", (e) => {
    console.log("delete");
    let id = e.target.parentElement.parentElement.getAttribute("data-id");
    db.collection("todos").doc(id).delete();
  });
  editBtn.addEventListener("click", (e) => {
    updateId =
      e.target.parentElement.parentElement.parentElement.getAttribute(
        "data-id"
      );
    let x = e.target.parentElement.parentElement;

    let span = x.querySelector("span").textContent;
    console.log("updateId", updateId);
    // let newTitle = document.querySelector("#newTitle1");

    // newTitle.value = span;
    // window.setTimeout(() => newTitle.focus(), 0);

    title1.value = span;

    btnAdd.textContent = "edit";
    btnAdd.style.backgroundColor = "#ee6e73";

    form.title.focus();
  });
  todoList.append(li);
}

form.addEventListener("keyup", (e) => {
  let x = form.title.value;
  console.log(form.title.value);

  db.collection("todos")
    .orderBy("title")
    .onSnapshot((snapshot) => {
      let changes = snapshot.docChanges();

      for (i = 0; i < changes.length; i++) {
        if (x != changes[i].doc.data().title) {
          console.log("Il n y a pas  une similarité");
          contenuIn = "true";
          form.title.style.borderBottom = "2px solid #26a69a";
          btnAdd.style.backgroundColor = "#26a69a";
          errorAlerte.innerHTML = "";
        } else {
          console.log("Il  y a une similarité");
          contenuIn = "false";
          form.title.style.borderBottom = "2px solid red";
          btnAdd.style.backgroundColor = "red";
          errorAlerte.innerHTML = "existe deja";
          errorAlerte.style.color = "red";
          errorAlerte.style.float = "right";
          errorAlerte.style.paddingTop = "10px";
          break;
        }
      }

      // changes.forEach((change) => {
      //   console.log("v1", x);
      //   console.log("v2", change.doc.data().title);
      //   if (form.title.value == change.doc.data().title) {
      //     contenuIn = "false";
      //   } else {
      //     contenuIn = "true";
      //   }
      // });
    });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("ye rabi m3ana", contenuIn);

  if (form.title.value != "" && contenuIn == "true") {
    if (btnAdd.textContent == "Add Task") {
      db.collection("todos").add({
        title: form.title.value,
      });
      form.title.value = "";
    } else {
      db.collection("todos").doc(updateId).update({
        title: form.title.value,
      });
      btnAdd.textContent = "Add Task";
      btnAdd.style.backgroundColor = "#26a69a";
    }
  }
});

db.collection("todos")
  .orderBy("title")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    console.log(changes);

    changes.forEach((change) => {
      console.log(change.doc.data().title == contenuIn);
      if (change.type == "added") {
        renderList(change.doc);
        console.log("added");
        console.log(change.doc.data());
        let li = todoList.querySelector('[data-id="' + change.doc.id + '"]');
        setTimeout(function background() {
          // todoList.style.backgroundColor = "#f3e309";
          li.style.backgroundColor = "antiquewhite";
          li.style.color = "red";
        }, 1);
        setTimeout(function background() {
          // todoList.style.backgroundColor = "#f3e309";
          li.style.backgroundColor = "white";
          li.style.color = "black";
        }, 1000);
      } else if (change.type == "removed") {
        console.log("removed");
        let li = todoList.querySelector('[data-id="' + change.doc.id + '"]');

        // let li = todoList.querySelector(`[data-id=${change.doc.id}]`);
        setTimeout(function background() {
          // todoList.style.backgroundColor = "#f3e309";
          li.style.backgroundColor = "antiquewhite";
          li.style.color = "red";
        }, 1);
        setTimeout(function background() {
          // todoList.style.backgroundColor = "#f3e309";
          li.style.backgroundColor = "white";
          li.style.color = "black";
          todoList.removeChild(li);
        }, 100);
      } else if (change.type == "modified") {
        let li = todoList.querySelector('[data-id="' + change.doc.id + '"]');
        setTimeout(function background() {
          // todoList.style.backgroundColor = "#f3e309";
          li.style.backgroundColor = "antiquewhite";
          li.style.color = "red";
        }, 10);
        setTimeout(function background() {
          // todoList.style.backgroundColor = "#f3e309";
          li.style.backgroundColor = "white";
          li.style.color = "black";
        }, 3000);

        // btnAdd2 = document.querySelector("#newTitle1");
        li.getElementsByTagName("span")[0].textContent = form.title.value;
        // newTitle = document.querySelector("#newTitle1");
        form.title.value = "";
        console.log("modified");
      }
    });
  });
