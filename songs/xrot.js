await samples({
  808: ['808/001.wav','808/002.wav','808/003.wav',],
  bd: ['bd/001.wav','bd/002.wav','bd/003.wav','bd/004.wav','bd/005.wav',],
  cp: ['cp/001.wav',],
  sd: ['sd/002.wav',],
  hh: ['hh/001.wav','hh/002.wav',],
  oh: ['oh/001.wav',],
  perc: ['perc/002.wav',],
  rim: ['rim/001.wav',],
  snap: ['snap/001.wav',],
  drum_loop: ['drum_loop/001.wav','drum_loop/002.wav','drum_loop/003.wav','drum_loop/004.wav','drum_loop/005.wav',
  ]
}, 'github:mamalLivecoder/samples/main/808/');

await loadOrc('github:kunstmusik/csound-live-code/master/livecode.orc')


/* INSTRUMETS */

const KICK  = s("bd:2(3,8,<0 2>)").gain(.55);
const CLAP  = s("cp(5,16)").slow("2").room(0.1).size(.6).clip(0.25).gain(.35).bpf(1000);

const HIHAT = s("[~ hh]*2").gain(.6);
const HIHAT_2 = s("hh:1*8").gain(.35).pan(sine.range(.48,.53).slow(3)).gain(sine.range(.1,.5).fast(1.5));

const OPEN_HAT = s("[~ oh]*2").ds(".2:.01");

const SNARE_CLAP = s("~ cp:4").gain(.51);

const GUITAR = note("~ [e3,<g3!16 g4!16>,<b3!12 c3!4>]").sound("gm_electric_guitar_muted").adsr(".0:.08:.01:0").slow(2).chop(5).hpf(300).gain(2.5)

const SNARE_ROLL = s("sd").fast("<1!2 [1(3,8)]!2 2!2 4 [8 12]>").n(1).gain(1).room(.15).cut(10).speed("<1!15 [1 .96 .92 .89 .86 .7 .62 .55]>").late(8)

const WEIRD_COWBELL = s("perc*2").gain("<.1 .2 .3 .32>/4").speed("-1").pan("<0 1>")
const WEIRD_COWBELL_CUTTED = s("perc*8").speed("1 .99 .98 .97").cut(1).gain(rand).degradeBy(.6).chop("<1 2 1 4>/4")

const HORNS = note("[e3,b3,e4,g4]/16").s("gm_french_horn").delay(.21).delayfeedback(.8).delaytime(1/4).adsr("0:.14:0:0").gain(2)

const MELODY = note("<<b4 [g4 a4]>(3,8) <[e4 f#4 g4 b4]!3 [[~ a4] b4 c4 g5]>>").csound("<Square>/4").gain(1.4)

/* PARTS */

const INTRO = stack(
  CLAP.degradeBy("<.8 .7 .4 .25>/4").jux(rev()).echo(irand(5),.5,.5).sometimes(x=>x.shape(.3)),
  WEIRD_COWBELL,
  s("gong/16").pan(.35),
  s("space/16").late(8).echoWith(4, 1/4, (p,n) => p.speed(1 + n*.4)).delay(.33).gain(.44)
)

const PART_A = stack(
  KICK.mask("<1@30 0!2>"),
  CLAP,
  HIHAT,
  HIHAT_2.mask("<0 1>/16").mask("<1@30 0>"),
  
  note("e2").s("808").slow(4),
  GUITAR.mask("<1@30 0>").gain("<2!16 1.35!16>"),

  s("drum_loop:2").loopAt(8).chop(8).iter(4).cut(8).pan(.7).gain("<.31 .15>/16"),

  stack(
    MELODY,
    OPEN_HAT,
    SNARE_CLAP
  ).mask("<0 1>/16"),

  HORNS
)

const PART_B = stack(
  s("<bd*2!3 bd(3,8)>").mask("<0!12 1!20>").n(1).cut(2),
  WEIRD_COWBELL_CUTTED.mask("<1 0>/<1!4 2!5>"),
  note("<[C#2,e2,a2,b2]>").arp("0 [0,2] 1 [0,2]").s("casio").mask("<0 1>/<1!4 2!5>").sometimesBy("<0!4 .1 .2 .3 .6>", x => x.ply("<1!4 2 3 7 7>")).gain(.48).cut(5),
  note("<<e2 f2>(3,8) ~ ~ ~>").s("808").cut(2),
  HIHAT.when("<1!16 0!16>", x=> x.euclid(5,16)),
  KICK.mask("<0!16 1!16>").hpf(1000),
  s("east").euclid(5,16).slow(2).pan(rand).n(irand(100)).mask("<0!16 1!16>").sometimesBy("<0 0 0 [0 .5]>", ply(4)),
  s("gong/16").late(8).pan(.35),
  s("space/16").late(16).echoWith(4, 1/4, (p,n) => p.speed(1 + n*.4)).delay(.33).gain(.44),
)

const PART_B1 = stack(
  KICK.n(3).hpf(sine.range(500,1200).slow(2.5).segment(16)),
  CLAP, HIHAT, PART_B.early(16), HIHAT_2
)

const BRIDGE = stack(
  WEIRD_COWBELL,
  WEIRD_COWBELL_CUTTED.degradeBy(.7),
  s("timpani_roll/4").n(1).cut(1),
  arrange([8, silence], [8, SNARE_ROLL]),
  HIHAT.bpf(400).mask("<0!12 1>"),
  s("insect(7,8)").pan(perlin.range(0,1)).cut(7).gain(.36).shape(.6).degrade().n("<1 0 2 3>").sometimesBy(.05, x => x.s("crow")),
  s("bd(3,8) ~ ~ ~").slow(4),
  s("gm_breath_noise").loopAt(1).speed("<1 -1>").pan("<.9 .1>").gain(.4)
)

const OUTRO = INTRO.rev()

/* ARRANGE */

arrange(
  [16, INTRO],
  
  [32, PART_A],
  [32, PART_B],

  [16, BRIDGE],
  
  [16, stack(PART_A, SNARE_ROLL.zoom(.5,1).late(16))],
  [32, stack(PART_B1, OPEN_HAT, SNARE_CLAP)],

  [16, OUTRO]
)
.theme("<strudelTheme aura>/32")
