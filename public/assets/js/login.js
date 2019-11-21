$(document).ready(function(){

	if(localStorage.getItem("user") != null){
		window.location.href = "index.html";
	}

	//Login
	$("#loginBtn").on("click", function(event){
		event.preventDefault();

		var user = {
				user : {
					email: $("#email").val(),
					password: $("#password").val()
				}
			};


		$.ajax({
			url: "/api/users/login",
			data: JSON.stringify(user),
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			success: function(responseJSON) {
				localStorage.setItem("user", JSON.stringify(responseJSON));
				window.location.href = "index.html";
			}
		});
	});

	// //Delete a post
	// $("#deletePost").on("click", function(event) {
	// 	event.preventDefault();

	// 	var pid = $("#deleteId").val();

	// 	$.ajax({
	// 		url: "/blog-posts/" + pid,
	// 		method: 'DELETE',
	// 		dataType: 'json',
	// 		success: function(responseJSON) {
	// 			$("#" + pid).remove();
	// 			$("#deleteId").text = "";
	// 		},
	// 		error: function(err) {
	// 			$("#dPost").text(err.statusText);
	// 		}
	// 	});
	// });

	// //Update a post
	// $("#updatePost").on("click", function(event){
	// 	event.preventDefault();

	// 	var upObj = {
	// 			id: $("#updateId").val(),
	// 			publishDate: (new Date()).toString()
	// 		};

	// 	if($("#updateTitle").val() != ""){
	// 		upObj.title = $("#updateTitle").val();
	// 	}

	// 	if($("#updateContent").val() != ""){
	// 		upObj.content = $("#updateContent").val();
	// 	}

	// 	if($("#updateAuthor").val() != ""){
	// 		upObj.author = $("#updateAuthor").val();
	// 	}

	// 	$.ajax({
	// 		url: "/blog-posts/" + $("#updateId").val(),
	// 		data: JSON.stringify(upObj),
	// 		method: 'PUT',
	// 		dataType: 'json',
	// 		contentType: 'application/json',
	// 		success: function(responseJSON) {
	// 			$("#"+upObj.id).remove();
	// 			$("#blogPosts").append(`<div class='post' id='${upObj.id}'>
	// 							<h2>${upObj.title}</h2>
	// 							<h3>Author:${upObj.author}</h3>
	// 							<p>Date:${upObj.publishDate}</p>
	// 							<p>${upObj.content}</p>
	// 							<p>${upObj.id}</p>
	// 						</div>`);
	// 		},
	// 		error: function(err) {
				
	// 		}
	// 	});
	// });
});