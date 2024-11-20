console.log('View loaded')
class View{
    #username
    #playButton
    audioPlayer
    #inputField
    feedBack
    #points
    #pointsValue
    #songsList
    #results
    #resultsContent
    #replayButton
    #progressBar

    init(){
        this.#username = 'points:'
        document.querySelector('.uname').innerHTML = this.#username
        this.#playButton = document.querySelector('.playButton')
        this.audioPlayer = document.getElementById('audioPlayer')
        this.#inputField = document.getElementById('guess')
        this.feedBack = document.querySelector('.feedback')
        this.#points = document.querySelector('.points')
        this.#pointsValue = 0
        this.#points.innerHTML = this.#pointsValue
        this.#songsList = document.querySelector('.songs-list')
        this.#results = document.getElementById('popup')
        this.#resultsContent = document.querySelector('.popup-ul')
        this.#replayButton = document.querySelector('.replayButton')
        this.#progressBar = document.querySelector('.progress-bar')
    }

    onPlay(method){
        let self = this
        this.#playButton.onclick = function(evt) {
            evt.preventDefault()
            self.#playButton.disabled = true
            self.#playButton.innerHTML = 'Playing...';
            method()
        }
    }

    startMusic(url){
        this.audioPlayer.src = url
        this.audioPlayer.play()
        let self = this
        this.audioPlayer.addEventListener('timeupdate',()=>{
            const progr = (self.audioPlayer.currentTime/30)*100
            this.#progressBar.style.width = progr + '%'
        })
    }

    onSubmitGuessAndClearInputs(method){
        let self = this
        this.#inputField.addEventListener('keypress', function(event) {
            if(event.keyCode === 13){
                const guess = self.#inputField.value.trim()
                self.#inputField.value = ""
                method(guess)
            }
        })
    }

    handleNewTrack(){
        this.feedBack.innerHTML = 'Make your guess...'
        this.feedBack.classList.remove('red-text')
        this.feedBack.classList.remove('green-text')
    }

    handleCorrect(points){
        this.feedBack.innerHTML = 'congrats!'
        this.feedBack.classList.remove('red-text')
        this.feedBack.classList.add('green-text')
        this.#pointsValue += points
        this.#points.innerHTML = this.#pointsValue
    }
    handleIncorrect(){
        this.feedBack.innerHTML = 'nope'
        this.feedBack.classList.remove('green-text')
        this.feedBack.classList.add('red-text')
    }
    handleEverythingCorrect(points){
        this.feedBack.innerHTML = 'Good job, you guessed both the title and the Artist!'
        this.feedBack.classList.remove('red-text')
        this.feedBack.classList.add('green-text')
        this.#pointsValue += points
        this.#points.innerHTML = this.#pointsValue
    }

    onTrackEnded(method){
        let self = this
        this.audioPlayer.addEventListener('ended',()=>{
            method()
        })
    }
    countDown(method){
        let countdown = 3
        this.#playButton.innerHTML = 'New track starts in: ' + countdown;
        let countdownInterval = setInterval(() => {
            countdown--;
            if (countdown >= 0) {
                this.#playButton.innerHTML = 'New track starts in: ' + countdown;
            } else {
                clearInterval(countdownInterval);
                this.#playButton.innerHTML = 'Playing...';
                method()
            }
        }, 1000);
    }
    updateEndedTracks(artists,title,url){
        const html = `<li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">${title}</div>
                            ${artists}
                        </div>
                        <img src=${url} alt="" class="rounded">
                    </li>`
        this.#songsList.innerHTML += html
    }

    showResults(tracks){
        let html = `<li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">${this.#username}</div>
                        </div>
                        <div>
                        ${tracks.reduce((acc, track) => {
                            const trackPoints = track['points']['artist'] + track['points']['title'] + track['points']['bonus'];
                            return acc + trackPoints;
                        }, 0)}
                        </div>
                    </li>`
        tracks.forEach(track => {
            const item = `<li class="list-group-item d-flex justify-content-between align-items-center">
                            <div class="p-2 d-flex flex-column align-items-start">
                                <div class="fw-bold mb-1">${track['name']}</div>
                                <div class="text-muted">${track['artists'].map((artist)=>artist['name']).join(', ')}</div>
                            </div>
                            <div class="d-flex flex-row align-items-center">
                                <div class="p-2">
                                    <img src="${track['album']['images'][0]['url']}" alt="" class="rounded mb-2" style="width: 70px; height: 70px;">
                                </div>
                                <div class="p-2">
                                    <div class="fw-bold text-end">Total: ${track['points']['artist'] + track['points']['title'] + track['points']['bonus']}</div>
                                </div>
                            </div>
                        </li>`
            html += item
        });
        this.#resultsContent.innerHTML = html
        this.#results.style.display = 'block'
    }

    onReplay(method){
        this.#replayButton.onclick = function(evt){
            method()
        }
    }
    resetView(){
        this.#pointsValue = 0
        this.#points.innerHTML = this.#pointsValue
        this.#playButton.disabled = false
        this.#playButton.innerHTML = 'Play'
        this.#resultsContent.innerHTML = ''
        this.#results.style.display = 'none'
        this.#songsList.innerHTML = ''
        this.audioPlayer.src=''
        this.audioPlayer.disabled = true
    }
}