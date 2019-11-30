$(document).ready(function (){

//Load all the posts
	var token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
	console.log(token);

	$.ajax({
		url: "/api/articles",
		data: token,
		method: 'GET',
		dataType: 'json',
		contentType: 'application/json', 
		success: function(responseJSON){
			for (var post of responseJSON.articles) {
				// console.log(post.author.id);
				// console.log(token.user.id);
				console.log(post.private);
				if(post.private === true){
						console.log("yeah");	
				}
				else{
					$("#posts").append(`
						<section id=""${post.id}">
					        <div class="container">
					            <div class="row align-items-center">
					                <div class="col-lg-6 order-lg-2">
					                    <div class="p-5"><img class="rounded-circle img-fluid" src="${post.image}"></div>
					                </div>
					                <div class="col-lg-6 order-lg-1">
					                    <div class="p-5">
					                    	<h1 class="display-4">${post.title}
					                        <h2 class="display-6">${post.description}</h2>
					                        <h2 class="display-8">${post.album}</h2>
					                        <p>Favorites: ${post.favoritesCount}</p><p>By: ${post.author.username}</p>
					                        <p>${post.body}</p>
											<button type="submit" class="btn btn-primary favBtn">Favorite</button>
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
			$("posts").append(`
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
			                </div>
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

	//Favorite post
	$(".favBtn").on("click", function(event){
		event.preventDefault();

		$.ajax({
			url: "/api/articles/" + $(this).attr("id") + "/favorite",
			headers: {
				"Authorization" : "Token " + token.user.token
			},
			data: token,
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json', 
			success: function(){
				event.target.val = Unfavorite;
			}
		});
	});



	// let loopBeat;
	// function setup(){
	// 	loopBeat = new Tone.Loop(song, "4n");
	// 	Tone.Transport.start();
	// 	loopBeat.start(0);
	// }

	// function song(time){
	// 	console.log(time);
	// }

	// setup();

	// function sequencer(){
	// 	const kick = new Tone.Player('./Claves.wav').toMaster();
	// 	Tone.Transport.scheduleRepeat(repeat,'4n');

	// 	function repeat(){
	// 		let step = index
	// 	}
	// }

	// var synth = new Tone.Synth().toMaster();

	// //play a middle 'C' for the duration of an 8th note
	// // while(true){
	// // synth.triggerAttackRelease("C4", "4n");
	// // }
	// // //attach a click listener to a play button
	// document.querySelector('.playMetro').addEventListener('click', () => Tone.start());


	// var loop = new Tone.Loop(function(time){
	//     synth.triggerAttackRelease("C2", "8n", time);
	// }, "4n");

	// loop.start("1m").stop("4m");

	// Tone.Transport.start();


	//sequencer();
	$('#dropMenu').change(function(){
		var tuning = $("#dropMenu option:selected").val();

		if(tuning == 'dropd'){
			$('#bt1').attr('value','D4');
			$('#bt1').text('D');

			$('#bt2').attr('value','A4');
			$('#bt2').text('A');

			$('#bt3').attr('value','D5');
			$('#bt3').text('D');

			$('#bt4').attr('value','G5');
			$('#bt4').text('G');

			$('#bt5').attr('value','B5');
			$('#bt5').text('B');

			$('#bt6').attr('value','E6');
			$('#bt6').text('E');
		}
		else if(tuning == 'dropc'){
			$('#bt1').attr('value','C4');
			$('#bt1').text('C');
			$('#bt2').attr('value','A4');
			$('#bt2').text('A');

			$('#bt3').attr('value','D5');
			$('#bt3').text('D');

			$('#bt4').attr('value','G5');
			$('#bt4').text('G');

			$('#bt5').attr('value','B5');
			$('#bt5').text('B');

			$('#bt6').attr('value','E6');
			$('#bt6').text('E');
		}
		else if(tuning == 'openg'){
			$('#bt1').attr('value','D4');
			$('#bt1').text('D');

			$('#bt2').attr('value','G4');
			$('#bt2').text('G');

			$('#bt3').attr('value','D5');
			$('#bt3').text('D');

			$('#bt4').attr('value','G5');
			$('#bt4').text('G');

			$('#bt5').attr('value','B5');
			$('#bt5').text('B');

			$('#bt6').attr('value','D6');
			$('#bt6').text('D');
		}
		else if(tuning == 'opend'){
			$('#bt1').attr('value','D4');
			$('#bt1').text('D');

			$('#bt2').attr('value','A4');
			$('#bt2').text('A');

			$('#bt3').attr('value','D5');
			$('#bt3').text('D');

			$('#bt4').attr('value','F#5');
			$('#bt4').text('F#');

			$('#bt5').attr('value','A5');
			$('#bt5').text('A');

			$('#bt6').attr('value','D6');
			$('#bt6').text('D');
		}
		else if(tuning == 'opene'){
			$('#bt1').attr('value','E4');
			$('#bt1').text('E');

			$('#bt2').attr('value','B4');
			$('#bt2').text('B');

			$('#bt3').attr('value','E5');
			$('#bt3').text('E');

			$('#bt4').attr('value','G#5');
			$('#bt4').text('G#');

			$('#bt5').attr('value','B5');
			$('#bt5').text('B');

			$('#bt6').attr('value','E6');
			$('#bt6').text('E');
		}
		else if(tuning == 'opena'){
			$('#bt1').attr('value','E4');
			$('#bt1').text('E');

			$('#bt2').attr('value','A4');
			$('#bt2').text('A');

			$('#bt3').attr('value','E5');
			$('#bt3').text('E');

			$('#bt4').attr('value','A5');
			$('#bt4').text('A');

			$('#bt5').attr('value','C#5');
			$('#bt5').text('C#');

			$('#bt6').attr('value','E6');
			$('#bt6').text('E');
		}
		else{
			$('#bt1').attr('value','E4');
			$('#bt1').text('E');

			$('#bt2').attr('value','A4');
			$('#bt2').text('A');

			$('#bt3').attr('value','D5');
			$('#bt3').text('D');

			$('#bt4').attr('value','G5');
			$('#bt4').text('G');

			$('#bt5').attr('value','B5');
			$('#bt5').text('B');

			$('#bt6').attr('value','E6');
			$('#bt6').text('E');
		}
	})


});