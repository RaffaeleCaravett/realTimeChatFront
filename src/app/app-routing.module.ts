import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path:'',
     loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)
},
 {
  path:'home',
   loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)},
{
  path:'profilo/:id',
   loadChildren: () => import('./components/profile/profile.module').then(m => m.ProfileModule), canActivate:[AuthGuard]},
{
  path:'chat',
   loadChildren: () => import('./components/chat/chat.module').then(m => m.ChatModule),canActivate:[AuthGuard]},
{
  path:'**',
  component:NotFoundComponent
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
