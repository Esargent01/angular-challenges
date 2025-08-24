import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Todo } from './models/todo.model';
import { AppStore } from './services/app.store';

@Component({
  imports: [MatProgressSpinnerModule],
  selector: 'app-root',
  template: `
    @if (loading()) {
      <mat-progress-spinner
        mode="indeterminate"
        diameter="50"></mat-progress-spinner>
    } @else {
      <div class="todo-list">
        @for (todo of todos(); track todo.id) {
          <div class="todo-item">
            <span class="todo-title">{{ todo.title }}</span>
            <button class="todo-button" (click)="updateTodo(todo)">
              Update
            </button>
            <button class="todo-button" (click)="deleteTodo(todo)">
              Delete
            </button>
          </div>
        }
      </div>
    }
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private appStore = inject(AppStore);
  todos = this.appStore.todos;
  loading = this.appStore.loading;

  ngOnInit(): void {
    this.appStore.getTodos();
  }

  updateTodo(todo: Todo) {
    this.appStore.updateTodos(todo);
  }

  deleteTodo(todo: Todo) {
    this.appStore.deleteTodos(todo);
  }
}
