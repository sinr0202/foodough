import { Meteor } from 'meteor/meteor';
import { Expenses } from '../imports/api/expenses';
import { Bills } from '../imports/api/bills';
import { Single } from '../imports/api/single';
import { moment } from 'meteor/momentjs:moment';
import { WebApp } from 'meteor/webapp';

Meteor.startup(() => {
	WebApp.rawConnectHandlers.use(function(req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		return next();
	});
	Meteor.methods({
		sendVerificationLink(){
			let userId = Meteor.userId();
			if(userId){
				return Accounts.sendVerificationEmail(userId);
			}
		},
		getStats(searchString){
			if (typeof searchString !== 'string') return null;
			if (!searchString.length) return null;
			let userId = Meteor.userId();
			expenses = Expenses.find({userId:userId, description:searchString}).fetch()
			lifeTime = 0;
			yearYet = 0;
			for (i in expenses){
				if (expenses[i].date > new Date('2017')) yearYet += expenses[i].amount;
				lifeTime += expenses[i].amount;
			}
			avg = lifeTime / expenses.length
			return {lifeTime:lifeTime,yearYet:yearYet,avg:avg};
		},
		getHistory(increment, quantity){
			var incomes = ['work', 'refund', 'other income'];
			var start = moment().startOf(increment).subtract(quantity-1,increment);
			let userId = Meteor.userId();
			var expenses = Expenses.find({userId:userId, date:{$gte:start.toDate()}},{sort:{date:1}}).fetch();
			var result = new Array(quantity);

			for(var i=0; i<quantity; i++){
				var date=increment=="month"?start.clone().format("MMM"):start.clone().format();
				
				result[i]={
					date:date,
					earning:0,
					spending:0,
					coffee:0,
					dining:0,
					transportation:0,
					leisure:0,
					fitness:0,
					fashion:0,
					accomodation:0,
					groceries:0,
					entertainment:0,
					living:0,
					education:0,
					car:0,
					phone:0,
					fee:0,
					alcohol:0,
					electronics:0,
					gift:0,
					home:0,
					donation:0,
					insurance:0,
				};
				start.add(1,increment)
			}

			for(var j=0; j<expenses.length; j++){
				var index;
				if (increment == 'week'){
					index = quantity-1-moment().endOf(increment).diff(expenses[j].date, increment);
				} else if (increment == 'month'){
					startMonth = moment(expenses[j].date).month();
					endMonth = moment().endOf(increment).month();
					if (endMonth<startMonth) endMonth += 12;
					index = quantity-1-(endMonth - startMonth);
				}
				if(incomes.indexOf(expenses[j].category)<0){
					result[index].spending += expenses[j].amount;
				} else {
					result[index].earning += expenses[j].amount;
				}

				if(expenses[j].category) result[index][expenses[j].category] += expenses[j].amount;
			}
			return result;
		},
	});
});