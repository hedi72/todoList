const todoList = document.querySelector("#todo-list");
const form = document.querySelector("#add-todo-form");
const title1 = document.querySelector("#title");
const btnAdd = document.querySelector("#add_edit");
title1.focus();
const updateBtn = document.querySelector("#update");

let updateId = null;

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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.title.value != "") {
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
      if (change.type == "added") {
        renderList(change.doc);
        console.log("added");
        console.log(change.doc.data());
      } else if (change.type == "removed") {
        console.log("removed");
        let li = todoList.querySelector('[data-id="' + change.doc.id + '"]');

        // let li = todoList.querySelector(`[data-id=${change.doc.id}]`);
        todoList.removeChild(li);
      } else if (change.type == "modified") {
        let li = todoList.querySelector('[data-id="' + change.doc.id + '"]');

        // btnAdd2 = document.querySelector("#newTitle1");
        li.getElementsByTagName("span")[0].textContent = form.title.value;
        // newTitle = document.querySelector("#newTitle1");
        form.title.value = "";
        console.log("modified");
      }
    });
  });
