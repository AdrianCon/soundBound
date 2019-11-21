$(document).ready(function(){

	if(localStorage.getItem("user") != null){
		var token = JSON.parse(localStorage.getItem("user"));

		$(".navCont").remove();

		var currentUser = `<li class="nav-item" role="presentation"><a class="nav-link" href="profile.html">${token.user.username}</a></li>`;
		var signOut = `<li class="nav-item signOut" role="presentation"><a class="nav-link" href="index.html">Sign Out</a></li>`;
		$(".navRigth").append(currentUser,signOut);
	}


	//Log out
	$(".signOut").on("click", function(event){
		event.preventDefault();

		localStorage.removeItem("user");
		window.location.href = "index.html";
	});	

	$(".searchBar").on("submit", function(event){
		event.preventDefault();

		window.location.href = "otherUser.html";

		// $.ajax({
		// url: "/api/other/profiles/" + $(".searchBar").val(),
		// method: 'GET',
		// dataType: 'json',
		// contentType: 'application/json', 
		// success: function(responseJSON){
		// 	console.log(responseJSON);

		// 	var  imag = responseJSON.profile.image ? responseJSON.profile.image : "https://static.productionready.io/images/smiley-cyrus.jpg";

		// 	$("#profilePic").attr("src",imag)
		// 	$("#username").append(responseJSON.profile.username);
		// 	$("#bio").append(responseJSON.profile.bio);


		// },
		// error: function(err){
		// 	console.log(err);
		// }
		// });
	});
});
