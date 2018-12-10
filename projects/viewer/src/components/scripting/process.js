
/**
 * TODO
 * 8h full day cycle
 *  - 6h Day
 *  - 2h Night 
 * By default night begins at 3pm (Day starts at 9am)
 * Create random Ocean Background
 * If day cicle ends, show Night Background
 * Random island position (perhaps set via command?!)
 */
let tick = null;
let prevTick = Date.now();
let elapsed = null;
// let startTime = prevTick;
const fps = 1000 / 60;

let state = {
    data: null,
    context: null,
    res: null,
    slot: 0,
    images: [],
    // this should be for multiple running scripts
    reentry: 0,
    elapsed: 0,
    continue: true,
};

// TTM COMMANDS
const SAVE_BACKGROUND = (state) => { };
const DRAW_BACKGROUND = (state) => { };
const PURGE = (state) => { };
const UPDATE = (state) => { };
const DELAY = (state, delay) => {
    state.continue = false;
    if (!state.elapsed) {
        state.elapsed = (delay * 20) + Date.now();
    }
    if (Date.now() > state.elapsed) {
        state.elapsed = 0;
        state.continue = true;
    }
};

const SLOT_IMAGE = (state, slot) => {
    state.slot = slot;
};

const SLOT_PALETTE = (state) => { };
const TTM_UNKNOWN_0 = (state) => { };
const SET_SCENE = (state) => { };
const TTM_UNKNOWN_1 = (state) => { };
const TTM_UNKNOWN_2 = (state) => { };
const SET_FRAME0 = (state) => { };
const SET_FRAME1 = (state) => { };
const TTM_UNKNOWN_3 = (state) => { };
const SET_WINDOW1 = (state) => { };
const FADE_OUT = (state) => { };
const FADE_IN = (state) => { };
const SAVE_IMAGE0 = (state) => { };
const SAVE_IMAGE1 = (state) => { };
const TTM_UNKNOWN_4 = (state) => { };
const TTM_UNKNOWN_5 = (state) => { };
const TTM_UNKNOWN_6 = (state) => { };
const DRAW_WHITE_LINE = (state) => { };
const SET_WINDOW0 = (state) => { };
const DRAW_BUBBLE = (state) => { };
const DRAW_SPRITE0 = (state) => { };
const DRAW_SPRITE1 = (state) => { };
const DRAW_SPRITE2 = (state) => { };
const DRAW_SPRITE3 = (state) => { };
const CLEAR_SCREEN = (state) => { };
const DRAW_SCREEN = (state) => { };
const LOAD_SOUND = (state) => { };
const SELECT_SOUND = (state) => { };
const DESELECT_SOUND = (state) => { };
const PLAY_SOUND = (state) => { };
const STOP_SOUND = (state) => { };
const LOAD_SCREEN = (state) => { };

const LOAD_IMAGE = (state, name) => {
    const image = state.entries.find(e => e.name === name);
    if (image !== undefined) {
        state.images[state.slot] = image;
    }
};

const LOAD_PALETTE = (state) => { };

// ADS COMMANDS
const ADS_UNKNOWN_0 = (state) => { };
const IF_UNKNOWN_1 = (state) => { };
const IF_LASTPLAYED = (state) => { };
const IF_SKIP_NEXT2 = (state) => { };
const IF_UNKNOWN_2 = (state) => { };
const OR_UNKNOWN_3 = (state) => { };
const OR = (state) => { };
const PLAY_SCENE = (state) => { };
const PLAY_SCENE_2 = (state) => { };
const ADD_SCENE = (state) => { };
const ADD_SCENE_UNKNOWN_4 = (state) => { };
const ADS_UNKNOWN_5 = (state) => { };
const RANDOM_START = (state) => { };
const RANDOM_UNKNOWN_0 = (state) => { };
const RANDOM_END = (state) => { };
const ADS_UNKNOWN_6 = (state) => { };
const ADS_FADE_OUT = (state) => { };
const ADS_UNKNOWN_8 = (state) => { };
const END = (state) => { };

// CUSTOM COMMAND
const END_IF = (state) => { };

