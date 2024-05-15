import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { GameComponent } from './game/game.component';
import { ResultComponent } from './result/result.component';
import { ActivateComponent } from './activate/activate.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'activation/:uid/:token', component: ActivateComponent},
    { path: 'user/:uid', component: ProfileComponent },
    // { path: 'result', component: ResultComponent},
    { path: '', component: GameComponent },
    { path: '**', component: PageNotFoundComponent},
];
