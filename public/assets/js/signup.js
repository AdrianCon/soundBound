$(document).ready(function(){
	if(localStorage.getItem("user") != null){
			window.location.href = "index.html";
		}
	$("#loginBtn").on("click", function(event){
			event.preventDefault();

			var user = {
					user: {
						email: $("#email").val(),
						username: $("#username").val(),
						password: $("#password").val()
					}
				};


			$.ajax({
				url: "/api/users/register",
				data: JSON.stringify(user),
				method: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				success: function(responseJSON) {
					localStorage.setItem("user", JSON.stringify(responseJSON));
					window.location.href = "index.html";
				},error: function(err){
					console.log(err);
					//alert(JSON.parse(err));
				}
			});
		});
});