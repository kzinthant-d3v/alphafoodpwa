//offline data
db.enablePersistence().catch((err) => {
  if (err.code === "failed-precondition") {
    //probably multiple tabs open at once
    console.log("persistence failed");
  } else if (err.code === "unimplemented") {
    //lack of browser support
    console.log("persistence is not available");
  }
});

//real time listener
db.collection("recipes").onSnapshot((snapshot) => {
  //   console.log(snapshot.docChanges());
  snapshot.docChanges().forEach((change) => {
    // console.log(change.doc.data(), change.doc.id);
    const data = change.doc.data();
    const id = change.doc.id;
    console.log(data);
    if (change.type === "added") {
      //add the document data to UI
      renderRecipe(data, id);
    }
    if (change.type === "removed") {
      //remove the document data from UI
      removeRecipe(id);
    }
  });
});
//add new recipe
const form = document.querySelector("form");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  let title = form.title.value;
  let ingredient = form.ingredients.value;
  if (!title || !ingredient) {
    return;
  }
  const recipe = {
    title,
    ingredient,
  };

  db.collection("recipes")
    .add(recipe)
    .catch((err) => console.log(err));

  form.title.value = "";
  form.ingredients.value = "";
});

//delete a recipe
const recipeContainer = document.querySelector(".recipes");

recipeContainer.addEventListener("click", (evt) => {
  if (evt.target.tagName === "I") {
    const id = evt.target.getAttribute("data-id");
    db.collection("recipes").doc(id).delete();
  }
});
