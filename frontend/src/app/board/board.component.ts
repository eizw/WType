import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { WordComponent } from '../word/word.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
export class BoardComponent implements AfterViewInit {
  private word_url: string = 'http://localhost:8000/words'
  private eval_url: string = 'http://localhost:8000/run/eval?'

  // check
  isFetching: boolean = true;
  isPaused: boolean = true;
  IN_GAME: boolean = false;
  GAME_STARTED: boolean = false;


  @Input() gameTime: number = 15;

  cursor_pos: number = 0; // current letter index
  cursor_floor: number = 0; // lowest value for cursor_pos

  
  curr_pos: number = 0;
  curr_letters: string[] = [];
  currWord: any; // current word element
  extras!: string;
  @ViewChildren(WordComponent) boardWords!: QueryList<WordComponent>;
  @ViewChild('playerText') playerText!: any;
  //word_list: string[] = [    "cry",    "wicked",    "icy",    "ajar",    "ghost",    "unable",    "girls",    "expect",    "gather",    "narrow",    "mate",    "agonizing",    "somber",    "flowery",    "shiny",    "bike",    "shelter",    "straight",    "royal",    "nauseating",    "pipe",    "entertain",    "keen",    "thinkable",    "gifted",    "free",    "range",    "gusty",    "lacking",    "thundering",    "arch",    "scorch",    "spray",    "follow",    "rot",    "attract",    "womanly",    "agreement",    "barbarous",    "thaw",    "secret",    "boil",    "bleach",    "work",    "gray",    "digestion",    "thumb",    "eye",    "permissible",    "toad",    "lip",    "communicate",    "cloudy",    "poison",    "changeable",    "naive",    "loose",    "toys",    "nebulous",    "stroke",    "tasty",    "volleyball",    "unwritten",    "blind",    "hug",    "load",    "crabby",    "nifty",    "envious",    "bells",    "believe",    "notebook",    "liquid",    "bang",    "donkey",    "quack",    "cute",    "voyage",    "caption",    "stitch",    "year",    "car",    "profit",    "political",    "smash",    "curly",    "remarkable",    "consider",    "deafening",    "pancake",    "mom",    "raspy",    "meeting",    "expert",    "drip",    "ashamed",    "price",    "drain",    "vacuous",    "pathetic",    "fuel",    "page",    "tug",    "faded",    "messy",    "evanescent",    "outstanding",    "admit",    "kill",    "mysterious",    "selfish",    "smelly",    "squirrel",    "zealous",    "snakes",    "sea",    "orange",    "burly",    "macabre",    "aggressive",    "finger",    "insidious",    "trick",    "interest",    "distribution",    "scratch",    "acrid",    "stick",    "time",    "disgusted",    "whistle",    "earn",    "snow",    "soggy",    "add",    "vegetable",    "knotty",    "copper",    "hospital",    "drag",    "hands",    "simplistic",    "promise",    "scattered",    "noise",    "alive",    "develop",    "concentrate",    "x-ray",    "neat",    "smile",    "list",    "wash",    "snobbish",    "acceptable",    "horses",    "mellow",    "horrible",    "conscious",    "distinct",    "tasteful",    "confuse",    "ten",    "delight",    "sort",    "nose",    "ablaze",    "teeny-tiny",    "connect",    "stiff",    "windy",    "alike",    "need",    "muddle",    "extra-large",    "save",    "lowly",    "vein",    "ludicrous",    "seal",    "rain",    "capable",    "simple",    "tense",    "tumble",    "broad",    "ancient",    "spade",    "heavy",    "trip",    "bridge",    "dislike",    "willing",    "boundless",    "run",    "signal",    "breakable",    "deranged",    "dad",    "join"];

  timeLeft: number = this.gameTime;
  interval: any;

  timer!: any;
  player_text!: any;

  //! analysis
  raw!: string; // raw text
  filtered_count!: number; // amount of correct words
  word_queue: string[] = [];

  constructor(private cd: ChangeDetectorRef, private http: HttpClient) {}


  async ngAfterViewInit() {
    
    await this.genWords();
    console.log(this.word_queue)
    this.boardWords.changes.subscribe(res => {
      this.boardRendered();
    })

    this.cd.detectChanges();
  }

  boardRendered() {
    if (!this.isFetching) {
      this.currWord = this.boardWords.get(this.curr_pos);
      console.log('letter added cuh');
      this.newRun();
    }
  }

  newRun(): void {
    this.cursor_pos = 0;
    this.currWord = this.boardWords.get(this.curr_pos);
    this.currWord.changeCursor(0);
    this.playerText.nativeElement.focus()
  }

  startGame(): void {
    if (this.IN_GAME) {
      if (this.isPaused)
        this.startTimer();
    } else {
      this.currWord.changeCursor(0);
      this.isPaused = true;
      this.IN_GAME = true;
    }
  }

  onKeyUp(x: any): void {
    if (this.IN_GAME) {
      if (this.isPaused)
        this.startTimer();
      let curr: string = x.target.value;
      console.log(curr)
      if (x.keyCode == 32) {
        // SPACE
        this.nextWord(x.target, curr);
      } else if (x.keyCode === 8) {
        // BACKSPACE
        this.cursor_pos = curr.length;
        this.currWord.backspace(this.cursor_pos)
      } else if (curr) {
        this.cursor_pos++;
        this.currWord.checkLetters(curr);
        this.currWord.changeCursor(this.cursor_pos)
      }
      this.cd.markForCheck();
    }
  }

  nextWord(x: any, curr: string): void {
    if (curr == this.currWord.value) {
      this.filtered_count++;
    }
    this.currWord.changeCursor(-1);
    this.raw += curr + " ";
    x.value = '';
    this.cursor_pos = 0;
    this.curr_pos++;
    this.currWord = this.boardWords.get(this.curr_pos);
    this.currWord.changeCursor(0);
  }

  startTimer(): void {
    console.log(this.isPaused, this.IN_GAME)
    if (this.isPaused && this.IN_GAME) {
      this.isPaused = false;
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {  
          this.timeLeft--;
        } else {
          this.IN_GAME = false;
          this.isPaused = true;
          this.timeLeft = this.gameTime;
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
    await fetch(this.eval_url + new URLSearchParams({
      raw: this.raw,
      fcount: this.filtered_count.toString(),
      time: this.gameTime.toString(),
    }))
      .then(res => res.json())
      .then(console.log)
  }

  async genWords(): Promise<void> {
    await this.http.get<string[]>(this.word_url).subscribe({
      next: data => {
        this.word_queue = data
        this.isFetching = false;
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
