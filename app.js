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
        this.percentage = -1;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {
            sum = sum + current.value;
        });

        data.totals[type] = sum;
    };

    Expense.prototype.calcPercentages = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
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

        deleteItem: function (type, id) {
            var ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            var index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (current) {
                current.calcPercentages(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPercentages = data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });

            return allPercentages;
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
        budgetLabelPercent: ".budget__expenses--percentage",
        container: ".container",
        percentageLabel: ".item__percentage",
        monthLabel: ".budget__title--month"
    };

    //as the function is likely to be used only in UIcontroller, it's kept private instead of being public 
    var formatNumber = function (number, type) {
        number = Math.abs(number); //will ignore the sign of the number and convert it to just number. Bit like modulus
        number = number.toFixed(2); //number of digits after the "."

        var numberSplit = number.split(".");

        var int = numberSplit[0];
        var float = numberSplit[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }

        return (type === "exp" ? "-" : "+") + " " + int + "." + float;
    };

    var nodeListForEach = function (nodeList, callbackFn) {
        for (var i = 0; i < nodeList.length; i++) {
            callbackFn(nodeList[i], i);
        }
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

                boilerHtml = '<div class="item clearfix" id="inc-%id%"> <div class="item__description"> %description% </div> <div class="right clearfix"> <div class="item__value"> %value% </div> <div class="item__delete"> <button class="item__delete--btn"> <i class="icon ion-ios-close-circle-outline"></i> </button> </div> </div> </div>'
            } else if (type === "exp") {
                container = DOMstrings.expensesContainer;

                boilerHtml = '<div class="item clearfix" id="exp-%id%"> <div class="item__description"> %description% </div> <div class="right clearfix"> <div class="item__value"> %value% </div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="icon ion-ios-close-circle-outline"></i> </button> </div> </div> </div >'
            }

            //Replace placeholders with actual data
            displayHtml = boilerHtml.replace('%id%', object.id);
            displayHtml = displayHtml.replace('%description%', object.description);
            displayHtml = displayHtml.replace('%value%', formatNumber(object.value, type));

            //Insert them in DOM
            document.querySelector(container).insertAdjacentHTML("beforeend", displayHtml);

        },

        deleteListItem: function (selectedID) {
            var el = document.getElementById(selectedID)
            el.parentNode.removeChild(el);
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

            var type;

            if (object.budget >= 0) {
                type = "inc";
            } else {
                type = "exp";
            }

            document.querySelector(DOMstrings.budgetLabelValue).textContent = formatNumber(object.budget, type);
            document.querySelector(DOMstrings.budgetLabelInc).textContent = formatNumber(object.totalInc, "inc");
            document.querySelector(DOMstrings.budgetLabelExp).textContent = formatNumber(object.totalExp, "exp");

            if (object.percentage > 0) {
                document.querySelector(DOMstrings.budgetLabelPercent).textContent = object.percentage + "%";
            } else {
                document.querySelector(DOMstrings.budgetLabelPercent).textContent = "---";
            }
        },

        displayPercentage: function (percentages) {

            var el = document.querySelectorAll(DOMstrings.percentageLabel);

            nodeListForEach(el, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = "---";
                }

            });

        },

        displayMonth: function () {
            var now = new Date();
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var month = now.getMonth();
            var year = now.getFullYear();

            document.querySelector(DOMstrings.monthLabel).textContent = months[month] + " " + year;
        },

        changedType: function () {
            var fields = document.querySelectorAll(DOMstrings.inputType + ", " + DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

            nodeListForEach(fields, function (current) {
                current.classList.toggle("red-focus");
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
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

        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener("change", UIctrl.changedType);
    };

    var updateBudget = function () {

        //Calculate budget
        budgetCtrl.calculateBudget();

        //Return budget
        var budget = budgetCtrl.getBudget();

        //Display budget in the UI
        UIctrl.displayBudget(budget);
    };

    var updatePercentages = function () {

        //Calculate percentage
        budgetCtrl.calculatePercentages();

        //Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        //Update UI
        UIctrl.displayPercentage(percentages);

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

            //5. Calculate and update percentafes
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function (event) {

        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //Delete item from the data structure
            budgetCtrl.deleteItem(type, ID);

            //Delete item from the UI
            UIctrl.deleteListItem(itemID);

            //Update and show new budget
            updateBudget();
        }

    };

    return {
        //codes that we wanna be executed right when the application is started, will be stored in "init"
        init: function () {
            console.log("Application has started.");
            setupEventListener();

            //works as reset / resetting every thing to 0 at the start
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });

            UIctrl.displayMonth();
        },
    }

})(budgetController, UIcontroller);

appController.init();