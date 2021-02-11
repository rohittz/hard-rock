let searchBtn = document.getElementById("searchBtn");
let searchBox = document.getElementById("searchBox");
let searchUrl = "https://api.lyrics.ovh/suggest/";
let searchLyricsUrl = "https://api.lyrics.ovh/v1/";
let songContainerDiv = document.getElementById("song-container");
const errorMessage = (message) => {
	let errorMessageContainer = document.createElement("div");
	errorMessageContainer.className ="error-message";
	errorMessageContainer.innerHTML = `
		<h1 class = "text-center">${message}</h1>
	`
	songContainerDiv.append(errorMessageContainer);
}
const showLyrics = (title, artist, songId) => {
	let singleContainer = document.getElementsByClassName(songId)[0];
	let lyricsDiv = document.createElement("div");
	lyricsDiv.className = "col-md-12 text-center lyrics-div";
	fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
		.then(raw => raw.json())
		.then(lyrics => {
			if(lyrics.lyrics.length == 0){
				lyricsDiv.innerHTML = `
					<h1 class = "text-center"> LYRICS NOT FOUND </h1>`
			}
			else{
				lyricsDiv.innerText = `${lyrics.lyrics}`;
			}
			singleContainer.append(lyricsDiv);
		})
}
const showData = songs => {
	songContainerDiv.innerHTML = "";
	if(songs.length == 0){
		errorMessage("Song not found");
	}
	else{
		songs.forEach(song =>{
			let title = song.title;
			let songId = song.id.toString();
			let artist = song.artist.name;
			let preview = song.preview;
			let singleSongDiv = document.createElement("div");
			singleSongDiv.className = `single-result row align-items-center my-3 p-3
				${songId}
			`;
			singleSongDiv.innerHTML =
				`
			<div class="col-md-9">
				<h3 class="lyrics-name">${title}</h3>
					<p class="author lead">Album by <span>${artist}</span></p>
					<audio controls>
						<source src = "${preview}" type ="audio/mpeg">
					</audio>
				</div>
				<divclass="col-md-3 text-md-right text-center">
				<button id = "${songId}" class="btn btn-success">Get Lyrics</button>
			</div>
		`;
			songContainerDiv.append(singleSongDiv);
			let getLyricsBtn = document.getElementById(songId);
			getLyricsBtn.addEventListener("click", function(){
				showLyrics(title, artist, songId);
			});
		});
	}
}
const searchSong = () =>{
	const searchKeyword = searchBox.value;
	fetch(`${searchUrl}${searchKeyword}`)
		.then(raw => raw.json())
		.then(data => showData(data.data))
		.catch(error => errorMessage("API Error"));
}
searchBtn.addEventListener("click", searchSong);
