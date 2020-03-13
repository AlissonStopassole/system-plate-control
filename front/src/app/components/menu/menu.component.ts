import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { EmitterComponentService } from 'src/app/services/emitter/emiter-component.service';

export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavItem[];
  click?: any;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit, OnDestroy {

  content;
  animate = false;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    public _afAuth: AngularFireAuth,
    private emitterComponentService: EmitterComponentService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.content = localStorage.getItem('tela') != 'null' ? Number(localStorage.getItem('tela')) : 0;

    this.emitterComponentService.evento.subscribe(data => {
      this.content = data;
    });
  }

  ngOnInit(): void {
  }

  menu: NavItem[] = [
    {
      displayName: 'Inicio',
      iconName: 'home',
      route: '/home',
      click: 0
    },
    {
      displayName: 'Cadastro',
      iconName: 'description',
      children: [
        {
          displayName: 'Estacionamento',
          iconName: 'place',
          route: 'parking',
          click: 1
        },
        {
          displayName: 'Veículos',
          iconName: 'time_to_leave',
          route: 'veicles',
          click: 2
        }
      ]
    }
  ];

  toggleAnimate() {
    this.animate = !this.animate;
  }

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  clickTela(content) {
    this.content = content;
    localStorage.setItem('tela', content);
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('tela');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    this._afAuth.auth.signOut().then(function () {
      console.log('Signed Out');
    }, function (error) {
      console.error('Sign Out Error', error);
    });
  }

}
