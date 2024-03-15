import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { WordComponent } from '../word/word.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import internal from 'stream';
import { interval } from 'rxjs';
import { timeStamp } from 'console';
import { start } from 'repl';
@Component({
  selector: 'app-board',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, 
    WordComponent
  ],templateUrl: `./board.component.html`,
  styleUrl: './board.component.css'
})
export class BoardComponent implements AfterViewInit {
  private word_url: string = 'http://localhost:8000/words'

  // check
  isFetching: boolean = true;
  isPaused: boolean = true;
  IN_GAME: boolean = false;
  GAME_STARTED: boolean = false;

  cursor: any; // current letter
  cursor_pos: number = 0; // current letter index
  cursor_floor: number = 0; // lowest value for cursor_pos

  raw: string = '';
  word_queue: string[] = [];
  temp_word_queue: string[] = [];
  
  curr_pos: number = 0;
  curr_letters: string[] = [];
  currWord: any; // current word element
  extras!: string;
  @ViewChildren(WordComponent) boardWords!: QueryList<WordComponent>;
  //word_list: string[] = [    "cry",    "wicked",    "icy",    "ajar",    "ghost",    "unable",    "girls",    "expect",    "gather",    "narrow",    "mate",    "agonizing",    "somber",    "flowery",    "shiny",    "bike",    "shelter",    "straight",    "royal",    "nauseating",    "pipe",    "entertain",    "keen",    "thinkable",    "gifted",    "free",    "range",    "gusty",    "lacking",    "thundering",    "arch",    "scorch",    "spray",    "follow",    "rot",    "attract",    "womanly",    "agreement",    "barbarous",    "thaw",    "secret",    "boil",    "bleach",    "work",    "gray",    "digestion",    "thumb",    "eye",    "permissible",    "toad",    "lip",    "communicate",    "cloudy",    "poison",    "changeable",    "naive",    "loose",    "toys",    "nebulous",    "stroke",    "tasty",    "volleyball",    "unwritten",    "blind",    "hug",    "load",    "crabby",    "nifty",    "envious",    "bells",    "believe",    "notebook",    "liquid",    "bang",    "donkey",    "quack",    "cute",    "voyage",    "caption",    "stitch",    "year",    "car",    "profit",    "political",    "smash",    "curly",    "remarkable",    "consider",    "deafening",    "pancake",    "mom",    "raspy",    "meeting",    "expert",    "drip",    "ashamed",    "price",    "drain",    "vacuous",    "pathetic",    "fuel",    "page",    "tug",    "faded",    "messy",    "evanescent",    "outstanding",    "admit",    "kill",    "mysterious",    "selfish",    "smelly",    "squirrel",    "zealous",    "snakes",    "sea",    "orange",    "burly",    "macabre",    "aggressive",    "finger",    "insidious",    "trick",    "interest",    "distribution",    "scratch",    "acrid",    "stick",    "time",    "disgusted",    "whistle",    "earn",    "snow",    "soggy",    "add",    "vegetable",    "knotty",    "copper",    "hospital",    "drag",    "hands",    "simplistic",    "promise",    "scattered",    "noise",    "alive",    "develop",    "concentrate",    "x-ray",    "neat",    "smile",    "list",    "wash",    "snobbish",    "acceptable",    "horses",    "mellow",    "horrible",    "conscious",    "distinct",    "tasteful",    "confuse",    "ten",    "delight",    "sort",    "nose",    "ablaze",    "teeny-tiny",    "connect",    "stiff",    "windy",    "alike",    "need",    "muddle",    "extra-large",    "save",    "lowly",    "vein",    "ludicrous",    "seal",    "rain",    "capable",    "simple",    "tense",    "tumble",    "broad",    "ancient",    "spade",    "heavy",    "trip",    "bridge",    "dislike",    "willing",    "boundless",    "run",    "signal",    "breakable",    "deranged",    "dad",    "join"];

  gameTime: number = 15;
  timeLeft: number = this.gameTime;
  interval: any;

  timer!: any;
  player_text!: any;

  constructor(private cd: ChangeDetectorRef) {}


  async ngAfterViewInit() {
    
    await this.genWords();
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
  }

  startGame(): void {
    if (this.IN_GAME) {
      if (this.isPaused)
        this.startTimer();
    } else {
      this.currWord.changeCursor(0);
      console.log('game starts')
      this.isPaused = false;
      this.IN_GAME = true;
    }
  }

  onKeyUp(x: any): void {
    if (!this.GAME_STARTED)
      this.startTimer();
    if (this.IN_GAME) {
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
    this.currWord.changeCursor(-1);
    this.raw += curr + " ";
    x.value = '';
    this.cursor_pos = 0;
    this.curr_pos++;
    this.currWord = this.boardWords.get(this.curr_pos);
    this.currWord.changeCursor(0);
  }

  startTimer(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.interval = setInterval(() => {
        if (this.gameTime > 0) {  
          this.gameTime--;
        } else {
          this.IN_GAME = false;
          this.gameTime = 60;
        }
      }, 1000);
    }
  }

  pauseTimer(): void {
    clearInterval(this.interval);
    this.isPaused = true;
  }

  async genWords(): Promise<void> {
    await fetch(this.word_url)
      .then((res) => res.json())
      .then((word_data) => {
        this.word_queue = word_data
        this.temp_word_queue = [...this.word_queue]
        this.isFetching = false;
      })
      .catch((err) => console.log(err))
  }
}
