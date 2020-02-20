import Sound from 'react-native-sound';

Sound.setCategory('Ambient', true);

const buttonPress = new Sound(require('./audio.mp3'), error => console.log(error));
export const playButtonPress = () => {
    buttonPress.play((success) => buttonPress.reset());
}

const playListPull = new Sound(require('./audio.mp3'), error => console.log(error));
export const playListPulls = () => {
    pull.play((success) => pull.reset());
};

const playListPullFinished = new Sound(require('./audio.mp3'), error => console.log(error));
export const playListPullFinisheds = () => {
    pullFinished.play((success) => pullFinished.reset());
}