
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

		


	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},

		totals: {
			exp: 0,
			inc: 0
		}
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
		expensesContainer: '.expenses_list'
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
	};


	var updateBudget = function(){

		// 1. Calculate the budget

		// 2. return the budget

		// 3. Display the budget on the UI

	};


	var ctrlAddItem = function() {
		
		// 1. Get the field input data
		var inputs = UICtrl.getInput();
		
		if(inputs.description !== '' && !isNAN(inputs.value) && inputs.value > 0 ){

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

	return{
		init: function() {
			console.log('application has started.');
			setupEventListener();
		}
	}

})(budgetController, UIController);

appController.init();