/**
 * Created by lihaijie on 17/4/5.
 */
var GameConstants = {
    //游戏状态
    GAME_STATE_IDLE: 0,
    GAME_STATE_FLYING: 1,
    GAME_STATE_OVER: 2,

    //英雄状态
    HERO_STATE_IDLE: 0,
    HERO_STATE_FLYING: 1,
    HERO_STATE_HIT: 2,
    HERO_STATE_FALL: 3,

    //速度数值
    HERO_MIN_SPEED: 650,
    HERO_MAX_SPEED: 1400,

    HERO_LIVES: 1,

    // Food item types
    ITEM_TYPE_1: 1,
    ITEM_TYPE_2: 2,
    ITEM_TYPE_3: 3,
    ITEM_TYPE_4: 4,
    ITEM_TYPE_5: 5,

    GAME_AREA_TOP_BOTTOM: 100,

    /** Special Item - Coffee. */
    ITEM_TYPE_COFFEE: 6,

    /** Special Item - Mushroom. */
    ITEM_TYPE_MUSHROOM: 7,
    OBSTACLE_GAP: 1200,
    OBSTACLE_SPEED: 300
};