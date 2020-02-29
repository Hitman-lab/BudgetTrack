
// ------------------------------------BUDGET CONTROLLER -----------------------------
var budgetController = (function() {

	var Expenses = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach( function(cur) {
			sum = sum + cur.value;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},

		totals: {
			exp: 0,
			inc: 0
		}, 

		budget: 0,
		percentage: -1
	};

	return{
		addItem: function(type, des, val){
			var newItem, ID;

			// create new ID
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}else{
				ID = 0;
			}	
			// create new item based on 'inc' or 'exp' type
			if(type === 'exp'){
				newItem = new Expenses(ID, des, val);
			}else if(type === 'inc'){
				newItem = new Income(ID, des, val);
			}

			// then push it into the data structure
			data.allItems[type].push(newItem);
			return newItem; // return the new item
		},

		calculateBudget: function() {
			// calculate the total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget (income - expenses)
			data.budget = data.totals.inc - data.totals.exp;
			
			// calculate the percentage of income that we spent

			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else{
				data.percentage = -1;
			}

		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};	
		},

		testing: function(){
			return data.allItems;
		}
	};

})();

// -------------------------------USER INTERFACE CONTROLLER--------------------------------
var UIController = (function() {

	var DOMStrings = {
		inputType: '.add_type',
		inputDescription: '.add_description',
		inputValue: '.add_value',
		inputBtn: '.add_btn',
		incomeContainer: '.income_list',
		expensesContainer: '.expenses_list',
		budgetLabel: '.budget_value',
		incomeLabel: '.budget_income--value',
		expensesLabel: '.budget_expenses--value',
		percentageLabel: '.budget_expenses--percentage',
		container: '.container',
	};
	
	return{
		getInput: function() {
			return{
				type: document.querySelector(DOMStrings.inputType).value,
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			};
		},

		getDomStrings: function() {
			return DOMStrings;
		},

		addListItem: function(obj, type) {
			
			var html, newHtml, element;

			// create the HTML string with placeholder text
			if(type === 'inc'){
				
				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%">'+
						'<div class="item_description">%description%</div>'+
						'<div class="right clearfix"><div class="item_value">%value%</div>'+
						'<div class="item_delete"><button class="item_delete--btn">'+
						'<i class="ion-ios-close-outline"></i></button></div></div></div>';

			}else if(type === 'exp') {
				
				element = DOMStrings.expensesContainer;
				html = '<div class="item clearfix" id="expenses-%id%">'+
					   '<div class="item_description">%description%</div>'+
					   '<div class="right clearfix"><div class="item_value">%value%</div>'+
					   '<div class="item_percentage">21%</div><div class="item_delete">'+
					   '<button class="item_delete--btn"><i class="ion-ios-close-outline"></i>'+
					   '</button></div></div></div>';
			}

			// Replace the Placeholder text with some actual code
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);		
		},

		clearFields: function() {
			var fields, fieldsArray;
			fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue); // this returns the list

			// which have to convert to the array // so that we can loop over this
			fieldsArray = Array.prototype.slice.call(fields);

			// parsing the array using forEach 
			fieldsArray.forEach(function(currentVal, index, array) {
				currentVal.value = "";
			});

			// focus back to the description box
			fieldsArray[0].focus();
			fieldsArray[0].style.border ='1px solid red';
		},

		displayBudget: function(obj) {
			document.querySelector(DOMStrings.budgetLabel).textContent = '+ ' + obj.budget;
			document.querySelector(DOMStrings.incomeLabel).textContent = '+ ' + obj.totalInc;
			document.querySelector(DOMStrings.expensesLabel).textContent = '- ' + obj.totalExp;

			if(obj.percentage > 0){
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			}else{
				document.querySelector(DOMStrings.percentageLabel).textContent = '---';
			}
		}
	};
})();

// ------------------------------------- APP CONTROLLER ----------------------------------------

// this controller will handle the communication between the 
// above budgetController and UIController

var appController = (function(budgetCtrl, UICtrl) {

	var setupEventListener = function() {

		var DOM = UICtrl.getDomStrings();

		// for button click 'Event Listner'
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		// for keypress "Enter" listener
		document.addEventListener('keypress', function(event) {
			if(event.keyCode === 13 || event.which === 13){
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', controlDeleteItem);
	};


	var updateBudget = function(){

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. return the budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	};


	var ctrlAddItem = function() {
		
		// 1. Get the field input data
		var inputs = UICtrl.getInput();
		
		if(inputs.description !== '' && !isNaN(inputs.value) && inputs.value > 0 ){

			// 2. Add the item to the budget controller
			var newItems = budgetCtrl.addItem(inputs.type, inputs.description, inputs.value);
			// console.log(newItems);

			// 3. Add the item to the UI
			UICtrl.addListItem(newItems, inputs.type);

			// 4. clear the fields
			UICtrl.clearFields();

			// budget update
			updateBudget();
		}
	};


	var controlDeleteItem = function(event) {
		var itemID;

		console.log(event.target);
	}

	return{
		init: function() {
			console.log('application has started.');
			UICtrl.displayBudget(
				{
					budget: 0,
					totalInc: 0,
					totalExp: 0,
					percentage: -1
				}
			);
			setupEventListener();
		}
	}

})(budgetController, UIController);

appController.init();