//Budget Controller
var budgetController = (function () {

})();



//UI Controller
var UIcontroller = (function () {

    //store the html class and id names //private
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value, //description
                value: document.querySelector(DOMstrings.inputValue).value  //money amount
            };
        },

        //to make "DOMstrings" public
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();



//Global Controller
var controller = (function (budgetCtrl, UIctrl) {

    //access "DOMstrings of UIctrl" and store in "DOM of global ctrl"
    var DOM = UIctrl.getDOMstrings();

    var ctrlAddItem = function () {

        //1. Get the filled input data
        var input = UIcontroller.getInput();
        console.log(input);
        console.log("-----");

        //2. Add the item to the budget controller

        //3. Add the item to the UI controller

        //4. Calculate the budget

        //5. Display the budget
    };

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIcontroller);