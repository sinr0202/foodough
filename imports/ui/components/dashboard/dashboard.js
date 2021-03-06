import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMeteorAuth from 'angular-meteor-auth';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';

import template from './dashboard.html';
import { Expenses } from '../../../api/expenses';

class Dashboard {
	constructor($scope, $reactive, $state, $stateParams){
		'ngInject';
		$reactive(this).attach($scope);
		this.state = $state;
		this.editMode = true;
		this.perPage = 20;
		this.page = 1;
		this.sort = {date: -1};
		this.subscribe('expenses',() => [{
				limit: parseInt(this.perPage),
				skip: parseInt((this.getReactively('page') - 1) * this.perPage),
				sort: this.getReactively('sort')
			}, this.getReactively('searchText')
		]);
		this.helpers({
			expenses() {
				return Expenses.find({},{
					sort: this.getReactively('sort')
				});
			},
			expensesCount() {
				return Counts.get('numberOfExpenses');
			},
			stats(){
				return Fetcher.get("results");
			}
		});
		this.getStats() //clears session var at start
		if($stateParams.searchText){
			this.searchText = $stateParams.searchText;
		}
	}

	getStats(){
		Fetcher.retrieve("results", "getStats", this.searchText);
	}

	clearSearch(){
		this.searchText = '';
		this.getStats();
	}

	pageChanged(newPage) {
		this.page = newPage;
	}

	sortChanged() {
		this.sort = {date: -this.sort.date}
	}

	rowclick(expense) {
		if (this.editMode){
			this.state.go('submit', {transaction_id : expense._id, searchText : this.searchText})
		} else {
			this.searchText = expense.description;
			this.getStats();
		}
	}

	toggleEdit(){
		this.editMode = !this.editMode;
	}

}

const name = 'dashboard';

// create a module
export default angular.module(name, [
	angularMeteor,
	uiRouter,
	utilsPagination
]).component(name, {
	template: template.default,
	controllerAs: name,
	controller: Dashboard
})
.config(config);
 
function config($stateProvider) {
	'ngInject';
	$stateProvider.state('dashboard', {
		url: '/dashboard',
		template: '<dashboard></dashboard>',
		resolve:{
			user: ($auth) => {
				return $auth.requireUser();
			}
		},
		params:{
			searchText:''
		}
	});
}