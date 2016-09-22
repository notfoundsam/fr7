// var ajax_host = 'http://yahooauc.dev';
// var ajax_host = '';
var current_bidder = '';
var ajax_host = 'http://yahooauc-servletyahoo.rhcloud.com';

// Initialize app
var myApp = new Framework7({
    //Tell Framework7 to compile templates on app init
    template7Pages: true,
    material: true,

});
 
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
 
// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  // dynamicNavbar: true
});

console.log('START');

$$.ajax({
	url: ajax_host + '/admin/api/check_login',
	type: 'POST',
	success: function (data) {
		var d_obj = JSON.parse(data);
		if (d_obj.status_code == 100) {
			$$('#username').text(d_obj.result.current_user);
			console.log(d_obj.result.current_user);
			current_bidder = d_obj.result.current_bidder;
		}
	},
	statusCode: {
		401: function (xhr) {
			myApp.loginScreen();
		}
	}
});

$$('#bidding').on('click', function() {
	myApp.showIndicator();

	$$.ajax({
		url: ajax_host + '/admin/api/bidding',
		type: 'GET',
		statusCode: {
			401: function (xhr) {
				myApp.hideIndicator();
				myApp.loginScreen();
			}
		},
		success: function (data) {
			var d_obj = JSON.parse(data);
			if (d_obj.status_code == 100) {
				myApp.hideIndicator();

				var auctions = d_obj.result.auctions ? d_obj.result.auctions : null;

				mainView.router.load({
					url: 'bidding.html',
					reload: true,
					context: {
						title: 'Bidding',
						auctions: auctions,
						current_bidder: current_bidder
					}
				})
				console.log(d_obj.result);
			} else {
				myApp.hideIndicator();
				console.log(d_obj.message);
			}
		}
	});
});

$$('#login').on('click', function() {
	var email = $$('input[name=username]').val();
	var password = $$('input[name=password]').val();

	if (!email || !password) {
		myApp.alert('Enter both username and password', 'Input error');
		return;
	}

	$$.ajax({
		url: ajax_host + '/admin/api/login',
		type: 'POST',
		data: {
			email: email,
			password: password
		},
		success: function (data) {
			var d_obj = JSON.parse(data);
			switch (d_obj.status_code) {
				case 10: 
					$$('#username').text(d_obj.result.current_user);
					current_bidder = d_obj.result.current_bidder;
					myApp.closeModal('.login-screen');
					break;
				case 20: 
					myApp.closeModal('.login-screen');
					break;
				case 30:
					myApp.alert('Login or password incorect', 'Login error');
					break;
			}
		}
	});
});

$$('#logout').on('click', function() {
	myApp.closePanel();
	$$.ajax({
		url: ajax_host + '/admin/api/logout',
		type: 'POST',
		success: function (data) {
			var d_obj = JSON.parse(data);
			console.log(d_obj);
			if (d_obj.status_code == 40) {
				myApp.loginScreen();
			}
		}
	});
});
