import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { WordComponent } from '../word/word.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import internal from 'stream';
@Component({
  selector: 'app-board',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, 
    WordComponent
  ],
  templateUrl: `./board.component.html`,
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  private word_url: string = 'http://localhost:8000/words'

  // check
  isFetching: boolean = true;
  IN_GAME: boolean = false;

  letterSpan!: NodeListOf<Element>; // size; 10x3
  cursor: any; // current letter
  curr_word: number = 0; // current word index
  cursor_pos: number = 0; // current letter index
  cursor_floor: number = 0; // lowest value for cursor_pos

  raw: string = '';
  word_queue: string[] = [];
  temp_word_queue: string[] = [];
  letters: string[] = [];
  @ViewChildren('boardWords') boardWords!: QueryList<any>;
  //word_list: string[] = [    "cry",    "wicked",    "icy",    "ajar",    "ghost",    "unable",    "girls",    "expect",    "gather",    "narrow",    "mate",    "agonizing",    "somber",    "flowery",    "shiny",    "bike",    "shelter",    "straight",    "royal",    "nauseating",    "pipe",    "entertain",    "keen",    "thinkable",    "gifted",    "free",    "range",    "gusty",    "lacking",    "thundering",    "arch",    "scorch",    "spray",    "follow",    "rot",    "attract",    "womanly",    "agreement",    "barbarous",    "thaw",    "secret",    "boil",    "bleach",    "work",    "gray",    "digestion",    "thumb",    "eye",    "permissible",    "toad",    "lip",    "communicate",    "cloudy",    "poison",    "changeable",    "naive",    "loose",    "toys",    "nebulous",    "stroke",    "tasty",    "volleyball",    "unwritten",    "blind",    "hug",    "load",    "crabby",    "nifty",    "envious",    "bells",    "believe",    "notebook",    "liquid",    "bang",    "donkey",    "quack",    "cute",    "voyage",    "caption",    "stitch",    "year",    "car",    "profit",    "political",    "smash",    "curly",    "remarkable",    "consider",    "deafening",    "pancake",    "mom",    "raspy",    "meeting",    "expert",    "drip",    "ashamed",    "price",    "drain",    "vacuous",    "pathetic",    "fuel",    "page",    "tug",    "faded",    "messy",    "evanescent",    "outstanding",    "admit",    "kill",    "mysterious",    "selfish",    "smelly",    "squirrel",    "zealous",    "snakes",    "sea",    "orange",    "burly",    "macabre",    "aggressive",    "finger",    "insidious",    "trick",    "interest",    "distribution",    "scratch",    "acrid",    "stick",    "time",    "disgusted",    "whistle",    "earn",    "snow",    "soggy",    "add",    "vegetable",    "knotty",    "copper",    "hospital",    "drag",    "hands",    "simplistic",    "promise",    "scattered",    "noise",    "alive",    "develop",    "concentrate",    "x-ray",    "neat",    "smile",    "list",    "wash",    "snobbish",    "acceptable",    "horses",    "mellow",    "horrible",    "conscious",    "distinct",    "tasteful",    "confuse",    "ten",    "delight",    "sort",    "nose",    "ablaze",    "teeny-tiny",    "connect",    "stiff",    "windy",    "alike",    "need",    "muddle",    "extra-large",    "save",    "lowly",    "vein",    "ludicrous",    "seal",    "rain",    "capable",    "simple",    "tense",    "tumble",    "broad",    "ancient",    "spade",    "heavy",    "trip",    "bridge",    "dislike",    "willing",    "boundless",    "run",    "signal",    "breakable",    "deranged",    "dad",    "join"];

  constructor() {}

  async ngOnInit() {
    this.newRun()
    // for (let i = 0; i < this.word_queue[0].length; i++) {
    //   console.log(this.word_queue[0][i])
    // }
    // this.newRun()
  }

  ngAfterViewInit() {
    this.boardWords.changes.subscribe(res => {
      this.boardRendered();
    })
  }

  boardRendered() {
    if (!this.isFetching) {
      this.letterSpan = document.querySelectorAll('div.word span')
      this.letterSpan.forEach((letter) => {
        this.letters.push(letter.textContent || '')
      })
      this.letterSpan[0].id = 'cursor';
    }
  }

  onKeyUp(x: any): void {
    if (this.IN_GAME) {
      let curr: string = x.target.value;
      console.log(this.cursor_pos + "|" + this.curr_word + "|" + this.cursor_floor)
      console.log(curr, x.keyCode)
      // SPACE
      if (x.keyCode == 32) {
        this.letterSpan[this.cursor_pos].id = '';
        this.raw += curr + " ";
        x.target.value = "";
        let temp: number = (this.temp_word_queue.shift() || '').length || 0;
        for (let i = temp; i < this.cursor_pos; i++) {
          this.letterSpan[this.cursor_floor + i].classList.remove('letter-right')
          this.letterSpan[this.cursor_floor + i].classList.remove('letter-wrong')
        }
        console.log('temp : ' + temp)
        for (let i = 0; i < temp; i++) {
          this.letters.shift();
        }
        this.cursor_floor += temp;
        this.cursor_pos = this.cursor_floor;
        this.curr_word++;
      } else if (x.keyCode === 8) {
        // BACKSPACE
        if (this.cursor_pos > this.cursor_floor) {
          let d = 1
          for (let i = this.cursor_pos - 1; i >= this.cursor_floor + curr.length; i--) {
            this.cursor_pos--;
            this.letterSpan[i].classList.remove('letter-right')
            this.letterSpan[i].classList.remove('letter-wrong')
          }
          this.refreshCursor(d);

        }
      } else if (curr) {
        // letterSpan
        // let currKey: number = x.keyCode + 32
        // console.log(currKey + "|" + this.cursor)
        // if (currKey == this.cursor.charCodeAt(0)) {
        //   this.letterSpan[this.cursor_pos].classList.add('letter-right')
        // } else {
        //   this.letterSpan[this.cursor_pos].classList.add('letter-wrong')
        // }
        // this.cursor_pos++
        // this.refreshCursor()

        this.cursor_pos++;
        this.refreshCursor(-1);
        this.checkLetters(curr);
      }
    } else {
      this.newRun()
    }
  }

  refreshCursor(d: number): void {
    this.letterSpan[this.cursor_pos + d].id = '';
    this.letterSpan[this.cursor_pos].id = 'cursor';
  }

  checkLetters(word: string): void {
    for (let i = 0; i < this.cursor_pos - this.cursor_floor; i++) {
      let temp: number = this.cursor_floor + i;
      if (this.letters[i] == word[i]) {
        this.letterSpan[temp].classList.add('letter-right')
      } else {
        this.letterSpan[temp].classList.add('letter-wrong')
      }
    }
  }

  async newRun(): Promise<void> {
    if (this.IN_GAME) {
      this.cursor = this.letterSpan[0].textContent
      this.IN_GAME = false;
    } else {
      await this.genWords()
      this.IN_GAME = true
    }
  }

  // fetchWords(): string[] {
  //   let temp: string[] = [];
  //   fs.readFile('words.txt', function (err: any, res: any) {
  //     temp = res.split()
  //   })
  //   return temp
  // }

  genWords(): void {
    fetch(this.word_url)
      .then((res) => res.json())
      .then((word_data) => {
        this.word_queue = word_data
        this.temp_word_queue = [...this.word_queue]
        this.isFetching = false;
      })
      .catch((err) => console.log(err))
  }

  // genWords(): string[] {
  //   let temp = this.word_list
  //   let currentIndex = temp.length, randomIndex;

  //   // While there remain elements to shuffle.
  //   while (currentIndex > 0) {

  //     // Pick a remaining element.
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex--;

  //     // And swap it with the current element.
  //     [temp[currentIndex], temp[randomIndex]] = [
  //       temp[randomIndex], temp[currentIndex]];
  //   }

  //   this.word_queue = temp
  //   return temp
  // }
}
