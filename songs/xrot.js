samples({
  808: ['808/001.wav','808/002.wav','808/003.wav',],
  bd: ['bd/001.wav','bd/002.wav','bd/003.wav','bd/004.wav','bd/005.wav',],
  cp: [
      'cp/001.wav',
  ],
  sd: [
      'sd/002.wav',
  ],
  hh: [
      'hh/001.wav',
      'hh/002.wav',
  ],
  oh: [
      'oh/001.wav',
  ],
  perc: [
      'perc/002.wav',
  ],
  rim: [
      'rim/001.wav',
  ],
  snap: [
      'snap/001.wav',
  ],
  drum_loop: [
      'drum_loop/001.wav',
      'drum_loop/002.wav',
      'drum_loop/003.wav',
      'drum_loop/004.wav',
      'drum_loop/005.wav',
  ]
}, 'github:mamalLivecoder/samples/main/808/');

await loadOrc('github:kunstmusik/csound-live-code/master/livecode.orc')


let chords = [
  'e3,g3,b3',
  'e3,g3,c4',
  'd3,f#3,b3'
]

/* INSTRUMETS */

const KICK  = s("bd:2(3,8,<0 2>)");
const CLAP  = s("cp(5,16)").slow("2").room(0.1).size(.6).clip(0.25).gain(.55).bpf(1000);

const HIHAT = s("[~ hh]*2").gain(.6);
const HIHAT_2 = s("hh:1*8").gain(.35).pan(sine.range(.48,.53).slow(3)).gain(sine.range(.1,.5).fast(1.5));

const GUITAR = note("~ [e3,<g3!16 g4!16>,<b3!12 c3!4>]").sound("gm_electric_guitar_muted").gain(3).adsr(".0:.08:.01:0").slow(2).chop(5).hpf(300)

const WEIRD_COWBELL = s("perc*2").gain("<.1 .2 .3 .32>/4").speed("-1").pan("<0 1>")
const WEIRD_COWBELL_CUTTED = s("perc*8").speed("1 .99 .98 .97").cut(1).gain(rand).degradeBy(.6).chop("<1 2 1 4>/4")

const MELODY = note("<<b4 e4>(3,8) <[e4 f#4 g4 b4]!3 [[~ a4] b4 c4 g5]>>").csound("Squine1").gain(1.4)

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
  GUITAR.mask("<1@30 0>"),

  MELODY.mask("<0 1>/16")
)

const PART_B = stack(
  s("<bd*2!3 bd(3,8)>").mask("<0!12 1!20>").n(1).cut(2),
  WEIRD_COWBELL_CUTTED.mask("<1 0>"),
  note("<[C#2,e2,a2,b2]>").arp("0 [0,2] 1 [0,2]").s("casio").mask("<0 1>").sometimesBy("<0!4 .1 .2 .3 .6>", x => x.ply("<1!4 2 3 7 7>")).gain(.51).cut(5),
  note("<<e2 f2>(3,8) ~ ~ ~>").s("808").cut(2),
  HIHAT.euclid(5,16),
  KICK.mask("<0!16 1!16>").hpf(100)
)

const PART_B1 = stack(KICK.n(3), CLAP, HIHAT, PART_B, HIHAT_2)

const BRIDGE = stack(
  note("<e2!2 g2!2>").s("808").slow(4),
  note("e3 g3 g4 b3 c3 ~".ply(2)).sound("gm_electric_guitar_muted").gain(3).adsr(".0:<.05 .06 .05 .12 .10>:.01:0").color('black').slow(2).hpf(700).room(.35).size(.7),
  s("sd").fast("<0!8 1!4 2!2 4 8>").n(1).gain(.5),
  HIHAT.bpf(400).mask("<0!12 1>")
)

const OUTRO = INTRO.rev()

/* ARRANGE */

arrange(
  [16, INTRO],
  
  [32, PART_A],
  [32, PART_B],

  [16, BRIDGE],
  
  [16, PART_A],
  [32, PART_B1],

  [16, OUTRO]
)
