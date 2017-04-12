/**
 * Created by lihaijie on 17/4/4.
 */
var Sound = {
    silence: false,
    _eatEffect: 0,
    playMenuBgMusic: function () {
        if (Sound.silence) {
            cc.audioEngine.playMusic("res/sounds/bgWelcome.mp3", true);
            Sound.silence = false;
        }
    },
    playGameBgMusic: function () {
        cc.audioEngine.playMusic("res/sounds/bgGame.mp3", true);
        Sound.silence = false;
    },
    playEat: function () {
        if (Sound._eatEffect) {
            cc.audioEngine.stopEffect(Sound._eatEffect);
            Sound._eatEffect = cc.audioEngine.playEffect("res/sounds/eat.mp3", false);
            Sound.silence = false;
        }
    },
    playCoffee: function () {
        cc.audioEngine.playEffect("res/sounds/coffee.mp3", false);
        Sound.silence = false;
    },
    playMushroom: function () {
        cc.audioEngine.playEffect("res/sounds/mushroom.mp3", false);
        Sound.silence = false;
    },
    playHit: function () {
        cc.audioEngine.playEffect("res/sounds/hit.mp3", false);
        Sound.silence = false;
    },
    playHurt: function () {
        cc.audioEngine.playEffect("res/sounds/hurt.mp3", false);
        Sound.silence = false;
    },
    playLose: function () {
        cc.audioEngine.playEffect("res/sounds/lose.mp3", false);
        Sound.silence = false;
    },
    stop: function () {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
        Sound.silence = true;
    }
};