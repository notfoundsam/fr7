var ajax_host = 'http://yahooauc.dev';

// Initialize app
var myApp = new Framework7();
 
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
	statusCode: {
		401: function (xhr) {
			myApp.loginScreen();
		}
	}
});

$$('#login').on('click', function() {
	$$.ajax({
		url: ajax_host + '/admin/api/login',
		type: 'POST',
		data: {
			email: $$('input[name=username]').val(),
			password: $$('input[name=password]').val()
		},
		success: function (data) {
			var d_obj = JSON.parse(data);
			switch (d_obj.status_code) {
				case 10: 
					myApp.closeModal('.login-screen');
					break;
				case 20: 
					myApp.closeModal('.login-screen');
					break;
				case 30:
					console.log('wrong');
					break;
			}
		}
	});
});

// Callbacks to run specific code for specific pages, for example for About page:
// myApp.onPageInit('about', function (page) {
//     // run createContentPage func after link was clicked
//     $$('.create-page').on('click', function () {
//         createContentPage();
//     });
// });
$$(document).on('pageInit', function (e) {
  // Do something here when page loaded and initialized
  
})
