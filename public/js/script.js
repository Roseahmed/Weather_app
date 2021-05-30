(function($, document, window){
	
	$(document).ready(function(){

		// Cloning main navigation for mobile menu
		$(".mobile-navigation").append($(".main-navigation .menu").clone());

		// Mobile menu toggle 
		$(".menu-toggle").click(function(){
			$(".mobile-navigation").slideToggle();
		});
	});

})(jQuery, document, window);
	//for Date
	let weekdays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		let months=['January','Februray','March','April','May','June','July',
		'August','September','October','November','December'];
		let date = new Date();
		let day = date.getDate();
		let weekday = date.getDay();
		let month = date.getMonth();
		$('.day').text(weekdays[weekday]);
		$('.date').text(`${day} ${months[month]}`);
	
	let temp = Number($('.temp').text());
	temp = Math.round(temp);
	$('.temp').text(temp);
	
	//for userConfirmation on transactions
    setTimeout(()=>{
		if($(".userConfirmation").text()==="successfull"){
			alert("Message send successfull we will contact you shortly!!!");
			$(".userConfirmation").empty();
		}else if($(".userConfirmation").text()==="unsuccessfull"){
			alert("Unsuccessfull please try again!!!");
			$(".userConfirmation").empty();
		}else if($(".userConfirmation").text()==="invalidCityName"){
			alert("Invalid city name");
			$(".userConfirmation").empty();
		}else if($(".userConfiramtion").text()=="apierror"){
			alert("Something went wrong!!!");
			$(".userConfirmation").empty();
		}else if($(".userConfirmation").text()=="subscribed"){
			alert("Subscribed");
			$(".userConfirmation").empty();
		}else if($(".userConfirmation").text()=="wrong"){
			alert("Something went wrong please try again with different email id!!!");
			$(".userConfirmation").empty();
		}
	},1000);
    