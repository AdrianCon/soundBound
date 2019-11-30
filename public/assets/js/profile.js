$(document).ready(function (){

	//User info
	if(localStorage.getItem("user") != null){
		var token = JSON.parse(localStorage.getItem("user"));
	}else{
		window.location.href =  "index.html"; 
	}
	console.log(token);

	var id = {
		id: token ? token.user.id : null
	};

	$.ajax({
		url: "/api/profiles/" + token.user.username,
		method: 'GET',
		dataType: 'json',
		contentType: 'application/json', 
		success: function(responseJSON){
			console.log(responseJSON);

			var  imag = responseJSON.profile.image ? responseJSON.profile.image : "https://static.productionready.io/images/smiley-cyrus.jpg";

			$("#profilePic").attr("src",imag)
			$("#username").append(responseJSON.profile.username);
			$("#bio").append(responseJSON.profile.bio);


		},
		error: function(err){
					console.log(err);
				}
	});

	//Get favorites
	$.ajax({
		url: "/api/articles?favorited=" + token.user.username,
		data: token ? token : null,
		method: "GET",
		dataType: "json",
		contentType: "application/json",
		success: function(responseJSON){
			for (var post of responseJSON.articles) {
				// console.log(post.author.id);
				// console.log(token.user.id);
				$("#favs").append(`
						<section id="${post.id}">
					        <div class="container">
					            <div class="row align-items-center">
					                <div class="col-lg-6 order-lg-1">
					                    	<h1 class="">${post.title}
					                        <h4 class="display-10">${post.description}</h2>
					                        <p>Likes: ${post.favoritesCount}</p><p>By: ${post.author.username}</p>
					                </div>
					            </div>
					        </div>
					    </section>
						`);
			}
		}
	});

	//Get articles
	$.ajax({
		url: "/api/articles?author=" + token.user.username,
		data: token ? token : null,
		method: 'GET',
		dataType: 'json',
		contentType: 'application/json', 
		success: function(responseJSON){
					console.log(responseJSON);
					for (var post of responseJSON.articles) {
						// console.log(post.author.id);
						// console.log(token.user.id);
						if(post.private == true ){
							if(post.author.username == token.user.username){
								$("#userPosts").append(`
										<section id="${post.id}">
									        <div class="container">
									            <div class="row align-items-center">
									                <div class="col-lg-6 order-lg-2" style="margin-top: 3rem;">
									                    <img class="rounded-circle" src="${post.image}">
									                </div>
									                <div class="col-lg-6 order-lg-1">
									                    <div class="p-5">
									                    	<h1 class="display-4">${post.title}
									                        <h2 class="display-6">${post.description}</h2>
									                        <p>Likes: ${post.favoritesCount}</p><p>By: ${post.author.username}</p>
									                        <p>${post.body}</p>
									                        <button type="submit" class="btn btn-warning btn-sm delBtn" id="${post.id}">Delete</button>
									                    </div>
									                </div>
									            </div>
									        </div>
									    </section>
										`);
							}
						}
						else{
							$("#userPosts").append(`
								<section id="${post.id}">
							        <div class="container">
							            <div class="row align-items-center">
							                <div class="col-lg-6 order-lg-2" style="margin-top: 3rem;">
							                    <img class="rounded-circle" src="${post.image}">
							                </div>
							                <div class="col-lg-6 order-lg-1">
							                    <div class="p-5">
							                    	<h1 class="display-4">${post.title}
							                        <h2 class="display-6">${post.description}</h2>
							                        <p>Likes: ${post.favoritesCount}</p><p>By: ${post.author.username}</p>
							                        <p>${post.body}</p>
							                        <button type="submit" class="btn btn-warning btn-sm delBtn" id="${post.id}">Delete</button>
							                    </div>
							                </div>
							            </div>
							        </div>
							    </section>
								`);
						}
					}

				},
		error: function(err){
					console.log(err);
				}
	});

	//New Post
	$(".submitPost").on("click", function(event){
		event.preventDefault();

		var newPost = {
			article: {
				title: $("#songTitle").val(),
				description: $("#bandName").val(),
				album: $("#albumName").val(),
				body: $("#tuningUsed").val(),
				image: $("#imageUrl").val() ? $("#imageUrl").val() : "assets/img/03.jpg",
				private: $("#privateCheck").is("checked") ? true : false,
				id: token.user.id
			},
			id: token.user.token
		}

		//Post from profile
		$.ajax({
		url: "/api/articles",
		headers: {
			"Authorization" : "Token " + token.user.token
		},
		data: JSON.stringify(newPost),
		method: 'POST',
		dataType: 'json',
		contentType: 'application/json', 
		success: function(post){
			$("#userPosts").append(`
				<section id=""${post.article.id}">
			        <div class="container">
			            <div class="row align-items-center">
			                <div class="col-lg-6 order-lg-2">
			                    <div class="p-5"><img class="rounded-circle img-fluid" src="${post.article.image}"></div>
			                </div>
			                <div class="col-lg-6 order-lg-1">
			                    <div class="p-5">
			                    	<h1 class="display-4">${post.article.title}
			                        <h2 class="display-6">${post.article.description}</h2>
			                        <h2 class="display-8">${post.article.album}</h2>
			                        <p>Favorites: ${post.article.favoritesCount}</p><p>By: ${post.username}</p>
			                        <p>${post.article.body}</p>
			                    </div>
			                </div>5ddd658e4af9b201c9caf7aa
			            </div>
			        </div>
			    </section>
			`);

			$("#songTitle").val("");
			$("#bandName").val("");
			$("#albumName").val("");
			$("#tuningUsed").val("");
			$("#imageUrl").val("");
		},
		error: function(error){
			console.log(error);
			alert("Error while posting");
		}
		});
	});
});

$(document).on("click",".delBtn", function(event){
		console.log(event);
		event.preventDefault();

		var postId = {
			id : this.id
		};

		//Delete Post
		$.ajax({
			url: "api/articles/delete",
			method : "DELETE",
			data : JSON.stringify(postId),
			dataType : "json",
			contentType : "application/json",
			success : function(post){
				$("#" + postId.id).remove();
			},
			error: function(error){
				console.log(error);
			}
		});
	});