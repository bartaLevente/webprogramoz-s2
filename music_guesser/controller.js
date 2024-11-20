class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  init() {
    this.model.init();
    this.view.init();
    this.view.onPlay(() => {
      let counter = 0;
      let pointsPerRound = {'title':0,'artist':0,'bonus':0}
      let currentTrack = this.model.getNewTrack();
      let correctTitle = false
      let correctArtist = false
      this.view.startMusic(currentTrack['preview_url']);
      this.view.onSubmitGuessAndClearInputs((guess) => {
        
        if(!correctArtist || !correctTitle){
            this.view.handleIncorrect();
            if(correctArtist && currentTrack['artists'].map((artist)=>artist['name'].toLowerCase()).includes(guess.toLowerCase())){
                this.view.handleCorrect(0);
            }
            if(!correctArtist && currentTrack['artists'].map((artist)=>artist['name'].toLowerCase()).includes(guess.toLowerCase())){
                pointsPerRound['artist'] = 2
                this.view.handleCorrect(pointsPerRound['artist']);
                correctArtist = true
            }
            if(correctTitle && currentTrack['name'].toLowerCase() === guess.toLowerCase()){
                this.view.handleCorrect(0);
            }
            if(!correctTitle && currentTrack['name'].toLowerCase() === guess.toLowerCase()){
                pointsPerRound['title'] = 2
                this.view.handleCorrect(pointsPerRound['title']);
                correctTitle = true
            }
            if(correctArtist && correctTitle){
                pointsPerRound['bonus'] = 2
                this.view.handleEverythingCorrect(pointsPerRound['bonus'])
            }
        }
      });
      this.view.onTrackEnded(() => {
        this.view.updateEndedTracks(
            currentTrack['artists'].map((artist)=>artist['name']).join(', '),
            currentTrack['name'],
            currentTrack['album']['images'][0]['url']
        );
        this.model.updatePoints(pointsPerRound)
        console.log(counter)
        console.log(currentTrack)
        counter++;
        if(counter<5){
            this.view.countDown(() => {
                correctTitle = false
                correctArtist = false
                pointsPerRound = {'title':0,'artist':0,'bonus':0}
                this.view.handleNewTrack()
                currentTrack = this.model.getNewTrack();
                this.view.startMusic(currentTrack['preview_url']);
              });
        }
        else{
            this.view.showResults(this.model.getAllTracks())
            counter = 0
        }
      });
    });
    this.view.onReplay(()=>{
        location.reload()
    })
  }
}
