import { Component, Input, ViewChildren, QueryList, ViewChild, AfterViewInit, ChangeDetectorRef, SimpleChanges, Output, EventEmitter, ElementRef, ComponentFactoryResolver, OnInit } from '@angular/core';
import { WordComponent } from '../word/word.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, getLocaleDayPeriods } from '@angular/common';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
@Component({
  selector: 'app-board',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule, 
    WordComponent,
    HttpClientModule,
  ],templateUrl: `./board.component.html`,
  styleUrl: './board.component.css'
})
export class BoardComponent implements AfterViewInit, OnInit {
  private word_url: string = 'http://localhost:8000/words'
  private eval_url: string = 'http://localhost:8000/run/eval?'

  // check
  isFetching: boolean = true;
  isPaused: boolean = true;
  IN_GAME: boolean = false;
  GAME_STARTED: boolean = false;


  @Input() gameTime: number = 3;

  cursor_pos: number = 0; // current letter index
  cursor_floor: number = 0; // lowest value for cursor_pos

  
  curr_pos: number = 0;
  curr_letters: string[] = [];
  currWord: any; // current word element
  extras!: string;
  //word_list: string[] = [    "cry",    "wicked",    "icy",    "ajar",    "ghost",    "unable",    "girls",    "expect",    "gather",    "narrow",    "mate",    "agonizing",    "somber",    "flowery",    "shiny",    "bike",    "shelter",    "straight",    "royal",    "nauseating",    "pipe",    "entertain",    "keen",    "thinkable",    "gifted",    "free",    "range",    "gusty",    "lacking",    "thundering",    "arch",    "scorch",    "spray",    "follow",    "rot",    "attract",    "womanly",    "agreement",    "barbarous",    "thaw",    "secret",    "boil",    "bleach",    "work",    "gray",    "digestion",    "thumb",    "eye",    "permissible",    "toad",    "lip",    "communicate",    "cloudy",    "poison",    "changeable",    "naive",    "loose",    "toys",    "nebulous",    "stroke",    "tasty",    "volleyball",    "unwritten",    "blind",    "hug",    "load",    "crabby",    "nifty",    "envious",    "bells",    "believe",    "notebook",    "liquid",    "bang",    "donkey",    "quack",    "cute",    "voyage",    "caption",    "stitch",    "year",    "car",    "profit",    "political",    "smash",    "curly",    "remarkable",    "consider",    "deafening",    "pancake",    "mom",    "raspy",    "meeting",    "expert",    "drip",    "ashamed",    "price",    "drain",    "vacuous",    "pathetic",    "fuel",    "page",    "tug",    "faded",    "messy",    "evanescent",    "outstanding",    "admit",    "kill",    "mysterious",    "selfish",    "smelly",    "squirrel",    "zealous",    "snakes",    "sea",    "orange",    "burly",    "macabre",    "aggressive",    "finger",    "insidious",    "trick",    "interest",    "distribution",    "scratch",    "acrid",    "stick",    "time",    "disgusted",    "whistle",    "earn",    "snow",    "soggy",    "add",    "vegetable",    "knotty",    "copper",    "hospital",    "drag",    "hands",    "simplistic",    "promise",    "scattered",    "noise",    "alive",    "develop",    "concentrate",    "x-ray",    "neat",    "smile",    "list",    "wash",    "snobbish",    "acceptable",    "horses",    "mellow",    "horrible",    "conscious",    "distinct",    "tasteful",    "confuse",    "ten",    "delight",    "sort",    "nose",    "ablaze",    "teeny-tiny",    "connect",    "stiff",    "windy",    "alike",    "need",    "muddle",    "extra-large",    "save",    "lowly",    "vein",    "ludicrous",    "seal",    "rain",    "capable",    "simple",    "tense",    "tumble",    "broad",    "ancient",    "spade",    "heavy",    "trip",    "bridge",    "dislike",    "willing",    "boundless",    "run",    "signal",    "breakable",    "deranged",    "dad",    "join"];

  timeLeft: number = this.gameTime;
  interval: any;

  timer!: any;
  player_text!: any;
  pDisabled: boolean = false; // * LAG control

