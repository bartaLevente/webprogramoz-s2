class Model {
  #currentTrack
  #selectedTracks = []
  #accessToken
  #tracks

  init() {
    const url = 'https://accounts.spotify.com/api/token';
    const clientId = CONFIG.CLIENT_ID;
    const clientSecret = CONFIG.CLIENT_SECRET;
    const playListUrl =
      'https://api.spotify.com/v1/playlists/37i9dQZF1DXddoYHYnHJ9N/tracks?fields=items(track(album,artists,name,preview_url))&limit=50';
    this.#initializePlayer(url,clientId,clientSecret)
      .then(() => {
        this.#getTracks(playListUrl);
      })
      .catch((error) => {
        console.error('Error initializing player:', error);
      });
  }

  getAllTracks(){
    return this.#selectedTracks
  }

  getNewTrack(){
    let index;
    do {
        index = Math.floor(Math.random() * this.#tracks.length);
        this.#currentTrack = this.#tracks[index].track;
    } while (this.#selectedTracks.includes(this.#currentTrack));

    this.#selectedTracks.push(this.#currentTrack);
    return this.#currentTrack;
  }

  updatePoints(obj){
    this.#currentTrack['points'] = obj
  }

  resetModel(){
    this.#selectedTracks = []
    this.#currentTrack = {}
  }


  #getTracks(playListUrl) {
    fetch(playListUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.#accessToken
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      this.#tracks = data.items.filter(item => item.track.preview_url !== null);
    })
    .catch(error => {
      console.error('There was a problem with the request:', error);
    });
  }
  
  #initializePlayer(url,clientId,clientSecret) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to obtain access token');
        }
        return response.json();
      })
      .then(data => {
        this.#accessToken = data.access_token;
        resolve();
      })
      .catch(error => {
        console.error('Error:', error);
        reject(error);
      });
    });
  }  
}
