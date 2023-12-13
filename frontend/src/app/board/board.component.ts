import { Component, OnInit } from '@angular/core';
import { WordComponent } from '../word/word.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  letters!: NodeListOf<Element>; // size; 10x3
  cursor: any = '';
  cursor_pos: number = 0;
  word_queue: string[] = [];
  word_list: string[] = [    "cry",    "wicked",    "icy",    "ajar",    "ghost",    "unable",    "girls",    "expect",    "gather",    "narrow",    "mate",    "agonizing",    "somber",    "flowery",    "shiny",    "bike",    "shelter",    "straight",    "royal",    "nauseating",    "pipe",    "entertain",    "keen",    "thinkable",    "gifted",    "free",    "range",    "gusty",    "lacking",    "thundering",    "arch",    "scorch",    "spray",    "follow",    "rot",    "attract",    "womanly",    "agreement",    "barbarous",    "thaw",    "secret",    "boil",    "bleach",    "work",    "gray",    "digestion",    "thumb",    "eye",    "permissible",    "toad",    "lip",    "communicate",    "cloudy",    "poison",    "changeable",    "naive",    "loose",    "toys",    "nebulous",    "stroke",    "tasty",    "volleyball",    "unwritten",    "blind",    "hug",    "load",    "crabby",    "nifty",    "envious",    "bells",    "believe",    "notebook",    "liquid",    "bang",    "donkey",    "quack",    "cute",    "voyage",    "caption",    "stitch",    "year",    "car",    "profit",    "political",    "smash",    "curly",    "remarkable",    "consider",    "deafening",    "pancake",    "mom",    "raspy",    "meeting",    "expert",    "drip",    "ashamed",    "price",    "drain",    "vacuous",    "pathetic",    "fuel",    "page",    "tug",    "faded",    "messy",    "evanescent",    "outstanding",    "admit",    "kill",    "mysterious",    "selfish",    "smelly",    "squirrel",    "zealous",    "snakes",    "sea",    "orange",    "burly",    "macabre",    "aggressive",    "finger",    "insidious",    "trick",    "interest",    "distribution",    "scratch",    "acrid",    "stick",    "time",    "disgusted",    "whistle",    "earn",    "snow",    "soggy",    "add",    "vegetable",    "knotty",    "copper",    "hospital",    "drag",    "hands",    "simplistic",    "promise",    "scattered",    "noise",    "alive",    "develop",    "concentrate",    "x-ray",    "neat",    "smile",    "list",    "wash",    "snobbish",    "acceptable",    "horses",    "mellow",    "horrible",    "conscious",    "distinct",    "tasteful",    "confuse",    "ten",    "delight",    "sort",    "nose",    "ablaze",    "teeny-tiny",    "connect",    "stiff",    "windy",    "alike",    "need",    "muddle",    "extra-large",    "save",    "lowly",    "vein",    "ludicrous",    "seal",    "rain",    "capable",    "simple",    "tense",    "tumble",    "broad",    "ancient",    "spade",    "heavy",    "trip",    "bridge",    "dislike",    "willing",    "boundless",    "run",    "signal",    "breakable",    "deranged",    "dad",    "join"];

  // check
  IN_GAME: boolean = false;

  constructor() {}

  async ngOnInit() {
    this.word_queue = await this.genWords()
    this.letters = document.querySelectorAll('app-word span')
    // for (let i = 0; i < this.word_queue[0].length; i++) {
    //   console.log(this.word_queue[0][i])
    // }
    // this.newRun()
  }

  onKeyUp(x: any): void {
    if (this.IN_GAME) {
      console.log(x.target.value, this.cursor)
      if (x.target.value == this.cursor) {
        this.letters[this.cursor_pos].classList.add('letter-right')
        
      } else {
        this.letters[this.cursor_pos].classList.add('letter-wrong')
      }
      this.cursor_pos += 1
      this.cursor = this.letters[this.cursor_pos].textContent
    }
    
  }

  async newRun() {
    if (this.IN_GAME) {
      this.word_queue = await this.genWords()
      this.IN_GAME = false
    }
    console.log(this.word_queue)
    console.log(this.word_list)
    this.letters = document.querySelectorAll('app-word span')
    this.letters.forEach((curr) => {
      console.log(curr.textContent)
    })
    this.cursor = this.letters[0].textContent
    this.IN_GAME = true;
  }

  // fetchWords(): string[] {
  //   let temp: string[] = [];
  //   fs.readFile('words.txt', function (err: any, res: any) {
  //     temp = res.split()
  //   })
  //   return temp
  // }

  genWords(): string[] {
    let temp = this.word_list
    let currentIndex = temp.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [temp[currentIndex], temp[randomIndex]] = [
        temp[randomIndex], temp[currentIndex]];
    }

    this.word_queue = temp
    return temp
  }
}