  //! analysis
  raw: string = ''; // raw text
  filtered_count!: number; // amount of correct words
  word_queue: string[] = [];
  used_words: string[] = [];
  run_summary: any;

  //! board SCROLL
  scroll_threshold: number = 0;
  scroll_word: number = -1;

  @Output() runData = new EventEmitter<any>();


  @ViewChildren(WordComponent) boardWords!: QueryList<ElementRef>;
  @ViewChild('playerText', {static: false}) playerText: any;
  focusOp: number = 1;

  constructor(private cd: ChangeDetectorRef, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    this.genWords();
  }

  async ngAfterViewInit() {
    setTimeout(_ => {
      this.boardWords.changes.subscribe(res => {
        this.boardRendered();
      })

    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.IN_GAME)
      this.timeLeft = changes['gameTime'].currentValue;
  }


  boardRendered() {
    if (!this.isFetching) {
      this.newRun();
    }
  }

  newRun(): void {
    this.cd.detectChanges();
    this.curr_pos = 0;
    this.cursor_pos = 0;
    this.timeLeft = this.gameTime;
    this.scroll_word = 0;

    this.currWord = this.boardWords.get(this.curr_pos);
    this.currWord.cursor = 0;
    this.used_words = [this.currWord.word]
    this.raw = ''

    this.playerText.nativeElement.focus()
    this.pauseTimer();
    this.isPaused = true;
    this.IN_GAME = false;
    this.GAME_STARTED = false;

    this.scroll_threshold = this.currWord.getYPos()
  }

  onKeyUp(x: any): void {
    if (x.keyCode != 13) {
      if (!this.GAME_STARTED) {
        this.GAME_STARTED = true;
        this.startTimer();
      }
      let curr: string = x.target.value;
      if (x.keyCode == 32) {
        // SPACE
        // this.pDisabled = true;
        this.nextWord(x)
      } else if (x.keyCode === 8) {
        // BACKSPACE
        this.cursor_pos = curr.length;
        this.currWord.pword = curr;
        this.currWord.cursor = this.cursor_pos
      } else if (curr) {
        this.cursor_pos++;
        // this.currWord.checkLetters(curr);
        this.currWord.pword = curr;
        this.currWord.cursor = this.cursor_pos
      }
      // this.cd.markForCheck();

    } else {
      x.preventDefault();
    }

  } 

  nextWord(x: any): void {
    let curr = x.target.value;
    if (curr == this.currWord.value) {
      this.filtered_count++;
    }
    this.currWord.cursor = -1;
    this.curr_pos++;
    this.raw += this.currWord.pword + " ";
    this.currWord = this.boardWords.get(this.curr_pos);
    this.currWord.cursor = 0;
    this.used_words.push(this.currWord.word)


    x.target.value = '';
    this.cursor_pos = 0;
    console.log(this.raw);

    if (this.currWord.getYPos() > 0) {
      this.scroll_word = this.curr_pos;
    }
    // this.pDisabled = false;
  }

  startTimer(): void {
    if (!this.isFetching) 
    if (this.isPaused && this.GAME_STARTED) {
      this.isPaused = false;
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {  
          this.timeLeft--;
        } else {
          this.IN_GAME = false;
          this.isPaused = true;
          this.timeLeft = this.gameTime;
          this.pauseTimer();
          this.evalRun();
        }
      }, 1000);
    }
  }

  pauseTimer(): void {
    clearInterval(this.interval);
    this.isPaused = true;
  }

  async evalRun(): Promise<void> {
    let params = new HttpParams()
      .set('raw', this.raw)
      .set('words', this.used_words.join(' '))
      .set('time', this.gameTime);
    console.log(params)

    this.http.get<any>(this.eval_url, { params: params }).subscribe({
      next: data => {
        console.log(data)
        this.run_summary = data;
        this.runData.emit(this.run_summary);
      },
      error: err => {
        console.log(err)
      }
    })
  }

  async genWords(): Promise<void> {
    this.isFetching = true;

    // reset game params
    this.pauseTimer();
    this.word_queue = [];


    this.http.get<string[]>(this.word_url).subscribe({
      next: data => {
        this.word_queue = data
        this.isFetching = false;
        this.cd.detectChanges()
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
