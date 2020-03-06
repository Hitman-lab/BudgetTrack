
// ------------------------------------BUDGET CONTROLLER -----------------------------
var budgetController = (function() {

	var Expenses = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};


	Expenses.prototype.calPercentages = function(totalIncome){
		if(totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100) ;
		}else {
			this.percentage = -1;
		}
	};

	Expenses.prototype.getPercentage = function() {
		return this.percentage;
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

		deleteItem: function(type, id) {

			var ids, index;

			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);
			if(index !== -1){
				data.allItems[type].splice(index, 1);
			}

		},

		calculatePercentages: function() {
			data.allItems.exp.forEach(function(cur){
				cur.calPercentages(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allProc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});

			return allProc;
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
		itemPercentageLabel: '.item_percentage'
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
				html = '<div class="item clearfix" id="inc-%id%">'+
						'<div class="item_description">%description%</div>'+
						'<div class="right clearfix"><div class="item_value">%value%</div>'+
						'<div class="item_delete"><button class="item_delete--btn">'+
						'<i class="ion-ios-close-outline"></i></button></div></div></div>';

			}else if(type === 'exp') {
				
				element = DOMStrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%">'+
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

		deleteListItem: function(selectorID) {

			var items = document.getElementById(selectorID);
			items.parentNode.removeChild(items);
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
		},

		displayPercentages: function(percentages) {

			var fields = document.querySelectorAll(DOMStrings.itemPercentageLabel);

			var nodeListForEach = function(list, callback){
				for(var i = 0; i < list.length; i++){
					callback(list[i], i);
				}
			};

			nodeListForEach(fields, function(items, index) {

				if(percentages[index] > 0){
					items.textContent = percentages[index] + '%';
				}else{
					items.textContent = '---'; 
				}

			});
		},

		formatNumber: function(num, type) {
			var numSplit, int, dec;

			num = Math.abs(num);
			num = num.toFixed(2);

			numSplit = num.split('.');

			int = numSplit[0];
			if(int.length > 3){
				int = int.substr(0, 1) + ',' + int.substr(1, 3);
			}


			dec = numSplit[1];
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


	var updatePercentages = function() {

		// 1. Calculate Percentage
		budgetCtrl.calculatePercentages();

		// 2. Read Percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();

		// 3. Update the UI with the new percentage
		UICtrl.displayPercentages(percentages);
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

			// 5. budget update
			updateBudget();

			// 6. Calculate and Update percentages
			updatePercentages();
		}
	};


	var controlDeleteItem = function(event) {
		var itemID, splitID, type, ID;
  
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID){
			splitID = itemID.split('-');
			type = splitID[0];
			ID = splitID[1];

			// 1. delete the item from the data structure
			budgetCtrl.deleteItem(type, +ID);

			// 2. Delete the item from the UI
			UICtrl.deleteListItem(itemID);

			// 3. Update and Show the new budget
			updateBudget();

			// 4. Calculate and Update Percentages
			updatePercentages();
		}
	};

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