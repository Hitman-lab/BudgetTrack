
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
			if(des.length !== 0){
				
				if(type === 'exp'){
					newItem = new Expenses(ID, des, val);
				}else if(type === 'inc'){
					newItem = new Income(ID, des, val);
				}

			}else{
				alert("Enter Description!!");
			}
			// then push it into the data structure
			data.allItems[type].push(newItem);
			return newItem; // return the new item
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
				value: document.querySelector(DOMStrings.inputValue).value
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

				html = '<div class="item clearfix" id="income-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}else if(type === 'exp') {
				element = DOMStrings.expensesContainer;

				html = '<div class="item clearfix" id="expenses-%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_percentage">21%</div><div class="item_delete"><button class="item_delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace the Placeholder text with some actual code
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);		
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

	var ctrlAddItem = function() {
		
		// 1. Get the field input data
		var inputs = UICtrl.getInput();
		
		// 2. Add the item to the budget controller
		var newItems = budgetCtrl.addItem(inputs.type, inputs.description, inputs.value);
		// console.log(newItems);

		// 3. Add the item to the UI
		UICtrl.addListItem(newItems, inputs.type);

		// 4. Calculate the budget

		// 5. Display the budget on the UI

	};

	return{
		init: function() {
			console.log('application has started.');
			setupEventListener();
		}
	}

})(budgetController, UIController);

appController.init();