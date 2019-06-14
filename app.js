// #Budget Controller
var budgetController = (function () {

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {
            sum = sum + current.value;
        });

        data.totals[type] = sum;
    }

    var data = {
        //items created using the function constructors
        allItems: {
            inc: [], //items that are income 
            exp: [] //items that are expense
        },

        totals: {
            inc: 0, //total income
            exp: 0  //total expense
        },

        budget: 0,

        percentage: -1

    };

    return {
        addItem: function (type, description, value) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === "inc") {
                newItem = new Income(ID, description, value);
            } else if (type === "exp") {
                newItem = new Expense(ID, description, value);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        calculateBudget: function () {

            //Calculate total incomes and expenses
            calculateTotal("inc");
            calculateTotal("exp");

            //Calculate total budget (incomes-expenses)
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    };
})();





// #UI Controller
var UIcontroller = (function () {

    //store the html class and id names //private
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomesContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabelValue: ".budget__value",
        budgetLabelInc: ".budget__income--value",
        budgetLabelExp: ".budget__expenses--value",
        budgetLabelPercent: ".budget__expenses--percentage"
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value, //description
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)  //money amount
            };
        },

        addListItem: function (object, type) {
            var boilerHtml, displayHtml, container;

            //Create Html Strings with placeholder texts
            if (type === "inc") {
                container = DOMstrings.incomesContainer;

                boilerHtml = '<div class="item clearfix" id="income-%id%"> <div class="item__description"> %description% </div> <div class="right clearfix"> <div class="item__value"> %value% </div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"> </i> </button> </div> </div> </div>'
            } else if (type === "exp") {
                container = DOMstrings.expensesContainer;

                boilerHtml = '<div class="item clearfix" id="expense-%id%"> <div class="item__description"> %description% </div> <div class="right clearfix"> <div class="item__value"> %value% </div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"> </i> </button> </div> </div> </div >'
            }

            //Replace placeholders with actual data
            displayHtml = boilerHtml.replace('%id', object.id);
            displayHtml = displayHtml.replace('%description%', object.description);
            displayHtml = displayHtml.replace('%value%', object.value);

            //Insert them in DOM
            document.querySelector(container).insertAdjacentHTML("beforeend", displayHtml);

        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields); //convert "fields" to an array

            fieldsArr.forEach(function (current, index, array) {
                current.value = ""; //empty the fields
            });

            fieldsArr[0].focus();   //select "inputDescription" (which is the first element of "fieldsArr" array) and put the focus back there
        },

        displayBudget: function (object) {
            document.querySelector(DOMstrings.budgetLabelValue).textContent = object.budget;
            document.querySelector(DOMstrings.budgetLabelInc).textContent = object.totalInc;
            document.querySelector(DOMstrings.budgetLabelExp).textContent = object.totalExp;

            if (object.percentage > 0) {
                document.querySelector(DOMstrings.budgetLabelPercent).textContent = object.percentage;
            } else {
                document.querySelector(DOMstrings.budgetLabelPercent).textContent = "---";
            }
        },

        //to make "DOMstrings" public
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();





// #Global Controller
var appController = (function (budgetCtrl, UIctrl) {

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

    var updateBudget = function () {

        //Calculate budget
        budgetCtrl.calculateBudget();

        //Return budget
        var budget = budgetCtrl.getBudget();

        //Display budget in the UI
        UIctrl.displayBudget(budget);
    };

    var ctrlAddItem = function () {

        //1. Get the filled input data
        var input = UIcontroller.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value !== 0) {
            //2. Add the item to the budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            console.log(newItem);

            //3. Add the item to the UI
            UIctrl.addListItem(newItem, input.type);

            //Clear fields
            UIctrl.clearFields();

            //4. Calculate and update budget
            updateBudget();
        }

    };

    return {
        //codes that we wanna be executed right when the application is started, will be stored in "init"
        init: function () {
            console.log("Application has started.");
            setupEventListener();

            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
        },
    }

})(budgetController, UIcontroller);

appController.init();