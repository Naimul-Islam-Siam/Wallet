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

    var setupEventListener = function () {

        var DOM = UIctrl.getDOMstrings(); //access "DOMstrings of UIctrl" and store in "DOM of global ctrl"

        //for "click button"
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        //for "Enter key"
        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
    };

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

    return {
        //codes that we wanna be executed right when the application is started, will be stored in "init"
        init: function () {
            console.log("Application has started.");
            setupEventListener();
        }
    }

})(budgetController, UIcontroller);

controller.init();