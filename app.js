//Budget Controller
var budgetController = (function () {

})();



//UI Controller
var UIcontroller = (function () {

})();



//Global Controller
var controller = (function (budgetCtrl, UIctrl) {

    var ctrlAddItem = function () {
        console.log("It works");
        //1. Get the filled input data

        //2. Add the item to the budget controller

        //3. Add the item to the UI controller

        //4. Calculate the budget

        //5. Display the budget
    };

    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
})(budgetController, UIcontroller);