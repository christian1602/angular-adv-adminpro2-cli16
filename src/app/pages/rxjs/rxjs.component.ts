import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

  public intervalSubs: Subscription;

  constructor() {
    // this.retornaObservable().pipe(
    //   retry(1)
    // )
    // .subscribe(
    //   valor => console.log('Subs:', valor),
    //   error => console.warn('Error:',error),
    //   () => console.info('Obs terminado')
    // );

    this.intervalSubs = this.retornaIntervalo()
      .subscribe(
        valor => console.log(valor)
      );
  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number>{
    // return interval(1000)
    //         .pipe(
    //           take(4),
    //           map(valor => valor + 1)
    //         );
    
    return interval(500)
            .pipe(              
              map(valor => valor + 1), // 0 => 1
              filter(valor => (valor % 2 === 0) ? true : false),
              // take(10)
            );
  }

  retornaObservable(): Observable<number>{
    return new Observable<number>( observer => {
      let i = -1;

      const intervalo = setInterval(()=> {
        i++;        
        observer.next(i);

        if (i === 4){          
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2){
          observer.error('i llegó al valor de 2');
          clearInterval(intervalo);
        }
      },1000);
    });    
  }

}