const CommandType = [
    // TTM COMMANDS
    { opcode: 0x0020, callback: SAVE_BACKGROUND },
    { opcode: 0x0080, callback: DRAW_BACKGROUND },
    { opcode: 0x0110, callback: PURGE },
    { opcode: 0x0FF0, callback: UPDATE },
    { opcode: 0x1020, callback: DELAY },
    { opcode: 0x1050, callback: SLOT_IMAGE },
    { opcode: 0x1060, callback: SLOT_PALETTE },
    { opcode: 0x1100, callback: TTM_UNKNOWN_0 },
    { opcode: 0x1110, callback: SET_SCENE },
    { opcode: 0x1120, callback: TTM_UNKNOWN_1 },
    { opcode: 0x1200, callback: TTM_UNKNOWN_2 }, 
    { opcode: 0x2000, callback: SET_FRAME0 },
    { opcode: 0x2010, callback: SET_FRAME1 },
    { opcode: 0x2020, callback: TTM_UNKNOWN_3 },
    { opcode: 0x4000, callback: SET_WINDOW1 },
    { opcode: 0x4110, callback: FADE_OUT },
    { opcode: 0x4120, callback: FADE_IN },
    { opcode: 0x4200, callback: SAVE_IMAGE0 },
    { opcode: 0x4210, callback: SAVE_IMAGE1 },
    { opcode: 0xA000, callback: TTM_UNKNOWN_4 },
    { opcode: 0xA050, callback: TTM_UNKNOWN_5 },
    { opcode: 0xA060, callback: TTM_UNKNOWN_6 },
    { opcode: 0xA0A0, callback: DRAW_WHITE_LINE },
    { opcode: 0xA100, callback: SET_WINDOW0 },
    { opcode: 0xA400, callback: DRAW_BUBBLE },
    { opcode: 0xA500, callback: DRAW_SPRITE0 },
    { opcode: 0xA510, callback: DRAW_SPRITE1 },
    { opcode: 0xA520, callback: DRAW_SPRITE2 },
    { opcode: 0xA530, callback: DRAW_SPRITE3 },
    { opcode: 0xA600, callback: CLEAR_SCREEN },
    { opcode: 0xB600, callback: DRAW_SCREEN },
    { opcode: 0xC020, callback: LOAD_SOUND },
    { opcode: 0xC030, callback: SELECT_SOUND },
    { opcode: 0xC040, callback: DESELECT_SOUND },
    { opcode: 0xC050, callback: PLAY_SOUND },
    { opcode: 0xC060, callback: STOP_SOUND },
    { opcode: 0xF010, callback: LOAD_SCREEN },
    { opcode: 0xF020, callback: LOAD_IMAGE },
    { opcode: 0xF050, callback: LOAD_PALETTE },
    // ADS COMMANDS
    { opcode: 0x1070, callback: ADS_UNKNOWN_0 },
    { opcode: 0x1330, callback: IF_UNKNOWN_1 },
    { opcode: 0x1350, callback: IF_LASTPLAYED },
    { opcode: 0x1360, callback: IF_SKIP_NEXT2 },
    { opcode: 0x1370, callback: IF_UNKNOWN_2 },
    { opcode: 0x1420, callback: OR_UNKNOWN_3 },
    { opcode: 0x1430, callback: OR },
    { opcode: 0x1510, callback: PLAY_SCENE },
    { opcode: 0x1520, callback: PLAY_SCENE_2 },
    { opcode: 0x2005, callback: ADD_SCENE },
    { opcode: 0x2010, callback: ADD_SCENE_UNKNOWN_4 },
    { opcode: 0x2014, callback: ADS_UNKNOWN_5 },
    { opcode: 0x3010, callback: RANDOM_START },
    { opcode: 0x3020, callback: RANDOM_UNKNOWN_0 },
    { opcode: 0x30ff, callback: RANDOM_END, indent: -1 },
    { opcode: 0x4000, callback: ADS_UNKNOWN_6 },
    { opcode: 0xf010, callback: ADS_FADE_OUT },
    { opcode: 0xf200, callback: ADS_UNKNOWN_8 }, 
    { opcode: 0xffff, callback: END },
    // CUSTOM: Add for text script
    { opcode: 0xfff0, callback: END_IF },
];

const runScript = () => {
    console.log('runscript');
    const scripts = state.data.scripts;
    for (let i = state.reentry; i < scripts.length; i++) {
        const c = scripts[i];
        const type = CommandType.find(ct => ct.opcode === c.opcode);
        console.log(c.line);
        type.callback(state, ...c.params);
        state.reentry = i;
        if (!state.continue) {
            break;
        }
    }
    if (state.reentry === scripts.length - 1) {
        state.reentry = 0;
        return true; // stop script for now
    }
    return false;
};

export const startProcess = (initialState) => {
    state = {
        ...state,
        ...initialState,
    };

    // runScript();
    mainloop();
};

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || ((f) => setTimeout(f, 1000/60));

const mainloop = () => {
    const frame = requestAnimationFrame(mainloop);

    tick = Date.now();
    elapsed = tick - prevTick;

    if (elapsed > fps) {
        prevTick = tick - (elapsed % fps);
    }

    if (runScript()) {
        cancelAnimationFrame(frame);
    }
 }
