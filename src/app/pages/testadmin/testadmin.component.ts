import { AfterViewInit, Component, OnInit, ViewEncapsulation, computed, effect, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonServiceService } from '../../service/common-service';

@Component({
  selector: 'app-testadmin',
  templateUrl: './testadmin.component.html',
  styleUrl: './testadmin.component.scss',
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class TestadminComponent implements OnInit {
  ngOnInit(): void {
    console.log('count', this.count());
  }
  constructor(private commonService: CommonServiceService, private trasnServ: TranslateService) {
    effect(() => {
      const items = this.todos().length;
      const even = items % 2 === 0
      console.warn(`Item are : ${even ? 'even' : 'odd'}`)
    })

    this.transaltioncore(['en', 'ar'], 'en')
  }


  count = signal<number>(0);
  todos = signal<any[]>([]);
  newtodos = signal<string>('');
  total = computed(() => this.todos().length);

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.newtodos.set(target?.value);
  }

  addtodo(): void {
    if (this.newtodos().trim().length > 0) {
      const newtodo = {
        id: Date.now(),
        text: this.newtodos(),
        done: false,
      }
      this.todos.set([...this.todos(), newtodo]);
      this.newtodos.set('');
    }
  }

  deleteTodo(id: number) {
    const updated = this.todos().filter((todo) => todo.id !== id);
    this.todos.set(updated)
  }

  //without signals
  testArray = [1, 2, 4, 5, 6, 7];
  length_testarray = this.testArray.length
  pushtest() {
    this.testArray.push(Date.now());
    console.log(this.testArray, this.length_testarray)
  }



  //with signals doing this

  signals_array = signal<number[]>([])
  siganal_array_total = computed(() => this.signals_array().length)
  signal_array() {
    this.signals_array.set([...this.signals_array(), Date.now()])
  }



  transaltioncore(supportlang: string[], defaultlang: string): void {
    this.trasnServ.addLangs(supportlang);
    this.trasnServ.setDefaultLang(defaultlang);
    const browserLangu: any = this.trasnServ.getBrowserLang();
    this.trasnServ.use(browserLangu)
  }


  selectln(data: any) {
    this.trasnServ.use(data.target.value)

  }

}
